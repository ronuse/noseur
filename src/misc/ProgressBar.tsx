
import "./Misc.css";
import React from 'react';
import { Scheme } from '../constants/Scheme';
import { Classname } from '../utils/Classname';
import { ObjectHelper } from "../utils/ObjectHelper";
import { MicroComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurLabel, NoseurNummber, NumberRange } from "../constants/Types";

export enum ProgressBarMode {
    DETERMINATE,
    INDETERMINATE
}


export interface ProgressBarProps extends MicroComponentBaseProps {
    stripped: boolean;
    noLabel: boolean;
    mode: ProgressBarMode;
    value: NumberRange<0, 100>;
    forwardRef: React.ForwardedRef<HTMLDivElement>;
    labeltemplate: (value: NoseurNummber) => string;
}

interface ProgressBarState {
};

class ProgressBarComponent extends React.Component<ProgressBarProps, ProgressBarState> {

    public static defaultProps: Partial<ProgressBarProps> = {
        scheme: Scheme.PRIMARY,
        mode: ProgressBarMode.DETERMINATE
    };

    state: ProgressBarState = {
    };

    buildDeterminant(label: NoseurLabel) {
        const style = { width: `${this.props.value}%` };
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

    buildLabel() {
        if (this.props.noLabel) return null;
        const label = this.props.labeltemplate ? this.props.labeltemplate(3) : this.props.value + "%";
        return <span className="noseur-progress-bar-label">{label}</span>;
    }

    render() {
        const className = Classname.build("noseur-progress-bar", {
            'noseur-disabled': !this.props.noStyle && this.props.disabled,
        });
        const label = this.buildLabel();
        const bar = this.props.mode === ProgressBarMode.DETERMINATE ? this.buildDeterminant(label) : this.buildInDeterminant();
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props = {
            className,
            ...eventProps,
            id: this.props.id,
            key: this.props.key,
            style: this.props.style,
        };
        return (<div ref={this.props.forwardRef as React.ForwardedRef<HTMLDivElement>} {...props}>{bar}</div>)
    }

}

export const ProgressBar = React.memo(React.forwardRef<HTMLElement, Partial<ProgressBarProps>>((props, ref) => (
    <ProgressBarComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
)));

