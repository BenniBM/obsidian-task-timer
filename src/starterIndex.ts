import {
    App,
    Plugin,
    PluginSettingTab,
    Editor,
    MarkdownView,
    Notice,
    Setting,
} from "obsidian";
import type { MarkdownFileInfo } from "obsidian";
import TimerDisplay from "./ui/TimerDisplay.svelte";
import { timerStore } from "./stores/timerStore";
import { playNotificationSound } from "./sound";
import "./main.css";

interface TaskTimerSettings {
    notificationSound: boolean;
    focusOnComplete: boolean;
}

const DEFAULT_SETTINGS: TaskTimerSettings = {
    notificationSound: true,
    focusOnComplete: true,
};

export default class TaskTimerPlugin extends Plugin {
    settings: TaskTimerSettings = DEFAULT_SETTINGS;
    notifiedTimers: Set<string> = new Set();
    private timerComponent: TimerDisplay | null = null;
    private focusModeInterval: NodeJS.Timeout | null = null;

    async onload() {
        await this.loadSettings();

        // Mount timer component
        const timerContainer = document.createElement("div");
        document.body.appendChild(timerContainer);
        this.timerComponent = new TimerDisplay({
            target: timerContainer,
            props: {
                focusMode: false,
            },
        });

        // Listen for focus mode stop event
        this.timerComponent.$on("stopFocus", () => {
            if (this.focusModeInterval) {
                this.disableFocusMode(this.focusModeInterval);
            }
        });

        // Listen for task end event
        this.timerComponent.$on("endTask", (event) => {
            const { timerId, actualTime } = event.detail;
            const timer = timerStore.getTimers().get(timerId);
            if (timer) {
                const editor =
                    this.app.workspace.getActiveViewOfType(
                        MarkdownView
                    )?.editor;
                if (editor) {
                    const line = editor.getLine(timer.lineNumber);
                    // line looks like this: "- [ ] 5min | Task description"
                    // and updated to:       "- [x] 6min | Task description"
                    const completedLine = line.replace(
                        /^- \[\*\] \d+(s|min) \|/,
                        `- [x] ${actualTime}min |`
                    );
                    editor.setLine(timer.lineNumber, completedLine);
                }
                timerStore.removeTimer(timerId);
                new Notice(`Task completed in ${actualTime} minutes`);
            }
        });

        // Add ribbon icon
        this.addRibbonIcon("clock", "Task Timer", () => {
            new Notice(
                "Timer component is always visible in the bottom right corner"
            );
        });

        // Add the command to start a timer
        this.addCommand({
            id: "start-todo-timer",
            name: "Start Timer for Selected Todo",
            editorCallback: (
                editor: Editor,
                view: MarkdownView | MarkdownFileInfo
            ) => {
                if (view instanceof MarkdownView) {
                    this.startTimer(editor, view);
                }
            },
        });

        // Add the command to start focus mode
        this.addCommand({
            id: "start-todo-timer-focus-mode",
            name: "Toggle Focus Mode",
            editorCallback: (
                editor: Editor,
                view: MarkdownView | MarkdownFileInfo
            ) => {
                if (view instanceof MarkdownView) {
                    this.toggleFocusMode();
                }
            },
        });

        // Add settings tab
        this.addSettingTab(new TaskTimerSettingTab(this.app, this));
    }

    onunload() {
        // Cleanup timers
        timerStore.clear();

        // Clear focus mode interval
        if (this.focusModeInterval) {
            clearInterval(this.focusModeInterval);
        }

        // Destroy timer component
        if (this.timerComponent) {
            this.timerComponent.$destroy();
        }
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    startTimer(editor: Editor, view: MarkdownView) {
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);

        // Check if the line is a todo item
        if (!line.match(/^- \[.\]/)) {
            new Notice("Not a valid todo item");
            return;
        }

        // Get the description part of the todo (before checking time format)
        const description = line
            .replace(/^- \[.\] \d*(min|s)? ?\| ?/, "")
            .trim();

        // Check if there's already a timer for this task
        const timers = timerStore.getTimers();
        const existingTimerEntry = Array.from(timers.entries()).find(
            ([_, timer]) =>
                timer.description === description &&
                timer.lineNumber === cursor.line
        );

        if (existingTimerEntry) {
            const [timerId, timer] = existingTimerEntry;
            // If the task is in progress (has [*]), complete it
            if (line.includes("- [*]")) {
                const totalTimeMs = Date.now() - timer.startTime;
                const actualTime = Math.ceil(totalTimeMs / 60000);
                const completedLine = line.replace(
                    /^- \[\*\] \d+(s|min) \|/,
                    `- [x] ${actualTime}min |`
                );
                editor.setLine(cursor.line, completedLine);
                timerStore.cancelTimer(timerId);
                new Notice(`Task completed in ${actualTime} minutes`);
            } else {
                // If it's not in progress (just selected), cancel it
                timerStore.cancelTimer(timerId);
                editor.setLine(cursor.line, line.replace("- [*]", "- [ ]"));
            }
            return;
        }

        // Extract time from the todo title
        const timeMatch = line.match(/^- \[ \] (\d+)(min|s) \|/);
        if (!timeMatch) {
            new Notice(
                "Todo must have format: '- [ ] 5min | Task description'"
            );
            return;
        }

        const timeValue = parseInt(timeMatch[1]);
        const timeUnit = timeMatch[2];
        const milliseconds =
            timeUnit === "min" ? timeValue * 60 * 1000 : timeValue * 1000;

        // Replace checkbox with "in progress" symbol
        const updatedLine = line.replace(/^- \[ \]/, "- [*]");
        editor.setLine(cursor.line, updatedLine);

        // Create a unique ID for this timer
        const timerId = `timer-${Date.now()}`;
        const endTime = Date.now() + milliseconds;

        const timeout = setTimeout(() => {
            if (this.settings.notificationSound) {
                playNotificationSound();
            }

            if (this.settings.focusOnComplete) {
                this.focusObsidianWindow();
            }

            // Instead of completing the task, set it to overtime
            timerStore.setOvertime(timerId);
            new Notice(`Timer exceeded - now in overtime!`);
        }, milliseconds);

        // Add timer to store
        timerStore.addTimer(timerId, {
            timeout,
            endTime,
            description,
            lineNumber: cursor.line,
            isPaused: false,
            remainingTime: milliseconds,
            isOvertime: false,
            startTime: Date.now(),
        });
    }

    focusObsidianWindow() {
        // @ts-ignore
        const win = window.require?.("electron")?.remote?.getCurrentWindow();
        if (win) {
            win.focus();
            return;
        }
    }

    disableFocusMode(focusModeInterval: NodeJS.Timeout) {
        // Disable focus mode
        clearInterval(focusModeInterval);
        this.focusModeInterval = null;
        new Notice("Focus mode disabled");
    }

    toggleFocusMode() {
        if (this.focusModeInterval) {
            this.disableFocusMode(this.focusModeInterval);
            if (this.timerComponent) {
                this.timerComponent.$set({ focusMode: false });
            }
            return;
        }

        // Enable focus mode
        if (this.timerComponent) {
            this.timerComponent.$set({ focusMode: true });
        }
        new Notice("Focus mode enabled - start a timer to stay focused!");

        // Check every 5 seconds if there's a timer running
        this.focusModeInterval = setInterval(() => {
            const timers = timerStore.getTimers();
            if (timers.size === 0) {
                this.focusObsidianWindow();
            }
        }, 5000);
    }
}

class TaskTimerSettingTab extends PluginSettingTab {
    plugin: TaskTimerPlugin;

    constructor(app: App, plugin: TaskTimerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Task Timer Settings" });

        new Setting(containerEl)
            .setName("Notification Sound")
            .setDesc("Play a sound when a timer completes")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.notificationSound)
                    .onChange(async (value) => {
                        this.plugin.settings.notificationSound = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Focus Window")
            .setDesc("Focus the Obsidian window when a timer completes")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.focusOnComplete)
                    .onChange(async (value) => {
                        this.plugin.settings.focusOnComplete = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
