
import "../Composed.css";
import React from 'react';
import { Scheme } from "../../constants/Scheme";
import { DOMHelper } from "../../utils/DOMUtils";
import { Classname } from "../../utils/Classname";
import { BoolHelper } from "../../utils/BoolHelper";
import { TypeChecker } from "../../utils/TypeChecker";
import { ObjectHelper } from "../../utils/ObjectHelper";
import { ButtonProps, buildButtonControl } from "../../form/Button";
import { Dialog, DialogManageRef, DialogProps } from "../../overlay/Dialog";
import { Popover, PopoverManageRef, PopoverProps } from "../../overlay/Popover";
import { DateHelper, FormatedDate, Month, Time, Weekday } from "../../utils/DateHelper";
import { NoseurDivElement, NoseurElement, NoseurLabel, NoseurObject } from "../../constants/Types";
import { ComponentBaseProps, ComponentElementBasicAttributes, addClassesToComponentElementBasicAttributes } from "../../core/ComponentBaseProps";

export enum DateTimePickerMode {
    YEAR,
    MONTH,
    DATETIME,
}

export enum DateTimePickerType {
    MODAL,
    INLINE,
    POPOVER,
}

export enum DateTimePickerSelectionMode {
    RANGE,
    SINGLE,
    MULTIPLE,
}

export const DateTimePickerWeekdayIndex = [
    Weekday.SUNDAY,
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
];

export const MonthIndex = [
    Month.JANUARY,
    Month.FEBRUARY,
    Month.MARCH,
    Month.APRIL,
    Month.MAY,
    Month.JUNE,
    Month.JULY,
    Month.AUGUST,
    Month.SEPTEMBER,
    Month.OCTOBER,
    Month.NOVEMBER,
    Month.DECEMBER,
];

export enum DateTimePickerLayoutElement {
    DashElement = "[d]",
    SpaceElement = "[s]",
    RowDividerElement = "[-]",
    NowElement = "NowElement",
    OpenRowGroupElement = "{",
    DayElement = "DayElement",
    CloseRowGroupElement = "}",
    YearElement = "YearElement",
    TimeElement = "TimeElement",
    DateElement = "DateElement",
    NextElement = "NextElement",
    HourElement = "HourElement",
    PanelSeperatorElement = "|",
    ColumnDividerElement = "[|]",
    SpaceLeftRightElement = "<>",
    OpenColumnGroupElement = "<",
    CloseColumnGroupElement = ">",
    DaysElements = "DaysElements",
    MonthElement = "MonthElement",
    TodayElement = "TodayElement",
    ClearElement = "ClearElement",
    SelectElement = "SelectElement",
    YearsElements = "YearsElements",
    HeaderElement = "HeaderElement",
    FooterElement = "FooterElement",
    TimeSeperator = "TimeSeperator",
    YearToElement = "YearToElement",
    WeekDayElement = "WeekDayElement",
    MonthsElements = "MonthsElements",
    MinutesElement = "MinutesElement",
    SecondsElement = "SecondsElement",
    YearFromElement = "YearFromElement",
    TopPanelElement = "TopPanelElement",
    MeridianElement = "MeridianElement",
    ThisYearElement = "ThisYearElement",
    LastYearElement = "LastYearElement",
    PreviousElement = "PreviousElement",
    SelectionElement = "SelectionElement",
    WeekdaysElements = "WeekdaysElements",
    ThisMonthElement = "ThisMonthElement",
    LastMonthElement = "LastMonthElement",
    NextMonthElement = "NextMonthElement",
    IncrementElement = "IncrementElement",
    DecrementElement = "DecrementElement",
    YesterdayElement = "YesterdayElement",
    LeftPanelElement = "LeftPanelElement",
    TodayDateElement = "TodayDateElement",
    MainLayoutElement = "MainLayoutElement",
    RightPanelElement = "RightPanelElement",
    TodaysDateElement = "TodaysDateElement",
    BottomPanelElement = "BottomPanelElement",
    DateRangesElements = "DateRangesElements",
    CustomHeaderElement = "CustomHeaderElement",
    CustomFooterElement = "CustomFooterElement",
    SelectedDateElement = "SelectedDateElement",
    PreviousMonthElement = "PreviousMonthElement",
    LastSevenDaysElement = "LastSevenDaysElement",
    LastThirtyDaysElement = "LastThirtyDaysElement",
    SelectedDatesElements = "SelectedDatesElements",
    YearModeHeaderElement = "YearModeHeaderElement",
    YearModeFooterElement = "YearModeFooterElement",
    MonthModeHeaderElement = "MonthModeHeaderElement",
    MonthModeFooterElement = "MonthModeFooterElement",
}

export enum DateTimePickerLayout {
    DEFAULT_SELECTION_LAYOUT = `${DateTimePickerLayoutElement.SelectedDatesElements}`,
    DEFAULT_FOOTER_LAYOUT = `${DateTimePickerLayoutElement.TodayDateElement} <> ${DateTimePickerLayoutElement.ClearElement} ${DateTimePickerLayoutElement.SelectElement}`,
    DEFAULT_MONTH_MODE_HEADER_LAYOUT = `${DateTimePickerLayoutElement.PreviousElement} <> ${DateTimePickerLayoutElement.YearElement} <> ${DateTimePickerLayoutElement.NextElement}`,
    DEFAULT_YEAR_MODE_LAYOUT = `${DateTimePickerLayoutElement.YearModeHeaderElement} ${DateTimePickerLayoutElement.YearsElements} ${DateTimePickerLayoutElement.YearModeFooterElement}`,
    DEFAULT_MONTH_MODE_LAYOUT = `${DateTimePickerLayoutElement.MonthModeHeaderElement} ${DateTimePickerLayoutElement.MonthsElements} ${DateTimePickerLayoutElement.MonthModeFooterElement}`,
    DEFAULT_HEADER_LAYOUT = `${DateTimePickerLayoutElement.PreviousElement} <> ${DateTimePickerLayoutElement.MonthElement} ${DateTimePickerLayoutElement.YearElement} <> ${DateTimePickerLayoutElement.NextElement}`,
    DEFAULT_YEAR_MODE_HEADER_LAYOUT = `${DateTimePickerLayoutElement.PreviousElement} <> ${DateTimePickerLayoutElement.YearFromElement} [s] [d] [s] ${DateTimePickerLayoutElement.YearToElement} <> ${DateTimePickerLayoutElement.NextElement}`,
    DEFAULT_LAYOUT = `${DateTimePickerLayoutElement.TopPanelElement} [-] ${DateTimePickerLayoutElement.LeftPanelElement} [|] ${DateTimePickerLayoutElement.HeaderElement} ${DateTimePickerLayoutElement.WeekdaysElements} ${DateTimePickerLayoutElement.DaysElements} ${DateTimePickerLayoutElement.TimeElement} ${DateTimePickerLayoutElement.FooterElement} [|] ${DateTimePickerLayoutElement.RightPanelElement} [-] ${DateTimePickerLayoutElement.BottomPanelElement}`,
    DEFAULT_TIME_LAYOUT = `< ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.HourElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.MinutesElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.MeridianElement} ${DateTimePickerLayoutElement.DecrementElement} >`,
    
    FINE_LEFT_LAYOUT = `${DateTimePickerLayoutElement.TodayElement} ${DateTimePickerLayoutElement.YesterdayElement} ${DateTimePickerLayoutElement.LastSevenDaysElement} ${DateTimePickerLayoutElement.LastThirtyDaysElement} ${DateTimePickerLayoutElement.ThisMonthElement} ${DateTimePickerLayoutElement.LastMonthElement} ${DateTimePickerLayoutElement.ThisYearElement} ${DateTimePickerLayoutElement.LastYearElement}`,
    TIME_LAYOUT_WITHOUT_MERIDIAN = `< ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.HourElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.MinutesElement} ${DateTimePickerLayoutElement.DecrementElement} >`,
    TIME_LAYOUT_WITH_SECONDS_WITHOUT_MERIDIAN = `< ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.HourElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.MinutesElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.SecondsElement} ${DateTimePickerLayoutElement.DecrementElement} >`,
    TIME_LAYOUT_WITH_SECONDS = `< ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.HourElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.MinutesElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.SecondsElement} ${DateTimePickerLayoutElement.DecrementElement} > ${DateTimePickerLayoutElement.TimeSeperator} < ${DateTimePickerLayoutElement.IncrementElement} ${DateTimePickerLayoutElement.MeridianElement} ${DateTimePickerLayoutElement.DecrementElement} >`,

}

export interface TimePickerLayoutElementBuilderOptions {
    scheme?: Scheme;
    text: NoseurLabel;
    key?: string | number;
    layoutElement: string;
    action?: (e: any) => void;
    formattedDate: FormatedDate;
    basicAttrs?: ComponentElementBasicAttributes;
    control?: Partial<ButtonProps> | NoseurElement;
}

export interface DateTimePickerElementOptions {
    props: DateTimePickerProps;
    formattedDate: FormatedDate;
    labelsMap: NoseurObject<string>;
    layoutElement: DateTimePickerLayoutElement;
    options: TimePickerLayoutElementBuilderOptions;
    controlActionMap: NoseurObject<(e: any) => void>;
    elementBuilder: (options: TimePickerLayoutElementBuilderOptions) => NoseurElement;
}

export interface DateTimePickerEvent {
    toDate?: Date;
    fromDate?: Date;
    selectedDate?: Date;
    selectedDates: Date[];
    formatDate: (date: Date) => string;
}

export type DateTimePickerDateClearEventHandler = () => void;
export type DateTimePickerDateMaxDateEventHandler = () => void;
export type DateTimePickerDateEventHandler = (options: DateTimePickerEvent) => void;
export type DateTimePickerDateElementTemplateHandler = (options: FormatedDate) => NoseurElement;
export type DateTimePickerElementTemplateHandler = (options: DateTimePickerElementOptions) => NoseurElement;
export type MonthElementTemplateHandler = (month: Month, options: DateTimePickerElementOptions) => NoseurElement;
export type DateTimePickerDateValueChangeControlEventHandler = (leftNeigbhor?: string, rightNeigbhor?: string) => void;
export type DateTimePickerYearElementTemplateHandler = (date: number, options: DateTimePickerElementOptions) => NoseurElement;
export type DateTimePickerIncreaseDecreaseEventHandler = (activeDate: Date, layoutElement: DateTimePickerLayoutElement) => void;
export type DateTimePickerSelectedDatelementTemplateHandler = (date: Date, options: DateTimePickerElementOptions) => NoseurElement;
export type DateTimePickerWeekdayElementTemplateHandler = (weekday: Weekday, options: DateTimePickerElementOptions) => NoseurElement;
export type DateTimePickerSelectionElementTemplateHandler = (selectedDates: Date[], options: DateTimePickerElementOptions) => NoseurElement;
export type DateTimePickerDayElementTemplateHandler = (date: number, options: DateTimePickerElementOptions, selected: boolean, dateObj?: Date, overlap?: boolean) => NoseurElement;

export type DateTimePickerAttributtesRelays = {
    rowGroup?: ComponentElementBasicAttributes;
    columnGroup?: ComponentElementBasicAttributes;
    selectedDate?: ComponentElementBasicAttributes;
    weekdays?: {
        className?: string;
        weekday?: ComponentElementBasicAttributes;
    };
    days?: {
        className?: string;
        underline?: {
            className?: string;
        };
    };
    date?: {
        className?: string;
        hover?: ComponentElementBasicAttributes;
        inRange?: ComponentElementBasicAttributes;
        enabled?: ComponentElementBasicAttributes;
        disabled?: ComponentElementBasicAttributes;
        selected?: ComponentElementBasicAttributes;
        todayHighlight?: ComponentElementBasicAttributes;
    };
    years?: {
        className?: string;
        year?: {
            className?: string;
        };
        selected?: {
            className?: string;
        };
    };
    months?: {
        className?: string;
        month?: {
            className?: string;
        };
        selected?: {
            className?: string;
        };
    };
    [key: string]: ComponentElementBasicAttributes | undefined;
}

export interface DateTimePickerManageRef {
    clear: () => void;
    activeDate: () => Date;
    selectedDates: () => Date[];
    formattedValue: () => string;
    dialogManageRef: () => DialogManageRef | null;
    popoverManageRef: () => PopoverManageRef | null;
    toggle: (event: Event, target?: HTMLElement) => void;
    next: (leftNeigbhor?: string, rightNeigbhor?: string) => void;
    prev: (leftNeigbhor?: string, rightNeigbhor?: string) => void;
}

export interface DateTimePickerProps<T1 = DateTimePickerManageRef, T2 = DateTimePickerAttributtesRelays> extends ComponentBaseProps<NoseurDivElement, T1, T2> {
    date: Date;
    minDate: Date;
    maxDate: Date;
    locale: string;
    layout: string;
    sticky: boolean;
    topLayout: string;
    required: boolean;
    showTime: boolean;
    timeOnly: boolean;
    timeLayout: string;
    idleScheme: Scheme;
    autoFocus: boolean;
    leftLayout: string;
    weekdays: Weekday[];
    rightLayout: string;
    disableToDate: Date;
    staticMode: boolean;
    bottomLayout: string;
    headerLayout: string;
    footerLayout: string;
    enabledDates: Date[];
    disabledDates: Date[];
    selectedDates: Date[];
    numberOfMonth: number;
    disableFromDate: Date;
    modalVisible: boolean;
    enabledYears: number[];
    showGridlines: boolean;
    yearModeLayout: string;
    enabledMonths: Month[];
    disabledMonths: Month[];
    monthModeLayout: string;
    selectionLayout: string;
    highlightToday: boolean;
    showDateRanges: boolean;
    disabledYears: number[];
    hourFormat: "12" | "24";
    type: DateTimePickerType;
    mode: DateTimePickerMode;
    dontOverlapDate: boolean;
    enabledWeekdays: Weekday[];
    disabledWeekdays: Weekday[];
    showDatesSeperator: boolean;
    modeDifferenceCount: number;
    yearModeHeaderLayout: string;
    yearModeFooterLayout: string;
    monthModeHeaderLayout: string;
    monthModeFooterLayout: string;
    monthsSeperatorLayout: string;
    makeOverlapSelectable: boolean;
    highlightDatesInRange: boolean;
    dontUnselectOnSameDate: boolean;
    labelsMap: NoseurObject<string>;
    reportOnSelectClickOnly: boolean;
    dialogProps: Partial<DialogProps>;
    popoverProps: Partial<PopoverProps>
    maxMultipleModeDateSelection: number;
    dateFormat: Intl.DateTimeFormatOptions;
    selectionMode: DateTimePickerSelectionMode;
    dayControl: Partial<ButtonProps> | NoseurElement;
    nextControl: Partial<ButtonProps> | NoseurElement;
    prevControl: Partial<ButtonProps> | NoseurElement;
    incrementControl: Partial<ButtonProps> | NoseurElement;
    decrementControl: Partial<ButtonProps> | NoseurElement;

    monthTemplate: MonthElementTemplateHandler;
    onSelectDate: DateTimePickerDateEventHandler;
    onClear: DateTimePickerDateClearEventHandler;
    timeTemplate: DateTimePickerElementTemplateHandler;
    layoutTemplate: DateTimePickerElementTemplateHandler;
    headerTemplate: DateTimePickerElementTemplateHandler;
    footerTemplate: DateTimePickerElementTemplateHandler;
    dayTemplate: DateTimePickerDayElementTemplateHandler;
    elementTemplate: DateTimePickerElementTemplateHandler;
    onIncrease: DateTimePickerIncreaseDecreaseEventHandler;
    onDecrease: DateTimePickerIncreaseDecreaseEventHandler;
    yearTemplate: DateTimePickerYearElementTemplateHandler;
    dateTemplate: DateTimePickerDateElementTemplateHandler;
    topPanelTemplate: DateTimePickerElementTemplateHandler;
    leftPanelTemplate: DateTimePickerElementTemplateHandler;
    onNext: DateTimePickerDateValueChangeControlEventHandler;
    rightPanelTemplate: DateTimePickerElementTemplateHandler;
    bottomPanelTemplate: DateTimePickerElementTemplateHandler;
    customElementTemplate: DateTimePickerElementTemplateHandler;
    yearModeHeaderTemplate: DateTimePickerElementTemplateHandler;
    yearModeFooterTemplate: DateTimePickerElementTemplateHandler;
    weekdayTemplate: DateTimePickerWeekdayElementTemplateHandler;
    onPrevious: DateTimePickerDateValueChangeControlEventHandler;
    monthModeHeaderTemplate: DateTimePickerElementTemplateHandler;
    monthModeFooterTemplate: DateTimePickerElementTemplateHandler;
    onIncrement: DateTimePickerDateValueChangeControlEventHandler;
    onDecrement: DateTimePickerDateValueChangeControlEventHandler;
    selectionTemplate: DateTimePickerSelectionElementTemplateHandler;
    onMaxMultipleDateSelected: DateTimePickerDateMaxDateEventHandler;
    selectedDateTemplate: DateTimePickerSelectedDatelementTemplateHandler;
}

interface DateTimePickerState {
    time: Time;
    activeDate: Date;
    mouseOverDate?: Date;
    modalVisible: boolean;
    selectedDates: Date[];
    activeMode: DateTimePickerMode;
}

export const DateTimePickerDefaultProps: Partial<DateTimePickerProps> = {
    topLayout: "",
    attrsRelay: {},
    leftLayout: "",
    rightLayout: "",
    dialogProps: {},
    bottomLayout: "",
    popoverProps: {},
    date: new Date(),
    enabledYears: [],
    enabledDates: [],
    numberOfMonth: 1,
    hourFormat: "12",
    locale: "default",
    selectedDates: [],
    disabledYears: [],
    enabledMonths: [],
    disabledDates: [],
    disabledMonths: [],
    enabledWeekdays: [],
    disabledWeekdays: [],
    modeDifferenceCount: 12,
    scheme: Scheme.SECONDARY,
    yearModeFooterLayout: "",
    monthModeFooterLayout: "",
    idleScheme: Scheme.SECONDARY,
    type: DateTimePickerType.INLINE,
    maxMultipleModeDateSelection: 20,
    mode: DateTimePickerMode.DATETIME,
    layout: DateTimePickerLayout.DEFAULT_LAYOUT,
    selectionMode: DateTimePickerSelectionMode.SINGLE,
    timeLayout: DateTimePickerLayout.DEFAULT_TIME_LAYOUT,
    headerLayout: DateTimePickerLayout.DEFAULT_HEADER_LAYOUT,
    footerLayout: DateTimePickerLayout.DEFAULT_FOOTER_LAYOUT,
    yearModeLayout: DateTimePickerLayout.DEFAULT_YEAR_MODE_LAYOUT,
    selectionLayout: DateTimePickerLayout.DEFAULT_SELECTION_LAYOUT,
    dateFormat: { day: '2-digit', month: 'short', year: 'numeric' },
    monthModeLayout: DateTimePickerLayout.DEFAULT_MONTH_MODE_LAYOUT,
    yearModeHeaderLayout: DateTimePickerLayout.DEFAULT_YEAR_MODE_HEADER_LAYOUT,
    monthModeHeaderLayout: DateTimePickerLayout.DEFAULT_MONTH_MODE_HEADER_LAYOUT,
    weekdays: [Weekday.SUNDAY, Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY, Weekday.SATURDAY],
};

export class DateTimePickerComponent extends React.Component<DateTimePickerProps, DateTimePickerState> {

    public static defaultProps: Partial<DateTimePickerProps> = DateTimePickerDefaultProps;

    state: DateTimePickerState = {
        activeMode: this.props.mode,
        modalVisible: this.props.modalVisible,
        activeDate: DateHelper.clone(this.props.date),
        time: DateHelper.getTime(this.props.date),
        selectedDates: this.props.selectionMode === DateTimePickerSelectionMode.RANGE ? this.props.selectedDates.slice(0, 2) : this.props.selectedDates,
    };

    labelsMap: NoseurObject<string> = {
        "NowElement": "Now",
        "TodayElement": "Today",
        "ClearElement": "Clear",
        "SelectElement": "Select",
        "TodayDateElement": "Today",
        "ThisYearElement": "This year",
        "LastYearElement": "Last year",
        "YesterdayElement": "Yesterday",
        "ThisMonthElement": "This month",
        "LastMonthElement": "Last month",
        "LastSevenDaysElement": "Last seven days",
        "LastThirtyDaysElement": "Last thirty days",
        ...(this.props.labelsMap || {})
    };
    dialogManageRef: DialogManageRef | null = {} as any;
    popoverManageRef: PopoverManageRef | null = {} as any;

    constructor(props: DateTimePickerProps) {
        super(props);

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.toggle = this.toggle.bind(this);
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.selectNowDate = this.selectNowDate.bind(this);
        this.onMouseEnterDate = this.onMouseEnterDate.bind(this);
        this.onMouseLeaveDate = this.onMouseLeaveDate.bind(this);
        this.reportOnSelectDate = this.reportOnSelectDate.bind(this);
        this.clearDateSelection = this.clearDateSelection.bind(this);
        this.selectDatesInRange = this.selectDatesInRange.bind(this);
        this.performDateControlAction = this.performDateControlAction.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            prev: this.prev,
            next: this.next,
            toggle: this.toggle,
            clear: this.clearDateSelection,
            activeDate: () => this.state.activeDate,
            dialogManageRef: () => this.dialogManageRef,
            selectedDates: () => this.state.selectedDates,
            popoverManageRef: () => this.popoverManageRef,
            formattedValue: () => (this.state.selectedDates.length ? this.state.selectedDates[0] : new Date()).toLocaleString(this.props.locale, this.props.dateFormat),
        });
    }

    toggle(event: Event, target?: HTMLElement) {
        switch (this.props.type) {
            case DateTimePickerType.MODAL:
                this.setState({ modalVisible: !this.state.modalVisible });
                break;
            case DateTimePickerType.POPOVER:
                this.popoverManageRef!.toggle(event, target);
                break;
        }
    }

    next(leftNeigbhor?: string, rightNeigbhor?: string) {
        let activeDate = this.state.activeDate;
        switch (leftNeigbhor) {
            case DateTimePickerLayoutElement.HourElement:
                activeDate = DateHelper.addHours(activeDate, 1);
                break;
            case DateTimePickerLayoutElement.MinutesElement:
                activeDate = DateHelper.addMinutes(activeDate, 1);
                break;
            case DateTimePickerLayoutElement.SecondsElement:
                activeDate = DateHelper.addSeconds(activeDate, 1);
                break;
            case DateTimePickerLayoutElement.MeridianElement:
                activeDate = DateHelper.addHours(activeDate, 12);
                break;
            default:
                if (this.props.onNext) {
                    this.props.onNext(leftNeigbhor, rightNeigbhor);
                    return;
                }
                switch (this.state.activeMode) {
                    case DateTimePickerMode.MONTH:
                        activeDate.setFullYear(activeDate.getFullYear() + 1);
                        break;
                    case DateTimePickerMode.YEAR:
                        activeDate.setFullYear(activeDate.getFullYear() + this.props.modeDifferenceCount);
                        break;
                    default:
                        activeDate.setMonth(activeDate.getMonth() + 1);
                        break;
                }
        }
        this.setState({ activeDate });
        this.props.onIncrease && this.props.onIncrease(activeDate, leftNeigbhor as DateTimePickerLayoutElement);
    }

    prev(leftNeigbhor?: string, rightNeigbhor?: string) {
        let activeDate = this.state.activeDate;
        switch (rightNeigbhor) {
            case DateTimePickerLayoutElement.HourElement:
                activeDate = DateHelper.addHours(activeDate, -1);
                break;
            case DateTimePickerLayoutElement.MinutesElement:
                activeDate = DateHelper.addMinutes(activeDate, -1);
                break;
            case DateTimePickerLayoutElement.SecondsElement:
                activeDate = DateHelper.addSeconds(activeDate, -1);
                break;
            case DateTimePickerLayoutElement.MeridianElement:
                activeDate = DateHelper.addHours(activeDate, -12);
                break;
            default:
                if (this.props.onPrevious) {
                    this.props.onPrevious(leftNeigbhor, rightNeigbhor);
                    return;
                }
                switch (this.state.activeMode) {
                    case DateTimePickerMode.MONTH:
                        activeDate.setFullYear(activeDate.getFullYear() - 1);
                        break;
                    case DateTimePickerMode.YEAR:
                        activeDate.setFullYear(activeDate.getFullYear() - this.props.modeDifferenceCount);
                        break;
                    default:
                        activeDate.setMonth(activeDate.getMonth() - 1);
                        break;
                }
        }
        this.setState({ activeDate });
        this.props.onDecrease && this.props.onDecrease(activeDate, rightNeigbhor as DateTimePickerLayoutElement);
    }

    increment(leftNeigbhor?: string, rightNeigbhor?: string) {
        let activeDate = this.state.activeDate;
        switch (rightNeigbhor) {
            case DateTimePickerLayoutElement.HourElement:
                activeDate = DateHelper.addHours(activeDate, 1);
                break;
            case DateTimePickerLayoutElement.MinutesElement:
                activeDate = DateHelper.addMinutes(activeDate, 1);
                break;
            case DateTimePickerLayoutElement.SecondsElement:
                activeDate = DateHelper.addSeconds(activeDate, 1);
                break;
            case DateTimePickerLayoutElement.MeridianElement:
                activeDate = DateHelper.addHours(activeDate, 12);
                break;
            default:
                this.props.onIncrement && this.props.onIncrement(leftNeigbhor, rightNeigbhor);
                return;
        }
        this.setState({ activeDate });
        this.props.onIncrease && this.props.onIncrease(activeDate, rightNeigbhor as DateTimePickerLayoutElement);
    }

    decrement(leftNeigbhor?: string, rightNeigbhor?: string) {
        let activeDate = this.state.activeDate;
        switch (leftNeigbhor) {
            case DateTimePickerLayoutElement.HourElement:
                activeDate = DateHelper.addHours(activeDate, -1);
                break;
            case DateTimePickerLayoutElement.MinutesElement:
                activeDate = DateHelper.addMinutes(activeDate, -1);
                break;
            case DateTimePickerLayoutElement.SecondsElement:
                activeDate = DateHelper.addSeconds(activeDate, -1);
                break;
            case DateTimePickerLayoutElement.MeridianElement:
                activeDate = DateHelper.addHours(activeDate, -12);
                break;
            default:
                this.props.onDecrement && this.props.onDecrement(leftNeigbhor, rightNeigbhor);
                return;
        }
        this.setState({ activeDate });
        this.props.onDecrease && this.props.onDecrease(activeDate, leftNeigbhor as DateTimePickerLayoutElement);
    }

    reportOnSelectDate(newSelectedDates?: Date[]) {
        const selectedDates: Date[] = newSelectedDates || this.state.selectedDates;
        if (!this.props.onSelectDate) return;
        const options = {
            selectedDates: selectedDates,
            fromDate: selectedDates.length ? selectedDates[0] : undefined,
            selectedDate: selectedDates.length ? selectedDates[0] : undefined,
            toDate: selectedDates.length ? selectedDates[selectedDates.length - 1] : undefined,
            formatDate: (date: Date) => (new Date(date.getTime())).toLocaleString(this.props.locale, this.props.dateFormat),
        };
        this.props.onSelectDate(options);
    }

    clearDateSelection() {
        this.setState({ selectedDates: [] });
        this.props.onClear && this.props.onClear();
    }

    onMouseEnterDate(date: Date) {
        this.setState({ mouseOverDate: date });
    }

    onMouseLeaveDate() {
        this.setState({ mouseOverDate: undefined });
    }

    selectDatesInRange(date: Date, toDate?: Date) {
        const selectedDates = [new Date(date.getFullYear(), date.getMonth(), date.getDate())];
        if (toDate) selectedDates.push(new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 58, 59));
        this.setState({
            selectedDates,
            activeDate: DateHelper.withTime(date),
        });
        if (!this.props.reportOnSelectClickOnly && selectedDates.length) this.reportOnSelectDate(selectedDates);
    }

    switchMode(element: DateTimePickerLayoutElement) {
        let activeMode;
        switch (element) {
            case DateTimePickerLayoutElement.YearElement:
                activeMode = DateTimePickerMode.YEAR;
                break;
            case DateTimePickerLayoutElement.MonthElement:
                activeMode = DateTimePickerMode.MONTH;
                break;
            default:
                activeMode = DateTimePickerMode.DATETIME;
                break;
        }
        this.setState({ activeMode });
    }

    performDateControlAction(element: DateTimePickerLayoutElement) {
        const date = new Date();
        switch (element) {
            case DateTimePickerLayoutElement.TodayElement:
            case DateTimePickerLayoutElement.TodayDateElement:
                this.selectDatesInRange(date, this.props.selectionMode === DateTimePickerSelectionMode.RANGE ? date : undefined);
                break;
            case DateTimePickerLayoutElement.YesterdayElement:
                const newDate = DateHelper.addDays(date, -1);
                this.selectDatesInRange(newDate, newDate);
                break;
            case DateTimePickerLayoutElement.LastYearElement:
            case DateTimePickerLayoutElement.ThisYearElement:
                const year = element === DateTimePickerLayoutElement.LastYearElement ? date.getFullYear() - 1 : date.getFullYear();
                const start = new Date(year, 0, 1); const end = new Date(year, 11, 1);
                end.setDate(DateHelper.daysInMonth(year, 11));
                this.selectDatesInRange(start, end);
                break;
            case DateTimePickerLayoutElement.ThisMonthElement:
            case DateTimePickerLayoutElement.LastMonthElement:
                const startth = element === DateTimePickerLayoutElement.LastMonthElement ? DateHelper.addMonths(date, -1) : date;
                const endth = DateHelper.clone(startth); startth.setDate(1); endth.setDate(DateHelper.daysInMonth(startth));
                this.selectDatesInRange(startth, endth);
                break;
            case DateTimePickerLayoutElement.LastSevenDaysElement:
            case DateTimePickerLayoutElement.LastThirtyDaysElement:
                const startlsd = DateHelper.addDays(date, element === DateTimePickerLayoutElement.LastSevenDaysElement ? -6 : -29);
                this.selectDatesInRange(startlsd, date);
                break;
        }
    }

    selectNowDate() {
        this.selectDatesInRange(new Date());
    }

    onSelectDate(date: Date, reset: boolean = false) {
        let activeDate: Date = this.state.activeDate;
        let newSelectedDates: Date[] = this.state.selectedDates;
        if (!reset && this.props.maxMultipleModeDateSelection
            && !DateHelper.isInArrayOfDates(newSelectedDates, date)
            && this.state.selectedDates.length >= this.props.maxMultipleModeDateSelection) {
            this.props.onMaxMultipleDateSelected && this.props.onMaxMultipleDateSelected();
            return;
        }
        date = DateHelper.withTime(date);
        if (reset) newSelectedDates = [date];
        if (!reset) switch (this.props.selectionMode) {
            case DateTimePickerSelectionMode.MULTIPLE:
                if (DateHelper.isInArrayOfDates(newSelectedDates, date)) {
                    if (!this.props.dontUnselectOnSameDate) newSelectedDates = newSelectedDates.filter((value: Date) => value.getTime() !== date.getTime());
                } else {
                    newSelectedDates.push(date);
                }
                break;
            case DateTimePickerSelectionMode.RANGE:
                if (newSelectedDates.length) {
                    if (DateHelper.isInArrayOfDates(newSelectedDates, date)) {
                        if (newSelectedDates.length > 1) newSelectedDates = newSelectedDates.filter((value: Date) => value.getTime() !== date.getTime());
                        else newSelectedDates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 58, 59));
                    } else {
                        let existingDate = newSelectedDates[0];
                        newSelectedDates = [existingDate, existingDate];
                        newSelectedDates[(date > existingDate ? 1 : 0)] = date;
                    }
                } else {
                    newSelectedDates.push(date);
                }
                break;
            case DateTimePickerSelectionMode.SINGLE:
            default:
                if (newSelectedDates.length && DateHelper.dateEquals([newSelectedDates[0], date])) {
                    if (!this.props.dontUnselectOnSameDate) newSelectedDates = [];
                } else {
                    newSelectedDates = [date];
                }
        }
        if (this.props.makeOverlapSelectable && newSelectedDates.length) {
            activeDate = DateHelper.withTime(newSelectedDates[this.props.selectionMode === DateTimePickerSelectionMode.RANGE ? 0 : newSelectedDates.length - 1]);
        }
        this.setState({ activeDate, selectedDates: newSelectedDates });
        if (!this.props.reportOnSelectClickOnly && newSelectedDates.length) this.reportOnSelectDate(newSelectedDates);
    }

    onSelectYear(event: Event, year: number) {
        const selectedDate = (this.state.selectedDates.length ? this.state.selectedDates[0] : new Date());
        selectedDate.setFullYear(year);
        if (this.props.mode === DateTimePickerMode.YEAR) {
            if (!this.props.sticky) this.toggle(event);
            this.onSelectDate(selectedDate, true);
            return;
        }
        this.setState({ activeDate: selectedDate, activeMode: DateTimePickerMode.MONTH });
    }

    onSelectMonth(event: Event, month: number, year: number) {
        const selectedDate = (this.state.selectedDates.length ? this.state.selectedDates[0] : new Date());
        selectedDate.setMonth(month);
        selectedDate.setFullYear(year);
        if (this.props.mode === DateTimePickerMode.MONTH) {
            if (!this.props.sticky) this.toggle(event);
            this.onSelectDate(selectedDate, true);
            return;
        }
        this.setState({ activeDate: selectedDate, activeMode: DateTimePickerMode.DATETIME });
    }

    dateShouldBeDisabled(date: Date) {
        let disable = false;
        if (this.props.disableFromDate && date > this.props.disableFromDate) disable = true;
        if (this.props.disableToDate && date <= this.props.disableToDate) disable = true;
        if (!disable && this.props.disabledYears.includes(date.getFullYear())) disable = true;
        if (disable && this.props.enabledYears.includes(date.getFullYear())) disable = false;
        if (!disable && this.props.disabledMonths.includes(date.getMonth())) disable = true;
        if (disable && this.props.enabledMonths.includes(date.getMonth())) disable = false;
        if (!disable && this.props.disabledWeekdays.includes(DateTimePickerWeekdayIndex[date.getDay()])) disable = true;
        if (disable && this.props.enabledWeekdays.includes(DateTimePickerWeekdayIndex[date.getDay()])) disable = false;
        if (!disable && DateHelper.isInArrayOfDates(this.props.disabledDates, date)) disable = true;
        if (disable && DateHelper.isInArrayOfDates(this.props.enabledDates, date)) disable = false;
        return disable;
    }

    selectDateControlScheme(layoutElement: DateTimePickerLayoutElement) {
        if (layoutElement === DateTimePickerLayoutElement.YearElement && this.props.staticMode) return undefined;
        if (layoutElement === DateTimePickerLayoutElement.MonthElement && this.props.staticMode) return undefined;
        if (!BoolHelper.equalsAny(layoutElement, [
            DateTimePickerLayoutElement.TodayElement,
            DateTimePickerLayoutElement.ThisYearElement,
            DateTimePickerLayoutElement.LastYearElement,
            DateTimePickerLayoutElement.YesterdayElement,
            DateTimePickerLayoutElement.YesterdayElement,
            DateTimePickerLayoutElement.ThisMonthElement,
            DateTimePickerLayoutElement.LastMonthElement,
            DateTimePickerLayoutElement.LastSevenDaysElement,
            DateTimePickerLayoutElement.LastThirtyDaysElement,
        ])) return this.props.scheme;
        let isSelected = false;
        let date = DateHelper.withoutTime(new Date());
        const fromDate = this.state.selectedDates.length ? this.state.selectedDates[0] : undefined;
        const toDate = this.state.selectedDates.length && (this.state.selectedDates.length > 1 || this.props.selectionMode === DateTimePickerSelectionMode.SINGLE)
            ? this.state.selectedDates[this.state.selectedDates.length - 1] : undefined;
        const selectedDates = [fromDate, toDate ? DateHelper.withEndOfDayTime(toDate) : undefined];
        if (!selectedDates[0] && !selectedDates[1]) return this.props.idleScheme;
        if (layoutElement === DateTimePickerLayoutElement.TodayElement) {
            isSelected = DateHelper.areInArrayOfDates(selectedDates, [date, DateHelper.withEndOfDayTime(date)], false);
        }
        if (layoutElement === DateTimePickerLayoutElement.YesterdayElement) {
            date = DateHelper.addDays(date, -1);
            isSelected = DateHelper.areInArrayOfDates(selectedDates, [date, DateHelper.withEndOfDayTime(date)], false);
        }
        if (layoutElement === DateTimePickerLayoutElement.LastYearElement
            || layoutElement === DateTimePickerLayoutElement.ThisYearElement) {
            const year = layoutElement === DateTimePickerLayoutElement.LastYearElement ? date.getFullYear() - 1 : date.getFullYear();
            const start = new Date(year, 0, 1); const end = new Date(year, 11, 1);
            end.setDate(DateHelper.daysInMonth(year, 11));
            isSelected = DateHelper.areInArrayOfDates(selectedDates, [start, DateHelper.withEndOfDayTime(end)], false);
        }
        if (layoutElement === DateTimePickerLayoutElement.ThisMonthElement
            || layoutElement === DateTimePickerLayoutElement.LastMonthElement) {
            const startth = layoutElement === DateTimePickerLayoutElement.LastMonthElement ? DateHelper.addMonths(date, -1) : date;
            const endth = DateHelper.clone(startth); startth.setDate(1); endth.setDate(DateHelper.daysInMonth(startth));
            isSelected = DateHelper.areInArrayOfDates(selectedDates, [startth, DateHelper.withEndOfDayTime(endth)], false);
        }
        if (layoutElement === DateTimePickerLayoutElement.LastSevenDaysElement
            || layoutElement === DateTimePickerLayoutElement.LastThirtyDaysElement) {
            const startlsd = DateHelper.addDays(date, layoutElement === DateTimePickerLayoutElement.LastSevenDaysElement ? -6 : -29)
            isSelected = DateHelper.areInArrayOfDates(selectedDates, [startlsd, DateHelper.withEndOfDayTime(date)], false);
        }
        return isSelected ? this.props.scheme : this.props.idleScheme;
    }

    buildLayoutElement(options: TimePickerLayoutElementBuilderOptions, formattedDate: FormatedDate, layoutElements: NoseurObject<NoseurElement>, layoutElement: DateTimePickerLayoutElement, layout: string, className: string, template: DateTimePickerElementTemplateHandler | null, controlActionMap: NoseurObject<(e: any) => void>, key: string | number = DOMHelper.uniqueElementId()) {
        if (template) {
            return template({
                options,
                layoutElement,
                formattedDate,
                controlActionMap,
                props: this.props,
                labelsMap: this.labelsMap,
                elementBuilder: dateTimePickerBuildLayoutElement,
            });
        }
        const contents: any[] = [];
        let subContents: any[] | undefined;
        const layoutElementNames = layout.split(" ");
        layoutElementNames.forEach((n, i) => {
            const element: any = layoutElements[n];
            if (!element) return;
            const props: any = { key: i };
            // resolve increment decrement
            if (n === DateTimePickerLayoutElement.NextElement || n === DateTimePickerLayoutElement.PreviousElement) {
                const leftNeigbhor = i === 0 ? undefined : layoutElementNames[i - 1];
                const rightNeigbhor = i === layoutElementNames.length - 1 ? undefined : layoutElementNames[i + 1];
                const func = n === DateTimePickerLayoutElement.NextElement ? this.next : this.prev;
                props.onClick = () => func(leftNeigbhor, rightNeigbhor);
            } else if (n === DateTimePickerLayoutElement.IncrementElement || n === DateTimePickerLayoutElement.DecrementElement) {
                const leftNeigbhor = i === 0 ? undefined : layoutElementNames[i - 1];
                const rightNeigbhor = i === layoutElementNames.length - 1 ? undefined : layoutElementNames[i + 1];
                const func = n === DateTimePickerLayoutElement.IncrementElement ? this.increment : this.decrement;
                props.onClick = () => func(leftNeigbhor, rightNeigbhor);
            }
            // resolve groups
            if (element === DateTimePickerLayoutElement.OpenColumnGroupElement || element === DateTimePickerLayoutElement.OpenRowGroupElement) {
                subContents = [];
                return;
            } else if (element === DateTimePickerLayoutElement.CloseColumnGroupElement || element === DateTimePickerLayoutElement.CloseRowGroupElement) {
                const relayAttrs = (element === DateTimePickerLayoutElement.CloseColumnGroupElement
                    ? this.props.attrsRelay?.columnGroup : this.props.attrsRelay?.rowGroup);
                const className = Classname.build((element === DateTimePickerLayoutElement.CloseColumnGroupElement
                    ? "noseur-date-time-picker-column" : "noseur-date-time-picker-row"), relayAttrs?.className);
                contents.push(<div className={className} key={i} style={relayAttrs?.style}>{subContents}</div>);
                subContents = undefined;
                return;
            }
            if (subContents) {
                subContents.push(React.cloneElement(element, props));
                return;
            }
            // default
            contents.push(React.cloneElement(element, props));
        });
        if (!contents.length) return null;
        return (<div className={className} key={key}>{contents}</div>);
    }

    buildDateElement(_date: Date | string, dayControl: Partial<ButtonProps> | NoseurElement, controlActionMap: NoseurObject<(e: any) => void>) {
        const isNotDate = TypeChecker.isString(_date);
        const date = isNotDate ? new Date(1111, 0, 0) : _date;
        const formattedDate = DateHelper.formatDateToObject(date, {
            monthName: { month: 'long' },
            longYear: { year: 'numeric' },
            formatted: this.props.dateFormat,
        }, this.props.locale, this.props.hourFormat, this.state.activeDate);
        const dateShouldBeDisabled = this.dateShouldBeDisabled(date);
        formattedDate.disabled = formattedDate.isNotInMonth || dateShouldBeDisabled;
        const dateControlActionMap = { ...controlActionMap, DayElement: () => this.onSelectDate(date) };
        const text = this.props.dateTemplate ? this.props.dateTemplate(formattedDate) : (isNotDate ? _date : "" + date.getDate());
        const selected = DateHelper.isInArrayOfDates(this.state.selectedDates, date);
        const isWithinRange = this.props.selectionMode === DateTimePickerSelectionMode.RANGE && !selected && this.state.selectedDates.length && (this.state.selectedDates.length > 1 || this.state.mouseOverDate)
            ? DateHelper.dateIsInRange(this.state.selectedDates[0], this.state.selectedDates[1] ?? this.state.mouseOverDate, date)
            : false;
        const relayAttrs = this.props.attrsRelay?.date;
        const className = Classname.build("noseur-date-time-picker-days-date", relayAttrs?.className,
            (!selected ? Classname.build("noseur-date-time-picker-days-date-hover", relayAttrs?.hover?.className) : null),
            (selected ? Classname.build("noseur-date-time-picker-days-date-selected", relayAttrs?.selected?.className) : null),
            (isWithinRange ? Classname.build("noseur-date-time-picker-days-date-in-range", relayAttrs?.inRange?.className) : null),
            (this.props.makeOverlapSelectable && formattedDate.isNotInMonth && !dateShouldBeDisabled ? "noseur-all-pointer-event" : null),
            (!selected && this.props.highlightToday && DateHelper.isToday(date) ? Classname.build("noseur-date-time-picker-days-date-today") : null),
            (formattedDate.disabled ? Classname.build("noseur-date-time-picker-days-date-disabled", relayAttrs?.disabled?.className) : Classname.build("noseur-date-time-picker-days-date-enabled", relayAttrs?.enabled?.className)));

        if ((!dayControl || (!React.isValidElement(dayControl) && (typeof dayControl) === "object"))) {
            if (!dayControl) dayControl = {};
            (dayControl as any).textOnly = !selected;
            (dayControl as any).className = className;
            if (this.state.selectedDates.length && this.props.selectionMode === DateTimePickerSelectionMode.RANGE && this.props.highlightDatesInRange && !selected) {
                (dayControl as any).onMouseLeave = () => this.onMouseLeaveDate();
                (dayControl as any).onMouseEnter = () => this.onMouseEnterDate(date);
            }
        }
        const options = {
            text,
            formattedDate,
            control: dayControl,
            action: dateControlActionMap["DayElement"],
            layoutElement: DateTimePickerLayoutElement.DayElement,
            scheme: (selected ? this.props.scheme : this.props.idleScheme),
        };
        if (this.props.dayTemplate) {
            return this.props.dayTemplate(isNotDate ? -1 : date.getDate(), {
                options,
                formattedDate,
                props: this.props,
                labelsMap: this.labelsMap,
                controlActionMap: dateControlActionMap,
                elementBuilder: dateTimePickerBuildLayoutElement,
                layoutElement: DateTimePickerLayoutElement.DayElement,
            }, selected, date, formattedDate.isNotInMonth);
        }
        return dateTimePickerBuildLayoutElement(options);
    }

    buildLayoutElements(formattedDate: FormatedDate, controlActionMap: NoseurObject<(e?: any) => void>) {
        const layoutElements: NoseurObject<NoseurElement> = {};
        const requiredLayoutElements = new Set<DateTimePickerLayoutElement>();
        this.props.layout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.topLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.timeLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.leftLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.rightLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.footerLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.headerLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.bottomLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.yearModeLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.selectionLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.monthModeLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.yearModeHeaderLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.yearModeHeaderLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.monthModeHeaderLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        this.props.monthModeHeaderLayout.split(" ").forEach(l => requiredLayoutElements.add(l as any));
        const excludedLayouts = [
            DateTimePickerLayoutElement.TimeElement, DateTimePickerLayoutElement.WeekDayElement,
            DateTimePickerLayoutElement.DayElement, DateTimePickerLayoutElement.SelectionElement,
            DateTimePickerLayoutElement.LeftPanelElement, DateTimePickerLayoutElement.HeaderElement,
            DateTimePickerLayoutElement.FooterElement, DateTimePickerLayoutElement.RightPanelElement,
            DateTimePickerLayoutElement.TopPanelElement, DateTimePickerLayoutElement.BottomPanelElement,
            DateTimePickerLayoutElement.YearModeHeaderElement, DateTimePickerLayoutElement.YearModeFooterElement,
            DateTimePickerLayoutElement.MonthModeHeaderElement, DateTimePickerLayoutElement.MonthModeFooterElement,
        ];
        const activeYear = this.state.activeDate.getFullYear();
        const selectedYear = (this.state.selectedDates.length ? this.state.selectedDates[0] : new Date()).getFullYear();
        const controlPropsMap: NoseurObject<Partial<ButtonProps> | NoseurElement> = {
            DayElement: this.props.dayControl,
            NextElement: this.props.nextControl,
            PreviousElement: this.props.prevControl,
            IncrementElement: this.props.incrementControl,
            DecrementElement: this.props.decrementControl,
        };
        // TODO mltiple for multiple calender months
        formattedDate.disabled = formattedDate.isNotInMonth;
        requiredLayoutElements.forEach(requiredLayoutElement => {
            if (!requiredLayoutElement.trim()) return;
            if (excludedLayouts.includes(requiredLayoutElement)) return;
            const options: TimePickerLayoutElementBuilderOptions = {
                formattedDate,
                scheme: this.props.scheme,
                layoutElement: requiredLayoutElement,
                text: this.labelsMap[requiredLayoutElement],
                action: controlActionMap[requiredLayoutElement],
                control: controlPropsMap[requiredLayoutElement],
                basicAttrs: this.props.attrsRelay[requiredLayoutElement],
            };
            if (requiredLayoutElement === DateTimePickerLayoutElement.WeekdaysElements) {
                layoutElements[DateTimePickerLayoutElement.WeekdaysElements] = (<div className={Classname.build("noseur-date-time-picker-weekdays", this.props.attrsRelay?.weekdays?.className)}>
                    {this.props.weekdays.map((weekDay) => {
                        const opts = {
                            ...options,
                            layoutElement: weekDay,
                            text: DateHelper.translateWeekday(weekDay, this.props.locale),
                            control: controlPropsMap[DateTimePickerLayoutElement.WeekDayElement],
                            basicAttrs: addClassesToComponentElementBasicAttributes(this.props.attrsRelay[weekDay], Classname.build("noseur-date-time-picker-weekdays-day", this.props.attrsRelay?.weekdays?.weekday?.className))
                        };
                        return (this.props.weekdayTemplate
                            ? this.props.weekdayTemplate(weekDay, {
                                options: opts,
                                formattedDate,
                                controlActionMap,
                                props: this.props,
                                labelsMap: this.labelsMap,
                                elementBuilder: dateTimePickerBuildLayoutElement,
                                layoutElement: DateTimePickerLayoutElement.WeekDayElement,
                            })
                            : dateTimePickerBuildLayoutElement(opts));
                    })}
                </div>);
                return;
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.SelectedDatesElements) {
                layoutElements[DateTimePickerLayoutElement.SelectedDatesElements] = (<React.Fragment>
                    {this.state.selectedDates.map((date) => {
                        const opts = {
                            ...options,
                            layoutElement: DateTimePickerLayoutElement.SelectedDateElement,
                            text: date.toLocaleString(this.props.locale, this.props.dateFormat),
                            control: controlPropsMap[DateTimePickerLayoutElement.SelectedDateElement],
                            basicAttrs: addClassesToComponentElementBasicAttributes(this.props.attrsRelay[DateTimePickerLayoutElement.SelectedDateElement], Classname.build("noseur-date-time-picker-selected-dates-selected-date", this.props.attrsRelay?.selectedDate?.className))
                        };
                        return (this.props.selectedDateTemplate
                            ? this.props.selectedDateTemplate(date, {
                                options: opts,
                                formattedDate,
                                controlActionMap,
                                props: this.props,
                                labelsMap: this.labelsMap,
                                elementBuilder: dateTimePickerBuildLayoutElement,
                                layoutElement: DateTimePickerLayoutElement.SelectedDateElement,
                            })
                            : dateTimePickerBuildLayoutElement(opts));
                    })}
                </React.Fragment>);
                return;
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.DaysElements) {
                const daysElements: any[] = [];
                const row = 7, column = 6, rowColumnSum = row * column;
                const underline = this.props.showDatesSeperator && !this.props.showGridlines;
                const monthDays = DateHelper.getAllDaysInMonth(formattedDate.year, formattedDate.month);
                const startWeekday = monthDays[0].getDay();
                const previousMonthPadding = startWeekday;
                const nextMonthPadding = rowColumnSum - (monthDays.length + previousMonthPadding);
                const previousMonthDays = previousMonthPadding === 0 ? [] : this.props.dontOverlapDate
                    ? Array(previousMonthPadding).fill(" ")
                    : DateHelper.getAllDaysInMonth(formattedDate.year, formattedDate.month - 1, previousMonthPadding, true);
                const nextMonthDays = this.props.dontOverlapDate
                    ? Array(nextMonthPadding).fill(" ")
                    : DateHelper.getAllDaysInMonth(formattedDate.year, formattedDate.month + 1, nextMonthPadding);
                previousMonthDays.forEach(day => daysElements.push(this.buildDateElement(day, controlPropsMap[DateTimePickerLayoutElement.DayElement], controlActionMap)));
                monthDays.forEach(day => daysElements.push(this.buildDateElement(day, controlPropsMap[DateTimePickerLayoutElement.DayElement], controlActionMap)));
                nextMonthDays.forEach(day => daysElements.push(this.buildDateElement(day, controlPropsMap[DateTimePickerLayoutElement.DayElement], controlActionMap)));
                const className = Classname.build("noseur-date-time-picker-days", this.props.attrsRelay?.days?.className, {
                    "noseur-date-time-picker-days-underline": underline,
                }, (underline ? this.props.attrsRelay?.days?.underline?.className : null));
                layoutElements[DateTimePickerLayoutElement.DaysElements] = (<div className={className} style={{ gridTemplateColumns: this.props.weekdays.map(_ => "auto").join(" ") }}>
                    {daysElements}
                </div>);
                return;
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.YearsElements) {
                const comparatorYear = this.props.mode === DateTimePickerMode.DATETIME ? activeYear : selectedYear;
                layoutElements[DateTimePickerLayoutElement.YearsElements] = (<div className={Classname.build("noseur-date-time-picker-years", this.props.attrsRelay?.years?.className)}>
                    {Array(this.props.modeDifferenceCount).fill(undefined).map((_, index) => {
                        const year = activeYear + index;
                        const action = (event: Event) => this.onSelectYear(event, year);
                        const className = Classname.build("noseur-date-time-picker-long-year", this.props.attrsRelay?.years?.year?.className);
                        if (comparatorYear === year) controlPropsMap[DateTimePickerLayoutElement.YearElement] = {
                            className: Classname.build(className, "noseur-date-time-picker-long-year-selected", this.props.attrsRelay?.years?.selected?.className)
                        }; else controlPropsMap[DateTimePickerLayoutElement.YearElement] = { className };
                        const opts = {
                            ...options,
                            action,
                            text: year,
                            layoutElement: DateTimePickerLayoutElement.YearElement,
                            control: controlPropsMap[DateTimePickerLayoutElement.YearElement],
                            basicAttrs: addClassesToComponentElementBasicAttributes(this.props.attrsRelay[DateTimePickerLayoutElement.YearElement], Classname.build((controlPropsMap[DateTimePickerLayoutElement.YearElement] || {}).className))
                        };

                        return (this.props.yearTemplate
                            ? this.props.yearTemplate(index, {
                                options: opts,
                                formattedDate,
                                controlActionMap,
                                props: this.props,
                                labelsMap: this.labelsMap,
                                elementBuilder: dateTimePickerBuildLayoutElement,
                                layoutElement: DateTimePickerLayoutElement.YearElement,
                            })
                            : dateTimePickerBuildLayoutElement(opts));
                    })}
                </div>);
                return;
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.MonthsElements) {
                const activeSelectedDate = DateHelper.clone(this.state.selectedDates.length ? this.state.selectedDates[0] : new Date());
                layoutElements[DateTimePickerLayoutElement.MonthsElements] = (<div className="noseur-date-time-picker-months">
                    {Array(12).fill(undefined).map((_, index) => {
                        const selectedDate = DateHelper.clone(activeSelectedDate); selectedDate.setMonth(index);
                        const action = (event: Event) => this.onSelectMonth(event, index, activeYear);
                        const className = Classname.build("noseur-date-time-picker-month-name", this.props.attrsRelay?.years?.year?.className);
                        if (activeSelectedDate.getMonth() === index && activeSelectedDate.getFullYear() === activeYear) controlPropsMap[DateTimePickerLayoutElement.MonthElement] = {
                            className: Classname.build(className, "noseur-date-time-picker-month-name-selected", this.props.attrsRelay?.years?.selected?.className)
                        }; else controlPropsMap[DateTimePickerLayoutElement.MonthElement] = { className };
                        const monthName = selectedDate.toLocaleString(this.props.locale, { month: 'short' });
                        const opts = {
                            ...options,
                            action,
                            text: monthName,
                            layoutElement: DateTimePickerLayoutElement.MonthElement,
                            control: controlPropsMap[DateTimePickerLayoutElement.MonthElement],
                            basicAttrs: addClassesToComponentElementBasicAttributes(this.props.attrsRelay[DateTimePickerLayoutElement.MonthElement], Classname.build((controlPropsMap[DateTimePickerLayoutElement.MonthElement] || {}).className))
                        };

                        return (this.props.monthTemplate
                            ? this.props.monthTemplate(MonthIndex[index], {
                                options: opts,
                                formattedDate,
                                controlActionMap,
                                props: this.props,
                                labelsMap: this.labelsMap,
                                elementBuilder: dateTimePickerBuildLayoutElement,
                                layoutElement: DateTimePickerLayoutElement.YearElement,
                            })
                            : dateTimePickerBuildLayoutElement(opts));
                    })}
                </div>);
                return;
            }
            options.scheme = this.selectDateControlScheme(requiredLayoutElement);
            if (!DateTimePickerLayoutElementsValues.includes(requiredLayoutElement) && this.props.customElementTemplate) {
                const opts = {
                    ...options,
                    basicAttrs: addClassesToComponentElementBasicAttributes(this.props.attrsRelay[DateTimePickerLayoutElement.MonthElement], "noseur-date-time-picker-custom")
                };
                layoutElements[requiredLayoutElement] = this.props.customElementTemplate({
                    options: opts,
                    formattedDate,
                    controlActionMap,
                    props: this.props,
                    labelsMap: this.labelsMap,
                    layoutElement: requiredLayoutElement,
                    elementBuilder: dateTimePickerBuildLayoutElement,
                });
                return;
            }
            if (requiredLayoutElement === DateTimePickerLayoutElement.YearToElement) options.text = `` + (activeYear + this.props.modeDifferenceCount - 1);
            layoutElements[requiredLayoutElement] = dateTimePickerBuildLayoutElement(options);
        });
        requiredLayoutElements.forEach(requiredLayoutElement => {
            const options = {
                formattedDate,
                scheme: this.props.scheme,
                layoutElement: requiredLayoutElement,
                text: this.labelsMap[requiredLayoutElement],
                action: controlActionMap[requiredLayoutElement],
                control: controlPropsMap[requiredLayoutElement],
                basicAttrs: this.props.attrsRelay[requiredLayoutElement],
            };
            if (!requiredLayoutElement.includes("Element") || !excludedLayouts.includes(requiredLayoutElement)) return;
            if (requiredLayoutElement === DateTimePickerLayoutElement.HeaderElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-header");
                layoutElements[DateTimePickerLayoutElement.HeaderElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.HeaderElement, this.props.headerLayout, className, this.props.headerTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.FooterElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-footer");
                layoutElements[DateTimePickerLayoutElement.FooterElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.FooterElement, this.props.footerLayout, className, this.props.footerTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.YearModeHeaderElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-year-mode-header");
                layoutElements[DateTimePickerLayoutElement.YearModeHeaderElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.YearModeHeaderElement, this.props.yearModeHeaderLayout, className, this.props.yearModeHeaderTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.YearModeFooterElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-year-mode-footer");
                layoutElements[DateTimePickerLayoutElement.YearModeFooterElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.YearModeFooterElement, this.props.yearModeFooterLayout, className, this.props.yearModeFooterTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.MonthModeHeaderElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-month-mode-header");
                layoutElements[DateTimePickerLayoutElement.MonthModeHeaderElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.MonthModeHeaderElement, this.props.monthModeHeaderLayout, className, this.props.monthModeHeaderTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.MonthModeFooterElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-month-mode-footer");
                layoutElements[DateTimePickerLayoutElement.MonthModeFooterElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.MonthModeFooterElement, this.props.monthModeFooterLayout, className, this.props.monthModeFooterTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.TopPanelElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-top-panel");
                layoutElements[DateTimePickerLayoutElement.TopPanelElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.TopPanelElement, this.props.topLayout, className, this.props.topPanelTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.BottomPanelElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-bottom-panel");
                layoutElements[DateTimePickerLayoutElement.BottomPanelElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.BottomPanelElement, this.props.bottomLayout, className, this.props.bottomPanelTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.LeftPanelElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-left-panel");
                layoutElements[DateTimePickerLayoutElement.LeftPanelElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.LeftPanelElement, this.props.leftLayout, className, this.props.leftPanelTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.RightPanelElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-right-panel");
                layoutElements[DateTimePickerLayoutElement.RightPanelElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.RightPanelElement, this.props.rightLayout, className, this.props.rightPanelTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.SelectionElement && !this.props.timeOnly) {
                const className = Classname.build("noseur-date-time-picker-selection");
                const selectionTemplate = !this.props.selectionTemplate ? null : (options: DateTimePickerElementOptions) => this.props.selectionTemplate(this.state.selectedDates, options);
                layoutElements[DateTimePickerLayoutElement.SelectionElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.SelectionElement, this.props.selectionLayout, className, selectionTemplate, controlActionMap);
            } else if (requiredLayoutElement === DateTimePickerLayoutElement.TimeElement && this.props.showTime) {
                const className = Classname.build("noseur-date-time-picker-time");
                layoutElements[DateTimePickerLayoutElement.TimeElement] = this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.TimeElement, this.props.timeLayout, className, this.props.timeTemplate, controlActionMap);
            }
        });
        return layoutElements;
    }

    buildLayout(formattedDate: FormatedDate, layoutElements: NoseurObject<NoseurElement>, controlActionMap: NoseurObject<(e?: any) => void>) {
        let layout = this.props.layout;
        if (this.state.activeMode === DateTimePickerMode.YEAR) layout = this.props.yearModeLayout;
        if (this.state.activeMode === DateTimePickerMode.MONTH) layout = this.props.monthModeLayout;
        const rows = layout.split(DateTimePickerLayoutElement.RowDividerElement);
        return rows.map((row, index) => {
            if (!row.trim()) return null;
            const className = Classname.build("noseur-date-time-picker-layout noseur-date-time-picker-layout-row");
            const columns = row.split(DateTimePickerLayoutElement.ColumnDividerElement);
            return (<div className={className} key={index}>
                {columns.map((column, index) => {
                    const className = Classname.build("noseur-date-time-picker-layout noseur-date-time-picker-layout-column", {
                        "noseur-wd-100-pct": BoolHelper.equalsAny(column.trim(), ["TopPanelElement", "BottomPanelElement"])
                    });
                    const options = {
                        formattedDate,
                        layoutElement: column,
                        scheme: this.props.scheme,
                        text: this.labelsMap[column],
                        action: controlActionMap[column],
                        basicAttrs: addClassesToComponentElementBasicAttributes(this.props.attrsRelay[column], "noseur-date-time-picker-custom"),
                    };
                    return this.buildLayoutElement(options, formattedDate, layoutElements, DateTimePickerLayoutElement.MainLayoutElement, column, className, this.props.layoutTemplate, controlActionMap, index);
                })}
            </div>);
        });
    }

    render() {
        const formattedDate = DateHelper.formatDateToObject(this.state.activeDate, {
            monthName: { month: 'long' },
            longYear: { year: 'numeric' },
            formatted: this.props.dateFormat,
        }, this.props.locale, this.props.hourFormat, this.state.activeDate);
        const controlActionMap: NoseurObject<(e?: any) => void> = {
            NowElement: this.selectNowDate,
            ClearElement: this.clearDateSelection,
            SelectElement: (e) => { this.reportOnSelectDate(); this.toggle(e); },
            TodayElement: () => this.performDateControlAction(DateTimePickerLayoutElement.TodayElement),
            LastYearElement: () => this.performDateControlAction(DateTimePickerLayoutElement.LastYearElement),
            ThisYearElement: () => this.performDateControlAction(DateTimePickerLayoutElement.ThisYearElement),
            TodayDateElement: () => this.performDateControlAction(DateTimePickerLayoutElement.TodayDateElement),
            YesterdayElement: () => this.performDateControlAction(DateTimePickerLayoutElement.YesterdayElement),
            ThisMonthElement: () => this.performDateControlAction(DateTimePickerLayoutElement.ThisMonthElement),
            LastMonthElement: () => this.performDateControlAction(DateTimePickerLayoutElement.LastMonthElement),
            YearElement: () => !this.props.staticMode && this.switchMode(DateTimePickerLayoutElement.YearElement),
            MonthElement: () => !this.props.staticMode && this.switchMode(DateTimePickerLayoutElement.MonthElement),
            LastSevenDaysElement: () => this.performDateControlAction(DateTimePickerLayoutElement.LastSevenDaysElement),
            LastThirtyDaysElement: () => this.performDateControlAction(DateTimePickerLayoutElement.LastThirtyDaysElement),
        };
        const layoutElements = this.buildLayoutElements(formattedDate, controlActionMap);
        const layoutPanel = this.buildLayout(formattedDate, layoutElements, controlActionMap);
        const className = Classname.build("noseur-date-time-picker", {
            "noseur-date-time-picker-time-only": this.props.timeOnly,
            "noseur-date-time-picker-modal": this.props.type === DateTimePickerType.MODAL,
            "noseur-date-time-picker-inline": this.props.type === DateTimePickerType.INLINE,
            "noseur-date-time-picker-popover": this.props.type === DateTimePickerType.POPOVER,
        },
            this.props.scheme ? `${this.props.scheme}-vars` : null, this.props.className);
        const ref = (r: HTMLDivElement) => {
            if (!r) return;
            if (this.props.autoFocus) r.focus();
            ObjectHelper.resolveRef(this.props.forwardRef, r);
        };

        switch (this.props.type) {
            case DateTimePickerType.MODAL:
                return (<Dialog {...this.props.dialogProps} ref={ref} className={className} style={this.props.style} manageRef={(m) => this.dialogManageRef = m}
                    visible={this.state.modalVisible} onHide={() => this.setState({ modalVisible: false })} notClosable>
                    {layoutPanel}
                </Dialog>);
            case DateTimePickerType.POPOVER:
                return (<Popover positional="left" outsideClickLogic={"positional"} {...this.props.popoverProps} ref={ref} className={className} style={this.props.style} manageRef={(m) => this.popoverManageRef = m}>
                    {layoutPanel}
                </Popover>);
            default:
                return (<div ref={ref} className={className} style={this.props.style}>
                    {layoutPanel}
                </div>);
        }
    }

}

export const DateTimePicker = React.forwardRef<HTMLDivElement, Partial<DateTimePickerProps>>((props, ref) => (
    <DateTimePickerComponent showTime={true} {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

export const YearPicker = React.forwardRef<HTMLDivElement, Partial<DateTimePickerProps>>((props, ref) => (
    <DateTimePickerComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={false} mode={DateTimePickerMode.YEAR} />
));

export const MonthPicker = React.forwardRef<HTMLDivElement, Partial<DateTimePickerProps>>((props, ref) => (
    <DateTimePickerComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={false} mode={DateTimePickerMode.MONTH} />
));

export const DatePicker = React.forwardRef<HTMLDivElement, Partial<DateTimePickerProps>>((props, ref) => (
    <DateTimePickerComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={false} />
));

export const TimePicker = React.forwardRef<HTMLDivElement, Partial<DateTimePickerProps>>((props, ref) => (
    <DateTimePickerComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} showTime={true} timeOnly={true}
        layout={DateTimePickerLayoutElement.TimeElement} popoverProps={{ ...(props.popoverProps ?? {}), pointingArrowClassName: "" }} />
));

export const DateTimePickerLayoutElementsValues = Object.values(DateTimePickerLayoutElement);

export function dateTimePickerBuildLayoutElement(options: TimePickerLayoutElementBuilderOptions) {
    let { basicAttrs, formattedDate, key, text, layoutElement, control, scheme, action } = options;
    key = key ?? DOMHelper.uniqueElementId();

    if (layoutElement === DateTimePickerLayoutElement.PreviousElement) {
        return buildButtonControl(control || {}, {
            key,
            rounded: true,
            textOnly: true,
            style: basicAttrs?.style,
            leftIcon: "fa fa-angle-left",
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-prev", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.NextElement) {
        return buildButtonControl(control || {}, {
            key,
            rounded: true,
            textOnly: true,
            style: basicAttrs?.style,
            leftIcon: "fa fa-angle-right",
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-next", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.IncrementElement) {
        return buildButtonControl(control || {}, {
            key,
            rounded: true,
            textOnly: true,
            style: basicAttrs?.style,
            leftIcon: "fa fa-angle-up",
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-incr", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.DecrementElement) {
        return buildButtonControl(control || {}, {
            key,
            rounded: true,
            textOnly: true,
            style: basicAttrs?.style,
            leftIcon: "fa fa-angle-down",
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-decr", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.TodayDateElement) {
        return buildButtonControl(control || {}, {
            key,
            text,
            style: basicAttrs?.style,
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-todays-date", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.ClearElement) {
        return buildButtonControl(control || {}, {
            key,
            text,
            style: basicAttrs?.style,
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-clear", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.SelectElement) {
        return buildButtonControl(control || {}, {
            key,
            text,
            style: basicAttrs?.style,
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-select", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.NowElement) {
        return buildButtonControl(control || {}, {
            key,
            text,
            style: basicAttrs?.style,
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-now", basicAttrs?.className));
    } else if (BoolHelper.equalsAny(layoutElement, [
        DateTimePickerLayoutElement.TodayElement,
        DateTimePickerLayoutElement.ThisYearElement,
        DateTimePickerLayoutElement.LastYearElement,
        DateTimePickerLayoutElement.YesterdayElement,
        DateTimePickerLayoutElement.YesterdayElement,
        DateTimePickerLayoutElement.ThisMonthElement,
        DateTimePickerLayoutElement.LastMonthElement,
        DateTimePickerLayoutElement.LastSevenDaysElement,
        DateTimePickerLayoutElement.LastThirtyDaysElement,
    ])) {
        return buildButtonControl(control || {}, {
            key,
            text,
            textOnly: true,
            style: basicAttrs?.style,
            scheme: basicAttrs?.scheme ?? scheme,
        }, action, Classname.build("noseur-date-time-picker-today", basicAttrs?.className));
    } else if (layoutElement === DateTimePickerLayoutElement.MonthElement) {
        const className = Classname.build("noseur-date-time-picker-month-name", {
            "noseur-date-time-picker-month-name-enabled": !!scheme
        }, ((control || {}) as any).className, basicAttrs?.className);
        return (<span className={className} style={basicAttrs?.style} onClick={action} key={key}>{text ?? formattedDate.monthName}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.YearElement) {
        const className = Classname.build("noseur-date-time-picker-long-year", {
            "noseur-date-time-picker-long-year-enabled": !!scheme
        }, ((control || {}) as any).className, basicAttrs?.className);
        return (<span className={className} style={basicAttrs?.style} onClick={action} key={key}>{text ?? formattedDate.longYear}</span>);
    } else if (BoolHelper.equalsAny(layoutElement, [
        Weekday.SUNDAY,
        Weekday.MONDAY,
        Weekday.FRIDAY,
        Weekday.TUESDAY,
        Weekday.THURSDAY,
        Weekday.SATURDAY,
        Weekday.WEDNESDAY,
    ])) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-weekdays-day", basicAttrs?.className)} key={key}>{text ?? DateHelper.translateWeekday(layoutElement)}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.DayElement) {
        return buildButtonControl(control || {}, {
            text,
            scheme,
            rounded: true,
            textOnly: true,
            borderless: true,
            disabled: formattedDate.disabled,
            id: (formattedDate.isNotInMonth ? `N` : "") + formattedDate.day + key,
            key: (formattedDate.isNotInMonth ? `N` : "") + formattedDate.day + key,
        }, action);
    } else if (layoutElement === DateTimePickerLayoutElement.YearToElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-year-to", basicAttrs?.className)} key={key}>{text ?? formattedDate.longYear}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.YearFromElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-year-from", basicAttrs?.className)} key={key}>{text ?? formattedDate.longYear}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.TodaysDateElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-todays-date", basicAttrs?.className)} key={key}>{formattedDate.formatted}</span>);
    }
    // time
    if (layoutElement === DateTimePickerLayoutElement.HourElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-time-hours", basicAttrs?.className)} key={key}>{formattedDate.hours}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.MinutesElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-time-minutes", basicAttrs?.className)} key={key}>{formattedDate.minutes}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.SecondsElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-time-seconds", basicAttrs?.className)} key={key}>{formattedDate.seconds}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.MeridianElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-time-meridian", basicAttrs?.className)} key={key}>{formattedDate.meridian}</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.SelectedDateElement) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-selected-dates-selected-date", basicAttrs?.className)} key={key}>{text}</span>);
    }
    // groups 
    if (layoutElement === DateTimePickerLayoutElement.OpenColumnGroupElement
        || layoutElement === DateTimePickerLayoutElement.OpenRowGroupElement
        || layoutElement === DateTimePickerLayoutElement.CloseRowGroupElement
        || layoutElement === DateTimePickerLayoutElement.CloseColumnGroupElement) {
        return layoutElement;
    }
    // seperators 
    if (layoutElement === DateTimePickerLayoutElement.DashElement) {
        return (<div style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-dash", basicAttrs?.className)} key={key}>-</div>);
    } else if (layoutElement === DateTimePickerLayoutElement.SpaceElement) {
        return (<div style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-space", basicAttrs?.className)} key={key}> </div>);
    } else if (layoutElement === DateTimePickerLayoutElement.TimeSeperator) {
        return (<span style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-time-seperator", basicAttrs?.className)} key={key}>:</span>);
    } else if (layoutElement === DateTimePickerLayoutElement.SpaceLeftRightElement) {
        return (<div style={basicAttrs?.style} className={Classname.build("noseur-date-time-picker-seperator", basicAttrs?.className)} key={key}></div>);
    }
    return (<div className={Classname.build("noseur-date-time-picker-custom", basicAttrs?.className)}>{text ?? layoutElement}</div>);
}
