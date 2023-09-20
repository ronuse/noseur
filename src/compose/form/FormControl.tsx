
import "../Composed.css";
import React from "react";
import { Scheme } from "../../constants/Scheme";
import { DOMHelper } from "../../utils/DOMUtils"; 
import { Classname } from "../../utils/Classname";
import { TypeChecker } from "../../utils/TypeChecker";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { MicroBuilder } from "../../utils/MicroBuilder";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { NoseurLabel, NoseurObject } from "../../constants/Types";
import { BoolHelper } from "../../utils/BoolHelper";

export interface FormControlProps extends ComponentBaseProps<HTMLDivElement> {
    invalid: boolean;
    labelFor: string;
    tabIndex: number;
    leftContent: any;
    rightContent: any;
    required: boolean;
    label: NoseurLabel;
    invalidScheme: Scheme;
    infoLabel: NoseurLabel;
    helpLabel: NoseurLabel;
    centerOverlayContent: any;
    children: React.ReactElement;
    childrenInvalidPropsMap: NoseurObject<any>;
}

interface FormControlState {
};

class FormControlComponent extends React.Component<FormControlProps, FormControlState> {

    public static defaultProps: Partial<FormControlProps> = {
        tabIndex: -1,
        invalid: false,
        invalidScheme: Scheme.DANGER,
        childrenInvalidPropsMap: {
            "highlight": true,
            "borderless": false,
            "scheme": "{invalidScheme}"
        }
    }

    state: FormControlState = {
    };

    leftContentInternalElement: any;
    rightContentInternalElement: any;
    centerContentInternalElement: any;
    centerOverlayContentInternalElement: any;

    constructor(props: FormControlProps) {
        super(props);
    }

    componentDidMount() {
        this.resolveRelativeness(this.leftContentInternalElement);
        this.resolveRelativeness(this.rightContentInternalElement, "right");
    }

    componentDidUpdate(prevProps: any, _: any) {
        if (this.props.leftContent && !BoolHelper.deepEqual(prevProps.leftContent, this.props.leftContent, ["id", "style", "className", "img", "key", "props", "type"])) {
            this.resolveRelativeness(this.leftContentInternalElement);
        }
        if (!this.props.leftContent && prevProps.leftContent) this.centerContentInternalElement.style["paddingLeft"] = "11.2px";
        if (this.props.rightContent && !BoolHelper.deepEqual(prevProps.rightContent, this.props.rightContent, ["id", "style", "className", "img", "key", "props", "type"])) {
            this.resolveRelativeness(this.rightContentInternalElement, "right");
        }
        if (!this.props.rightContent && prevProps.rightContent) this.centerContentInternalElement.style["paddingRight"] = "11.2px";
    }

    resolveRelativeness(internalElement: any, side: any = "left") {
        if (!internalElement) return;
        const styleKey = side == "left" ? "paddingLeft" : "paddingRight";
        const elementComputedStyle = window.getComputedStyle(internalElement, null);
        const contentPadding = DOMHelper.sanitizeStyleValue(elementComputedStyle.width)
            + DOMHelper.sanitizeStyleValue(elementComputedStyle[side]);
        if (this.centerContentInternalElement) this.centerContentInternalElement.style[styleKey] = contentPadding + "px";
        if (this.centerOverlayContentInternalElement) {
            delete this.centerOverlayContentInternalElement.style["left"];
            delete this.centerOverlayContentInternalElement.style["right"];
            delete this.centerOverlayContentInternalElement.style["paddingLeft"];
            delete this.centerOverlayContentInternalElement.style["paddingRight"];
            this.centerOverlayContentInternalElement.style[styleKey] = contentPadding + "px";
        }
    }

    mapInvalidProperties(childrenProps: NoseurObject<any>) {
        Object.keys(this.props.childrenInvalidPropsMap || {}).forEach((prop: string) => {
            let propValue = this.props.childrenInvalidPropsMap[prop];
            if (TypeChecker.isString(propValue) && propValue.startsWith("{") && propValue.endsWith("}")) {
                propValue = (this.props as any)[(propValue as string).substring(1, propValue.length-1)];
            }
            childrenProps[prop] = propValue;
        })
    }

    renderLeftContent() {
        if (!this.props.leftContent) return;
        let className = "noseur-fctrl-lc";
        let leftContent = this.props.leftContent;
        const scheme = !this.props.invalid ? this.props.scheme : this.props.invalidScheme;
        if (TypeChecker.isString(leftContent)) {
            if (scheme) className += ` ${scheme}-tx`;
            leftContent = <i className={leftContent}/>;
        }
        return (<div ref={(r) => this.leftContentInternalElement = r} className={className}>{leftContent}</div>);
    }

    renderRightContent() {
        if (!this.props.rightContent) return;
        let className = "noseur-fctrl-rc";
        let rightContent = this.props.rightContent;
        const scheme = !this.props.invalid ? this.props.scheme : this.props.invalidScheme;
        if (TypeChecker.isString(rightContent)) {
            if (scheme) className += ` ${scheme}-tx`;
            rightContent = <i className={rightContent}/>;
        }
        return (<div ref={(r) => this.rightContentInternalElement = r} className={className}>{rightContent}</div>);
    }

    renderCenterOverlayContent() {
        if (!this.props.centerOverlayContent) return;
        let className = "noseur-fctrl-coc";
        let centerOverlayContent = this.props.centerOverlayContent;
        const scheme = !this.props.invalid ? this.props.scheme : this.props.invalidScheme;
        if (TypeChecker.isString(centerOverlayContent)) {
            if (scheme) className += ` ${scheme}-tx`;
            centerOverlayContent = <i className={centerOverlayContent}/>;
        }
        return (<div ref={(r) => this.centerOverlayContentInternalElement = r} className={className}>{centerOverlayContent}</div>);
    }

    render() {
        const leftContent = this.renderLeftContent();
        const rightContent = this.renderRightContent();
        const centerOverlayContent = this.renderCenterOverlayContent();
        const helpLabelClassName = this.props.invalid && !this.props.scheme ? "noseur-fctrl-hl noseur-invalid-tx" : "noseur-fctrl-hl";
        const infoLabel = !this.props.invalid ? MicroBuilder.buildLabel(this.props.infoLabel, { scheme: this.props.scheme, className: "noseur-fctrl-il" }) : null;
        const helpLabel = this.props.invalid ? MicroBuilder.buildLabel(this.props.helpLabel, { scheme: this.props.scheme, className: helpLabelClassName }) : null;
        const label = MicroBuilder.buildLabel(this.props.label, { scheme: this.props.scheme, type: "label", htmlFor: this.props.labelFor, className: "noseur-fctrl-l" });
        const childrenOwnScheme = this.props.children.props?.scheme;
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const cachedChildrenRef: any = (this.props.children as any)?.ref;
        const props: NoseurObject<any> = {
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
            tabIndex: this.props.tabIndex,
            required: this.props.required,
            className: Classname.build("noseur-fctrl", this.props.className),
        };
        delete props.children;
        const childrenProps: NoseurObject<any> = {};
        if (this.props.required) childrenProps.required = true;
        if (!childrenOwnScheme) childrenProps.scheme = this.props.scheme;
        if (this.props.invalid) this.mapInvalidProperties(childrenProps);
        childrenProps.ref = (r: any) => {
            this.centerContentInternalElement = r;
            if (cachedChildrenRef) {
                if (TypeChecker.isFunction(cachedChildrenRef)) cachedChildrenRef(r);
                else cachedChildrenRef.current = r;
            }
        };
        const children = Object.keys(childrenProps).length ? React.cloneElement(this.props.children, childrenProps) : this.props.children;

        return (<div ref={this.props.forwardRef as React.ForwardedRef<HTMLDivElement>} {...props}>
            {label}
            <div className="noseur-fctrl-c">
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

