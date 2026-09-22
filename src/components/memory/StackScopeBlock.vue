<script setup lang="ts">
import type { StackSlot } from "../../types/memory";

export type ScopeBlock = {
  id: string;
  depth: number;
  label?: string;
  children: Array<StackSlot | ScopeBlock>;
};

defineProps<{
  block: ScopeBlock;
  focusId?: string;
  kindLabel: (slot: StackSlot) => string;
}>();

function isScopeBlock(node: StackSlot | ScopeBlock): node is ScopeBlock {
  return "children" in node;
}
</script>

<template>
  <div
    class="scope"
    :class="`scope--depth-${Math.min(block.depth, 3)}`"
    :style="{ '--scope-depth': block.depth }"
  >
    <div class="scope__header">
      <span class="scope__braces" aria-hidden="true">{</span>
      <span class="scope__label">{{ block.label ?? "bloc" }}</span>
      <span class="scope__braces" aria-hidden="true">}</span>
    </div>

    <div class="scope__body">
      <template v-for="child in block.children" :key="isScopeBlock(child) ? child.id : child.id">
        <StackScopeBlock
          v-if="isScopeBlock(child)"
          :block="child"
          :focus-id="focusId"
          :kind-label="kindLabel"
        />
        <div
          v-else
          class="slot"
          :class="{
            'slot--ref': child.kind === 'ref',
            'slot--value': child.kind === 'value',
            'is-focused': focusId === child.id,
          }"
          :data-slot-id="child.id"
        >
          <span class="slot__id">
            <span v-if="child.declaredType" class="slot__type">{{ child.declaredType }}</span>
            <span class="slot__name">{{ child.name }}</span>
          </span>
          <span class="slot__value">{{ child.value }}</span>
          <span class="slot__kind">{{ kindLabel(child) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scope {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-left: calc((var(--scope-depth, 1) - 1) * 0.35rem);
  padding: 0.4rem 0.45rem 0.45rem;
  border-radius: 8px;
  border: 1px dashed rgba(46, 196, 166, 0.55);
  background:
    linear-gradient(90deg, rgba(46, 196, 166, 0.14), transparent 12px),
    var(--scope-1);
  box-shadow: inset 3px 0 0 rgba(46, 196, 166, 0.55);
}

.scope--depth-2 {
  border-color: rgba(107, 163, 240, 0.5);
  background:
    linear-gradient(90deg, rgba(107, 163, 240, 0.14), transparent 12px),
    var(--scope-2);
  box-shadow: inset 3px 0 0 rgba(107, 163, 240, 0.55);

  .scope__label {
    color: var(--accent);
  }
}

.scope--depth-3 {
  border-color: rgba(240, 180, 107, 0.5);
  background:
    linear-gradient(90deg, rgba(240, 180, 107, 0.12), transparent 12px),
    var(--scope-3);
  box-shadow: inset 3px 0 0 rgba(240, 180, 107, 0.55);

  .scope__label {
    color: var(--gold);
  }
}

.scope__header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0 0.15rem;
}

.scope__label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stack);
}

.scope__braces {
  font-family: var(--font-code);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-dim);
  opacity: 0.85;
}

.scope__body {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.slot {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.6rem;
  border-radius: 5px;
  border: 1px solid rgba(46, 196, 166, 0.4);
  background: linear-gradient(
    180deg,
    rgba(46, 196, 166, 0.14),
    var(--well-strong)
  );
  box-shadow: inset 0 1px 0 rgba(180, 255, 230, 0.08);
  transition:
    border-color var(--duration) var(--ease),
    background var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease);

  &.is-focused {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow:
      inset 0 1px 0 rgba(180, 210, 255, 0.2),
      0 0 0 1px rgba(107, 163, 240, 0.25);
  }
}

.scope--depth-2 .slot {
  border-color: rgba(107, 163, 240, 0.4);
}

.scope--depth-3 .slot {
  border-color: rgba(240, 180, 107, 0.4);
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
