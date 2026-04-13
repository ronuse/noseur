
import React from "react";
import { Classname } from "../utils/Classname";
import { ComponentBaseProps, ComponentElementBasicAttributes } from "../core/ComponentBaseProps";

export type CalendarAttributesRelays = {
    day?: {
        
    } & ComponentElementBasicAttributes;
    week?: {
        
    } & ComponentElementBasicAttributes;
}

export enum CalenderMode {
    DAY,
    WEEK,
    YEAR,
    MONTH,
    XDAYS,
    SCHEDULE,
}

export interface CalendarManageRef {

}

export interface CalendarProps extends ComponentBaseProps<HTMLDivElement, CalendarManageRef, CalendarAttributesRelays> {
    mode: CalenderMode;
}

interface CalendarState {
    mode: CalenderMode;
}

class CalendarComponent extends React.Component<CalendarProps, CalendarState> {

    public static defaultProps: Partial<CalendarProps> = {
        mode: CalenderMode.WEEK,
    };

    state: CalendarState = {
        mode: this.props.mode
    };

    constructor(props: CalendarProps) {
        super(props);
    }

    componentDidUpdate(__: Readonly<CalendarProps>, _: Readonly<CalendarState>) {
        
    }

    renderCalendarDayView() {
        return (<div className={Classname.build("noseur-calendar-day", this.props.attrsRelay.day?.className)} style={this.props.attrsRelay.day?.style} id={this.props.attrsRelay.day?.id}>
            Day
        </div>);
    }

    renderCalendarWeekView() {
        return (<div className={Classname.build("noseur-calendar-week", this.props.attrsRelay.week?.className)} style={this.props.attrsRelay.week?.style} id={this.props.attrsRelay.week?.id}>
            Day
        </div>);
    }

    renderCalendarView() {
        if (this.state.mode === CalenderMode.DAY) {
            return this.renderCalendarDayView();
        }
        return this.renderCalendarWeekView();
    }

    render() {
        let view = this.renderCalendarView();
        const className = Classname.build("noseur-calendar", this.props.className);
        const style: React.CSSProperties = {
            ...(this.props.style ?? {}),
        };
        
        return (<div className={className} style={style} id={this.props.id} key={this.props.key}>
            {view}
        </div>);
    };

}

export const Calendar  = ({ ref, ...props }: Partial<CalendarProps>) => (
    <CalendarComponent {...props} forwardRef={ref} />
);
