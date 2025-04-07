# Obsidian Task Timer Plugin

A simple and efficient timer plugin for Obsidian that helps you track time spent on your tasks directly from your todo lists.

![demo][demo.png]

## Features

-   ⏱️ Create timers directly from todo items
-   🔄 Auto-completion of todos when timers finish
-   🔔 Optional notification sounds
-   🪟 Optional redirect to Obsidian after timer completion
-   👁️ Always-visible timer display
-   ⌨️ Keyboard shortcut support (Ctrl+H)

## Usage

1. Create a todo item with a time specification:

    ```markdown
    -   [ ] 5min | Write documentation
    -   [ ] 30s | Quick review
    ```

2. Place your cursor on the todo line and:

    - Press `Ctrl+H`, or
    - Use the command palette and search for "Start Timer for Selected Todo"

3. The timer will:
    - Change the checkbox to `[*]` while running
    - Show remaining time in the bottom-right corner
    - Mark the task as complete `[x]` when finished
    - Play a sound (if enabled)
    - Redirect back to obsidian (if enabled)

## Time Format

-   Minutes: `5min`, `10min`, etc.
-   Seconds: `30s`, `45s`, etc.

## Settings

-   **Notification Sound**: Toggle sound when timer completes
-   **Focus Window**: Toggle window focus when timer completes

## Installation

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Task Timer"
4. Install the plugin and enable it

## License

MIT
