
import React from "react";
import { Classname } from "../utils/Classname";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurElement, SortDirection } from "../constants/Types";
import { Paginator, PaginatorPageChangeOption, PaginatorProps, PaginatorTemplateOptions } from "../presentation/Paginator";
import { DOMHelper } from "../utils/DOMUtils";

export interface RowProps {
    id?: string;
    key?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface RowControlOptions {
    toggleContent: () => void;
}

export type DataFixtureTemplateHandler = () => NoseurElement;
export type DataRowValuedPropsHandler<D> = (data?: D) => RowProps;
export type DataRowExpansionTemplateHandler<D> = (data: D) => NoseurElement;
export type DataRowSelectionHandler <D>= (value: D, rowNumber?: number) => boolean;
export type DataSelectionElementTemplateHandler = (index: number) => NoseurElement;
export type DataComparatorHandler<D> = (sortDirection: SortDirection, dataKey: string, p: D, c: D) => number;

export interface DataManageRef {
    setData: <D>(data?: D[]) => void;
    expandContent: (row: number) => void;
    toggleContent: (row: number) => void;
    collapseContent: (row: number) => void;
    setLoadingState: (isLoading: boolean) => void;
    setAndExpandRowContent: (row: number, content: NoseurElement) => void;
}

export interface DataInternalElementProps {
    id?: string;
    key?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface DataProps<T, D> extends ComponentBaseProps<T, DataManageRef> {
    data?: D[];
    dataId: string;
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
    multiRowExpansion: boolean;
    loadingState: NoseurElement;
    allowNoDataPagination: boolean;
    rowsContent: { [key: number]: any };
    paginatorProps: Partial<PaginatorProps>;
    paginatorTemplate: PaginatorTemplateOptions;
    internalElementProps: Partial<DataInternalElementProps>;

    header: DataFixtureTemplateHandler;
    footer: DataFixtureTemplateHandler;
    compareData: DataComparatorHandler<D>;
    onRowSelection: DataRowSelectionHandler<D>;
    valuedRowProps: DataRowValuedPropsHandler<D>;
    rowExpansionTemplate: DataRowExpansionTemplateHandler<D>;
    onPageChange?: (event: PaginatorPageChangeOption) => void;
    selectionElementTemplate: DataSelectionElementTemplateHandler;
}

export interface DataState<D> {
    isLoading?: boolean;
    dataOffset: number;
    currentPage: number;
    activeData?: D[];
    rowsContent: { [key: number]: any };
};

export class DataComponent<T, P extends DataProps<T, D>, S extends DataState<D>, D> extends React.Component<P, S> {

    rowContentElementMaps: { [key: number]: { rowElement?: any; contentElement?: any; expanded?: boolean; originalHeight?: number; } } = {};

    componentDidMount() {
        ObjectHelper.resolveManageRef(this as any, {
            toggleContent: (row: number) => this.internalToggleRowContent(row),
            setLoadingState: (isLoading: boolean) => this.setState({ isLoading }),
            expandContent: (row: number) => this.internalToggleRowContent(row, true),
            collapseContent: (row: number) => this.internalToggleRowContent(row, false),
            setData: (data?: D[]) => this.setState({ activeData: data }),
            setAndExpandRowContent: (row: number, content: NoseurElement) => this.internalToggleRowContent(row, undefined, content)
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
        return ObjectHelper.merge(this.props.rowProps ?? {}, valuedRowProps);
    }

    onPageChange(event: PaginatorPageChangeOption) {
        this.setState({
            currentPage: event.currentPage,
            dataOffset: (event.currentPage - 1) * this.props.rowsPerPage
        });
    }

    renderPaginator(hasFooter: boolean) {
        if (!this.props.paginate) return null;
        const props: Partial<PaginatorProps> = {
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

    internalToggleRowContent(row: number, expand?: boolean, content?: NoseurElement) {
        if (expand === true && (row in this.state.rowsContent)) return;
        if (expand === false && !(row in this.state.rowsContent)) return;
        const rowsContent = this.toggleRowContent(row, ((this.state.activeData ?? {}) as any)[row-1], expand, content);
        this.setState({ rowsContent });
    }

    toggleRowContent(row: number, data: any, expand?: boolean, content?: NoseurElement) {
        let rowsContent = this.state.rowsContent;
        if (expand === false || row in rowsContent) {
            delete rowsContent[row];
        } else {
            if (!this.props.multiRowExpansion) {
                rowsContent = {};
            }
            if (content) {
                rowsContent[row] = content;
            } else {
                if (!!this.props.rowExpansionTemplate) {
                    rowsContent[row] = this.props.rowExpansionTemplate(data);
                } else {
                    rowsContent[row] = this.props.rowsContent[row];
                }
            }
        }
        return rowsContent;
    }

    renderRowContents() {
        const rowsContents = this.state.rowsContent;
        return Object.keys(rowsContents).map((row: any) => {
            if (!(row in this.rowContentElementMaps)) this.rowContentElementMaps[row] = {};
            return (<div key={row} ref={(r) => {
                if (!this.rowContentElementMaps[row]) {
                    this.setState({ rowsContent: {} });
                }
                this.rowContentElementMaps[row].contentElement = r;
            }} className="noseur-data-row-content">{rowsContents[row]}</div>);
        });
    }

    resolveRowContentPositions() {
        const rows = Object.keys(this.rowContentElementMaps) as any[];
        for (let row of rows) {
            const rowContentElementMap = this.rowContentElementMaps[row];
            if (!rowContentElementMap.rowElement || !rowContentElementMap.contentElement) {
                if (rowContentElementMap.expanded && rowContentElementMap.rowElement) {
                    rowContentElementMap.rowElement.style.height = rowContentElementMap.originalHeight + "px";
                }
                delete this.rowContentElementMaps[row]
                continue;
            }
            if (rowContentElementMap.expanded) continue;
            const contentHeight = DOMHelper.calculateHeight(rowContentElementMap.contentElement);
            const rowStyle = DOMHelper.getElementStyle(rowContentElementMap.rowElement);
            const rowHeight = DOMHelper.sanitizeStyleValue(rowStyle.height);
            const rowSuperfluousHeight = DOMHelper.getElementSuperfluousHeight(rowContentElementMap.rowElement, true);
            const rowOffsetTopPlusHeight = rowContentElementMap.rowElement.offsetTop + rowHeight + rowSuperfluousHeight;
            rowContentElementMap.rowElement.style.height = (rowHeight + contentHeight) + "px";
            rowContentElementMap.contentElement.style.top = rowOffsetTopPlusHeight + "px";
            this.rowContentElementMaps[row].originalHeight = rowHeight;
            this.rowContentElementMaps[row].expanded = true;
        };
    }

}
