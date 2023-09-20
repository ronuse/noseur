
import "./Form.css";
import React from 'react';
import { Scheme } from '../constants/Scheme';
import { Classname } from "../utils/Classname";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { InputFilter, InputHelper } from "../utils/InputHelper";
import { NoseurFormElement, NoseurInputValue } from "../constants/Types";

export interface InputProps extends ComponentBaseProps<NoseurFormElement> {
    type: string;
    mask: string;
    fill: boolean;
    raised: boolean;
    rounded: boolean;
    filled: boolean;
    flushed: boolean;
    maskSlot: string;
    readOnly: boolean;
    required: boolean;
    highlight: boolean;
    borderless: boolean;
    inputFilter: RegExp;
    placeholder: string;
    defaultValue: NoseurInputValue;
    
    onInputEmpty: React.FormEventHandler<NoseurFormElement> | undefined;
    onFirstInput: React.FormEventHandler<NoseurFormElement> | undefined;
};

interface InputState {
    hasValue: boolean;
};

class Input extends React.Component<InputProps, InputState> {

    public static defaultProps: Partial<InputProps> = {
        type: "text",
        maskSlot: "X",
        scheme: Scheme.STATELESS,
    };

    state: InputState = {
        hasValue: !!this.props.defaultValue
    };

    constructor(props: InputProps) {
        super(props);

        this.onInput = this.onInput.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.resolveMask = this.resolveMask.bind(this);
        this.onPasteCapture = this.onPasteCapture.bind(this);
    }

    resolveMask(element: HTMLFormElement) {
        const value = element.value;
        const valueParts = value.split("");
        const maskParts = new Set(this.props.maskSlot);
        const resolvedValue = this.props.mask.split("");
        const [ from, to ] = [ element.selectionStart, element.selectionEnd ];
        console.log("SELECTEION", from, to);
        /*for (let index = 0, valueIndex = 0; index < resolvedValue.length && (!!valueParts[valueIndex] && valueIndex < resolvedValue.length); index++) {
            console.log("PLACEHOLDER INDEX", valueParts[valueIndex], index);
            if (maskParts.has(resolvedValue[index])) resolvedValue[index] = valueParts[valueIndex++];
        }*/
        const maskSlotIndexes: { [key: string]: number } = {};
        for (let index = from, sindex = 0; index < resolvedValue.length && sindex < valueParts.length; index++) {
            console.log("PLACEHOLDER INDEX", from, index, resolvedValue[index]);
            if (maskParts.has(resolvedValue[index])) {
                maskSlotIndexes[""+index] = sindex;
                sindex++;
            }
        }
        for (const [index, sindex] of Object.entries(maskSlotIndexes)) resolvedValue[parseInt(index)] = valueParts[sindex];
        /*const masskSlotIndexes = resolvedValue.reduce((acc: number[], c: string, index: number): number[] => {
            if (maskParts.has(c)) acc.push(index);
            return acc;
        }, []);*
        /*for (let index = 0; index < valueParts.length; index++) {
            maskParts.has()
            console.log("PLACEHOLDER INDEX", valueParts[index]);
        }*/
        /*for (let index = 1; index < maskParts.size; index++) {
            const maskPart = maskParts[index];
            console.log("   ", maskPart, valueParts[index-1], index, index-1);
            resolvedValue += (maskPart == "" ? valueParts[index-1] : maskPart);
        }*/
        element.value = resolvedValue.join("");
        console.log("TO RESOLVE MASK", value, "=>", "resolvedValue", maskSlotIndexes, resolvedValue.join(""), maskParts, this.props.mask, this.props.maskSlot)
    }

    onKeyDown(event: React.KeyboardEvent<NoseurFormElement>) {
        this.props.onKeyDown && this.props.onKeyDown(event);
        !this.props.inputFilter || InputHelper.validateEventKeyInput(this.props.inputFilter, event);
    }

    onPasteCapture(event: React.ClipboardEvent<NoseurFormElement>) {
        this.props.onPasteCapture && this.props.onPasteCapture(event);
        !this.props.inputFilter || InputHelper.validateEventValue(this.props.inputFilter, event, event.clipboardData.getData('Text'));
    }

    onInput(event: React.FormEvent<NoseurFormElement>) {
        this.props.onInput && this.props.onInput(event);
        const valueLength = (event.target as HTMLFormElement).value.length;
        if (this.props.mask) this.resolveMask(event.target as HTMLFormElement);
        if (this.props.onFirstInput && !this.state.hasValue) this.props.onFirstInput(event);
        if (this.props.onInputEmpty && this.state.hasValue && !valueLength) this.props.onInputEmpty(event);
        if (!this.state.hasValue && valueLength) this.setState({ hasValue: true });
        if (!valueLength) this.setState({ hasValue: false });
    }

    render() {
        const eventProps = ObjectHelper.extractEventProps(this.props, [ "onInputEmpty", "onFirstInput" ]);
        const className = Classname.build(
            (!this.props.noStyle && this.props.highlight) ? `${this.props.scheme}-bd-cl` : null,
            (!this.props.noStyle && this.props.scheme && !this.props.flushed) ? `${this.props.scheme}-bd-3px-bx-sw-fc` : null,
            (!this.props.noStyle && this.props.scheme) ? `${this.props.scheme}-bd-cl-fc ${this.props.scheme}-bd-cl-hv` : null,
            {
                'noseur-wd-100-pct': this.props.fill,
                'noseur-input-flushed': this.props.flushed,
                'noseur-skeleton': this.props.scheme === Scheme.SKELETON,
                'noseur-raised-bd': !this.props.noStyle && this.props.raised,
                'noseur-no-bd': !this.props.noStyle && this.props.borderless,
                'noseur-disabled': !this.props.noStyle && this.props.disabled,
                'noseur-rounded-bd': !this.props.noStyle && this.props.rounded,
                'noseur-input-filled': !this.props.noStyle && this.props.filled,
            }, "noseur-input", this.props.className);
        const props = {
            className,
            ...eventProps,
            id: this.props.id,
            key: this.props.key,
            type: this.props.type,
            name: this.props.name,
            style: this.props.style,
            required: this.props.required,
            readOnly: this.props.readOnly,
            placeholder: this.props.placeholder,
            defaultValue: this.props.defaultValue,

            onInput: this.onInput,
            onKeyDown: this.onKeyDown,
            onPasteCapture: this.onPasteCapture,
        };
        return (this.props.type === "textarea"
            ? <textarea ref={this.props.forwardRef as React.ForwardedRef<HTMLTextAreaElement>} {...props} />
            : <input ref={this.props.forwardRef as React.ForwardedRef<HTMLInputElement>} {...props} />);
    }

}

export const TextInput = React.forwardRef<HTMLInputElement, Partial<InputProps>>((props, ref) => (
    <Input {...props} forwardRef={ref as React.ForwardedRef<NoseurFormElement>} />
));

export const EmailInput = React.forwardRef<HTMLInputElement, Partial<InputProps>>((props, ref) => (
    <Input {...props} type="email" forwardRef={ref as React.ForwardedRef<NoseurFormElement>} />
));

export const NumberInput = React.forwardRef<HTMLInputElement, Partial<InputProps>>((props, ref) => (
    <Input {...props} type="number" forwardRef={ref as React.ForwardedRef<NoseurFormElement>} />
));

export const TextAreaInput = React.forwardRef<HTMLInputElement, Partial<InputProps>>((props, ref) => (
    <Input {...props} type="textarea" forwardRef={ref as React.ForwardedRef<NoseurFormElement>} />
));

export const PasswordInput = React.forwardRef<HTMLInputElement, Partial<InputProps>>((props, ref) => (
    <Input {...props} type="password" forwardRef={ref as React.ForwardedRef<NoseurFormElement>} />
));

export const MoneyInput = React.forwardRef<HTMLInputElement, Partial<InputProps>>((props, ref) => (
    <Input {...props} inputFilter={InputFilter.MONEY} forwardRef={ref as React.ForwardedRef<NoseurFormElement>} />
));
