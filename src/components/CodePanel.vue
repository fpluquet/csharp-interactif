<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from "vue";
import { lookupInlineValue, useInlineValues } from "../composables/useInlineValues";
import type { HeapObject, ReturnFlow, StackFrame } from "../types/memory";

const props = defineProps<{
  lines: string[];
  /** Lignes qui viennent d’être exécutées (état mémoire = après). */
  highlightLines: number[];
  /** Lignes de l’étape suivante (aperçu « à venir »). */
  nextHighlightLines?: number[];
  /** Indices de lignes associées à au moins une étape (cliquables). */
  navigableLines?: number[];
  returnFlow?: ReturnFlow;
  stack?: StackFrame[];
  heap?: HeapObject[];
}>();

const bindings = useInlineValues(
  toRef(() => props.stack ?? []),
  toRef(() => props.heap ?? []),
);

const emit = defineEmits<{
  selectLine: [lineIndex: number];
}>();

const bodyRef = ref<HTMLElement | null>(null);

const navigableSet = computed(() => new Set(props.navigableLines ?? []));
const nextSet = computed(() => new Set(props.nextHighlightLines ?? []));

function isNavigable(lineIndex: number) {
  return navigableSet.value.has(lineIndex);
}

function isUpcoming(lineIndex: number) {
  return nextSet.value.has(lineIndex);
}

function lineTitle(lineIndex: number) {
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

type Token = { text: string; type: string; value?: string; valueRef?: boolean };

const KEYWORDS = new Set([
  "static",
  "void",
  "public",
  "private",
  "protected",
  "class",
  "interface",
  "record",
  "new",
  "ref",
  "out",
  "in",
  "return",
  "if",
  "else",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "for",
  "while",
  "do",
  "foreach",
  "try",
  "catch",
  "finally",
  "throw",
  "using",
  "namespace",
  "virtual",
  "override",
  "abstract",
  "base",
  "sealed",
  "params",
  "where",
  "get",
  "set",
  "init",
  "yield",
  "typeof",
  "is",
  "as",
  "this",
]);

const TYPES = new Set(["int", "bool", "double", "string", "object", "char", "var", "List", "true", "false", "null"]);

function classifyWord(word: string): string {
  if (KEYWORDS.has(word)) return "keyword";
  if (TYPES.has(word) && word !== "true" && word !== "false" && word !== "null") return "type";
  if (word === "true" || word === "false" || word === "null") return "bool";
  return "ident";
}

function tokenize(line: string): Token[] {
  const parts = line.split(
    /(\b(?:static|void|public|private|protected|class|interface|record|int|bool|double|string|object|char|var|new|true|false|null|List|ref|out|in|return|if|else|switch|case|default|break|continue|for|while|do|foreach|try|catch|finally|throw|using|namespace|virtual|override|abstract|base|sealed|params|where|get|set|init|yield|typeof|is|as|this)\b|"[^"]*"|\d+(?:\.\d+)?[fdm]?|\/\/.*$|[=;{}()[\],.:+*\/%<>!?|&^-])/g,
  );

  const tokens: Token[] = [];
  for (const text of parts) {
    if (text === undefined || text === "") continue;
    if (/^\/\//.test(text)) {
      tokens.push({ text, type: "comment" });
      continue;
    }
    if (/^"(?:[^"]*)"$/.test(text)) {
      tokens.push({ text, type: "string" });
      continue;
    }
    if (/^\d+(?:\.\d+)?[fdm]?$/.test(text)) {
      tokens.push({ text, type: "number" });
      continue;
    }
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) {
      tokens.push({ text, type: classifyWord(text) });
      continue;
    }
    const bits = text.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b)/g);
    for (const bit of bits) {
      if (!bit) continue;
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(bit)) {
        tokens.push({ text: bit, type: classifyWord(bit) });
      } else {
        tokens.push({ text: bit, type: "plain" });
      }
    }
  }
  return tokens;
}

function decorate(text: string, showHints: boolean): Token[] {
  const tokens = tokenize(text);
  if (!showHints) return tokens;

  let receiver: string | undefined;
  return tokens.map((tok) => {
    const isName = tok.type === "ident" || tok.text === "this";
    if (isName) {
      const found = lookupInlineValue(tok.text, receiver, bindings.value);
      receiver = tok.text;
      if (found) return { ...tok, value: found.text, valueRef: found.ref };
      return tok;
    }
    if (tok.text === ".") return tok;
    receiver = undefined;
    return tok;
  });
}

const renderedLines = computed(() => {
  const flow = props.returnFlow;
  const active = new Set([
    ...props.highlightLines,
    ...(props.nextHighlightLines ?? []),
  ]);

  return props.lines.map((line, index) => {
    const showHints = active.has(index);
    const tokens = decorate(line, showHints);
    const hasHints = tokens.some((tok) => tok.value);

    if (
      !flow ||
      index !== flow.callLine ||
      (flow.phase !== "replaces" && flow.phase !== "assigned")
    ) {
      return { index, hasHints, parts: [{ kind: "tokens" as const, tokens }] };
    }

    const at = line.indexOf(flow.callExpr);
    if (at < 0) {
      return { index, hasHints, parts: [{ kind: "tokens" as const, tokens }] };
    }

    return {
      index,
      hasHints,
      parts: [
        {
          kind: "rewrite" as const,
          before: decorate(line.slice(0, at), showHints),
          call: flow.callExpr,
          after: decorate(line.slice(at + flow.callExpr.length), showHints),
          value: flow.value,
          phase: flow.phase,
        },
      ],
    };
  });
});

async function scrollToHighlight() {
  await nextTick();
  const body = bodyRef.value;
  if (!body) return;
  const targets = props.nextHighlightLines?.length
    ? props.nextHighlightLines
    : props.highlightLines;
  if (!targets.length) return;

  const targetIndex = Math.min(...targets);
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
  () => [props.highlightLines.slice(), props.nextHighlightLines?.slice(), props.returnFlow?.phase] as const,
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
      <p class="code-panel__keys">
        <span class="key key--next">
          <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1.2v7.6L8.8 5Z" /></svg>
          à exécuter
        </span>
      </p>
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
          'is-upcoming': isUpcoming(row.index),
          'is-navigable': isNavigable(row.index),
          'has-hints': row.hasHints,
        }"
        :role="isNavigable(row.index) ? 'button' : undefined"
        :tabindex="isNavigable(row.index) ? 0 : undefined"
        :title="lineTitle(row.index)"
        @click="onLineClick(row.index)"
        @keydown="onLineKeydown($event, row.index)"
      >
        <span class="code-line__mark" aria-hidden="true">
          <svg
            v-if="isUpcoming(row.index)"
            :key="`next-${row.index}`"
            class="mark mark--next"
            viewBox="0 0 10 10"
          >
            <path d="M2 1.2v7.6L8.8 5Z" />
          </svg>
        </span>
        <span class="code-line__num">{{ row.index + 1 }}</span>
        <code class="code-line__text">
          <template v-for="(part, pi) in row.parts" :key="pi">
            <template v-if="part.kind === 'tokens'">
              <template v-if="part.tokens.length">
                <span
                  v-for="(tok, ti) in part.tokens"
                  :key="ti"
                  :class="[
                    `tok tok--${tok.type}`,
                    { 'has-val': tok.value, 'has-val--ref': tok.valueRef },
                  ]"
                >
                  <span v-if="tok.value" class="tok__hint">{{ tok.value }}</span>{{ tok.text }}
                </span>
              </template>
              <span v-else>&nbsp;</span>
            </template>

            <template v-else>
              <span
                v-for="(tok, ti) in part.before"
                :key="`b-${ti}`"
                :class="[
                  `tok tok--${tok.type}`,
                  { 'has-val': tok.value, 'has-val--ref': tok.valueRef },
                ]"
              >
                <span v-if="tok.value" class="tok__hint">{{ tok.value }}</span>{{ tok.text }}
              </span>

              <span class="rewrite" :data-phase="part.phase">
                <span class="rewrite__old" title="Appel d’origine">{{ part.call }}</span>
                <span class="rewrite__arrow" aria-hidden="true">→</span>
                <span class="rewrite__new" title="Valeur qui remplace l’appel">{{ part.value }}</span>
              </span>

              <span
                v-for="(tok, ti) in part.after"
                :key="`a-${ti}`"
                :class="[
                  `tok tok--${tok.type}`,
                  { 'has-val': tok.value, 'has-val--ref': tok.valueRef },
                ]"
              >
                <span v-if="tok.value" class="tok__hint">{{ tok.value }}</span>{{ tok.text }}
              </span>
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
  gap: 0.75rem;
  padding: 0.85rem 1.1rem 0.55rem;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
}

.code-panel__keys {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.key {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;

  svg {
    width: 0.7rem;
    height: 0.7rem;
    flex-shrink: 0;
  }
}

.key--next svg {
  fill: var(--accent);
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
  grid-template-columns: 0.9rem 2rem minmax(0, 1fr);
  align-items: end;
  gap: 0.35rem;
  padding: 0.12rem 0.55rem 0.12rem 0.35rem;
  border-radius: var(--radius-sm);
  border-left: 3px solid transparent;
  overflow: visible;
  transition:
    background var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    padding-top var(--duration) var(--ease);

  &.has-hints {
    padding-top: 1.2rem;
  }

  &.is-upcoming {
    background: rgba(107, 163, 240, 0.12);
    border-left-color: var(--accent);
  }

  &.is-navigable {
    cursor: pointer;

    &:hover:not(.is-upcoming) {
      background: rgba(107, 163, 240, 0.06);
    }

    &:focus-visible {
      outline: 2px solid rgba(107, 163, 240, 0.55);
      outline-offset: 1px;
    }
  }
}

.code-line__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.65em;
  color: transparent;
}

.mark {
  width: 0.72rem;
  height: 0.72rem;
  display: block;
}

.mark--next {
  fill: var(--accent);
  filter: drop-shadow(0 0 5px rgba(107, 163, 240, 0.55));
  animation: mark-pop 420ms var(--ease);
}

@keyframes mark-pop {
  from {
    opacity: 0;
    transform: translateX(-3px) scale(0.7);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.code-line__num {
  text-align: right;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.code-line__text {
  min-width: 0;
  overflow: visible;
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

.tok.has-val {
  position: relative;
}

.tok__hint {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.12rem);
  transform: translateX(-50%);
  padding: 0.06rem 0.32rem;
  border-radius: 999px;
  background: rgba(8, 16, 28, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--stack);
  font-size: 0.62em;
  font-weight: 700;
  font-family: var(--font-code);
  line-height: 1.15;
  letter-spacing: 0.01em;
  white-space: nowrap;
  pointer-events: none;
  max-width: 6.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tok.has-val--ref .tok__hint {
  color: var(--heap);
}
</style>
