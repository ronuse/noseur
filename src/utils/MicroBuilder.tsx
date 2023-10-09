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

    buildIcon(icon: NoseurIconElement, props: { scheme?: Scheme, className?: string, relativeAlignment?: Alignment, fillIcon?: boolean }, events?: NoseurObject<any>) {
        if (!icon) { return null; }
        const isFontAwesomeIcon = TypeChecker.isTypeOfAny(icon, ["string"]);
        const className = Classname.build(isFontAwesomeIcon ? icon : (icon as React.ReactElement).props.className, {
            "noseur-wd-100-pct": props.fillIcon,
            "noseur-mg-r-15": props.relativeAlignment == Alignment.LEFT,
            "noseur-mg-l-15": props.relativeAlignment == Alignment.RIGHT,
        }, "noseur-icon", props.className);
        const key = `icon-${MicroBuilder.ICON_COUNTER++}`;
        if (!isFontAwesomeIcon) {
            const iconProps = { ...(icon as React.ReactElement).props };
            ObjectHelper.addAll(iconProps, events);
            iconProps.key = iconProps.key || key;
            iconProps.key = props.scheme || iconProps.scheme;
            iconProps.className = Classname.build(className, iconProps.className);
            return React.cloneElement(icon as React.ReactElement, iconProps);
        }
        return <i key={key} className={className} {...events}></i>;
    },

    buildLabel(label: NoseurLabel, props: { scheme: Scheme, type?: string, htmlFor?: string, className?: string, relativeAlignment?: Alignment }, events?: NoseurObject<any>) {
        if (!label) { return null; }
        const isRawString = TypeChecker.isTypeOfAny(label, ["string"]);
        const className = Classname.build(!isRawString && props.scheme ? `${props.scheme}-tx` : null, {
                "noseur-mg-b-05rem": props.relativeAlignment == Alignment.TOP,
                "noseur-mg-r-05rem": props.relativeAlignment == Alignment.LEFT,
                "noseur-mg-l-05rem": props.relativeAlignment == Alignment.RIGHT,
                "noseur-mg-t-05rem": props.relativeAlignment == Alignment.BOTTOM,
        }, "noseur-label", props.className, (label as React.ReactElement).props?.className);
        const key = `icon-${MicroBuilder.LABEL_COUNTER++}`;
        if (!isRawString) {
            const labelProps = { ...((label as any).props || {}) };
            ObjectHelper.addAll(labelProps, events);
            labelProps.className = className;
            labelProps.key = labelProps.key || key;
            labelProps.scheme = props.scheme || labelProps.scheme;
            return React.cloneElement(label as React.ReactElement, labelProps);
        }
        const rProps: NoseurObject<any> = {
            key,
            ...events,
            className,
        };
        if (props.htmlFor) rProps.htmlFor = props.htmlFor;
        return (props.type == "label" ? <label {...rProps}>{label}</label> : <span {...rProps}>{label}</span>);
    }

}