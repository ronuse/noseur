
import "./Overlay.css";
import React from 'react';
import { Portal } from "./Portal";
import ReactDOM from "react-dom/client";
import { DOMHelper } from "../utils/DOMUtils";
import { Classname } from "../utils/Classname";
import { Message, MessageManageRef, MessageProps } from "./Message";
import { TypeChecker } from "../utils/TypeChecker";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Alignment, Position } from "../constants/Alignment";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurObject, NoseurRawElement } from "../constants/Types";
import { Orientation } from "../constants/Orientation";

enum ToastType {
    TOAST = "toast",
    MESSAGES = "messages",
}

export type ToastMessageEventHandler = (message?: Partial<MessageProps>, key?: string) => void;

export type ToastAttributtesRelays = {

}

export interface ToastManageRef {
    clear: () => void;
    reverse: () => void;
    changeLimit: (limit: number) => void;
    remove: (key: string | string[]) => void;
    changePosition: (position: Alignment) => void;
    changeOrientation: (orientation: Orientation) => void;
    show: (message: Partial<MessageProps> | Partial<MessageProps>[], key?: string | string[]) => void;
    swap: (key: string | string[], message: Partial<MessageProps> | Partial<MessageProps>[], borrowLifetime?: boolean) => void;
}

export interface ToastProps extends ComponentBaseProps<HTMLDivElement, ToastManageRef, ToastAttributtesRelays> {
    limit: number;
    reverse: boolean;
    position: Alignment;
    orientation: Orientation;
    container: NoseurRawElement;

    onAction: ToastMessageEventHandler;
    onRemove: ToastMessageEventHandler;

    __type__: ToastType;
}

interface ToastState {
    reverse: boolean;
    position: Alignment;
    breadsLimit: number;
    orientation: Orientation;
    breads: NoseurObject<NoseurObject<Partial<MessageProps>>>;
}

class ToastComponent extends React.Component<ToastProps, ToastState> {

    public static defaultProps: Partial<ToastProps> = {
        reverse: false,
        position: Position.TOP_RIGHT,
    };

    state: ToastState = {
        breads: {},
        reverse: this.props.reverse,
        position: this.props.position,
        breadsLimit: this.props.limit,
        orientation: this.props.orientation,
    };

    positionElementsMap: NoseurObject<ReactDOM.Root> = {};

    constructor(props: ToastProps) {
        super(props);

        this.showMessage = this.showMessage.bind(this);
        this.clearMessages = this.clearMessages.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            show: this.showMessage,
            clear: this.clearMessages,
            reverse: () => this.setState({ reverse: !this.state.reverse }),
            changePosition: (position: Alignment) => this.setState({ position }),
            changeLimit: (limit: number) => this.setState({ breadsLimit: limit }),
            changeOrientation: (orientation: Orientation) => this.setState({ orientation }),
            remove: (key: string | string[]) => {
                console.log("REMOVE - KEY---", key);
            },
            swap: (key: string | string[], message: Partial<MessageProps> | Partial<MessageProps>[], borrowLifetime?: boolean) => {
                console.log("KEY---", key, message, borrowLifetime);
            },
        });
    }


    showMessage(message: Partial<MessageProps> | Partial<MessageProps>[], key?: string | string[]) {
        let keys = (key && key instanceof Array) ? key : (key ? [key] : []);
        const breads = message instanceof Array ? message : (message ? [message] : []);
        if (keys.length && keys.length != breads.length) {
            throw new Error("The toast keys count must match the count of the messages");
        }
        const position = this.state.position;
        const newBreads: NoseurObject<NoseurObject<Partial<MessageProps>>> = { ...this.state.breads };
        if (!keys.length) keys = breads.map((message) => ((message.key as string) ?? DOMHelper.uniqueElementId("msg_")));
        const positionBreads = breads.reduce((acc: NoseurObject<Partial<MessageProps>>, bread: Partial<MessageProps>, index: number) => {
            bread.key = keys[index] as string;
            acc[bread.key] = bread;
            return acc;
        }, {});
        newBreads[position] = {
            ...this.state.breads[position],
            ...positionBreads,
        };
        this.setState({ breads: newBreads }, () => this.renderMessages(position));
    }

    clearMessages() {
        Object.keys(this.state.breads).forEach(key => {
            const positionBreads = this.state.breads[key];
            Object.keys(positionBreads).forEach(skey => {
                if (!(positionBreads[skey] as any).__manage_ref__) {
                    console.warn("noseur - toast/messages: gabbage collection failed, likely to leak memory, ", skey);
                    return;
                }
                (positionBreads[skey] as any).__manage_ref__.close();
            });
        });
    }

    renderMessage(position: Alignment, positionBreads: NoseurObject<Partial<MessageProps>>, key: string) {
        const message = positionBreads[key];
        const cachedOnAction = message?.onAction;
        const cachedOnExitDOM = message?.onExitDOM;
        const cachedManageRef = message?.manageRef;
        return React.createElement(Message, ({
            ...message,
            manageRef: (r: MessageManageRef | null) => {
                if (r && cachedManageRef) ObjectHelper.resolveRef(cachedManageRef, r);
                (message as any).__manage_ref__ = r;
            },
            onAction: () => {
                if (cachedOnAction) cachedOnAction();
                this.props.onAction && this.props.onAction(message, key);
            },
            onExitDOM: () => {
                delete positionBreads[key];
                const breads = this.state.breads;
                breads[position] = positionBreads;
                if (cachedOnExitDOM) cachedOnExitDOM();
                this.props.onRemove && this.props.onRemove(message, key);
                this.setState({ breads }, () => {
                    if (!(position in this.state.breads)) return;
                    const positionBreads = this.state.breads[position] || {};
                    if (Object.keys(positionBreads).length) {
                        this.renderMessages(position);
                        return;
                    }
                    delete breads[position];
                    this.setState({ breads }, () => {
                        if (position in this.positionElementsMap) {
                            delete this.positionElementsMap[position];
                        }
                    });
                });
            }
        }));
    }

    renderMessages(position: Alignment) {
        const root = this.positionElementsMap[position];
        const positionBreads = this.state.breads[position];

        if (!root) return;
        let keys = Object.keys(positionBreads);
        if (TypeChecker.isNumber(this.state.breadsLimit) && this.state.breadsLimit) keys = keys.slice(0, this.state.breadsLimit);
        const messages = keys.map((key) => this.renderMessage(position, positionBreads, key));
        root.render(this.state.reverse ? messages.reverse() : messages);
    }

    buildPositionRoot(position: Alignment) {
        const style: any = {};

        if (this.state.orientation === Orientation.HORIZONTAL) {
            style["flexDirection"] = "row";
            if (position === Alignment.TOP || position === Alignment.BOTTOM || position.includes("center")) {
                style["--messageMarginLeft"] = "0.25em";
                style["--messageMarginRight"] = "0.25em";
            } else if (position.includes("left")) {
                style["--messageMarginRight"] = "0.5em";
            } else if (position.includes("right")) {
                style["--messageMarginLeft"] = "0.5em";
            }
        } else {
            if (position.includes("top")) {
                style["--messageMarginBottom"] = "0.5em";
            } else if (position.includes("bottom")) {
                style["--messageMarginTop"] = "0.5em";
            } else if (position === Alignment.LEFT || position === Alignment.RIGHT || position.includes("center")) {
                style["--messageMarginTop"] = "0.25em";
                style["--messageMarginBottom"] = "0.25em";
            }
        }

        return (<div key={position} className={`noseur-${this.props.__type__}-${position}`} style={style} ref={(r: any) => {
            if (!(position in this.positionElementsMap)) {
                this.positionElementsMap[position] = ReactDOM.createRoot(r);
                this.renderMessages(position);
            }
        }}></div>);
    }

    render() {
        const breadsKeys = Object.keys(this.state.breads);
        if (!breadsKeys.length && this.props.__type__ === ToastType.TOAST) return null;

        const className = Classname.build(`noseur-${this.props.__type__}`, this.props.className);
        const positionElements = breadsKeys.map((position) => this.buildPositionRoot(position as Alignment));

        const content = (<div ref={this.props.forwardRef} className={className} id={this.props.id} style={this.props.style} >
            {positionElements}
        </div>);
        return (!this.props.container ? content : <Portal children={content} container={this.props.container} visible={true} />);
    }

}

export type MessagesProps = ToastProps;
export type MessagesManageRef = ToastManageRef;

export const Toast = React.forwardRef<HTMLDivElement, Partial<ToastProps>>((props, ref) => (
    <ToastComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} __type__={ToastType.TOAST} container={document.body} />
));

export const Messages = React.forwardRef<HTMLDivElement, Partial<MessagesProps>>((props, ref) => (
    <ToastComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} __type__={ToastType.MESSAGES} />
));


