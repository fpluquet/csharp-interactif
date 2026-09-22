import { computed, ref } from "vue";

export type Theme = "dark" | "light";

const STORAGE_KEY = "csharp-exemple-theme";

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const theme = ref<Theme>(readStoredTheme());

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
}

applyTheme(theme.value);

export function useTheme() {
  const isLight = computed(() => theme.value === "light");

  function setTheme(next: Theme) {
    theme.value = next;
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* préférence non persistée */
    }
  }

  function toggleTheme() {
    setTheme(theme.value === "light" ? "dark" : "light");
  }

  return { theme, isLight, setTheme, toggleTheme };
}
