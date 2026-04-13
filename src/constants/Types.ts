
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
export type NoseurNumberedObject<T> = { [key: number]: T };
export type NoseurRawElement = Element | DocumentFragment;
export type NoseurDomElement = React.ReactNode | React.ReactElement | HTMLElement | null;
export type _NoseurElement = React.ReactNode | React.ReactElement | React.ReactNode | React.JSX.Element | string | number | null;
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

export interface ToggleIcons {
    show: NoseurElement;
    hide: NoseurElement
}

export interface Color {
    hex: string;
    alpha: number;
    rgb: { r: number; g: number; b: number; };
    hsb: { h: number; s: number; b: number; };
    //hsl: { h: number; s: number; l: number; };
    //hsv: { h: number; s: number; v: number; };
    cmyk: { c: number; m: number; y: number; k: number; };
}

export interface ColorEvent {
    color: Color;
    previousColor?: Color;
}

export type ColorEventHandler = (event: ColorEvent) => void | true | Promise<void | true>;
