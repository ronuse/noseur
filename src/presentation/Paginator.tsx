
import React from 'react';
import "./Presentation.css";
import { Button } from "../form/Button";
import { Scheme } from '../constants/Scheme';
import { Classname } from "../utils/Classname";
import { ObjectHelper } from "../utils/ObjectHelper";
import { ComponentBaseProps } from '../core/ComponentBaseProps';
import { NoseurElement, NoseurObject } from '../constants/Types';

export enum PaginatorDirection {
    PAGE = "",
    NEXT_HIDDEN_PAGES = "nhp",
    NEXT = "fa fa-angle-right",
    PREVIOUS_HIDDEN_PAGES = "phg",
    PREVIOUS = "fa fa-angle-left",
    _HIDDEN_PAGES = "fa fa-ellipsis-h",
    LAST_PAGE = "fa fa-angle-double-right",
    FIRST_PAGE = "fa fa-angle-double-left",
};

export interface PaginatorPageElementOption {
    scheme: Scheme;
    active?: boolean;
    disabled?: boolean;
    className?: string;
    style?: NoseurObject<any>;
    label?: number | string;
    direction?: PaginatorDirection;
    onClick?: (...args: any[]) => any;
};

export type PaginatorTemplateElementEventHandler = (option: PaginatorPageElementOption) => NoseurElement;

export interface PaginatorPageChangeOption {
    scheme?: Scheme;
    pageCount: number;
    currentPage: number;
};

export type PaginatorTemplateLabelEventHandler = (option: PaginatorPageChangeOption) => NoseurElement;

export interface PaginatorTemplateOptions {
    layout?: string,
    rowsPerPageElement?: NoseurElement;
    pageElement?: PaginatorTemplateElementEventHandler;
    activePageLabel?: PaginatorTemplateLabelEventHandler;
    nextPageElement?: PaginatorTemplateElementEventHandler;
    lastPageElement?: PaginatorTemplateElementEventHandler;
    firstPageElement?: PaginatorTemplateElementEventHandler;
    hiddenPagesElement?: PaginatorTemplateElementEventHandler;
    previousPageElement?: PaginatorTemplateElementEventHandler;
}

export enum PaginatorLayoutElements {
    PageElements = "PageElements",
    NextPageElement = "NextPageElement",
    LastPageElement = "LastPageElement",
    ActivePageLabel = "ActivePageLabel",
    NextPagesElement = "NextPagesElement",
    FirstPageElement = "FirstPageElement",
    PreviousPageElement = "PreviousPageElement",
    PreviousPagesElement = "PreviousPagesElement",
}

export interface PaginatorProps extends ComponentBaseProps<NoseurElement> {
    initialPage: number;
    rowsPerPage: number;
    totalRecords: number;
    visiblePageCount: number;
    rowsPerPageOptions: number[];
    overlayContainer: NoseurElement;
    leftContent: React.ReactElement;
    rightContent: React.ReactElement;
    template: PaginatorTemplateOptions;
    expandOnHiddenPagesButtonClicked: boolean;
    onPageChange?: (event: PaginatorPageChangeOption) => void;
};

interface PaginatorState {
    pageCount: number;
    currentPage: number;
    renderNextHiddenPagesElements: boolean;
    renderPreviousHiddenPagesElements: boolean;
};

function buildTemplate(_: PaginatorState, props: PaginatorProps): PaginatorTemplateOptions {
    const customTemplate = props.template;
    const layout = (customTemplate?.layout
        || `${
            PaginatorLayoutElements.FirstPageElement} ${
                PaginatorLayoutElements.PreviousPageElement} ${
                    PaginatorLayoutElements.PreviousPagesElement} ${
                        PaginatorLayoutElements.PageElements} ${
                            PaginatorLayoutElements.NextPagesElement} ${
                                PaginatorLayoutElements.NextPageElement} ${
                                    PaginatorLayoutElements.LastPageElement} ${
                                        PaginatorLayoutElements.ActivePageLabel}`)
        .replace(/\s+/g, " ");
    const paginationElementBuilder = (direction: PaginatorDirection) => {
        return (option: PaginatorPageElementOption) => {
            const key = (option.label || (option.className || direction));
            const outlined = !option.active && option.scheme != Scheme.SKELETON;
            return (<Button key={key} text={option.label} scheme={option.scheme} disabled={option.disabled}
                className={Classname.build(option.className, direction)} style={{ marginLeft: 10 }}
                onClick={option.onClick} outlined={outlined} iconOnly fillOnHover borderless />);
        };
    }
    const pageElement = customTemplate?.pageElement || paginationElementBuilder(PaginatorDirection.PAGE);
    const nextPageElement = customTemplate?.nextPageElement || paginationElementBuilder(PaginatorDirection.NEXT);
    const lastPageElement = customTemplate?.nextPageElement || paginationElementBuilder(PaginatorDirection.LAST_PAGE);
    const firstPageElement = customTemplate?.nextPageElement || paginationElementBuilder(PaginatorDirection.FIRST_PAGE);
    const previousPageElement = customTemplate?.nextPageElement || paginationElementBuilder(PaginatorDirection.PREVIOUS);
    const hiddenPagesElement = customTemplate?.nextPageElement || paginationElementBuilder(PaginatorDirection._HIDDEN_PAGES);
    const activePageLabel = customTemplate?.activePageLabel || ((option: PaginatorPageChangeOption) => {
        const label = ObjectHelper.resolveStringTemplate("({currentPage} of {pageCount})", option);
        return (<span key={label} className={`noseur-paginator-label ${option.scheme || ""}`}>{label}</span>);
    });

    return {
        layout,
        pageElement,
        activePageLabel,
        nextPageElement,
        lastPageElement,
        firstPageElement,
        previousPageElement,
        hiddenPagesElement,
    };
}

class PaginatorComponent extends React.Component<PaginatorProps, PaginatorState> {

    public static defaultProps: Partial<PaginatorProps> = {
        initialPage: 1,
        rowsPerPage: 10,
        visiblePageCount: 5,
        scheme: Scheme.STATELESS,
        expandOnHiddenPagesButtonClicked: false,
    };

    state: PaginatorState = {
        currentPage: this.props.initialPage,
        renderNextHiddenPagesElements: false,
        renderPreviousHiddenPagesElements: false,
        pageCount: Math.ceil(this.props.totalRecords / this.props.rowsPerPage),
    };

    constructor(props: PaginatorProps) {
        super(props);

        this.onNavigationClicked = this.onNavigationClicked.bind(this);
    }

    onNavigationClicked(direction: PaginatorDirection, page: number = 1) {

        const pageCount = this.state.pageCount;
        const currentPage = this.state.currentPage;

        if (direction == PaginatorDirection.FIRST_PAGE) {
            if (currentPage == 1) return;
        } else if (direction == PaginatorDirection.LAST_PAGE) {
            if (currentPage == pageCount) return;
            page = pageCount;
        } else if (direction == PaginatorDirection.NEXT) {
            page = currentPage + 1;
            if (page > pageCount) return;
        } else if (direction == PaginatorDirection.PREVIOUS) {
            page = currentPage - 1;
            if (page <= 0) return;
        } else if (direction == PaginatorDirection.NEXT_HIDDEN_PAGES) {
            const newState: any = { renderNextHiddenPagesElements: true };
            if (currentPage == 1) newState.renderPreviousHiddenPagesElements = true;
            this.setState(newState);
            return;
        } else if (direction == PaginatorDirection.PREVIOUS_HIDDEN_PAGES) {
            const newState: any = { renderPreviousHiddenPagesElements: true };
            if (currentPage == 1) newState.renderNextHiddenPagesElements = true;
            this.setState(newState);
            return;
        }

        const option = {
            currentPage: page,
            pageCount: pageCount
        };
        this.props.onPageChange && this.props.onPageChange(option);
        this.setState({ currentPage: page });
    }

    renderNavigationElements(template: PaginatorTemplateOptions, layouts: string[]): NoseurObject<any> {
        const generalPaginarorElementsOption: PaginatorPageElementOption = {
            scheme: this.props.scheme,
        };
        return {
            nextPageElement: layouts.includes("NextPageElement") ? template.nextPageElement!({
                className: "noseur-paginator-pg noseur-paginator-nx",
                disabled: this.state.currentPage == this.state.pageCount,
                onClick: (_: any) => this.onNavigationClicked(PaginatorDirection.NEXT),
                ...generalPaginarorElementsOption
            }) : undefined,
            previousPageElement: layouts.includes("PreviousPageElement") ? template.previousPageElement!({
                disabled: this.state.currentPage == 1,
                className: "noseur-paginator-pg noseur-paginator-pr",
                onClick: (_: any) => this.onNavigationClicked(PaginatorDirection.PREVIOUS),
                ...generalPaginarorElementsOption
            }) : undefined,
            firstPageElement: layouts.includes("FirstPageElement") ? template.firstPageElement!({
                disabled: this.state.currentPage == 1,
                className: "noseur-paginator-pg noseur-paginator-fp",
                onClick: (_: any) => this.onNavigationClicked(PaginatorDirection.FIRST_PAGE),
                ...generalPaginarorElementsOption
            }) : undefined,
            lastPageElement: layouts.includes("LastPageElement") ? template.lastPageElement!({
                className: "noseur-paginator-pg noseur-paginator-lp",
                disabled: this.state.currentPage == this.state.pageCount,
                onClick: (_: any) => this.onNavigationClicked(PaginatorDirection.LAST_PAGE),
                ...generalPaginarorElementsOption
            }) : undefined,
            hiddenPagesElement: (layouts.includes("PreviousPagesElement") || layouts.includes("NextPagesElement"))
                ? (disabled: boolean, direction: PaginatorDirection.NEXT_HIDDEN_PAGES | PaginatorDirection.PREVIOUS_HIDDEN_PAGES) => {
                    return template.hiddenPagesElement!({
                        disabled,
                        onClick: (_: any) => this.onNavigationClicked(direction),
                        className: `noseur-paginator-pg noseur-paginator-hp-${direction == PaginatorDirection.NEXT_HIDDEN_PAGES ? 'n' : 'p'}`,
                        ...generalPaginarorElementsOption
                    });
                } : undefined
        }
    }

    buildPageNumberElement(pageElement: PaginatorTemplateElementEventHandler, from: number, to: number, render: boolean) {
        if (!render) return;
        const pageElements = [];

        for (let pageNumber = from; pageNumber <= to; pageNumber++) {
            pageElements.push(pageElement!({
                label: pageNumber,
                scheme: this.props.scheme,
                active: this.state.currentPage == pageNumber,
                onClick: (_: any) => this.onNavigationClicked(PaginatorDirection.PAGE, pageNumber),
            }));
        }
        return pageElements;
    }

    renderPageElements(template: PaginatorTemplateOptions, layouts: string[], hiddenPagesElement: any): NoseurObject<any> {
        if (!layouts.includes("PageElements") && !hiddenPagesElement) return {};

        const pageCount = this.state.pageCount;
        const currentPage = this.state.currentPage;
        const visiblePageCount = this.props.visiblePageCount;
        const sidesCount = Math.floor(visiblePageCount / 2);
        const visiblePagesEndIndex = Math.min(Math.max(visiblePageCount, currentPage + sidesCount), pageCount);
        let visiblePagesStartIndex = Math.max(1, currentPage - sidesCount);
        const visiblePagesIndexesRemainder = (visiblePageCount - 1) - (visiblePagesEndIndex - visiblePagesStartIndex);
        if (visiblePagesIndexesRemainder != 0) visiblePagesStartIndex = Math.max(1, visiblePagesStartIndex - visiblePagesIndexesRemainder);
        const pageElements = layouts.includes("PageElements") && this.buildPageNumberElement(template.pageElement!, visiblePagesStartIndex, visiblePagesEndIndex, true);

        let previousPagesElement, previousPagesElements, shouldRenderPreviousPagesElement;
        if (layouts.includes("PreviousPagesElement")) {
            const renderPreviousHiddenPagesElements = this.state.renderPreviousHiddenPagesElements;
            shouldRenderPreviousPagesElement = !renderPreviousHiddenPagesElements && (visiblePagesStartIndex - 1) > 0;
            previousPagesElement = shouldRenderPreviousPagesElement && hiddenPagesElement(!this.props.expandOnHiddenPagesButtonClicked, PaginatorDirection.PREVIOUS_HIDDEN_PAGES);
            previousPagesElements = this.props.expandOnHiddenPagesButtonClicked
                && this.buildPageNumberElement(template.pageElement!, 1, visiblePagesStartIndex - 1, renderPreviousHiddenPagesElements);
        }

        let nextPagesElement, nextPagesElements, shouldRenderNextPagesElement;
        if (layouts.includes("NextPagesElement")) {
            const renderNextHiddenPagesElements = this.state.renderNextHiddenPagesElements;
            shouldRenderNextPagesElement = !renderNextHiddenPagesElements && (pageCount - visiblePagesEndIndex) > 0;
            nextPagesElement = shouldRenderNextPagesElement && hiddenPagesElement(!this.props.expandOnHiddenPagesButtonClicked, PaginatorDirection.NEXT_HIDDEN_PAGES);
            nextPagesElements = this.props.expandOnHiddenPagesButtonClicked
                && this.buildPageNumberElement(template.pageElement!, visiblePagesEndIndex + 1, pageCount, renderNextHiddenPagesElements);
        }

        return {
            pageElements,
            nextPagesElement,
            nextPagesElements,
            previousPagesElement,
            previousPagesElements,
        };
    }

    render() {
        const template = buildTemplate(this.state, this.props);
        const layouts = template.layout!.split(" ");
        const className = Classname.build("noseur-paginator", this.props.className);
        const labelMap: PaginatorPageChangeOption = {
            pageCount: this.state.pageCount,
            currentPage: this.state.currentPage
        };
        if (this.props.scheme === Scheme.SKELETON) labelMap.scheme = this.props.scheme;
        const {
            firstPageElement,
            previousPageElement,
            nextPageElement,
            lastPageElement,
            hiddenPagesElement
        } = this.renderNavigationElements(template, layouts);
        const {
            pageElements,
            nextPagesElement,
            nextPagesElements,
            previousPagesElement,
            previousPagesElements
        } = this.renderPageElements(template, layouts, hiddenPagesElement)
        const activePageLabel = layouts.includes("ActivePageLabel") && template.activePageLabel ? template.activePageLabel(labelMap) : undefined;
        const layoutElementsMap: any = {
            ActivePageLabel: activePageLabel, FirstPageElement: firstPageElement, PreviousPageElement: previousPageElement,
            NextPageElement: nextPageElement, LastPageElement: lastPageElement, PageElements: pageElements,
            NextPagesElement: <React.Fragment key={PaginatorDirection.NEXT_HIDDEN_PAGES}>{nextPagesElement}{nextPagesElements}</React.Fragment>,
            PreviousPagesElement: <React.Fragment key={PaginatorDirection.PREVIOUS_HIDDEN_PAGES}>{previousPagesElement}{previousPagesElements}</React.Fragment>,
        };
        const leftContent: any = this.props.leftContent && React.cloneElement(this.props.leftContent, {
            className: Classname.build(this.props.leftContent.props.className, "noseur-paginator-lc")
        });
        const rightContent: any = this.props.rightContent && React.cloneElement(this.props.rightContent, {
            className: Classname.build(this.props.rightContent.props.className, "noseur-paginator-rc")
        });
        const props: NoseurObject<any> = {
            className,
            id: this.props.id,
            key: this.props.key,
            style: this.props.style,
        };

        return (<div ref={this.props.forwardRef as React.ForwardedRef<HTMLDivElement>} {...props}>
            {leftContent}
            {layouts.map(layout => layoutElementsMap[layout])}
            {rightContent}
        </div>);
    }

}

export const Paginator = React.forwardRef<HTMLDivElement, Partial<PaginatorProps>>((props, ref) => (
    <PaginatorComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurElement>} />
));

