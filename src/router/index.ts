import { createRouter, createWebHistory } from "vue-router";
import { getScenario, scenarios } from "../data";
import HomeView from "../views/HomeView.vue";

export function scenarioPath(id: string): string {
  return `/s/${encodeURIComponent(id)}`;
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: () => scenarioPath(scenarios[0].id),
    },
    {
      path: "/s/:scenarioId",
      name: "scenario",
      component: HomeView,
      beforeEnter(to) {
        const id = String(to.params.scenarioId);
        if (!getScenario(id)) {
          return scenarioPath(scenarios[0].id);
        }
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: () => scenarioPath(scenarios[0].id),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    // Changer de scénario ne doit pas remonter la page.
    if (to.name === "scenario" && from.name === "scenario") return false;
    return { top: 0 };
  },
});
