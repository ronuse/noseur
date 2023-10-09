
import "../Composed.css";
import React from "react";
import { Classname } from "../../utils/Classname";
import { TypeChecker } from "../../utils/TypeChecker";
import { MicroBuilder } from "../../utils/MicroBuilder";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { InputProps, TextInput } from "../../form/Input";
import { FormControl, FormControlProps } from "./FormControl";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";
import { NoseurElement, NumberRange } from "../../constants/Types";
import { ProgressBar, ProgressBarProps } from "../../misc/ProgressBar";

export type ComposedPasswordEventHandler = () => void;
export type ComposedPasswordStrengthHandler = (value: string) => NumberRange<0, 100>;
export type ComposedPasswordToggleIcons = { show: NoseurElement, hide: NoseurElement };

export interface ComposedPasswordProps extends ComponentBaseProps<HTMLDivElement> {
    hidden: boolean;
    toggleMask: boolean;
    inputProps: Partial<InputProps>;
    toggleIcons: ComposedPasswordToggleIcons;
    progressProps: Partial<ProgressBarProps>;
    strengthIndicator: boolean | NoseurElement;
    formControlProps: Partial<FormControlProps>;

    onShow: ComposedPasswordEventHandler;
    onHide: ComposedPasswordEventHandler;
    computeStrength: ComposedPasswordStrengthHandler;
}

interface ComposedPasswordState {
    hidden: boolean;
};

// 20% symbol
// 20% number
// 20% lowercase
// 20% uppercase
// 20% less than 6 char long
function defaultStrengthComputer(value: string): NumberRange<0, 100> {
    let progressValue = 100;
    if (value.length < 6) progressValue -= 20;
    if (!(/\d/.test(value))) progressValue -= 20;
    if (!(/[a-z]/.test(value))) progressValue -= 20;
    if (!(/[A-Z]/.test(value))) progressValue -= 20;
    if (!(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value))) progressValue -= 20;
    return progressValue;
}

class ComposedPasswordComponent extends React.Component<ComposedPasswordProps, ComposedPasswordState> {

    public static defaultProps: Partial<ComposedPasswordProps> = {
        hidden: true,
        toggleMask: true,
        inputProps: {} as any,
        progressProps: {} as any,
        formControlProps: {} as any,
        toggleIcons: {
            show: 'fa fa-eye',
            hide: 'fa fa-eye-slash'
        },
        computeStrength: defaultStrengthComputer
    }

    state: ComposedPasswordState = {
        hidden: true,
    };

    progressBarComponent: any;

    constructor(props: ComposedPasswordProps) {
        super(props);

        this.onInput = this.onInput.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    onInput(e: any) {
        const value = e.target.value;
        if (this.props.onInput) this.props.onInput(e);
        if (!TypeChecker.isBoolean(this.props.strengthIndicator) || !this.props.strengthIndicator || !this.progressBarComponent) return;
        this.progressBarComponent?.setValue(this.props.computeStrength(value));
    }

    onToggle(_: any) {
        if (this.state.hidden && this.props.onShow) this.props.onShow();
        else if (this.props.onHide) this.props.onHide();
        this.setState({ hidden: !this.state.hidden });
    }

    renderToggleIcon() {
        if (!this.props.toggleMask || !this.props.toggleIcons) return;
        const icon = this.state.hidden ? this.props.toggleIcons.show : this.props.toggleIcons.hide;
        return MicroBuilder.buildIcon(icon, { scheme: this.props.scheme, className: "noseur-cursor-pointer" }, {
            onClick: this.onToggle
        });
    }

    renderStrengthIndictor() {
        if (!TypeChecker.isBoolean(this.props.strengthIndicator) || !this.props.strengthIndicator) return this.props.strengthIndicator;
        const cachedSelfRef = this.props.progressProps.selfRef as any;
        const progressProps = {
            ...this.props.progressProps,
            selfRef: (r: any) => {
                this.progressBarComponent = r;
                ObjectHelper.resolveRef(cachedSelfRef, r);
            }
        };
        return (<ProgressBar {...progressProps} noLabel={progressProps.noLabel || true} scheme={progressProps.scheme || this.props.scheme} />);
    }

    render() {
        const icon = this.renderToggleIcon();
        const strengthIndicator = this.renderStrengthIndictor();
        const inputType = (this.state.hidden ? "password" : "text");
        const className = Classname.build("noseur-composed-password", this.props.className);

        return (<div className={className} style={this.props.style}>
            <FormControl {...this.props.formControlProps} rightContent={icon} scheme={this.props.formControlProps.scheme || this.props.scheme}>
                <TextInput {...this.props.inputProps} type={inputType} id={this.props.id} name={this.props.name}
                    noStyle={this.props.inputProps.noStyle || true} scheme={this.props.inputProps.scheme || this.props.scheme} onInput={this.onInput} />
            </FormControl>
            {strengthIndicator}
        </div>);
    }

}

export const ComposedPassword = React.forwardRef<HTMLDivElement, Partial<ComposedPasswordProps>>((props, ref) => (
    <ComposedPasswordComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

