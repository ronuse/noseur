
import { DOMHelper } from "./DOMUtils";

export class InputFilter {
	static INT = /[\d\-]/;
	static HEX = /[0-9a-f]/i;
	static ALPHA = /[a-z_]/i;
	static NUMBER = /[\d\-\.]/;
	static MONEY = /[\d\.\s,]/;
	static ALPHANUM = /[a-z0-9_]/i;
	static POSITIVE_INT = /[\d]/;
	static POSITIVE_NUMBER = /[\d\.]/;
	static EMAIL = /[a-z0-9_\.\-@]/i;
}

export enum InputSpecialKey {
	ESC = 27,
	TAB = 9,
	RETURN = 13,
	BACKSPACE = 8,
	DELETE = 46
}

type InputEventAlias = { 
	which?: any, 
	altKey?: any,
	ctrlKey?: any,
	keyCode?: any,
	shiftKey?: any,
	charCode?: any,
	preventDefault?: any,
};

export const InputHelper = {

	isNavKeyPress(event: InputEventAlias) {
		let key = event.keyCode;
		return (key >= 33 && key <= 40) || key === InputSpecialKey.RETURN || key === InputSpecialKey.TAB || key === InputSpecialKey.ESC;
	},

	isSpecialKey(event: InputEventAlias) {
		let key = event.keyCode;
		return key === 9 || key === 13 || key === 27 || key === 16 || key === 17 ||(key >= 18 && key <= 20) ||
			(DOMHelper.getBrowser().opera && !event.shiftKey && (key === 8 || (key >= 33 && key <= 35) || (key >= 36 && key <= 39) || (key >= 44 && key <= 45)));
	},

	getKey(event: any) {
		return event.keyCode || event.charCode;
	},

	getCharCode(event: InputEventAlias) {
		return event.charCode || event.keyCode || event.which;
	},

	validateEventValue(regex: RegExp, event: React.SyntheticEvent, value: string) {
		const chars = value.split("");
		for (const char of chars) {
			if (!regex.test(char)) {
				event.preventDefault();
                return false;
            }
		}
		return true;
	},

	validateEventKeyInput(regex: RegExp, event: InputEventAlias) {
		const browser = DOMHelper.getBrowser();

		if (event.altKey || event.ctrlKey) {
			return;
		}
		const key = this.getKey(event);
		if (browser.mozilla && (this.isNavKeyPress(event) || (key === InputSpecialKey.DELETE && event.charCode === 0) || key === InputSpecialKey.BACKSPACE)) {
			return;
		}

		const c = this.getCharCode(event);
		const cc = String.fromCharCode(c);

		if (browser.mozilla && (this.isSpecialKey(event) || !cc)) {
			return;
		}

		const inputValid = regex.test(cc);
		if (!inputValid) {
			event.preventDefault();
		}
		return inputValid;
	},
	
	validate(value: string, filter: RegExp) {
		return !value || !filter || filter.test(value);
	}

}