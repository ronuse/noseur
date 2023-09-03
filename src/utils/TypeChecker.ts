import { BoolHelper } from "./BoolHelper";

export const TypeChecker = {

    isString(data: any): data is string {
        return typeof data === 'string';
    },

    isTypeOfAny(obj: any, compares: string[]) {
		return BoolHelper.equalsAny(typeof obj, compares)
	}

}