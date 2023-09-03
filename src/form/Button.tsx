
import "./Form.css";
import React from 'react';
import { Scheme } from '../constants/Scheme';
import { Classname } from '../utils/Classname';
import { Alignment } from '../constants/Alignment';
import { ObjectHelper } from '../utils/ObjectHelper';
import { MicroBuilder } from "../utils/MicroBuilder";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurButtonElement, NoseurIconElement, NoseurLabel, NoseurObject } from '../constants/Types';

interface ButtonProps extends ComponentBaseProps<NoseurButtonElement> {
    link: string;
    fill: boolean;
    raised: boolean;
    rounded: boolean;
    iconOnly: boolean;
    textOnly: boolean;
    outlined: boolean;
    text: NoseurLabel;
    linkTarget: string;
    borderless: boolean;
    fillOnHover: boolean;
    fillLeftIcon: boolean;
    rippleEffect: boolean;
    leftIcon: NoseurIconElement;
    rightIcon: NoseurIconElement;
    leftIconRelativeAlignment: Alignment;
    rightIconRelativeAlignment: Alignment;
};

interface ButtonState {
    children: React.ReactNode;
    rippleState: { isRippling: boolean, x: number, y: number, diameter?: number };
};

class ButtonComponent extends React.Component<ButtonProps, ButtonState> {

    public static defaultProps: Partial<ButtonProps> = {
        scheme: Scheme.STATELESS,
        leftIconRelativeAlignment: Alignment.LEFT,
        rightIconRelativeAlignment: Alignment.RIGHT,
    };

    state: ButtonState = {
        rippleState: { isRippling: false, x: -1, y: -1 },
        children: this.props.children || this.props.text,
    };

    constructor(props: ButtonProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidUpdate(_: Readonly<ButtonProps>, prevState: Readonly<ButtonState>) {
        if (prevState.rippleState.isRippling != this.state.rippleState.isRippling && !this.state.rippleState.isRippling) {
            this.setState({ rippleState: { ...this.state.rippleState, x: -1, y: -1 } });
        }
        if ((prevState.rippleState.x != this.state.rippleState.x) && (prevState.rippleState.y != this.state.rippleState.y)) {
            if (this.state.rippleState.x != -1 && this.state.rippleState.y != -1) {
                this.setState({ rippleState: { ...this.state.rippleState, isRippling: true } });
                setTimeout(() => this.setState({ rippleState: { ...this.state.rippleState, isRippling: false } }), 300);
            } else {
                this.setState({ rippleState: { ...this.state.rippleState, isRippling: false } });
            }
        }
    }

    onClick(event: React.MouseEvent<NoseurButtonElement>) {
        const button = (event.currentTarget as NoseurButtonElement);
        const rect = (event.target as NoseurButtonElement).getBoundingClientRect();
        this.setState({
            rippleState: {
                diameter: button.clientHeight,
                isRippling: false,
                y: event.clientY - rect.top,
                x: event.clientX - rect.left
            }
        });
        this.props.onClick && this.props.onClick(event);
    }

    render() {
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const className = Classname.build(
            (!this.props.noStyle && this.props.raised) ? `${this.props.scheme}-bd-rd` : null,
            (!this.props.noStyle && this.props.scheme) ? `${this.props.scheme}-bd-3px-bx-sw-ac` : null,
            (!this.props.noStyle && this.props.scheme) ? `${this.props.scheme}-bd-3px-bx-sw-fc` : null,
            (!this.props.noStyle && !this.props.textOnly && !this.props.outlined) ? this.props.scheme : null,
            (!this.props.noStyle && this.props.scheme && this.props.outlined) ? `${this.props.scheme}-bd-cl` : null,
            (!this.props.noStyle && this.props.scheme && (this.props.outlined || this.props.textOnly)) ? `${this.props.scheme}-tx` : null,
            (!this.props.noStyle && this.props.rippleEffect && (this.props.outlined || this.props.textOnly)) ? `${this.props.scheme}-rp` : null,
            (!this.props.noStyle && this.props.scheme && (this.props.outlined || this.props.textOnly) && this.props.fillOnHover) ? `${this.props.scheme}-bg-hv` : null,
            {
                'noseur-wd-100-pct': this.props.fill,
                'noseur-pd-10': !this.state.children && !this.props.iconOnly,
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
        if (this.state.rippleState.isRippling) {
            const style = {
                width: this.state.rippleState.diameter,
                height: this.state.rippleState.diameter,
                left: this.state.rippleState.x, right: this.state.rippleState.x,
            };
            children.push((<span className="noseur-rp" style={style}></span>));
        }
        const props: NoseurObject = {
            children,
            className,
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
        };
        if (this.props.rippleEffect) props.onClick = this.onClick;

        return (!this.props.link
            ? <button ref={this.props.forwardRef as React.ForwardedRef<HTMLButtonElement>} {...props} />
            : <a ref={this.props.forwardRef as React.ForwardedRef<HTMLAnchorElement>} {...props} href={this.props.link} target={this.props.linkTarget} />);
    }

}

export const Button = React.forwardRef<HTMLButtonElement, Partial<ButtonProps>>((props, ref) => (
    <ButtonComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurButtonElement>} />
));
