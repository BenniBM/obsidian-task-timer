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

    async onload() {
        await this.loadSettings();

        // Mount timer component
        const timerContainer = document.createElement("div");
        document.body.appendChild(timerContainer);
        this.timerComponent = new TimerDisplay({
            target: timerContainer,
        });

        // Add ribbon icon
        this.addRibbonIcon("clock", "Task Timer", () => {
            new Notice(
                "Timer component is always visible in the bottom right corner"
            );
        });

        // Add the command to start a timer with Ctrl+H
        this.addCommand({
            id: "start-todo-timer",
            name: "Start Timer for Selected Todo",
            hotkeys: [{ modifiers: ["Ctrl"], key: "H" }],
            editorCallback: (
                editor: Editor,
                view: MarkdownView | MarkdownFileInfo
            ) => {
                if (view instanceof MarkdownView) {
                    this.startTimer(editor, view);
                }
            },
        });

        // Add settings tab
        this.addSettingTab(new TaskTimerSettingTab(this.app, this));
    }

    onunload() {
        // Cleanup timers
        timerStore.clear();

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
            const [timerId] = existingTimerEntry;
            timerStore.cancelTimer(timerId);
            editor.setLine(cursor.line, line.replace("- [*]", "- [ ]"));
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

            // Mark todo as complete
            const completedLine = updatedLine.replace(/^- \[\*\]/, "- [x]");
            editor.setLine(cursor.line, completedLine);

            // Remove from active timers
            timerStore.removeTimer(timerId);
            this.notifiedTimers.delete(timerId);

            new Notice(`✅ Timer completed!`);
        }, milliseconds);

        // Add timer to store
        timerStore.addTimer(timerId, {
            timeout,
            endTime,
            description,
            lineNumber: cursor.line,
            isPaused: false,
            remainingTime: milliseconds,
        });
    }

    focusObsidianWindow() {
        // @ts-ignore
        const win = window.require?.("electron")?.remote?.getCurrentWindow();
        if (win) {
            win.show();
            win.focus();
            return;
        }
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
