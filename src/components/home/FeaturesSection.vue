<script setup>
import SectionHead from '../ui/SectionHead.vue'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'
import VideoEmbed from '../ui/VideoEmbed.vue'
import { STAGE, site } from '../../config/site.js'

const features = [
  {
    icon: 'sword', title: 'Redesigned Starting Abilities',
    text: 'Every class starts with reworked abilities. Combat feels more interesting and more powerful from the very first levels — the early leveling experience has been significantly improved.'
  },
  {
    icon: 'bag', title: 'Improved Vendors & Items',
    text: 'Vendors were reworked to offer gear and items that are actually useful, making early progression more rewarding and cutting the hunt for irrelevant equipment.'
  },
  {
    icon: 'chest', title: 'Enhanced Early Drops',
    text: 'Loot tables in the starting zones were improved, giving you more chances to find useful equipment and items while you level.'
  },
  {
    icon: 'hammer', title: 'Redesigned Professions',
    text: 'Professions received new mechanics to stay relevant throughout your progression. Blacksmiths can now recycle armor pieces — see it in the video below.'
  },
  {
    icon: 'users', title: 'New Race & Class Combinations',
    text: 'Play combinations the original game never offered: Tauren Paladin, Troll Druid, Gnome Priest, Undead Paladin, Blood Elf Warrior, Human Hunter and Dwarf Shaman or Warlock — see it in the video below.'
  },
  {
    icon: 'hourglass', title: 'Original XP Progression',
    text: 'Experience rates keep the original pace and soul of Wrath leveling. This is not — and will not become — an instant-level or high-rate server.'
  },
  {
    icon: 'swords', title: 'Tested PvP & Dungeons',
    text: 'PvP and dungeons went through testing and tuning to deliver a stable experience that preserves the essence of the original content.'
  }
]
</script>

<template>
  <section id="features" class="section features" aria-labelledby="features-title">
    <div class="container">
      <SectionHead
        id="features-title"
        eyebrow="What makes us different"
        title="Built, Tested, Live."
        subtitle="These changes are already implemented on the realm — not promises."
      />
      <div class="grid grid--3">
        <article v-for="(f, i) in features" :key="f.title" v-reveal="(i % 3) * 80" class="feat panel panel--hover">
          <div class="feat__icon"><AppIcon :name="f.icon" :size="30" /></div>
          <StageBadge class="feat__badge" :value="STAGE.LIVE" label="Implemented" />
          <h3 class="feat__title">{{ f.title }}</h3>
          <p class="feat__text">{{ f.text }}</p>
        </article>
      </div>

      <div v-reveal class="showcase">
        <VideoEmbed v-bind="site.videos.blacksmithing" />
        <div class="showcase__copy">
          <p class="eyebrow">See it in game</p>
          <h3 class="title-lg gold-text">Blacksmiths Recycle Armor</h3>
          <p>
            Recorded on the ready-to-play 32-bit client: the new Blacksmithing mechanic that lets you recycle armor,
            plus a look at reworked items on one of the redesigned vendors.
          </p>
          <ul>
            <li><AppIcon name="hammer" :size="18" /> New armor recycling mechanic</li>
            <li><AppIcon name="bag" :size="18" /> Reworked vendor items</li>
            <li><AppIcon name="check" :size="18" /> Traditional 32-bit client — ready</li>
          </ul>
        </div>
      </div>

      <div v-reveal class="showcase">
        <VideoEmbed v-bind="site.videos.newClasses" />
        <div class="showcase__copy">
          <p class="eyebrow">See it in game</p>
          <h3 class="title-lg gold-text">New Classes for Each Race</h3>
          <p>
            Recorded on the ready-to-play 32-bit client: new race and class combinations, each with its starting
            gear and trainers.
          </p>
          <ul>
            <li><AppIcon name="users" :size="18" /> Tauren Paladin, Troll Druid and Gnome Priest</li>
            <li><AppIcon name="sword" :size="18" /> Full class abilities and attributes</li>
            <li><AppIcon name="check" :size="18" /> Traditional 32-bit client — ready</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features { background: radial-gradient(800px 400px at 50% 0%, rgba(42, 147, 224, .08), transparent 70%); }
.feat { display: grid; align-content: start; gap: 14px; padding-top: 30px; overflow: hidden; }
.feat__icon {
  position: relative; width: 64px; height: 64px; display: grid; place-items: center; color: var(--gold-200);
  background: radial-gradient(circle at 50% 35%, #1b3550, #070e16 75%);
  border: 1px solid var(--gold-500); border-radius: 10px;
  box-shadow: inset 0 0 0 3px #060b12, inset 0 0 0 4px rgba(233, 196, 106, .35), 0 0 24px -6px var(--ice-glow);
  transition: transform .4s var(--ease), color .3s;
}
.feat:hover .feat__icon { transform: rotate(-4deg) scale(1.06); color: var(--ice-100); }
.feat__badge { position: absolute; top: 22px; right: 22px; }
.feat__title { font-size: 1.22rem; margin: 6px 0 0; }
.feat__text { color: var(--text-300); margin: 0; font-size: .95rem; }
.showcase { display: grid; grid-template-columns: 1.35fr 1fr; gap: clamp(24px, 4vw, 48px); align-items: center; margin-top: clamp(48px, 7vw, 80px); }
.showcase__copy p:not(.eyebrow) { color: var(--text-300); }
.showcase__copy ul { list-style: none; padding: 0; margin: 18px 0 0; display: grid; gap: 10px; }
.showcase__copy li { display: flex; align-items: center; gap: 10px; color: var(--text-100); }
.showcase__copy li svg { color: var(--gold-300); }
@media (max-width: 900px) { .showcase { grid-template-columns: 1fr; } }
</style>
