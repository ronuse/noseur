
import "./Overlay.css";
import { Portal } from "./Portal";
import { Timer } from "../utils/Timer";
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import React, { MouseEventHandler } from 'react';
import { Alignment } from "../constants/Alignment";
import { MicroBuilder } from "../utils/MicroBuilder";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Transition } from "../constants/Transition";
import { CSSTransition } from 'react-transition-group';
import { NoseurElement, NoseurIconElement, NoseurRawElement } from "../constants/Types";
import { ProgressBar, ProgressBarManageRef, ProgressBarProps } from "../misc/ProgressBar";
import { ComponentBaseProps, ComponentElementBasicAttributes, TransitionProps } from "../core/ComponentBaseProps";

export type MessageEventHandler = () => void;
export type MessageContentHandler = (attr?: ComponentElementBasicAttributes) => NoseurElement;

export type MessageAttributtesRelays = {
    progressBar: Partial<ProgressBarProps>;
    content?: ComponentElementBasicAttributes;
    closeIcon?: ComponentElementBasicAttributes;
}

export interface MessageManageRef {
    close: () => void;
    update: (messageProps: Partial<MessageProps>, borrowLifetime?: boolean) => void;
}

export interface MessageProps extends ComponentBaseProps<HTMLDivElement, MessageManageRef, MessageAttributtesRelays>, TransitionProps {
    fill: boolean;
    sticky: boolean;
    lifetime: number;
    foreScheme: boolean;
    closeOnClick: boolean;
    icon: NoseurIconElement;
    showProgressbar: boolean;
    pauseDelayOnHover: boolean;
    container: NoseurRawElement;
    content: NoseurElement | MessageContentHandler;

    onClose: MessageEventHandler;
    onAction: MessageEventHandler;
    onExitDOM: MessageEventHandler;
    onEnterDOM: MessageEventHandler;
    onMouseEnter?: MouseEventHandler<HTMLDivElement> | undefined
    onMouseLeave?: MouseEventHandler<HTMLDivElement> | undefined
}

interface MessageState {
    mount: boolean;
    props: {
        fill: boolean;
        scheme: Scheme;
        sticky: boolean;
        lifetime: number;
        className: string;
        foreScheme: boolean;
        closeOnClick: boolean;
        icon: NoseurIconElement;
        showProgressbar: boolean;
        pauseDelayOnHover: boolean;
        container: NoseurRawElement;
        style: React.CSSProperties | undefined;
        content: NoseurElement | MessageContentHandler;
    } & TransitionProps;
}

class MessageComponent extends React.Component<MessageProps, MessageState> {

    public static defaultProps: Partial<MessageProps> = {
        lifetime: 10000,
        transitionTimeout: 1000,
        transition: Transition.BOUNCE_IN_OUT,
    };

    state: MessageState = {
        mount: false,
        props: this.props as any,
    };

    timer?: Timer;
    progressBarComponent?: ProgressBarManageRef;

    constructor(props: MessageProps) {
        super(props);

        this.onEnter = this.onEnter.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onExited = this.onExited.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onTimerAction = this.onTimerAction.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            close: this.onClose,
            update: (messageProps: Partial<MessageProps>, borrowLifetime: boolean = true) => {
                const shouldNowBeSticky = messageProps.sticky;
                const currentlySticky = this.state.props.sticky;
                this.setState({ props: ObjectHelper.merge(this.state.props, messageProps) }, (() => {
                    if (currentlySticky && !shouldNowBeSticky) {
                        if (this.timer) {
                            if (borrowLifetime) this.timer.resume();
                            else this.timer.restart(this.state.props.lifetime);
                        } else {
                            this.onEntered();
                        }
                        return;
                    }
                    if (!this.timer) return;
                    if (!currentlySticky && shouldNowBeSticky) {
                        this.timer.pause();
                        return;
                    }
                    if (borrowLifetime) return;
                    this.timer.restart(this.state.props.lifetime);
                }).bind(this));
            }
        });
        this.setState({ mount: true });
    }

    componentWillUnmount() {
        if (!this.timer) return;
        this.timer.stop();
        this.timer = undefined;
    }

    onEnter() {
        this.props.onEnterDOM && this.props.onEnterDOM();
    }

    onEntered() {
        if (this.state.props.sticky) return;
        this.timer = new Timer({
            delay: 800,
            timeout: this.state.props.lifetime,
            isInterval: !!this.state.props.showProgressbar,
            cbs: {
                onAction: this.onTimerAction,
                onEnd: () => {
                    this.onClose(true);
                },
            }
        });
        this.timer.start();
    }

    onExited() {
        this.props.onExitDOM && this.props.onExitDOM();
    }

    onTimerAction(percentage: number) {
        if (!this.progressBarComponent) return;
        this.progressBarComponent.setValue(100 - percentage);
    }

    onClose(fromTimer: boolean = false) {
        this.componentWillUnmount();
        this.setState({ mount: false });
        if (!fromTimer) this.props.onClose && this.props.onClose();
    }

    onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.onMouseEnter && this.props.onMouseEnter(event);
        if (this.props.pauseDelayOnHover && this.timer) this.timer.pause();
    }

    onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.onMouseLeave && this.props.onMouseLeave(event);
        if (this.state.props.pauseDelayOnHover && this.timer) this.timer.resume();
    }

    onClick(event: any) {
        if (this.props.closeOnClick) this.onClose();
        this.props.onAction && this.props.onAction();
        this.props.onClick && this.props.onClick(event);
    }

    renderIcon(hasSiblings: boolean) {
        return MicroBuilder.buildIcon(this.state.props.icon, {
            applyFaScheme: true,
            style: { marginLeft: 10 },
            relativeAlignment: (hasSiblings ? Alignment.LEFT : undefined),
            scheme: (this.state.props.foreScheme ? this.state.props.scheme : undefined),
        });
    }

    renderCloseIcon(contentIsPresent: boolean) {
        const scheme = this.props.attrsRelay?.closeIcon?.scheme ?? (this.state.props.foreScheme ? this.state.props.scheme : undefined);
        const className = Classname.build("fa fa-times", (scheme ? `${scheme}-tx-hv` : null), this.props.attrsRelay?.closeIcon?.className);
        return (<i onClick={(e) => {
            e.stopPropagation();
            this.onClose();
        }} className={className} id={this.props.attrsRelay?.closeIcon?.id}
            style={{ marginLeft: (contentIsPresent ? 15 : 0), ...this.props.attrsRelay?.closeIcon?.style }} />);
    }

    renderContent() {
        const className = Classname.build("noseur-message-content", this.props.attrsRelay?.content?.className);
        const content = (this.state.props.content instanceof Function ? this.state.props.content(this.props.attrsRelay?.content) : this.state.props.content);

        return (<div className={className} id={this.props.attrsRelay?.content?.id}>
            {content}
        </div>);
    }

    renderProgressBar(scheme?: Scheme) {
        const cachedSelfRef = this.props.attrsRelay?.progressBar?.manageRef;
        const cachedClassName = this.props.attrsRelay?.progressBar?.className;
        const progressProps: Partial<ProgressBarProps> = {
            ...this.props.attrsRelay?.progressBar,
            value: 100,
            className: Classname.build(cachedClassName,),
            manageRef: (r: ProgressBarManageRef | null) => {
                if (!r) return;
                this.progressBarComponent = r;
                if (cachedSelfRef) ObjectHelper.resolveRef(cachedSelfRef, r);
            }
        };
        return (<ProgressBar {...progressProps} noLabel={progressProps.noLabel || true}
            scheme={progressProps.scheme ?? (this.state.props.foreScheme ? this.state.props.scheme : (scheme ? `${scheme}-bg-accent` : undefined) as Scheme)} />);
    }

    render() {
        const transition = this.state.props.transition;
        const content = (this.state.props.content ? this.renderContent() : null);
        const closeIcon = (this.state.props.sticky ? null : this.renderCloseIcon(!!content));
        const icon = (this.state.props.icon ? this.renderIcon(!!content || !!closeIcon) : null);
        const scheme = (!this.state.props.foreScheme && this.state.props.scheme ? this.state.props.scheme : null);
        const progressBar = (this.state.props.showProgressbar ? this.renderProgressBar(scheme ?? undefined) : null);
        const className = Classname.build("noseur-message", {
            "noseur-wd-100-pct": this.state.props.fill
        }, scheme, (this.state.props.scheme ? `${this.state.props.scheme}-bd-rd ${this.state.props.scheme}-vars` : null),
            (this.state.props.closeOnClick ? "noseur-cursor-pointer" : null), this.state.props.className);

        const children = (<CSSTransition classNames={transition} options={this.state.props.transitionOptions}
            timeout={transition === Transition.NONE ? 0 : this.state.props.transitionTimeout}
            in={this.state.mount} unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExited={this.onExited}>
            <div ref={this.props.forwardRef} className={className} id={this.props.id} style={this.state.props.style}
                onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div className="noseur-message-container container">
                    {icon}
                    {content}
                    {closeIcon}
                </div>
                {progressBar}
            </div>
        </CSSTransition>);
        return (!this.state.props.container ? children : <Portal children={children} container={this.state.props.container} visible={true} />);
    }

}

export const Message = React.forwardRef<HTMLDivElement, Partial<MessageProps>>((props, ref) => (
    <MessageComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

