
import "./Data.css";
import React from 'react';
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ColumnProps, ColumnComponent } from "./Column";
import { DataComponent, DataProps, DataState } from "./Data";
import { NoseurElement, NoseurObject, SortDirection, SortIcons, SortMode } from '../constants/Types';

export enum TableSelectionMode {
    NONE,
    SINGLE,
    MULTIPLE
}

export type TableSelectionEventHandler = (value: any) => NoseurElement;

export interface TableProps extends DataProps<HTMLTableElement> {
    sortMode: SortMode;
    sortIcons: SortIcons;
    hideHeaders: boolean;
    cellSelection: boolean;
    canDisableSort: boolean;
    sortOrder: null | 0 | 1 | -1;
    selectionMode: TableSelectionMode;
    children: React.ReactElement<ColumnProps> | React.ReactElement<ColumnProps>[];

    onColumnSelection: TableSelectionEventHandler;
};

interface TableState extends DataState {
    lastSortColumn?: string;
};

class TableComponent extends DataComponent<HTMLTableElement, TableProps, TableState> {

    public static defaultProps: Partial<TableProps> = {
        paginate: false,
        rowsPerPage: 10,
        dataRefreshKeys: [],
        internalElementProps: {},
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


    usedDataKeys: any[] = [];
    columnSelfRefs: NoseurObject<any> = {};

    constructor(props: TableProps) {
        super(props);

        this.onSort = this.onSort.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<TableProps>, _: Readonly<TableState>) {
        if (prevProps.totalRecords !== this.props.totalRecords ||
            !BoolHelper.deepEqual(prevProps.data, this.props.data, [this.usedDataKeys, ...this.props.dataRefreshKeys])
            || ((!this.state.activeData || !this.state.activeData.length) && this.props.data?.length)) {
            this.setState({ activeData: this.props.data ?? [] });
            Object.keys(this.columnSelfRefs).forEach((dk: string) => {
                this.columnSelfRefs[dk]!.unSort();
            });
        }
    }

    onSort(sortDirection: SortDirection, dataKey: string) {
        if (!dataKey) return;
        let data = ((this.props.sortMode == SortMode.MULTIPLE || this.state.lastSortColumn == dataKey) ? (this.state.activeData ?? []) : (this.props.data ?? [])).map(a => { return { ...a } });
        if (this.props.sortMode != SortMode.MULTIPLE) {
            Object.keys(this.columnSelfRefs).forEach((dk: string) => {
                if (dk == dataKey) return;
                this.columnSelfRefs[dk]!.unSort();
            });
        }
        if (sortDirection == SortDirection.NONE) {
            this.setState({
                activeData: (this.props.data || []).map((v: NoseurObject<any>, index: number) => {
                    v[dataKey] = ObjectHelper.objectGetWithStringTemplate((this.props.data || [])[index], dataKey);
                    return v;
                }), lastSortColumn: dataKey
            });
            return;
        }
        data.sort((p: NoseurObject<any>, c: NoseurObject<any>) => {
            const prev = ObjectHelper.objectGetWithStringTemplate(p, dataKey), current = ObjectHelper.objectGetWithStringTemplate(c, dataKey);
            if (this.props.compareData) return this.props.compareData(sortDirection, dataKey, prev, current);
            const comp = BoolHelper.compare(prev, current);
            if (comp == 1 && sortDirection == SortDirection.BACKWARD) return -1;
            return comp;
        });
        this.setState({ activeData: data, lastSortColumn: dataKey });
    }

    renderTableBody() {
        if (!this.state.activeData || this.state.isLoading) return;
        let data = this.state.activeData.slice(this.state.dataOffset, (this.props.rowsPerPage + this.state.dataOffset));
        if (!data.length && !this.props.allowNoDataPagination) data = this.state.activeData;
        const children: any = (this.props.children as any).length ? this.props.children : [this.props.children];

        const rows = data.map((data: NoseurObject<any>, index: number) => {
            const columns = children?.map((child: React.ReactElement<ColumnProps>, sindex: number) => {
                return React.createElement(ColumnComponent, {
                    ...(child.props),
                    sortable: false,
                    key: (child.props.key || sindex),
                    value: (child.props.dataKey ? ObjectHelper.objectGetWithStringTemplate(data, child.props.dataKey) : data),
                });
            });
            let valuedRowProps = this.props.valuedRowProps ? this.props.valuedRowProps(data) : null;
            return (<tr key={index} role="row" data-n-group="body-row" {...valuedRowProps}>{columns}</tr>);
        });

        return (<tbody key="body" className="noseur-tbody" data-n-group="body">
            {rows}
        </tbody>);
    }

    renderTableHeader() {
        const children: any = (this.props.children as any).length ? this.props.children : [this.props.children];
        const columns = children?.map((child: React.ReactElement<ColumnProps>, index: number) => {
            const cachedOnSort = child.props.onSort;
            const onSort = (sortDirection: SortDirection) => {
                if (cachedOnSort) cachedOnSort(sortDirection);
                this.onSort(sortDirection, child.props.dataKey);
            };
            if (child.props.dataKey && !this.usedDataKeys.includes(child.props.dataKey)) this.usedDataKeys.push(child.props.dataKey);
            let columnSelfRef: React.ForwardedRef<any>;
            if (child.props.sortable && this.props.sortMode! + SortMode.MULTIPLE) {
                const cachedManageRef = child.props.manageRef;
                columnSelfRef = (r: any) => {
                    if (cachedManageRef) {
                        if (typeof cachedManageRef == "function") cachedManageRef(r);
                        else cachedManageRef.current = r;
                    }
                    this.columnSelfRefs[child.props.dataKey] = r;
                }
            } else {
                columnSelfRef = child.props.manageRef;
            }
            return React.createElement(ColumnComponent, {
                ...(child.props),
                element: "th",
                onSort: onSort,
                template: undefined,
                group: "column-header",
                manageRef: columnSelfRef!,
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
        const children: any = (this.props.children as any).length ? this.props.children : [this.props.children];
        const columns = children?.map((child: React.ReactElement<ColumnProps>, index: number) => {
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
            ...this.props.internalElementProps,
        };
        if (!(this.props.children as any)?.length) return null;
        const tableBody = this.renderTableBody();
        const tableFooter = this.renderTableFooter();
        const tableHeader = this.props.hideHeaders ? null : this.renderTableHeader();
        const className = Classname.build('noseur-data-container noseur-table', {
            "noseur-disabled": this.props.disabled,
            "noseur-data-striped": this.props.stripedRows,
            "noseur-data-grid-h": !hasHeader && this.props.showGridlines,
            "noseur-data-grid-f": !hasFooter && this.props.showGridlines && this.props.data?.length,
        }, this.props.internalElementProps.className);

        return (<table {...props} role="table" data-n-group="table" className={className} ref={this.props.forwardRef}>
            {tableHeader}
            {tableBody}
            {tableFooter}
        </table>);
    }

    render() {
        const props: NoseurObject<any> = {
            key: this.props.key,
            style: this.props.style,
        };
        const emptyState = this.renderEmptyState();
        const loadingState = this.renderLoadingState();
        const header = this.renderFixtures(this.props.header, "noseur-data-header");
        const footer = this.renderFixtures(this.props.footer, "noseur-data-footer");
        const className = Classname.build('noseur-data-compound', {
            "noseur-data-grid": this.props.showGridlines,
            "noseur-data-no-divider": this.props.noDivider && !this.props.showGridlines,
        }, this.props.className, (this.props.scheme ? `${this.props.scheme}-vars` : null));
        const paginator = this.renderPaginator(!!footer);
        const table = this.renderTable(!!header, !!footer);

        return (<div {...props} className={className}>
            {header}
            {table}
            {emptyState}
            {loadingState}
            {paginator}
            {footer}
        </div>);
    }

}

export const Table = React.forwardRef<HTMLTableElement, Partial<TableProps>>((props, ref) => (
    <TableComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLTableElement>} />
));

