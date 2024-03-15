
import { NoseurObject } from "../constants/Types";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
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

    clone<T>(obj: any[] | NoseurObject<any> | T): T {
        return (TypeChecker.isDict(obj as any) ? ObjectHelper.cloneObject(obj as any) : ObjectHelper.cloneArray(obj as any[])) as T;
    },

    cloneArray(obj: any[]) {
        var clone: any[] = [];

        if (!obj) { return clone; }
        for (const value of obj) {
            clone.push(TypeChecker.isArray(value) ? ObjectHelper.clone(value) : value);
        }
        return clone;
    },

    cloneObject(obj: NoseurObject<any>) {
        var clone: NoseurObject<any> = {};

        if (!obj) { return clone; }
        Object.keys(obj).map((key) => {
            let value = obj[key];
            clone[key] = TypeChecker.isArray(value) ? ObjectHelper.clone(value) : value;
        });
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
        let templateValue = "";
        let openedTemplate = false;
        for (let index = 0; index < unprocessed.length; index++) {
            const ch = unprocessed[index];
            if (ch == '{') {
                openedTemplate = true;
                continue;
            }
            if (ch == '}') {
                value += valueMap[templateValue] || "";
                openedTemplate = false;
                templateValue = "";
                continue;
            };
            if (openedTemplate) {
                templateValue += ch;
            } else {
                value += ch;
            }
        }
        return value;
    },

    toTitleCase(value: string): string {
        return (value && (value[0].toUpperCase() + value.substr(1).toLowerCase()));
    },

    resolveManageRef<T1, T2>(component: React.Component<ComponentBaseProps<T1, T2>, any>, funsies: T2) {
        const manageRef = component.props.manageRef;

        if (!manageRef) return;
        if (manageRef instanceof Function) {
            manageRef(funsies);
        } else {
            manageRef.current = funsies;
        }
    },

    resolveRef<T>(ref: React.ForwardedRef<T>, value: T, always: boolean = false) {
        if ((!value && !always) || !ref) return;

        if (ref instanceof Function) {
            ref(value);
        } else {
            ref.current = value;
        }
    },

    expandStringTemplate(unprocessed: string, valueMap: NoseurObject<any>, options: {
        chop?: string;
        prefix?: string;
        suffix?: string;
        seperator?: string;
        relativeExpansion?: boolean;
    } = {

        }) {
        let value = "";
        let templateValue = "";
        let openedTemplate = false;
        let subValueMap = valueMap;
        const chop = options.chop ?? '';
        const prefix = options.prefix ?? '{';
        const suffix = options.suffix ?? '}';
        const seperator = options.seperator || '.';
        for (let index = 0; index < unprocessed.length; index++) {
            const ch = unprocessed[index];
            if (ch === (options.chop) && unprocessed[index + 1] === prefix) {
                continue;
            }
            if (ch === prefix) {
                openedTemplate = true;
                continue;
            }
            if (openedTemplate && ch === seperator) {
                if (!(templateValue in subValueMap)) {
                    value += `${chop}${prefix}${templateValue}${seperator}`;
                    openedTemplate = false;
                    continue;
                }
                subValueMap = subValueMap[templateValue];
                templateValue = "";
                continue;
            }
            if (openedTemplate && ch === suffix) {
                value += subValueMap[templateValue]
                    || (options.relativeExpansion ? `${chop}${prefix}${templateValue}${suffix}` : "");
                subValueMap = valueMap;
                openedTemplate = false;
                templateValue = "";
                continue;
            };
            if (openedTemplate) {
                templateValue += ch;
            } else {
                value += ch;
            }
        }
        if (openedTemplate) {
            value += `${chop}${prefix}${templateValue}`;
        } else {
            value += templateValue;
        }
        return value;
    },

    objectGetWithStringTemplate(valueMap: NoseurObject<any>, template: string, options: {
        prefix?: string;
        suffix?: string;
        optional?: string;
        seperator?: string;
    } = {}) {
        let expandedString = "";
        let templateValue = "";
        let openedTemplate = false;
        let subValueMap = valueMap;
        let parsingAltValue = false;
        const prefix = options.prefix ?? '{';
        const suffix = options.suffix ?? '}';
        const optional = options.optional ?? '?';
        const seperator = options.seperator ?? '.';
        const templateLength = template.length;
        if (template.indexOf(prefix) < 0) return subValueMap[template] ?? "";
        for (let index = 0; index < templateLength; index++) {
            const ch = template[index];
            if (!parsingAltValue && ch == prefix) {
                openedTemplate = true;
                continue;
            }
            if (openedTemplate && ch == seperator) {
                let altValue = templateValue.endsWith(optional) ? {} : undefined;
                const splitted = templateValue.split(optional);
                templateValue = splitted[0];
                try { altValue = JSON.parse(splitted[1]); } catch (_) { }
                subValueMap = subValueMap[templateValue] ?? altValue;
                templateValue = "";
                continue;
            }
            if (ch == suffix) {
                if (parsingAltValue && templateValue[templateValue.length - 1] !== optional) {
                    parsingAltValue = false;
                    templateValue += suffix;
                    continue;
                }
                openedTemplate = false;
                parsingAltValue = false;
                let altValue = templateValue.endsWith(optional) ? "" : undefined;
                const splitted = templateValue.split(optional);
                templateValue = splitted[0];
                if (splitted.length > 1) altValue = splitted[1];
                expandedString += subValueMap[templateValue] ?? altValue;
                subValueMap = valueMap;
                templateValue = "";
                continue;
            };
            if (openedTemplate) {
                templateValue += ch;
                if (ch === optional && ((index + 1) < templateLength) && template[index + 1] === prefix) parsingAltValue = true;
            } else {
                expandedString += ch;
            }
        }
        return expandedString;
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
    },

    fileListToFileArray(fileList: FileList | null) {
        const files: File[] = [];
        if (!fileList) return files;
        for (let index = 0; index < fileList.length; index++) {
            files.push(fileList.item(index)!);
        }
        return files;
    },

    // https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
    humanFileSize(bytes: number, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


        return bytes.toFixed(dp) + ' ' + units[u];
    },

    merge<T>(...obj: any[][] | NoseurObject<any>[] | T[]): any {
        if (!obj.length) return {};
        const isObject = TypeChecker.isDict((obj as any)[0]);
        let result: any = ObjectHelper.clone(obj[0]);
        for (let index = 1; index < obj.length; index++) {
            const entry = ObjectHelper.clone(obj[index] as any);
            if (isObject) {
                Object.keys(entry).map((key) => {
                    result[key] = entry[key];
                });
                continue;
            }
            (result as any[]).concat(entry);
        }
        return result;
    },

}