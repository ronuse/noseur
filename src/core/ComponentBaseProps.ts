import React from "react";
import { Scheme } from "../constants/Scheme";
import { NoseurInputValue } from "../constants/Types";

export interface ComponentBaseProps<T> extends MicroComponentBaseProps, React.DOMAttributes<T> {
    selfRef: React.ForwardedRef<T>;
    forwardRef: React.ForwardedRef<T>;
}

export interface MicroComponentBaseProps {
    id: string;
    name: string;
    style: Object;
    scheme: Scheme;
    noStyle: boolean;
    className: string;
    disabled: boolean;
    key: NoseurInputValue;
}
