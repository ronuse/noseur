
import "../Composed.css";
import React from 'react';
import { BareInputManageRef, InputProps, TextInput } from "../../form/Input";
import { DateTimePicker, DateTimePickerDefaultProps, DateTimePickerEvent, DateTimePickerLayoutElement, DateTimePickerLayout, DateTimePickerManageRef, DateTimePickerMode, DateTimePickerProps, DateTimePickerSelectionMode, DateTimePickerType } from "./DateTimePicker";
import { FormControl, FormControlProps } from "./FormControl";
import { Classname } from "../../utils/Classname";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { NoseurObject } from "../../constants/Types";
import { BoolHelper } from "../../utils/BoolHelper";

export interface DateTimeInputManageRef extends BareInputManageRef<string> {
}

export interface DateTimeInputProps extends DateTimePickerProps<DateTimeInputManageRef> {
    leftContent: any;
    rightContent: any;
    editable: boolean;
    highlight: boolean;
    borderless: boolean;
    placeholder: string;
    value: Date | Date[];
    textInputProps: Partial<InputProps>;
    formControlProps: Partial<FormControlProps>;
    dateTimePickerProps: Partial<DateTimePickerProps>;
    textInputRef: React.ForwardedRef<HTMLInputElement>;
}

interface DateTimeInputState {
    selectedDates: Date[];
}

class DateTimeInputComponent extends React.Component<DateTimeInputProps, DateTimeInputState> {

    public static defaultProps: Partial<DateTimeInputProps> = {
        ...DateTimePickerDefaultProps as any,
        formControlProps: {},
        dateFormat: undefined,
    };

    state: DateTimeInputState = {
        selectedDates: (this.props.value instanceof Array ? this.props.value : (this.props.value ? [this.props.value] : this.props.selectedDates)),
    };

    compoundElement: any;
    internalTextInputElement?: HTMLInputElement | null;
    dateTimePickerManageRef?: DateTimePickerManageRef | null;

    constructor(props: DateTimeInputProps) {
        super(props);

        this.onIncreaseOrDecrease = this.onIncreaseOrDecrease.bind(this);
        this.toggleDateTimePicker = this.toggleDateTimePicker.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            clear: () => this.dateTimePickerManageRef?.clear(),
            value: () => {
                return this.dateTimePickerManageRef?.formattedValue();
            },
        });
    }

    toggleDateTimePicker(e: any) {
        e.stopPropagation();
        this.dateTimePickerManageRef?.toggle(e);
    }

    getFineDateValue(selectedDates: Date[]) {
        if (!selectedDates.length) return "";
        switch (this.props.selectionMode) {
            case DateTimePickerSelectionMode.SINGLE:
                return selectedDates[0].toLocaleString(this.props.locale, this.props.dateFormat);
            case DateTimePickerSelectionMode.MULTIPLE:
                return selectedDates.map((selectedDate) =>
                    selectedDate.toLocaleString(this.props.locale, this.props.dateFormat)).join(" - ");
            case DateTimePickerSelectionMode.RANGE:
                return selectedDates.slice(0, 2).map((selectedDate) =>
                    selectedDate.toLocaleString(this.props.locale, this.props.dateFormat)).join(" - ");
        }
    }

    onIncreaseOrDecrease(activeDate: Date, layoutElement: DateTimePickerLayoutElement) {
        if (!this.dateTimePickerManageRef || !(BoolHelper.equalsAny(layoutElement, [
            DateTimePickerLayoutElement.HourElement,
            DateTimePickerLayoutElement.MinutesElement,
            DateTimePickerLayoutElement.SecondsElement,
            DateTimePickerLayoutElement.MeridianElement,
        ]))) return;
        this.setState({ selectedDates: [activeDate] });
    }

    renderInput() {
        let defaultValue = this.getFineDateValue(this.state.selectedDates ?? []);
        const inputProps: NoseurObject<any> = {
            defaultValue,
            noStyle: true,
            borderless: true,
            id: this.props.id,
            scheme: this.props.scheme,
            ...this.props.textInputProps,
            disabled: this.props.disabled,
            readOnly: !this.props.editable,
            highlight: this.props.highlight,
            placeholder: this.props.placeholder,
            style: { ...(this.props.style || {}) },
            ref: (el: any) => {
                if (!el) return;
                this.internalTextInputElement = el;
                ObjectHelper.resolveRef(this.props.textInputRef, el);
            },
            className: Classname.build('noseur-date-time-input-inputtext', {
                'noseur-cursor-pointer': !this.props.editable,
            }, (this.props.textInputProps || {}).className, this.props.className),
        };
        if (!this.props.editable) {
            inputProps.style.cursor = "pointer";
        }
        return (<TextInput {...inputProps} onClick={this.toggleDateTimePicker} />);
    }

    renderDateTimePicker() {
        const className = Classname.build("noseur-date-time-input-date-time-picker", this.props.dateTimePickerProps);
        const cahcedOnClear = this.props.onClear;
        const cahcedOnIncrease = this.props.onIncrease;
        const cahcedOnDecrease = this.props.onDecrease;
        const cahcedOnSelectDate = this.props.onSelectDate;
        const onSelectDate = (options: DateTimePickerEvent) => {
            if (!options.selectedDate) return;
            cahcedOnSelectDate && cahcedOnSelectDate(options);
            this.setState({ selectedDates: options.selectedDates });
            this.internalTextInputElement!.value = this.getFineDateValue(options.selectedDates);
        };
        const onClear = () => {
            cahcedOnClear && cahcedOnClear();
            this.internalTextInputElement!.value = "";
        };
        const onIncrease = (activeDate: Date, layoutElement: DateTimePickerLayoutElement) => {
            this.onIncreaseOrDecrease(activeDate, layoutElement);
            cahcedOnIncrease && cahcedOnIncrease(activeDate, layoutElement);
        }
        const onDecrease = (activeDate: Date, layoutElement: DateTimePickerLayoutElement) => {
            this.onIncreaseOrDecrease(activeDate, layoutElement);
            cahcedOnDecrease && cahcedOnDecrease(activeDate, layoutElement);
        }

        return (<DateTimePicker {...this.props as any} manageRef={(m) => this.dateTimePickerManageRef = m} type={DateTimePickerType.POPOVER} className={className} onClear={onClear} onIncrease={onIncrease}
            onDecrease={onDecrease} onSelectDate={onSelectDate} selectedDates={this.state.selectedDates} id={this.props.dateTimePickerProps?.id} style={this.props.dateTimePickerProps?.style} popoverProps={{ pointingArrowClassName: "" }} />)
    }

    render() {
        const input = this.renderInput();
        const dateTimePIcker = this.renderDateTimePicker();
        const formControlProps = (this.props.formControlProps || {});
        const className = Classname.build('noseur-date-time-input', this.props.formControlProps?.className, { "noseur-disabled": this.props.disabled });

        return (<React.Fragment>
            <FormControl {...formControlProps} className={className}
                contentStyle={{ width: "initial", ...(formControlProps.style || {}) }} borderless={this.props.borderless} leftContent={this.props.leftContent || this.props.formControlProps.leftContent}
                scheme={this.props.scheme || formControlProps.scheme} ref={(r: any) => this.compoundElement = r} rightContent={this.props.rightContent || this.props.formControlProps.rightContent} onClick={this.toggleDateTimePicker}>
                {input}
            </FormControl>
            {dateTimePIcker}
        </React.Fragment>);
    }

}

export const DateTimeInput = React.forwardRef<HTMLDivElement, Partial<DateTimeInputProps>>((props, ref) => (
    <DateTimeInputComponent {...props} dateFormat={{ day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: !props.hourFormat || props.hourFormat === "12" }}
        showTime={true} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

export const YearInput = React.forwardRef<HTMLDivElement, Partial<DateTimeInputProps>>((props, ref) => (
    <DateTimeInputComponent dateFormat={{ year: 'numeric' }} {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={false} mode={DateTimePickerMode.YEAR} />
));

export const MonthInput = React.forwardRef<HTMLDivElement, Partial<DateTimeInputProps>>((props, ref) => (
    <DateTimeInputComponent dateFormat={{ month: 'long' }} {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={false} mode={DateTimePickerMode.MONTH} />
));

export const DateInput = React.forwardRef<HTMLDivElement, Partial<DateTimeInputProps>>((props, ref) => (
    <DateTimeInputComponent dateFormat={{ day: '2-digit', month: '2-digit', year: 'numeric' }} {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={false} />
));

export const TimeInput = React.forwardRef<HTMLDivElement, Partial<DateTimeInputProps>>((props, ref) => {
    const hourFormat12 = !props.hourFormat || props.hourFormat === "12";
    const dateFormat: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: hourFormat12 };
    const timeLayout = props.timeLayout || hourFormat12 ? props.timeLayout : DateTimePickerLayout.TIME_LAYOUT_WITHOUT_MERIDIAN;
    return (<DateTimeInputComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={true} timeOnly={true} timeLayout={timeLayout}
        dateFormat={dateFormat} layout={DateTimePickerLayoutElement.TimeElement} popoverProps={{ ...(props.popoverProps ?? {}), pointingArrowClassName: "" }} />);
});
