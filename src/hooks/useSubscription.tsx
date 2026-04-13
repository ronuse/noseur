
import React from "react";
import { Subscriber, Subscription } from "../utils/Subscriber";

export interface UseSubscriptionOptions {

    skipRegister?: boolean;
    skipUnRegister?: boolean;
    reportAfterRegister?: any;
    reportAfterUnRegister?: any;
    reportBeforeUnRegister?: any;

}

export function useSubscription(key: string, subscription?: Subscription, options?: UseSubscriptionOptions) {

    React.useEffect(() => {
        if (subscription && !options?.skipRegister) {
            Subscriber.subscribe(key, subscription);
        }

        if (options?.reportAfterRegister) {
            Subscriber.report(key, options?.reportAfterRegister);
        }

        return () => {
            if (options?.reportBeforeUnRegister) {
                Subscriber.report(key, options?.reportBeforeUnRegister);
            }
            if (subscription && !options?.skipUnRegister) {
                Subscriber.unSubscribe(key, subscription);
            }
            if (options?.reportAfterUnRegister) {
                Subscriber.report(key, options?.reportAfterUnRegister);
            }
        };
    }, []);

    return (...data: any) => {
        Subscriber.report(key, ...data);
    };

}
