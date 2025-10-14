
import React from "react";
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { NoseurObject } from "../constants/Types";
import { Transition } from "../constants/Transition";
import { ObjectHelper } from "../utils/ObjectHelper";

export interface ComponentElementBasicAttributes {
    id?: string;
    scheme?: Scheme;
    className?: string;
    style?: React.CSSProperties | undefined;
}

export interface ComponentBaseProps<T1, T2 = {}, T3 = {}> extends MicroComponentBaseProps<T3>, React.DOMAttributes<T1> {
    ref?: React.Ref<T1>;
    manageRef: React.ForwardedRef<T2>;
    forwardRef: React.ForwardedRef<T1>;
}

export interface MicroComponentBaseProps<T1 = {}> {
    key: any;
    id: string;
    name: string;
    attrsRelay: T1;
    scheme: Scheme;
    noStyle: boolean;
    className: string;
    disabled: boolean;
    draggable: boolean;
    style: React.CSSProperties | undefined;
}

export interface LoadingProps<T> {
    loadingProps: Partial<T>;
}

export interface TransitionProps {
    transition: Transition;
    transitionOptions: NoseurObject<any>;
    transitionTimeout: NoseurObject<any> | number;
}

export enum ComponentRenderType {
    MODAL,
    INLINE,
    POPOVER,
}

const MicroComponentBasePropskeys = ["id", "name", "style", "scheme", "noStyle", "className", "disabled", "key"];

export function extractMicroComponentBaseProps(props: NoseurObject<any>): MicroComponentBaseProps {
    return ObjectHelper.conditionalClone(props, (key: string) => MicroComponentBasePropskeys.includes(key)) as MicroComponentBaseProps;
}

export function extractComponentElementBasicAttributes(attrs: ComponentElementBasicAttributes, includes: any[], excludes?: any[]) {
    return ObjectHelper.conditionalClone(attrs, (key: string) => (!includes.length || includes.includes(key)) && !excludes?.includes(key)) as MicroComponentBaseProps;
}

export function addClassesToComponentElementBasicAttributes(attrs?: ComponentElementBasicAttributes, className?: string) {
    if (!attrs) return;
    attrs.className = Classname.build(attrs.className, className);
    return attrs;
}


//* GLOBALS *//

export class NoseurGlobals {

    private static __noseurGlobals: NoseurObject<any> = {};
    public static KEYS = {
        LAF: {
            THEME: "NOSEUR.LAF.THEME"
        },
    };

    static put = (key: string, value: any) => NoseurGlobals.__noseurGlobals[key] = value;
    static get = (key: string, fallback?: any) => NoseurGlobals.__noseurGlobals[key] ?? fallback;

}

//* END GLOBALS *//