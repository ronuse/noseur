
import "./Misc.css";
import React from 'react';
import { Scheme } from '../constants/Scheme';
import { Classname } from '../utils/Classname';
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurLabel, NoseurNummber, NoseurNumberedObject, NumberRange, NoseurObject } from "../constants/Types";

export interface ProgressBarManageRef {
    getValue: () => NumberRange<0, 100>;
    setValue: (value: NumberRange<0, 100>) => void;
}

export enum ProgressBarMode {
    DETERMINATE,
    INDETERMINATE
}

export interface ProgressBarProps extends ComponentBaseProps<HTMLDivElement, ProgressBarManageRef> {
    style: {},
    stripped: boolean;
    noLabel: boolean;
    mode: ProgressBarMode;
    value: NumberRange<0, 100>;
    labeltemplate: (value: NoseurNummber) => string;
    percentageColors: NoseurNumberedObject<NoseurObject<string>>;
}

interface ProgressBarState {
    currentValue: NumberRange<0, 100>;
};

// TODO color per percentage
class ProgressBarComponent extends React.Component<ProgressBarProps, ProgressBarState> {

    public static defaultProps: Partial<ProgressBarProps> = {
        scheme: Scheme.PRIMARY,
        mode: ProgressBarMode.DETERMINATE
    };

    state: ProgressBarState = {
        currentValue: this.props.value
    };

    componentDidMount(): void {
        ObjectHelper.resolveManageRef(this, {
            getValue: () => this.state.currentValue,
            setValue: (value: NumberRange<0, 100>) => this.setState({ currentValue: value }),
        });
    }

    componentDidUpdate(): void {
        if (this.state.currentValue !== this.props.value) {
            this.setState({ currentValue: this.props.value });
        }
    }

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
    }

    getPercentageColor(value: NumberRange<0, 100>) {
        if (!this.props.percentageColors) return;
        const percentages = Object.keys(this.props.percentageColors).reverse() as any as number[];
        for (const percentage of percentages) {
            if (value! >= percentage) {
                return this.props.percentageColors[percentage];
            }
        }
        return;
    }

    buildDeterminant(value: NumberRange<0, 100>, label: NoseurLabel, percentageColor?: NoseurObject<string>) {
        const style = { width: `${value}%`, background: percentageColor ? percentageColor["fg"] : undefined };
        const className = Classname.build("noseur-progress-bar-determinant", this.props.scheme);
        const props = {
            style,
            className
        }
        return (<div {...props}>{label}</div>)
    }

    buildInDeterminant() {
        const className = Classname.build("noseur-progress-bar-indeterminate", this.props.scheme);
        return (<div className={className} />);
    }

    buildLabel(value: NumberRange<0, 100>) {
        if (this.props.noLabel) return null;
        const label = this.props.labeltemplate ? this.props.labeltemplate(3) : value + "%";
        return <span className="noseur-progress-bar-label">{label}</span>;
    }

    render() {
        const className = Classname.build("noseur-progress-bar", {
            'noseur-disabled': !this.props.noStyle && this.props.disabled,
        }, this.props.className);
        let value = (this.state.currentValue && this.state.currentValue < 0 ? 0 : this.state.currentValue);
        value = (value && value > 100 ? 100 : value);
        const label = this.buildLabel(value);
        const percentageColor = this.getPercentageColor(value);
        const style = percentageColor ? { ...this.props.style, background: percentageColor["bg"] } : this.props.style;
        const bar = this.props.mode === ProgressBarMode.DETERMINATE ? this.buildDeterminant(value, label, percentageColor) : this.buildInDeterminant();
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props = {
            style,
            className,
            ...eventProps,
            id: this.props.id,
            key: this.props.key,
        };
        return (<div ref={this.props.forwardRef as React.ForwardedRef<HTMLDivElement>} {...props}>{bar}</div>)
    }

}

export const ProgressBar = React.memo(React.forwardRef<HTMLElement, Partial<ProgressBarProps>>((props, ref) => (
    <ProgressBarComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
)));

