
export const ColorHelper = {

    alpha(a: number | string) {
        let na: number;
        console.log("EEE", a, typeof a);
        if (typeof a === "string") {
            na = parseInt(a, 16);
        } else {
            na = a;
        }
        if (na > 1) na = na / 255;
        return na;
    },

    hexToRgba(hex: string): { r: number; g: number; b: number; a: number; } {
        const reg = hex.length < 6 ? "\\w" : "\\w\\w";
        const parts = hex.match(new RegExp(reg, "g"))?.map((x: string) => parseInt(x.repeat(2 / x.length), 16))!;
        const rgba: any = { r: parts[0], g: parts[1], b: parts[2] };
        rgba["a"] = (parts.length > 3 ? ColorHelper.alpha(parts[3]) : 1);
        return rgba;
    },

    rgbToCmyk(rgb: { r: number; g: number; b: number; }): { c: number; m: number; y: number; k: number; } {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
    
        const k = +(1 - Math.max(r, g, b));
        const c = +((1 - r - k) / (1 - k) || 0);
        const m = +((1 - g - k) / (1 - k) || 0);
        const y = +((1 - b - k) / (1 - k) || 0);
    
        return { c: (c * 1000), m: (m * 1000), y: (y * 1000), k: (k * 1000) };
    },

    hexToColor(hex?: string) {
        if (!hex) return undefined;
        const { r, g, b, a } = ColorHelper.hexToRgba(hex);
        const alpha = a;
        const rgb = { r, g, b };
        return {
            hex,
            rgb,
            alpha,
            hsb: ColorHelper.rgbToHsb(rgb),
            cmyk: ColorHelper.rgbToCmyk(rgb),
        }
    },

    hsbToColor(hsb?: { h: number; s: number; b: number; }, alpha: number = 1) {
        if (!hsb) return undefined;
        const { r, g, b } = ColorHelper.hsbToRgb(hsb);
        const rgb = { r, g, b };
        return {
            hsb,
            rgb,
            alpha,
            hex: ColorHelper.hsbToHex(hsb),
            cmyk: ColorHelper.rgbToCmyk(rgb),
        }
    },

    hexToHsb(hex: string)  {
        return ColorHelper.rgbToHsb(ColorHelper.hexToRgba(hex));
    },

    rgbToHex(rgba: { r: number; g: number; b: number; a?: number; }) {
        let hex = [rgba.r.toString(16), rgba.g.toString(16), rgba.b.toString(16)];

        for (let key in hex) {
            if (hex[key].length === 1) {
                hex[key] = '0' + hex[key];
            }
        }

        return "#" + hex.join('');
    },

    hsbToHex(hsb: { h: number; s: number; b: number; }) {
        return ColorHelper.rgbToHex(ColorHelper.hsbToRgb(hsb));
    },

    rgbToHsb(rgba: { r: number; g: number; b: number; a?: number; }) {
        let hsb = {
            h: 0,
            s: 0,
            b: 0
        };
        let min = Math.min(rgba.r, rgba.g, rgba.b);
        let max = Math.max(rgba.r, rgba.g, rgba.b);
        let delta = max - min;

        hsb.b = max;
        hsb.s = max !== 0 ? (255 * delta) / max : 0;

        if (hsb.s !== 0) {
            if (rgba.r === max) {
                hsb.h = (rgba.g - rgba.b) / delta;
            } else if (rgba.g === max) {
                hsb.h = 2 + (rgba.b - rgba.r) / delta;
            } else {
                hsb.h = 4 + (rgba.r - rgba.g) / delta;
            }
        } else {
            hsb.h = -1;
        }

        hsb.h = hsb.h * 60;

        if (hsb.h < 0) {
            hsb.h = hsb.h + 360;
        }

        hsb.s = hsb.s * (100 / 255);
        hsb.b = hsb.b * (100 / 255);

        return hsb;
    },

    hsbToRgb(hsb: { h: number; s: number; b: number; }) {
        let rgb: any = {
            r: null,
            g: null,
            b: null
        };
        let h = Math.round(hsb.h);
        let s = Math.round((hsb.s * 255) / 100);
        let v = Math.round((hsb.b * 255) / 100);

        if (s === 0) {
            rgb = {
                r: v,
                g: v,
                b: v
            };
        } else {
            let t1 = v;
            let t2 = ((255 - s) * v) / 255;
            let t3 = ((t1 - t2) * (h % 60)) / 60;

            if (h === 360) {
                h = 0;
            }

            if (h < 60) {
                rgb.r = t1;
                rgb.b = t2;
                rgb.g = t2 + t3;
            } else if (h < 120) {
                rgb.g = t1;
                rgb.b = t2;
                rgb.r = t1 - t3;
            } else if (h < 180) {
                rgb.g = t1;
                rgb.r = t2;
                rgb.b = t2 + t3;
            } else if (h < 240) {
                rgb.b = t1;
                rgb.r = t2;
                rgb.g = t1 - t3;
            } else if (h < 300) {
                rgb.b = t1;
                rgb.g = t2;
                rgb.r = t2 + t3;
            } else if (h < 360) {
                rgb.r = t1;
                rgb.g = t2;
                rgb.b = t1 - t3;
            } else {
                rgb.r = 0;
                rgb.g = 0;
                rgb.b = 0;
            }
        }

        return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
    },

    normalizeHsB(hsb: { h: number; s: number; b: number; }) {
        return {
            h: Math.min(360, Math.max(0, hsb.h)),
            s: Math.min(100, Math.max(0, hsb.s)),
            b: Math.min(100, Math.max(0, hsb.b))
        };
    },

}
