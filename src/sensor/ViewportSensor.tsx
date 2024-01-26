
import React from "react";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Orientation } from "../constants/Orientation";
import { DOMHelper, ScrollHandler } from "../utils/DOMUtils";
import { ComponentBaseProps } from "../core/ComponentBaseProps";

export type ViewportSensorEventHandler = (viewportSensorManageRef?: ViewportSensorManageRef) => boolean;

export interface ViewportSensorManageRef {
    mountChildren: () => void;
    unmountChildren: () => void;
    reportOnExitViewport: () => void;
    reportOnEnterViewport: () => void;
}

export interface ViewportSensorProps extends ComponentBaseProps<HTMLDivElement, ViewportSensorManageRef> {
    orientation: Orientation;
    preRenderChildren: boolean;
    scrollContainerRef: React.MutableRefObject<any>;

    onExitViewport: ViewportSensorEventHandler;
    onEnterViewport: ViewportSensorEventHandler;
}

interface ViewportSensorState {
    inViewport: boolean;
    renderChildren: boolean;
}

class ViewportSensorComponent extends React.Component<ViewportSensorProps, ViewportSensorState> {

    public static defaultProps: Partial<ViewportSensorProps> = {
        orientation: Orientation.HORIZONTAL_VERTICAL
    };

    state: ViewportSensorState = {
        inViewport: false,
        renderChildren: false,
    };

    container?: HTMLDivElement;
    documentScrollHandler?: any;
    internalManageRefCache?: ViewportSensorManageRef;

    constructor(props: ViewportSensorProps) {
        super(props);
    }

    componentDidMount() {
        this.internalManageRefCache = {
            mountChildren: () => this.setState({ renderChildren: true }),
            unmountChildren: () => this.setState({ renderChildren: false }),
            reportOnExitViewport: () => this.setState({
                renderChildren: (this.props.onExitViewport ? this.props.onExitViewport(this.internalManageRefCache) : true)
            }),
            reportOnEnterViewport: () => this.setState({
                renderChildren: (this.props.onEnterViewport ? this.props.onEnterViewport(this.internalManageRefCache) : true)
            }),
        };
        ObjectHelper.resolveManageRef(this, this.internalManageRefCache);
        if (this.documentScrollHandler) return;
        let scrollContainer: any;
        if (this.props.scrollContainerRef && this.props.scrollContainerRef.current) {
            scrollContainer = this.props.scrollContainerRef.current;
        }
        if (this.container) {
            const inViewport = this.props.preRenderChildren || DOMHelper.inViewport(this.container, ScrollHandler.getScrollableParents(this.container, true)[0], this.props.orientation);
            inViewport && this.setState({
                inViewport: true,
                renderChildren: (this.props.onEnterViewport ? this.props.onEnterViewport(this.internalManageRefCache) : true)
            });
        }
        this.documentScrollHandler = ScrollHandler.handle((scrollContainer ? [scrollContainer] : this.container as Node), (event: any) => {
            if (!this.container) return;
            const inViewport = DOMHelper.inViewport(this.container, DOMHelper.getTarget(event), this.props.orientation);
            if (inViewport) {
                (!this.state.inViewport) && this.setState({
                    inViewport: true,
                    renderChildren: (this.props.onEnterViewport ? this.props.onEnterViewport(this.internalManageRefCache) : true)
                });
            } else if (this.state.inViewport) {
                this.setState({
                    inViewport: false,
                    renderChildren: (this.props.onExitViewport ? this.props.onExitViewport(this.internalManageRefCache) : true)
                });
            }

        }, true);
        this.documentScrollHandler.attach();
    }

    componentWillUnmount() {
        this.documentScrollHandler && this.documentScrollHandler.detach();
        ObjectHelper.resolveManageRef(this, null);
        this.documentScrollHandler = undefined;
    }

    render() {
        const ref = (r: any) => {
            if (!!this.container && !r) this.componentWillUnmount();
            this.container = r;
            ObjectHelper.resolveRef(this.props.forwardRef, r);
        };
        return (<div ref={ref} key={this.props.key} id={this.props.id} className={this.props.className} style={this.props.style}>
            {this.state.renderChildren ? this.props.children : null}
        </div>);
    }

}

export const ViewportSensor = React.forwardRef<HTMLDivElement, Partial<ViewportSensorProps>>((props, ref) => (
    <ViewportSensorComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));


