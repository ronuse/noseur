
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
}

class MessageComponent extends React.Component<MessageProps, MessageState> {

    public static defaultProps: Partial<MessageProps> = {
        lifetime: 10000,
        transitionTimeout: 1000,
        transition: Transition.BOUNCE_IN_OUT,
    };

    state: MessageState = {
        mount: false,
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
        if (this.props.sticky) return;
        this.timer = new Timer({
            delay: 800,
            timeout: this.props.lifetime,
            isInterval: !!this.props.showProgressbar,
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
        if (this.props.pauseDelayOnHover && this.timer) this.timer.resume();
    }

    onClick(event: any) {
        if (this.props.closeOnClick) this.onClose();
        this.props.onAction && this.props.onAction();
        this.props.onClick && this.props.onClick(event);
    }

    renderIcon(hasSiblings: boolean) {
        return MicroBuilder.buildIcon(this.props.icon, {
            applyFaScheme: true,
            relativeAlignment: (hasSiblings ? Alignment.LEFT : undefined),
            scheme: (this.props.foreScheme ? this.props.scheme : undefined),
        });
    }

    renderCloseIcon(contentIsPresent: boolean) {
        const scheme = this.props.attrsRelay?.closeIcon?.scheme ?? (this.props.foreScheme ? this.props.scheme : undefined);
        const className = Classname.build("fa fa-times", (scheme ? `${scheme}-tx-hv` : null), this.props.attrsRelay?.closeIcon?.className);
        return (<i onClick={(e) => {
            e.stopPropagation();
            this.onClose();
        }} className={className} id={this.props.attrsRelay?.closeIcon?.id}
            style={{ marginLeft: (contentIsPresent ? 15 : 0), ...this.props.attrsRelay?.closeIcon?.style }} />);
    }

    renderContent() {
        const className = Classname.build("noseur-message-content", this.props.attrsRelay?.content?.className);
        const content = (this.props.content instanceof Function ? this.props.content(this.props.attrsRelay?.content) : this.props.content);

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
            scheme={progressProps.scheme ?? (this.props.foreScheme ? this.props.scheme : (scheme ? `${scheme}-bg-accent` : undefined) as Scheme)} />);
    }

    render() {
        const transition = this.props.transition;
        const content = (this.props.content ? this.renderContent() : null);
        const closeIcon = (this.props.sticky ? null : this.renderCloseIcon(!!content));
        const icon = (this.props.icon ? this.renderIcon(!!content || !!closeIcon) : null);
        const scheme = (!this.props.foreScheme && this.props.scheme ? this.props.scheme : null);
        const progressBar = (this.props.showProgressbar ? this.renderProgressBar(scheme ?? undefined) : null);
        const className = Classname.build("noseur-message", {
            "noseur-wd-100-pct": this.props.fill
        }, scheme, (this.props.scheme ? `${this.props.scheme}-bd-rd ${this.props.scheme}-vars` : null),
            (this.props.closeOnClick ? "noseur-cursor-pointer" : null), this.props.className);

        const children = (<CSSTransition classNames={transition} options={this.props.transitionOptions}
            timeout={transition === Transition.NONE ? 0 : this.props.transitionTimeout}
            in={this.state.mount} unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExited={this.onExited}>
            <div ref={this.props.forwardRef} className={className} id={this.props.id} style={this.props.style}
                onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div className="noseur-message-container container">
                    {icon}
                    {content}
                    {closeIcon}
                </div>
                {progressBar}
            </div>
        </CSSTransition>);
        return (!this.props.container ? children : <Portal children={children} container={this.props.container} visible={true} />);
    }

}

export const Message = React.forwardRef<HTMLDivElement, Partial<MessageProps>>((props, ref) => (
    <MessageComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

