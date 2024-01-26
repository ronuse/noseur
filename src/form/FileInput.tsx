
import "./Form.css";
import React from 'react';
import { BareInputManageRef } from "./Input";
import { Scheme } from "../constants/Scheme";
import { DOMHelper } from "../utils/DOMUtils";
import { Classname } from "../utils/Classname";
import { Alignment } from "../constants/Alignment";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Orientation } from "../constants/Orientation";
import { NoseurElement, NoseurLabel, NoseurObject } from "../constants/Types";
import { Button, ButtonManageRef, ButtonProps, buildButtonControl } from "./Button";
import { ComponentBaseProps, ComponentElementBasicAttributes } from "../core/ComponentBaseProps";

export enum FileInputMode {
    BUTTON,
    PREVIEW,
    ELEMENT,
    CONTROLLED,
}

export enum FileInputPreviewType {
    PDF,
    AUTO,
    NONE,
    HTML,
    TEXT,
    IMAGE,
    VIDEO,
    AUDIO,
    BINARY,
    CUSTOM,
}

export interface FileInputFixtureOptions {
    className: string;
    props: FileInputProps;
    clearControl: NoseurElement;
    selectControl: NoseurElement;
    actionControl: NoseurElement;
}

export interface FileInputItemOptions {
    file: File;
    url: string;
    index: number;
    className: string;
    props: FileInputProps;
    formattedSize: string;
    previewElement: NoseurElement;

    onRemove: FileInputFileEventHandler;
}

enum ControlType {
    CLEAR,
    SELECT,
    ACTION,
}

const defaultButtonProps: Partial<ButtonProps> = {
    text: "Select",
    outlined: true,
    fillOnHover: true,
    loadingProps: {
        disabled: true,
        leftIcon: "fa fa-spinner fa-spin"
    }
}

export interface DragAndDropRefOptions {
    count: number;
    interval: number;
}

export type FileInputDialogEventHandler = (event: any) => void;
export type FileInputValidationHandler = (file: File) => string;
export type FileInputSelectFileHandler = (files: File[]) => void;
export type FileInputDragEventHandler = (event: DragEvent) => boolean;
export type FileInputFileEventHandler = (file: File, event?: Event) => void;
export type FileInputValidationEventHandler = (file: File, error: string) => boolean;
export type FileInputItemTemplateHandler = (options: FileInputItemOptions) => NoseurElement;
export type FileInputFixtureTemplateHandler = (options: FileInputFixtureOptions) => NoseurElement;
export type FileInputMountHandler = (onSelect?: (e?: any) => void, onDrop?: React.DragEventHandler<any>, onDragOver?: React.DragEventHandler<any>) => void;
export type FileInputEmptyTemplateHandler = (onSelect?: (e?: any) => void, onDrop?: React.DragEventHandler<any>, onDragOver?: React.DragEventHandler<any>) => NoseurElement;

export type FileInputAttributtesRelays = {
    label?: {
        alignment?: Alignment;
    } & ComponentElementBasicAttributes;
    preview?: {
        className?: string;
        style?: React.CSSProperties;
    };
}

export interface FileInputManageRef extends BareInputManageRef<File> {
    files: () => File[];
    resolve: () => void;
    select: (e?: Event) => void;
}

export interface FileInputProps extends ComponentBaseProps<HTMLInputElement, FileInputManageRef, FileInputAttributtesRelays> {
    accepts: string;
    rounded: boolean;
    multiple: boolean;
    label: NoseurLabel;
    selectOnly: boolean;
    maxFileSize: number;
    mode: FileInputMode;
    defaultFiles: File[];
    noDragAndDrop: boolean;
    clickToChange: boolean;
    stickyPreview: boolean;
    concatNewFile: boolean;
    orientation: Orientation;
    previewType: FileInputPreviewType;
    buttonProps: Partial<ButtonProps>;
    elementProps: Partial<NoseurObject<any>>;
    clearControl: Partial<ButtonProps> | NoseurElement;
    selectControl: Partial<ButtonProps> | NoseurElement;
    actionControl: Partial<ButtonProps> | NoseurElement;
    dragAndDropRefOptions: Partial<DragAndDropRefOptions>;
    dragAndDropRefs: React.MutableRefObject<HTMLElement>[];

    onMount: FileInputMountHandler;
    onUnMount: FileInputMountHandler;
    onDrop: React.DragEventHandler<any>;
    onAction: FileInputSelectFileHandler;
    onDragOver: React.DragEventHandler<any>;
    onRemoveFile: FileInputFileEventHandler;
    onBeforeDrop: FileInputDragEventHandler;
    onDragBegin: React.DragEventHandler<any>;
    validateFile: FileInputValidationHandler;
    onSelectFiles: FileInputSelectFileHandler;
    itemTemplate: FileInputItemTemplateHandler;
    onDragComplete: React.DragEventHandler<any>;
    onCancelDialog: FileInputDialogEventHandler;
    emptyTemplate: FileInputEmptyTemplateHandler;
    onConfirmDialog: FileInputDialogEventHandler;
    headerTemplate: FileInputFixtureTemplateHandler;
    footerTemplate: FileInputFixtureTemplateHandler;
    onValidationFail: FileInputValidationEventHandler;
}

interface FileInputState {
    files: File[];
    maxFileSizeHumanReadable: string;
}

class FileInputComponent extends React.Component<FileInputProps, FileInputState> {

    public static defaultProps: Partial<FileInputProps> = {
        accepts: "*/*",
        attrsRelay: {},
        elementProps: {},
        defaultFiles: [],
        noDragAndDrop: false,
        scheme: Scheme.SECONDARY,
        mode: FileInputMode.PREVIEW,
        buttonProps: defaultButtonProps,
        orientation: Orientation.VERTICAL,
        previewType: FileInputPreviewType.AUTO,
        clearControl: {
            scheme: Scheme.DANGER,
            leftIcon: "fa fa-times",
        },
        selectControl: {
            leftIcon: "fa fa-plus",
        },
        actionControl: {
            leftIcon: "fa fa-upload",
        },
        dragAndDropRefOptions: {
            count: 20,
            interval: 1000,
        },
    };

    state: FileInputState = {
        files: ObjectHelper.clone(this.props.defaultFiles),
        maxFileSizeHumanReadable: ObjectHelper.humanFileSize(this.props.maxFileSize, true)
    };

    internalLabelElement?: HTMLDivElement | null;
    buttonManagerRef: ButtonManageRef | undefined;
    internalInputElement: HTMLInputElement | undefined;
    internalCompoundElement: HTMLDivElement | undefined;
    internalListenersGabbageCollection: NoseurObject<any>[] = [];

    constructor(props: FileInputProps) {
        super(props);

        this.onDrop = this.onDrop.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragBegin = this.onDragBegin.bind(this);
        this.onDragComplete = this.onDragComplete.bind(this);
        this.onControlClick = this.onControlClick.bind(this);
        this.destroyElementsListeners = this.destroyElementsListeners.bind(this);
        this.initializeElementsListeners = this.initializeElementsListeners.bind(this);
    }

    componentDidMount() {
        this.rePositionLabel();
        ObjectHelper.resolveManageRef(this, {
            resolve: () => this.initializeElementsListeners,
            select: (e?: Event) => {
                this.onControlClick(ControlType.SELECT, e);
            },
            clear: () => {
                if (!this.internalInputElement) return;
                this.internalInputElement.files = null;
                this.setState({ files: [] });
            },
            files: () => {
                if (!this.internalInputElement) return [];
                return ObjectHelper.fileListToFileArray(this.internalInputElement.files);
            },
            value: () => {
                if (!this.internalInputElement) return null;
                const files = ObjectHelper.fileListToFileArray(this.internalInputElement.files);
                return files.length ? files[0] : null;
            },
        });
        this.props.onMount && this.props.onMount((e) => this.onControlClick(ControlType.SELECT, e), this.onDrop, this.onDragOver);
        this.initializeElementsListeners();
    }

    componentDidUpdate(): void {
        this.rePositionLabel();
    }

    rePositionLabel() {
        if (!this.internalLabelElement || !this.internalCompoundElement || !this.props.attrsRelay.label
            || !this.props.attrsRelay.label.alignment) return;
        DOMHelper.alignChildToParent(this.internalCompoundElement, this.internalLabelElement, this.props.attrsRelay.label.alignment);
    }

    componentWillUnmount(): void {
        this.props.onUnMount && this.props.onUnMount((e) => this.onControlClick(ControlType.SELECT, e), this.onDrop, this.onDragOver);
        ObjectHelper.resolveManageRef(this, null);
        this.destroyElementsListeners();
    }

    initializeElementsListeners() {
        this.destroyElementsListeners();
        if (this.props.dragAndDropRefs && this.props.dragAndDropRefs.length) {
            this.props.dragAndDropRefs.forEach((dragAndDropRef) => {
                this.internalListenersGabbageCollection.push({
                    element: dragAndDropRef,
                    events: {
                        drop: this.onDrop,
                        dragover: this.onDragOver,
                        dragenter: this.onDragBegin,
                        dragexit: this.onDragComplete,
                    }
                });
            });
        }
        if (this.internalInputElement) {
            this.internalListenersGabbageCollection.push({
                element: { current: this.internalInputElement },
                events: {
                    cancel: this.onCancel
                }
            });
        }
        const dragAndDropRefOptions = this.props.dragAndDropRefOptions;
        if (!dragAndDropRefOptions.count) dragAndDropRefOptions.count = 20;
        if (!dragAndDropRefOptions.interval) dragAndDropRefOptions.interval = 100;
        for (const record of this.internalListenersGabbageCollection) {
            const { element, events } = record;
            let count = 0;
            const interval = setInterval(() => {
                if (element.current) {
                    Object.keys(events).forEach((type) => {
                        if (element.current.addEventListener) element.current.addEventListener(type, events[type]);
                    });
                    clearInterval(interval);
                    return;
                }
                if ((++count) >= dragAndDropRefOptions.count!) clearInterval(interval);
            }, dragAndDropRefOptions.interval);
        }
    }

    destroyElementsListeners() {
        for (const record of this.internalListenersGabbageCollection) {
            const { element, events } = record;
            Object.keys(events).forEach((type) => {
                element.current?.removeEventListener(type, events[type]);
            });
        }
        this.internalListenersGabbageCollection = [];
    }

    onCancel(event: Event) {
        if (!this.state.files.length && this.internalInputElement?.files?.length) {
            this.onChange(event as any);
            return;
        }
        this.buttonManagerRef?.setLoadingState(false);
        this.props.onCancelDialog && this.props.onCancelDialog(event);
    }

    onDragOver(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
        this.props.onDragOver && this.props.onDragOver(event);
    }

    onDrop(event: React.DragEvent<HTMLElement>) {
        this.props.onDrop && this.props.onDrop(event);
        this.props.onDragComplete && this.props.onDragComplete(event);
        if (event.currentTarget === this.internalCompoundElement && this.props.noDragAndDrop) return;
        event.preventDefault();
        if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) return;
        this.onSelectFiles(event.dataTransfer.files);
    }

    onDragBegin(event: React.DragEvent<HTMLElement>) {
        this.props.onDragBegin && this.props.onDragBegin(event);
    }

    onDragComplete(event: React.DragEvent<HTMLElement>) {
        this.props.onDragComplete && this.props.onDragComplete(event);
    }

    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.buttonManagerRef?.setLoadingState(false);
        this.props.onChange && this.props.onChange(event);
        if (!event.target || !event.target.files || !event.target.files.length) return;
        this.props.onConfirmDialog && this.props.onConfirmDialog(event);
        this.onSelectFiles(event.target.files);
    }

    onSelectFiles(fileList: FileList) {
        const files: File[] = this.props.concatNewFile ? this.state.files : [];
        Array.from(fileList).forEach(file => {
            let errorMessage;
            if (this.props.maxFileSize && file.size > this.props.maxFileSize) {
                errorMessage = `${file.name} exceeds maximum size of ${this.state.maxFileSizeHumanReadable}`;
            } else if (this.props.validateFile) {
                errorMessage = this.props.validateFile(file)
            }
            if (errorMessage && (this.props.onValidationFail && this.props.onValidationFail(file, errorMessage))) {
                return;
            }
            files.push(file);
        });
        if (!files.length) return;
        this.props.onSelectFiles && this.props.onSelectFiles(files);
        this.setState({ files });
    }

    onControlClick(type: ControlType, event?: Event) {
        event?.stopPropagation();
        switch (type) {
            case ControlType.CLEAR:
                if (this.internalInputElement) this.internalInputElement.files = null;
                this.setState({ files: ObjectHelper.clone(this.props.defaultFiles) });
                break;
            case ControlType.ACTION:
                this.props.onAction && this.props.onAction(this.state.files);
                break;
            case ControlType.SELECT:
            default:
                if (!this.internalInputElement) return;
                this.buttonManagerRef?.setLoadingState(true);
                this.internalInputElement.click();
        }
    }

    buildInput() {
        const style = this.props.mode === FileInputMode.ELEMENT ? null : { display: "none" };
        const eventProps = ObjectHelper.extractEventProps(this.props, [
            "onAction", "onRemoveFile", "onBeforeDrop", "onSelectFiles",
            "onCancelDialog", "onConfirmDialog", "onValidationFail", "onDragBegin", "onDragComplete"
        ]);
        const props: any = {
            style,
            ...eventProps,
            id: this.props.id,
            name: this.props.name,
            onChange: this.onChange,
            ...this.props.elementProps,
            accept: this.props.accepts,
            multiple: this.props.multiple,
            ref: (r: any) => {
                if (!r) return;
                this.internalInputElement = r;
                ObjectHelper.resolveRef(this.props.forwardRef, r);
            },
        };
        if (this.props.mode === FileInputMode.ELEMENT) {
            props.style = { ...(this.props.style || {}), ...props };
            props.className = Classname.build(this.props.className, props.className);
        }
        return (<input type="file" {...props} />);
    }

    buildInputButton() {
        if (this.props.mode !== FileInputMode.BUTTON) return null;
        const props = {
            ...defaultButtonProps,
            ...this.props.buttonProps,
            scheme: this.props.scheme,
        };
        return (<Button {...props} onClick={(e: any) => this.onControlClick(ControlType.SELECT, e)} manageRef={(r) => {
            if (!r) return;
            this.buttonManagerRef = r;
        }} />);
    }

    buildFileItem(index: number, file: File, onRemove: FileInputFileEventHandler) {
        (file as any).key = index;
        const url = URL.createObjectURL(file);
        const isTemplated = !!this.props.itemTemplate;
        const formattedSize = ObjectHelper.humanFileSize(file.size, true);
        const className = Classname.build("noseur-file-input-preview", this.props.attrsRelay.preview?.className, {
            "noseur-cursor-pointer": this.props.clickToChange
        });
        const removeButton = this.props.stickyPreview || isTemplated ? null : buildButtonControl(this.props.clearControl, {
            rounded: true,
        }, (e) => onRemove(file, e), "noseur-close")
        const previewElement = fileInputBuildFileInputPreview({
            url,
            file,
            onRemove,
            removeButton,
            formattedSize,
            previewType: this.props.previewType,
        });
        const options: FileInputItemOptions = {
            url,
            file,
            index,
            onRemove,
            className,
            formattedSize,
            previewElement,
            props: this.props,
        };
        if (isTemplated) return this.props.itemTemplate(options);
        return <div key={index} className={className} onClick={this.props.clickToChange ? (e: any) => this.onControlClick(ControlType.SELECT, e) : undefined} >{previewElement}</div>;
    }

    buildInputPreviews() {
        if (!(this.props.mode === FileInputMode.PREVIEW || this.props.mode === FileInputMode.CONTROLLED)) return null;
        if (!this.state.files.length || this.props.selectOnly) {
            if (this.props.emptyTemplate) {
                return this.props.emptyTemplate((e?: any) => this.onControlClick(ControlType.SELECT, e), this.onDrop, this.onDragOver);
            }
            const className = Classname.build("noseur-file-input-preview noseur-file-input-preview-empty",
                (this.props.scheme ? `${this.props.scheme}-bd-cl-hv` : null));
            return (<div className={className} onClick={(e?: any) => this.onControlClick(ControlType.SELECT, e)}>
                <i className="fa-solid fa-image"></i>
            </div>);
        }
        return this.state.files.map((file: File, index: number) => this.buildFileItem(index, file, (file: File, event?: Event) => {
            event?.stopPropagation();
            let files = this.state.files;
            const fileIndex = files.findIndex(f => f.name === file.name && f.size === file.size);
            if (fileIndex < -1) return;
            files.splice(fileIndex, 1);
            if (!files.length) {
                if (this.internalInputElement) this.internalInputElement!.files = null;
            }
            this.setState({ files });
            this.props.onRemoveFile && this.props.onRemoveFile(file, event);
        }));
    }

    renderFixture(isHeader: boolean = true) {
        if (this.props.mode !== FileInputMode.CONTROLLED) return null;
        const selectControl = buildButtonControl(this.props.selectControl, {
            text: "Choose",
            scheme: this.props.scheme,
        }, (e) => this.onControlClick(ControlType.SELECT, e), "noseur-close");
        const clearControl = buildButtonControl(this.props.clearControl, {
            text: "Clear",
        }, (e) => this.onControlClick(ControlType.CLEAR, e), "noseur-close");
        const actionControl = buildButtonControl(this.props.actionControl, {
            text: "Upload",
            scheme: this.props.scheme,
        }, (e) => this.onControlClick(ControlType.ACTION, e), "noseur-close");
        const options: FileInputFixtureOptions = {
            clearControl,
            actionControl,
            selectControl,
            props: this.props,
            className: Classname.build("noseur-file-input-fixture", {
                "noseur-file-input-header": isHeader,
                "noseur-file-input-footer": !isHeader,
            })
        }
        if (!isHeader) {
            return this.props.footerTemplate ? this.props.footerTemplate(options) : null;
        }
        if (this.props.headerTemplate) return this.props.headerTemplate(options);
        return (<div className={options.className}>
            {selectControl}
            {actionControl}
            {clearControl}
        </div>);
    }

    buildLabel() {
        if (!this.props.label) return;
        const onClick = (e: any) => this.onControlClick(ControlType.SELECT, e);
        const className = Classname.build("noseur-file-input-label", this.props.attrsRelay.label?.className);
        return (<div ref={(r) => this.internalLabelElement = r} onClick={onClick} className={className} style={this.props.attrsRelay.label?.style} id={this.props.attrsRelay.label?.id}>{this.props.label}</div>);
    }

    render() {
        const input = this.buildInput();
        const label = this.buildLabel();
        const header = this.renderFixture();
        const button = this.buildInputButton();
        const footer = this.renderFixture(false);
        const previews = this.buildInputPreviews();
        const className = Classname.build("noseur-file-input", {
            "noseur-rounded-bd": this.props.rounded,
            "noseur-file-input-controlled": this.props.mode === FileInputMode.CONTROLLED
        }, this.props.className, (this.props.scheme ? `${this.props.scheme}-vars` : null));
        const previewsClassName = Classname.build("noseur-file-input-previews", this.props.orientation === Orientation.HORIZONTAL ? "noseur-fl-d-r" : "noseur-fl-d-c");

        if (this.props.mode === FileInputMode.ELEMENT) return input;
        return (<div ref={(e: any) => {
            if (!!this.internalCompoundElement && !e) this.componentWillUnmount();
            this.internalCompoundElement = e;
        }} tabIndex={0} className={className} style={this.props.style} onDragOver={this.onDragOver} onDragEnter={this.onDragBegin} onDragExit={this.onDragComplete} onDrop={this.onDrop}>
            {input}
            {button}
            {header}
            <div className={previewsClassName}>{previews}</div>
            {label}
            {footer}
        </div>);
    }

}

export const FileInput = React.forwardRef<HTMLInputElement, Partial<FileInputProps>>((props, ref) => (
    <FileInputComponent {...props} forwardRef={ref as React.ForwardedRef<HTMLInputElement>} />
));

export interface FileInputPreviewOption {
    file?: File;
    url?: string;
    formattedSize?: string;
    style?: React.CSSProperties;
    ref?: React.ForwardedRef<any>;
    previewType?: FileInputPreviewType;
    onRemove?: FileInputFileEventHandler;
    removeButton?: React.ReactElement<ButtonProps, string | React.JSXElementConstructor<ButtonProps>>;
}

export function fileInputBuildFileInputPreview(options: FileInputPreviewOption) {
    const file = options.file || new File([], (options.url || "Unknown "));
    let fileType = file.type;
    let previewType: FileInputPreviewType = options.previewType || FileInputPreviewType.AUTO;
    if (previewType === FileInputPreviewType.AUTO) {
        if (fileType.includes("pdf")) previewType = FileInputPreviewType.PDF;
        if (fileType.includes("text")) previewType = FileInputPreviewType.TEXT;
        if (fileType.includes("html")) previewType = FileInputPreviewType.HTML;
        if (fileType.includes("video")) previewType = FileInputPreviewType.VIDEO;
        if (fileType.includes("image")) previewType = FileInputPreviewType.IMAGE;
        if (fileType.includes("audio")) previewType = FileInputPreviewType.AUDIO;
    }
    const onRemove = options.onRemove;
    const closeButton = options.removeButton;
    const url = (file as any).__noseur__url__ ?? options.url ?? URL.createObjectURL(file);
    const formattedSize = options.formattedSize || ObjectHelper.humanFileSize(file.size, true);
    if (previewType === FileInputPreviewType.IMAGE) {
        return (<React.Fragment>
            <img ref={options.ref} className="noseur-file-input-preview-image" style={options.style} alt={file.name} src={url} />
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.HTML) {
        return (<React.Fragment>
            <iframe ref={options.ref} className="noseur-file-input-preview-html" style={options.style} frameBorder="0" srcDoc={url} />
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.PDF || previewType === FileInputPreviewType.TEXT) {
        return (<React.Fragment>
            <iframe ref={options.ref} className="noseur-file-input-preview-pdf-text" style={options.style} frameBorder="0" src={url} />
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.VIDEO) {
        return (<React.Fragment>
            <video ref={options.ref} className="noseur-file-input-preview-video" style={options.style} src={url} controls>
                <source src={url} /> Your browser does not support the video tag.
            </video>
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.AUDIO) {
        return (<React.Fragment>
            <audio ref={options.ref} className="noseur-file-input-preview-audio" style={options.style} src={url} controls>
                <source src={url} /> Your browser does not support the audio tag.
            </audio>
            {closeButton}
        </React.Fragment>);
    }
    return (<div ref={options.ref} className="noseur-file-input-preview-binary" style={options.style} >
        <i className="fa fa-file" />
        {file.name}
        ({formattedSize})
        {!onRemove ? null : <i className="fa fa-close noseur-close noseur-danger-tx" onClick={(e: any) => onRemove(file, e)} />}
    </div>);
}

export function fileInputFileFromUrl(url: string, name: string = "not-specified", type: string = "*/*") {
    const file = new File([], name, { type });
    (file as any).__noseur__url__ = url;
    return file;
}

