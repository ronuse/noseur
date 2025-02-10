
import React from "react";
import { Classname } from "../utils/Classname";
import { ColorHelper } from "../utils/ColorHelper";
import { ColorEventHandler, NoseurObject } from "../constants/Types";
import { ComponentBaseProps, ComponentElementBasicAttributes } from "../core/ComponentBaseProps";

export type ColorPaletteAttributtesRelays = {
    tile?: ComponentElementBasicAttributes;
}

export interface ColorPaletteProps extends ComponentBaseProps<HTMLDivElement, {}, ColorPaletteAttributtesRelays> {
    grid: number;
    defaultValue: string;
    palette: string[] | string;
    gap: number | { row: number; column: number; };
    size: number | { width: number; height: number; };

    onSelectColor: ColorEventHandler;
}

interface ColorPaletteState {
    value?: string;
    palette: string[];
}

class ColorPaletteComponent extends React.Component<ColorPaletteProps, ColorPaletteState> {

    public static defaultProps: Partial<ColorPaletteProps> = {
        gap: 0,
        size: 25,
        grid: 10,
    };

    state: ColorPaletteState = {
        value: this.props.defaultValue,
        palette: ColorPaletteRegistry.getPalette(this.props.palette) ?? [],
    };

    constructor(props: ColorPaletteProps) {
        super(props);
    }

    onSelectColor(value: string) {
        const previous = this.state.value;
        const eventValue = { color: ColorHelper.hexToColor(value)!, previousColor: ColorHelper.hexToColor(previous) };
        this.props.onChange && this.props.onChange({ value: eventValue } as any);
        if ((this.props.onSelectColor && this.props.onSelectColor(eventValue) === true)) return;
        this.setState({ value });
    }

    renderTile(color: string) {
        const style: React.CSSProperties = {
            backgroundColor: color,
            border: `1px solid ${color}`,
            width: (typeof this.props.size === "number" ? this.props.size : this.props.size.width) - 2,
            height: (typeof this.props.size === "number" ? this.props.size : this.props.size.height) - 2,
            minWidth: (typeof this.props.size === "number" ? this.props.size : this.props.size.width) - 2,
            ...(this.props.attrsRelay?.tile?.style ?? {})
        };
        return (<div key={color} className={Classname.build("noseur-color-palette-tile", this.props.attrsRelay?.tile?.className, { "active": color === this.state.value })}
            style={style} onClick={() => this.onSelectColor(color)} />);
    }

    render() {
        const width = (typeof this.props.size === "number" ? this.props.size : this.props.size.width);
        const className = Classname.build("noseur-color-palette", this.props.className);
        const style: React.CSSProperties = {
            ...(this.props.style ?? {}),
            gridTemplateColumns: Array(Math.min(this.state.palette.length, this.props.grid)).fill(`${width}px`).join(" "),
            columnGap: (typeof this.props.gap !== "number" ? this.props.gap.column : undefined),
            rowGap: (typeof this.props.gap !== "number" ? this.props.gap.row : undefined),
            gap: (typeof this.props.gap === "number" ? this.props.gap : undefined),
        };

        return (<div className={className} style={style} id={this.props.id} key={this.props.key}>
            {this.state.palette.map((color) => this.renderTile(color))}
        </div>);
    };

}

export class ColorPaletteRegistry {

    private static _registeredPalette: NoseurObject<string[]> = {};

    static get() {
        return ColorPaletteRegistry._registeredPalette;
    }

    static getPalette(palette: string[] | string) {
        if (typeof palette !== "string") return palette;
        return (palette in ColorPaletteRegistry._registeredPalette ? ColorPaletteRegistry._registeredPalette[palette] : []);
    }

    static register(key: string, palette: string[]) {
        ColorPaletteRegistry._registeredPalette[key] = palette;
    }

    static unregister(key: string) {
        if (!(key in ColorPaletteRegistry._registeredPalette)) return;
        delete ColorPaletteRegistry._registeredPalette[key];
    }

}

export const ColorPalette  = ({ ref, ...props }: Partial<ColorPaletteProps>) => (
    <ColorPaletteComponent {...props} forwardRef={ref} />
);

let _defaultPaletteAlreadyRegistered = false;
if (!_defaultPaletteAlreadyRegistered) {
    _defaultPaletteAlreadyRegistered = true;
    ColorPaletteRegistry.register("Microsoft", ["#f65314", "#7cbb00", "#00a1f1", "#ffbb00", "#737373"]); // https://www.color-hex.com/color-palette/4744
    ColorPaletteRegistry.register("MicrosofVisualStudio", ["#5d2b90", "#008a00", "#333333", "#ffffff", "#000000"]); // https://www.color-hex.com/color-palette/12832
    ColorPaletteRegistry.register("MicrosoftDynamicsCRM", ["#002050", "#dfe2e8", "#1160b7", "#b1d6f0", "#d24726"]); // https://www.color-hex.com/color-palette/29680
    ColorPaletteRegistry.register("MicrosoftWordHighlighters", ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#ff00ff"]); // https://www.color-hex.com/color-palette/98189
    ColorPaletteRegistry.register("Default", [
        "#000000", "#444444", "#5b5b5b", "#999999", "#bcbcbc", "#eeeeee", "#f3f6f4", "#ffffff",
        "#f44336", "#744700", "#ce7e00", "#8fce00", "#2986cc", "#16537e", "#6a329f", "#c90076",
        "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc",
        "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd",
        "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0",
        "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79",
        "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47",
        "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130",
    ]); // https://www.color-hex.com/color-palettes/
}
