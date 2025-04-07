import { writable } from "svelte/store";
import { Notice } from "obsidian";
import { playNotificationSound } from "../sound";

export interface ActiveTimer {
    timeout: NodeJS.Timeout;
    endTime: number;
    description: string;
    lineNumber: number;
    isPaused: boolean;
    remainingTime: number;
}

function createTimerStore() {
    const { subscribe, update } = writable<Map<string, ActiveTimer>>(new Map());

    return {
        subscribe,
        addTimer: (timerId: string, timer: ActiveTimer) => {
            console.log("Adding timer:", { timerId, timer });
            update((timers) => {
                // Create a new Map with existing entries plus the new one
                const newTimers = new Map(timers);
                newTimers.set(timerId, timer);
                console.log(
                    "Current timers after add:",
                    Array.from(newTimers.entries())
                );
                return newTimers;
            });
        },
        removeTimer: (timerId: string) => {
            console.log("Removing timer:", timerId);
            update((timers) => {
                // Create a new Map without the removed timer
                const newTimers = new Map(timers);
                newTimers.delete(timerId);
                console.log(
                    "Current timers after remove:",
                    Array.from(newTimers.entries())
                );
                return newTimers;
            });
        },
        pauseTimer: (timerId: string) => {
            console.log("Pausing timer:", timerId);
            update((timers) => {
                const newTimers = new Map(timers);
                const timer = newTimers.get(timerId);
                if (timer && !timer.isPaused) {
                    clearTimeout(timer.timeout);
                    timer.remainingTime = timer.endTime - Date.now();
                    timer.isPaused = true;
                    newTimers.set(timerId, { ...timer });
                    new Notice(`Timer paused: ${timer.description}`);
                }
                return newTimers;
            });
        },
        resumeTimer: (
            timerId: string,
            onComplete: (timer: ActiveTimer) => void
        ) => {
            console.log("Resuming timer:", timerId);
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
                        new Notice(
                            `Timer completed: ${updatedTimer.description}!`
                        );
                    }, timer.remainingTime);

                    newTimers.set(timerId, updatedTimer);
                    new Notice(`Timer resumed: ${updatedTimer.description}`);
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
                    new Notice(`Timer cancelled: ${timer.description}`);
                    newTimers.delete(timerId);
                }
                return newTimers;
            });
        },
        clear: () => {
            console.log("Clearing all timers");
            update((timers) => {
                timers.forEach((timer) => clearTimeout(timer.timeout));
                return new Map();
            });
        },
    };
}

export const timerStore = createTimerStore();
