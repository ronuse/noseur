
import React from "react";
import { Button } from "../form/Button";
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { Alignment } from "../constants/Alignment";
import { ObjectHelper } from "../utils/ObjectHelper";
import { MicroBuilder } from "../utils/MicroBuilder";
import { NoseurElement, NoseurInputValue, NoseurLabel } from "../constants/Types";
import { ComponentBaseProps, ComponentElementBasicAttributes, TransitionProps } from "../core/ComponentBaseProps";

export interface TabPanelHeaderOptions {
    index: number;
    scheme: string;
    className: string;
    selected: boolean;
    idleScheme: string;
    props: TabPanelProps;
    onClick: (e: any) => void;
    titleElement: NoseurElement;
    removeElement: NoseurElement;
    leftIconElement: NoseurElement;
    rightIconElement: NoseurElement;
}

export type TabPanelHeaderTemplate = (options?: TabPanelHeaderOptions) => NoseurElement;

export type TabPanelAttributtesRelays = {
    header: ComponentElementBasicAttributes;
}

export interface TabPanelManageRef {

}

export interface TabPanelProps extends ComponentBaseProps<HTMLDivElement, TabPanelManageRef, TabPanelAttributtesRelays> {
    fill: boolean;
    idleScheme: Scheme;
    removable: boolean;
    header: NoseurLabel;
    leftIcon: NoseurElement;
    rightIcon: NoseurElement;
    removeIcon: NoseurElement;

    headerTemplate: TabPanelHeaderTemplate;
}

class TabPanelComponent extends React.Component<TabPanelProps> {

    public static defaultProps: Partial<TabPanelProps> = {
    };

    render() {
        const className = Classname.build("noseur-tabpanel", (this.props.scheme ? `${this.props.scheme}-vars` : null), this.props.className);

        return (<div className={className} ref={this.props.forwardRef} key={this.props.key} id={this.props.id} style={this.props.style}>
            {this.props.children}
        </div>);
    };

}

export type TabPaneEventHandler = (index: number) => boolean | void;
export type TabPaneChangeEventHandler = (state: "active" | "close", index: number) => void;

export type TabPaneAttributtesRelays = {
    content: ComponentElementBasicAttributes;
    navigator: {
        headers?: ComponentElementBasicAttributes;
        control?: {
            prev?: ComponentElementBasicAttributes;
            next?: ComponentElementBasicAttributes;
        }
    } & ComponentElementBasicAttributes;
}

export interface TabPaneManageRef {
    next: () => void;
    previous: () => void;
    readd: (index: number) => void;
    switch: (index: number) => void;
    remove: (index: number) => void;
}

export interface TabPaneProps extends ComponentBaseProps<HTMLDivElement, TabPaneManageRef, TabPaneAttributtesRelays>, TransitionProps {
    cyclic: boolean;
    activeIndex: number;
    scrollable: boolean;
    alignment: Alignment;
    renderActiveTabOnly: boolean;
    children: React.ReactElement<TabPanelProps> | React.ReactElement<TabPanelProps>[] | any;
    scrollIcons: { horizontal: { prev: NoseurElement, next: NoseurElement; }; vertical: { prev: NoseurElement, next: NoseurElement; } };

    onTabClose: TabPaneEventHandler;
    onTabActive: TabPaneEventHandler;
    onBeforeTabClose: TabPaneEventHandler;
    onBeforeTabActive: TabPaneEventHandler;
    onTabChange: TabPaneChangeEventHandler;
}

interface TabPaneState {
    activeIndex: number;
    childrenCount: number;
    removedIndexes: number[];
}

class TabPaneComponent extends React.Component<TabPaneProps, TabPaneState> {

    public static defaultProps: Partial<TabPaneProps> = {
        activeIndex: 0,
        alignment: Alignment.TOP_LEFT,
        scrollIcons: {
            vertical: {
                prev: "fa fa-angle-up",
                next: "fa fa-angle-down",
            },
            horizontal: {
                prev: "fa fa-angle-left",
                next: "fa fa-angle-right",
            }
        },
    };

    state: TabPaneState = {
        removedIndexes: [],
        activeIndex: this.props.activeIndex,
        childrenCount: (this.props.children as any)?.length ?? 0,
    };

    headersContainer: any;

    constructor(props: TabPaneProps) {
        super(props);

        this.onScroll = this.onScroll.bind(this);
        this.navigateTab = this.navigateTab.bind(this);
        this.onHeaderClick = this.onHeaderClick.bind(this);
        this.onRemoveHeader = this.onRemoveHeader.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            next: () => this.navigateTab("next"),
            previous: () => this.navigateTab("prev"),
            readd: (index: number) => this.onRemoveHeader(index, "readd"),
            remove: (index: number) => this.onRemoveHeader(index, "remove"),
            switch: (index: number) => this.onHeaderClick(null, undefined, index),
        });
    }

    navigateTab(direction: "next" | "prev") {
        let activeIndex = this.state.activeIndex;
        const removedIndexes = this.state.removedIndexes;
        const childrenCount = this.state.childrenCount;

        do {
            activeIndex += (direction === "next" ? 1 : -1);
        } while (removedIndexes.includes(activeIndex));
        if (direction === "next" && !(activeIndex < childrenCount)) return;
        else if (activeIndex < 0) return;
        this.setState({ activeIndex });
    }

    onHeaderClick(e: any, tab: React.ReactElement<TabPanelProps, string | React.JSXElementConstructor<any>> | undefined, index: number) {
        if (tab && tab.props.disabled) return;
        const activeIndex = this.state.activeIndex;
        const childrenCount = this.state.childrenCount;
        const removedIndexes = this.state.removedIndexes;

        tab && tab.props.onClick && tab.props.onClick(e);
        if (index < 0 || index >= childrenCount || activeIndex === index || removedIndexes.includes(index)) return;
        if (this.props.onBeforeTabClose && this.props.onBeforeTabClose(activeIndex) === false) return;
        if (this.props.onBeforeTabActive && this.props.onBeforeTabActive(index) === false) return;
        if (this.props.onTabChange) {
            this.props.onTabChange("close", activeIndex);
            this.props.onTabChange("active", index);
        }
        this.setState({
            activeIndex: index,
        }, () => {
            this.props.onTabClose && this.props.onTabClose(activeIndex);
            this.props.onTabActive && this.props.onTabActive(index);
        });
    }

    onRemoveHeader(index: number, op: "remove" | "readd") {
        const activeIndex = this.state.activeIndex;
        const childrenCount = this.state.childrenCount;
        const removedIndexes = this.state.removedIndexes;

        if (op === "readd") {
            if (!removedIndexes.includes(index)) return;
            removedIndexes.splice(removedIndexes.indexOf(index), 1);
        } else {
            removedIndexes.push(index);
        }
        this.setState({
            removedIndexes,
        }, () => {
            if (activeIndex !== index) return;
            for (let sindex = 0; sindex < childrenCount; sindex++) {
                if (!removedIndexes.includes(sindex)) {
                    this.onHeaderClick(null, undefined, sindex);
                    return;
                }
            }
        });
    }

    renderHeader(tab: React.ReactElement<TabPanelProps, string | React.JSXElementConstructor<any>>, index: number, selected: boolean, key: NoseurInputValue) {
        const hasTemplate = !!tab.props.headerTemplate;
        let scheme = (selected ? (tab.props.scheme ?? this.props.scheme) : tab.props.idleScheme) ?? Scheme.SECONDARY;
        if ((tab.props.scheme ?? this.props.scheme) === Scheme.SKELETON) scheme = Scheme.SKELETON;
        const className = Classname.build("noseur-tabpanel-header", {
            "noseur-active": selected,
            "noseur-flex-1": tab.props.fill,
        }, (scheme !== Scheme.SKELETON ? `${scheme}-vars` : scheme), tab.props.attrsRelay?.header?.className);
        const removeElement = (hasTemplate || tab.props.removable ? MicroBuilder.buildIcon(tab.props.removeIcon ?? "fa fa-times", {
            scheme,
            relativeAlignment: tab.props.rightIcon ? Alignment.RIGHT : Alignment.NONE
        }, { onClick: () => this.onRemoveHeader(index, "remove") }) : null);

        if (hasTemplate) {
            return tab.props.headerTemplate({
                index,
                scheme,
                selected,
                className,
                removeElement,
                props: tab.props,
                idleScheme: tab.props.idleScheme,
                onClick: (e: any) => this.onHeaderClick(e, tab, index),
                titleElement: MicroBuilder.buildLabel(tab.props.header, { scheme }),
                leftIconElement: MicroBuilder.buildIcon(tab.props.leftIcon, { scheme }),
                rightIconElement: MicroBuilder.buildIcon(tab.props.rightIcon, { scheme }),
            });
        }

        const rightIcon = !!removeElement ? (<div>
            {MicroBuilder.buildIcon(tab.props.rightIcon, { scheme })}
            {removeElement}
        </div>) : tab.props.rightIcon;
        return (<Button disabled={tab.props.disabled} key={key} scheme={scheme} className={className} id={tab.props.attrsRelay?.header?.id} style={tab.props.attrsRelay?.header?.style}
            leftIcon={tab.props.leftIcon} rightIcon={rightIcon} outlined textOnly onClick={(e: any) => this.onHeaderClick(e, tab, index)}>{tab.props.header}</Button>);
    }

    onScroll(orientation: "vertical" | "horizontal", direction: "left" | "right") {
        if (!this.headersContainer) return;
        const scrollSize = (direction === "right" ? 500 : -500);
        this.headersContainer[orientation === "horizontal" ? "scrollLeft" : "scrollBottom"] += scrollSize;
    }

    renderTabs() {
        const result: any = {
            headers: [],
            contents: [],
        };
        React.Children.forEach(this.props.children, (tab, index) => {
            if (tab.type !== TabPanel) {
                result.headers.push(tab);
                return;
            }
            if (this.state.removedIndexes.includes(index)) return;
            const key = tab.props.key ?? `${index}`;
            const isActiveTab = this.state.activeIndex === index;
            result.headers.push(this.renderHeader(tab, index, isActiveTab, key));
            if (this.props.renderActiveTabOnly && !isActiveTab) return;
            result.contents.push(isActiveTab ? tab : React.cloneElement(tab, { key, style: { display: "none" } }));
        });
        return result;
    }

    renderContentAndNavigator(orientation: "vertical" | "horizontal") {
        const { headers, contents } = this.renderTabs();
        const scheme = this.props.attrsRelay?.navigator?.scheme ?? this.props.scheme;
        const contentClassName = Classname.build("noseur-tabpane-content", this.props.attrsRelay?.content?.className);
        const scrollLeftElement = this.props.scrollable ? MicroBuilder.buildIcon(this.props.scrollIcons[orientation].prev, {
            id: this.props.attrsRelay?.navigator?.control?.prev?.id,
            style: this.props.attrsRelay?.navigator?.control?.prev?.style,
            scheme: this.props.attrsRelay?.navigator?.control?.prev?.scheme ?? scheme,
            className: Classname.build("noseur-tabpane-control noseur-tabpane-control-l", this.props.attrsRelay?.navigator?.control?.prev?.className)
        }, { onClick: () => this.onScroll(orientation, "left") }) : null;
        const scrollRightElement = this.props.scrollable ? MicroBuilder.buildIcon(this.props.scrollIcons[orientation].next, {
            id: this.props.attrsRelay?.navigator?.control?.next?.id,
            style: this.props.attrsRelay?.navigator?.control?.next?.style,
            scheme: this.props.attrsRelay?.navigator?.control?.next?.scheme ?? scheme,
            className: Classname.build("noseur-tabpane-control noseur-tabpane-control-r", this.props.attrsRelay?.navigator?.control?.next?.className)
        }, { onClick: () => this.onScroll(orientation, "right") }) : null;
        const className = Classname.build("noseur-tabpane-navigator", {
            "noseur-tabpane-navigator-top-left": this.props.alignment === Alignment.TOP_LEFT,
            "noseur-tabpane-navigator-top-right": this.props.alignment === Alignment.TOP_RIGHT,
            "noseur-tabpane-navigator-bottom-left": this.props.alignment === Alignment.BOTTOM_LEFT,
            "noseur-tabpane-navigator-bottom-right": this.props.alignment === Alignment.BOTTOM_RIGHT,
            "noseur-tabpane-navigator-left": BoolHelper.equalsAny(this.props.alignment, [Alignment.LEFT, Alignment.CENTER_LEFT]),
            "noseur-tabpane-navigator-right": BoolHelper.equalsAny(this.props.alignment, [Alignment.RIGHT, Alignment.CENTER_RIGHT]),
            "noseur-tabpane-navigator-bottom-center": BoolHelper.equalsAny(this.props.alignment, [Alignment.BOTTOM, Alignment.BOTTOM_CENTER]),
            "noseur-tabpane-navigator-top-center": BoolHelper.equalsAny(this.props.alignment, [Alignment.TOP, Alignment.CENTER, Alignment.TOP_CENTER]),
        }, this.props.attrsRelay?.navigator?.className);

        const content = (<div className={contentClassName} id={this.props.attrsRelay?.content?.id} style={this.props.attrsRelay?.content?.style}>
            {contents}
        </div>);
        const navigator = (<div className={className} id={this.props.attrsRelay?.navigator?.id} style={this.props.attrsRelay?.navigator?.style}>
            {scrollLeftElement}
            <div className={Classname.build("noseur-tabpane-headers", this.props.attrsRelay?.navigator?.headers?.className)} id={this.props.attrsRelay?.navigator?.headers?.id}
                style={this.props.attrsRelay?.navigator?.headers?.style} ref={(r: any) => {
                    this.headersContainer = r;
                }}>
                {headers}
            </div>
            {scrollRightElement}
        </div>);
        return {
            content,
            navigator
        };
    }

    render() {
        const isVertical = BoolHelper.equalsAny(this.props.alignment, [Alignment.LEFT, Alignment.RIGHT, Alignment.CENTER_LEFT, Alignment.CENTER_RIGHT]);
        const { content, navigator } = this.renderContentAndNavigator(isVertical ? "vertical" : "horizontal");
        const navigatorBelow = this.props.alignment === Alignment.RIGHT || this.props.alignment.startsWith(Alignment.BOTTOM);
        const className = Classname.build("noseur-tabpane",
            {
                "noseur-tabpane-row": isVertical,
                "noseur-tabpane-scrollable": this.props.scrollable,
            },
            (this.props.scheme && this.props.scheme !== Scheme.SKELETON ? `${this.props.scheme}-vars` : null), this.props.className);

        return (<div className={className} ref={this.props.forwardRef} id={this.props.id} style={this.props.style}>
            {navigatorBelow ? null : navigator}
            {content}
            {navigatorBelow ? navigator : null}
        </div>);
    };

}

export const TabPanel = React.forwardRef<HTMLDivElement, Partial<TabPanelProps>>((props, ref) => (
    <TabPanelComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

export const TabPane = React.forwardRef<HTMLDivElement, Partial<TabPaneProps>>((props, ref) => (
    <TabPaneComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
