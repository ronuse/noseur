
import { TypeChecker } from "./TypeChecker";
import { ObjectHelper } from "./ObjectHelper";

export class Debugger {

    private static _NAMESPACE = "NOSEUR.DEBUGGER";
    private static _SECURE_FIELD_PLACEHOLDER = "<REDACTED>";
    private static _ENABLED_DEBUGGING = (sessionStorage.getItem("NOSEUR.DEBUGGER.ENABLE") ?? localStorage.getItem("NOSEUR.DEBUGGER.ENABLE")) === "true";
    private static _SECURE_FIELDS = [
        "access_token",
        "session_token",
    ];

    static setNamespace = (namespace: string) => Debugger._NAMESPACE = namespace;
    static registerSecureFields = (fields: string[]) => fields.forEach((field) => Debugger._SECURE_FIELDS.push(field));
    static log = (...args: any) => Debugger._ENABLED_DEBUGGING && console.log(Debugger._NAMESPACE, ...Debugger.sanitize(...args));
    static warn = (...args: any) => Debugger._ENABLED_DEBUGGING && console.warn(Debugger._NAMESPACE, ...Debugger.sanitize(...args));
    static error = (...args: any) => Debugger._ENABLED_DEBUGGING && console.error(Debugger._NAMESPACE, ...Debugger.sanitize(...args));

    private static sanitize = (...args: any) => {
        for (let index = 0; index < args.length; index++) {
            if (!TypeChecker.isArray(args[index]) && TypeChecker.isObject(args[index])) {
                args[index] = ObjectHelper.cloneObject(args[index]);
                Object.keys(args[index]).forEach((key) => {
                    if (Debugger._SECURE_FIELDS.includes(key)) {
                        args[index][key] = Debugger._SECURE_FIELD_PLACEHOLDER;
                        return;
                    }
                });
            }
        }
        return args;
    };

}
