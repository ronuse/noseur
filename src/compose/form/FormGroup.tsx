
import "../Composed.css";
import React from "react";
import { NoseurObject } from "../../constants/Types";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { Classname } from "../../utils/Classname";
import { TypeChecker } from "../../utils/TypeChecker";

export interface FormGroupProps extends ComponentBaseProps<HTMLFormElement> {
    method: string;
    action: string;
    childrenClassname: string;
    childrenProps: NoseurObject<any>;
    childrenStyle: React.CSSProperties | undefined;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
}

interface FormGroupState {
};

class FormGroupComponent extends React.Component<FormGroupProps, FormGroupState> {

    public static defaultProps: Partial<FormGroupProps> = {
        method: "POST",
        childrenStyle: {},
        childrenProps: {},
    }

    state: FormGroupState = {
    };

    constructor(props: FormGroupProps) {
        super(props);

        this.resolveChildren = this.resolveChildren.bind(this);
    }

    resolveChildren(parent: any) {
        if (!parent) return;
        const children: any = (parent as any).length != undefined ? parent : [parent];
        if (!children.length) return;
        return children.map((child: any, index: number) => {
            if (!child) return;
            if (TypeChecker.isArray(child)) return this.resolveChildren(child);
            if (!React.isValidElement(child)) return child;
            const props = {
                ...(child.props as any),
                ...this.props.childrenProps,
                scheme: (child.props as any).scheme || this.props.scheme,
            };
            if (!props.key) props.key = index;
            const cachedStyle = props.style || {};
            const cachedClassname = props.className;
            props.style = { ...this.props.childrenStyle, ...cachedStyle };
            props.className = Classname.build(this.props.childrenClassname, cachedClassname);

            return React.cloneElement(child, props);
        });
    }

    render() {
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props: NoseurObject<any> = {
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
            className: Classname.build("noseur-fgrp", this.props.className),
        };
        delete props.children;

        return (<form {...props} method={this.props.method} action={this.props.action} onSubmit={this.props.onSubmit || ((e: any) => e.preventDefault())}>
            {this.resolveChildren(this.props.children as any)}
        </form>);
    }

}

export const FormGroup = React.forwardRef<HTMLFormElement, Partial<FormGroupProps>>((props, ref) => (
    <FormGroupComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLFormElement>} />
));

export const Form = FormGroup;

