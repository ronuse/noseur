
import "./Form.css";
import React from 'react';
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { BoolHelper } from "../utils/BoolHelper";
import { TypeChecker } from "../utils/TypeChecker";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Popover, PopoverProps } from "../overlay/Popover";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { FunctionStackManager } from "../utils/FunctionStackManager";
import { FormControl, FormControlProps } from "../compose/form/FormControl";
import { InputOnInputCompleteHandler, InputProps, TextInput } from "./Input";
import { NoseurDivElement, NoseurElement, NoseurObject } from '../constants/Types';

export type DropdownEventHandler = () => void | undefined;
export type DropdownOnDeSelectHandler = (event: any) => void;
export type DropdownOnSearchHandler = (value: string) => void;
export type DropdownPanelsHandler = () => NoseurElement | undefined;
export type DropdownOnSelectHandler = (option: any, event: any) => void;
export type DropdownOption = { label?: string, value?: any, icon?: any };
export type DropdownTemplateHandler = (option: any) => NoseurElement | undefined;
export type DropdownSelectedIndex = { primaryIndex: number, secondaryIndex: number };

export interface DropdownManageRef {
    hideDropDown: (e: any) => void;
    showDropDown: (e: any) => void;
    toggle: (e: any, ignoreEditable: boolean) => void;
}

export interface DropdownProps extends ComponentBaseProps<NoseurDivElement, DropdownManageRef> {
    fill: boolean;
    toggleIcon: any;
    editable: boolean;
    disabled: boolean;
    highlight: boolean;
    placeholder: string;
    cleareable: boolean;
    borderless: boolean;
    defaultInputValue: string;
    optionMap: DropdownOption;
    selectedOptionIndex: number;
    dontMatchTargetSize: boolean;
    optionGroupChildrenKey: string;
    renderOptionAsPlaceholder: boolean;
    popoverProps: Partial<PopoverProps>;
    textInputProps: Partial<InputProps>;
    options: NoseurObject<any>[] | undefined;
    formControlProps: Partial<FormControlProps>;
    selectedOptionIndexes: DropdownSelectedIndex;
    popoverRef: React.ForwardedRef<NoseurDivElement>;
    textInputRef: React.ForwardedRef<HTMLInputElement>;

    onSearch?: DropdownOnSearchHandler;
    onDropdownShow: DropdownEventHandler;
    onDropdownHide: DropdownEventHandler;
    optionTemplate: DropdownTemplateHandler;
    onSelectOption: DropdownOnSelectHandler;
    onDeSelectOption: DropdownOnDeSelectHandler;
    popoverHeaderTemplate: DropdownPanelsHandler;
    popoverFooterTemplate: DropdownPanelsHandler;
    optionGroupTemplate: DropdownTemplateHandler;
    selectedOptionTemplate?: DropdownTemplateHandler;
    onInputComplete: InputOnInputCompleteHandler | undefined;

}

interface DropdownState {
    popoverVisible: boolean;
    selectedOptionIndex: DropdownSelectedIndex;
}

// TODO implements keyboard and mouse shortcuts
class DropdownComponent extends React.Component<DropdownProps, DropdownState> {

    public static defaultProps: Partial<DropdownProps> = {
        disabled: false,
        highlight: false,
        popoverProps: {},
        borderless: false,
        textInputProps: {},
        formControlProps: {},
        selectedOptionIndex: -1,
        scheme: Scheme.SECONDARY,
        toggleIcon: "fa fa-angle-down",
        optionGroupChildrenKey: "items",
    };

    state: DropdownState = {
        popoverVisible: false,
        selectedOptionIndex: this.props.selectedOptionIndexes || { primaryIndex: this.props.selectedOptionIndex, secondaryIndex: this.props.selectedOptionIndex },
    };

    optionTemplate: any;
    compoundElement: any;
    optionGroupTemplate: any;
    internalPopoverElement: any;
    internalTextInputElement: any;
    functionStackManager = new FunctionStackManager();

    constructor(props: DropdownProps) {
        super(props);

        this.optionTemplate = this.props.optionTemplate || this.buildSingleOption;
        this.optionGroupTemplate = this.props.optionGroupTemplate || this.buildSingleOption;

        this.togglePopover = this.togglePopover.bind(this);
        this.onDropdownShow = this.onDropdownShow.bind(this);
        this.onDropdownHide = this.onDropdownHide.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            toggle: this.togglePopover,
            hideDropDown: (e: any) => { if (this.state.popoverVisible) { this.togglePopover(e, true); } },
            showDropDown: (e: any) => { if (!this.state.popoverVisible) { this.togglePopover(e, true); } },
        });
    }

    componentDidUpdate(prevProps: Readonly<DropdownProps>, _: Readonly<DropdownState>) {
        if (!BoolHelper.deepEqual(this.props, prevProps, ["selectedOptionIndex"])) {
            this.setState({
                selectedOptionIndex: this.props.selectedOptionIndexes
                    || { primaryIndex: this.props.selectedOptionIndex, secondaryIndex: this.props.selectedOptionIndex }
            });
        }
    }

    togglePopover(e: any, ignoreEditable: boolean = true) {
        e.stopPropagation();
        if (!this.internalPopoverElement || (!ignoreEditable && this.props.editable && e.target === this.internalTextInputElement)) return;
        this.internalPopoverElement.toggle(e, this.compoundElement);
    }

    onDropdownHide() {
        this.setState({ popoverVisible: false });
        if (this.props.onDropdownHide) this.props.onDropdownHide();
    }

    onDropdownShow() {
        this.setState({ popoverVisible: true });
        if (this.props.onDropdownShow) this.props.onDropdownShow();
    }

    selectOption(e: any, selectedOptionIndex: DropdownSelectedIndex, option?: any) {
        this.setState({ selectedOptionIndex: selectedOptionIndex });
        if (selectedOptionIndex.primaryIndex === -1) {
            if (this.props.onDeSelectOption) this.props.onDeSelectOption(e);
            return;
        };
        if (this.props.onSelectOption) this.props.onSelectOption(option, e);
        if (this.props.renderOptionAsPlaceholder) this.internalTextInputElement!.placeholder = this.resolveOptionLabel(option);
        else this.internalTextInputElement!.value = this.resolveOptionLabel(option);
        return this.togglePopover(e, false);
    }

    resolveOptionLabel(option: any) {
        if (!option) return;
        const optionMap = this.props.optionMap;
        if (!optionMap || !optionMap.label) return option.label ? option.label : "";
        if (optionMap.label.indexOf('{') < 0) {
            return option[optionMap.label] || optionMap.label;
        }
        return ObjectHelper.expandStringTemplate(optionMap.label, option);
    }

    resolveOptionIcon(option: any) {
        if (!option) return null;
        const optionMap = this.props.optionMap;
        let icon = option.icon;
        if (optionMap && optionMap.icon) {
            if (optionMap.icon.indexOf && optionMap.icon.indexOf('{') >= 0) {
                icon = ObjectHelper.expandStringTemplate(optionMap.icon, option);
            } else {
                icon = option[optionMap.icon];
            }
        }
        return option ? (TypeChecker.isString(icon) ? <img src={icon}></img> : icon) : null;
    }

    buildSingleOption(option: any) {
        const icon = this.resolveOptionIcon(option);
        const label = this.resolveOptionLabel(option);
        return (<span className="noseur-dropdown-popover-li-item">{icon}{label}</span>);
    }

    getSelectedOption() {
        if (!this.props.options || this.state.selectedOptionIndex == null || this.state.selectedOptionIndex.primaryIndex == null ||
            this.state.selectedOptionIndex.primaryIndex < 0 || this.state.selectedOptionIndex.primaryIndex >= Object.keys(this.props.options).length) {
            return null;
        }
        const childrenKey = this.props.optionGroupChildrenKey;
        const selectedOption = this.props.options[this.state.selectedOptionIndex.primaryIndex];
        return (TypeChecker.isArray(selectedOption) && childrenKey in selectedOption)
            ? selectedOption[childrenKey][this.state.selectedOptionIndex.secondaryIndex || 0]
            : selectedOption;
    }

    buildListItem(option: any, isGroupTitle = false, groupIndex: any = null, index: number = -1, isSelected: boolean = false,
        className: string = "noseur-dropdown-popover-li-grp") {
        if (isGroupTitle) {
            return (<li key={`${groupIndex || -2}-${index}`} aria-label={option.label} role="group" className={className}
                onClick={(_: any) => { }}>
                {this.optionGroupTemplate(option)}
            </li>);
        }
        const optionElement = this.optionTemplate(option);
        const refProps: any = {};
        if (isSelected) refProps.ref = (r: any) => r && this.functionStackManager.register("POPOVER_REFED", (popOverElement: any) => {
            popOverElement.scrollTop = r.offsetTop - popOverElement.offsetTop;
        });

        return (<li key={`${groupIndex || -1}-${index}`} aria-label={option.label} role="option" aria-selected={isSelected} className={className}
            ref={(r: any) => r && isSelected && r.scrollIntoView()} {...refProps}
            onClick={(e: any) => {
                if (this.props.disabled) return;
                this.selectOption(e, {
                    secondaryIndex: (groupIndex == null ? -1 : index),
                    primaryIndex: (groupIndex == null ? index : groupIndex),
                }, option)
            }}>
            {optionElement}
        </li>);
    }

    renderOption(options: NoseurObject<any>[], groupIndex: any = null, isSelectedGroup = false): any[] {
        const listItems: any[] = [];
        const isGroupOptions = !!groupIndex;
        const selectedOptionIndex = this.state.selectedOptionIndex;
        options.forEach((option, index) => {
            const trueSelectedIndex = isGroupOptions ? (isSelectedGroup ? selectedOptionIndex.secondaryIndex : -1) : selectedOptionIndex.primaryIndex;
            const isSelected = index === trueSelectedIndex;
            const isGroup = (this.props.optionGroupChildrenKey in option);
            if (isGroup) {
                listItems.push(this.buildListItem(option, true, index));
                listItems.push(...this.renderOption(option[this.props.optionGroupChildrenKey], index, isSelected));
                return;
            }
            const className = Classname.build((this.props.scheme && isSelected ? this.props.scheme : null),
                (this.props.scheme && !this.props.disabled ? `${this.props.scheme}-bg-hv` : null), {
                'default-style': !this.props.scheme
            }, "noseur-dropdown-popover-li-item", option.className);
            listItems.push(this.buildListItem(option, false, groupIndex, index, isSelected, className));
        });
        return listItems;
    }

    buildSelectedOption(selectedOption: any): any {
        if (selectedOption && this.props.selectedOptionTemplate) return this.props.selectedOptionTemplate(selectedOption);
        const selectedOptionLabel = this.resolveOptionLabel(selectedOption);
        let defaultValue = selectedOptionLabel;
        if (defaultValue && this.props.renderOptionAsPlaceholder) defaultValue = null;
        if (!defaultValue) defaultValue = this.props.textInputProps.defaultValue;
        if (!defaultValue) defaultValue = this.props.defaultInputValue;
        const inputProps: NoseurObject<any> = {
            defaultValue,
            noStyle: true,
            borderless: true,
            id: this.props.id,
            fill: this.props.fill,
            scheme: this.props.scheme,
            ...this.props.textInputProps,
            disabled: this.props.disabled,
            readOnly: !this.props.editable,
            highlight: this.props.highlight,
            style: { ...(this.props.style || {}) },
            onInputComplete: this.props.onInputComplete,
            placeholder: (this.props.renderOptionAsPlaceholder && selectedOptionLabel ? selectedOptionLabel : this.props.placeholder),
            ref: (el: any) => {
                if (!el) return;
                this.internalTextInputElement = el;
                if (!this.props.textInputRef) return;
                if (this.props.textInputRef instanceof Function) this.props.textInputRef(el);
                else this.props.textInputRef.current = el;
            },
            className: Classname.build('noseur-dropdown-inputtext', {
                'noseur-cursor-pointer': !this.props.editable,
            }, (this.props.textInputProps || {}).className, this.props.className),
        };
        if (!this.props.editable) {
            inputProps.style.cursor = "pointer";
        } else if (this.props.onSearch) {
            inputProps.onInput = (e: any) => {
                this.props.onSearch && this.props.onSearch(e.target.value);
            }
        }

        return (<TextInput {...inputProps} onClick={(e) => this.togglePopover(e, false)} />)
    }

    renderPopover() {
        let listItems: any;
        const popoverProps: NoseurObject<any> = this.props.popoverProps || {};
        popoverProps.matchTargetSize = !this.props.dontMatchTargetSize;
        popoverProps.className = Classname.build("noseur-dropdown-popover", popoverProps.className);
        if (this.props.options) listItems = this.renderOption(this.props.options);
        const popoverHeader = (this.props.popoverHeaderTemplate) ? this.props.popoverHeaderTemplate() : null;
        const popoverFooter = (this.props.popoverFooterTemplate) ? this.props.popoverFooterTemplate() : null;

        const popoverItemsRef = (r: any) => {
            r && this.functionStackManager.popSmoke("POPOVER_REFED", r);
        };

        return (<Popover pointingArrowClassName={null} {...popoverProps}
            manageRef={(r: any) => this.internalPopoverElement = r} ref={this.props.popoverRef}
            onCloseFocusRef={this.props.textInputRef as React.MutableRefObject<any>}
            onShow={this.onDropdownShow} onHide={this.onDropdownHide}>
            {popoverHeader}
            <ul ref={popoverItemsRef} role="listbox" className="noseur-dropdown-popover-list">
                {listItems}
            </ul>
            {popoverFooter}
        </Popover>);
    }

    renderRightContent(optionIsSelected: boolean) {
        let closeIconClassname;
        if (this.props.cleareable && optionIsSelected) {
            closeIconClassname = (<i className={Classname.build("fa fa-close", `${Scheme.DANGER}-tx-hv`)} onClick={(e: any) => {
                e.stopPropagation();
                this.selectOption(e, { primaryIndex: -1, secondaryIndex: -1 });
                if (this.internalTextInputElement && this.props.renderOptionAsPlaceholder) this.internalTextInputElement.placeholder = this.props.placeholder;
            }} />);
        }
        const toggleIcon = TypeChecker.isString(this.props.toggleIcon)
            ? <i className={Classname.build(this.props.toggleIcon, (this.props.scheme ? `${this.props.scheme}-tx` : null))} />
            : this.props.toggleIcon;
        return (<div className={"noseur-dropdown-right-content"}>{closeIconClassname}{toggleIcon}</div>)
    }

    render() {
        const popover = this.renderPopover();
        const selectedOption = this.getSelectedOption();
        const formControlProps = (this.props.formControlProps || {});
        const selectedOptionElement = this.buildSelectedOption(selectedOption);
        const className = Classname.build('noseur-dropdown', this.props.formControlProps?.className, { "noseur-disabled": this.props.disabled });

        return (<React.Fragment>
            <FormControl {...formControlProps} className={className} borderless={this.props.borderless}
                contentStyle={{ width: "initial", ...(formControlProps.style || {}) }} fill={this.props.fill}
                leftContent={this.props.selectedOptionTemplate ? null : this.resolveOptionIcon(selectedOption) || formControlProps.leftContent}
                scheme={this.props.scheme || formControlProps.scheme} ref={(r: any) => this.compoundElement = r} rightContent={this.renderRightContent(!!selectedOption)} onClick={this.togglePopover}>
                {selectedOptionElement}
            </FormControl>
            {popover}
        </React.Fragment>);
    }

}

export const Dropdown = React.forwardRef<NoseurDivElement, Partial<DropdownProps>>((props, ref) => (
    <DropdownComponent {...props} forwardRef={ref as React.ForwardedRef<NoseurDivElement>} />
));

