
import React from "react";
import { DOMHelper } from "../utils/DOMUtils";
import { BoolHelper } from "../utils/BoolHelper";
import { TypeChecker } from "../utils/TypeChecker";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { Bound, Ceiling, Direction } from "../constants/Direction";
import { NoseurObject } from "../constants/Types";

export enum DragSensorEventType {
    END = "END",
    EXIT = "EXIT",
    DRAG = "DRAG",
    DROP = "DROP",
    START = "START",
    ENTER = "ENTER",
    DRAG_OVER = "DRAG_OVER",
}

export interface DragSensorEvent {
    x: number;
    y: number;
    key: string;
    top: number;
    left: number;
    scrollX: number;
    scrollY: number;
    clientX: number;
    clientY: number;
    clientTop: number;
    clientLeft: number;
    event: React.DragEvent<any>;
}

export type DragSensorEventHandler = (event?: DragSensorEvent) => void;
export type DragSensorEventChangeHandler = (type?: DragSensorEventType, event?: DragSensorEvent) => void;

export interface DragSensorManageRef {

}

export interface DragSensorProps extends ComponentBaseProps<HTMLDivElement, DragSensorManageRef> {
    padding: number;
    ceiling: Ceiling;
    edgeOnly: boolean;
    singleton: boolean;
    direction: Direction;
    allowedOverflow: number;
    allowOnDragReset: boolean;
    boundToParent: boolean | Bound;

    onDragEvent: DragSensorEventHandler;
    onDragEventEnd: DragSensorEventHandler;
    onDragEventExit: DragSensorEventHandler;
    onDragEventDrop: DragSensorEventHandler;
    onDragEventEnter: DragSensorEventHandler;
    onDragEventStart: DragSensorEventHandler;
    onDragEventDragOver: DragSensorEventHandler;
    onDragEventChange: DragSensorEventChangeHandler;
}

interface DragSensorState {

}

class DragSensorComponent extends React.Component<DragSensorProps, DragSensorState> {

    public static defaultProps: Partial<DragSensorProps> = {
    };

    state: DragSensorState = {
    };

    dragElementRefs: NoseurObject<any> = {};

    constructor(props: DragSensorProps) {
        super(props);

        this.onDrop = this.onDrop.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragExit = this.onDragExit.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
    }

    onDragStart(key: string, event: React.DragEvent<any>) {
        this.props.onDragStart && this.props.onDragStart(event);
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.START, evt);
        this.props.onDragEventStart && this.props.onDragEventStart(evt);
    }

    onDragEnd(key: string, event: React.DragEvent<any>) {
        this.props.onDragEnd && this.props.onDragEnd(event);
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.START, evt);
        this.props.onDragEventEnd && this.props.onDragEventEnd(evt);
    }

    onDragEnter(key: string, event: React.DragEvent<any>) {
        this.props.onDragEnter && this.props.onDragEnter(event);
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.ENTER, evt);
        this.props.onDragEventEnter && this.props.onDragEventEnter(evt);
    }

    onDragExit(key: string, event: React.DragEvent<any>) {
        this.props.onDragExit && this.props.onDragExit(event);
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.EXIT, evt);
        this.props.onDragEventExit && this.props.onDragEventExit(evt);
    }

    onDrop(key: string, event: React.DragEvent<any>) {
        this.props.onDrop && this.props.onDrop(event);
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.DROP, evt);
        this.props.onDragEventDrop && this.props.onDragEventDrop(evt);
    }

    onDragOver(key: string, event: React.DragEvent<any>) {
        this.props.onDragOver && this.props.onDragOver(event);
        if (!!this.props.onDrop || !!this.props.onDragEventDrop) event.preventDefault();
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.DRAG_OVER, evt);
        this.props.onDragEventDragOver && this.props.onDragEventDragOver(evt);
    }

    onDrag(key: string, event: React.DragEvent<any>) {
        if (!this.props.allowOnDragReset && event.clientX === 0 && event.clientY === 0) return;
        this.props.onDrag && this.props.onDrag(event);
        if (!this.dragElementRefs || !(key in this.dragElementRefs)) return;
        const element = this.dragElementRefs[key];
        const evt = { ...DOMHelper.elementRelativeAndAbsolutePositions(element, event, this.props.boundToParent, this.props.allowedOverflow, this.props.direction, this.props.ceiling), event, key };
        this.props.onDragEventChange && this.props.onDragEventChange(DragSensorEventType.DRAG, evt);
        this.props.onDragEvent && this.props.onDragEvent(evt);
    }

    buildEventProps(key: string, existingRef: any) {
        const ref = (r: any) => {
            ObjectHelper.resolveRef(existingRef, r);
            if (!key) {
                delete this.dragElementRefs[key];
                return;
            }
            this.dragElementRefs[key] = r;
        };
        const onDrop = (e: React.DragEvent<any>) => this.onDrop(key, e);
        const onDrag = (e: React.DragEvent<any>) => this.onDrag(key, e);
        const onDragEnd = (e: React.DragEvent<any>) => this.onDragEnd(key, e);
        const onDragOver = (e: React.DragEvent<any>) => this.onDragOver(key, e);
        const onDragEnter = (e: React.DragEvent<any>) => this.onDragEnter(key, e);
        const onDragStart = (e: React.DragEvent<any>) => this.onDragStart(key, e);
        const eventProps = {
            ref,
            onDrag,
            onDrop,
            onDragEnd,
            onDragOver,
            onDragEnter,
            onDragStart,
            draggable: this.props.draggable,
        };
        return eventProps;
    }

    render() {
        const style: React.CSSProperties = {
            width: "fit-content",
            ...(this.props.style ?? {}),
        };

        if (this.props.singleton) {
            if (!this.props.children) return;
            let children: (React.ReactNode)[] = [];
            if (!TypeChecker.isArray(this.props.children)) children.push(this.props.children);
            else children = children.concat(this.props.children);

            return (<>{children.map((child: React.ReactNode | undefined) => {
                let ref = (TypeChecker.isObject(child) ? (child as any)?.ref : undefined);
                let key = (TypeChecker.isObject(child) ? (child as any)?.key : undefined) ?? DOMHelper.uniqueElementId("drag-sensor");
                return (!child
                    ? undefined
                    : React.cloneElement((BoolHelper.equalsAny(typeof child, ["string", "number", "boolean"])
                        ? <span>{child}</span>
                        : child as any),
                        this.buildEventProps(key, ref)))
            })}</>)

        }

        return (<div id={this.props.id} key={this.props.key} className={this.props.className} style={style} {...this.buildEventProps((this.props.key ?? "__primary__") as string, this.props.forwardRef)}>
            {this.props.children}
        </div>);
    };

}

export const DragSensor  = ({ ref, ...props }: Partial<DragSensorProps>) => (
    <DragSensorComponent {...props} forwardRef={ref} />
);
