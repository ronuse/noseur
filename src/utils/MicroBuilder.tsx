import React from "react";
import { Classname } from "./Classname";
import { TypeChecker } from "./TypeChecker";
import { Scheme } from "../constants/Scheme";
import { ObjectHelper } from "./ObjectHelper";
import { Alignment } from "../constants/Alignment";
import { NoseurIconElement, NoseurLabel, NoseurObject } from "../constants/Types";

export const MicroBuilder = {

    ICON_COUNTER: 0,
    LABEL_COUNTER: 0,

    buildIcon(icon: NoseurIconElement, props: { scheme: Scheme, className?: string, relativeAlignment?: Alignment, fillIcon?: boolean }, events?: NoseurObject) {
        if (!icon) { return null; }
        const isFontAwesomeIcon = TypeChecker.isTypeOfAny(icon, ["string"]);
        const className = Classname.build(isFontAwesomeIcon ? icon : (icon as React.ReactElement).props.className, {
            "noseur-wd-100-pct": props.fillIcon,
            "noseur-mg-r-15": props.relativeAlignment == Alignment.LEFT,
            "noseur-mg-l-15": props.relativeAlignment == Alignment.RIGHT,
        }, "noseur-icon", props.className);
        const key = `icon-${MicroBuilder.ICON_COUNTER++}`;
        if (!isFontAwesomeIcon) {
            ObjectHelper.addAll((icon as React.ReactElement).props, events);
            (icon as React.ReactElement).props.key = (icon as React.ReactElement).props.key = key;
            (icon as React.ReactElement).props.key = (icon as React.ReactElement).props.scheme = props.scheme;
            (icon as React.ReactElement).props.className = Classname.build(className, (icon as React.ReactElement).props.className);
            return icon;
        }
        return <i key={key} className={className} {...events}></i>;
    },

    buildLabel(label: NoseurLabel, props: { scheme: Scheme, type?: string, htmlFor?: string, className?: string, relativeAlignment?: Alignment }, events?: NoseurObject) {
        if (!label) { return null; }
        const isRawString = TypeChecker.isTypeOfAny(label, ["string"]);
        const className = Classname.build(!isRawString && props.scheme ? `${props.scheme} ${(label as React.ReactElement).props.className}` : null, {
                "noseur-mg-b-05rem": props.relativeAlignment == Alignment.TOP,
                "noseur-mg-r-05rem": props.relativeAlignment == Alignment.LEFT,
                "noseur-mg-l-05rem": props.relativeAlignment == Alignment.RIGHT,
                "noseur-mg-t-05rem": props.relativeAlignment == Alignment.BOTTOM,
        }, "noseur-label", props.className);
        const key = `icon-${MicroBuilder.LABEL_COUNTER++}`;
        if (!isRawString) {
            ObjectHelper.addAll((label as React.ReactElement).props, events);
            (label as React.ReactElement).props.key = (label as React.ReactElement).props.key = key;
            (label as React.ReactElement).props.key = (label as React.ReactElement).props.scheme = props.scheme;
            (label as React.ReactElement).props.className = Classname.build(className, (label as React.ReactElement).props.className);
            return label;
        }
        const rProps: NoseurObject = {
            key,
            ...events,
            className,
        };
        if (props.htmlFor) rProps.htmlFor = props.htmlFor;
        return (props.type == "label" ? <label {...rProps}>{label}</label> : <span {...rProps}>{label}</span>);
    }

}