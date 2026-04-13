
import React from "react";
import { NoseurObject } from "../constants/Types";
import * as ReactRouterDom from "react-router-dom";
import { DOMHelper, URLSearchParamsValue } from "../utils/DOMUtils";
import { FunctionStackManager } from "../utils/FunctionStackManager";

type ActionMapper<T> = {
    [K in keyof T & string]: T[K];
} & {
    [K in keyof T & string as `set${Capitalize<K>}`]: (val: T[K] | undefined, cb?: Function) => void;
} & {
    [K in keyof T & string as `clear${Capitalize<K>}`]: (cb?: Function) => void;
};

export interface UseSearchParamsOptions<T> {

    params?: T;
    defaultInit?: string;

}

export function useSearchParams<T extends Record<string, URLSearchParamsValue>>(options?: UseSearchParamsOptions<T>) {

    const actionMapper = {} as any;
    const [functionStackManager, _] = React.useState(new FunctionStackManager());
    const [searchParams, setSearchParams] = ReactRouterDom.useSearchParams(options?.defaultInit);

    React.useEffect(() => {
        functionStackManager.popSmoke("USE_SEARCH_PARAMS_CB");
    }, [searchParams]);

    if (options?.params) {
        Object.keys(options?.params).forEach((key) => {
            actionMapper[key] = searchParams.get(key) ?? options?.params?.[key];

            const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            const clearerName = `clear${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            actionMapper[setterName] = ((newVal: T[typeof key] | undefined, cb?: Function) => {
                actionMapper[key] = newVal;
                if (cb) functionStackManager.register("USE_SEARCH_PARAMS_CB", cb);
                updateSearchParam(key, newVal);
            }).bind(searchParams);
            actionMapper[clearerName] = ((cb?: Function) => {
                delete actionMapper[key];
                if (cb) functionStackManager.register("USE_SEARCH_PARAMS_CB", cb);
                deleteSearchParam(key);
            }).bind(searchParams);
        });
    };

    return {
        actionMapper,
        searchParams,
        setSearchParams,
        deleteSearchParam,
        updateSearchParam,
        updateSearchParams,
        ...actionMapper as ActionMapper<T>,
    };

    function deleteSearchParam(key: string, cb?: Function) {
        DOMHelper.updateSearchParam(setSearchParams, key, undefined, cb);
    }

    function updateSearchParam(key: string, value: URLSearchParamsValue, cb?: Function) {
        DOMHelper.updateSearchParam(setSearchParams, key, value, cb);
    }

    function updateSearchParams(values: NoseurObject<URLSearchParamsValue>, cb?: Function) {
        DOMHelper.updateSearchParams(setSearchParams, values, cb);
    }

}
