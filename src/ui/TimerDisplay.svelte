<!-- TimerDisplay.svelte -->
<script lang="ts">
    import { onDestroy } from "svelte";
    import { timerStore, type ActiveTimer } from "../stores/timerStore";

    let timers: Map<string, ActiveTimer>;
    let updateInterval: ReturnType<typeof setInterval>;

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
        if (timeRemaining < 60000) return "text-error";
        if (timeRemaining > 60000) return "text-white";
        return "";
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
                    title={timer.description}>{timer.description}</span
                >
                <div class="flex justify-start mt-2 gap-2">
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
                </div>
            </div>
        {/each}
    </div>
{/if}
