
import "../Composed.css";
import React from "react";
import { Classname } from "../../utils/Classname";
import { ColorHelper } from "../../utils/ColorHelper";
import { BareInputManageRef } from "../../form/Input";
import { Slider, SliderProps } from "../../form/Slider";
import { DragSensorEvent } from "../../sensor/DragSensor";
import { Orientation } from "../../constants/Orientation";
import { Color, ColorEventHandler } from "../../constants/Types";
import { ComponentBaseProps } from "../../core/ComponentBaseProps";

export const ColorSliderGradient = {
    TRANSPARENT: "linear-gradient(to top, transparent, var(--primaryColor, #ffffff))",
    TRANSPARENT_VERTICAL: "linear-gradient(to top, transparent, var(--primaryColor, #ffffff))",
    TRANSPARENT_HORIZONTAL: "linear-gradient(to left, transparent, var(--primaryColor, #ffffff))",
    RAINBOW: "linear-gradient(to bottom, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red 100%)",
    RAINBOW_VERTICAL: "linear-gradient(to bottom, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red 100%)",
    RAINBOW_HORIZONTAL: "linear-gradient(to right, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red 100%)",
};

export type ColorSliderAttributesRelays = {
    sliderProps?: Partial<SliderProps>;
}

export interface ColorSliderManageRef extends BareInputManageRef<Color> {
}

export interface ColorSliderProps extends ComponentBaseProps<HTMLDivElement, ColorSliderManageRef, ColorSliderAttributesRelays> {
    hue: string;
    primaryColor: string;
    reportOnDrag: boolean;
    colorGradient: string;
    allowedOverflow: number;
    orientation: Orientation.VERTICAL | Orientation.HORIZONTAL;
    
    onSelectColor: ColorEventHandler;
}

interface ColorSliderState {
    primaryColor: string;
}

class ColorSliderComponent extends React.Component<ColorSliderProps, ColorSliderState> {

    public static defaultProps: Partial<ColorSliderProps> = {
        hue: "#ff0000",
        attrsRelay: {},
        allowedOverflow: 5,
        primaryColor: "#ffffff",
        orientation: Orientation.VERTICAL,
        colorGradient: ColorSliderGradient.RAINBOW,
    };

    state: ColorSliderState = {
        primaryColor: this.props.primaryColor,
    };

    alpha: number;
    cachedAttrs: any = {};
    hsb: { h: number; s: number; b: number; };

    constructor(props: ColorSliderProps) {
        super(props);

        this.alpha = 1;
        this.hsb = ColorHelper.hexToHsb(this.props.hue);

        this.onChange = this.onChange.bind(this);
        this.onHandleDrag = this.onHandleDrag.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<ColorSliderProps>, _: Readonly<ColorSliderState>) {
        if (this.props.primaryColor !== prevProps.primaryColor || this.props.hue !== prevProps.hue) {
            this.hsb = (this.props.hue !== prevProps.hue ? ColorHelper.hexToHsb(this.props.hue) : this.hsb);
            this.setState({ primaryColor: this.props.primaryColor });
        }
    }

    onChange(evt: any) {
        this.props.onChange && this.props.onChange(evt);
        const value = evt.value + this.props.allowedOverflow;
        this.alpha = (value / 100);
    }

    async onHandleDrag(evt?: DragSensorEvent) {
        const { event } = evt! as any;
        setTimeout(() => {
            let position = (event[this.cachedAttrs.page] !== undefined ? event[this.cachedAttrs.page] : ((event as any).changedTouches !== undefined ? (event as any).changedTouches[0][this.cachedAttrs.page] : 0));
            const topOrLeft = (this.cachedAttrs.rect[this.cachedAttrs.topLeft] ?? 0) + (window[this.cachedAttrs.scrollXy] ?? (document.documentElement as any)[this.cachedAttrs.scrollTl] ?? (document.body as any)[this.cachedAttrs.scrollTl] ?? 0);
            const hsb = ColorHelper.normalizeHsB({
                s: this.hsb.s,
                b: this.hsb.b,
                h: Math.floor((360 * (Math.max(0, Math.min(224, position - topOrLeft)))) / 224),
            });
            const eventValue = { color: ColorHelper.hsbToColor(hsb, this.alpha)!, previousColor: ColorHelper.hsbToColor(this.hsb, this.alpha) };
            if ((this.props.onSelectColor && this.props.onSelectColor(eventValue) === true)) return;
            this.hsb = hsb;
        }, 100);
    }

    renderRange() {
        return (<div className={Classname.build("noseur-color-slider-range", `noseur-color-slider-range-${this.props.orientation}`)}/>);
    }

    render() {
        const range = this.renderRange();
        const className = Classname.build("noseur-color-slider", `noseur-color-slider-${this.props.orientation}`, this.props.className, this.props.attrsRelay?.sliderProps?.className);
        const style: any = {
            ...(this.props.style ?? {}),
            "--primaryColor": this.state.primaryColor,
            "--noseurSchemeMainColor": this.props.colorGradient,
            ...(this.props.attrsRelay?.sliderProps?.style ?? {}),
        };
        this.props.attrsRelay.sliderProps = {
            ...(this.props.attrsRelay.sliderProps ?? {}),
            attrsRelay: {
                ...(this.props.attrsRelay?.sliderProps?.attrsRelay ?? {}),
                dragSensorProps: {
                    ...(this.props.attrsRelay?.sliderProps?.attrsRelay?.dragSensorProps ?? {}),
                    [this.props.reportOnDrag ? `onDragEvent` : `onDragEventEnd`]: this.onHandleDrag,
                    allowedOverflow: this.props.allowedOverflow,
                }
            }
        };

        return (<Slider {...this.props.attrsRelay.sliderProps} range={range} onChange={this.onChange}
                orientation={this.props.orientation} id={this.props.id} key={this.props.key} className={className} style={style}
                ref={(e: any) => {
                    if (e) {
                        this.cachedAttrs.rect = e.getBoundingClientRect();
                        this.cachedAttrs.page = (this.props.orientation === Orientation.HORIZONTAL ? "pageX" : "pageY");
                        this.cachedAttrs.topLeft = (this.props.orientation === Orientation.HORIZONTAL ? "left" : "top");
                        this.cachedAttrs.scrollXy = (this.props.orientation === Orientation.HORIZONTAL ? "scrollX" : "scrollY");
                        this.cachedAttrs.scrollTl = (this.props.orientation === Orientation.HORIZONTAL ? "scrollLeft" : "scrollTop");
                    }
                }}/>);
    };

}

export const ColorSlider  = ({ ref, ...props }: Partial<ColorSliderProps>) => (
    <ColorSliderComponent {...props} forwardRef={ref} />
);
