
import "./Overlay.css";
import React from 'react';
import { Portal } from "./Portal";
import { Classname } from "../utils/Classname";
import { TypeChecker } from "../utils/TypeChecker";
import { ObjectHelper } from "../utils/ObjectHelper";
import { CSSTransition } from 'react-transition-group';
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurDivElement, NoseurRawElement, NoseurObject } from '../constants/Types';
import { BaseZIndex, DOMHelper, ScrollHandler, ZIndexHandler } from "../utils/DOMUtils";

export type PopoverEvent = () => void;

export interface PopoverProps extends ComponentBaseProps<NoseurDivElement> {
    baseZIndex: number,
    trapFocus: boolean,
    dismissable: boolean,
    matchTargetSize: boolean,
    container: NoseurRawElement,
    transitionOptions: NoseurObject<any>,
    transitionTimeout: NoseurObject<any>,
    pointingArrowClassName: string | null,
    onOpenFocusRef: React.MutableRefObject<any>,
    onCloseFocusRef: React.MutableRefObject<any>,

    onShow: PopoverEvent,
    onHide: PopoverEvent,
}

interface PopoverState {
    visible: boolean;
}

class PopoverComponent extends React.Component<PopoverProps, PopoverState> {

    public static defaultProps: Partial<PopoverProps> = {
        dismissable: true,
        transitionTimeout: { enter: 130, exit: 110 },
        pointingArrowClassName: "noseur-popover-arrow",
    };

    state: PopoverState = {
        visible: false
    };

    internalElement: any;
    target: HTMLElement | undefined;
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
        ObjectHelper.resolveSelfRef(this, {
            toggle: this.toggle,
            rePosition: this.rePosition,
        });
	}

    toggle(event: Event, target: HTMLElement) {
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

	showPopover(event: Event, target: HTMLElement) {
		this.target = target || event.currentTarget || event.target;
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
		return target && target != eventTarget && !(target.isSameNode(eventTarget) || target.contains(eventTarget)) ;
	}

	isOutsideClicked(target: any) {
		return this.internalElement && !(this.internalElement.isSameNode(target) || this.internalElement.contains(target));
	}

	bindDocumentClickListener() {
		if (this.documentClickListener || !this.props.dismissable) return;
        const elementToReceiveOpenFocus = this.props.onOpenFocusRef?.current as any;
        this.documentClickListener = (event: Event) => {
            if (this.isNotToggleElement(event) && this.isOutsideClicked(event.target)) {
                if (this.props.trapFocus && TypeChecker.isFunction(elementToReceiveOpenFocus?.focus)) {
                    elementToReceiveOpenFocus.focus();
                    return;
                }
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

    rePosition() {
		if (!this.state.visible || !this.target) return;
		DOMHelper.absolutePositionRelatively(this.internalElement, this.target);
        const targetOffset = DOMHelper.getElementOffset(this.target);
		const popoverOffset = DOMHelper.getElementOffset(this.internalElement);
        if (targetOffset.top > popoverOffset.top) {
			DOMHelper.addClass(this.internalElement, 'noseur-popover-arrow-flipped');
		} else {
            if (DOMHelper.hasClass(this.internalElement, "noseur-popover-arrow-flipped")) {
                DOMHelper.removeClass(this.internalElement, "noseur-popover-arrow-flipped");
            }
        }
	}

    matchTargetSizeCb(_: string, styleValue: string, __: CSSStyleDeclaration, targetComputedStyle: CSSStyleDeclaration): string {
        const sidePaddingSum = DOMHelper.sanitizeStyleValue(targetComputedStyle.paddingLeft) + DOMHelper.sanitizeStyleValue(targetComputedStyle.paddingRight);
        return (DOMHelper.sanitizeStyleValue(styleValue) - sidePaddingSum) + "px";
    }

	resolvePopoverStyle() {
		if (!this.target) return;
		if (this.props.matchTargetSize) {
			DOMHelper.matchStyles(this.target, [ this.internalElement ], [ "width" ], this.matchTargetSizeCb);
		}
		DOMHelper.absolutePositionRelatively(this.internalElement, this.target);
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
		let className = Classname.build('noseur-popover', this.props.pointingArrowClassName, this.props.className);
        const props: NoseurObject<any> = {
            className,
            id: this.props.id,
            key: this.props.key,
            style: this.props.style,
        };
        const forwardRef = this.props.forwardRef as React.ForwardedRef<NoseurDivElement>;
        const ref = (el: NoseurDivElement) => {
            this.internalElement = el;
            if (!forwardRef) return;
            if (forwardRef instanceof Function) forwardRef(el);
            else forwardRef.current = el;
        };

		return (
			<CSSTransition classNames="noseur-popover" timeout={this.props.transitionTimeout} in={this.state.visible} options={this.props.transitionOptions}
				unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExit={this.onExit} onExited={this.onExited}>
				<div ref={ref} {...props}>
					{this.props.children}
				</div>
			</CSSTransition>
		);
	}

    render() {
        const children = this.renderChildren();
		return <Portal children={children} container={this.props.container} visible={true}/>;
    }

}

export const Popover = React.forwardRef<NoseurDivElement, Partial<PopoverProps>>((props, ref) => (
    <PopoverComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurDivElement>} />
));
