
import React from "react";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { Classname } from "../utils/Classname";
import { Scheme } from "../constants/Scheme";

export type ScrollPanelOnSubmitEventHandler = (event?: any) => void;

// TODO implements the internal control
export interface ScrollPanelManageRef {
    scrollUp: () => void;
    scrollLeft: () => void;
    scrollDown: () => void;
    scrollRight: () => void;
}

export interface ScrollPanelProps extends ComponentBaseProps<HTMLDivElement, ScrollPanelManageRef> {
    isForm: boolean;
    alwaysScroll: boolean;
    alwaysScrollX: boolean;
    alwaysScrollY: boolean;
    hideScrollBars: boolean;
    hideScrollBarX: boolean;
    hideScrollBarY: boolean;
    scroller: Partial<{
        trackBg: string;
        thumbBg: string;
        trackWidth: number;
        trackBorderRadius: number;
        thumbBorderRadius: number;
    }>;

    onSubmit: ScrollPanelOnSubmitEventHandler;
}

interface ScrollPanelState {

}

class ScrollPanelComponent extends React.Component<ScrollPanelProps, ScrollPanelState> {

    public static defaultProps: Partial<ScrollPanelProps> = {
    };

    state: ScrollPanelState = {
    };

    constructor(props: ScrollPanelProps) {
        super(props);
    }

    render() {
        const component = this.props.isForm ? "form" : "div";
        const className = Classname.build("noseur-scrollpanel", {
            'noseur-skeleton': this.props.scheme === Scheme.SKELETON,
			'noseur-scrollpanel-always-show-scrollbars': this.props.alwaysScroll,
			'noseur-scrollpanel-always-show-scrollbar-x': this.props.alwaysScrollX,
			'noseur-scrollpanel-always-show-scrollbar-y': this.props.alwaysScrollY,
			'noseur-scrollpanel-hidden-scrollbar-x': this.props.hideScrollBars ?? this.props.hideScrollBarX,
			'noseur-scrollpanel-hidden-scrollbar-y': this.props.hideScrollBars ?? this.props.hideScrollBarY
        }, (this.props.scheme ? `${this.props.scheme}-vars` : null), this.props.className);
        const style: any = {
            ...(this.props.style ?? {})
        };
        if (this.props.scroller?.trackBg) style["--scrollTrackBg"] = this.props.scroller?.trackBg;
        if (this.props.scroller?.thumbBg) style["--scrollThumbBg"] = this.props.scroller?.thumbBg;
        if (this.props.scroller?.trackWidth) style["--scrollTrackWidth"] = this.props.scroller?.trackWidth + "px";
        if (this.props.scroller?.trackBorderRadius) style["--scrollTrackBorderRadius"] = this.props.scroller?.trackBorderRadius + "px";
        if (this.props.scroller?.thumbBorderRadius) style["--scrollThumbBorderRadius"] = this.props.scroller?.thumbBorderRadius + "px";

        return React.createElement(component, {
            style,
            className,
            id: this.props.id,
            key: this.props.key,
            name: this.props.name,
        }, this.props.children);
    };

}

export const ScrollPanel = React.forwardRef<HTMLDivElement, Partial<ScrollPanelProps>>((props, ref) => (
    <ScrollPanelComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
