
import { NoseurObject } from "../constants/Types";

export type Subscription = (...data: any) => void;
export type SecondaryDataSubscription = (secondaryData: NoseurObject<any>) => void;

export const Subscriber = {

    KEYS: {
        SECONDARY_DATA: "SECONDARY_DATA",
    },
    __subscriptions: {} as NoseurObject<Subscription[]>,

    subscribe: (key: string, subscription: Subscription) => {
        if (!(key in Subscriber.__subscriptions)) Subscriber.__subscriptions[key] = [] as Subscription[];
        if (Subscriber.__subscriptions[key].includes(subscription)) return;
        Subscriber.__subscriptions[key].push(subscription);
    },

    unSubscribe: (key: string, subscription: Subscription) => {
        if (!(key in Subscriber.__subscriptions)) return;
        const index = Subscriber.__subscriptions[key].indexOf(subscription);
        if (index > -1) Subscriber.__subscriptions[key].splice(index, 1);
    },

    report(key: string, ...data: any) {
        if (!(key in Subscriber.__subscriptions)) return;
        Subscriber.__subscriptions[key].forEach(subscription => subscription(...data));
    },

    subscriptions: (key?: string) => key ? Subscriber.__subscriptions[key] : Subscriber.__subscriptions,
    
    clearSubscriptions: (key?: string) => key ? ((key in Subscriber.__subscriptions) ? delete Subscriber.__subscriptions[key] : undefined) : Subscriber.__subscriptions = {},

}

