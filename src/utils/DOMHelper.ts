import { NoseurObject } from "../constants/Types";

let __noseurGlobal__Browser: NoseurObject;

export const DOMHelper = {

    getBrowser() {
		if(!__noseurGlobal__Browser) {
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
	}

}
