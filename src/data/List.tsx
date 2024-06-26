
import "./Data.css";
import React from 'react';
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { ObjectHelper } from "../utils/ObjectHelper";
import { DataComponent, DataProps, DataState, RowControlOptions } from "./Data";
import { NoseurElement, NoseurObject, SortDirection } from '../constants/Types';

export type ListTemplateHandler = (value: any, rowControlOptions?: RowControlOptions) => NoseurElement;

export interface ListProps extends DataProps<HTMLUListElement> {
    dataKey: string;
    sortField: string;
    children: undefined;
    selectionMode: SelectionMode;
    sortOrder: null | 0 | 1 | -1;

    template: ListTemplateHandler | undefined;
};

class ListComponent extends DataComponent<HTMLUListElement, ListProps, DataState> {

    public static defaultProps: Partial<ListProps> = {
        paginate: false,
        rowsPerPage: 10,
        rowsContent: {},
        dataRefreshKeys: [],
        internalElementProps: {},
    };

    state: DataState = {
        dataOffset: 0,
        currentPage: 1,
        activeData: this.props.data,
        rowsContent: ObjectHelper.clone(this.props.rowsContent),
    };

    constructor(props: ListProps) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<ListProps>, _: Readonly<DataState>) {
        if (prevProps.totalRecords !== this.props.totalRecords ||
            !BoolHelper.deepEqual(prevProps.data, this.props.data, [...this.props.dataRefreshKeys])
            || ((!this.state.activeData || !this.state.activeData.length) && this.props.data?.length)) {
            this.setState({ activeData: this.props.data ?? [] });
        }
    }

    sortData() {
        const data = this.state.activeData;
        const sortField = this.props.sortField;

        if (!data) return;
        data.sort((p: NoseurObject<any>, c: NoseurObject<any>) => {
            const prev = ObjectHelper.objectGetWithStringTemplate(p, sortField), current = ObjectHelper.objectGetWithStringTemplate(c, sortField);
            if (this.props.compareData) return this.props.compareData(SortDirection.FORWARD, sortField, prev, current);
            const comp = BoolHelper.compare(prev, current);
            return comp;
        });
        this.setState({ activeData: data });
    }

    renderListBody() {
        if (!this.state.activeData || this.state.isLoading) return;
        let data = this.state.activeData.slice(this.state.dataOffset, (this.props.rowsPerPage + this.state.dataOffset));
        if (!data.length && !this.props.allowNoDataPagination) data = this.state.activeData;
        const rowsContents = this.state.rowsContent;

        return data.map((rowData: NoseurObject<any>, index: number) => {
            const row = index + 1;
            let valuedRowProps = this.buildRowProps(data);;
            const value = this.props.dataKey ? ObjectHelper.objectGetWithStringTemplate(rowData, this.props.dataKey) : rowData;
            return (<li key={index} role="row" data-n-group="row" {...valuedRowProps} ref={(r) => {
                if (!r) return;
                if (!(row in rowsContents)) return;
                if (!(row in this.rowContentElementMaps)) this.rowContentElementMaps[row] = {};
                this.rowContentElementMaps[row].rowElement = r;
            }}
                onClick={this.props.onRowSelection
                    ? () => this.props.onRowSelection(data) : undefined}>{this.props.template
                        ? this.props.template(value, {
                            toggleContent: (() => {
                                this.setState({ rowsContent: this.toggleRowContent(row, data) });
                            }).bind(this)
                        })
                        : `${value}`}</li>);
        });
    }

    renderList(hasHeader: boolean, hasFooter: boolean) {
        const props: NoseurObject<any> = {
            id: this.props.id,
            ...this.props.internalElementProps,
        };
        const listBody = this.renderListBody();
        const className = Classname.build('noseur-data-container noseur-list', {
            "noseur-disabled": this.props.disabled,
            "noseur-data-striped": this.props.stripedRows,
            "noseur-data-grid-h": !hasHeader && this.props.showGridlines,
            "noseur-data-grid-f": !hasFooter && this.props.showGridlines && this.props.data?.length,
        }, this.props.internalElementProps.className);

        return (<ul {...props} role="list" data-n-group="list" className={className} ref={this.props.forwardRef}>
            {listBody}
        </ul>);
    }

    render() {
        const props: NoseurObject<any> = {
            key: this.props.key,
            style: this.props.style,
        };
        const emptyState = this.renderEmptyState();
        const rowContents = this.renderRowContents();
        const loadingState = this.renderLoadingState();
        const header = this.renderFixtures(this.props.header, "noseur-data-header");
        const footer = this.renderFixtures(this.props.footer, "noseur-data-footer");
        const className = Classname.build('noseur-data-compound', {
            "noseur-data-grid": this.props.showGridlines,
            "noseur-data-no-divider": this.props.noDivider && !this.props.showGridlines,
        }, this.props.className, (this.props.scheme ? `${this.props.scheme}-vars` : null));
        const paginator = this.renderPaginator(!!footer);
        const list = this.renderList(!!header, !!footer);

        return (<div {...props} className={className} ref={(_) => this.resolveRowContentPositions()}>
            {header}
            {list}
            {emptyState}
            {loadingState}
            {paginator}
            {footer}
            {rowContents}
        </div>);
    }

}

export const List = React.forwardRef<HTMLUListElement, Partial<ListProps>>((props, ref) => (
    <ListComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLUListElement>} />
));

