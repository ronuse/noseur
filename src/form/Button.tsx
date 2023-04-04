
import "./Form.css";
import React from 'react';
import { Scheme } from '../constants/Scheme';
import { Classname } from '../utils/Classname';
import { Alignment } from '../constants/Alignment';
import { ObjectHelper } from '../utils/ObjectHelper';
import { MicroBuilder } from "../utils/MicroBuilder";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurButtonElement, NoseurIcon, NoseurLabel } from '../constants/Types';

interface ButtonProps extends ComponentBaseProps<NoseurButtonElement> {
    link: string;
    fill: boolean;
    raised: boolean;
    rounded: boolean;
    textOnly: boolean;
    outlined: boolean;
    text: NoseurLabel;
    linkTarget: string;
    borderless: boolean;
    fillOnHover: boolean;
    leftIcon: NoseurIcon;
    rightIcon: NoseurIcon;
    fillLeftIcon: boolean;
    leftIconRelativeAlignment: Alignment;
    rightIconRelativeAlignment: Alignment;
};

interface ButtonState {
    children: React.ReactNode;
};

export class ButtonComponent extends React.Component<ButtonProps, ButtonState> {

    public static defaultProps: Partial<ButtonProps> = {
        scheme: Scheme.STATELESS,
        leftIconRelativeAlignment: Alignment.LEFT,
        rightIconRelativeAlignment: Alignment.RIGHT,
    };

    state: ButtonState = {
        children: this.props.children || this.props.text,
    };

    

    render() {
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const className = Classname.build(
            (!this.props.noStyle && this.props.scheme) ? `${this.props.scheme}-bd-3px-bx-sw-ac` : null,
            (!this.props.noStyle && this.props.scheme) ? `${this.props.scheme}-bd-3px-bx-sw-fc` : null,
            (!this.props.noStyle && !this.props.textOnly && !this.props.outlined) ? this.props.scheme : null,
            (!this.props.noStyle && this.props.scheme && this.props.outlined) ? `${this.props.scheme}-bd-cl` : null,
            (!this.props.noStyle && this.props.scheme && (this.props.outlined || this.props.textOnly)) ? `${this.props.scheme}-tx` : null,
            (!this.props.noStyle && this.props.scheme && (this.props.outlined || this.props.textOnly) && this.props.fillOnHover) ? `${this.props.scheme}-bg-hv` : null,
            {
                'noseur-wd-100-pct': this.props.fill,
                'noseur-pd-10': !this.state.children,
                'noseur-raised-bd': !this.props.noStyle && this.props.raised,
                'noseur-disabled': !this.props.noStyle && this.props.disabled,
                'noseur-rounded-bd': !this.props.noStyle && this.props.rounded,
                'noseur-no-bg': !this.props.noStyle && (this.props.outlined || this.props.textOnly),
                'noseur-no-bd': !this.props.noStyle && (this.props.borderless || (this.props.textOnly && !this.props.outlined)),
            }, "noseur-button", this.props.className);
        const children: React.ReactNode[] = [];
        if (this.state.children) children.push(this.state.children);
        const rightIcon = MicroBuilder.buildIcon(this.props.rightIcon, {
            scheme: this.props.scheme,
            relativeAlignment: children.length ? this.props.rightIconRelativeAlignment : Alignment.NONE
        });
        const leftIcon = MicroBuilder.buildIcon(this.props.leftIcon, {
            scheme: this.props.scheme,
            relativeAlignment: children.length ? this.props.leftIconRelativeAlignment : Alignment.NONE,
            fillIcon: this.props.fillLeftIcon
        });
        if (rightIcon) children.push(rightIcon);
        if (leftIcon) children.unshift(leftIcon);
        const props = {
            children,
            className,
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
        };

        return (!this.props.link
            ? <button ref={this.props.forwardRef as React.ForwardedRef<HTMLButtonElement>} {...props} />
            : <a ref={this.props.forwardRef as React.ForwardedRef<HTMLAnchorElement>} {...props} href={this.props.link} target={this.props.linkTarget} />);
    }

}

export const Button = React.forwardRef<HTMLButtonElement, Partial<ButtonProps>>((props, ref) => (
    <ButtonComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurButtonElement>} />
));
