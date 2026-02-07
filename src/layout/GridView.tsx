
import "./Layout.css";
import React from "react";
import { Classname } from "../utils/Classname";
import { ComponentBaseProps, ComponentElementBasicAttributes } from "../core/ComponentBaseProps";

export type GridViewAttributesRelays = {
    map?: {
        size: number;
    } & ComponentElementBasicAttributes;
}

export interface GridViewManageRef {

}

export interface GridViewProps extends ComponentBaseProps<HTMLDivElement, GridViewManageRef, GridViewAttributesRelays> {
    row: number;
    column: number;
    gap: number | { row: number; column: number; };
    columnSize: number | { width: number; height: number; };
}

interface GridViewState {
    column: number;
}

class GridViewComponent extends React.Component<GridViewProps, GridViewState> {

    public static defaultProps: Partial<GridViewProps> = {
        gap: 0,
        row: 5,
        column: 5,
        columnSize: 25,
    };

    state: GridViewState = {
        column: this.props.column,
    };

    constructor(props: GridViewProps) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<GridViewProps>, _: Readonly<GridViewState>) {
        console.log("THE.----", prevProps, this.state.column);
    }

    render() {
        const width = (typeof this.props.columnSize === "number" ? this.props.columnSize : this.props.columnSize.width);
        const className = Classname.build("noseur-gridview", this.props.className);
        const style: React.CSSProperties = {
            ...(this.props.style ?? {}),
            gridTemplateColumns: Array(this.state.column).fill(`${width}px`).join(" "),
            columnGap: (typeof this.props.gap !== "number" ? this.props.gap?.column : undefined),
            rowGap: (typeof this.props.gap !== "number" ? this.props.gap?.row : undefined),
            gap: (typeof this.props.gap === "number" ? this.props.gap : undefined),
        };
        
        return (<div className={className} style={style} id={this.props.id} key={this.props.key}>
            {this.props.children}
        </div>);
    };

}

export const GridView  = ({ ref, ...props }: Partial<GridViewProps>) => (
    <GridViewComponent {...props} forwardRef={ref} />
);
