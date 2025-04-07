// vite.config.mjs
import path from "path";
import { defineConfig } from "file:///home/benni/Documents/Obsidian%20Vault/.obsidian/plugins/obsidian-task-timer/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/benni/Documents/Obsidian%20Vault/.obsidian/plugins/obsidian-task-timer/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import autoPreprocess from "file:///home/benni/Documents/Obsidian%20Vault/.obsidian/plugins/obsidian-task-timer/node_modules/svelte-preprocess/dist/index.js";
import builtins from "file:///home/benni/Documents/Obsidian%20Vault/.obsidian/plugins/obsidian-task-timer/node_modules/builtin-modules/index.js";
import tailwindcss from "file:///home/benni/Documents/Obsidian%20Vault/.obsidian/plugins/obsidian-task-timer/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///home/benni/Documents/Obsidian%20Vault/.obsidian/plugins/obsidian-task-timer/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "/home/benni/Documents/Obsidian Vault/.obsidian/plugins/obsidian-task-timer";
var prod = process.argv[2] === "production";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      svelte({
        preprocess: autoPreprocess({
          postcss: true
        })
      })
    ],
    watch: !prod,
    build: {
      sourcemap: prod ? false : "inline",
      minify: prod,
      // Use Vite lib mode https://vitejs.dev/guide/build.html#library-mode
      commonjsOptions: {
        ignoreTryCatch: false
      },
      lib: {
        entry: path.resolve(__vite_injected_original_dirname, "./src/starterIndex.ts"),
        formats: ["cjs"]
      },
      css: {
        postcss: {
          plugins: [
            tailwindcss,
            autoprefixer
          ]
        }
      },
      rollupOptions: {
        output: {
          // Overwrite default Vite output fileName
          entryFileNames: "main.js",
          assetFileNames: "styles.css"
        },
        external: [
          "obsidian",
          "electron",
          "codemirror",
          "@codemirror/autocomplete",
          "@codemirror/closebrackets",
          "@codemirror/collab",
          "@codemirror/commands",
          "@codemirror/comment",
          "@codemirror/fold",
          "@codemirror/gutter",
          "@codemirror/highlight",
          "@codemirror/history",
          "@codemirror/language",
          "@codemirror/lint",
          "@codemirror/matchbrackets",
          "@codemirror/panel",
          "@codemirror/rangeset",
          "@codemirror/rectangular-selection",
          "@codemirror/search",
          "@codemirror/state",
          "@codemirror/stream-parser",
          "@codemirror/text",
          "@codemirror/tooltip",
          "@codemirror/view",
          "@lezer/common",
          "@lezer/lr",
          "@lezer/highlight",
          ...builtins
        ]
      },
      // Use root as the output dir
      emptyOutDir: false,
      outDir: "."
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYmVubmkvRG9jdW1lbnRzL09ic2lkaWFuIFZhdWx0Ly5vYnNpZGlhbi9wbHVnaW5zL29ic2lkaWFuLXRhc2stdGltZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Jlbm5pL0RvY3VtZW50cy9PYnNpZGlhbiBWYXVsdC8ub2JzaWRpYW4vcGx1Z2lucy9vYnNpZGlhbi10YXNrLXRpbWVyL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9iZW5uaS9Eb2N1bWVudHMvT2JzaWRpYW4lMjBWYXVsdC8ub2JzaWRpYW4vcGx1Z2lucy9vYnNpZGlhbi10YXNrLXRpbWVyL3ZpdGUuY29uZmlnLm1qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBzdmVsdGUgfSBmcm9tICdAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlJztcbmltcG9ydCBhdXRvUHJlcHJvY2VzcyBmcm9tICdzdmVsdGUtcHJlcHJvY2Vzcyc7XG5pbXBvcnQgYnVpbHRpbnMgZnJvbSAnYnVpbHRpbi1tb2R1bGVzJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5cbmNvbnN0IHByb2QgPSAocHJvY2Vzcy5hcmd2WzJdID09PSAncHJvZHVjdGlvbicpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgIHN2ZWx0ZSh7XG4gICAgICAgICAgICAgICAgcHJlcHJvY2VzczogYXV0b1ByZXByb2Nlc3Moe1xuICAgICAgICAgICAgICAgICAgICBwb3N0Y3NzOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICBdLFxuICAgICAgICB3YXRjaDogIXByb2QsXG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICBzb3VyY2VtYXA6IHByb2QgPyBmYWxzZSA6ICdpbmxpbmUnLFxuICAgICAgICAgICAgbWluaWZ5OiBwcm9kLFxuICAgICAgICAgICAgLy8gVXNlIFZpdGUgbGliIG1vZGUgaHR0cHM6Ly92aXRlanMuZGV2L2d1aWRlL2J1aWxkLmh0bWwjbGlicmFyeS1tb2RlXG4gICAgICAgICAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBpZ25vcmVUcnlDYXRjaDogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGliOiB7XG4gICAgICAgICAgICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9zdGFydGVySW5kZXgudHMnKSxcbiAgICAgICAgICAgICAgICBmb3JtYXRzOiBbJ2NqcyddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFpbHdpbmRjc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRvcHJlZml4ZXIsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE92ZXJ3cml0ZSBkZWZhdWx0IFZpdGUgb3V0cHV0IGZpbGVOYW1lXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnbWFpbi5qcycsXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnc3R5bGVzLmNzcycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogWydvYnNpZGlhbicsXG4gICAgICAgICAgICAgICAgICAgICdlbGVjdHJvbicsXG4gICAgICAgICAgICAgICAgICAgIFwiY29kZW1pcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL2F1dG9jb21wbGV0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL2Nsb3NlYnJhY2tldHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJAY29kZW1pcnJvci9jb2xsYWJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJAY29kZW1pcnJvci9jb21tYW5kc1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL2NvbW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJAY29kZW1pcnJvci9mb2xkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3IvZ3V0dGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3IvaGlnaGxpZ2h0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3IvaGlzdG9yeVwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL2xhbmd1YWdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3IvbGludFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL21hdGNoYnJhY2tldHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJAY29kZW1pcnJvci9wYW5lbFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL3Jhbmdlc2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3IvcmVjdGFuZ3VsYXItc2VsZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3Ivc2VhcmNoXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3Ivc3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJAY29kZW1pcnJvci9zdHJlYW0tcGFyc2VyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGNvZGVtaXJyb3IvdGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBjb2RlbWlycm9yL3Rvb2x0aXBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJAY29kZW1pcnJvci92aWV3XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQGxlemVyL2NvbW1vblwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBsZXplci9sclwiLFxuICAgICAgICAgICAgICAgICAgICBcIkBsZXplci9oaWdobGlnaHRcIixcbiAgICAgICAgICAgICAgICAgICAgLi4uYnVpbHRpbnMsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBVc2Ugcm9vdCBhcyB0aGUgb3V0cHV0IGRpclxuICAgICAgICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgICAgICAgICAgb3V0RGlyOiAnLicsXG4gICAgICAgIH0sXG4gICAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9aLE9BQU8sVUFBVTtBQUNyYSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGNBQWM7QUFDdkIsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxjQUFjO0FBQ3JCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBTnpCLElBQU0sbUNBQW1DO0FBUXpDLElBQU0sT0FBUSxRQUFRLEtBQUssQ0FBQyxNQUFNO0FBRWxDLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBQzlCLFNBQU87QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNMLE9BQU87QUFBQSxRQUNILFlBQVksZUFBZTtBQUFBLFVBQ3ZCLFNBQVM7QUFBQSxRQUNiLENBQUM7QUFBQSxNQUNMLENBQUM7QUFBQSxJQUNMO0FBQUEsSUFDQSxPQUFPLENBQUM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNILFdBQVcsT0FBTyxRQUFRO0FBQUEsTUFDMUIsUUFBUTtBQUFBO0FBQUEsTUFFUixpQkFBaUI7QUFBQSxRQUNiLGdCQUFnQjtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxLQUFLO0FBQUEsUUFDRCxPQUFPLEtBQUssUUFBUSxrQ0FBVyx1QkFBdUI7QUFBQSxRQUN0RCxTQUFTLENBQUMsS0FBSztBQUFBLE1BQ25CO0FBQUEsTUFDQSxLQUFLO0FBQUEsUUFDRCxTQUFTO0FBQUEsVUFDTCxTQUFTO0FBQUEsWUFDTDtBQUFBLFlBQ0E7QUFBQSxVQUNKO0FBQUEsUUFDSjtBQUFBLE1BQ0o7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNYLFFBQVE7QUFBQTtBQUFBLFVBRUosZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsUUFDcEI7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUFDO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLEdBQUc7QUFBQSxRQUNQO0FBQUEsTUFDSjtBQUFBO0FBQUEsTUFFQSxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsSUFDWjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
