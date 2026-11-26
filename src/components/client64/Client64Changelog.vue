<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { CLIENT64_CHANGELOG_DATE, CLIENT64_COMMITS } from '../../data/client64Commits.js'

const props = defineProps({
  isPt: { type: Boolean, default: true }
})

const expanded = ref(false)
const showAll = ref(false)
const filter = ref('all')
const query = ref('')

const counts = computed(() => {
  const acc = { all: CLIENT64_COMMITS.length, feat: 0, fix: 0, perf: 0 }
  for (const c of CLIENT64_COMMITS) {
    if (c.type === 'feat') acc.feat++
    else if (c.type === 'fix') acc.fix++
    else if (c.type === 'perf') acc.perf++
  }
  return acc
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return CLIENT64_COMMITS.filter((c) => {
    if (filter.value !== 'all' && c.type !== filter.value) return false
    if (q && !c.title.toLowerCase().includes(q) && !c.date.includes(q)) return false
    return true
  })
})

const visible = computed(() => {
  if (showAll.value || query.value.trim() !== '' || filter.value !== 'all') return filtered.value
  return filtered.value.slice(0, 15)
})

const formattedSnapshotDate = computed(() => {
  const [y, m, d] = CLIENT64_CHANGELOG_DATE.split('-')
  return props.isPt ? `${d}/${m}/${y}` : CLIENT64_CHANGELOG_DATE
})

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  return props.isPt ? `${d}/${m}/${y}` : iso
}
</script>

<template>
  <section id="client64-changelog" class="section clg" aria-labelledby="clg-title">
    <div class="container">
      <div class="clg__box panel">
        <div class="clg__top">
          <div class="clg__head">
            <p class="eyebrow">
              {{ isPt ? `Histórico de desenvolvimento · atualizado em ${formattedSnapshotDate}` : `Development log · snapshot ${formattedSnapshotDate}` }}
            </p>
            <h2 id="clg-title" class="title-lg frost-text">
              {{ isPt ? 'Tudo o que já foi feito no Cliente 64-bit' : 'Everything built so far on the 64-bit Client' }}
            </h2>
            <p class="clg__sub">
              {{ isPt
                ? `${counts.all} commits entregues até ${formattedSnapshotDate} (${counts.feat} features, ${counts.fix} correções e ${counts.perf} otimizações de performance).`
                : `${counts.all} commits delivered up to ${formattedSnapshotDate} (${counts.feat} features, ${counts.fix} fixes, and ${counts.perf} performance upgrades).` }}
            </p>
          </div>
          <button type="button" class="btn btn--frost clg__toggle" :aria-expanded="expanded" @click="expanded = !expanded">
            <AppIcon :name="expanded ? 'close' : 'layers'" :size="16" />
            {{ expanded
              ? (isPt ? 'Ocultar lista' : 'Hide list')
              : (isPt ? `Ver todas as ${counts.all} entregas` : `View all ${counts.all} updates`) }}
          </button>
        </div>

        <div v-if="expanded" class="clg__body">
          <div class="clg__controls">
            <div class="clg__tabs" role="tablist">
              <button type="button" class="tab" :class="{ 'is-on': filter === 'all' }" @click="filter = 'all'">
                {{ isPt ? 'Todos' : 'All' }} ({{ counts.all }})
              </button>
              <button type="button" class="tab" :class="{ 'is-on': filter === 'feat' }" @click="filter = 'feat'">
                Features ({{ counts.feat }})
              </button>
              <button type="button" class="tab" :class="{ 'is-on': filter === 'fix' }" @click="filter = 'fix'">
                Fixes ({{ counts.fix }})
              </button>
              <button type="button" class="tab" :class="{ 'is-on': filter === 'perf' }" @click="filter = 'perf'">
                Perf ({{ counts.perf }})
              </button>
            </div>
            <input
              v-model="query"
              type="search"
              class="input clg__search"
              :placeholder="isPt ? 'Filtrar por palavra-chave ou data…' : 'Filter by keyword or date…'"
              :aria-label="isPt ? 'Filtrar commits' : 'Filter commits'"
            />
          </div>

          <p v-if="!filtered.length" class="clg__empty">
            {{ isPt ? 'Nenhum commit encontrado para esse filtro.' : 'No commits match this filter.' }}
          </p>

          <ol v-else class="clg__list">
            <li v-for="c in visible" :key="c.hash" class="clg__item">
              <time class="clg__date" :datetime="c.date">{{ formatDate(c.date) }}</time>
              <span class="clg__tag" :class="`is-${c.type}`">{{ c.type }}</span>
              <span class="clg__title">{{ c.title }}</span>
            </li>
          </ol>

          <div v-if="filtered.length > 15 && query.trim() === '' && filter === 'all'" class="clg__more">
            <button type="button" class="btn btn--ghost" @click="showAll = !showAll">
              {{ showAll
                ? (isPt ? 'Mostrar apenas os 15 mais recentes' : 'Show only latest 15')
                : (isPt ? `Mostrar todos os ${filtered.length} commits` : `Show all ${filtered.length} commits`) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.clg { padding-top: 0; }
.clg__box { display: grid; gap: 20px; }
.clg__top { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
.clg__head { display: grid; gap: 6px; max-width: 720px; }
.clg__head h2 { margin: 0; }
.clg__sub { margin: 0; color: var(--text-300); font-size: .94rem; }
.clg__toggle { flex: none; }
.clg__body { display: grid; gap: 16px; border-top: 1px solid var(--line); padding-top: 18px; }
.clg__controls { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.clg__tabs { display: flex; flex-wrap: wrap; gap: 8px; }
.tab {
  padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line-strong);
  background: rgba(4, 10, 18, .7); color: var(--text-300); font-size: .8rem; font-weight: 600;
  cursor: pointer; transition: border-color .2s, color .2s, background .2s;
}
.tab:hover { color: var(--text-100); border-color: var(--ice-300); }
.tab.is-on { color: var(--ice-100); border-color: var(--ice-300); background: rgba(79, 179, 247, .14); }
.clg__search { max-width: 300px; height: 38px; padding: 0 12px; font-size: .86rem; }
.clg__list {
  list-style: none; margin: 0; padding: 0; display: grid; gap: 6px;
  max-height: 540px; overflow-y: auto; padding-right: 4px;
}
.clg__item {
  display: grid; grid-template-columns: 92px 54px minmax(0, 1fr); gap: 10px; align-items: baseline;
  padding: 9px 12px; border-radius: var(--radius-sm);
  background: rgba(3, 6, 10, .55); border: 1px solid rgba(127, 203, 255, .08);
  font-size: .86rem; line-height: 1.45;
}
.clg__date { font-family: ui-monospace, monospace; font-size: .78rem; color: var(--text-400); white-space: nowrap; }
.clg__tag {
  display: inline-block; text-align: center; padding: 2px 6px; border-radius: 4px;
  font: 700 .66rem/1.3 var(--font-body); letter-spacing: .08em; text-transform: uppercase;
  border: 1px solid var(--line-strong); color: var(--text-300);
}
.clg__tag.is-feat { color: var(--ice-100); border-color: rgba(79, 179, 247, .45); background: rgba(79, 179, 247, .12); }
.clg__tag.is-fix { color: var(--gold-100); border-color: rgba(233, 196, 106, .4); background: rgba(233, 196, 106, .1); }
.clg__tag.is-perf { color: var(--ok); border-color: rgba(95, 224, 160, .4); background: rgba(95, 224, 160, .1); }
.clg__title { color: var(--text-200); word-break: break-word; }
.clg__empty { margin: 8px 0; color: var(--text-400); text-align: center; }
.clg__more { display: flex; justify-content: center; }
@media (max-width: 640px) {
  .clg__item { grid-template-columns: 82px 48px minmax(0, 1fr); gap: 8px; padding: 8px 10px; font-size: .82rem; }
  .clg__search { max-width: 100%; width: 100%; }
}
</style>
