<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { scenarios, getScenario } from "../data";
import ScenarioPicker from "../components/ScenarioPicker.vue";
import ScenarioPlayer from "../components/ScenarioPlayer.vue";
import { useTheme } from "../composables/useTheme";

const { isLight, toggleTheme } = useTheme();

const route = useRoute();
const router = useRouter();
const showAllScenarios = ref(false);

const activeId = computed(() => {
  const id = String(route.params.scenarioId ?? "");
  return getScenario(id)?.id ?? scenarios[0].id;
});

const activeScenario = computed(
  () => getScenario(activeId.value) ?? scenarios[0],
);

watch(
  activeScenario,
  (scenario) => {
    document.title = `${scenario.title} · C# par l’exemple`;
  },
  { immediate: true },
);

function selectScenario(id: string) {
  showAllScenarios.value = false;
  if (id === activeId.value) return;
  void router.push({ name: "scenario", params: { scenarioId: id } });
}
</script>

<template>
  <div class="home">
    <header class="home__hero">
      <div class="home__brand">
        <p class="home__eyebrow">C# · exécution</p>
        <h1 class="home__title">C# par l’exemple</h1>
        <p class="home__lead">
          Suivez pas à pas l’exécution d’un programme : variables, appels,
          mémoire, console, fichiers et orienté objet (syllabus Q2).
        </p>
      </div>

      <ul class="home__facts">
        <li><span>Code</span> ligne par ligne</li>
        <li><span>Mémoire</span> stack &amp; heap</li>
        <li><span>Effets</span> console &amp; fichiers</li>
      </ul>
    </header>

    <div class="home__picker-toggle">
      <button
        type="button"
        class="theme-toggle"
        :aria-pressed="isLight"
        @click="toggleTheme"
      >
        <svg
          v-if="isLight"
          class="theme-toggle__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M14.5 3.2a8.8 8.8 0 1 0 6.3 12.4A7.2 7.2 0 0 1 14.5 3.2Z"
          />
        </svg>
        <svg
          v-else
          class="theme-toggle__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3.4" fill="currentColor" />
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
          >
            <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1" />
            <path d="m5.6 5.6 1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5" />
          </g>
        </svg>
        {{ isLight ? "Thème sombre" : "Thème clair" }}
      </button>
      <button
        type="button"
        class="home__toggle-btn"
        :aria-expanded="showAllScenarios"
        @click="showAllScenarios = !showAllScenarios"
      >
        {{ showAllScenarios ? "Masquer la liste" : "Voir tous les scénarios" }}
      </button>
    </div>

    <ScenarioPicker
      v-if="showAllScenarios"
      :scenarios="scenarios"
      :active-id="activeId"
      @select="selectScenario"
    />

    <ScenarioPlayer
      :key="activeScenario.id"
      :scenarios="scenarios"
      :scenario="activeScenario"
      :active-id="activeId"
      @select="selectScenario"
    />
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  padding: 1.75rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.7fr);
  gap: 1.5rem;
  align-items: end;
  padding: 0.35rem 0.15rem 0.5rem;
}

.home__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.home__title {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 5vw, 4rem);
  font-weight: 560;
  letter-spacing: -0.03em;
  line-height: 1.02;
  margin-top: 0.35rem;
  background: linear-gradient(120deg, var(--text) 40%, var(--title-fade) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.home__lead {
  margin-top: 0.85rem;
  max-width: 42ch;
  font-size: 1.12rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.home__facts {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--card-soft);

  li {
    font-size: 0.95rem;
    color: var(--text-muted);

    span {
      display: inline-block;
      min-width: 5.5rem;
      font-family: var(--font-code);
      font-weight: 600;
      color: var(--text);
    }

    &:nth-child(1) span {
      color: var(--stack);
    }
    &:nth-child(2) span {
      color: var(--heap);
    }
    &:nth-child(3) span {
      color: var(--accent);
    }
  }
}

.home__picker-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.75rem 0.32rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card-soft);
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 650;
  letter-spacing: 0.01em;
  transition:
    color var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    background var(--duration) var(--ease);

  &:hover {
    color: var(--text);
    border-color: var(--text-dim);
    background: var(--chip-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
}

.theme-toggle__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.home__toggle-btn {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  padding: 0.25rem 0.15rem;

  &:hover {
    color: var(--link-hover);
  }
}

@media (max-width: 800px) {
  .home {
    padding-inline: 0.75rem;
  }

  .home__hero {
    grid-template-columns: 1fr;
  }
}
</style>
