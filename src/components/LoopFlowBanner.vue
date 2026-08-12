<script setup lang="ts">
import { computed } from "vue";
import type { LoopFlow, LoopPhase } from "../types/memory";

const props = defineProps<{
  flow: LoopFlow;
}>();

const phaseOrder = computed<LoopPhase[]>(() => {
  switch (props.flow.kind) {
    case "for":
      return ["init", "test", "body", "post", "done"];
    case "while":
      return ["test", "body", "post", "done"];
    case "do-while":
      return ["body", "post", "test", "done"];
    case "foreach":
      return ["test", "body", "done"];
  }
});

const phaseLabel: Record<LoopPhase, string> = {
  init: "Init",
  test: "Test",
  body: "Corps",
  post: "Post",
  done: "Fin",
};

const kindLabel: Record<LoopFlow["kind"], string> = {
  for: "Boucle for",
  while: "Boucle while",
  "do-while": "Boucle do / while",
  foreach: "Boucle foreach",
};

function chipClass(phase: LoopPhase) {
  const active = props.flow.phase === phase;
  const order = phaseOrder.value;
  const activeIdx = order.indexOf(props.flow.phase);
  const idx = order.indexOf(phase);
  return {
    "is-active": active,
    "is-done": idx >= 0 && activeIdx > idx,
    "is-dim": !active && !(idx >= 0 && activeIdx > idx),
  };
}
</script>

<template>
  <aside class="loop-flow panel" :data-phase="flow.phase" :data-kind="flow.kind">
    <p class="panel-label">{{ kindLabel[flow.kind] }}</p>
    <p class="loop-flow__caption">
      <template v-if="flow.phase === 'init'">Initialisation</template>
      <template v-else-if="flow.phase === 'test'">
        Test de la condition
        <span v-if="flow.conditionResult === true" class="tag tag--ok">vrai</span>
        <span v-else-if="flow.conditionResult === false" class="tag tag--no">faux</span>
      </template>
      <template v-else-if="flow.phase === 'body'">
        Exécution du bloc
        <span v-if="flow.iteration" class="tag">tour {{ flow.iteration }}</span>
      </template>
      <template v-else-if="flow.phase === 'post'">Post-traitement</template>
      <template v-else>Sortie de la boucle</template>
    </p>

    <div class="loop-flow__pipeline" aria-live="polite">
      <template v-for="(phase, index) in phaseOrder" :key="phase">
        <div class="chip" :class="chipClass(phase)">
          <span class="chip__label">{{ phaseLabel[phase] }}</span>
          <code v-if="phase === 'test' && flow.condition">{{ flow.condition }}</code>
          <code v-else-if="phase === flow.phase && flow.detail">{{ flow.detail }}</code>
          <code v-else-if="phase === 'body' && flow.iteration">tour {{ flow.iteration }}</code>
          <code v-else>&nbsp;</code>
        </div>
        <span
          v-if="index < phaseOrder.length - 1"
          class="arrow"
          :class="{ 'is-active': phaseOrder.indexOf(flow.phase) > index }"
          aria-hidden="true"
        >→</span>
      </template>
    </div>

    <p class="loop-flow__hint">
      <template v-if="flow.phase === 'init'">
        Une seule fois : on prépare les variables de boucle (ex. <code>i = 0</code>).
      </template>
      <template v-else-if="flow.phase === 'test' && flow.conditionResult === true">
        <code>{{ flow.condition }}</code> est <strong>vrai</strong> → on entre dans le corps.
      </template>
      <template v-else-if="flow.phase === 'test' && flow.conditionResult === false">
        <code>{{ flow.condition }}</code> est <strong>faux</strong> → on quitte la boucle.
      </template>
      <template v-else-if="flow.phase === 'body'">
        On exécute les instructions entre <code>{ }</code>
        <template v-if="flow.iteration"> (tour {{ flow.iteration }})</template>.
      </template>
      <template v-else-if="flow.phase === 'post'">
        Après le corps :
        <strong>{{ flow.detail ?? "mise à jour" }}</strong>,
        puis on reteste.
      </template>
      <template v-else>
        La boucle est terminée ; l’exécution continue après le <code>}</code>.
      </template>
    </p>
  </aside>
</template>

<style scoped lang="scss">
.loop-flow {
  padding: 0.9rem 1.05rem 1rem;
  border-color: rgba(46, 196, 166, 0.4);
  background: linear-gradient(165deg, rgba(46, 196, 166, 0.12), var(--bg-panel));
}

.loop-flow__caption {
  margin-top: 0.3rem;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 550;
  color: var(--text);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.tag {
  font-family: var(--font-ui);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-muted);

  &--ok {
    background: rgba(46, 196, 166, 0.2);
    color: #b8f5e4;
  }

  &--no {
    background: rgba(240, 113, 120, 0.2);
    color: #ffc4c7;
  }
}

.loop-flow__pipeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.chip {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 4.2rem;
  padding: 0.4rem 0.65rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: rgba(7, 16, 28, 0.45);
  transition:
    border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease),
    opacity var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease);

  code {
    font-size: 0.82rem;
    font-weight: 600;
    min-height: 1.1em;
  }

  &.is-dim {
    opacity: 0.4;
  }

  &.is-done {
    opacity: 0.75;
    border-color: rgba(46, 196, 166, 0.35);
  }

  &.is-active {
    opacity: 1;
    transform: translateY(-1px);
    border-color: rgba(46, 196, 166, 0.7);
    background: rgba(46, 196, 166, 0.16);
    box-shadow: 0 8px 22px rgba(46, 196, 166, 0.12);

    code {
      color: var(--stack);
    }
  }
}

.chip__label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.arrow {
  font-size: 1.1rem;
  color: var(--text-dim);

  &.is-active {
    color: var(--stack);
  }
}

.loop-flow__hint {
  margin-top: 0.85rem;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.45;

  code {
    color: var(--text);
    font-weight: 600;
  }

  strong {
    color: var(--stack);
  }
}
</style>
