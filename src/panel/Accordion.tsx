
import React from "react";
import { Panel, PanelProps } from "./Panel";
import { Classname } from "../utils/Classname";
import { ObjectHelper } from "../utils/ObjectHelper";
import { MicroBuilder } from "../utils/MicroBuilder";
import { ComponentBaseProps } from "../core/ComponentBaseProps";

export interface AccordionTabProps extends Partial<PanelProps> {
}

class AccordionTabComponent extends React.Component<AccordionTabProps> {

    public static defaultProps: Partial<AccordionTabProps> = {
        collapsibleIcons: {
            expand: "fa fa-angle-right",
            collapse: "fa fa-angle-down",
        },
    };

    render() {
        const className = Classname.build('noseur-accordion-tab', { "noseur-disabled": this.props.disabled }, this.props.className);
        const toggleElement = MicroBuilder.buildIcon((this.props.collapsed ? this.props.collapsibleIcons?.expand : this.props.collapsibleIcons?.collapse),
            { scheme: this.props.scheme, className: "noseur-accordion-tab-title-toggler" });
        const title = (<div className="noseur-accordion-tab-title">
            {toggleElement}
            {this.props.title}
        </div>);
        return (<Panel {...this.props} className={className} title={title} ref={this.props.forwardRef} />);
    };

}

export type AccordionEventHandler = (index: number) => void;
export type AccordionChangeEventHandler = (opened: number[], closed: number[]) => void;

export interface AccordionManageRef {
    expandAll: () => void;
    collapseAll: () => void;
    expand: (indexes: number[]) => void;
    collapse: (indexes: number[]) => void;
}

export interface AccordionProps extends ComponentBaseProps<HTMLDivElement, AccordionManageRef> {
    outlined: boolean;
    multiple: boolean;
    seperated: boolean;
    borderless: boolean;
    activeIndexes: number[];
    children: React.ReactElement<AccordionTabProps> | React.ReactElement<AccordionTabProps>[];

    onTabExpand: AccordionEventHandler;
    onTabCollapse: AccordionEventHandler;
    onTabChange: AccordionChangeEventHandler;
}

interface AccordionState {
    childrenCount: number;
    activeIndexes: number[];
}

class AccordionComponent extends React.Component<AccordionProps, AccordionState> {

    public static defaultProps: Partial<AccordionProps> = {
        activeIndexes: [],
    };

    state: AccordionState = {
        activeIndexes: this.props.activeIndexes ?? [],
        childrenCount: (this.props.children as any)?.length ?? 0,
    };

    constructor(props: AccordionProps) {
        super(props);

        this.expandCollapse = this.expandCollapse.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            expandAll: () => this.expandCollapse("expand"),
            collapseAll: () => this.expandCollapse("collapse"),
            expand: (indexes: number[]) => this.expandCollapse("expand", indexes),
            collapse: (indexes: number[]) => this.expandCollapse("collapse", indexes),
        });
    }

    componentDidUpdate(_: Readonly<AccordionProps>, prevState: Readonly<AccordionState>): void {
        const activeIndexes = this.state.activeIndexes;
        const previousIndexes = prevState.activeIndexes;
        const opened = activeIndexes.filter((i) => !previousIndexes.includes(i));
        const closed = previousIndexes.filter((i) => !activeIndexes.includes(i));

        this.props.onTabChange && this.props.onTabChange(opened, closed);
        if (this.props.onTabCollapse && closed.length) this.props.onTabCollapse(closed[0]);
        if (this.props.onTabExpand && opened.length) this.props.onTabExpand(opened[0]);
    }

    expandCollapse(type: "expand" | "collapse", indexes?: number[]) {
        if (this.props.disabled) return;
        let activeIndexes = ObjectHelper.clone(this.state.activeIndexes);
        if (!indexes) {
            activeIndexes = (type === "expand") ? [...Array(this.state.childrenCount).keys()] : [];
        } else {
            if (!indexes.length) return;
            if (!this.props.multiple) {
                if (type === "expand") activeIndexes = [];
                indexes = [indexes[0]];
            }
        }
        if (indexes) indexes.forEach(index => {
            const indexOfIndexLol = activeIndexes.indexOf(index);
            if (type === "expand" && indexOfIndexLol === -1) activeIndexes.push(index);
            if (type === "collapse" && indexOfIndexLol > -1) activeIndexes.splice(indexOfIndexLol, 1);
        });
        this.setState({ activeIndexes });
    }

    renderAccordionTab(panel: any, index: number) {
        let activeIndexes = ObjectHelper.clone(this.state.activeIndexes);
        const props: AccordionTabProps = ObjectHelper.clone(panel.props);

        const cachedOnHeaderClicked = props.onHeaderClick;
        props.key = props.key ?? index;
        props.collapsed = !activeIndexes.includes(index);
        props.active = !props.collapsed;
        props.scheme = props.scheme ?? this.props.scheme;
        props.outlined = props.outlined ?? this.props.outlined;
        props.disabled = props.disabled ?? this.props.disabled;
        props.onHeaderClick = () => {
            if (cachedOnHeaderClicked) cachedOnHeaderClicked();
            if (props.collapsed) {
                if (this.props.multiple) activeIndexes.push(index);
                else activeIndexes = [index];
            } else {
                activeIndexes.splice(activeIndexes.indexOf(index), 1);
            }
            this.setState({
                activeIndexes
            });
        }
        return React.cloneElement(panel, props);
    }

    renderAccordionTabs() {
        return React.Children.map(this.props.children, (panel, index) => {
            if (panel.type !== AccordionTab) {
                throw new Error("noseur.Accordion: Invalid child of Accordion component expecting AccordionTab only, found '" + panel.type + "'");
            }
            return this.renderAccordionTab(panel, index);
        });
    }

    render() {
        const panels = this.renderAccordionTabs();
        const className = Classname.build("noseur-accordion", {
            "noseur-accordion-seperated": this.props.seperated,
            "noseur-accordion-bordered": !this.props.borderless && !this.props.seperated
        }, (this.props.scheme ? `${this.props.scheme}-vars` : null),
            (this.props.scheme && this.props.outlined ? `${this.props.scheme}-vars-outlined` : null), this.props.className);

        return (<div className={className} ref={this.props.forwardRef} id={this.props.id} style={this.props.style}>
            {panels}
        </div>);
    };

}

export const AccordionTab = React.forwardRef<HTMLDivElement, Partial<AccordionTabProps>>((props, ref) => (
    <AccordionTabComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));

export const Accordion = React.forwardRef<HTMLDivElement, Partial<AccordionProps>>((props, ref) => (
    <AccordionComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
