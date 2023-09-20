
import React from "react";
import { BoolHelper } from "./BoolHelper";

export const TypeChecker = {

    isString(data: any): data is string {
        return typeof data === 'string';
    },

    isTypeOfAny(obj: any, compares: string[]) {
		return BoolHelper.equalsAny(typeof obj, compares)
	},
    
    isFunction(obj: any) {
        if (!obj) return false;
		return (obj instanceof Function) || !!(obj && obj.constructor && obj.call && obj.apply);
	},
    
    isReactElement(obj: any) {
        if (!obj) return false;
		return React.isValidElement(obj);
	},

    isDict(obj: any) {
        return obj && typeof obj ==='object' && obj!==null && !(obj instanceof Array) && !(obj instanceof Date);
    },

    isObject(obj: any) {
        return obj && typeof obj ==='object';
    },

    isArray(obj: any) {
        return obj && Array.isArray(obj);
    },

    isNumber(obj: any) {
        return obj && ((obj != null) && (obj !== '') && !isNaN(Number(obj.toString())));
    },

    isBoolean(obj: any) {
        return TypeChecker.isTypeOfAny(obj, ["boolean"]);
    },

    isNativeEqualrableType(obj: any) {
        return TypeChecker.isTypeOfAny(obj, ["string", "boolean"]) || TypeChecker.isNumber(obj) || TypeChecker.isFunction(obj);
    },

}