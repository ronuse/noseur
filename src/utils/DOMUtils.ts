import { NoseurObject } from "../constants/Types";

let __noseurGlobal__Browser: NoseurObject<any>;

export const DOMHelper = {

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

	absolutePositionRelatively(element: any, target: any) {
		if (!element || !target) return;
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
		element.style.left = (left - elementMarginLeft) + 'px';
		element.style.top = `calc(${(top - elementMarginTop) + 'px'} ${operator} var(--componentMarginTopOrBottom, 0px))`;
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

};

export const ScrollHandler = {

	querySelector(element: Element, selector: any) {
		if (!element) return null;
		return element.querySelector(selector);
	},

	getElementParents(element: Node, parents: any[] = []): Node[] {
		return (element.parentNode) ? this.getElementParents(element.parentNode, parents.concat([element.parentNode])) : parents;
	},

	getScrollableParents(element: Node): Node[] {
		let scrollableParents: any[] = [];
		if (!element) return scrollableParents;

		let elementParents = this.getElementParents(element);
		const scrollRegex = /(auto|scroll|visible)/;
		const checkIfScrolable = (node: Element) => {
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
					if (el && checkIfScrolable(el)) scrollableParents.push(el);
				}
			}
			if (elementParent.nodeType !== 9 && checkIfScrolable(elementParent as Element)) {
				scrollableParents.push(elementParent);
			} else if (elementParent.nodeType === 9) {
				scrollableParents.push(window);
			}
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

	handle(element: Node, listener: any) {
		const scrollableParents = !element ? [] : this.getScrollableParents(element);
		return {
			attach: () => this.attachScrollListener(scrollableParents, listener),
			detach: () => this.detachScrollListener(scrollableParents, listener),
		}
	},

};

export enum BaseZIndex {
	MENU = 1000,
	MODAL = 1001,
	TOAST = 10002,
	OVERLAY = 1000,
	TOOLTIP = 10001,
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
