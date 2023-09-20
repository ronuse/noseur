import { TypeChecker } from "./TypeChecker";

type Mapping = { [key: string]: any };
type Value = string | undefined | null;
type Argument = Value | Mapping | Argument[];

export const Classname = {

    build(...args: Argument[]): string {
        const classNames = args.reduce((acc: string[], arg: Argument): string[] => {
            if (!arg) return acc;
            if (TypeChecker.isString(arg) && arg != "undefined") {
                acc.push(arg.trim());
                return acc;
            }
            const argObject = arg as Mapping;
            for (const key of Object.keys(arg)) {
                if (argObject[key]) acc.push(key);
            }
            return acc;
        }, []);
        return classNames.join(" ");
    }

}
