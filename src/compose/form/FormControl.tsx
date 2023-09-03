
import React from "react";
import "../Composed.css";
import { Scheme } from "../../constants/Scheme";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { MicroBuilder } from "../../utils/MicroBuilder";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { NoseurLabel, NoseurObject } from "../../constants/Types";

interface FormControlProps extends ComponentBaseProps<HTMLDivElement> {
    isValid: boolean;
    labelFor: string;
    required: boolean;
    label: NoseurLabel;
    infoLabel: NoseurLabel;
    helpLabel: NoseurLabel;
    children: React.ReactElement;
}

interface FormControlState {
};

class FormControlComponent extends React.Component<FormControlProps, FormControlState> {

    public static defaultProps: Partial<FormControlProps> = {
        isValid: true,
    }

    state: FormControlState = {
        
    };

    constructor(props: FormControlProps) {
        super(props);
    }

    render() {
        const infoLabel = MicroBuilder.buildLabel(this.props.infoLabel, { scheme: this.props.scheme, className: "noseur-fctrl-il" });
        const helpLabelClassName = !this.props.isValid && !this.props.scheme ? "noseur-fctrl-hl noseur-danger-tx" : "noseur-fctrl-hl";
        const helpLabel = MicroBuilder.buildLabel(this.props.helpLabel, { scheme: this.props.scheme, className: helpLabelClassName });
        const label = MicroBuilder.buildLabel(this.props.label, { scheme: this.props.scheme, type: "label", htmlFor: this.props.labelFor, className: "noseur-fctrl-l" });
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props: NoseurObject = {
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
            className: "noseur-fctrl",
            required: this.props.required,
        };
        delete props.children;
        const childrenProps: NoseurObject = {};
        if (this.props.required) childrenProps.required = true;
        if (!this.props.isValid) {
            childrenProps.highlight = true;
            childrenProps.scheme = Scheme.DANGER;
        }
        const children = Object.keys(childrenProps).length ? React.cloneElement(this.props.children, childrenProps) : this.props.children;

        return (<div {...props}>
            {label}
            {children}
            {this.props.isValid ? infoLabel : helpLabel}
        </div>);
    }

}

export const FormControl = React.forwardRef<HTMLDivElement, Partial<FormControlProps>>((props, ref) => (
    <FormControlComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

