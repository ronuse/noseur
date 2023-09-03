
import React from "react";
import "../Composed.css";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { MicroBuilder } from "../../utils/MicroBuilder";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { NoseurLabel, NoseurObject } from "../../constants/Types";

interface FormGroupProps extends ComponentBaseProps<HTMLDivElement> {
    isValid: boolean;
    labelFor: string;
    label: NoseurLabel;
    infoLabel: NoseurLabel;
    helpLabel: NoseurLabel;
    children: React.ReactNode;
}

interface FormGroupState {
};

class FormGroupComponent extends React.Component<FormGroupProps, FormGroupState> {

    public static defaultProps: Partial<FormGroupProps> = {
        isValid: true,
    }

    state: FormGroupState = {
        
    };

    constructor(props: FormGroupProps) {
        super(props);
    }

    render() {
        const helpLabelClassName = !this.props.isValid && !this.props.scheme ? "noseur-fgrp-hl noseur-danger-tx" : "noseur-fgrp-hl";
        const label = MicroBuilder.buildLabel(this.props.label, { scheme: this.props.scheme, className: "noseur-fgrp-l" });
        const helpLabel = MicroBuilder.buildLabel(this.props.helpLabel, { scheme: this.props.scheme, className: helpLabelClassName });
        const infoLabel = MicroBuilder.buildLabel(this.props.infoLabel, { scheme: this.props.scheme, className: "noseur-fgrp-il" });
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props: NoseurObject = {
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
            className: "noseur-fgrp",
        };
        delete props.children;

        return (<div {...props}>
            {label}
            {this.props.children}
            {this.props.isValid ? infoLabel : helpLabel}
        </div>);
    }

}

export const FormGroup = React.forwardRef<HTMLDivElement, Partial<FormGroupProps>>((props, ref) => (
    <FormGroupComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

