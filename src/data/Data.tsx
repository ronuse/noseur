
import React from "react";
import { Classname } from "../utils/Classname";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurElement, NoseurObject, SortDirection } from "../constants/Types";
import { Paginator, PaginatorPageChangeOption, PaginatorProps, PaginatorTemplateOptions } from "../presentation/Paginator";

export interface RowProps {
    id?: string;
    key?: string;
    className?: string;
    style?: React.CSSProperties;
}

export type DataFixtureTemplateHandler = () => NoseurElement;
export type DataRowSelectionHandler = (value: any) => boolean;
export type DataRowValuedPropsHandler = (data?: any) => RowProps;
export type DateSelectionElementTemplateHandler = (index: number) => NoseurElement;
export type DataComparatorHandler = (sortDirection: SortDirection, dataKey: string, p: any, c: any) => number;

export interface DataManageRef {
    setData: (data?: NoseurObject<any>[]) => void;
    setLoadingState: (isLoading: boolean) => void;
}

export interface DataInternalElementProps {
    id?: string;
    key?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface DataProps<T> extends ComponentBaseProps<T, DataManageRef> {
    paginate: boolean;
    rowProps: RowProps;
    noDivider: boolean;
    scrollable: boolean;
    rowsPerPage: number;
    totalRecords: number;
    stripedRows: boolean;
    rowSelection: boolean;
    showGridlines: boolean;
    dataRefreshKeys: any[];
    dataSelectionKey: string;
    emptyState: NoseurElement;
    data?: NoseurObject<any>[];
    loadingState: NoseurElement;
    paginatorProps: PaginatorProps;
    allowNoDataPagination: boolean;
    paginatorTemplate: PaginatorTemplateOptions;
    internalElementProps: Partial<DataInternalElementProps>;

    header: DataFixtureTemplateHandler;
    footer: DataFixtureTemplateHandler;
    compareData: DataComparatorHandler;
    onRowSelection: DataRowSelectionHandler;
    valuedRowProps: DataRowValuedPropsHandler;
    onPageChange?: (event: PaginatorPageChangeOption) => void;
    selectionElementTemplate: DateSelectionElementTemplateHandler;
}

export interface DataState {
    isLoading?: boolean;
    dataOffset: number;
    currentPage: number;
    activeData?: NoseurObject<any>[];
};

export class DataComponent<T, P extends DataProps<T>, S extends DataState> extends React.Component<P, S> {

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            setLoadingState: (isLoading: boolean) => this.setState({ isLoading }),
            setData: (data?: NoseurObject<any>[]) => this.setState({ activeData: data }),
        });
    }

    componentWillUnmount() {
        ObjectHelper.resolveManageRef(this, null);
    }

    renderEmptyState() {
        if (this.state.activeData?.length !== 0) return null;
        return <div className="noseur-data-empty-state">{this.props.emptyState}</div>
    }

    renderLoadingState() {
        if (!!this.state.activeData && !this.state.isLoading) return null;
        return <div className="noseur-data-loading-state">{this.props.loadingState}</div>
    }

    renderFixtures(fixture: DataFixtureTemplateHandler, className: string) {
        if (!fixture) return null;
        return <div className={className}>{fixture()}</div>
    }

    buildRowProps(data?: any) {
        const valuedRowProps = this.props.valuedRowProps ? this.props.valuedRowProps(data) : {};
        return ObjectHelper.merge(this.props.rowProps, valuedRowProps);
    }

    onPageChange(event: PaginatorPageChangeOption) {
        this.setState({
            currentPage: event.currentPage,
            dataOffset: (event.currentPage - 1) * this.props.rowsPerPage
        });
    }

    renderPaginator(hasFooter: boolean) {
        if (!this.props.paginate) return null;
        const props: PaginatorProps = {
            ...(this.props.paginatorProps || {}),
            rowsPerPage: this.props.rowsPerPage,
            template: this.props.paginatorTemplate,
            scheme: this.props.paginatorProps?.scheme || this.props.scheme,
            totalRecords: this.props.totalRecords || this.props.data?.length,
        };
        const cachedOnPageChange = props.onPageChange;
        props.onPageChange = (event: PaginatorPageChangeOption) => {
            this.onPageChange(event);
            if (cachedOnPageChange) cachedOnPageChange(event);
            if (this.props.onPageChange) this.props.onPageChange(event);
        };
        const className = Classname.build(props.className, {
            "noseur-data-grid-f": !hasFooter && this.props.showGridlines,
            "noseur-no-bd-t": !hasFooter && this.props.data?.length && this.props.showGridlines,
        });

        return (<Paginator {...props} className={className} />);
    }

}
