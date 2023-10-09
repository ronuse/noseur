
import "../Composed.css";
import React from "react";
import ReactDOM from "react-dom";
import { Dialog } from "../../overlay/Dialog";
import { Popover } from "../../overlay/Popover";
import { Classname } from "../../utils/Classname";
import { Alignment } from "../../constants/Alignment";
import { MicroBuilder } from "../../utils/MicroBuilder";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { Button, ButtonProps, DOMHelper, ObjectHelper, Scheme } from "../../";
import { NoseurDivElement, NoseurElement, NoseurIconElement, NoseurRawElement } from "../../constants/Types";

export type AlertEvent = () => void;
export type AlertControl = {
    scheme?: Scheme,
    label?: NoseurElement,
    icon?: NoseurIconElement,
    props?: Partial<ButtonProps>,

    action?: AlertEvent,
    ref?: React.ForwardedRef<any>,
};

export interface AlertProps extends ComponentBaseProps<HTMLDivElement> {
    visible: boolean;
    componentProps: any;
    alignment: Alignment,
    cancel: AlertControl,
    confirm: AlertControl,
    alignFooter: Alignment,
    message: NoseurElement;
    icon: NoseurIconElement;
    dismissableModal: boolean,
    container: NoseurRawElement,
    footerElements: NoseurElement;
    component: React.FunctionComponent<Partial<ComponentBaseProps<NoseurDivElement>> & React.RefAttributes<NoseurDivElement>>;

    onHide: Function,
    onCancel: AlertEvent;
    onConfirm: AlertEvent;
}

interface AlertState {
    visible: boolean;
};

class AlertComponent extends React.Component<AlertProps, AlertState> {

    public static defaultProps: Partial<AlertProps> = {
        component: Dialog,
        componentProps: {},
        dismissableModal: true,
        alignment: Alignment.CENTER,
        alignFooter: Alignment.RIGHT,
        confirm: {
            label: "OK",
            scheme: Scheme.SUCCESS
        },
        cancel: {
            label: "Cancel",
            scheme: Scheme.SECONDARY
        }
    }

    state: AlertState = {
        visible: this.props.visible,
    };

    lastClickedElement: any;
    internalComponentSelfRef: any;
    documentClickListener: ((event: Event) => void) | undefined;

    constructor(props: AlertProps) {
        super(props);

        this.onHide = this.onHide.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentDidMount() {
        this.documentClickListener = (event: Event) => {
            this.lastClickedElement = event.target || event.currentTarget;
        };
        document.addEventListener('click', this.documentClickListener);
    }

    componentDidUpdate(prevProps: Readonly<AlertProps>): void {
        if (prevProps.visible !== this.props.visible) {
            const isVisible = this.state.visible;
            this.setState({ visible: this.props.visible });
            if (isVisible && this.props.dismissableModal) return;
            this.internalComponentSelfRef && this.internalComponentSelfRef.toggle && this.internalComponentSelfRef.toggle({}, this.getUsableTarget());
        }
    }

    componentWillUnmount() {
        console.log("UNBMOUNTER");
        if (!this.documentClickListener) return;
        document.removeEventListener('click', this.documentClickListener);
        this.documentClickListener = undefined;
    }

    getUsableTarget(e?: any) {
        let target = (e || event)?.target || (e || event)?.currentTarget;
        console.log("CLICKAA", this.props.visible, target, DOMHelper.isElement(target), this.lastClickedElement);
        if (!DOMHelper.isElement(target)) target = this.lastClickedElement;
        return target;
    }

    onHide(e: any) {
        if (this.props.onHide) return this.props.onHide();
        this.setState({ visible: false });
        this.internalComponentSelfRef && this.internalComponentSelfRef.toggle && this.internalComponentSelfRef.toggle({}, this.getUsableTarget(e));
    }

    onConfirm(e: any) {
        if (this.props.onConfirm) return this.props.onConfirm();
        this.onHide(e);
    }

    onCancel(e: any) {
        if (this.props.onCancel) return this.props.onCancel();
        this.onHide(e);
    }

    renderControl() {
        const controlButtons = [this.props.cancel, this.props.confirm].map((control: AlertControl, index: number) => {
            if (!control) return null;

            const cachedOnClick = control.props?.onClick;
            const text = control.label || control.props?.text;
            const icon = control.icon || control.props?.leftIcon;
            const ref = control.ref || control.props?.forwardRef;
            const scheme = control.scheme || control.props?.scheme;
            const onClick = (e: any) => {
                if (cachedOnClick) cachedOnClick(e);
                if (control.action) control.action();
                if (index === 1) this.onCancel(e);
                if (index === 0) this.onConfirm(e);
            };

            return (<Button {...(control.props || {})} key={control.props?.key || index} text={text} leftIcon={icon} scheme={scheme} ref={ref} onClick={onClick} />)
        });
        return (
            <div className={`noseur-alert-footer noseur-alert-footer-${this.props.alignFooter}`}>
                {controlButtons}
                {this.props.footerElements}
            </div>
        );
    }

    render() {
        const controls = this.renderControl();
        const closeIcon = this.props.componentProps.closeIcon || null;
        const cachedComponentPropsSelfRef = this.props.componentProps.selfRef;
        const container = this.props.componentProps.container || this.props.container;
        const alignment = this.props.componentProps.alignment || this.props.alignment;
        const className = Classname.build("noseur-alert", this.props.componentProps.className);
        const icon = MicroBuilder.buildIcon(this.props.icon, { scheme: this.props.scheme, className: "noseur-dialog-content-icon" });
        const selfRef = (e: any) => {
            this.internalComponentSelfRef = e;
            ObjectHelper.resolveRef(cachedComponentPropsSelfRef, e);
        }

        return React.createElement(this.props.component, {
            ...this.props.componentProps,
            selfRef,
            className,
            alignment,
            container,
            onHide: this.onHide,
            closeIcon: closeIcon,
            visible: this.state.visible,
            dismissable: this.props.dismissableModal,
            dismissableModal: this.props.dismissableModal,
        }, (<div className="noseur-alert-content">
            {icon}
            {this.props.message}
        </div>), controls);
    }

}

function alert(props: Partial<AlertProps>) {
    let container = props.container || document.body;
    let alertWrapper = document.createDocumentFragment();
	DOMHelper.appendChild(alertWrapper, container);
	props = {...props, ...{isVisible: props.visible === undefined ? true : props.visible}};
	let alertDialog = React.createElement(AlertDialog, props);
	ReactDOM.render(alertDialog, alertWrapper);

	let updateAlert = (newProps: Partial<AlertProps>) => {
		props = { ...props, ...newProps };
		ReactDOM.render(React.cloneElement(alertDialog, props), alertWrapper);
	};

    return {
		destroy: () => {
			ReactDOM.unmountComponentAtNode(alertWrapper);
		},
        show: () => {
            updateAlert({ visible: true, onHide: () => {
				updateAlert({ visible: false });
			}});
        },
        hide: () => {
            // TODO: the exit animation is not present
			//updateAlert({ isVisible: false });
			ReactDOM.unmountComponentAtNode(alertWrapper);
        },
        update: (newProps: Partial<AlertProps>) => updateAlert(newProps),
    };
}

export const AlertDialog = React.forwardRef<HTMLDivElement, Partial<AlertProps>>((props, ref) => (
    <AlertComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

export const AlertPopover = React.forwardRef<HTMLDivElement, Partial<AlertProps>>((props, ref) => (
    <AlertComponent {...props} component={Popover} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

export const alertDialog = (props: Partial<AlertProps>) => alert({ ...props });
export const alertPopover = (props: Partial<AlertProps>) => alert({ ...props, component: Popover });


export function loadingDialog(props: Partial<AlertProps>, params: any) {
	const icon = props.icon || "fas fa-spinner fa-pulse";
	const dialog = alertDialog({
		icon: icon,
		confirmLabel: null
	});
	if (ObjUtils.isFunction(props.onLoading)) {
		props.onLoading(dialog, params);
	}
	return dialog;
};


