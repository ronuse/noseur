
import React from "react";
import { Classname } from "../utils/Classname";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurElement, NoseurObject, SortDirection } from "../constants/Types";
import { Paginator, PaginatorPageChangeOption, PaginatorProps, PaginatorTemplateOptions } from "../presentation/Paginator";

export type DataFixtureTemplateHandler = () => NoseurElement;
export type DataRowSelectionHandler = (value: any) => boolean;
export type DateSelectionElementTemplateHandler = (index: number) => NoseurElement;
export type DataComparatorHandler = (sortDirection: SortDirection, dataKey: string, p: NoseurObject<any>, c: NoseurObject<any>) => number;

export interface DataProps<T> extends ComponentBaseProps<T> {
    paginate: boolean;
    noDivider: boolean;
    scrollable: boolean;
    rowsPerPage: number;
    totalRecords: number;
    stripedRows: boolean;
    rowSelection: boolean;
    showGridlines: boolean;
    dataSelectionKey: string;
    data: NoseurObject<any>[];
    emptyState: NoseurElement;
    paginatorProps: PaginatorProps;
    allowNoDataPagination: boolean;
    paginatorTemplate: PaginatorTemplateOptions;

    header: DataFixtureTemplateHandler;
    footer: DataFixtureTemplateHandler;
    compareData: DataComparatorHandler;
    onRowSelection: DataRowSelectionHandler;
    onPageChange?: (event: PaginatorPageChangeOption) => void;
    selectionElementTemplate: DateSelectionElementTemplateHandler;
}

export interface DataState {
    dataOffset: number;
    currentPage: number;
    activeData: NoseurObject<any>[];
};

export class DataComponent<T, P extends DataProps<T>, S extends DataState> extends React.Component<P, S> {

    renderEmptyState() {
        if (this.props.data?.length) return null;
        return <div className="noseur-data-empty-state">{this.props.emptyState}</div>
    }

    renderFixtures(fixture: DataFixtureTemplateHandler, className: string) {
        if (!fixture) return null;
        return <div className={className}>{fixture()}</div>
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
