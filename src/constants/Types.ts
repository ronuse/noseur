
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
export type NoseurDivElement = HTMLDivElement;
export type NoseurInputValue = string | number;
export type NoseurObject<T> = { [key: string]: T };
export type NoseurCheckState = NoseurCheckStateInterface;
export type NoseurRawElement = Element | DocumentFragment;
export type NoseurDomElement = React.ReactNode | React.ReactElement | HTMLElement | null;
export type _NoseurElement = React.ReactNode | React.ReactElement | JSX.Element | string | number | null;
export type NoseurElement = _NoseurElement | _NoseurElement[];
export type NoseurIconElement = NoseurElement;
export type NoseurFormElement = HTMLTextAreaElement | HTMLInputElement;
export type NoseurButtonElement = HTMLButtonElement | HTMLAnchorElement;
export type SortIcons = { asc: NoseurIconElement, desc: NoseurIconElement, unsorted: NoseurIconElement };
export type NumberRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | NoseurNummber

export enum SortMode {
    NONE,
    SINGLE,
    MULTIPLE,
}

export enum SortDirection {
    NONE,
    BOTH,
    FORWARD,
    BACKWARD,
}
