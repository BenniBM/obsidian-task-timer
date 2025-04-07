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
        if (timeRemaining < 60000) return "danger";
        if (timeRemaining < 300000) return "warning";
        return "";
    }
</script>

<div class="timer-popup">
    {#each Array.from(timers) as [timerId, timer] (timerId)}
        <div class="timer-item">
            <div class="timer-info">
                <span class="description">{timer.description}</span>
                <span class="time {getTimerClass(timer)}"
                    >{getTimeDisplay(timer)}</span
                >
            </div>
            <div class="button-container">
                <button
                    class="timer-button"
                    on:click={() =>
                        timer.isPaused
                            ? timerStore.resumeTimer(timerId, () => {})
                            : timerStore.pauseTimer(timerId)}
                >
                    {timer.isPaused ? "Resume" : "Pause"}
                </button>
                <button
                    class="timer-button delete"
                    on:click={() => timerStore.cancelTimer(timerId)}
                >
                    Delete
                </button>
            </div>
        </div>
    {/each}
    {#if timers.size === 0}
        <div class="empty-state">
            No active timers. Use Ctrl+H on a todo item to start a timer.
        </div>
    {/if}
</div>

<style>
    .timer-popup {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 12px;
        padding: 2rem;
        z-index: 1000;
        max-width: 350px;
        min-width: 250px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        animation: slide-up 0.3s ease-out;
    }

    @keyframes slide-up {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .hidden {
        display: none;
    }

    .timer-title {
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 1px solid var(--background-modifier-border);
        padding-bottom: 5px;
        font-size: 0.9em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .timer-item {
        margin-bottom: 10px;
        padding: 12px;
        background-color: var(--background-secondary);
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .timer-item:last-child {
        margin-bottom: 0;
    }

    .timer-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .timer-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .description {
        margin-right: 12px;
        flex: 1;
        font-size: 0.9em;
    }

    .time {
        font-family: var(--font-monospace);
        font-size: 1.1em;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        background-color: var(--background-primary);
    }

    .time.warning {
        color: var(--text-warning);
        background-color: var(--background-modifier-error);
    }

    .time.danger {
        color: var(--text-error);
        background-color: var(--background-modifier-error-hover);
    }

    .button-container {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }

    .timer-button {
        padding: 4px 10px;
        border-radius: 6px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-primary);
        cursor: pointer;
        font-size: 0.8em;
        transition: all 0.2s ease;
    }

    .timer-button:hover {
        background-color: var(--background-modifier-hover);
        transform: translateY(-1px);
    }

    .timer-button.delete {
        border-color: var(--text-error);
        color: var(--text-error);
    }

    .timer-button.delete:hover {
        background-color: var(--text-error);
        color: var(--background-primary);
    }

    .empty-state {
        padding: 12px;
        text-align: center;
        color: var(--text-muted);
        font-size: 0.9em;
        background-color: var(--background-secondary);
    }
</style>
