
import { BoolHelper } from "./BoolHelper";
import { NoseurObject } from "../constants/Types";
import { Alignment } from "../constants/Alignment";
import { Orientation } from "../constants/Orientation";
import { Bound, Ceiling, Direction } from "../constants/Direction";

let __noseurGlobal__Browser: NoseurObject<any>;
let uniqueElementIdsCounter: NoseurObject<number> = {};

let cachedCanvas = null as any as HTMLCanvasElement;

export const DOMHelper = {

	uniqueElementId(prefix: string = 'noseur-auto-id-') {
		if (!(prefix in uniqueElementIdsCounter)) {
			uniqueElementIdsCounter[prefix] = 1;
		}
		return prefix + (uniqueElementIdsCounter[prefix]++)
	},

	isElement(element: any) {
		return element instanceof Element || element instanceof HTMLDocument;
	},

	getBrowser() {
		if (!__noseurGlobal__Browser) {
			let matched = this.resolveUserAgent();
			__noseurGlobal__Browser = {};

			if (matched.browser) {
				__noseurGlobal__Browser[matched.browser] = true;
				__noseurGlobal__Browser['version'] = matched.version;
			}
			if (__noseurGlobal__Browser['chrome']) {
				__noseurGlobal__Browser['webkit'] = true;
			} else if (__noseurGlobal__Browser['webkit']) {
				__noseurGlobal__Browser['safari'] = true;
			}
		}

		return __noseurGlobal__Browser;
	},

	resolveUserAgent() {
		let ua = navigator.userAgent.toLowerCase();
		let match = /(chrome)[ ]([\w.]+)/.exec(ua) ||
			/(webkit)[ ]([\w.]+)/.exec(ua) ||
			/(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) ||
			/(msie) ([\w.]+)/.exec(ua) ||
			(ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
			[];

		return {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	},

	hasClass(element: Element, className: string) {
		if (!element || !className) return false;
		if (element.classList) {
			return element.classList.contains(className);
		} else {
			return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
		}
	},

	addClass(element: Element, className: string) {
		if (!element || !className) return;
		if (element.classList) {
			element.classList.add(className);
		} else {
			element.className += ' ' + className;
		}
	},

	removeClass(element: Element, className: string) {
		if (!element || !className) return;
		if (element.classList) {
			element.classList.remove(className);
		} else {
			element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},

	getTarget: (event: any) => event.target || event.currentTarget,

	getElementOffset(element: Element, defaultValue?: NoseurObject<any>) {
		if (!element) {
			return defaultValue || {
				top: 'auto',
				left: 'auto'
			};
		}
		let rect = element.getBoundingClientRect();
		return {
			top: rect.top + (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0),
			left: rect.left + (window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0),
		};

	},

	getElementRectWithOffset(element: Element) {
		const rect = element.getBoundingClientRect();
		return {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
			top: rect.top + (window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0),
			left: rect.left + (window.scrollX ?? document.documentElement.scrollLeft ?? document.body.scrollLeft ?? 0),
		};

	},

	getDocumentScrollTop() {
		let doc = document.documentElement;
		return (window.scrollY || doc.scrollTop) - (doc.clientTop || 0);
	},

	getDocumentScrollLeft() {
		let doc = document.documentElement;
		return (window.scrollX || doc.scrollLeft) - (doc.clientLeft || 0);
	},

	getViewport() {
		let win = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			w = win.innerWidth || e.clientWidth || g.clientWidth,
			h = win.innerHeight || e.clientHeight || g.clientHeight;

		return { width: w, height: h };
	},

	getHiddenElementDimensions(_: any) {
		return { width: 100, height: 100 };
	},

	sanitizeStyleValue(dirtyValue: string): number {
		return parseInt((dirtyValue || "0")
			.replace(/%/g, "")
			.replace(/px/g, "")
			.replace(/sp/g, "")
			.replace(/rem/g, ""));
	},

	getElementStyle(element: any): CSSStyleDeclaration {
		return element.currentStyle ?? (window.getComputedStyle ? window.getComputedStyle(element) : element.style);
	},

	getElementWidth(element: any, excludeMargin = false) {
		const elementRect = element.getBoundingClientRect();
		const style = element.currentStyle ?? window.getComputedStyle(element);
		return elementRect.width + (excludeMargin ? 0 : (parseInt(style.marginLeft) + parseInt(style.marginRight))) + parseInt(style.paddingLeft) + parseInt(style.paddingRight);
	},

	getElementHeight(element: any, excludeMargin = false) {
		const elementRect = element.getBoundingClientRect();
		const style = element.currentStyle ?? window.getComputedStyle(element);
		return elementRect.height + (excludeMargin ? 0 : (parseInt(style.marginTop) + parseInt(style.marginBottom))) + parseInt(style.paddingTop) + parseInt(style.paddingBottom);
	},

	getElementSuperfluousWidth(element: any, withPadding?: boolean) {
		const style = element.currentStyle ?? window.getComputedStyle(element);
		let width = parseInt(style.marginLeft) + parseInt(style.marginRight);
		if (withPadding) width += (parseInt(style.paddingLeft) + parseInt(style.paddingRight));
		return width;
	},

	getElementSuperfluousHeight(element: any, withPadding?: boolean) {
		const style = element.currentStyle ?? window.getComputedStyle(element);
		let height = parseInt(style.marginTop) + parseInt(style.marginBottom)
		if (withPadding) height += (parseInt(style.paddingTop) + parseInt(style.paddingBottom));
		return height;
	},

	absolutePositionRelatively(element: any, target: any, horizontal: "left" | "right" = "right") {
		if (!element || !target || !target.getBoundingClientRect) return;
		let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
		let targetOuterWidth = target.offsetWidth;
		let targetOuterHeight = target.offsetHeight;
		let elementOuterWidth = elementDimensions.width;
		let elementOuterHeight = elementDimensions.height;
		let targetOffset = target.getBoundingClientRect();
		let windowScrollTop = this.getDocumentScrollTop();
		let windowScrollLeft = this.getDocumentScrollLeft();
		let viewport = this.getViewport();
		let top, left, operator;
		let elementStyle = element.currentStyle || window.getComputedStyle(element);
		const elementMarginTop = this.sanitizeStyleValue(elementStyle!.marginTop);
		const elementMarginLeft = this.sanitizeStyleValue(elementStyle!.marginLeft);

		if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
			top = targetOffset.top + windowScrollTop - elementOuterHeight;
			if (top < 0) top = windowScrollTop;
			element.style.transformOrigin = 'bottom';
			operator = "-";
		} else {
			top = targetOuterHeight + targetOffset.top + windowScrollTop;
			element.style.transformOrigin = 'top';
			operator = "+";
		}
		if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width) {
			//left = targetOffset.left;
			left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
		} else {
			left = targetOffset.left + windowScrollLeft;
		}
		if (horizontal === "right") {
			element.style.left = (left - elementMarginLeft) + 'px';
		} else {
			element.style.left = (elementMarginLeft) + 'px';
		}
		element.style.top = `calc(${(top - elementMarginTop) + 'px'} ${operator} var(--componentMarginTopOrBottom, 0px))`;
	},

	appendChild(element: any, target: any) {
		if (this.isElement(target)) {
			target.appendChild(element);
		} else if (target && target.el && target.el.nativeElement) {
			target.el.nativeElement.appendChild(element);
		} else {
			throw new Error('AppendChild: Cannot append ' + target + ' to ' + element);
		}
	},

	convertToCamelCase(styleKey: any) {
		if (styleKey.indexOf("-") < 0) return styleKey;
		let newStyleKey = "";
		for (let index = 0; index < styleKey.length; index++) {
			let ch = styleKey[index];
			if (ch === '-') {
				if (index + 1 < styleKey.length) {
					newStyleKey += styleKey[++index].toUpperCase();
				}
				continue;
			}
			newStyleKey += ch;
		}
		return newStyleKey;
	},

	matchStyles(sourceElement: any, targetElements: any, styleKeys: any,
		cb?: (styleKey: string, styleValue: string, sourceComputedStyle: CSSStyleDeclaration, targetComputedStyle: CSSStyleDeclaration) => string) {
		if (!sourceElement || !targetElements || !styleKeys ||
			!targetElements.length || !styleKeys.length ||
			targetElements.length < 1 || styleKeys.length < 1) return;

		styleKeys.forEach((styleKey: any) => {
			const sourceComputedStyle = window.getComputedStyle(sourceElement, null);
			const styleProp = sourceComputedStyle.getPropertyValue(styleKey);
			targetElements.forEach((targetElement: any) => {
				if (!targetElement.style) targetElement.style = {};
				const targetComputedStyle = window.getComputedStyle(targetElement, null);
				targetElement.style[this.convertToCamelCase(styleKey)] = (cb ? cb(styleKey, styleProp, sourceComputedStyle, targetComputedStyle) : styleProp);
			});
		});
	},

	remToPx: (value: number) => value * 16,
	pxToRem: (value: number) => value / 16,

	calculateContentHeight(el: any, scanAmount: any) {
		let origHeight = el.style.height,
			height = el.offsetHeight,
			scrollHeight = el.scrollHeight,
			overflow = el.style.overflow;
		if (height >= scrollHeight) {
			el.style.height = (height + scanAmount) + 'px';
			el.style.overflow = 'hidden';
			if (scrollHeight < el.scrollHeight) {
				while (el.offsetHeight >= el.scrollHeight) {
					el.style.height = (height -= scanAmount) + 'px';
				}
				while (el.offsetHeight < el.scrollHeight) {
					el.style.height = (height++) + 'px';
				}
				el.style.height = origHeight;
				el.style.overflow = overflow;
				return height;
			}
		} else {
			return scrollHeight;
		}
	},

	calculateLines(el: any) {
		let style = (window.getComputedStyle) ? window.getComputedStyle(el) : el.currentStyle;
		let lineHeight = style.lineHeight; if (lineHeight === "normal") lineHeight = 1.2;
		lineHeight = parseInt(lineHeight, 10);
		let taHeight = DOMHelper.calculateContentHeight(el, lineHeight);
		return Math.ceil(taHeight / lineHeight);
	},

	calculateHeight(el: any) {
		let style = (window.getComputedStyle) ? window.getComputedStyle(el) : el.currentStyle;
		let lineHeight = style.lineHeight; if (lineHeight === "normal") lineHeight = 1.2;
		lineHeight = parseInt(lineHeight, 10);
		const lineCount = DOMHelper.calculateLines(el);
		if (Number.isNaN(lineCount)) return parseInt(style.height, 10) - lineHeight;
		return Math.ceil(DOMHelper.calculateLines(el) * lineHeight);
	},

	inViewport(el: HTMLElement, con?: any, orientation: Orientation = Orientation.HORIZONTAL_VERTICAL) {
		if (!con) con = document.documentElement;
		let elRect = el.getBoundingClientRect();
		let conRect = con.getBoundingClientRect();
		let elReactVerticalOffsetTop = elRect.y - elRect.height;
		let elReactVerticalOffsetBottom = (elRect.y - conRect.y) + elRect.height;
		let elReactHorizontalOffsetLeft = elRect.x - elRect.width;
		let elReactHorizontalOffsetRight = (elRect.x - conRect.x) + elRect.width;
		const inViewportVerticallyTop = elReactVerticalOffsetTop >= 0 && elReactVerticalOffsetTop <= conRect.height;
		const inViewportVerticallyBottom = elReactVerticalOffsetBottom >= 0 && elReactVerticalOffsetBottom <= conRect.height;
		const inViewportVerticallyLeft = elReactHorizontalOffsetLeft >= 0 && elReactHorizontalOffsetLeft <= conRect.width;
		const inViewportVerticallyRight = elReactHorizontalOffsetRight >= 0 && elReactHorizontalOffsetRight <= conRect.width;
		const inViewportVertically = inViewportVerticallyTop || inViewportVerticallyBottom;
		const inViewportHorizontally = inViewportVerticallyLeft || inViewportVerticallyRight;
		if (orientation === Orientation.VERTICAL) return inViewportVertically;
		if (orientation === Orientation.HORIZONTAL) return inViewportHorizontally;
		if (orientation === Orientation.HORIZONTAL_OR_VERTICAL) return inViewportVertically || inViewportHorizontally;
		return inViewportVertically && inViewportHorizontally;
	},

	getElementParents(element: Node, parents: any[] = []): Node[] {
		return (element.parentNode) ? this.getElementParents(element.parentNode, parents.concat([element.parentNode])) : parents;
	},

	findParentElement(child: any, cond: (node: any) => boolean): Node {
		const elementParent = child.parentNode;
		if (cond(elementParent) || elementParent.tagName === "BODY" || elementParent.nodeType === 9) return elementParent;
		return DOMHelper.findParentElement(elementParent, cond);
	},

	alignChildToParent(parent: any, child: any, alignment: Alignment) {
		let left, top;
		const labelRect = child.getBoundingClientRect();
		const compoundRect = DOMHelper.getElementRectWithOffset(parent);
		const labelSuperfluousWidth = DOMHelper.getElementSuperfluousWidth(child);
		const labelSuperfluousHeight = DOMHelper.getElementSuperfluousHeight(child);
		const compoundParentElement = DOMHelper.findParentElement(parent, (el: Element) => {
			let style = (window.getComputedStyle) ? window.getComputedStyle(el) : (el as any).currentStyle;
			return style.position === "relative";
		}) as Element;
		const compoundParentRect = DOMHelper.getElementRectWithOffset(compoundParentElement);
		switch (alignment) {
			case Alignment.TOP:
			case Alignment.TOP_CENTER:
				left = ((compoundRect.width / 2) - labelSuperfluousWidth);
				break;
			case Alignment.TOP_RIGHT:
				left = ((compoundRect.width - labelRect.width) + compoundRect.x - labelSuperfluousWidth);
				break;
			case Alignment.BOTTOM:
			case Alignment.BOTTOM_CENTER:
				left = ((compoundRect.width / 2) - labelSuperfluousWidth);
				top = ((compoundRect.top + compoundRect.height) - labelRect.height - labelSuperfluousHeight);
				break;
			case Alignment.BOTTOM_LEFT:
				top = ((compoundRect.top + compoundRect.height) - labelRect.height - labelSuperfluousHeight);
				break;
			case Alignment.BOTTOM_RIGHT:
				left = ((compoundRect.width - labelRect.width) + compoundRect.x - labelSuperfluousWidth);
				top = ((compoundRect.top + compoundRect.height) - labelRect.height - labelSuperfluousHeight);
				break;
			case Alignment.CENTER:
				left = ((compoundRect.width / 2) - labelSuperfluousWidth);
				top = ((compoundRect.top + (compoundRect.width / 2)) - labelRect.height + labelSuperfluousHeight);
				break;
			case Alignment.CENTER_LEFT:
				top = ((compoundRect.top + (compoundRect.width / 2)) - labelRect.height - labelSuperfluousHeight);
				break;
			case Alignment.CENTER_RIGHT:
				left = ((compoundRect.width - labelRect.width) + compoundRect.x - labelSuperfluousWidth);
				top = ((compoundRect.top + (compoundRect.width / 2)) - labelRect.height - labelSuperfluousHeight);
				break;
		}
		if (top && compoundParentElement.tagName !== "BODY") top -= compoundParentRect.top;
		if (left && compoundParentElement.tagName !== "BODY") left -= compoundParentRect.left;
		child.style.top = top ? `${top}px` : "inherit";
		child.style.left = left ? `${left}px` : "inherit";
	},

	elementParent(el: HTMLElement) {
		return el.parentNode;
	},

	elementRelativeAndAbsolutePositions(el: HTMLElement, evt: { clientX: number; clientY: number; }, boundToParent?: boolean | Bound, allowedOverflow: number = 0, direction: Direction = Direction.ALL, ceiling?: Ceiling) {
		const parent = DOMHelper.elementParent(el);
		const rect = DOMHelper.getElementRectWithOffset(el);
		const parentRect = DOMHelper.getElementRectWithOffset(parent as any);

		const scrollY = window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;
		const scrollX = window.scrollX ?? document.documentElement.scrollLeft ?? document.body.scrollLeft ?? 0;
		let x = (evt.clientX + scrollX) - parentRect.x;
		let y = (evt.clientY + scrollY) - parentRect.y;
		let clientTop = (evt.clientY + scrollY) - (rect.height / 2);
		let clientLeft = (evt.clientX + scrollX) - (rect.width / 2);
		let top = clientTop;
		let left = clientLeft;
		if (boundToParent) {
			const bound = boundToParent === true || (boundToParent as any) === Bound.ALL;
			if ((bound || boundToParent === Bound.LEFT) && x < 0) x = 0;
			if ((bound || boundToParent === Bound.TOP) && y < 0) y = 0;
			if ((bound || boundToParent === Bound.TOP) && top < 0) top = 0;
			if ((bound || boundToParent === Bound.LEFT) && left < 0) left = 0;

			if ((bound || boundToParent === Bound.RIGHT) && x > parentRect.width) x = parentRect.width;
			if ((bound || boundToParent === Bound.BOTTOM) && y > parentRect.height) y = parentRect.height;
			if ((bound || boundToParent === Bound.TOP) && top < (parentRect.top - allowedOverflow)) top = (parentRect.top - allowedOverflow);
			if ((bound || boundToParent === Bound.LEFT) && left < (parentRect.left - allowedOverflow)) left = (parentRect.left - allowedOverflow);
			if ((bound || boundToParent === Bound.BOTTOM) && top > (parentRect.height + parentRect.top - (rect.height - allowedOverflow))) top = ((parentRect.height + parentRect.top) - (rect.height - allowedOverflow));
			if ((bound || boundToParent === Bound.RIGHT) && left > (parentRect.width + parentRect.left - (rect.width - allowedOverflow))) left = ((parentRect.width + parentRect.left) - (rect.width - allowedOverflow));
		}
		if (ceiling) {
			if (ceiling.top && top < ceiling.top) top = ceiling.top;
			if (ceiling.left && left < ceiling.left) left = ceiling.left;
			if (ceiling.right && left > ceiling.right) left = ceiling.right;
			if (ceiling.bottom && top > ceiling.bottom) top = ceiling.bottom;
		}
		if (BoolHelper.equalsAny(direction, [Direction.NORTH, Direction.SOUTH, Direction.NORTH_SOUTH])) {
			x = rect.x;
			left = rect.left;
			if ((direction === Direction.NORTH && top > rect.top) || (direction === Direction.SOUTH && top < rect.top)) {
				y = rect.y;
				top = rect.top;
			}
		}
		if (BoolHelper.equalsAny(direction, [Direction.EAST, Direction.WEST, Direction.EAST_WEST])) {
			y = rect.y;
			top = rect.top;
			if ((direction === Direction.EAST && left < rect.left) || (direction === Direction.WEST && left > rect.left)) {
				x = rect.x;
				left = rect.left;
			}
		}
		// Handle other cardinal point NW, SW, NE, SE - overkill?

		return {
			x,
			y,
			top,
			left,
			scrollY,
			scrollX,
			parentRect,
			clientTop,
			clientLeft,
			clientX: evt.clientX,
			clientY: evt.clientY,
		}
	},

	positionElement(el: HTMLElement, position: { x: number; y: number; }) {
		el.style.position = "absolute";
		el.style.left = position.x + 'px';
		el.style.top = position.y + 'px';
	},

	copyToClipboard(text: string, cb?: (err?: any) => void) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(() => cb?.(), (err: any) => cb?.(err));
			return;
		}
		if ((window as any).clipboardData && (window as any).clipboardData.setData) {
			return (window as any).clipboardData.setData("Text", text);

		} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
			var textarea = document.createElement("textarea");
			textarea.textContent = text;
			textarea.style.position = "fixed";
			document.body.appendChild(textarea);
			textarea.select();
			try {
				document.execCommand("copy");
				cb?.();
			} catch (ex) {
				cb?.(ex);
				return prompt("Copy to clipboard: Ctrl+C, Enter", text);
			} finally {
				document.body.removeChild(textarea);
			}
		}
	},


	getImageAspectRatio(image: HTMLImageElement) {
		const w = image.naturalWidth;
		const h = image.naturalHeight;
		return (w > h ? w / h : h / w);
	},

	getSizeRelativeToImageAspectRatio(image: HTMLImageElement, size: { width?: number; height?: number; }, mutate?: "WIDTH" | "HEIGHT" | "WIDTH_HEIGHT") {
		const w = image.naturalWidth;
		const h = image.naturalHeight;
		const newSize = {
			width: size.width ?? w,
			height: size.height ?? h,
		};
		const widthGreater = w > h;
		const aspectRation = (widthGreater ? w / h : h / w);
		if (!size.height || (mutate === "HEIGHT" || mutate === "WIDTH_HEIGHT")) {
			if (widthGreater) {
				newSize.height = (newSize.width / aspectRation);
			} else {
				newSize.height = (newSize.width * aspectRation);
			}
		}
		if (!size.width || (mutate === "WIDTH" || mutate === "WIDTH_HEIGHT")) {
			if (widthGreater) {
				newSize.width = ((newSize.height) * aspectRation);
			} else {
				newSize.width = (newSize.height / aspectRation);
			}
		}

		return newSize;
	},

	getCanvasFont(el: HTMLElement) {
		const elementStyle = DOMHelper.getElementStyle(el);
		const fontWeight = elementStyle.fontWeight
		const fontSize = elementStyle.fontSize ?? "16px";
		const fontFamily = elementStyle.fontFamily ?? 'Times New Roman';
		return `${fontWeight} ${fontSize} ${fontFamily}`;
	},

	// https://stackoverflow.com/a/21015393/6626422
	getTextWidth(text: string, el: HTMLElement) {
		if (!cachedCanvas) {
			cachedCanvas = document.createElement("canvas");
		}
		const context = cachedCanvas.getContext("2d");
		context!.font = DOMHelper.getCanvasFont(el);
		const metrics = context!.measureText(text);
		return metrics.width;
	},

	async imageDataFromFileBlock(fileBlob: any) {
		const bitmap = await createImageBitmap(fileBlob);
		const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
		const context = canvas.getContext('2d')! as any;
		context.drawImage(bitmap, 0, 0);
		return {
			width: bitmap.width,
			height: bitmap.height,
			imageData: context.getImageData(0, 0, bitmap.width, bitmap.height),
		};
	},

};

export const ScrollHandler = {

	querySelector(element: Element, selector: any) {
		if (!element) return null;
		return element.querySelector(selector);
	},

	getScrollableParents(element: Node, nuclearParentOnly: boolean = false): Node[] {
		let scrollableParents: any[] = [];
		if (!element) return scrollableParents;

		let elementParents = DOMHelper.getElementParents(element);
		const scrollRegex = /(auto|scroll|visible)/;
		const checkIfScrollable = (node: Element) => {
			let cssStyleDeclaration = window['getComputedStyle'](node, null);
			return scrollRegex.test(cssStyleDeclaration.getPropertyValue('overflow')) ||
				scrollRegex.test(cssStyleDeclaration.getPropertyValue('overflowX')) ||
				scrollRegex.test(cssStyleDeclaration.getPropertyValue('overflowY'));
		};
		for (let elementParent of elementParents) {
			let scrollSelectors = elementParent.nodeType === 1 && (elementParent as any).dataset['scrollselectors'];
			if (scrollSelectors) {
				let selectors = scrollSelectors.split(',');
				for (let selector of selectors) {
					let el = this.querySelector(elementParent as Element, selector);
					if (el && checkIfScrollable(el)) scrollableParents.push(el);
				}
			}
			if (elementParent.nodeType !== 9 && checkIfScrollable(elementParent as Element)) {
				scrollableParents.push(elementParent);
			} else if (elementParent.nodeType === 9) {
				scrollableParents.push(window);
			}
			if (nuclearParentOnly && scrollableParents.length) break;
		}
		return scrollableParents;
	},

	attachScrollListener(scrollableParents: Node[], listener: any) {
		if (!scrollableParents || scrollableParents.length === 0) return;
		for (let index = 0; index < scrollableParents.length; index++) {
			scrollableParents[index].addEventListener('scroll', listener);
		}
	},

	detachScrollListener(scrollableParents: Node[], listener: any) {
		if (!scrollableParents || scrollableParents.length === 0) return;
		for (let index = 0; index < scrollableParents.length; index++) {
			scrollableParents[index].removeEventListener('scroll', listener);
		}
	},

	handle(element: Node | Node[], listener: any, nuclearParentOnly: boolean = false) {
		const scrollableParents: Node[] = !element ? [] : (Array.isArray(element) ? element : this.getScrollableParents(element, nuclearParentOnly));
		return {
			attach: () => this.attachScrollListener(scrollableParents, listener),
			detach: () => this.detachScrollListener(scrollableParents, listener),
		}
	},

};

export enum BaseZIndex {
	MENU = 1000,
	MODAL = 1001,
	TOAST = 1002,
	OVERLAY = 1003,
	TOOLTIP = 1004,
};

export const ZIndexHandler = {

	ZINDEXES: [] as number[],

	generateZIndex(zindex: number) {
		const lastZIndex = (this.ZINDEXES.length > 0) ? this.ZINDEXES[this.ZINDEXES.length - 1] : 999;
		const newZIndex = lastZIndex >= zindex ? lastZIndex + 1 : zindex;
		this.ZINDEXES.push(newZIndex);
		return newZIndex;
	},

	getCurrentZIndex() {
		return this.ZINDEXES.length > 0 ? this.ZINDEXES[this.ZINDEXES.length - 1] : 0;
	},

	setElementZIndex(element: any, zIndex: number) {
		if (!element || !element.style) return;
		element.style.zIndex = String(this.generateZIndex(zIndex));
	},

	getElementZIndex(element: any): number {
		if (!element || !element.style) return 0;
		return parseInt(element.style.zIndex) || 0;
	},

	removeElementZIndex(element: any) {
		if (!element || !element.style) return;
		const zindex = this.getElementZIndex(element);
		element.style.zIndex = undefined;
		const index = this.ZINDEXES.indexOf(zindex);
		if (index > -1) this.ZINDEXES.splice(index, 1);
	},

};

export type NoseurObservationType = "resize";
export type NoseurObservationEventHandler = (...args: any) => any;

export class ObserverHandler {

	private static __OBSERVERS: NoseurObject<NoseurObject<ResizeObserver>> = {};
	private static __OBSERVERS_EVENT_HANDLERS: NoseurObject<NoseurObject<NoseurObservationEventHandler[]>> = {};

	public static observe(type: NoseurObservationType, eventHandler: NoseurObservationEventHandler, target: any = document.body, options?: any) {
		ObserverHandler.registerObserver(type, target, options);
		if (ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type]?.[target]?.includes(eventHandler)) return;
		if (!(type in ObserverHandler.__OBSERVERS_EVENT_HANDLERS)) ObserverHandler.__OBSERVERS_EVENT_HANDLERS[type] = {};
		if (!(target in ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type])) {
			ObserverHandler.__OBSERVERS_EVENT_HANDLERS[type][target] = [];
		}
		ObserverHandler.__OBSERVERS_EVENT_HANDLERS[type][target].push(eventHandler);
	}

	public static unobserve(type: NoseurObservationType, eventHandler: NoseurObservationEventHandler, target: any = document.body) {
		const targetObserver = ObserverHandler.__OBSERVERS?.[type]?.[target];
		const eventHandlerIndex = ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type]?.[target]?.indexOf(eventHandler);
		if (eventHandlerIndex < 0) return;
		ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type]?.[target]?.splice(eventHandlerIndex, 1);
		if (!ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type]?.[target]?.length) {
			delete ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type]?.[target];
			if (!Object.keys(ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type]).length) {
				delete ObserverHandler.__OBSERVERS_EVENT_HANDLERS?.[type];
				if (targetObserver) {
					targetObserver.unobserve(target);
					delete ObserverHandler.__OBSERVERS?.[type]?.[target];
					if (!Object.keys(ObserverHandler.__OBSERVERS?.[type]).length) {
						delete ObserverHandler.__OBSERVERS?.[type];
					}
				}
			}
		}
	}

	private static registerObserver(type: NoseurObservationType, target: any, options?: any) {
		if ((type in ObserverHandler.__OBSERVERS) && (target in ObserverHandler.__OBSERVERS?.[type])) {
			return;
		}
		let observer;
		if (type === "resize") {
			observer = new ResizeObserver((entries) => {
				if (!(type in ObserverHandler.__OBSERVERS_EVENT_HANDLERS)) return;
				ObserverHandler.__OBSERVERS_EVENT_HANDLERS[type][target].forEach((e) => e(entries));
			});
		}
		if (!observer) throw new Error("NoseurError: observer not initialized, likely an invalid observation type");
		observer.observe(target, options);
		if (!(type in ObserverHandler.__OBSERVERS)) ObserverHandler.__OBSERVERS[type] = {};
		if (!(target in ObserverHandler.__OBSERVERS[type])) {
			ObserverHandler.__OBSERVERS[type][target] = observer;
		}
	}

}
