
import "./Overlay.css";
import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurElement, NoseurRawElement } from '../constants/Types';

export type PortalContainerEvent = () => NoseurRawElement;

export interface PortalProps extends ComponentBaseProps<HTMLElement> {
    visible: boolean;
    children: NoseurElement;
    container: PortalContainerEvent | NoseurRawElement;
}

interface PortalState {
    renderChild: boolean;
}

class PortalComponent extends React.Component<PortalProps, PortalState> {

    public static defaultProps: Partial<PortalProps> = {
        visible: false
    };

    state: PortalState = {
        renderChild: false
    };

    constructor(props: PortalProps) {
        super(props);
    }

	isDOMReady() {
		return (typeof window !== 'undefined' && window.document && window.document.createElement);
	}

	componentDidMount() {
		if (this.isDOMReady() && this.props.visible && !this.state.renderChild) {
			this.setState({ renderChild: true });
		}
	}

    render() {
		if (!(this.props.children && this.state.renderChild)) return null;

        const container = this.props.container ? ((this.props.container instanceof Function) ? this.props.container() : this.props.container) : document.body;
        return ReactDOM.createPortal(this.props.children, container);
	}

}

export const Portal = React.forwardRef<HTMLElement, Partial<PortalProps>>((props, ref) => (
    <PortalComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLElement>} />
));
