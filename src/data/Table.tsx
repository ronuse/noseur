
import "./Data.css";
import React from 'react';
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { ColumnProps, ColumnComponent } from "./Column";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurElement, NoseurObject, SortDirection, SortIcons, SortMode } from '../constants/Types';
import { Paginator, PaginatorPageChangeOption, PaginatorProps, PaginatorTemplateOptions } from "../presentation/Paginator";

export enum SelectionMode {
    NONE,
    SINGLE,
    MULTIPLE
}

export type TableTemplateHandler = () => NoseurElement;
export type TableRowSelectionHandler = (value: any) => boolean;
export type TableSelectionEventHandler = (value: any) => NoseurElement;
export type TableColumnTemplateHandler = (value: any) => NoseurElement;
export type TableSelectionElementtemplateHandler = (index: number) => NoseurElement;
export type TableDataComparatorHandler = (sortDirection: SortDirection, dataKey: string, p: NoseurObject<any>, c: NoseurObject<any>) => number;

export interface RowProps {
    id?: string;
    key?: string;
    clasName?: string;
    style?: NoseurObject<any>;
    otherProps?: NoseurObject<any>;
}

export interface TableProps extends ComponentBaseProps<HTMLTableElement> {
    sortField: string;
    paginate: boolean;
    sortMode: SortMode;
    rowProps: RowProps;
    scrollable: boolean;
    rowsPerPage: number;
    sortIcons: SortIcons;
    totalRecords: number;
    stripedRows: boolean;
    hideHeaders: boolean;
    rowSelection: boolean;
    cellSelection: boolean;
    showGridlines: boolean;
    canDisableSort: boolean;
    dataSelectionKey: string;
    data: NoseurObject<any>[];
    emptyState: NoseurElement;
    selectionMode: SelectionMode;
    sortOrder: null | 0 | 1 | -1;
    paginatorProps: PaginatorProps;
    allowNoDataPagination: boolean;
    paginatorTemplate: PaginatorTemplateOptions;
    children: React.ReactElement<ColumnProps>[];

    header: TableTemplateHandler;
    footer: TableTemplateHandler;
    compareData: TableDataComparatorHandler;
    onSelection: TableSelectionEventHandler;
    isRowSelectable: TableRowSelectionHandler;
    onPageChange?: (event: PaginatorPageChangeOption) => void;
    selectionElementTemplate: TableSelectionElementtemplateHandler;
};

interface TableState {
    dataOffset: number;
    currentPage: number;
    lastSortColumn?: string;
    activeData: NoseurObject<any>[];
};

class TableComponent extends React.Component<TableProps, TableState> {

    public static defaultProps: Partial<TableProps> = {
        data: [],
        paginate: false,
        rowsPerPage: 10,
        sortMode: SortMode.SINGLE,
        sortIcons: {
            asc: "fa fa-sort-asc",
            unsorted: "fa fa-sort",
            desc: "fa fa-sort-desc",
        },
    };

    state: TableState = {
        dataOffset: 0,
        currentPage: 1,
        activeData: this.props.data,
    };

    constructor(props: TableProps) {
        super(props);

        this.onSort = this.onSort.bind(this);
    }

    onSort(sortDirection: SortDirection, dataKey: string) {
        if (!dataKey) return;
        let data = ((this.props.sortMode == SortMode.MULTIPLE || this.state.lastSortColumn == dataKey) ? this.state.activeData : this.props.data).map(a => {return {...a}});
        if (sortDirection == SortDirection.NONE) {
            this.setState({ activeData: (this.props.sortMode == SortMode.MULTIPLE ? data : this.props.data).map((v: NoseurObject<any>, index: number) => {
                v[dataKey] = this.props.data[index][dataKey];
                return v;
            }), lastSortColumn: dataKey });
            return;
        }
        data.sort((p: NoseurObject<any>, c: NoseurObject<any>) => {
            const prev = p[dataKey], current = c[dataKey];
            if (this.props.compareData) return this.props.compareData(sortDirection, dataKey, prev, current);
            const comp = BoolHelper.compare(prev, current);
            if (comp == 1 && sortDirection == SortDirection.BACKWARD) return -1;
            return comp;
        });
        this.setState({ activeData: data, lastSortColumn: dataKey });
    }

    onPageChange(event: PaginatorPageChangeOption) {
        this.setState({
            currentPage: event.currentPage,
            dataOffset: (event.currentPage - 1) * this.props.rowsPerPage
        });
    }

    renderTableBody() {
        let data = this.state.activeData.slice(this.state.dataOffset, (this.props.rowsPerPage + this.state.dataOffset));
        if (!data.length && !this.props.allowNoDataPagination) data = this.state.activeData;

        const rows = data.map((data: NoseurObject<any>, index: number) => {
            const columns = this.props.children.map((child: React.ReactElement<ColumnProps>, sindex: number) => {
                return React.createElement(ColumnComponent, {
                    ...(child.props),
                    key: (child.props.key || sindex),
                    value: (child.props.dataKey ? data[child.props.dataKey] : data),
                });
            });
            return (<tr key={index} role="row" data-n-group="body-row">{columns}</tr>);
        });

        return (<tbody key="body" className="noseur-tbody" data-n-group="body">
            {rows}
        </tbody>);
    }

    renderTableHeader() {
        const columns = this.props.children.map((child: React.ReactElement<ColumnProps>, index: number) => {

            const cachedOnSort = child.props.onSort;
            const onSort = (sortDirection: SortDirection) => {
                if (cachedOnSort) cachedOnSort(sortDirection);
                this.onSort(sortDirection, child.props.dataKey);
            };
            return React.createElement(ColumnComponent, {
                ...(child.props),
                element: "th",
                onSort: onSort,
                template: undefined,
                group: "column-header",
                key: (child.props.key || index),
                valueClassName: "noseur-column-header",
                sortIcons: (this.props.sortIcons || child.props.sortIcons),
                value: (typeof child.props.header == "function"
                    ? child.props.header()
                    : <span className="noseur-column-header-content">{child.props.header || <span>&nbsp;</span>}</span>),
            });
        });

        return (<thead key="header" className="noseur-thead" data-n-group="header">
            <tr role="row" data-n-group="header-row">{columns}</tr>
        </thead>);
    }

    renderTableFooter() {
        let hasNoFooter = true;
        const columns = this.props.children.map((child: React.ReactElement<ColumnProps>, index: number) => {
            if (child.props.footer) hasNoFooter = false;
            return React.createElement(ColumnComponent, {
                ...(child.props),
                element: "th",
                group: "column-footer",
                key: (child.props.key || index),
                valueClassName: "noseur-column-footer",
                value: (typeof child.props.footer == "function"
                    ? child.props.footer()
                    : <span className="noseur-column-footer-content">{child.props.footer || <span>&nbsp;</span>}</span>),
            });
        });

        if (hasNoFooter) return null;
        return (<tfoot key="footer" className="noseur-tfoot" data-n-group="footer">
            <tr role="row" data-n-group="footer-row">{columns}</tr>
        </tfoot>);
    }

    renderTable(hasHeader: boolean, hasFooter: boolean) {
        const props: NoseurObject<any> = {
            id: this.props.id,
        };
        const tableBody = this.renderTableBody();
        const tableFooter = this.renderTableFooter();
        const tableHeader = this.props.hideHeaders ? null : this.renderTableHeader();
        const className = Classname.build('noseur-table', {
            "noseur-disabled": this.props.disabled,
            "noseur-table-striped": this.props.stripedRows,
            "noseur-table-grid-h": !hasHeader && this.props.showGridlines,
            "noseur-table-grid-f": !hasFooter && this.props.showGridlines && this.props.data?.length,
        });

        return (<table {...props} role="table" data-n-group="table" className={className}>
            {tableHeader}
            {tableBody}
            {tableFooter}
        </table>);
    }

    renderTableFixtures(fixture: TableTemplateHandler, className: string) {
        if (!fixture) return null;
        return <div className={className}>{fixture()}</div>
    }

    renderEmptyState() {
        if (this.props.data?.length) return null;
        return <div className="noseur-table-empty-state">{this.props.emptyState}</div>
    }

    renderPaginator(hasFooter: boolean) {
        if (!this.props.paginate) return null;
        const props: PaginatorProps = {
            ...(this.props.paginatorProps || {}),
            rowsPerPage: this.props.rowsPerPage,
            template: this.props.paginatorTemplate,
            totalRecords: this.props.totalRecords || this.props.data?.length,
        };
        const cachedOnPageChange = props.onPageChange;
        props.onPageChange = (event: PaginatorPageChangeOption) => {
            this.onPageChange(event);
            if (cachedOnPageChange) cachedOnPageChange(event);
            if (this.props.onPageChange) this.props.onPageChange(event);
        };
        const className = Classname.build(props.className, {
            "noseur-table-grid-f": !hasFooter && this.props.showGridlines,
            "noseur-no-bd-t": !hasFooter && this.props.data?.length && this.props.showGridlines,
        });

        return (<Paginator {...props} className={className} />);
    }

    render() {
        const props: NoseurObject<any> = {
            key: this.props.key,
            style: this.props.style,
        };
        const emptyState = this.renderEmptyState();
        const header = this.renderTableFixtures(this.props.header, "noseur-table-header");
        const footer = this.renderTableFixtures(this.props.footer, "noseur-table-footer");
        const className = Classname.build('noseur-table-compound', {
            "noseur-table-grid": this.props.showGridlines,
        }, this.props.className);
        const paginator = this.renderPaginator(!!footer);
        const table = this.renderTable(!!header, !!footer);

        return (<div {...props} className={className}>
            {header}
            {table}
            {emptyState}
            {paginator}
            {footer}
        </div>);
    }

}

export const Table = React.forwardRef<HTMLTableElement, Partial<TableProps>>((props, ref) => (
    <TableComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLTableElement>} />
));

