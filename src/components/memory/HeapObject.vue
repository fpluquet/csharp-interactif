<script setup lang="ts">
import { computed } from "vue";
import type { HeapField, HeapObject as HeapObjectType } from "../../types/memory";

const props = defineProps<{
  object: HeapObjectType;
  focusId?: string;
  placeholder?: boolean;
}>();

type ArrayCell = { field: HeapField; indices: number[] };

type ArraySlice = {
  title: string;
  cols: number;
  cells: Array<ArrayCell | null>;
};

const INDEX_RE = /^\[(\d+(?:,\s*\d+)*)\]$/;

function parseIndex(label: string): number[] | null {
  const m = label.match(INDEX_RE);
  if (!m) return null;
  return m[1].split(",").map((n) => Number(n.trim()));
}

const arrayView = computed(() => {
  const fields = props.object.fields;
  if (!fields.length) return null;

  const parsed: ArrayCell[] = [];
  for (const field of fields) {
    const indices = parseIndex(field.label);
    if (!indices) return null;
    parsed.push({ field, indices });
  }

  const rank = parsed[0].indices.length;
  if (parsed.some((cell) => cell.indices.length !== rank)) return null;

  const dims = Array.from({ length: rank }, () => 0);
  for (const cell of parsed) {
    for (let i = 0; i < rank; i++) {
      dims[i] = Math.max(dims[i], cell.indices[i] + 1);
    }
  }

  const gridRank = Math.min(2, rank);
  const leadRank = rank - gridRank;
  const rows = gridRank === 2 ? dims[rank - 2] : 1;
  const cols = dims[rank - 1] ?? 1;

  const groups = new Map<string, ArrayCell[]>();
  for (const cell of parsed) {
    const key = cell.indices.slice(0, leadRank).join(",");
    const list = groups.get(key) ?? [];
    list.push(cell);
    groups.set(key, list);
  }

  const slices: ArraySlice[] = [];
  for (const [key, cells] of groups) {
    const grid: Array<ArrayCell | null> = Array.from({ length: rows * cols }, () => null);
    for (const cell of cells) {
      const tail = cell.indices.slice(leadRank);
      const pos = tail.length === 1 ? tail[0] : tail[0] * cols + tail[1];
      grid[pos] = cell;
    }

    let title = "";
    if (leadRank > 0) {
      const lead = key.split(",").map(Number);
      const dots = Array.from({ length: gridRank }, () => "·");
      title = `[${[...lead, ...dots].join(", ")}]`;
    }

    slices.push({ title, cols, cells: grid });
  }

  return { slices };
});
</script>

<template>
  <article
    class="heap-object"
    :class="{
      'is-focused': focusId === object.id,
      'is-orphan': object.orphan,
      'is-array': !!arrayView,
    }"
    :data-object-id="placeholder ? undefined : object.id"
  >
    <header class="heap-object__head">
      <span class="heap-object__type">{{ object.typeLabel }}</span>
      <span v-if="object.orphan" class="heap-object__badge">orphelin</span>
      <span class="heap-object__id">{{ object.address }}</span>
    </header>

    <div v-if="arrayView" class="array-view">
      <div
        v-for="(slice, si) in arrayView.slices"
        :key="si"
        class="array-slice"
      >
        <p v-if="slice.title" class="array-slice__title">{{ slice.title }}</p>
        <div
          class="array-grid"
          :style="{ gridTemplateColumns: `repeat(${slice.cols}, minmax(2.7rem, auto))` }"
        >
          <div
            v-for="(cell, ci) in slice.cells"
            :key="ci"
            class="array-cell"
            :class="{
              'is-empty': !cell,
              'field--ref': cell?.field.kind === 'ref',
              'is-focused': !!cell && focusId === cell.field.id,
            }"
            :data-field-id="placeholder ? undefined : cell?.field.id"
          >
            <template v-if="cell">
              <span class="array-cell__idx">{{ cell.field.label }}</span>
              <span class="array-cell__val">{{ cell.field.value }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <ul v-else class="heap-object__fields">
      <li
        v-for="(field, i) in object.fields"
        :key="field.id ?? i"
        class="field"
        :class="{ 'field--ref': field.kind === 'ref', 'is-focused': focusId === field.id }"
        :data-field-id="placeholder ? undefined : field.id"
      >
        <span class="field__label">{{ field.label }}</span>
        <span class="field__value">{{ field.value }}</span>
      </li>
    </ul>
  </article>
</template>

<style scoped lang="scss">
.heap-object {
  border: 1px solid var(--heap-border);
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(240, 160, 90, 0.14), rgba(240, 160, 90, 0.04));
  padding: 0.75rem 0.85rem;
  min-width: 9.5rem;
  flex-shrink: 0;
  transition:
    box-shadow var(--duration) var(--ease),
    border-color var(--duration) var(--ease),
    transform var(--duration) var(--ease),
    opacity var(--duration) var(--ease);

  &.is-array {
    min-width: 11rem;
  }

  &.is-focused {
    border-color: var(--heap);
    box-shadow: 0 0 0 1px rgba(240, 160, 90, 0.35), 0 12px 30px rgba(240, 160, 90, 0.15);
    transform: translateY(-2px);
  }

  &.is-orphan {
    opacity: 0.72;
    border-style: dashed;
    border-color: rgba(240, 113, 120, 0.55);
    background: linear-gradient(180deg, rgba(240, 113, 120, 0.12), rgba(240, 160, 90, 0.04));
  }
}

.heap-object__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
  flex-wrap: wrap;
}

.heap-object__type {
  font-family: var(--font-code);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--heap);
}

.heap-object__badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--danger);
  background: rgba(240, 113, 120, 0.16);
  border-radius: 999px;
  padding: 0.15rem 0.45rem;
}

.heap-object__id {
  font-family: var(--font-code);
  font-size: 0.72rem;
  color: var(--text-dim);
  margin-left: auto;
}

.heap-object__fields {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.35rem 0.5rem;
  border-radius: var(--radius-sm);
  background: rgba(7, 16, 28, 0.42);
  font-family: var(--font-code);
  font-size: 0.85rem;

  &.is-focused {
    box-shadow: 0 0 0 1px rgba(240, 160, 90, 0.55);
    background: rgba(240, 160, 90, 0.18);
  }
}

.field__label {
  color: var(--text-muted);
}

.field__value {
  color: var(--text);
  font-weight: 600;
}

.field--ref .field__value,
.field--ref .array-cell__val {
  color: var(--heap);
}

.array-view {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 0.85rem;
  align-items: flex-start;
}

.array-slice__title {
  margin: 0 0 0.35rem;
  font-family: var(--font-code);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-muted);
}

.array-grid {
  display: grid;
  gap: 0.28rem;
}

.array-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.08rem;
  min-height: 2.55rem;
  padding: 0.28rem 0.35rem;
  border-radius: var(--radius-sm);
  background: rgba(7, 16, 28, 0.42);
  font-family: var(--font-code);

  &.is-empty {
    min-height: 2.55rem;
    background: rgba(7, 16, 28, 0.18);
    border: 1px dashed rgba(240, 160, 90, 0.22);
  }

  &.is-focused {
    box-shadow: 0 0 0 1px rgba(240, 160, 90, 0.55);
    background: rgba(240, 160, 90, 0.18);
  }
}

.array-cell__idx {
  font-size: 0.62rem;
  color: var(--text-dim);
  line-height: 1.1;
}

.array-cell__val {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.15;
}
</style>
