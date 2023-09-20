
import "../Composed.css";
import React from "react";
import { NoseurObject } from "../../constants/Types";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";

export interface FormGroupProps extends ComponentBaseProps<HTMLDivElement> {
}

interface FormGroupState {
};

class FormGroupComponent extends React.Component<FormGroupProps, FormGroupState> {

    public static defaultProps: Partial<FormGroupProps> = {
    }

    state: FormGroupState = {
    };

    constructor(props: FormGroupProps) {
        super(props);
    }

    render() {
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props: NoseurObject<any> = {
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
            className: "noseur-fgrp",
        };
        delete props.children;

        return (<div {...props}>
            {[ this.props.children ].map(child => {
                if (!child) return;
                return React.isValidElement(child) ? React.cloneElement(child, { scheme: this.props.scheme } as any) : child;
            })}
        </div>);
    }

}

export const FormGroup = React.forwardRef<HTMLDivElement, Partial<FormGroupProps>>((props, ref) => (
    <FormGroupComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

