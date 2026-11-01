<script setup>
/**
 * Lightweight YouTube embed: shows the thumbnail and only loads the player
 * (youtube-nocookie) after the visitor clicks — no YouTube scripts on page load.
 */
import { ref } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  caption: { type: String, default: '' }
})
const playing = ref(false)
const thumb = `https://i.ytimg.com/vi/${props.id}/maxresdefault.jpg`
const src = `https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0&modestbranding=1`
</script>

<template>
  <figure class="vid panel">
    <div class="vid__frame">
      <iframe
        v-if="playing" :src="src" :title="title" loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
      />
      <button v-else type="button" class="vid__poster" :aria-label="`Play video: ${title}`" @click="playing = true">
        <img :src="thumb" :alt="''" loading="lazy" decoding="async" width="1280" height="720" />
        <span class="vid__shade" />
        <span class="vid__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
        </span>
        <span class="vid__title">{{ title }}</span>
      </button>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.vid { margin: 0; padding: 10px; }
.vid__frame { position: relative; aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; background: #000; }
.vid__frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vid__poster { position: absolute; inset: 0; padding: 0; border: 0; cursor: pointer; background: #000; color: #fff; }
.vid__poster img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s var(--ease), filter .4s; filter: saturate(1.05) brightness(.85); }
.vid__shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(2, 5, 9, .1) 40%, rgba(2, 5, 9, .85)); }
.vid__play {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 76px; height: 76px; display: grid; place-items: center; border-radius: 50%; padding-left: 4px;
  color: #2a1a04; background: linear-gradient(180deg, var(--gold-100), var(--gold-400));
  box-shadow: 0 0 0 6px rgba(233, 196, 106, .18), 0 0 40px rgba(95, 190, 255, .45), 0 10px 30px rgba(0, 0, 0, .7);
  transition: transform .3s var(--ease), box-shadow .3s var(--ease);
}
.vid__title { position: absolute; left: 18px; right: 18px; bottom: 14px; text-align: left; font: 700 clamp(.85rem, 1.6vw, 1.05rem)/1.3 var(--font-display); letter-spacing: .04em; text-shadow: 0 2px 8px #000; }
.vid__poster:hover img { transform: scale(1.04); filter: saturate(1.15) brightness(.95); }
.vid__poster:hover .vid__play { transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 0 0 10px rgba(233, 196, 106, .22), 0 0 60px rgba(95, 190, 255, .6), 0 10px 30px rgba(0, 0, 0, .7); }
.vid__poster:focus-visible { outline: 2px solid var(--ice-300); outline-offset: -4px; }
.vid figcaption { font-size: .85rem; color: var(--text-300); padding: 12px 6px 4px; }
</style>
