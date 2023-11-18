
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

    clone(obj: any[] | NoseurObject<any>): any {
        return (TypeChecker.isDict(obj) ? ObjectHelper.cloneObject(obj) : ObjectHelper.cloneArray(obj as any[]));
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

    resolveManageRef<T1, T2>(component: React.Component<ComponentBaseProps<T1, T2>, any>, funsies: T2) {
        const manageRef = component.props.manageRef;

        if (!manageRef) return;
        if (manageRef instanceof Function) {
            manageRef(funsies);
        } else {
            manageRef.current = funsies;
        }
    },

    resolveRef<T>(ref: React.ForwardedRef<T>, value: T) {
        if (!value || !ref) return;

        if (ref instanceof Function) {
            ref(value);
        } else {
            ref.current = value;
        }
    },

    expandStringTemplate(unprocessed: string, valueMap: NoseurObject<any>) {
        let value = "";
        let teamplateValue = "";
        let openedTemplate = false;
        let subValueMap = valueMap;
        for (let index = 0; index < unprocessed.length; index++) {
            const ch = unprocessed[index];
            if (ch == '{') {
                openedTemplate = true;
                continue;
            }
            if (openedTemplate && ch == ".") {
                subValueMap = subValueMap[teamplateValue];
                teamplateValue = "";
                continue;
            }
            if (ch == '}') {
                value += subValueMap[teamplateValue] || "";
                subValueMap = valueMap;
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

    objectGetWithStringTemplate(valueMap: NoseurObject<any>, template: string) {
        let teamplateValue = "";
        let openedTemplate = false;
        let subValueMap = valueMap;
        for (let index = 0; index < template.length; index++) {
            const ch = template[index];
            if (ch == '{') {
                openedTemplate = true;
                continue;
            }
            if (openedTemplate && ch == ".") {
                subValueMap = subValueMap[teamplateValue];
                teamplateValue = "";
                continue;
            }
            if (ch == '}') {
                return subValueMap[teamplateValue];
            };
            if (openedTemplate) {
                teamplateValue += ch;
            }
        }
        return valueMap[template] || template
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

}