<!-- TimerDisplay.svelte -->
<script lang="ts">
    import { onDestroy } from "svelte";
    import { timerStore, type ActiveTimer } from "../stores/timerStore";

    let timers: Map<string, ActiveTimer>;
    let updateInterval: ReturnType<typeof setInterval>;

    // Subscribe to timer store
    const unsubscribe = timerStore.subscribe((value) => {
        console.log(
            "TimerDisplay received store update:",
            Array.from(value.entries()),
        );
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

    function getTimeDisplay(timer: ActiveTimer): string {
        const now = Date.now();
        const timeRemaining = timer.isPaused
            ? timer.remainingTime
            : Math.max(0, timer.endTime - now);

        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function getTimerClass(timer: ActiveTimer): string {
        if (timer.isPaused) return "";
        const timeRemaining = timer.endTime - Date.now();
        if (timeRemaining < 60000)
            return "text-error bg-background-modifier-error-hover";
        if (timeRemaining < 300000)
            return "text-warning bg-background-modifier-error";
        return "";
    }
</script>

<div
    class="fixed bottom-5 right-5 bg-background-secondary border border-background-modifier-border rounded-xl p-8 z-50 max-w-[350px] min-w-[250px] shadow-lg animate-slide-up"
>
    {#each Array.from(timers) as [timerId, timer] (timerId)}
        <div
            class="mb-2.5 p-3 bg-background-secondary rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
            <div class="flex justify-between items-center mb-2">
                <span class="mr-3 flex-1 text-sm">{timer.description}</span>
                <span
                    class="font-mono text-lg font-semibold px-1.5 py-0.5 rounded bg-background-primary {getTimerClass(
                        timer,
                    )}">{getTimeDisplay(timer)}</span
                >
            </div>
            <div class="flex justify-end gap-2">
                <button
                    class="px-2.5 py-1 rounded-md border border-background-modifier-border bg-background-primary cursor-pointer text-sm transition-all duration-200 hover:bg-background-modifier-hover hover:-translate-y-1"
                    on:click={() =>
                        timer.isPaused
                            ? timerStore.resumeTimer(timerId, () => {})
                            : timerStore.pauseTimer(timerId)}
                >
                    {timer.isPaused ? "Resume" : "Pause"}
                </button>
                <button
                    class="px-2.5 py-1 rounded-md border border-text-error text-error bg-background-primary cursor-pointer text-sm transition-all duration-200 hover:bg-text-error hover:text-background-primary hover:-translate-y-1"
                    on:click={() => timerStore.cancelTimer(timerId)}
                >
                    Delete
                </button>
            </div>
        </div>
    {/each}
    {#if timers.size === 0}
        <div class="p-3 text-center text-muted text-sm bg-background-secondary">
            No active timers. Use Ctrl+H on a todo item to start a timer.
        </div>
    {/if}
</div>
