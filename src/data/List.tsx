
import "./Data.css";
import React from 'react';
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { DataComponent, DataProps, DataState } from "./Data";
import { ObjectHelper } from "../utils/ObjectHelper";
import { NoseurElement, NoseurObject, SortDirection } from '../constants/Types';

export type ListTemplateHandler = (value: any) => NoseurElement;

export interface ListProps extends DataProps<HTMLUListElement> {
    sortField: string;
    children: undefined;
    selectionMode: SelectionMode;
    sortOrder: null | 0 | 1 | -1;

    template: ListTemplateHandler | undefined;
};

class ListComponent extends DataComponent<HTMLUListElement, ListProps, DataState> {

    public static defaultProps: Partial<ListProps> = {
        data: [],
        paginate: false,
        rowsPerPage: 10,
    };

    state: DataState = {
        dataOffset: 0,
        currentPage: 1,
        activeData: this.props.data,
    };

    constructor(props: ListProps) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<ListProps>, _: Readonly<DataState>) {
        if (!BoolHelper.deepEqual(prevProps.data, this.props.data, ["totalRecords"])) {
            this.setState({ activeData: this.props.data });
        }
    }

    sortData() {
        const data = this.state.activeData;
        const sortField = this.props.sortField;
        data.sort((p: NoseurObject<any>, c: NoseurObject<any>) => {
            const prev = ObjectHelper.objectGetWithStringTemplate(p, sortField), current = ObjectHelper.objectGetWithStringTemplate(c, sortField);
            if (this.props.compareData) return this.props.compareData(SortDirection.FORWARD, sortField, prev, current);
            const comp = BoolHelper.compare(prev, current);
            return comp;
        });
        this.setState({ activeData: data });
    }

    renderListBody() {
        let data = this.state.activeData.slice(this.state.dataOffset, (this.props.rowsPerPage + this.state.dataOffset));
        if (!data.length && !this.props.allowNoDataPagination) data = this.state.activeData;

        return data.map((data: NoseurObject<any>, index: number) => (<li key={index} role="row" data-n-group="row">{this.props.template ? this.props.template(data) : `${data}`}</li>));
    }

    renderList(hasHeader: boolean, hasFooter: boolean) {
        const props: NoseurObject<any> = {
            id: this.props.id,
        };
        const listBody = this.renderListBody();
        const className = Classname.build('noseur-data-container noseur-list', {
            "noseur-disabled": this.props.disabled,
            "noseur-data-striped": this.props.stripedRows,
            "noseur-data-grid-h": !hasHeader && this.props.showGridlines,
            "noseur-data-grid-f": !hasFooter && this.props.showGridlines && this.props.data?.length,
        });

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
        const header = this.renderFixtures(this.props.header, "noseur-data-header");
        const footer = this.renderFixtures(this.props.footer, "noseur-data-footer");
        const className = Classname.build('noseur-data-compound', {
            "noseur-data-grid": this.props.showGridlines,
            "noseur-data-no-divider": this.props.noDivider && !this.props.showGridlines,
        }, this.props.className, (this.props.scheme ? `${this.props.scheme}-vars` : null));
        const paginator = this.renderPaginator(!!footer);
        const list = this.renderList(!!header, !!footer);

        return (<div {...props} className={className}>
            {header}
            {list}
            {emptyState}
            {paginator}
            {footer}
        </div>);
    }

}

export const List = React.forwardRef<HTMLUListElement, Partial<ListProps>>((props, ref) => (
    <ListComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLUListElement>} />
));

