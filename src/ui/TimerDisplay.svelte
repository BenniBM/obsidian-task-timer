<!-- TimerDisplay.svelte -->
<script lang="ts">
    import { onDestroy } from "svelte";
    import { timerStore, type ActiveTimer } from "../stores/timerStore";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let timers: Map<string, ActiveTimer>;
    let updateInterval: ReturnType<typeof setInterval>;
    export let focusMode = false;

    // Subscribe to timer store
    const unsubscribe = timerStore.subscribe((value) => {
        timers = value;
    });

    // Update display every second
    updateInterval = setInterval(() => {
        // Force component update
        timers = timers;
    }, 1000);

    // Cleanup on component destroy
    onDestroy(() => {
        clearInterval(updateInterval);
        unsubscribe();
    });

    function stopFocusMode() {
        focusMode = false;
        dispatch("stopFocus");
    }

    function getTimeDisplay(timer: ActiveTimer): string {
        const now = Date.now();
        if (timer.isOvertime) {
            const overtimeMs = now - timer.endTime;
            const minutes = Math.floor(overtimeMs / 60000);
            const seconds = Math.floor((overtimeMs % 60000) / 1000);
            return `+${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }

        const timeRemaining = timer.isPaused
            ? timer.remainingTime
            : Math.max(0, timer.endTime - now);

        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function getTimerClass(timer: ActiveTimer): string {
        if (timer.isOvertime) return "text-error";
        if (timer.isPaused) return "";
        const timeRemaining = timer.endTime - Date.now();
        if (timeRemaining < 60000) return "text-error";
        if (timeRemaining > 60000) return "text-white";
        return "";
    }

    function endTask(timerId: string, timer: ActiveTimer) {
        const totalTimeMs = Date.now() - timer.startTime;
        const minutes = Math.ceil(totalTimeMs / 60000);
        dispatch("endTask", { timerId, actualTime: minutes });
    }
</script>

{#if timers.size > 0}
    <div
        class="fixed bottom-5 right-5 bg-background-secondary border border-background-modifier-border rounded-xl p-8 z-50 max-w-[325px] min-w-[325px] shadow-lg animate-slide-up"
    >
        {#each Array.from(timers) as [timerId, timer], index}
            <div
                class={index !== 0
                    ? "border-t border-background-modifier-border mt-6 pt-6"
                    : ""}
            >
                <h2
                    class="text-3xl font-bold tracking-wide {getTimerClass(
                        timer,
                    )}"
                >
                    {getTimeDisplay(timer)}
                </h2>
                <span
                    class="mr-3 flex-1 mb-4 text-sm block truncate"
                    title={timer.description}
                >
                    {timer.description}
                </span>
                <div class="flex justify-start mt-2 gap-2">
                    {#if timer.isOvertime}
                        <button
                            class="px-4 py-1 rounded-md bg-text-error text-background-primary cursor-pointer text-sm transition-all duration-200 hover:opacity-80 hover:-translate-y-0.5"
                            on:click={() => endTask(timerId, timer)}
                        >
                            End Task
                        </button>
                    {:else}
                        <button
                            class="px-4 py-1 rounded-md cursor-pointer text-sm transition-all duration-200 hover:bg-background-modifier-hover hover:-translate-y-0.5"
                            on:click={() =>
                                timer.isPaused
                                    ? timerStore.resumeTimer(timerId, () => {})
                                    : timerStore.pauseTimer(timerId)}
                        >
                            {timer.isPaused ? "Resume" : "Pause"}
                        </button>
                        <button
                            class="px-4 py-1 rounded-md bg-background-primary cursor-pointer text-sm transition-all duration-200 hover:bg-text-error hover:text-background-primary hover:-translate-y-0.5"
                            on:click={() => timerStore.cancelTimer(timerId)}
                        >
                            Delete
                        </button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{:else if focusMode}
    <div
        class="fixed bottom-5 right-5 bg-background-secondary border border-background-modifier-border rounded-xl p-8 z-50 max-w-[325px] min-w-[325px] shadow-lg animate-slide-up"
    >
        <div class="text-error">
            <h2 class="text-xl font-bold mb-2">Focus Mode Active</h2>
            <p class="text-sm text-muted">
                You need to start a timer to stay focused! Press Ctrl+H to start
                a timer for your current task.
            </p>
            <button
                class="px-4 py-1 mt-4 rounded-md bg-background-primary cursor-pointer text-sm transition-all duration-200 hover:bg-text-error hover:text-background-primary hover:-translate-y-0.5"
                on:click={stopFocusMode}
            >
                Stop Focus
            </button>
        </div>
    </div>
{/if}
