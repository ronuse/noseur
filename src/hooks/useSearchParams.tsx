
import React from "react";
import { DOMHelper, URLSearchParamsValue } from "../utils/DOMUtils";
import * as ReactRouterDom from "react-router-dom";

type ActionMapper<T> = {
    [K in keyof T & string]: T[K];
} & {
    [K in keyof T & string as `set${Capitalize<K>}`]: (val: T[K], cb?: Function) => void;
};

export interface UseSearchParamsOptions<T> {

    params?: T;
    defaultInit?: string;

}

export function useSearchParams<T extends Record<string, URLSearchParamsValue>>(options?: UseSearchParamsOptions<T>) {

    const actionMapper = {} as any;
    const [state, setState] = React.useState<T | undefined>(options?.params);
    const [searchParams, setSearchParams] = ReactRouterDom.useSearchParams(options?.defaultInit);

    if (state && options?.params) {
        Object.keys(options?.params).forEach((key) => {
            actionMapper[key] = searchParams.get(key) ?? state[key];

            const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            actionMapper[setterName] = (newVal: T[typeof key], cb?: Function) => {
                updateSearchParam(key, newVal, cb);
                setState((prev) => ({ ...prev!, [key]: newVal }));
            };
        });
    };

    return {
        searchParams,
        setSearchParams: updateSearchParam,
        ...actionMapper as ActionMapper<T>,
    };

    function updateSearchParam(key: string, value: URLSearchParamsValue, cb?: Function) {
        DOMHelper.updateSearchParam(setSearchParams, key, value, cb);
    }

}
