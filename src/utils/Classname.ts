import { TypeChecker } from "./TypeChecker";

type Mapping = { [key: string]: any };
type Value = string | undefined | null;
type Argument = Value | Mapping | Argument[];

export const Classname = {

    build(...args: Argument[]): string {
        const classNames = args.reduce((acc: Set<string>, arg: Argument): Set<string> => {
            if (!arg) return acc;
            if (TypeChecker.isString(arg) && arg != "undefined") {
                acc.add(arg.trim());
                return acc;
            }
            const argObject = arg as Mapping;
            for (const key of Object.keys(arg)) {
                if (argObject[key]) acc.add(key);
            }
            return acc;
        }, new Set<string>());
        return Array.from(classNames.values()).join(" ");
    }

}
