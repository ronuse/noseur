
import "./Panel.css";
import React from "react";
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { MicroBuilder } from "../utils/MicroBuilder";
import { Transition } from "../constants/Transition";
import { ObjectHelper } from "../utils/ObjectHelper";
import { CSSTransition } from 'react-transition-group';
import { NoseurElement, NoseurLabel } from "../constants/Types";
import { ComponentBaseProps, ComponentElementBasicAttributes, TransitionProps } from "../core/ComponentBaseProps";

export interface PanelFixtureOptions {
    className: string;
    props: PanelProps;
    collapsed: boolean;
    titleElement: NoseurElement;
    toggleElement: NoseurElement;
    onClick: PanelFixtureEventHandler;
    onToggle: (collapsed?: boolean) => void;
    attrRelays: ComponentElementBasicAttributes;
}

export type PanelFixtureTemplate = (options?: PanelFixtureOptions) => NoseurElement;
export type PanelFixtureEventHandler = (manageRef?: PanelManageRef) => boolean | void | undefined;

export type PannelAttributtesRelays = {
    header?: ComponentElementBasicAttributes;
    footer?: ComponentElementBasicAttributes;
    content?: ComponentElementBasicAttributes & Partial<TransitionProps>;
}

export interface PanelManageRef {
    expand: () => void;
    collapse: () => void;
    toggle: (collapsed?: boolean) => void;
}

export interface PanelProps extends ComponentBaseProps<HTMLDivElement, PanelManageRef, PannelAttributtesRelays> {
    active: boolean;
    outlined: boolean;
    title: NoseurLabel;
    collapsed: boolean;
    borderless: boolean;
    collapsible: boolean;
    collapsibleIcons: { expand: NoseurElement, collapse: NoseurElement };

    header: PanelFixtureTemplate;
    footer: PanelFixtureTemplate;
    onHeaderClick: PanelFixtureEventHandler;
    onFooterClick: PanelFixtureEventHandler;
}

interface PanelState {
    collapsed: boolean;
}

class PanelComponent extends React.Component<PanelProps, PanelState> {

    public static defaultProps: Partial<PanelProps> = {
        collapsibleIcons: {
            expand: "fa fa-plus",
            collapse: "fa fa-minus",
        },
        attrsRelay: {
            content: {
                transition: Transition.CURTAIN
            }
        }
    };

    state: PanelState = {
        collapsed: this.props.collapsed,
    };

    manageRef?: PanelManageRef;

    constructor(props: PanelProps) {
        super(props);

        this.onToggle = this.onToggle.bind(this);
        this.isCollapsed = this.isCollapsed.bind(this);
    }

    componentDidMount() {
        this.manageRef = {
            toggle: this.onToggle,
            expand: () => this.onToggle(false),
            collapse: () => this.onToggle(true),
        };
        ObjectHelper.resolveManageRef(this, this.manageRef);
    }

    componentDidUpdate(prevProps: Readonly<PanelProps>, _: Readonly<PanelState>): void {
        if (prevProps.collapsed !== this.props.collapsed) {
            this.setState({ collapsed: this.props.collapsed });
        }
    }

    componentWillUnmount() {
        if (!this.manageRef) return;
        this.manageRef = undefined;
    }

    onToggle(collapsed?: boolean) {
        collapsed = collapsed ?? !this.state.collapsed;
        this.setState({ collapsed })
    }

    isCollapsed() {
        return this.state.collapsed;
    }

    renderFixture(type: string, collapsed: boolean, fixtureTemplate: PanelFixtureTemplate) {
        if (!fixtureTemplate && ((type === "header" && !(this.props.title || this.props.collapsible)) || type === "footer")) return null;

        const buildFixtureComponents = !!fixtureTemplate || type === "header";
        const onClick = type === "header" ? this.props.onHeaderClick : this.props.onFooterClick;
        const attrRelays: ComponentElementBasicAttributes = (this.props.attrsRelay && type in this.props.attrsRelay) ? (this.props.attrsRelay as any)[type] : null;
        const scheme = attrRelays?.scheme ?? this.props.scheme;
        const titleElement = buildFixtureComponents ? MicroBuilder.buildLabel(this.props.title) : null;
        const toggleElement = buildFixtureComponents ? MicroBuilder.buildIcon((collapsed ? this.props.collapsibleIcons.expand : this.props.collapsibleIcons.collapse),
            { scheme, className: "noseur-cursor-pointer" }, { onClick: () => this.onToggle() }) : null;
        const className = Classname.build(`noseur-panel-${type}`, {
            'active': this.props.active,
            'noseur-skeleton': scheme === Scheme.SKELETON,
            'noseur-panel-header-only': type === "header" && collapsed && !this.props.footer,
            'noseur-panel-footer-only': type === "footer" && collapsed && !this.props.header,
            'noseur-panel-footer-bordered': type === "footer" && !this.props.borderless && !collapsed,
            'noseur-panel-header-bordered': type === "header" && !this.props.borderless && (!collapsed || (collapsed && this.props.footer)),
        }, attrRelays?.className);

        if (fixtureTemplate) return fixtureTemplate({
            onClick,
            className,
            collapsed,
            attrRelays,
            titleElement,
            toggleElement,
            props: this.props,
            onToggle: this.onToggle,
        });

        return (<div key={`noseur-panel-${type}`} className={className} style={attrRelays?.style} id={attrRelays?.id} onClick={onClick ? () => {
            const result = onClick(this.manageRef);
            if (result === true || result === false) this.onToggle(result);
        } : undefined}>
            {titleElement}
            {this.props.collapsible ? toggleElement : null}
        </div>);
    }

    renderContent(collapsed: boolean) {
        const attrRelays = this.props.attrsRelay?.content;
        const transitionTimeout = attrRelays?.transitionTimeout ?? 500;
        const className = Classname.build("noseur-panel-content", attrRelays?.className);
        const children = !this.props.children || this.props.scheme != Scheme.SKELETON ? this.props.children : React.Children.map(this.props.children, (child: any) => {
            if (!React.isValidElement(child) || child === null || child === undefined) return child;
            const childProps = ObjectHelper.clone(child.props as any);
            const isPanelComponent = BoolHelper.equalsAny(child.type, [Panel/*, TabPane, Checkbox*/]);
            childProps.scheme = Scheme.SKELETON;
            childProps.className = Classname.build(childProps.className, !isPanelComponent ? "noseur-skeleton" : null);
            return React.cloneElement(child, childProps);
        });

        return (<CSSTransition classNames={attrRelays?.transition} timeout={transitionTimeout} options={attrRelays?.transitionOptions} in={!collapsed} unmountOnExit>
            <div className={className} id={attrRelays?.id} style={attrRelays?.style}>{children}</div>
        </CSSTransition>);
    }

    render() {
        const collapsed = this.isCollapsed();
        const content = this.renderContent(collapsed);
        const className = Classname.build("noseur-panel",
            {
                "noseur-panel-bordered": !this.props.borderless
            }, (this.props.scheme && this.props.outlined ? `${this.props.scheme}-vars-outlined` : null), 
            (this.props.scheme ? `${this.props.scheme}-vars` : null), this.props.className);
        const header = this.renderFixture("header", collapsed, this.props.header);
        const footer = this.renderFixture("footer", collapsed, this.props.footer);

        return (<div className={className} ref={this.props.forwardRef} id={this.props.id} style={this.props.style}>
            {header}
            {content}
            {footer}
        </div>);
    };

}

export const Panel = React.forwardRef<HTMLDivElement, Partial<PanelProps>>((props, ref) => (
    <PanelComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
