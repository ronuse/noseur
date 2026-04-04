
export const StringHelper = {

    segmentSplit(value: string, sep: string = "/") {
        return value.split(sep).filter(s => s !== "");
    },

    toSaneSentenceFormat(value: string, ignore?: boolean) {
        if (ignore || !value) return value;
        return value.split("_").map(e => e[0].toUpperCase() + e.substring(1).toLowerCase()).join(" ");
    },

    toPresentableMoneyValue(amount: number, options: { divisor?: number; decimal?: number; separator?: string; } = {
        decimal: 2,
        separator: ",",
        divisor: 1000000,
    }) {
        let amountStr;
        let isNegative = false;
        if (options?.divisor) amount /= options?.divisor;
        if (amount < 0) {
            isNegative = true;
            amount = Math.abs(amount);
        }
        amountStr = String(amount);
        if (options?.decimal) amountStr = amount.toFixed(options?.decimal);
        if (options?.separator) {
            let reversedComma: string[] = [];
            const amountMainParts = (amountStr.substring(0, amountStr.indexOf("."))).split("");
            for (let index = amountMainParts.length - 1; index >= 0; index -= 3) {
                reversedComma.push(amountMainParts[index]);
                if (index === 0) continue;
                reversedComma.push(amountMainParts[index - 1]);
                if ((index - 2) < 0) continue;
                reversedComma.push(amountMainParts[index - 2]);
                if ((index - 2) !== 0) reversedComma.push(",");
            }
            amountStr = reversedComma.reverse().join("") + amountStr.substring(amountStr.indexOf("."));
        }
        return (isNegative ? "-" : "") + amountStr;
    },

};
