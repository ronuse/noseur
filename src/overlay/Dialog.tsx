
import "./Overlay.css";
import React from "react";
import { Portal } from "./Portal";
import { Classname } from "../utils/Classname";
import { TypeChecker } from "../utils/TypeChecker";
import { Alignment } from "../constants/Alignment";
import { ObjectHelper } from "../utils/ObjectHelper";
import { CSSTransition } from 'react-transition-group';
import { BaseZIndex, DOMHelper, ZIndexHandler } from "../utils/DOMUtils";
import { ComponentBaseProps, TransitionProps } from "../core/ComponentBaseProps";
import { NoseurElement, NoseurObject, NoseurRawElement } from "../constants/Types";
import { Transition } from "../constants/Transition";

export type DialogEvent = () => void;
export type DialogMaximizeEvent = (event?: any) => boolean;

export interface DialogManageRef {
    show: () => void;
    hide: () => void;
    toggle: () => void;
}

export interface DialogProps extends ComponentBaseProps<HTMLDivElement, DialogManageRef>, TransitionProps {
    visible: boolean,
    baseZIndex: number,
    maximized: boolean,
    noOverlay: boolean,
    icons: NoseurElement,
    notClosable: boolean,
    alignment: Alignment,
    maximizable: boolean,
    header: NoseurElement,
    footer: NoseurElement,
    disableScroll: boolean,
    closeIcon: NoseurElement,
    dismissableModal: boolean,
    container: NoseurRawElement,
    modalProps: NoseurObject<any>,
    headerProps: NoseurObject<any>,
    contentProps: NoseurObject<any>,
    onOpenFocusRef: React.MutableRefObject<any>,
    onCloseFocusRef: React.MutableRefObject<any>,
    maximizeIcons: { minimize: NoseurElement, maximize: NoseurElement },

    onShow: DialogEvent,
    onHide: DialogEvent,
    onMaximize?: DialogMaximizeEvent,
    onMinimize?: DialogMaximizeEvent,
}

interface DialogState {
    id: string;
    visible: boolean;
    maximized: boolean;
    modalVisible: boolean;
};

class DialogComponent extends React.Component<DialogProps, DialogState> {

    public static defaultProps: Partial<DialogProps> = {
        notClosable: false,
        disableScroll: false,
        dismissableModal: true,
        closeIcon: "fa fa-times",
        alignment: Alignment.CENTER,
        baseZIndex: BaseZIndex.MODAL,
        transition: Transition.DIALOGY,
        maximizeIcons: {
            minimize: "fa fa-window-minimize",
            maximize: "fa fa-window-maximize",
        }
    }

    state: DialogState = {
        visible: false,
        modalVisible: false,
        id: DOMHelper.uniqueElementId(),
        maximized: this.props.maximized,
    };

    internalModalElement: any;
    internalDialogElement: any;
    componentUnmounted: boolean = false;

    constructor(props: DialogProps) {
        super(props);

        this.onClose = this.onClose.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onExited = this.onExited.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.onModalClick = this.onModalClick.bind(this);
        this.toggleMaximize = this.toggleMaximize.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            show: () => this.setState({ visible: true }),
            hide: () => this.setState({ visible: false }),
            toggle: () => this.setState({ visible: !this.props.visible }),
        });
        if (this.props.visible) {
            this.setState({ modalVisible: true }, () => {
                ZIndexHandler.setElementZIndex(this.internalModalElement, this.props.baseZIndex);
            });
        }
        this.componentUnmounted = true;
    }

    componentDidUpdate(prevProps: Readonly<DialogProps>) {
        if (this.props.visible && !this.state.modalVisible) {
            this.setState({ modalVisible: true }, () => {
                ZIndexHandler.setElementZIndex(this.internalModalElement, this.props.baseZIndex);
            });
        }

        if (!this.props.visible && this.state.visible && this.state.modalVisible) {
            this.setState({
                visible: this.props.visible
            });
        }
        if (prevProps.maximized !== this.props.maximized && this.props.onMaximize) {
            this.updateScrollOnMaximizable();
        }
    }

    componentWillUnmount() {
        if (!this.componentUnmounted) return;
        this.componentUnmounted = true;
        ZIndexHandler.removeElementZIndex(this.internalModalElement);
        ObjectHelper.resolveManageRef(this, null);
    }

    onClose(event: any) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ visible: !this.props.visible });
        if (this.props.onHide) this.props.onHide();
    }

    onEnter() {
        if ((this.props.disableScroll || (this.props.maximizable && this.state.maximized)) && !this.props.noOverlay) {
            DOMHelper.addClass((this.props.container || document.body) as any, 'noseur-overflow-hidden');
        }
    }

    onEntered() {
        if (this.props.onShow) this.props.onShow();
        const elementToReceiveOpenFocus = this.props.onOpenFocusRef?.current as any;
        if (elementToReceiveOpenFocus && TypeChecker.isFunction(elementToReceiveOpenFocus?.focus)) {
            elementToReceiveOpenFocus.focus();
        }
    }

    onExited() {
        ZIndexHandler.removeElementZIndex(this.internalModalElement);
        this.setState({ modalVisible: false });
        if ((this.props.disableScroll || (this.props.maximizable && this.state.maximized)) && !this.props.noOverlay) {
            DOMHelper.removeClass((this.props.container || document.body) as any, 'noseur-overflow-hidden');
        }
        const elementToReceiveCloseFocus = this.props.onCloseFocusRef?.current as any;
        if (elementToReceiveCloseFocus && TypeChecker.isFunction(elementToReceiveCloseFocus?.focus)) {
            elementToReceiveCloseFocus.focus();
        }
    }

    onModalClick(event: any) {
        if (this.props.dismissableModal && !this.props.noOverlay && this.internalModalElement === event.target) {
            this.onClose(event);
        }
    }

    toggleMaximize(event: any) {
        let maximized = !this.state.maximized;
        event.preventDefault();
        event.stopPropagation();

        if (!maximized && (!this.props.onMinimize || this.props.onMinimize(event))) {
            this.setState({ maximized }, this.updateScrollOnMaximizable);
        }
        if (!!maximized && (!this.props.onMaximize || this.props.onMaximize(event))) {
            this.setState({ maximized }, this.updateScrollOnMaximizable);
        }
    }

    updateScrollOnMaximizable() {
        if (!this.props.disableScroll) {
            let funcIdentifier = this.state.maximized ? 'addClass' : 'removeClass';
            ((DOMHelper as NoseurObject<Function>)[funcIdentifier])((this.props.container || document.body) as any, 'noseur-overflow-hidden');
        }
    }

    renderCloseButton() {
        if (this.props.notClosable || !this.props.closeIcon) return;

        if (TypeChecker.isString(this.props.closeIcon)) {
            return (<i className={`noseur-dialog-header-close-icon ${this.props.closeIcon}`} onClick={this.onClose}></i>);
        }
        const closeProps = { ...((this.props.closeIcon as any).props || {}) };
        const cacheClassName = closeProps.className;
        closeProps.className = Classname.build('noseur-dialog-header-close-icon', cacheClassName);
        if (!closeProps.onClick) closeProps.onClick = this.onClose;
        return React.cloneElement(this.props.closeIcon as React.ReactElement<any, string | React.JSXElementConstructor<any>>, closeProps);
    }

    renderMaximizeButton() {
        if (!this.props.maximizable) return;

        const icon = (this.state.maximized ? this.props.maximizeIcons.minimize : this.props.maximizeIcons.maximize) as any;
        if (TypeChecker.isString(icon)) {
            const className = Classname.build('noseur-dialog-header-maximize-icon', icon);
            return (<i className={className} onClick={this.toggleMaximize}></i>);
        }
        const iconProps = { ...(icon.props || {}) };
        const cacheClassName = iconProps.className;
        iconProps.className = Classname.build('noseur-dialog-header-maximize-icon', cacheClassName);
        if (!iconProps.onClick) iconProps.onClick = this.toggleMaximize;
        return React.cloneElement(icon as React.ReactElement<any, string | React.JSXElementConstructor<any>>, iconProps);
    }

    renderHeader(id: string) {
        let header = this.props.header as any;
        const closeIcon = this.renderCloseButton();
        const maximizeIcon = this.renderMaximizeButton();
        const icons = this.props.icons || [];

        if (!closeIcon && !maximizeIcon && !header) return;

        if (header) {
            header = this.props.header as any;
            if (TypeChecker.isString(header)) {
                header = <span id={id + '-header'} className="noseur-dialog-title">{header}</span>;
            } else {
                const relayProps = { ...(header.props || {}) };
                const cacheClassName = relayProps.className;
                relayProps.className = Classname.build('noseur-dialog-title', cacheClassName);
                header = React.cloneElement(header, relayProps);
            }
        }
        const headerProps = { ...(this.props.headerProps || {}) };
        const cacheClassName = headerProps.className;
        headerProps.className = Classname.build(`noseur-dialog-header ${!header ? "nl" : ""}`, cacheClassName);


        // TODO add onMouseDown for dragging header on screen
        return (
            <div {...headerProps}>
                {header}
                <div className="noseur-dialog-header-right">
                    {icons}
                    {maximizeIcon}
                    {closeIcon}
                </div>
            </div>
        );
    }

    renderFooter() {
        if (!this.props.footer) return;

        const footer = this.props.footer as any;
        const className = "noseur-dialog-footer";
        if (TypeChecker.isReactElement(this.props.footer)) {
            const footerProps = { ...(footer.props || {}) };
            const cacheClassName = footerProps.className;
            footerProps.className = Classname.build(className, cacheClassName);
            return React.cloneElement(footer, footerProps);
        }
        return (<div className={className}>{footer}</div>);
    }

    renderContent(id: string, hasHeader: boolean) {
        const contentProps = { ...(this.props.contentProps || {}) };
        const cacheId = contentProps.id;
        const cacheClassName = contentProps.className;
        contentProps.className = Classname.build('noseur-dialog-content', cacheClassName, {
            'noseur-dialog-content-bd-t': !hasHeader,
            'noseur-dialog-content-bd-b': !this.props.footer,
        });

        return (
            <div {...contentProps} id={cacheId || `${id}-content`}>
                {this.props.children}
            </div>
        );
    }

    renderChildren() {
        const id = this.props.id || this.state.id;
        const className = Classname.build('noseur-dialog', this.props.className, {
            'noseur-dialog-maximized': this.state.maximized
        });
        let alignment = this.props.alignment;
        if (alignment === Alignment.TOP_CENTER) alignment = Alignment.TOP;
        if (alignment === Alignment.BOTTOM_CENTER) alignment = Alignment.BOTTOM;
        const modalProps = { ...(this.props.modalProps || {}) };
        const cacheModalRef = modalProps.ref;
        const cacheClassName = modalProps.className;
        modalProps.ref = (r: HTMLDivElement) => {
            if (!!this.internalModalElement && !r) this.componentWillUnmount();
            else if (this.componentUnmounted && !!r) this.componentDidMount();
            this.internalModalElement = r;
            ObjectHelper.resolveRef(cacheModalRef, r);
        };
        modalProps.className = Classname.build('noseur-dialog-modal', {
            'noseur-p-stk': !!this.props.container,
            'noseur-component-overlay': !this.props.noOverlay,
            'noseur-dialog-visible': this.state.modalVisible
        }, `noseur-dialog-${alignment}`, cacheClassName);
        const transitionTimeout = this.props.transitionTimeout ?? 500;
        const footer = this.renderFooter();
        const header = this.renderHeader(id);
        const transition = this.props.transition;
        const content = this.renderContent(id, !!header);
        const elementRef = (r: HTMLDivElement) => {
            this.internalDialogElement = r;
            ObjectHelper.resolveRef(cacheModalRef, r);
            ObjectHelper.resolveRef(this.props.forwardRef, r, true);
        };
        if (!modalProps.onClick) modalProps.onClick = this.onModalClick;

        return (<div {...modalProps} style={{ ...(modalProps.style), zIndex: this.props.baseZIndex || modalProps.style?.zIndex }} ref={(r) => {
            if (!(r && !this.state.visible && this.props.visible)) return;
            this.setState({
                visible: this.props.visible
            });
        }}>
            <CSSTransition classNames={transition} timeout={transition === Transition.NONE ? 0 : transitionTimeout} in={this.state.visible}
                options={this.props.transitionOptions} unmountOnExit onEnter={this.onEnter} onEntered={this.onEntered} onExited={this.onExited}>
                <div ref={elementRef} id={id} className={className} style={this.props.style}
                    role="dialog" aria-labelledby={id + '-header'} aria-describedby={id + '-content'} aria-modal={this.props.dismissableModal}>
                    {header}
                    {content}
                    {footer}
                </div>
            </CSSTransition>
        </div>);
    }

    render() {
        if (!this.state.modalVisible) return null;
        const children = this.renderChildren();
        return <Portal children={children} container={this.props.container} visible={true} />;
    }

}

export const Dialog = React.forwardRef<HTMLDivElement, Partial<DialogProps>>((props, ref) => (
    <DialogComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

