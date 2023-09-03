
export const BoolHelper = {

    bothEquals(var1: any, var2: any) {
		return (var1 === var2);
	},

	equalsAny(obj: any, compares: string[]) {
		for (var compare of compares) {
			if (BoolHelper.bothEquals(obj, compare)) {
				return true;
			}
		}
		return false;
	},

	allEquals(obj: any, compares: string[]) {
		for (var compare of compares) {
			if (!BoolHelper.bothEquals(obj, compare)) {
				return false;
			}
		}
		return true;
	},

	noneEquals(obj: any, compares: string[]) {
		for (var compare of compares) {
			if (BoolHelper.bothEquals(obj, compare)) {
				return false;
			}
		}
		return true;
	}

}
