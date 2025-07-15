import { Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * Custom hook to reactively track the system theme.
 *
 * @returns An accessors that evaluates true if the system is in dark mode.
 */
export function useSystemTheme(): Accessor<boolean> {
  const [isDark, setIsDark] = createSignal(true);

  onMount(() => {
    // The media query instantiation must be done client-side.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setIsDark(mediaQuery.matches);

    // Update the theme immediately when the hook is mounted.
    updateTheme();

    // Add an event listener to track theme changes and update the accessor.
    mediaQuery.addEventListener("change", updateTheme);

    // Clean up the hook when dropped.
    onCleanup(() => mediaQuery.removeEventListener("change", updateTheme));
  });

  return isDark;
}
