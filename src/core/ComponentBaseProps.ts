
import React from "react";
import { Scheme } from "../constants/Scheme";
import { NoseurInputValue, NoseurObject } from "../constants/Types";
import { ObjectHelper } from "../utils/ObjectHelper";

export interface ComponentBaseProps<T> extends MicroComponentBaseProps, React.DOMAttributes<T> {
    selfRef: React.ForwardedRef<T>;
    forwardRef: React.ForwardedRef<T>;
}

export interface MicroComponentBaseProps {
    id: string;
    name: string;
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
