
import "./Data.css";
import React from 'react';
import { RowControlOptions } from "./Data";
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { TypeChecker } from "../utils/TypeChecker";
import { MicroBuilder } from "../utils/MicroBuilder";
import { ObjectHelper } from "../utils/ObjectHelper";
import { NoseurElement, NoseurObject, SortDirection, SortIcons } from '../constants/Types';
import { ComponentBaseProps, extractMicroComponentBaseProps } from '../core/ComponentBaseProps';

export type ColumnTemplateHandler = () => NoseurElement;
export type ColumnOnSortHandler = (sortDirection: SortDirection) => void;
export type ValuedColumnTemplateHandler = (value: any, rowControlOptions?: RowControlOptions) => NoseurElement;

export interface ColumnManageRef {
    unSort: () => void;
}

export interface ColumnProps extends ComponentBaseProps<HTMLTableColElement, ColumnManageRef> {
    value: any;
    group: string;
    element: string;
    dataKey: string;
    sortable: boolean;
    canUnsort: boolean;
    sortIcons: SortIcons;
    valueClassName: string;
    rowControlOptions: RowControlOptions;
    valuedProps: NoseurObject<Partial<ComponentBaseProps<any>> | ((value: any) => Partial<ComponentBaseProps<any>>)>;

    onSort: ColumnOnSortHandler | undefined;
    header: NoseurElement | ColumnTemplateHandler;
    footer: NoseurElement | ColumnTemplateHandler;
    content: NoseurElement | ColumnTemplateHandler;
    template: ValuedColumnTemplateHandler | undefined;
}

interface ColumnState {
    sortDirection: SortDirection;
};

export class ColumnComponent extends React.Component<ColumnProps, ColumnState> {

    public static defaultProps: Partial<ColumnProps> = {
        element: "td",
        valuedProps: {},
        group: "column-body",
        scheme: Scheme.STATELESS,
        valueClassName: "noseur-column-body",
    };

    state: ColumnState = {
        sortDirection: SortDirection.NONE,
    };

    constructor(props: ColumnProps) {
        super(props);

        this.unSort = this.unSort.bind(this);
        this.onClick = this.onClick.bind(this);
    }

	componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            unSort: this.unSort,
        });
	}

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
    }

    unSort() {
        this.setState({ sortDirection: SortDirection.NONE });
    }

    onClick(_: any) {
        let sortDirection = this.state.sortDirection;
        if (sortDirection == SortDirection.NONE) {
            sortDirection = SortDirection.FORWARD;
        } else if (sortDirection == SortDirection.FORWARD) {
            sortDirection = SortDirection.BACKWARD;
        } else if (sortDirection == SortDirection.BACKWARD) {
            sortDirection = (this.props.canUnsort ? SortDirection.NONE : SortDirection.FORWARD);
        }
        this.setState({ sortDirection: sortDirection });
        if (this.props.onSort) this.props.onSort(sortDirection);
    }

    renderSortIcon() {
        if (!this.props.sortable || !this.props.sortIcons) return null;
        const sortDirection = this.state.sortDirection;
        let sortIcon = this.props.sortIcons.unsorted;
        if (sortDirection == SortDirection.FORWARD) sortIcon = this.props.sortIcons.asc;
        else if (sortDirection == SortDirection.BACKWARD) sortIcon = this.props.sortIcons.desc;

        return MicroBuilder.buildIcon(sortIcon, { className: "noseur-column-sort-icon" });
    }

    render() {
        let value = this.props.value;
        if (this.props.template) value = this.props.template(value, this.props.rowControlOptions);
        else if (TypeChecker.isDict(value) && this.props.element != "th") value = "";

        const sortIcon = this.renderSortIcon();
        let valuedRowProps = this.props.valuedProps[`${value}`] ?? {};
        const props = extractMicroComponentBaseProps(this.props) as NoseurObject<any>;
        const cachedOnClick = props.onClick;
        props.className = Classname.build(props.className, {
            "noseur-column-sort": this.props.sortable
        }, (this.props.scheme ? `${this.props.scheme}-bd-3px-bx-sw-ac ${this.props.scheme}-bd-3px-bx-sw-fc` : null));
        if (this.props.sortable) {
            props.tabIndex = 0;
            props.onClick = (e: any) => {
                this.onClick(e);
                if (cachedOnClick) cachedOnClick(e);
            };
        }
        if (valuedRowProps instanceof Function) valuedRowProps = valuedRowProps(value);

        return React.createElement(this.props.element, {
            ...props,
            ...valuedRowProps,
            role: "row",
            "data-n-group": this.props.group,
        }, (<div className={Classname.build("noseur-column", this.props.valueClassName)}>
            {value}
            {sortIcon}
        </div>));
    }

}

export const Column = React.forwardRef<HTMLTableColElement, Partial<ColumnProps>>((props, _) => (
    <ColumnComponent {...props} />
));
