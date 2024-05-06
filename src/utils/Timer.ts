import { NoseurObject } from "../constants/Types";

export interface TimerCallbacks {
    onEnd?: () => void;
    onStop?: () => void;
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onRestart?: () => void;
    action?: (...args: any[]) => void;
    onAction?: (percentage: number) => void;
}

export interface TimerOption {
    delay?: number;
    timeout: number;
    cbs?: TimerCallbacks;
    isInterval?: boolean;
}

export class Timer {

    startTime?: number;
    cbs?: TimerCallbacks;
    isInterval?: boolean;
    totalTicks: number = 0;
    elapseTicks: number = 0;
    timer?: NodeJS.Timeout | number;
    options: NoseurObject<any> = {};

    constructor(options: TimerOption, ...args: any[]) {
        this.cbs = options.cbs;
        this.options["args"] = args;
        this.isInterval = options.isInterval;
        this.options["timeout"] = options.timeout;
        this.options["delay"] = options.delay || 1000;
        this.totalTicks = this.elapseTicks = options.timeout / this.options["delay"];
    }

    start(__resumed__: boolean = false) {
        const timeoutMethod = this.isInterval ? setInterval : setTimeout;
        this.startTime = new Date().getTime();
        this.timer = timeoutMethod((...args: any[]) => {
            this.cbs?.action && this.cbs?.action(...args);
            if (!this.isInterval) {
                this.cbs?.onAction && this.cbs?.onAction(100);
                this.cbs?.onEnd && this.cbs?.onEnd();
                return;
            }
            const percentageTick = 100-(((--this.elapseTicks) * 100) / this.totalTicks);
            this.cbs?.onAction && this.cbs?.onAction(percentageTick);
            if (percentageTick >= 100) {
                this.startTime = undefined;
                clearTimeout(this.timer);
                this.timer = undefined;
                this.cbs?.onEnd && this.cbs?.onEnd();
            }
        }, (this.isInterval ? this.options["delay"] : this.options["timeout"]), ...(this.options["args"] as any));
        if (!__resumed__) this.cbs?.onStart && this.cbs.onStart();
    }

    stop() {
        this.startTime = undefined;
        clearTimeout(this.timer);
        this.timer = undefined;
        this.cbs?.onStop && this.cbs.onStop();
    }

    pause() {
        if (!this.startTime) return;
        this.stop();
        this.cbs?.onPause && this.cbs.onPause();
        this.options["timeout"] -= (new Date()).getTime() - this.startTime;
    }

    resume() {
        this.start(true);
        this.cbs?.onResume && this.cbs.onResume();
    }

    restart(timeout?: number) {
        this.stop();
        this.start();
        if (timeout) {
            this.totalTicks = this.elapseTicks = timeout / this.options["delay"];
        } else {
            this.elapseTicks = this.totalTicks;
        }
        this.cbs?.onRestart && this.cbs.onRestart();
    }

}
