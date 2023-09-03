
import React from "react";
import { Scheme } from "./Scheme";

interface NoseurCheckStateInterface {
    value: string;
    scheme: Scheme;
    checked: boolean;
    icon: NoseurIconElement;
};

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type NoseurNummber = number | null;
export type NoseurLabel = React.ReactNode;
export type NoseurInputValue = string | number;
export type NoseurObject = { [key: string]: any };
export type NoseurCheckState = NoseurCheckStateInterface;
export type NoseurElement2 = React.ReactNode | React.ReactElement | null;
export type NoseurElement = React.ReactNode | React.ReactElement | string | null;
export type NoseurIconElement = NoseurElement;
export type NoseurFormElement = HTMLTextAreaElement | HTMLInputElement;
export type NoseurButtonElement = HTMLButtonElement | HTMLAnchorElement;
export type NumberRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | NoseurNummber
