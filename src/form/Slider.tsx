
import React from "react";
import { BareInputManageRef } from "./Input";
import { Classname } from "../utils/Classname";
import { NoseurElement } from "../constants/Types";
import { Direction } from "../constants/Direction";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Orientation } from "../constants/Orientation";
import { DOMHelper, ScrollHandler } from "../utils/DOMUtils";
import { DragSensor, DragSensorEvent, DragSensorProps } from "../sensor/DragSensor";
import { ComponentBaseProps, ComponentElementBasicAttributes } from "../core/ComponentBaseProps";

export interface SliderManageRef extends BareInputManageRef<number | number[]> {
}

export type SliderAttributtesRelays = {
    range?: ComponentElementBasicAttributes;
    handle?: ComponentElementBasicAttributes;
    dragSensorProps?: Partial<DragSensorProps>;
}

export interface SliderProps extends ComponentBaseProps<HTMLDivElement, SliderManageRef, SliderAttributtesRelays> {
    inverse: boolean;
    range: NoseurElement;
    handle: NoseurElement;
    value: number | number[];
    orientation: Orientation.VERTICAL | Orientation.HORIZONTAL;
}

interface SliderState {
    values: number[];
}

class SliderComponent extends React.Component<SliderProps, SliderState> {

    public static defaultProps: Partial<SliderProps> = {
        attrsRelay: {},
        draggable: true,
        orientation: Orientation.HORIZONTAL,
    };

    state: SliderState = {
        values: (typeof this.props.value === "number" ? [this.props.value] : this.props.value) ?? [0],
    };

    documentScrollHandler?: any;
    componentUnmounted: boolean = false;
    compoundRef: HTMLDivElement | null = null;
    sliderRangeElement: HTMLSpanElement | undefined;
    compoundRefRect: {
        x: number;
        y: number;
        width: number;
        height: number;
        top: number;
        left: number;
    } | undefined;

    constructor(props: SliderProps) {
        super(props);

        this.updateRange = this.updateRange.bind(this);
        this.onHandleDrag = this.onHandleDrag.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            clear: () => {
                this.setState({ values: this.state.values.map(() => 0) });
                this.forceUpdate();
            },
            value: () => {
                return (this.state.values.length < 2 ? this.state.values[0] : this.state.values);
            },
        });
        if (this.documentScrollHandler) return;
        this.documentScrollHandler = ScrollHandler.handle((this.compoundRef as Node), async (_: any) => {
            this.compoundRefRect = DOMHelper.getElementRectWithOffset(this.compoundRef!);
        });
        this.documentScrollHandler.attach();
        this.componentUnmounted = true;
    }

    componentWillUnmount() {
        if (!this.componentUnmounted) return;
        this.componentUnmounted = true;
        this.documentScrollHandler && this.documentScrollHandler.detach();
        ObjectHelper.resolveManageRef(this, null);
        this.documentScrollHandler = undefined;
    }

    shouldComponentUpdate(_: SliderProps, __: SliderState) {
        return true;
    }

    async updateRange() {
        const values = this.state.values;
        if (this.sliderRangeElement) {
            if (values.length < 2) {
                this.sliderRangeElement!.style[this.props.orientation === Orientation.HORIZONTAL ? "width" : "height"] = `${values[0]}%`;
                return;
            }
            let farRightValue = values[0];
            let farLeftValue = values[values.length - 1];
            if (farRightValue > farLeftValue) {
                let tempValue = farLeftValue;
                farLeftValue = farRightValue;
                farRightValue = tempValue;
            }
            if (this.props.orientation === Orientation.HORIZONTAL) {
                this.sliderRangeElement!.style.left = `${farRightValue}%`;
                this.sliderRangeElement!.style.right = `${farLeftValue}%`;
                this.sliderRangeElement!.style.width = `${farLeftValue - farRightValue}%`;
                return;
            }
            this.sliderRangeElement!.style.top = `${farRightValue}%`;
            this.sliderRangeElement!.style.bottom = `${farLeftValue}%`;
            this.sliderRangeElement!.style.height = `${farLeftValue - farRightValue}%`;
        }
    }

    async onHandleDrag(evt?: DragSensorEvent) {
        const values = this.state.values;
        const index = parseInt((evt?.key ?? "").split("|__|")[0]);
        const compoundWidthOrHeight = (this.props.orientation === Orientation.HORIZONTAL ? this.compoundRefRect?.width : this.compoundRefRect?.height);
        const compoundLeftOrTop = (this.props.orientation === Orientation.HORIZONTAL ? this.compoundRefRect?.left : this.compoundRefRect?.top);
        const value = evt![this.props.orientation === Orientation.HORIZONTAL ? "left" : "top"] - (compoundLeftOrTop ?? 0);
        const percentageValue = ObjectHelper.round((value / (compoundWidthOrHeight ?? 1)) * 100);
        const finalValue = (this.props.inverse && values.length === 1 ? (100 - percentageValue) : percentageValue);
        if (values[index] === value) return;
        values[index] = finalValue;
        (async () => {
            (evt?.event.target as any).style[this.props.orientation === Orientation.HORIZONTAL ? "left" : "top"] = `${percentageValue}%`;
            this.props.onChange && this.props.onChange({ values: values, value: (values ? values[0] : 0) } as any);
            this.updateRange();
        }).bind(this)();
        this.props.attrsRelay?.dragSensorProps?.onDragEvent && this.props.attrsRelay?.dragSensorProps?.onDragEvent(evt);
    }

    renderRange() {
        const className = Classname.build("noseur-slider-range", {
            "inverse": this.props.inverse,
            [`${this.props.attrsRelay?.range?.scheme}-vars`]: !!this.props.attrsRelay?.range?.scheme
        }, this.props.attrsRelay?.range?.className);
        if (this.props.range) {
            return React.cloneElement(this.props.range as any, {
                id: ObjectHelper.object(this.props.range)?.props?.id ?? this.props.attrsRelay?.range?.id,
                className: Classname.build(className, ObjectHelper.object(this.props.range)?.props?.className),
                style: {
                    ...(this.props.attrsRelay?.range?.style ?? {}),
                    ...ObjectHelper.object(this.props.range)?.props?.style,
                },
            });
        }
        return (<span ref={(r: any) => this.sliderRangeElement = r} className={className} style={this.props.attrsRelay?.range?.style} id={this.props.attrsRelay?.range?.id} />);
    }

    renderHandle(index: number, value: number) {
        const finalValue = (this.props.inverse ? (100 - value) : value);
        const key = `${index}|__|${DOMHelper.uniqueElementId("slider")}`;
        const props: any = {
            style: {
                ...(this.props.attrsRelay?.handle?.style ?? {}),
                [this.props.orientation === Orientation.HORIZONTAL ? "left" : "top"]: `${finalValue}%`,
            },
        };
        const className = Classname.build("noseur-slider-handle", {
            [`${this.props.attrsRelay?.handle?.scheme}-vars`]: !!this.props.attrsRelay?.handle?.scheme
        }, this.props.attrsRelay?.handle?.className);
        if (this.props.handle) {
            return React.cloneElement(this.props.handle as any, {
                key,
                ...props,
                className,
                draggable: true,
                id: this.props.attrsRelay?.handle?.id
            });
        }
        return (<span key={key} draggable className={className} id={this.props.attrsRelay?.handle?.id} {...props} />);
    }

    render() {
        const range = this.renderRange();
        const handles = this.state.values.map((value, index) => this.renderHandle(index, value));
        const className = Classname.build("noseur-slider", `noseur-slider-${this.props.orientation}`, {
            [`${this.props.scheme}-vars`]: !!this.props.scheme
        }, this.props.className);
        const ref = (r: any) => {
            this.compoundRef = r;
            const firstRender = !this.compoundRefRect;
            ObjectHelper.resolveRef(this.props.forwardRef, r);
            if (r) this.compoundRefRect = DOMHelper.getElementRectWithOffset(this.compoundRef!);
            if (firstRender) this.updateRange();
        };

        return (<div ref={ref} className={className} id={this.props.id} style={this.props.style} key={this.props.key}>
            {range}
            <DragSensor direction={this.props.orientation === Orientation.HORIZONTAL ? Direction.EAST_WEST : Direction.NORTH_SOUTH} draggable={this.props.draggable} singleton boundToParent {...this.props.attrsRelay?.dragSensorProps} onDragEvent={this.onHandleDrag}>
                {handles}
            </DragSensor>
        </div>);
    };

}

export const Slider = React.forwardRef<HTMLDivElement, Partial<SliderProps>>((props, ref) => (
    <SliderComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
