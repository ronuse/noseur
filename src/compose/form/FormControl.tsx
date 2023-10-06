
import "../Composed.css";
import React from "react";
import { Scheme } from "../../constants/Scheme";
import { Classname } from "../../utils/Classname";
import { TypeChecker } from "../../utils/TypeChecker";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { MicroBuilder } from "../../utils/MicroBuilder";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { NoseurLabel, NoseurObject, NoseurElement } from "../../constants/Types";

export interface FormControlProps extends ComponentBaseProps<HTMLDivElement> {
    invalid: boolean;
    labelFor: string;
    tabIndex: number;
    leftContent: any;
    rightContent: any;
    required: boolean;
    highlight: boolean;
    label: NoseurLabel;
    borderless: boolean;
    contentStyle: Object;
    invalidScheme: Scheme;
    infoLabel: NoseurLabel;
    helpLabel: NoseurLabel;
    children?: NoseurElement;
    centerOverlayContent: any;
    childrenProps: NoseurObject<any>;
    childrenValidPropsMap: NoseurObject<any>;
    childrenInvalidPropsMap: NoseurObject<any>;
}

interface FormControlState {
};

class FormControlComponent extends React.Component<FormControlProps, FormControlState> {

    public static defaultProps: Partial<FormControlProps> = {
        tabIndex: 0,
        invalid: false,
        invalidScheme: Scheme.DANGER,
        childrenValidPropsMap: {
            "borderless": true,
        },
        childrenInvalidPropsMap: {
            "highlight": true,
            "borderless": true,
            "scheme": "{invalidScheme}"
        }
    }

    state: FormControlState = {
    };

    constructor(props: FormControlProps) {
        super(props);
    }

    mapComponentProperties(childrenProps: NoseurObject<any>, propsMap: NoseurObject<any>) {
        Object.keys(propsMap || {}).forEach((prop: string) => {
            let propValue = propsMap[prop];
            if (TypeChecker.isString(propValue) && propValue.startsWith("{") && propValue.endsWith("}")) {
                propValue = (this.props as any)[(propValue as string).substring(1, propValue.length - 1)];
            }
            const previousValue = childrenProps[prop];
            if (previousValue && !TypeChecker.isString(previousValue)) {
                childrenProps[prop] = ObjectHelper.joinValues(previousValue, propValue);
            } else {
                childrenProps[prop] = propValue;
            }
        })
    }

    renderLeftContent() {
        if (!this.props.leftContent) return;
        let className = "noseur-fctrl-lc";
        let leftContent = this.props.leftContent;
        const scheme = !this.props.invalid ? this.props.scheme : this.props.invalidScheme;
        if (TypeChecker.isString(leftContent)) {
            if (scheme) className += ` ${scheme}-tx`;
            leftContent = <i className={leftContent} />;
        }
        return (<div className={className}>{leftContent}</div>);
    }

    renderRightContent() {
        if (!this.props.rightContent) return;
        let className = "noseur-fctrl-rc";
        let rightContent = this.props.rightContent;
        const scheme = !this.props.invalid ? this.props.scheme : this.props.invalidScheme;
        if (TypeChecker.isString(rightContent)) {
            if (scheme) className += ` ${scheme}-tx`;
            rightContent = <i className={rightContent} />;
        }
        return (<div className={className}>{rightContent}</div>);
    }

    renderCenterOverlayContent() {
        if (!this.props.centerOverlayContent) return;
        let className = "noseur-fctrl-coc";
        let centerOverlayContent = this.props.centerOverlayContent;
        const scheme = !this.props.invalid ? this.props.scheme : this.props.invalidScheme;
        if (TypeChecker.isString(centerOverlayContent)) {
            if (scheme) className += ` ${scheme}-tx`;
            centerOverlayContent = <i className={centerOverlayContent} />;
        }
        return (<div className={className}>{centerOverlayContent}</div>);
    }

    renderChildren() {
        const children = [].concat(this.props.children as any);
        return children.map((child: any, index: number) => {
            if (!child) return child;
            const childrenOwnScheme = child.props?.scheme;
            const childrenProps: NoseurObject<any> = { ...(this.props.childrenProps || {}),  ...(child.props || {}) };
            if (this.props.required) childrenProps.required = true;
            if (!childrenOwnScheme) childrenProps.scheme = this.props.scheme;
            childrenProps.className = Classname.build("noseur-fctrl-cc", childrenProps.className);
            if (!childrenProps.key) childrenProps.key = index;
            this.mapComponentProperties(childrenProps, (!this.props.invalid ? this.props.childrenValidPropsMap : this.props.childrenInvalidPropsMap));
            return React.cloneElement(child, childrenProps);
        });
    }

    render() {
        const leftContent = this.renderLeftContent();
        const rightContent = this.renderRightContent();
        const centerOverlayContent = this.renderCenterOverlayContent();
        const scheme = this.props.invalid ? this.props.invalidScheme : this.props.scheme;
        const helpLabelClassName = this.props.invalid && !this.props.scheme ? "noseur-fctrl-hl noseur-invalid-tx" : "noseur-fctrl-hl";
        const infoLabel = !this.props.invalid ? MicroBuilder.buildLabel(this.props.infoLabel, { scheme: this.props.scheme, className: "noseur-fctrl-il" }) : null;
        const helpLabel = this.props.invalid ? MicroBuilder.buildLabel(this.props.helpLabel, { scheme: this.props.scheme, className: helpLabelClassName }) : null;
        const label = MicroBuilder.buildLabel(this.props.label, { scheme: this.props.scheme, type: "label", htmlFor: this.props.labelFor, className: "noseur-fctrl-l" });
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props: NoseurObject<any> = {
            ...eventProps,
            id: this.props.id,
            key: this.props.key,
            style: this.props.style,
            required: this.props.required,
            className: Classname.build("noseur-fctrl", this.props.className),
        };
        delete props.children;
        const className = Classname.build("noseur-fctrl-c", {
                'noseur-no-bd': this.props.borderless,
            },
            (scheme && this.props.highlight) ? `${scheme}-bd-cl` : null,
            this.props.invalid ? `${this.props.invalidScheme}-bd-cl` : null,
            (scheme) ? `${scheme}-bd-3px-bx-sw-fc ${scheme}-bd-cl-fc ${scheme}-bd-cl-hv` : null);
        const children = this.renderChildren();

        return (<div ref={this.props.forwardRef as React.ForwardedRef<HTMLDivElement>} {...props}>
            {label}
            <div className={className} tabIndex={this.props.tabIndex} style={this.props.contentStyle}>
                {leftContent}
                {children}
                {centerOverlayContent}
                {rightContent}
            </div>
            {!this.props.invalid ? infoLabel : helpLabel}
        </div>);
    }

}

export const FormControl = React.forwardRef<HTMLDivElement, Partial<FormControlProps>>((props, ref) => (
    <FormControlComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

