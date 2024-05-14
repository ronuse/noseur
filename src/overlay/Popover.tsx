
import "./Overlay.css";
import React from 'react';
import { Portal } from "./Portal";
import { Classname } from "../utils/Classname";
import { TypeChecker } from "../utils/TypeChecker";
import { Transition } from "../constants/Transition";
import { ObjectHelper } from "../utils/ObjectHelper";
import { CSSTransition } from 'react-transition-group';
import { ComponentBaseProps, TransitionProps } from "../core/ComponentBaseProps";
import { NoseurDivElement, NoseurRawElement, NoseurObject } from '../constants/Types';
import { BaseZIndex, DOMHelper, ScrollHandler, ZIndexHandler } from "../utils/DOMUtils";

export type PopoverEvent = () => void;

export interface PopoverManageRef {
    hide: () => void;
    visible: () => boolean;
    sticky: (sticky: boolean) => void;
    show: (event: Event, target?: HTMLElement) => void;
    rePosition: (event?: Event, cb?: () => void) => void;
    toggle: (event: Event, target?: HTMLElement) => void;
}

export interface PopoverProps<T1 = NoseurDivElement, T2 = PopoverManageRef, T3 = {}> extends ComponentBaseProps<T1, T2, T3>, TransitionProps {
    sticky: boolean;
    baseZIndex: number;
    trapFocus: boolean;
    notDismissable: boolean;
    dismissOnClick: boolean;
    matchTargetSize: boolean;
    container: NoseurRawElement;
    positional: "left" | "right";
    pointingArrowClassName: string | null;
    onOpenFocusRef: React.MutableRefObject<any>;
    onCloseFocusRef: React.MutableRefObject<any>;
    outsideClickLogic: "elemental" | "positional";

    onShow: PopoverEvent;
    onHide: PopoverEvent;
}

interface PopoverState {
    sticky: boolean;
    visible: boolean;
}

class PopoverComponent extends React.Component<PopoverProps, PopoverState> {

    public static defaultProps: Partial<PopoverProps> = {
        transition: Transition.FLIP_X,
        outsideClickLogic: "elemental",
        transitionTimeout: { enter: 130, exit: 110 },
        pointingArrowClassName: "noseur-popover-arrow",
    };

    state: PopoverState = {
        sticky: false,
        visible: false,
    };

    internalElement: any;
    target: HTMLElement | any;
    hostRectBeforeRerendering: DOMRect = {} as any;
    documentScrollHandler: NoseurObject<any> | undefined;
    windowResizeListener: ((event: Event) => void) | undefined;
    documentClickListener: ((event: Event) => void) | undefined;

    constructor(props: PopoverProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onExited = this.onExited.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.rePosition = this.rePosition.bind(this);
        this.showPopover = this.showPopover.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
        this.resolvePopoverStyle = this.resolvePopoverStyle.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            toggle: this.toggle,
            rePosition: this.rePosition,
            visible: () => this.state.visible,
            sticky: (sticky: boolean) => this.setState({ sticky }),
            hide: () => {
                if (this.state.visible) this.hidePopover();
            },
            show: (event: Event, target?: HTMLElement) => {
                if (this.state.visible) this.rePosition(event);
                else this.showPopover(event, target);
            },
        });
    }

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
    }

    toggle(event: Event, target?: HTMLElement) {
        (!this.state.visible) ? this.showPopover(event, target) : this.hidePopover();
    }

    onEnter() {
        ZIndexHandler.setElementZIndex(this.internalElement, BaseZIndex.OVERLAY);
        this.resolvePopoverStyle();
    }

    onEntered() {
        const elementToReceiveOpenFocus = this.props.onOpenFocusRef?.current as any;
        if (elementToReceiveOpenFocus && TypeChecker.isFunction(elementToReceiveOpenFocus?.focus)) {
            elementToReceiveOpenFocus.focus();
        }
        this.bindDocumentClickListener();
        this.bindScrollListener();
        this.bindResizeListener();
        if (this.props.onShow) this.props.onShow();
    }

    onExit() {
        this.unbindDocumentClickListener();
        this.unbindScrollListener();
        this.unbindResizeListener();
    }

    onExited() {
        ZIndexHandler.removeElementZIndex(this.internalElement);
        const elementToReceiveCloseFocus = this.props.onCloseFocusRef?.current as any;
        if (elementToReceiveCloseFocus && TypeChecker.isFunction(elementToReceiveCloseFocus?.focus)) {
            elementToReceiveCloseFocus.focus();
        }
        if (this.props.onHide) this.props.onHide();
    }

    showPopover(event: Event, target?: HTMLElement) {
        this.target = target ?? event.target ?? event.currentTarget;
        if (this.state.visible) {
            this.resolvePopoverStyle();
            return;
        }
        this.setState({ visible: true });
    }

    hidePopover() {
        this.setState({ visible: false });
    }

    isNotToggleElement(event: Event) {
        const target = this.target;
        const eventTarget = (event.target) as Node;
        return target && target != eventTarget && target.isSameNode && !(target.isSameNode(eventTarget) || target.contains(eventTarget));
    }

    isOutsideClicked(event: Event) {
        if (this.props.outsideClickLogic === "elemental") {
            const target = event.target;
            return this.props.dismissOnClick || (this.internalElement && !(this.internalElement.isSameNode(target) || this.internalElement.contains(target)));
        }
        const { x, y } = event as any;
        const hostRect = this.internalElement.getBoundingClientRect();
        const hostX = Math.min(hostRect.x, this.hostRectBeforeRerendering.x ?? 0);
        const hostY = Math.min(hostRect.y, this.hostRectBeforeRerendering.y ?? 0);
        const hostWidth = Math.max(hostRect.width, this.hostRectBeforeRerendering.width ?? 0);
        const hostHeight = Math.max(hostRect.height, this.hostRectBeforeRerendering.height ?? 0);
        const hostAbsoluteWidth = hostX + hostWidth; const hostAbsoluteHeight = hostY + hostHeight;
        const isOutSide = !((x >= hostX && x <= hostAbsoluteWidth) && (y >= hostY && y <= hostAbsoluteHeight));
        this.hostRectBeforeRerendering = this.internalElement.getBoundingClientRect();
        return isOutSide;
    }

    bindDocumentClickListener() {
        if (this.documentClickListener || this.props.notDismissable) return;
        const elementToReceiveOpenFocus = this.props.onOpenFocusRef?.current as any;
        this.documentClickListener = (event: Event) => {
            if (!this.state.sticky && this.isNotToggleElement(event) && this.isOutsideClicked(event)) {
                if (this.props.trapFocus && TypeChecker.isFunction(elementToReceiveOpenFocus?.focus)) {
                    elementToReceiveOpenFocus.focus();
                    return;
                }
                if (this.props.sticky) return;
                this.hidePopover();
            }
        };
        document.addEventListener('click', this.documentClickListener);
    }

    unbindDocumentClickListener() {
        if (!this.documentClickListener) return;
        document.removeEventListener('click', this.documentClickListener);
        this.documentClickListener = undefined;
    }

    bindScrollListener() {
        if (this.documentScrollHandler || !this.target) return;
        this.documentScrollHandler = ScrollHandler.handle(this.target, this.rePosition);
        this.documentScrollHandler.attach();
    }

    unbindScrollListener() {
        if (!this.documentScrollHandler) return;
        this.documentScrollHandler.detach();
        this.documentScrollHandler = undefined;
    }

    bindResizeListener() {
        if (this.windowResizeListener) return;
        this.windowResizeListener = (_) => {
            if (this.state.visible) this.hidePopover(); // is android or ios
        };
        window.addEventListener('resize', this.windowResizeListener);
    }

    unbindResizeListener() {
        if (!this.windowResizeListener) return;
        window.removeEventListener('resize', this.windowResizeListener);
        this.windowResizeListener = undefined;
    }

    rePosition(event?: Event, cb?: () => void) {
        if (!this.state.visible) return;
        this.target = event?.target ?? event?.currentTarget ?? this.target;
        if (!this.target || !this.target.getBoundingClientRect) return;
        DOMHelper.absolutePositionRelatively(this.internalElement, this.target, this.props.positional);
        const targetOffset = DOMHelper.getElementOffset(this.target);
        const popoverOffset = DOMHelper.getElementOffset(this.internalElement);
        if (targetOffset.top > popoverOffset.top) {
            DOMHelper.addClass(this.internalElement, 'noseur-popover-arrow-flipped');
        } else {
            if (DOMHelper.hasClass(this.internalElement, "noseur-popover-arrow-flipped")) {
                DOMHelper.removeClass(this.internalElement, "noseur-popover-arrow-flipped");
            }
        }
        cb && cb();
    }

    matchTargetSizeCb(_: string, styleValue: string, __: CSSStyleDeclaration, targetComputedStyle: CSSStyleDeclaration): string {
        const sidePaddingSum = DOMHelper.sanitizeStyleValue(targetComputedStyle.paddingLeft) + DOMHelper.sanitizeStyleValue(targetComputedStyle.paddingRight);
        return (DOMHelper.sanitizeStyleValue(styleValue) - sidePaddingSum) + "px";
    }

    resolvePopoverStyle() {
        if (!this.target || !this.target?.getBoundingClientRect) return;
        if (this.props.matchTargetSize) {
            DOMHelper.matchStyles(this.target, [this.internalElement], ["width"], this.matchTargetSizeCb);
        }
        DOMHelper.absolutePositionRelatively(this.internalElement, this.target, this.props.positional);
        if (!this.props.pointingArrowClassName?.startsWith("noseur-popover-arrow")) return;
        const targetOffset = DOMHelper.getElementOffset(this.target);
        const popoverOffset = DOMHelper.getElementOffset(this.internalElement);
        if (TypeChecker.isString(targetOffset.left) || TypeChecker.isString(popoverOffset.left)) return;
        if (targetOffset.left > popoverOffset.left) {
            const arrowLeftOffset = targetOffset.left - popoverOffset.left - 10;
            this.internalElement.style.setProperty('--popoverArrowLeftOffset', `${arrowLeftOffset}px`);
        }
        if (targetOffset.top > popoverOffset.top) {
            DOMHelper.addClass(this.internalElement, 'noseur-popover-arrow-flipped');
        }
    }

    renderChildren() {
        const transition = this.props.transition;
        let className = Classname.build('noseur-popover', this.props.pointingArrowClassName, this.props.className);
        const props: NoseurObject<any> = {
            className,
            id: this.props.id,
            key: this.props.key,
            style: this.props.style,
        };
        const forwardRef = this.props.forwardRef as React.ForwardedRef<NoseurDivElement>;
        const ref = (el: NoseurDivElement) => {
            if (!el) return;
            this.internalElement = el;
            ObjectHelper.resolveRef(forwardRef, el);
            if (!this.hostRectBeforeRerendering.width) this.hostRectBeforeRerendering = this.internalElement.getBoundingClientRect();
        };

        return (
            <CSSTransition classNames={transition} timeout={this.props.transitionTimeout} in={this.state.visible} options={this.props.transitionOptions}
                unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExit={this.onExit} onExited={this.onExited}>
                <div ref={ref} {...props}>
                    {this.props.children}
                </div>
            </CSSTransition>
        );
    }

    render() {
        const children = this.renderChildren();
        return <Portal children={children} container={this.props.container} visible={true} />;
    }

}

export const Popover = React.forwardRef<NoseurDivElement, Partial<PopoverProps>>((props, ref) => (
    <PopoverComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurDivElement>} />
));
