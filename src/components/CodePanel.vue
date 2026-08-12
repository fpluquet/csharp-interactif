<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { ReturnFlow } from "../types/memory";

const props = defineProps<{
  lines: string[];
  /** Lignes qui viennent d’être exécutées (état mémoire = après). */
  highlightLines: number[];
  /** Lignes de l’étape suivante (aperçu « à venir »). */
  nextHighlightLines?: number[];
  /** Indices de lignes associées à au moins une étape (cliquables). */
  navigableLines?: number[];
  returnFlow?: ReturnFlow;
}>();

const emit = defineEmits<{
  selectLine: [lineIndex: number];
}>();

const bodyRef = ref<HTMLElement | null>(null);

const navigableSet = computed(() => new Set(props.navigableLines ?? []));
const nextSet = computed(() => new Set(props.nextHighlightLines ?? []));

function isNavigable(lineIndex: number) {
  return navigableSet.value.has(lineIndex);
}

function isExecuted(lineIndex: number) {
  return props.highlightLines.includes(lineIndex);
}

function isUpcoming(lineIndex: number) {
  return !isExecuted(lineIndex) && nextSet.value.has(lineIndex);
}

function lineTitle(lineIndex: number) {
  if (isExecuted(lineIndex)) {
    return "Vient d’être exécutée — la mémoire montre l’état après cette ligne";
  }
  if (isUpcoming(lineIndex)) {
    return "Prochaine étape — pas encore exécutée";
  }
  if (isNavigable(lineIndex)) {
    return "Aller à l’étape de cette ligne";
  }
  return undefined;
}

function onLineClick(lineIndex: number) {
  if (!isNavigable(lineIndex)) return;
  emit("selectLine", lineIndex);
}

function onLineKeydown(event: KeyboardEvent, lineIndex: number) {
  if (!isNavigable(lineIndex)) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("selectLine", lineIndex);
  }
}

function tokenize(line: string): { text: string; type: string }[] {
  const parts = line.split(
    /(\b(?:static|void|public|private|class|interface|int|bool|double|string|object|char|var|new|true|false|null|List|ref|out|return|if|else|switch|case|default|break|continue|for|while|do|foreach|in|try|catch|finally|throw|using|namespace|virtual|override|abstract|base)\b|"[^"]*"|\d+(?:\.\d+)?[fdm]?|\/\/.*$|[=;{}()[\],.:+*\/%<>!?|&^-])/g,
  );

  return parts
    .filter((p) => p !== undefined && p !== "")
    .map((text) => {
      if (/^\/\//.test(text)) return { text, type: "comment" };
      if (/^"(?:[^"]*)"$/.test(text)) return { text, type: "string" };
      if (
        /^(static|void|public|private|class|interface|new|ref|out|return|if|else|switch|case|default|break|continue|for|while|do|foreach|in|try|catch|finally|throw|using|namespace|virtual|override|abstract|base)$/.test(
          text,
        )
      ) {
        return { text, type: "keyword" };
      }
      if (/^(int|bool|double|string|object|char|var|List)$/.test(text)) {
        return { text, type: "type" };
      }
      if (/^(true|false|null)$/.test(text)) return { text, type: "bool" };
      if (/^\d+(?:\.\d+)?[fdm]?$/.test(text)) return { text, type: "number" };
      return { text, type: "plain" };
    });
}

type LinePart =
  | { kind: "tokens"; text: string }
  | { kind: "rewrite"; before: string; call: string; after: string; value: string; phase: ReturnFlow["phase"] };

const renderedLines = computed(() => {
  const flow = props.returnFlow;
  return props.lines.map((line, index) => {
    if (
      !flow ||
      index !== flow.callLine ||
      (flow.phase !== "replaces" && flow.phase !== "assigned")
    ) {
      return { index, parts: [{ kind: "tokens" as const, text: line }] };
    }

    const at = line.indexOf(flow.callExpr);
    if (at < 0) {
      return { index, parts: [{ kind: "tokens" as const, text: line }] };
    }

    const part: LinePart = {
      kind: "rewrite",
      before: line.slice(0, at),
      call: flow.callExpr,
      after: line.slice(at + flow.callExpr.length),
      value: flow.value,
      phase: flow.phase,
    };
    return { index, parts: [part] };
  });
});

async function scrollToHighlight() {
  await nextTick();
  const body = bodyRef.value;
  if (!body || !props.highlightLines.length) return;

  const targetIndex = Math.min(...props.highlightLines);
  const line = body.querySelector(
    `[data-line-index="${targetIndex}"]`,
  ) as HTMLElement | null;
  if (!line) return;

  const bodyRect = body.getBoundingClientRect();
  const lineRect = line.getBoundingClientRect();
  const offset =
    lineRect.top - bodyRect.top - bodyRect.height / 2 + lineRect.height / 2;

  body.scrollTo({
    top: body.scrollTop + offset,
    behavior: "smooth",
  });
}

watch(
  () => [props.highlightLines.slice(), props.returnFlow?.phase] as const,
  () => {
    void scrollToHighlight();
  },
  { flush: "post" },
);
</script>

<template>
  <section class="code-panel panel">
    <header class="code-panel__header">
      <p class="panel-label">Code C#</p>
    </header>

    <div
      ref="bodyRef"
      class="code-panel__body"
      role="region"
      aria-label="Code source"
    >
      <div
        v-for="row in renderedLines"
        :key="row.index"
        class="code-line"
        :data-line-index="row.index"
        :class="{
          'is-executed': isExecuted(row.index),
          'is-upcoming': isUpcoming(row.index),
          'is-navigable': isNavigable(row.index),
        }"
        :role="isNavigable(row.index) ? 'button' : undefined"
        :tabindex="isNavigable(row.index) ? 0 : undefined"
        :title="lineTitle(row.index)"
        @click="onLineClick(row.index)"
        @keydown="onLineKeydown($event, row.index)"
      >
        <span class="code-line__num">{{ row.index + 1 }}</span>
        <code class="code-line__text">
          <template v-for="(part, pi) in row.parts" :key="pi">
            <template v-if="part.kind === 'tokens'">
              <template v-if="part.text.length">
                <span
                  v-for="(tok, ti) in tokenize(part.text)"
                  :key="ti"
                  :class="`tok tok--${tok.type}`"
                >{{ tok.text }}</span>
              </template>
              <span v-else>&nbsp;</span>
            </template>

            <template v-else>
              <span
                v-for="(tok, ti) in tokenize(part.before)"
                :key="`b-${ti}`"
                :class="`tok tok--${tok.type}`"
              >{{ tok.text }}</span>

              <span class="rewrite" :data-phase="part.phase">
                <span class="rewrite__old" title="Appel d’origine">{{ part.call }}</span>
                <span class="rewrite__arrow" aria-hidden="true">→</span>
                <span class="rewrite__new" title="Valeur qui remplace l’appel">{{ part.value }}</span>
              </span>

              <span
                v-for="(tok, ti) in tokenize(part.after)"
                :key="`a-${ti}`"
                :class="`tok tok--${tok.type}`"
              >{{ tok.text }}</span>
            </template>
          </template>
        </code>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.code-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: linear-gradient(165deg, #0e1a2c, var(--bg-code));
}

.code-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.1rem 0.55rem;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}

.code-panel__body {
  flex: 1;
  margin: 0;
  padding: 0.75rem 0.6rem 1rem;
  overflow: auto;
  font-family: var(--font-code);
  font-size: 0.98rem;
  line-height: 1.65;
}

.code-line {
  display: grid;
  grid-template-columns: 2.2rem 1fr;
  gap: 0.65rem;
  padding: 0.12rem 0.55rem;
  border-radius: var(--radius-sm);
  border-left: 3px solid transparent;
  transition:
    background var(--duration) var(--ease),
    border-color var(--duration) var(--ease);

  &.is-executed {
    background: rgba(46, 196, 166, 0.12);
    border-left-color: var(--stack);
  }

  &.is-upcoming {
    background: rgba(107, 163, 240, 0.12);
    border-left-color: var(--accent);
  }

  &.is-navigable {
    cursor: pointer;

    &:hover:not(.is-executed) {
      background: rgba(107, 163, 240, 0.06);
    }

    &:focus-visible {
      outline: 2px solid rgba(107, 163, 240, 0.55);
      outline-offset: 1px;
    }
  }
}

.code-line__num {
  text-align: right;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.code-line__text {
  white-space: pre;
  color: var(--text);
  font-family: inherit;
}

.rewrite {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0.1rem;
  padding: 0.05rem 0.35rem;
  border-radius: 6px;
  background: rgba(107, 163, 240, 0.16);
  border: 1px solid rgba(107, 163, 240, 0.4);
  vertical-align: baseline;
  animation: rewrite-in 420ms var(--ease);
}

.rewrite__old {
  text-decoration: line-through;
  color: var(--text-dim);
  opacity: 0.85;
}

.rewrite__arrow {
  color: var(--accent);
  font-weight: 700;
}

.rewrite__new {
  color: var(--accent);
  font-weight: 700;
  font-size: 1.05em;
}

.rewrite[data-phase="assigned"] {
  border-color: rgba(46, 196, 166, 0.45);
  background: rgba(46, 196, 166, 0.12);

  .rewrite__new {
    color: var(--stack);
  }

  .rewrite__arrow {
    color: var(--stack);
  }
}

@keyframes rewrite-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tok--keyword {
  color: #7eb6ff;
}
.tok--type {
  color: #6ed6c0;
}
.tok--string {
  color: #f0b07a;
}
.tok--number {
  color: #d4a5ff;
}
.tok--bool {
  color: #d4a5ff;
}
.tok--comment {
  color: var(--text-dim);
  font-style: italic;
}
</style>
