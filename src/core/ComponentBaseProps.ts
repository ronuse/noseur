
import React from "react";
import { Scheme } from "../constants/Scheme";
import { ObjectHelper } from "../utils/ObjectHelper";
import { NoseurInputValue, NoseurObject } from "../constants/Types";
import { Classname } from "../utils/Classname";

export interface ComponentElementBasicAttributes {
    scheme?: Scheme;
    className?: string;
    style?: React.CSSProperties | undefined;
}

export interface ComponentBaseProps<T1, T2 = {}, T3 = {}> extends MicroComponentBaseProps<T3>, React.DOMAttributes<T1> {
    manageRef: React.ForwardedRef<T2>;
    forwardRef: React.ForwardedRef<T1>;
}

export interface MicroComponentBaseProps<T1 = {}> {
    id: string;
    name: string;
    attrsRelay: T1;
    scheme: Scheme;
    noStyle: boolean;
    className: string;
    disabled: boolean;
    key: NoseurInputValue;
    style: React.CSSProperties | undefined;
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
