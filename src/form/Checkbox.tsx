
import "./Form.css";
import React from 'react';
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { Alignment } from "../constants/Alignment";
import { ObjectHelper } from "../utils/ObjectHelper";
import { MicroBuilder } from "../utils/MicroBuilder";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurFormElement, NoseurCheckState, NoseurLabel, NoseurNummber } from "../constants/Types";

interface CheckboxProps extends ComponentBaseProps<NoseurFormElement | HTMLLabelElement> {
    checked: boolean;
    readOnly: boolean;
    required: boolean;
    label: NoseurLabel;
    highlight: boolean;
    alignLabel: Alignment;
    defaultChecked: boolean;
    alwaysRenderInput: boolean;
    checkedIndex: NoseurNummber;
    checkStates: NoseurCheckState[];
    defaultCheckedIndex: NoseurNummber;
}

interface CheckboxState {
    checkedIndex: number;
};

class CheckboxComponent extends React.Component<CheckboxProps, CheckboxState> {

    public static defaultProps: Partial<CheckboxProps> = {
        scheme: Scheme.STATELESS,
        alignLabel: Alignment.RIGHT,
        checkStates: [
            {
                icon: null,
                checked: false,
                scheme: Scheme.NIL,
                value: "un-checked",
            },
            {
                checked: true,
                value: "checked",
                icon: "fa fa-check",
                scheme: Scheme.PRIMARY,
            }
        ]
    };

    state: CheckboxState = {
        checkedIndex: this.getFirstCheckedValue(),
    };

    constructor(props: CheckboxProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onCheckBoxClicked = this.onCheckBoxClicked.bind(this);
    }

    onClick(event: React.MouseEvent<HTMLLabelElement>) {
        this.props.onClick && this.props.onClick(event);
        event.stopPropagation();
        this.onCheckBoxClicked(event);
    }

    onKeyDown(event: React.KeyboardEvent<NoseurFormElement>) {
        this.props.onKeyDown && this.props.onKeyDown(event);
        if (event.code == "Space") {
            event.preventDefault();
            event.stopPropagation();
            this.onCheckBoxClicked(event);
        }
    }

    onCheckBoxClicked(event: React.FormEvent<NoseurFormElement | HTMLLabelElement>) {
        if (this.props.readOnly) return;
        let checkedIndex = this.getCheckStatesIndex();
        if (this.props.onChange) {
            const checkState = this.props.checkStates[checkedIndex+1];
            this.props.onChange({
                ...event,
                checkState,
                value: checkState?.value,
                checked: !!checkState?.checked
            } as any);
        }
        this.setState({ checkedIndex: checkedIndex + 1 });
    }

    getCheckStatesIndex() {
        if (this.props.checkedIndex) return this.props.checkedIndex;
        if (this.props.checked || this.props.checkedIndex != null) return this.getFirstCheckedValue();
        const checkStatesSize = this.props.checkStates.length;
        let checkedIndex = this.state.checkedIndex;
        if (checkedIndex >= checkStatesSize) {
            checkedIndex = 0;
        }
        return checkedIndex;
    }

    getFirstCheckedValue() {
        if (this.props.checkStates.length == 2 && this.props.checkStates[0].scheme == Scheme.NIL) {
            if (this.props.checked || this.props.defaultChecked) return 1;
            if (this.props.checkedIndex != null) return this.props.checkedIndex;
            if (this.props.defaultCheckedIndex != null) return this.props.defaultCheckedIndex;
        }
        return 0;
    }

    buildInput(checkState: NoseurCheckState) {
        if (!checkState.checked && !this.props.alwaysRenderInput) return;
        const props = {
            id: this.props.id,
            name: this.props.name,
            checked: checkState.checked,
            required: this.props.required,

            onClick: () => {},
            onChange: (e: React.FormEvent<NoseurFormElement>) => { e.stopPropagation();}
        };
        return <input type="checkbox" {...props} />
    }

    buildBox(checkState: NoseurCheckState) {
        const scheme = this.props.checkStates.length == 2 && this.props.checkStates[0].scheme == Scheme.NIL
            ? this.props.scheme : (checkState.scheme || this.props.scheme);
        const className = Classname.build("noseur-checkbox-box",
            (!this.props.noStyle && scheme) ? `${scheme}-bd-3px-bx-sw-fc` : null,
            (!this.props.noStyle && !checkState.scheme) ? `noseur-form-bd-cl` : null,
            (!this.props.noStyle && checkState.scheme) ? scheme : null,
            (!this.props.noStyle && this.props.highlight) ? `${scheme}-bd-cl` : null,
            (!this.props.noStyle && scheme) ? `${scheme}-bd-cl-fc ${scheme}-bd-cl-hv ${scheme}-bd-cl-ac` : null,
            {
                'noseur-skeleton': scheme === Scheme.SKELETON,
            }, this.props.className);
        const icon = MicroBuilder.buildIcon(checkState.icon, {
            scheme: checkState.scheme
        });
        const props = {
            className,
            tabIndex: 1,

            onClick: this.onClick,
            onKeyDown: this.onKeyDown,
        };
        return (<span {...props}>{icon}</span>)
    }

    render() {
        const checkState = this.props.checkStates[this.getCheckStatesIndex()];
        const box = this.buildBox(checkState);
        const input = this.buildInput(checkState);
        const label = MicroBuilder.buildLabel(this.props.label, {
            scheme: this.props.scheme,
            relativeAlignment: this.props.alignLabel,
        }, { onClick: this.onClick });
        const className = Classname.build("noseur-checkbox", {
            'noseur-fl-d-c-r': this.props.alignLabel === Alignment.TOP,
            'noseur-fl-d-r-r': this.props.alignLabel === Alignment.LEFT,
            'noseur-fl-d-c': this.props.alignLabel === Alignment.BOTTOM,
            'noseur-disabled': !this.props.noStyle && this.props.disabled,
        });
        const eventProps = ObjectHelper.extractEventProps(this.props);
        const props = {
            className,
            ...eventProps,
            key: this.props.key,
            style: this.props.style,
        };

        return (<label ref={this.props.forwardRef as React.ForwardedRef<HTMLLabelElement>} {...props}>{box}{label}{input}</label>)
    }

}

export const Checkbox = React.forwardRef<HTMLElement, Partial<CheckboxProps>>((props, ref) => (
    <CheckboxComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurFormElement | HTMLLabelElement>} />
));
