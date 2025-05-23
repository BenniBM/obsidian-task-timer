import { writable, get } from "svelte/store";
import { Notice } from "obsidian";
import { playNotificationSound } from "../sound";

export interface ActiveTimer {
    timeout: NodeJS.Timeout;
    endTime: number;
    description: string;
    lineNumber: number;
    isPaused: boolean;
    remainingTime: number;
    isOvertime: boolean;
    startTime: number;
    overtimeInterval?: NodeJS.Timeout;
}

function createTimerStore() {
    const { subscribe, update } = writable<Map<string, ActiveTimer>>(new Map());

    return {
        subscribe,
        getTimers: () => get(store),
        addTimer: (timerId: string, timer: ActiveTimer) => {
            update((timers) => {
                // Create a new Map with existing entries plus the new one
                const newTimers = new Map(timers);
                newTimers.set(timerId, timer);
                return newTimers;
            });
        },
        removeTimer: (timerId: string) => {
            update((timers) => {
                // Create a new Map without the removed timer
                const newTimers = new Map(timers);
                const timer = newTimers.get(timerId);
                if (timer?.overtimeInterval) {
                    clearInterval(timer.overtimeInterval);
                }
                newTimers.delete(timerId);
                return newTimers;
            });
        },
        pauseTimer: (timerId: string) => {
            update((timers) => {
                const newTimers = new Map(timers);
                const timer = newTimers.get(timerId);
                if (timer && !timer.isPaused) {
                    clearTimeout(timer.timeout);
                    timer.remainingTime = timer.endTime - Date.now();
                    timer.isPaused = true;
                    newTimers.set(timerId, { ...timer });
                    new Notice(`Timer paused`);
                }
                return newTimers;
            });
        },
        resumeTimer: (
            timerId: string,
            onComplete: (timer: ActiveTimer) => void
        ) => {
            update((timers) => {
                const newTimers = new Map(timers);
                const timer = newTimers.get(timerId);
                if (timer && timer.isPaused) {
                    const now = Date.now();
                    const updatedTimer = { ...timer };
                    updatedTimer.endTime = now + timer.remainingTime;
                    updatedTimer.isPaused = false;

                    updatedTimer.timeout = setTimeout(() => {
                        playNotificationSound();
                        onComplete(updatedTimer);
                        update((timers) => {
                            const finalTimers = new Map(timers);
                            finalTimers.delete(timerId);
                            return finalTimers;
                        });
                        new Notice(`Timer completed!`);
                    }, timer.remainingTime);

                    newTimers.set(timerId, updatedTimer);
                    new Notice(`Timer resumed`);
                }
                return newTimers;
            });
        },
        cancelTimer: (timerId: string) => {
            update((timers) => {
                const newTimers = new Map(timers);
                const timer = newTimers.get(timerId);
                if (timer) {
                    clearTimeout(timer.timeout);
                    if (timer.overtimeInterval) {
                        clearInterval(timer.overtimeInterval);
                    }
                    new Notice(`Timer cancelled`);
                    newTimers.delete(timerId);
                }
                return newTimers;
            });
        },
        clear: () => {
            update((timers) => {
                timers.forEach((timer) => clearTimeout(timer.timeout));
                return new Map();
            });
        },
        setOvertime: (timerId: string, focusCallback: () => void) => {
            update((timers) => {
                const newTimers = new Map(timers);
                const timer = newTimers.get(timerId);
                if (timer) {
                    timer.isOvertime = true;
                    clearTimeout(timer.timeout);

                    // Set up recurring focus every 3 minutes
                    timer.overtimeInterval = setInterval(() => {
                        focusCallback();
                        new Notice("Task is in overtime!");
                    }, 3 * 60 * 1000); // 2 minutes

                    newTimers.set(timerId, { ...timer });
                }
                return newTimers;
            });
        },
    };
}

const store = createTimerStore();
export const timerStore = store;
