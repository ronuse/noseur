
import React from "react";
import { Classname } from "../utils/Classname";
import { Alignment } from "../constants/Alignment";
import { Color, NoseurElement } from "../constants/Types";
import { ComponentBaseProps, ComponentElementBasicAttributes } from "../core/ComponentBaseProps";

export type ColorMapAttributesRelays = {
    map?: {
        size: number;
    } & ComponentElementBasicAttributes;
}

export interface ColorMapManageRef {

}

export interface ColorMapProps extends ComponentBaseProps<HTMLDivElement, ColorMapManageRef, ColorMapAttributesRelays> {
    hex: string;
    color: Color;
    hideMap: boolean;
    hideAlpha: boolean;
    hideSlider: boolean;
    alignAlpha: Alignment;
    alignSlider: Alignment;
    indicator: NoseurElement;
}

interface ColorMapState {
    hex: string;
}

class ColorMapComponent extends React.Component<ColorMapProps, ColorMapState> {

    public static defaultProps: Partial<ColorMapProps> = {
        hex: "#000000",
    };

    state: ColorMapState = {
        hex: this.props.hex ?? this.props.color?.hex
    };

    constructor(props: ColorMapProps) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<ColorMapProps>, _: Readonly<ColorMapState>) {
        if (this.props.hex !== prevProps.hex || this.props.color !== prevProps.color) {
            this.setState({ hex: (this.props.hex !== prevProps.hex 
                ? this.props.hex 
                : (this.props.color !== prevProps.color ? this.props.color.hex : this.state.hex)) });
        }
    }

    renderMap() {
        if (this.props.hideMap) return;

        const className = Classname.build("noseur-color-map-map", this.props.attrsRelay?.map?.className);
        const style: React.CSSProperties = {
            width: this.props.attrsRelay?.map?.size ?? 180,
            height: this.props.attrsRelay?.map?.size ?? 180,
            ...(this.props.attrsRelay?.map?.style ?? {}),
            backgroundColor: this.state.hex,
        };

        return (<div className={className} style={style} id={this.props.attrsRelay?.map?.id} key={this.props.attrsRelay?.map?.id}>
            <div className="noseur-color-map-map-gradient">

            </div>
        </div>)
    }

    render() {
        const map = this.renderMap();
        const className = Classname.build("noseur-color-map", this.props.className);
        const style: React.CSSProperties = {
            ...(this.props.style ?? {}),
        };
        
        return (<div className={className} style={style} id={this.props.id} key={this.props.key}>
            {map}
        </div>);
    };

}

export const ColorMap  = ({ ref, ...props }: Partial<ColorMapProps>) => (
    <ColorMapComponent {...props} forwardRef={ref} />
);
