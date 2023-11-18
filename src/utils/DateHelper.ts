
import { BoolHelper } from "./BoolHelper";
import { NoseurObject } from "../constants/Types";

export interface Time {
    ms: number;
    hours: number;
    minutes: number;
    seconds: number;
    timezone: string;
    meridian: "AM" | "PM";
    timezoneOffset: number;
}

export enum Weekday {
    SUNDAY = "SUNDAY",
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
}

export enum Month {
    JANUARY,
    FEBRUARY,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULY,
    AUGUST,
    SEPTEMBER,
    OCTOBER,
    NOVEMBER,
    DECEMBER,
}

export interface FormatedDate {
    date: Date;
    day: number;
    year: number;
    month: number;
    hours: number;
    minutes: number;
    seconds: number;
    weekDay: string;
    longYear: string;
    monthName: string;
    formatted: string;
    disabled: boolean;
    meridian: "AM" | "PM";
    hourFormat: "12" | "24";
    isNotInMonth: boolean;
}

export const DateHelper = {

    clone(_date: Date) {
        return new Date(_date.getTime());
    },

    addYears(_date: Date, value: number) {
        const date = new Date(_date.getTime());
        date.setFullYear(date.getFullYear() + value);
        return date;
    },

    addMonths(_date: Date, value: number) {
        const date = new Date(_date.getTime());
        date.setMonth(date.getMonth() + value);
        return date;
    },

    addDays(_date: Date, value: number) {
        const date = new Date(_date.getTime());
        date.setDate(date.getDate() + value);
        return date;
    },

    addHours(_date: Date, value: number) {
        const date = new Date(_date.getTime());
        date.setHours(date.getHours() + value);
        return date;
    },

    addMinutes(_date: Date, value: number) {
        const date = new Date(_date.getTime());
        date.setMinutes(date.getMinutes() + value);
        return date;
    },

    addSeconds(_date: Date, value: number) {
        const date = new Date(_date.getTime());
        date.setSeconds(date.getSeconds() + value);
        return date;
    },

    addTime(_date: Date, hours: number, minutes: number, seconds: number, ms: number = 0) {
        const date = new Date(_date.getTime());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds, ms);
    },

    withEndOfDayTime(_date: Date) {
        const date = new Date(_date.getTime());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 58, 59);
    },

    withTime(_date: Date) {
        const now = new Date();
        const date = new Date(_date.getTime());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    },

    withoutTime(_date: Date) {
        const date = new Date(_date.getTime());
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

    daysInMonth(yearOrDate: number | Date, month: number = 0): number {
        if (typeof yearOrDate === "number") {
            return new Date(yearOrDate, month + 1, 0).getDate();
        }
        return new Date(yearOrDate.getFullYear(), yearOrDate.getMonth() + 1, 0).getDate();
    },

    isInArrayOfDates(array: Date[], value: Date, withoutTime: boolean = true) {
        let rightOperand = withoutTime ? DateHelper.withoutTime(value) : value;
        return !!array.find(item => {
            let leftOperand = withoutTime ? DateHelper.withoutTime(item) : item;
            return leftOperand.getTime() == rightOperand.getTime();
        });
    },

    areInArrayOfDates(array: (Date | undefined)[], values: Date[], withoutTime: boolean = true) {
        let presentCount = 0;
        let rightOperands = withoutTime ? values.map(value => DateHelper.withoutTime(value)) : values;
        array.forEach(item => {
            if (!item) return;
            let leftOperand = withoutTime ? DateHelper.withoutTime(item) : item;
            for (const rightOperand  of rightOperands) {
                if (leftOperand.getTime() === rightOperand.getTime()) presentCount++;
            }
        });
        return presentCount >= values.length;
    },

    anyInArrayOfDates(array: Date[], values: Date[], withoutTime: boolean = true) {
        let rightOperands = withoutTime ? values.map(value => DateHelper.withoutTime(value)) : values;
        return !!array.find(item => {
            let leftOperand = withoutTime ? DateHelper.withoutTime(item) : item;
            return DateHelper.isInArrayOfDates(rightOperands, leftOperand);
        });
    },

    getTime(date: Date): Time {
        return {
            hours: date.getHours(),
            ms: date.getMilliseconds(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            timezoneOffset: date.getTimezoneOffset(),
            meridian: date.getHours() >= 12 ? "PM" : "AM",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    },

    formatDateToObject(originalDate: Date, formatMap: NoseurObject<Intl.DateTimeFormatOptions>, locale: string = "default", hourFormat: "12" | "24" = "24", comparisonDate: Date = new Date()): FormatedDate {
        const formattedDate: NoseurObject<any> = {};
        const date = new Date(originalDate.valueOf());
        let hours = date.getHours();
        const meridian = hours >= 12 ? 'PM' : 'AM';
        if (hourFormat === "12" && hours >= 12) {
            hours = hours % 12;
            hours = hours ? hours : 12;
        }
        formattedDate["date"] = date;
        formattedDate["meridian"] = meridian;
        formattedDate["day"] = date.getDate();
        formattedDate["hourFormat"] = hourFormat;
        formattedDate["month"] = date.getMonth();
        formattedDate["year"] = date.getFullYear();
        formattedDate["hours"] = ('' + hours).padStart(2, '0');
        formattedDate["minutes"] = ('' + date.getMinutes()).padStart(2, '0');
        formattedDate["seconds"] = ('' + date.getSeconds()).padStart(2, '0');
        formattedDate["isNotInMonth"] = !(date.getMonth() === comparisonDate.getMonth() && date.getFullYear() === comparisonDate.getFullYear());
        Object.keys(formatMap).forEach(key => {
            formattedDate[key] = date.toLocaleString(locale, formatMap[key]);
        });
        formattedDate
        return formattedDate as FormatedDate;
    },

    isToday(date: Date) {
        let todaysDate = new Date();
        return todaysDate.getDate() === date.getDate() && todaysDate.getMonth() === date.getMonth() && todaysDate.getFullYear() === date.getFullYear();
    },

    isNow(date: Date) {
        return new Date().getTime() === date.getTime();
    },

    dateEquals(dates: Date[]) {
        return !dates.length || BoolHelper.allEquals((o) => o.getTime() === dates[0].getTime(), ...dates);
    },

    dateIsInRange(_fromDate: Date, _toDate: Date, date: Date) {
        let fromDate: Date = new Date(_fromDate.getTime()), toDate: Date = new Date(_toDate.getTime());
        if (_fromDate > _toDate) {
            toDate = new Date(_fromDate.getTime());
            fromDate = new Date(_toDate.getTime());
        }
        return date > fromDate && date < toDate;
    },

    translateWeekday(weekday: string, locale: string = "en", option: Intl.DateTimeFormatOptions = { weekday: 'short' }) {
        const weekdayIndex = Object.keys(Weekday).indexOf(weekday);
        if (weekdayIndex < 0) throw new Error(`Unknown weekday "${weekday}"`);
        return new Date(2001, 0, weekdayIndex).toLocaleDateString(locale, option);
    },

    getAllDaysInMonth(year: number, month: number, count?: number, reverse?: boolean) {
        const daysInMonth = DateHelper.daysInMonth(year, month);
        const negator = reverse ? -daysInMonth : 1;
        const days = Array.from({ length: count ? count : daysInMonth }, (_, i) => new Date(year, month, Math.abs(i + negator)));
        return reverse ? days.reverse() : days;
    }

}