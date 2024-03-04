
import "./Overlay.css";
import React from 'react';
import { Portal } from "./Portal";
import ReactDOM from "react-dom/client";
import { DOMHelper } from "../utils/DOMUtils";
import { Classname } from "../utils/Classname";
import { TypeChecker } from "../utils/TypeChecker";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Orientation } from "../constants/Orientation";
import { Alignment, Position } from "../constants/Alignment";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurObject, NoseurRawElement } from "../constants/Types";
import { Message, MessageManageRef, MessageProps } from "./Message";

enum ToastType {
    TOAST = "toast",
    TOASTER = "toaster",
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

    synchronizationIndex = 0;
    positionElementsMap: NoseurObject<ReactDOM.Root> = {};
    synchronizer: NoseurObject<Function> = {}; // to ensure messages are shown regardless of react setState asyncronous property

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


    showMessage(message: Partial<MessageProps> | Partial<MessageProps>[], key?: string | string[], synchronizationKey_?: string) {

        // start synchronization
        const synchronizerKeys = Object.keys(this.synchronizer);
        const synchronizationKey = `${synchronizationKey_ ?? this.synchronizationIndex++}`;
        if (!synchronizerKeys.includes(synchronizationKey) && synchronizerKeys.length) {
            this.synchronizer[synchronizationKey] = () => this.showMessage(message, key, synchronizationKey);
            return;
        }
        // end synchronization

        const stateBreads = ObjectHelper.clone(this.state.breads);
        let keys = (key && key instanceof Array) ? key : (key ? [key] : []);
        const breads = message instanceof Array ? message : (message ? [message] : []);
        if (keys.length && keys.length != breads.length) {
            throw new Error("The toast keys count must match the count of the messages");
        }
        const position = this.state.position;
        const newBreads: NoseurObject<NoseurObject<Partial<MessageProps>>> = { ...stateBreads };
        if (!keys.length) keys = breads.map((message) => ((message.key as string) ?? DOMHelper.uniqueElementId("msg_")));
        const positionBreads = breads.reduce((acc: NoseurObject<Partial<MessageProps>>, bread: Partial<MessageProps>, index: number) => {
            bread.key = keys[index] as string;
            acc[bread.key] = bread;
            return acc;
        }, {});
        newBreads[position] = {
            ...stateBreads[position],
            ...positionBreads,
        };
        this.synchronizer[synchronizationKey] = () => delete this.synchronizer[synchronizationKey];
        this.setState({ breads: newBreads }, () => {
            const desyncFun = (synchronizationKey && synchronizationKey in this.synchronizer) ? this.synchronizer[synchronizationKey] : undefined;
            desyncFun && desyncFun();
            const synchronizerKeys = Object.keys(this.synchronizer);
            if (synchronizerKeys.length) {
                const nextFire = this.synchronizer[synchronizerKeys[0]];
                nextFire();
            } else {
                this.synchronizationIndex = 0;
            }
            this.renderMessages(position, this.state.breads[position]);
        });
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
                        this.renderMessages(position, positionBreads);
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

    renderMessages(position: Alignment, positionBreads: NoseurObject<Partial<MessageProps>>) {
        const root = this.positionElementsMap[position];

        if (!root) return;
        let keys = Object.keys(positionBreads);
        if (TypeChecker.isNumber(this.state.breadsLimit) && this.state.breadsLimit) keys = keys.slice(0, this.state.breadsLimit);
        const messages = keys.map((key) => this.renderMessage(position, positionBreads, key));
        root.render(this.state.reverse ? messages.reverse() : messages);
    }

    buildPositionRoot(type: ToastType, position: Alignment) {
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

        return (<div key={position} className={`noseur-${type}-${position}`} style={style} ref={(r: any) => {
            if (!(position in this.positionElementsMap)) {
                this.positionElementsMap[position] = ReactDOM.createRoot(r);
                this.renderMessages(position, this.state.breads[position]);
            }
        }}></div>);
    }

    render() {
        const breadsKeys = Object.keys(this.state.breads);
        if (!breadsKeys.length && this.props.__type__ === ToastType.TOAST) return null;
        const type = (this.props.__type__ === ToastType.TOASTER) ? ToastType.TOAST : this.props.__type__;

        const className = Classname.build(`noseur-${type}`, this.props.className);
        const positionElements = breadsKeys.map((position) => this.buildPositionRoot(type, position as Alignment));

        const content = (<div ref={this.props.forwardRef} className={className} id={this.props.id} style={this.props.style} >
            {positionElements}
        </div>);
        return (!this.props.container ? content : <Portal children={content} container={this.props.container} visible={true} />);
    }

}

interface ToasterInterfaceRelay {
    destroy: () => void;
    init: (props: Partial<ToastProps>, ref?: any) => void;
    toast: (message: Partial<MessageProps> | Partial<MessageProps>[], key?: string | string[]) => void;
};

export type ToasterInterface = ToasterInterfaceRelay & ToastManageRef;

export type MessagesProps = ToastProps;
export type MessagesManageRef = ToastManageRef;

export const Toast = React.forwardRef<HTMLDivElement, Partial<ToastProps>>((props, ref) => (
    <ToastComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} __type__={ToastType.TOAST} container={document.body} />
));

export const Messages = React.forwardRef<HTMLDivElement, Partial<MessagesProps>>((props, ref) => (
    <ToastComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} __type__={ToastType.MESSAGES} />
));

let noseurInternalGlobalToasterRoot: ReactDOM.Root | null;
let noseurInternalGlobalToasterManageRef: ToastManageRef | null;
let noseurInternalGlobalToasterCallStack: (() => void)[] | null = [];

export const Toaster: ToasterInterface = {
    init: (props: Partial<ToastProps>, onMount?: () => void, ref?: any) => {
        if (noseurInternalGlobalToasterRoot) {
            if (!noseurInternalGlobalToasterManageRef && onMount){
                (noseurInternalGlobalToasterCallStack as any).push(onMount);
            }
            return;
        }
        const ___noseur_toaster___ = React.createElement(ToastComponent, {
            ...(props as any),
            container: document.body,
            __type__: ToastType.TOASTER,
            forwardRef: ref ?? props.forwardRef,
            manageRef: (r) => {
                noseurInternalGlobalToasterManageRef = r;
                onMount && onMount();
                for (const fun of (noseurInternalGlobalToasterCallStack ?? [])) {
                    fun();
                }
                noseurInternalGlobalToasterCallStack = null;
            },
        });
        const wrapper = document.createDocumentFragment();
        DOMHelper.appendChild(wrapper, document.body);
        noseurInternalGlobalToasterRoot = ReactDOM.createRoot(wrapper)
        noseurInternalGlobalToasterRoot.render(___noseur_toaster___);
    },
    destroy: () => {
        if (!noseurInternalGlobalToasterRoot) return;
        noseurInternalGlobalToasterRoot.unmount();
        noseurInternalGlobalToasterRoot = null;
    },
    toast: (message: Partial<MessageProps> | Partial<MessageProps>[], key?: string | string[]) => {
        Toaster.show(message, key);
    },
    clear: () => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) Toaster.init({});
        noseurInternalGlobalToasterManageRef?.clear();
    },
    reverse: () => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) {
            Toaster.init({}, Toaster.reverse());
        }
        noseurInternalGlobalToasterManageRef?.reverse();
    },
    changeLimit: (limit: number) => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) {
            return Toaster.init({}, Toaster.changeLimit(limit));
        }
        noseurInternalGlobalToasterManageRef?.changeLimit(limit);
    },
    remove: (key: string | string[]) => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) Toaster.init({});
        noseurInternalGlobalToasterManageRef?.remove(key);
    },
    changePosition: (position: Alignment) => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) {
            return Toaster.init({}, Toaster.changePosition(position));
        }
        noseurInternalGlobalToasterManageRef?.changePosition(position);
    },
    changeOrientation: (orientation: Orientation) => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) {
            return Toaster.init({}, Toaster.changeOrientation(orientation));
        }
        noseurInternalGlobalToasterManageRef?.changeOrientation(orientation);
    },
    show: (message: Partial<MessageProps> | Partial<MessageProps>[], key?: string | string[]) => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) {
            return Toaster.init({}, () => Toaster.show(message, key));
        }
        noseurInternalGlobalToasterManageRef?.show(message);
    },
    swap: (key: string | string[], message: Partial<MessageProps> | Partial<MessageProps>[], borrowLifetime?: boolean) => {
        if (!noseurInternalGlobalToasterRoot || !noseurInternalGlobalToasterManageRef) {
            return Toaster.init({}, () => Toaster.swap(key, message, borrowLifetime));
        }
        noseurInternalGlobalToasterManageRef?.swap(key, message, borrowLifetime);
    },
};

