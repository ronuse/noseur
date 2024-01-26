
import "./Form.css";
import React from 'react';
import { Scheme } from '../constants/Scheme';
import { Classname } from '../utils/Classname';
import { Alignment } from '../constants/Alignment';
import { ObjectHelper } from '../utils/ObjectHelper';
import { MicroBuilder } from "../utils/MicroBuilder";
import { ComponentBaseProps, LoadingProps } from '../core/ComponentBaseProps';
import { NoseurButtonElement, NoseurElement, NoseurIconElement, NoseurObject } from '../constants/Types';

export interface ButtonManageRef {
    setLoadingState: (isLoading: boolean) => void;
}

export interface ButtonProps extends ComponentBaseProps<NoseurButtonElement, ButtonManageRef>, LoadingProps<ButtonProps> {
    type: string;
    link: string;
    fill: boolean;
    raised: boolean;
    rounded: boolean;
    iconOnly: boolean;
    textOnly: boolean;
    outlined: boolean;
    linkTarget: string;
    text: NoseurElement;
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
    isLoading: boolean,
    rippleState: { isRippling: boolean, x: number, y: number, diameter?: number };
};

class ButtonComponent extends React.Component<ButtonProps, ButtonState> {

    public static defaultProps: Partial<ButtonProps> = {
        scheme: Scheme.STATELESS,
        leftIconRelativeAlignment: Alignment.LEFT,
        rightIconRelativeAlignment: Alignment.RIGHT,
    };

    state: ButtonState = {
        isLoading: false,
        rippleState: { isRippling: false, x: -1, y: -1 },
    };

    constructor(props: ButtonProps) {
        super(props);
        
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            setLoadingState: (isLoading: boolean) => this.setState({ isLoading }),
        });
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

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
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
        const activeProps = {
            ...this.props,
            ...(this.state.isLoading ? (this.props.loadingProps || {}) : {})
        };
        const eventProps = ObjectHelper.extractEventProps(activeProps);
        const className = Classname.build(
            (!activeProps.noStyle && activeProps.raised) ? `${activeProps.scheme}-bd-rd` : null,
            (!activeProps.noStyle && activeProps.scheme) ? `${activeProps.scheme}-bd-3px-bx-sw-ac` : null,
            (!activeProps.noStyle && activeProps.scheme) ? `${activeProps.scheme}-bd-3px-bx-sw-fc` : null,
            (!activeProps.noStyle && !activeProps.textOnly && !activeProps.outlined) ? activeProps.scheme : null,
            (!activeProps.noStyle && activeProps.scheme && activeProps.outlined) ? `${activeProps.scheme}-bd-cl` : null,
            (!activeProps.noStyle && activeProps.scheme && (activeProps.outlined || activeProps.textOnly)) ? `${activeProps.scheme}-tx` : null,
            (!activeProps.noStyle && activeProps.rippleEffect && (activeProps.outlined || activeProps.textOnly)) ? `${activeProps.scheme}-rp` : null,
            (!activeProps.noStyle && activeProps.scheme && (activeProps.outlined || activeProps.textOnly) && activeProps.fillOnHover) ? `${activeProps.scheme}-bg-hv` : null,
            {
                'noseur-wd-auto': activeProps.fill,
                'noseur-disabled': !activeProps.noStyle && activeProps.disabled,
                'noseur-rounded-bd': !activeProps.noStyle && activeProps.rounded,
                'noseur-pd-10': !activeProps.children && !activeProps.text && !activeProps.iconOnly,
                'noseur-no-bg': !activeProps.noStyle && (activeProps.outlined || activeProps.textOnly),
                'noseur-no-bd': !activeProps.noStyle && (activeProps.borderless || (activeProps.textOnly && !activeProps.outlined)),
            }, "noseur-button", activeProps.className);
        const children: React.ReactNode[] = [];
        if (activeProps.text) children.push(activeProps.text);
        if (activeProps.children) children.push(activeProps.children);
        const rightIcon = MicroBuilder.buildIcon(activeProps.rightIcon, {
            scheme: activeProps.scheme,
            relativeAlignment: children.length ? activeProps.rightIconRelativeAlignment : Alignment.NONE
        });
        const leftIcon = MicroBuilder.buildIcon(activeProps.leftIcon, {
            scheme: activeProps.scheme,
            relativeAlignment: children.length ? activeProps.leftIconRelativeAlignment : Alignment.NONE,
            fillIcon: activeProps.fillLeftIcon
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
        const props: NoseurObject<any> = {
            children,
            className,
            ...eventProps,
            key: activeProps.key,
            type: this.props.type,
            style: activeProps.style,
        };
        if (activeProps.rippleEffect) props.onClick = this.onClick;

        return (!activeProps.link
            ? <button ref={this.props.forwardRef as React.ForwardedRef<HTMLButtonElement>} {...props} />
            : <a ref={this.props.forwardRef as React.ForwardedRef<HTMLAnchorElement>} {...props} href={activeProps.link} target={activeProps.linkTarget} />);
    }

}

export const Button = React.forwardRef<HTMLButtonElement, Partial<ButtonProps>>((props, ref) => (
    <ButtonComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurButtonElement>} />
));

export function buildButtonControl(control: Partial<ButtonProps> | NoseurElement, customNonOverridingProps: Partial<ButtonProps>, cb?: (e: any) => void, className?: string) {
    if (!control || React.isValidElement(control)) return control as any;
    const buttonProps: Partial<ButtonProps> = {
        ...customNonOverridingProps,
        ...(control as any),
        className: Classname.build(className, (control as any).className)
    };
    return <Button {...buttonProps} onClick={cb} />
}