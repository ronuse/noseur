import { NoseurObject } from "../constants/Types";

export const ObjectHelper = {

    isString(data: any): data is string {
        return typeof data === 'string';
    },

    findDiffKeys(primaryObj: NoseurObject, checkerObj: NoseurObject, exclusions: string[] = []): NoseurObject {
        if (!primaryObj || !checkerObj) {
            return {};
        }

        return Object.keys(primaryObj).filter(key => !checkerObj.hasOwnProperty(key)).reduce((result: NoseurObject, current: string) => {
            if (!exclusions.includes(current)) result[current] = primaryObj[current];
            return result;
        }, {});
    },

    clone(obj: NoseurObject) {
        var clone: NoseurObject = {};

        if (!obj) { return clone; }
        Object.keys(obj).map((key) => clone[key] = obj[key]);
        return clone;
    },

    addAll(target: NoseurObject, source?: NoseurObject) {
        if (source) Object.keys(source).map((key) => target[key] = source[key]);
        return target;
    },

    conditionalClone(obj: NoseurObject, conditionCallback: (key: string) => boolean) {
        var clone: NoseurObject = {};

        if (!obj) { return clone; }
        Object.keys(obj).map((key) => {
            if (conditionCallback(key) === true) {
                clone[key] = obj[key];
            }
        });
        return clone;
    },

    extractEventProps(obj: NoseurObject, excludes: string[] = []): NoseurObject {
        return this.conditionalClone(obj, (key) => excludes.indexOf(key) === -1
            && key.startsWith("on")
            && key[2] != undefined
            && key[2] == key[2].toUpperCase());
    },

    resolveStringTemplate(unprocessed: string, valueMap: NoseurObject): string {
		let value = "";
		let teamplateValue = "";
		let openedTemplate = false;
		for (let index = 0; index < unprocessed.length; index++) {
			const ch = unprocessed[index];
			if (ch == '{') {
				openedTemplate = true;
				continue;
			}
			if (ch == '}') {
				value += valueMap[teamplateValue] || "";
				openedTemplate = false;
				teamplateValue = "";
				continue;
			};
			if (openedTemplate) {
				teamplateValue += ch;
			} else {
				value += ch;
			}
		}
	  return value;
	},

    toTitleCase(value: string): string {
        return (value && (value[0].toUpperCase() + value.substr(1).toLowerCase()));
    }

}