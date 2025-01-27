
import "../Composed.css";
import React from "react";
import { ColorEventHandler } from "../../constants/Types";
import { ComponentBaseProps, ComponentRenderType } from "../../core/ComponentBaseProps";
import { DialogManageRef, DialogProps } from "../../overlay/Dialog";
import { PopoverManageRef, PopoverProps } from "../../overlay/Popover";

export enum ColorPickerLayoutElement {
    DashElement = "[d]",
    SpaceElement = "[s]",
    RowDividerElement = "[-]",
    OpenRowGroupElement = "{",
    CloseRowGroupElement = "}",
    PanelSeparatorElement = "|",
    ColumnDividerElement = "[|]",
    SpaceLeftRightElement = "<>",
    OpenColumnGroupElement = "<",
    CloseColumnGroupElement = ">",
    ClearElement = "ClearElement",
    ChooseElement = "ChooseElement",
    CancelElement = "CancelElement",
    MapToggleElement = "MapToggleElement",
    PalleteToggleElement = "PalleteToggleElement",
    ClearSolidColorElement = "ClearSolidColorElement",
    ColorFormatDropdownElement = "ColorFormatDropdownElement",
    ClearTransparentColorElement = "ClearTransparentColorElement",
}

export enum ColorPickerLayout {
    
}

export type ColorPickerAttributtesRelays = {
    dialog?: Partial<DialogProps>;
    popover?: Partial<PopoverProps>
}

export interface ColorPickerManageRef {

}

export interface ColorPickerProps extends ComponentBaseProps<HTMLDivElement, ColorPickerManageRef, ColorPickerAttributtesRelays> {
    autoFocus: boolean;
    modalVisible: boolean;
    type: ComponentRenderType;

    onSelectColor: ColorEventHandler;
}

interface ColorPickerState {
    modalVisible: boolean;
}

class ColorPickerComponent extends React.Component<ColorPickerProps, ColorPickerState> {

    public static defaultProps: Partial<ColorPickerProps> = {
    };

    state: ColorPickerState = {
        modalVisible: this.props.modalVisible,
    };

    dialogManageRef: DialogManageRef | null = {} as any;
    popoverManageRef: PopoverManageRef | null = {} as any;

    constructor(props: ColorPickerProps) {
        super(props);
        
        this.toggle = this.toggle.bind(this);
        this.toggleMapComponent = this.toggleMapComponent.bind(this);
        this.togglePalleteElement = this.togglePalleteElement.bind(this);
        this.reportOnSelectColor = this.reportOnSelectColor.bind(this);
        this.performColorControlAction = this.performColorControlAction.bind(this);
    }

    toggle(event: Event, target?: HTMLElement) {
        switch (this.props.type) {
            case ComponentRenderType.MODAL:
                this.setState({ modalVisible: !this.state.modalVisible });
                break;
            case ComponentRenderType.POPOVER:
                this.popoverManageRef!.toggle(event, target);
                break;
        }
    }

    performColorControlAction(element: ColorPickerLayoutElement) {
        switch (element) {
            case ColorPickerLayoutElement.ClearElement:
                // TODO impl.
                break;
            case ColorPickerLayoutElement.CancelElement:
                // TODO impl.
                break;
            case ColorPickerLayoutElement.ChooseElement:
                // TODO impl.
                break;
            case ColorPickerLayoutElement.ClearSolidColorElement:
                // TODO impl.
                break;
            case ColorPickerLayoutElement.ColorFormatDropdownElement:
                // TODO impl.
                break;
            case ColorPickerLayoutElement.ClearTransparentColorElement:
                // TODO impl.
                break;
        }
    }

    reportOnSelectColor(hex?: string) {
        if (!this.props.onSelectColor) return;
        
        throw new Error("Implement report on select color " + hex);
    }

    toggleMapComponent() {
        
    }

    togglePalleteElement() {
        
    }

    /*buildLayoutElements(controlActionMap: NoseurObject<(e?: any) => void>) {
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
                const underline = this.props.showDatesSeparator && !this.props.showGridlines;
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

    buildLayout(layoutElements: NoseurObject<NoseurElement>, controlActionMap: NoseurObject<(e?: any) => void>) {
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
        const controlActionMap: NoseurObject<(e?: any) => void> = {
            MapToggleElement: this.toggleMapComponent,
            PalleteToggleElement: this.togglePalleteElement,
            SelectColor: (e) => { this.reportOnSelectColor(); this.toggle(e); },
            ClearElement: () => this.performColorControlAction(ColorPickerLayoutElement.ClearElement),
            CancelElement: () => this.performColorControlAction(ColorPickerLayoutElement.CancelElement),
            ChooseElement: () => this.performColorControlAction(ColorPickerLayoutElement.ChooseElement),
            ClearSolidColorElement: () => this.performColorControlAction(ColorPickerLayoutElement.ClearSolidColorElement),
            ColorFormatDropdownElement: () => this.performColorControlAction(ColorPickerLayoutElement.ColorFormatDropdownElement),
            ClearTransparentColorElement: () => this.performColorControlAction(ColorPickerLayoutElement.ClearTransparentColorElement),
        };
        const layoutElements = this.buildLayoutElements(controlActionMap);
        const layoutPanel = this.buildLayout(layoutElements, controlActionMap);
        const className = Classname.build("noseur-color-picker", {
            "noseur-color-picker-modal": this.props.type === ComponentRenderType.MODAL,
            "noseur-color-picker-inline": this.props.type === ComponentRenderType.INLINE,
            "noseur-color-picker-popover": this.props.type === ComponentRenderType.POPOVER,
        },
            this.props.scheme ? `${this.props.scheme}-vars` : null, this.props.className);
        const ref = (r: HTMLDivElement) => {
            if (!r) return;
            if (this.props.autoFocus) r.focus();
            ObjectHelper.resolveRef(this.props.forwardRef, r);
        };

        switch (this.props.type) {
            case ComponentRenderType.MODAL:
                return (<Dialog notClosable {...this.props.attrsRelay?.dialog} ref={ref} className={className} style={this.props.style} manageRef={(m) => this.dialogManageRef = m}
                    visible={this.state.modalVisible} onHide={() => this.setState({ modalVisible: false })}>
                    {layoutPanel}
                </Dialog>);
            case ComponentRenderType.POPOVER:
                return (<Popover outsideClickLogic={"positional"} {...this.props.attrsRelay?.popover} ref={ref} className={className} style={this.props.style} manageRef={(m) => this.popoverManageRef = m}>
                    {layoutPanel}
                </Popover>);
            default:
                return (<div ref={ref} className={className} style={this.props.style}>
                    {layoutPanel}
                </div>);
        }
    };*/

}

export const ColorPicker = React.forwardRef<HTMLDivElement, Partial<ColorPickerProps>>((props, ref) => (
    <ColorPickerComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
