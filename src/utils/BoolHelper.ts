
import { TypeChecker } from "./TypeChecker";

export const BoolHelper = {

    bothEquals(var1: any, var2: any) {
		return (var1 === var2);
	},

	equalsAny(obj: any, compares: string[]) {
		for (var compare of compares) {
			if (BoolHelper.bothEquals(obj, compare)) {
				return true;
			}
		}
		return false;
	},

	equalsAll(obj: any, compares: string[]) {
		for (var compare of compares) {
			if (!BoolHelper.bothEquals(obj, compare)) {
				return false;
			}
		}
		return true;
	},

	equalsNone(obj: any, compares: string[]) {
		for (var compare of compares) {
			if (BoolHelper.bothEquals(obj, compare)) {
				return false;
			}
		}
		return true;
	},

	allEquals(comparator: (o: any) => boolean, ...values: any[]) {
		for (const value of values) {
			if (!comparator(value)) return false;
		}
		return true;
	},

	anyEquals(comparator: (o: any) => boolean, ...values: any[]) {
		for (const value of values) {
			if (comparator(value)) return true;
		}
		return false;
	},

	notAllEquals(comparator: (o: any) => boolean, ...values: any[]) {
		let anyAlreadEqual = false;
		for (const value of values) {
			if (comparator(value)) {
				anyAlreadEqual = true;
			} else {
				if (anyAlreadEqual) return true;
			}
		}
		return anyAlreadEqual;
	},

    deepEqual(value1: any, value2: any, keys: any[] | undefined = undefined, recurse = false, processedKeys: any[] = []) {
        if (BoolHelper.allEquals(TypeChecker.isDict, value1, value2) && BoolHelper.objectDeepEquals(value1, value2, keys, recurse, processedKeys)) return true;
        if (BoolHelper.allEquals(TypeChecker.isArray, value1, value2) && BoolHelper.arrayDeepEquals(value1, value2, keys, recurse, processedKeys)) return true;
        return value1 === value2;
    },

    arrayDeepEquals(arr1: any[], arr2: any[], keys: any[] | undefined = undefined, recurse = false, processedKeys: any[] = []): boolean {
        if (!(arr1 && arr2)) return false;
        if (arr1.length != arr2.length) return false;
        
        for (let index = 0; index < arr1.length; index++) {
            const arr1Value: any = arr1[index];
            const arr2Value: any = arr2[index];
            if (BoolHelper.deepEqual(arr1Value, arr2Value, keys, recurse, processedKeys)) return false;
        }
        return true;
    },

    objectDeepEquals(obj1: any, obj2: any, keys: any[] | undefined = undefined, recurse = true, processedKeys: any[] = []): boolean {
        if (!(obj1 && obj2 && TypeChecker.isObject(obj1) && TypeChecker.isObject(obj2))) return false;
        const obj1Keys = Object.keys(obj1);
        const obj2Keys = Object.keys(obj2);
        const iterKeys = obj1Keys.length > obj2Keys.length ? obj1Keys : obj2Keys;
        
        for (const key of iterKeys) {
            if (key in processedKeys) continue;
            if (keys && !keys.includes(key)) continue;
            if (!((obj1Keys.includes(key)) && (obj2Keys.includes(key)))) return false;
            const obj1KeyValue: any = obj1[key];
            const obj2KeyValue: any = obj2[key];
            processedKeys.push(key);
            if (!BoolHelper.deepEqual(obj1KeyValue, obj2KeyValue, keys, recurse, processedKeys)) return false;
        }
        return true;
    },

}
