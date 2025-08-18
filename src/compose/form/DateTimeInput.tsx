
import "../Composed.css";
import React from 'react';
import { BareInputManageRef, InputProps, TextInput } from "../../form/Input";
import { DateTimePicker, DateTimePickerDefaultProps, DateTimePickerEvent, DateTimePickerLayoutElement, DateTimePickerLayout, DateTimePickerManageRef, DateTimePickerMode, DateTimePickerProps, DateTimePickerSelectionMode } from "./DateTimePicker";
import { FormControl, FormControlProps } from "./FormControl";
import { Classname } from "../../utils/Classname";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { NoseurObject } from "../../constants/Types";
import { BoolHelper } from "../../utils/BoolHelper";
import { ComponentRenderType } from "../../core/ComponentBaseProps";

export interface DateTimeInputManageRef extends BareInputManageRef<string> {
}

export interface DateTimeInputProps extends DateTimePickerProps<HTMLInputElement, DateTimeInputManageRef> {
    fill: boolean;
    leftContent: any;
    rightContent: any;
    separator: string;
    editable: boolean;
    highlight: boolean;
    borderless: boolean;
    placeholder: string;
    value: Date | Date[];
    textInputProps: Partial<InputProps>;
    formControlProps: Partial<FormControlProps>;
    dateTimePickerProps: Partial<DateTimePickerProps>;
    textInputRef: React.ForwardedRef<HTMLInputElement>;

    formatDate: (date: Date, locale?: string, dateFormat?: Intl.DateTimeFormatOptions) => string;
}

interface DateTimeInputState {
    selectedDates: Date[];
}

class DateTimeInputComponent extends React.Component<DateTimeInputProps, DateTimeInputState> {

    public static defaultProps: Partial<DateTimeInputProps> = {
        ...DateTimePickerDefaultProps as any,
        separator: " - ",
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

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
    }

    toggleDateTimePicker(e: any) {
        e.stopPropagation();
        this.dateTimePickerManageRef?.toggle(e);
    }

    formatDateInputValue(date: Date) {
        if (this.props.formatDate) return this.props.formatDate(date, this.props.locale, this.props.dateFormat);
        return date.toLocaleString(this.props.locale, this.props.dateFormat);
    }

    getFineDateValue(selectedDates: Date[]) {
        if (!selectedDates.length) return "";
        switch (this.props.selectionMode) {
            case DateTimePickerSelectionMode.SINGLE:
                return this.formatDateInputValue(selectedDates[0]);
            case DateTimePickerSelectionMode.MULTIPLE:
                return selectedDates.map((selectedDate) =>
                    this.formatDateInputValue(selectedDate)).join(this.props.separator);
            case DateTimePickerSelectionMode.RANGE:
                return selectedDates.slice(0, 2).map((selectedDate) =>
                    this.formatDateInputValue(selectedDate)).join(this.props.separator);
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
            fill: this.props.fill,
            scheme: this.props.scheme,
            onInput: this.props.onInput,
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
            }, (this.props.textInputProps ?? {}).className, this.props.className),
        };
        if (!this.props.editable) {
            inputProps.style.cursor = "pointer";
        }
        if (this.internalTextInputElement && this.internalTextInputElement.value !== defaultValue) {
            this.internalTextInputElement.value = defaultValue;
        }
        return (<TextInput {...inputProps} onClick={this.toggleDateTimePicker} />);
    }

    renderDateTimePicker() {
        const className = Classname.build("noseur-date-time-input-date-time-picker", this.props.dateTimePickerProps);
        const cachedOnClear = this.props.onClear;
        const cachedOnIncrease = this.props.onIncrease;
        const cachedOnDecrease = this.props.onDecrease;
        const cachedOnSelectDate = this.props.onSelectDate;
        const onSelectDate = (options: DateTimePickerEvent) => {
            if (!options.selectedDate) return;
            cachedOnSelectDate?.(options);
            this.setState({ selectedDates: options.selectedDates });
        };
        const onClear = () => {
            cachedOnClear && cachedOnClear();
            this.internalTextInputElement!.value = "";
        };
        const onIncrease = (activeDate: Date, layoutElement: DateTimePickerLayoutElement) => {
            this.onIncreaseOrDecrease(activeDate, layoutElement);
            cachedOnIncrease && cachedOnIncrease(activeDate, layoutElement);
        }
        const onDecrease = (activeDate: Date, layoutElement: DateTimePickerLayoutElement) => {
            this.onIncreaseOrDecrease(activeDate, layoutElement);
            cachedOnDecrease && cachedOnDecrease(activeDate, layoutElement);
        }

        return (<DateTimePicker {...this.props as any} manageRef={(m) => this.dateTimePickerManageRef = m} type={ComponentRenderType.POPOVER} className={className} onClear={onClear} onIncrease={onIncrease}
            onDecrease={onDecrease} onSelectDate={onSelectDate} selectedDates={this.state.selectedDates} id={this.props.dateTimePickerProps?.id} style={this.props.dateTimePickerProps?.style} popoverProps={{ pointingArrowClassName: "" }} />)
    }

    render() {
        const input = this.renderInput();
        const dateTimePIcker = this.renderDateTimePicker();
        const formControlProps = (this.props.formControlProps || {});
        const className = Classname.build('noseur-date-time-input', this.props.formControlProps?.className, { "noseur-disabled": this.props.disabled });

        return (<React.Fragment>
            <FormControl {...formControlProps} className={className} fill={this.props.fill}
                contentStyle={{ width: "initial", ...(formControlProps.style || {}) }} borderless={this.props.borderless} leftContent={this.props.leftContent || this.props.formControlProps.leftContent}
                scheme={this.props.scheme || formControlProps.scheme} ref={(r: any) => this.compoundElement = r} rightContent={this.props.rightContent || this.props.formControlProps.rightContent} onClick={this.toggleDateTimePicker}>
                {input}
            </FormControl>
            {dateTimePIcker}
        </React.Fragment>);
    }

}

export const DateTimeInput = ({ ref, ...props }: Partial<DateTimeInputProps>) => (
    <DateTimeInputComponent {...props} dateFormat={{ day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: !props.hourFormat || props.hourFormat === "12" }}
        showTime={true} forwardRef={ref} />
);

export const YearInput = ({ ref, ...props }: Partial<DateTimeInputProps>) => (
    <DateTimeInputComponent forwardRef={ref} dateFormat={{ year: 'numeric' }} {...props} showTime={false} mode={DateTimePickerMode.YEAR} />
);

export const MonthInput = ({ ref, ...props }: Partial<DateTimeInputProps>) => (
    <DateTimeInputComponent forwardRef={ref} dateFormat={{ month: 'long' }} {...props} showTime={false} mode={DateTimePickerMode.MONTH} />
);

export const DateInput = ({ ref, ...props }: Partial<DateTimeInputProps>) => (
    <DateTimeInputComponent forwardRef={ref} dateFormat={{ day: '2-digit', month: '2-digit', year: 'numeric' }} {...props} showTime={false} />
);

export const TimeInput = ({ ref, ...props }: Partial<DateTimeInputProps>) => {
    const hourFormat12 = !props.hourFormat || props.hourFormat === "12";
    const dateFormat: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: hourFormat12 };
    const timeLayout = props.timeLayout || hourFormat12 ? props.timeLayout : DateTimePickerLayout.TIME_LAYOUT_WITHOUT_MERIDIAN;
    return (<DateTimeInputComponent {...props} forwardRef={ref} showTime={true} timeOnly={true} timeLayout={timeLayout}
        dateFormat={dateFormat} layout={DateTimePickerLayoutElement.TimeElement} attrsRelay={{
            popover: { pointingArrowClassName: "", ...(props?.attrsRelay?.popover ?? {}) }
        }} />);
};
