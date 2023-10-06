
import { NoseurObject } from "../constants/Types";
import { TypeChecker } from "./TypeChecker";

export const ObjectHelper = {

    isString(data: any): data is string {
        return typeof data === 'string';
    },

    findDiffKeys(primaryObj: NoseurObject<any>, checkerObj: NoseurObject<any>, exclusions: string[] = []): NoseurObject<any> {
        if (!primaryObj || !checkerObj) {
            return {};
        }

        return Object.keys(primaryObj).filter(key => !checkerObj.hasOwnProperty(key)).reduce((result: NoseurObject<any>, current: string) => {
            if (!exclusions.includes(current)) result[current] = primaryObj[current];
            return result;
        }, {});
    },

    clone(obj: NoseurObject<any>) {
        var clone: NoseurObject<any> = {};

        if (!obj) { return clone; }
        Object.keys(obj).map((key) => clone[key] = obj[key]);
        return clone;
    },

    addAll(target: NoseurObject<any>, source?: NoseurObject<any>) {
        if (source) Object.keys(source).map((key) => target[key] = source[key]);
        return target;
    },

    conditionalClone(obj: NoseurObject<any>, conditionCallback: (key: string) => boolean) {
        var clone: NoseurObject<any> = {};

        if (!obj) { return clone; }
        Object.keys(obj).map((key) => {
            if (conditionCallback(key) === true) {
                clone[key] = obj[key];
            }
        });
        return clone;
    },

    extractEventProps(obj: NoseurObject<any>, excludes: string[] = []): NoseurObject<any> {
        return this.conditionalClone(obj, (key) => excludes.indexOf(key) === -1
            && key.startsWith("on")
            && key[2] != undefined
            && key[2] == key[2].toUpperCase());
    },

    resolveStringTemplate(unprocessed: string, valueMap: NoseurObject<any>): string {
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
    },

    resolveSelfRef(component: React.Component<any, any>, funsies: NoseurObject<any>) {
        const selfRef = component.props.selfRef;

        if (!selfRef) return;
        if (selfRef instanceof Function) {
            selfRef(funsies);
        } else {
            selfRef.current = funsies;
        }
    },

    expandStringTemplate(unprocessed: string, valueMap: NoseurObject<any>) {
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

    joinValues(...values: any[]) {
        if (!values.length) return;
        if (TypeChecker.isObject(values[0])) {
            return values.reduce((acc: any, value: any) => {
                if (value) Object.keys(value).forEach((key: string) => acc[key] = value[key]);
                return acc;
            }, {});
        }
        if (TypeChecker.isArray(values[0])) {
            return values.reduce((acc: any, value: any) => {
                if (!value) return acc;
                return acc.concat(value);
            }, []);
        }
        if (TypeChecker.isString(values[0]) || TypeChecker.isNumber(values[0])) {
            return values.reduce((acc: any, value: any) => {
                if (!value) return acc;
                return acc + value;
            }, "");
        }
        return values;
    }

}