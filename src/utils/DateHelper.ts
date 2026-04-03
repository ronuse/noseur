
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

    WEEKDAYS_MAP: Object.values(Weekday).reduce((acc, weekday, index) => {
        acc[weekday] = index;
        return acc;
    }, {} as { [key: string]: number; }),

    now() {
        return new Date();
    },

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

    withTime(_date: Date, _timeDate?: Date) {
        const date = new Date(_date.getTime());
        const timeDate = _timeDate ?? new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeDate.getHours(), timeDate.getMinutes(), timeDate.getSeconds(), timeDate.getMilliseconds());
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
            for (const rightOperand of rightOperands) {
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

    isPast(date: Date) {
        return (new Date()).getTime() > date.getTime();
    },

    isFuture(date: Date) {
        return !DateHelper.isPast(date);
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
    },

    getMilliSecondsBetweenDates(date1: Date, date2: Date) {
        return Math.abs(date2.getTime() - date1.getTime());
    },

    getSecondsBetweenDates(date1: Date, date2: Date) {
        return DateHelper.getMilliSecondsBetweenDates(date1, date2);
    },

    getMinutesBetweenDates(date1: Date, date2: Date) {
        return Math.round(DateHelper.getMilliSecondsBetweenDates(date1, date2) / (1000 * 60));
    },

    getHoursBetweenDates(date1: Date, date2: Date) {
        return Math.round(DateHelper.getMilliSecondsBetweenDates(date1, date2) / (1000 * 60 * 60));
    },

    getDaysBetweenDates(date1: Date, date2: Date) {
        return Math.round(DateHelper.getMilliSecondsBetweenDates(date1, date2) / (1000 * 60 * 60 * 24));
    },

    getWeeksBetweenDates(date1: Date, date2: Date) {
        return Math.round(DateHelper.getMilliSecondsBetweenDates(date1, date2) / (1000 * 60 * 60 * 24 * 7));
    },

    getMonthsBetweenDates(date1: Date, date2: Date) {
        const diffYears = date2.getFullYear() - date1.getFullYear();
        return Math.abs((diffYears * 12) + (date2.getMonth() - date1.getMonth()));
    },

    getYearsBetweenDates(date1: Date, date2: Date) {
        return date2.getFullYear() - date1.getFullYear();
    },

    getStartOfDay(date: Date = new Date()) {
        const newDate = DateHelper.clone(date);
        newDate.setUTCHours(0, 0, 0, 0);
        return newDate;
    },

    getEndOfDay(date: Date = new Date()) {
        const newDate = DateHelper.clone(date);
        newDate.setUTCHours(23, 59, 59, 999);
        return newDate;
    },

    getFirstDayInMonth(date: Date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    getLastDayInMonth(date: Date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },

    getStartOfMonth(date: Date = new Date()) {
        return DateHelper.getFirstDayInMonth(date);
    },

    getEndOfMonth(date: Date = new Date()) {
        return DateHelper.getLastDayInMonth(date);
    },

    getFirstDayInYear(date: Date = new Date()) {
        return new Date(date.getFullYear(), 0, 1);
    },

    getLastDayInYear(date: Date = new Date()) {
        return new Date(date.getFullYear(), 11, 31);
    },

    getStartOfYear(date: Date = new Date()) {
        return DateHelper.getFirstDayInYear(date);
    },

    getEndOfYear(date: Date = new Date()) {
        return DateHelper.getLastDayInYear(date);
    },

    getTomorrow(date: Date = new Date()) {
        const tomorrowMidnight = DateHelper.clone(date);
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
        tomorrowMidnight.setHours(0, 0, 0, 0);
        return tomorrowMidnight;
    },

    formatDuration(startDate: Date, endDate: Date, config: { showMaxIntervalOnly?: boolean; separator?: string; language?: { days: string; hrs: string; mins: string; sec: string; }; } = {}): string {
        if (!config.language) config.language = {
            sec: "sec",
            hrs: "hrs",
            mins: "mins",
            days: "days",
        };
        let diffInSeconds = Math.abs(Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
        if (diffInSeconds === 0) return "0sec";

        const days = Math.floor(diffInSeconds / 86400);
        diffInSeconds %= 86400;

        const hours = Math.floor(diffInSeconds / 3600);
        diffInSeconds %= 3600;

        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;

        const parts: string[] = [];

        if (days > 0) parts.push(`${days}${config.language.days}`);
        if ((parts.length === 0 || !config.showMaxIntervalOnly) && hours > 0) parts.push(`${hours}${config.language.hrs}`);
        if ((parts.length === 0 || !config.showMaxIntervalOnly) && minutes > 0) parts.push(`${minutes}${config.language.mins}`);
        if ((parts.length === 0 || !config.showMaxIntervalOnly) && seconds > 0) parts.push(`${seconds}${config.language.sec}`);

        return parts.join(config.separator ?? " ");
    },

    getNextWeekDay(weekDay: Weekday, date: Date = new Date()) {
        const targetDayIndex = DateHelper.WEEKDAYS_MAP[weekDay];
        const resultDate = DateHelper.clone(date);
        const currentDayIndex = resultDate.getDay();
        let dayDiff = targetDayIndex - currentDayIndex;
        if (dayDiff <= 0) {
            dayDiff += 7;
        }
        resultDate.setDate(resultDate.getDate() + dayDiff);
        return resultDate;
    },

    getLastWeekdayOfMonth(weekDay: Weekday, date: Date = new Date()) {
        const targetDayIndex = DateHelper.WEEKDAYS_MAP[weekDay];
        const resultDate = DateHelper.clone(date);
        const currentDayIndex = resultDate.getDay();
        let dayDiff = targetDayIndex - currentDayIndex;
        if (dayDiff <= 0) {
            dayDiff += 7;
        }
        resultDate.setDate(resultDate.getDate() + dayDiff);
        return resultDate;
    },

    getNextTwoWeekDayFrom(fromDate: Date, weekDay: Weekday, date: Date = new Date()) {
        const targetDayIndex = DateHelper.WEEKDAYS_MAP[weekDay];
        let anchorDate = DateHelper.clone(fromDate);
        let startDayIndex = anchorDate.getDay();
        let daysToFirstTarget = (targetDayIndex - startDayIndex + 7) % 7;
        anchorDate.setDate(anchorDate.getDate() + daysToFirstTarget);
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysSinceAnchor = ((date as any) - (anchorDate as any)) / msPerDay;
        let intervalsPassed = 0;
        if (daysSinceAnchor > 0) {
            intervalsPassed = Math.ceil(daysSinceAnchor / 14);
        }
        const resultDate = new Date(anchorDate);
        resultDate.setDate(anchorDate.getDate() + (intervalsPassed * 14));
        return resultDate;
    },

    getNextQuarterStart(date: Date = new Date()) {
        const result = DateHelper.clone(date);
        const currentMonth = result.getMonth();
        const nextQuarterMonth = (Math.floor(currentMonth / 3) + 1) * 3;
        result.setMonth(nextQuarterMonth, 1);
        result.setHours(0, 0, 0, 0);
        return result;
    },

    getNextQuarterEnd(date: Date = new Date()) {
        const result = DateHelper.clone(date);
        const currentMonth = result.getMonth();
        const nextQuarterStartMonth = (Math.floor(currentMonth / 3) + 1) * 3;
        result.setMonth(nextQuarterStartMonth + 3, 0);
        result.setHours(23, 59, 59, 999);
        return result;
    },

}