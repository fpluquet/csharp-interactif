<script setup lang="ts">
import { computed } from "vue";
import type { StackFrame as StackFrameType, StackSlot } from "../../types/memory";
import StackScopeBlock, { type ScopeBlock } from "./StackScopeBlock.vue";

const props = defineProps<{
  frame: StackFrameType;
  focusId?: string;
  isTop?: boolean;
}>();

const isStatic = computed(() => props.frame.method === "static");

function isScopeBlock(node: StackSlot | ScopeBlock): node is ScopeBlock {
  return "children" in node;
}

function slotDepth(slot: StackSlot): number {
  return slot.scopeDepth ?? 0;
}

/** Construit des blocs imbriqués selon scopeDepth (ordre de déclaration). */
function buildScopeTree(slots: StackSlot[]): ScopeBlock {
  const root: ScopeBlock = { id: "scope-root", depth: 0, children: [] };
  const stack: ScopeBlock[] = [root];

  for (const slot of slots) {
    const depth = slotDepth(slot);

    while (stack.length - 1 > depth) {
      stack.pop();
    }

    while (stack.length - 1 < depth) {
      const parent = stack[stack.length - 1];
      const nextDepth = stack.length;
      const block: ScopeBlock = {
        id: `scope-${slot.id}-d${nextDepth}`,
        depth: nextDepth,
        label: slot.scopeLabel,
        children: [],
      };
      parent.children.push(block);
      stack.push(block);
    }

    const current = stack[stack.length - 1];
    if (depth > 0 && !current.label && slot.scopeLabel) {
      current.label = slot.scopeLabel;
    }
    current.children.push(slot);
  }

  return root;
}

/** Inverse les enfants pour que la pile visuelle pousse vers le haut. */
function reverseBlock(block: ScopeBlock): ScopeBlock {
  return {
    ...block,
    children: [...block.children].reverse().map((child) =>
      isScopeBlock(child) ? reverseBlock(child) : child,
    ),
  };
}

const scopeTree = computed(() => reverseBlock(buildScopeTree(props.frame.slots)));

const hasNestedScopes = computed(() =>
  props.frame.slots.some((slot) => slotDepth(slot) > 0),
);

const flatSlots = computed(() =>
  hasNestedScopes.value
    ? []
    : [...props.frame.slots].reverse(),
);

function kindLabel(slot: StackSlot): string {
  if (isStatic.value) return "global";
  return slot.kind === "ref" ? "réf." : "valeur";
}
</script>

<template>
  <article
    class="stack-frame"
    :class="{
      'is-top': isTop && !isStatic,
      'is-focused': focusId === frame.id,
      'is-static': isStatic,
      'has-scopes': hasNestedScopes,
    }"
    :data-frame-id="frame.id"
  >
    <header class="stack-frame__head">
      <span class="stack-frame__method">
        {{ isStatic ? "static (global)" : `${frame.method}()` }}
      </span>
      <span v-if="isStatic" class="stack-frame__badge stack-frame__badge--static">persistante</span>
      <span v-else-if="isTop" class="stack-frame__badge">courante</span>
    </header>

    <div v-if="frame.slots.length" class="stack-frame__locals">
      <!-- Portées imbriquées : blocs { } sur la pile -->
      <div v-if="hasNestedScopes" class="stack-frame__scoped">
        <template
          v-for="node in scopeTree.children"
          :key="isScopeBlock(node) ? node.id : node.id"
        >
          <StackScopeBlock
            v-if="isScopeBlock(node)"
            :block="node"
            :focus-id="focusId"
            :kind-label="kindLabel"
          />
          <div
            v-else
            class="slot slot--outer"
            :class="{
              'slot--ref': node.kind === 'ref',
              'slot--value': node.kind === 'value',
              'is-focused': focusId === node.id,
            }"
            :data-slot-id="node.id"
          >
            <span class="slot__id">
              <span v-if="node.declaredType" class="slot__type">{{ node.declaredType }}</span>
              <span class="slot__name">{{ node.name }}</span>
            </span>
            <span class="slot__value">{{ node.value }}</span>
            <span class="slot__kind">{{ kindLabel(node) }}</span>
          </div>
        </template>
      </div>

      <!-- Pas de sous-portée : pile simple de variables -->
      <ul v-else class="stack-frame__slots">
        <li
          v-for="(slot, index) in flatSlots"
          :key="slot.id"
          class="slot"
          :class="{
            'slot--ref': slot.kind === 'ref',
            'slot--value': slot.kind === 'value',
            'is-focused': focusId === slot.id,
            'is-top-slot': index === 0,
            'is-base-slot': index === flatSlots.length - 1,
          }"
          :data-slot-id="slot.id"
        >
          <span class="slot__id">
            <span v-if="slot.declaredType" class="slot__type">{{ slot.declaredType }}</span>
            <span class="slot__name">{{ slot.name }}</span>
          </span>
          <span class="slot__value">{{ slot.value }}</span>
          <span class="slot__kind">{{ kindLabel(slot) }}</span>
        </li>
      </ul>
    </div>
    <p v-else class="stack-frame__empty">aucun local</p>
  </article>
</template>

<style scoped lang="scss">
.stack-frame {
  border: 1px solid var(--stack-border);
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(46, 196, 166, 0.12), rgba(46, 196, 166, 0.04));
  padding: 0.75rem 0.85rem;
  transition:
    box-shadow var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease);

  &.is-top {
    box-shadow: 0 0 0 1px rgba(46, 196, 166, 0.25), 0 10px 28px rgba(46, 196, 166, 0.12);
  }

  &.is-focused {
    border-color: var(--stack);
    transform: translateY(-2px);
  }

  &.is-static {
    border-color: rgba(107, 163, 240, 0.45);
    background: linear-gradient(180deg, rgba(107, 163, 240, 0.14), rgba(107, 163, 240, 0.04));

    .stack-frame__method {
      color: var(--accent);
    }
  }
}

.stack-frame__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
}

.stack-frame__method {
  font-family: var(--font-code);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--stack);
}

.stack-frame__badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stack);
  background: var(--stack-soft);
  border-radius: 999px;
  padding: 0.2rem 0.5rem;

  &--static {
    color: var(--accent);
    background: var(--accent-soft);
  }
}

.stack-frame__locals {
  display: flex;
  flex-direction: column;
  max-width: 19rem;
}

.stack-frame__scoped {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stack-frame__slots {
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.22));
}

.stack-frame__empty {
  font-size: 0.85rem;
  color: var(--text-dim);
  font-style: italic;
}

.slot {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.6rem;
  margin-top: -1px;
  border-radius: 0;
  border: 1px solid rgba(46, 196, 166, 0.4);
  background: linear-gradient(
    180deg,
    rgba(46, 196, 166, 0.14),
    rgba(7, 16, 28, 0.72)
  );
  box-shadow:
    inset 0 1px 0 rgba(180, 255, 230, 0.1),
    0 2px 0 rgba(6, 18, 16, 0.4);
  transition:
    border-color var(--duration) var(--ease),
    background var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease);

  &--outer {
    margin-top: 0;
    border-radius: 6px;
    box-shadow: inset 0 1px 0 rgba(180, 255, 230, 0.1);
  }

  &.is-top-slot {
    margin-top: 0;
    border-radius: 6px 6px 0 0;
    border-color: rgba(46, 196, 166, 0.55);
    background: linear-gradient(
      180deg,
      rgba(46, 196, 166, 0.24),
      rgba(10, 28, 24, 0.85)
    );
  }

  &.is-base-slot:not(.is-top-slot) {
    border-radius: 0 0 6px 6px;
  }

  &.is-base-slot.is-top-slot {
    border-radius: 6px;
  }

  &.is-focused {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow:
      inset 0 1px 0 rgba(180, 210, 255, 0.2),
      0 0 0 1px rgba(107, 163, 240, 0.25);
    z-index: 1;
    position: relative;
  }
}

.slot__id {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.slot__type {
  font-family: var(--font-code);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.02em;
}

.slot__name {
  font-family: var(--font-code);
  font-weight: 600;
  font-size: 0.9rem;
}

.slot__value {
  font-family: var(--font-code);
  font-size: 0.88rem;
  color: var(--text);
}

.slot--ref .slot__value {
  color: var(--heap);
}

.slot--value .slot__value {
  color: var(--stack);
}

.slot__kind {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-dim);
}
</style>
