
import "./Form.css";
import React from 'react';
import { BareInputManageRef } from "./Input";
import { Scheme } from "../constants/Scheme";
import { Classname } from "../utils/Classname";
import { ObjectHelper } from "../utils/ObjectHelper";
import { Orientation } from "../constants/Orientation";
import { Button, ButtonManageRef, ButtonProps, buildButtonControl } from "./Button";
import { ComponentBaseProps } from "../core/ComponentBaseProps";
import { NoseurElement, NoseurObject } from "../constants/Types";

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

export type FileInputFileEventHandler = (file: File) => void;
export type FileInputDialogEventHandler = (event: any) => void;
export type FileInputValidationHandler = (file: File) => string;
export type FileInputSelectFileHandler = (files: File[]) => void;
export type FileInputDragEventHandler = (event: DragEvent) => boolean;
export type FileInputValidationEventHandler = (file: File, error: string) => boolean;
export type FileInputItemTemplateHandler = (options: FileInputItemOptions) => NoseurElement;
export type FileInputFixtureTemplateHandler = (options: FileInputFixtureOptions) => NoseurElement;
export type FileInputMountHandler = (onSelect?: (e?: any) => void, onDrop?: React.DragEventHandler<any>, onDragOver?: React.DragEventHandler<any>) => void;
export type FileInputEmptyTemplateHandler = (onSelect?: (e?: any) => void, onDrop?: React.DragEventHandler<any>, onDragOver?: React.DragEventHandler<any>) => NoseurElement;

export interface FileInputManageRef extends BareInputManageRef<File> {
    select: () => void;
    files: () => File[];
    resolve: () => void;
}

export interface FileInputProps extends ComponentBaseProps<HTMLInputElement, FileInputManageRef> {
    label: string;
    accepts: string;
    multiple: boolean;
    selectOnly: boolean;
    maxFileSize: number;
    mode: FileInputMode;
    defaultFiles: File[];
    noDragAndDrop: boolean;
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
    validateFile: FileInputValidationHandler;
    onSelectFiles: FileInputSelectFileHandler;
    itemTemplate: FileInputItemTemplateHandler;
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
        this.onControlClick = this.onControlClick.bind(this);
        this.destroyElementsListeners = this.destroyElementsListeners.bind(this);
        this.initializeElementsListeners = this.initializeElementsListeners.bind(this);
    }

    componentDidMount() {
        ObjectHelper.resolveManageRef(this, {
            resolve: () => this.initializeElementsListeners,
            select: () => {
                this.onControlClick(ControlType.SELECT);
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
        this.props.onMount && this.props.onMount(() => this.onControlClick(ControlType.SELECT), this.onDrop, this.onDragOver);
        this.initializeElementsListeners();
    }

    componentWillUnmount(): void {
        this.props.onUnMount && this.props.onUnMount(() => this.onControlClick(ControlType.SELECT), this.onDrop, this.onDragOver);
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
                        dragover: this.onDragOver
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
        if (event.currentTarget === this.internalCompoundElement && this.props.noDragAndDrop) return;
        event.preventDefault();
        if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) return;
        this.onSelectFiles(event.dataTransfer.files);
    }

    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.buttonManagerRef?.setLoadingState(false);
        this.props.onChange && this.props.onChange(event);
        if (!event.target || !event.target.files || !event.target.files.length) return;
        this.props.onConfirmDialog && this.props.onConfirmDialog(event);
        this.onSelectFiles(event.target.files);
    }

    onSelectFiles(fileList: FileList) {
        const files: File[] = [];
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

    onControlClick(type: ControlType) {
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
                console.log("WE ARE HERE ----- ", this.internalInputElement, this.internalInputElement?.click)
                if (!this.internalInputElement) return;
                this.buttonManagerRef?.setLoadingState(true);
                this.internalInputElement.click();
        }
    }

    buildInput() {
        const style = this.props.mode === FileInputMode.ELEMENT ? null : { display: "none" };
        const eventProps = ObjectHelper.extractEventProps(this.props, ["onAction", "onRemoveFile", "onBeforeDrop", "onSelectFiles", "onCancelDialog", "onConfirmDialog", "onValidationFail"]);
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
        return (<Button {...props} onClick={() => this.onControlClick(ControlType.SELECT)} manageRef={(r) => {
            if (!r) return;
            this.buttonManagerRef = r;
        }} />);
    }
    
    buildFileItem(index: number, file: File, onRemove: FileInputFileEventHandler) {
        (file as any).key = index;
        const url = URL.createObjectURL(file);
        const className = "noseur-file-input-preview";
        const isTemplated = !!this.props.itemTemplate;
        const formattedSize = ObjectHelper.humanFileSize(file.size, true);
        const removeButton = isTemplated ? null : buildButtonControl(this.props.clearControl, {
            rounded: true,
        }, () => onRemove(file), "noseur-close")
        const previewElement = buildFileInputPreview({
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
        return <div key={index} className={className}>{previewElement}</div>;
    }

    buildInputPreviews() {
        if (!(this.props.mode === FileInputMode.PREVIEW || this.props.mode === FileInputMode.CONTROLLED)) return null;
        if (!this.state.files.length || this.props.selectOnly) {
            if (this.props.emptyTemplate) {
                return this.props.emptyTemplate(() => this.onControlClick(ControlType.SELECT), this.onDrop, this.onDragOver);
            }
            const className = Classname.build("noseur-file-input-preview noseur-file-input-preview-empty",
                (this.props.scheme ? `${this.props.scheme}-bd-cl-hv` : null));
            return (<div className={className} onClick={() => this.onControlClick(ControlType.SELECT)}>
                <i className="fa-solid fa-image"></i>
            </div>);
        }
        return this.state.files.map((file: File, index: number) => this.buildFileItem(index, file, (file: File) => {
            let files = this.state.files;
            const fileIndex = files.findIndex(f => f.name === file.name && f.size === file.size);
            if (fileIndex < -1) return;
            files.splice(fileIndex, 1);
            if (!files.length) {
                if (this.internalInputElement) this.internalInputElement!.files = null;
            }
            this.setState({ files });
            this.props.onRemoveFile && this.props.onRemoveFile(file);
        }));
    }

    renderFixture(isHeader: boolean = true) {
        if (this.props.mode !== FileInputMode.CONTROLLED) return null;
        const selectControl = buildButtonControl(this.props.selectControl, {
            text: "Choose",
            scheme: this.props.scheme,
        }, () => this.onControlClick(ControlType.SELECT), "noseur-close");
        const clearControl = buildButtonControl(this.props.clearControl, {
            text: "Clear",
        }, () => this.onControlClick(ControlType.CLEAR), "noseur-close");
        const actionControl = buildButtonControl(this.props.actionControl, {
            text: "Upload",
            scheme: this.props.scheme,
        }, () => this.onControlClick(ControlType.ACTION), "noseur-close");
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

    render() {
        const input = this.buildInput();
        const header = this.renderFixture();
        const button = this.buildInputButton();
        const footer = this.renderFixture(false);
        const previews = this.buildInputPreviews();
        const className = Classname.build("noseur-file-input", {
            "noseur-file-input-controlled": this.props.mode === FileInputMode.CONTROLLED
        }, this.props.className, (this.props.scheme ? `${this.props.scheme}-vars` : null));
        const previewsClassName = Classname.build("noseur-file-input-previews", this.props.orientation === Orientation.HORIZONTAL ? "noseur-fl-d-r" : "noseur-fl-d-c");

        if (this.props.mode === FileInputMode.ELEMENT) return input;
        return (<div ref={(e) => this.internalCompoundElement = e || undefined} tabIndex={0} className={className} style={this.props.style} onDragOver={this.onDragOver} onDrop={this.onDrop}>
            {input}
            {button}
            {header}
            <div className={previewsClassName}>{previews}</div>
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
    previewType?: FileInputPreviewType;
    onRemove?: FileInputFileEventHandler;
    removeButton?: React.ReactElement<ButtonProps, string | React.JSXElementConstructor<ButtonProps>>;
}

export function buildFileInputPreview(options: FileInputPreviewOption) {
    const file = options.file || new File([], (options.url || "Unknown"));
    let fileType = file.type;
    let previewType: FileInputPreviewType = options.previewType || FileInputPreviewType.AUTO;
    if (previewType === FileInputPreviewType.AUTO) {
        if (fileType.includes("pdf")) previewType = FileInputPreviewType.PDF;
        if (fileType.includes("text")) previewType = FileInputPreviewType.TEXT;
        if (fileType.includes("video")) previewType = FileInputPreviewType.VIDEO;
        if (fileType.includes("image")) previewType = FileInputPreviewType.IMAGE;
        if (fileType.includes("audio")) previewType = FileInputPreviewType.AUDIO;
    }
    const onRemove = options.onRemove;
    const closeButton = options.removeButton;
    const url = options.url || URL.createObjectURL(file);
    const formattedSize = options.formattedSize || ObjectHelper.humanFileSize(file.size, true);
    if (previewType === FileInputPreviewType.IMAGE) {
        return (<React.Fragment>
            <img className="noseur-file-input-preview-image" alt={file.name} src={url} />
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.PDF || previewType === FileInputPreviewType.TEXT) {
        return (<React.Fragment>
            <iframe className="noseur-file-input-preview-image" frameBorder="0" src={url} />
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.VIDEO) {
        return (<React.Fragment>
            <video className="noseur-file-input-preview-video" src={url} controls>
                <source src={url} /> Your browser does not support the video tag.
            </video>
            {closeButton}
        </React.Fragment>);
    } else if (previewType === FileInputPreviewType.AUDIO) {
        return (<React.Fragment>
            <audio className="noseur-file-input-preview-audio" src={url} controls>
                <source src={url} /> Your browser does not support the audio tag.
            </audio>
            {closeButton}
        </React.Fragment>);
    }
    return (<div className="noseur-file-input-preview-binary">
        <i className="fa fa-file" />
        {file.name}
        ({formattedSize})
        {!onRemove ? null : <i className="fa fa-close noseur-close noseur-danger-tx" onClick={() => onRemove(file)} />}
    </div>);
}

