
import React from "react";
import { ComponentBaseProps } from "./core/ComponentBaseProps";

export interface TemplateManageRef {

}

export interface TemplateProps extends ComponentBaseProps<HTMLDivElement, TemplateManageRef> {

}

interface TemplateState {

}

class TemplateComponent extends React.Component<TemplateProps, TemplateState> {

    public static defaultProps: Partial<TemplateProps> = {
    };

    state: TemplateState = {
    };

    constructor(props: TemplateProps) {
        super(props);
    }

    render() {
        return (<div>
            Template
        </div>);
    };

}

export const Template = React.forwardRef<HTMLDivElement, Partial<TemplateProps>>((props, ref) => (
    <TemplateComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLDivElement>} />
));
