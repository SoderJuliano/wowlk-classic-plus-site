/**
 * Static snapshot of all features and fixes made on the native 64-bit client
 * up to 2026-11-28 (generated from soder-nextgen git history).
 */
export const CLIENT64_CHANGELOG_DATE = "2026-11-28"

export const CLIENT64_COMMITS = [
  {
    "date": "2026-11-28",
    "hash": "7e4c4c4a",
    "type": "perf",
    "title": "perf(shadows): far cascade redrawn ~3% of frames instead of ~85% - hold the shadow sun and the far centre"
  },
  {
    "date": "2026-11-28",
    "hash": "75cb9ed9",
    "type": "perf",
    "title": "perf(spawn): one async upload batch per creature spawn, and keep its pre-decoded art for the NPC overrides"
  },
  {
    "date": "2026-11-28",
    "hash": "b165f20b",
    "type": "perf",
    "title": "perf(spawn): hand the parsed creature model to the renderer instead of deep-copying it"
  },
  {
    "date": "2026-11-28",
    "hash": "57969e53",
    "type": "other",
    "title": "diag: SODER_NEXTGEN_SLOW_STAGE_MS - name update/render stages slower than N ms (default 50)"
  },
  {
    "date": "2026-11-28",
    "hash": "7ad85762",
    "type": "perf",
    "title": "perf(hair): reuse a model's hair data across NPC displays - no 110 ms hitch per new NPC"
  },
  {
    "date": "2026-11-28",
    "hash": "3478419c",
    "type": "fix",
    "title": "fix(fx): ground (Base) kits stand upright under the unit, turned only by its facing"
  },
  {
    "date": "2026-11-28",
    "hash": "5086d375",
    "type": "fix",
    "title": "fix(nameplates): no health bar over critters, selected or not"
  },
  {
    "date": "2026-11-28",
    "hash": "7ba5da97",
    "type": "fix",
    "title": "fix(fx): lamps and lanterns keep their authored light - no flame floors"
  },
  {
    "date": "2026-11-28",
    "hash": "4f78c2e0",
    "type": "fix",
    "title": "fix(fx): chimney/forge smoke is the model's own, not invented white puffs and sparks"
  },
  {
    "date": "2026-11-28",
    "hash": "099b948a",
    "type": "feat",
    "title": "feat(fx): retail spiked ring for Battle Shout / Commanding Shout; SODER_NEXTGEN_TEST_EFFECT"
  },
  {
    "date": "2026-11-28",
    "hash": "69ab3f3e",
    "type": "fix",
    "title": "fix(portrait): frame every player portrait with the model's own portrait camera"
  },
  {
    "date": "2026-11-28",
    "hash": "40e06945",
    "type": "feat",
    "title": "feat(fx): M2 model particles - emitters that throw copies of a model"
  },
  {
    "date": "2026-11-28",
    "hash": "e831140f",
    "type": "fix",
    "title": "fix(nameplates): no health bar over a selected friendly NPC; far names never over nearer units"
  },
  {
    "date": "2026-11-28",
    "hash": "eb8965cf",
    "type": "fix",
    "title": "fix(cursor): loot bag over lootable corpses, skinning knife over skinnable ones"
  },
  {
    "date": "2026-11-28",
    "hash": "35095d0b",
    "type": "perf",
    "title": "perf(render): cut the per-pixel light loop, frustum-cull actor animation and cache the far shadow cascade"
  },
  {
    "date": "2026-11-27",
    "hash": "02ab107d",
    "type": "fix",
    "title": "fix(windows): fix MSYS2 UCRT64 MinGW build (NvCloth, FSR2 wcscpy_s, aligned_alloc, near macro, cstring)"
  },
  {
    "date": "2026-11-27",
    "hash": "de36e5f2",
    "type": "fix",
    "title": "fix(vkbasalt): use VK_ADD_IMPLICIT_LAYER_PATH + XDG_DATA_DIRS and relative library_path so bundled ReShade loads on any PC"
  },
  {
    "date": "2026-11-27",
    "hash": "7a547c57",
    "type": "fix",
    "title": "fix(equipment,assets): render local player and preview shoulders, cloak RightModelTexture, and BLP basename fallback"
  },
  {
    "date": "2026-11-27",
    "hash": "9c5e04f3",
    "type": "fix",
    "title": "fix(camera,vkbasalt): fix third-person camera collision/teleports/mount zoom and vkBasalt path rewrite loop"
  },
  {
    "date": "2026-11-27",
    "hash": "97561fcd",
    "type": "perf",
    "title": "perf(hair): LOD de 15 jardas + solver Enhanced reduzido (P0-1/P0-2)"
  },
  {
    "date": "2026-11-27",
    "hash": "bc598658",
    "type": "feat",
    "title": "feat(graphics): portable vkBasalt layer and ReShade shaders with dynamic runtime path and F11 toggle"
  },
  {
    "date": "2026-11-27",
    "hash": "5de1ff09",
    "type": "fix",
    "title": "fix(auth): Windows HTTPS trusts the system root certificates; gate test links SDL"
  },
  {
    "date": "2026-11-27",
    "hash": "158c2230",
    "type": "fix",
    "title": "fix(auth): launcher gate message opens in front on KDE Wayland"
  },
  {
    "date": "2026-11-27",
    "hash": "f2776364",
    "type": "fix",
    "title": "fix(camera): prevent Dwarf/Gnome camera near plane from clipping under terrain, raised snow banks, or walls"
  },
  {
    "date": "2026-11-27",
    "hash": "7e559eea",
    "type": "fix",
    "title": "fix(rendering): eliminate road-edge pits, blocky sand rim saturation, and Y-up floating snow weather"
  },
  {
    "date": "2026-11-27",
    "hash": "5702d3a0",
    "type": "feat",
    "title": "feat(auth): launcher-only start for the beta build (signed handshake + heartbeat)"
  },
  {
    "date": "2026-11-27",
    "hash": "e07113c0",
    "type": "feat",
    "title": "feat(rendering): half-above fluffy snow blanket, smooth road/slope taper, and height/weight-scaled Gnome sink"
  },
  {
    "date": "2026-11-27",
    "hash": "4397e874",
    "type": "fix",
    "title": "fix(rendering): fix sand/snow motion warping, seams, foot bone grounding, road decals, and RDR2 knee-deep snow"
  },
  {
    "date": "2026-11-27",
    "hash": "ec3a6259",
    "type": "feat",
    "title": "feat(rendering): true next-gen sand/snow GPU deformation, PBR terrain, particles, and near CSM shadows"
  },
  {
    "date": "2026-11-26",
    "hash": "13bec8cc",
    "type": "feat",
    "title": "feat(rendering): footprints use the texture colour so relief prints can lighten the ground"
  },
  {
    "date": "2026-11-25",
    "hash": "7094543c",
    "type": "feat",
    "title": "feat(vfx,spells): align ground M2 spell visuals to terrain normal via globalFlags tilt bits (0x01/0x02)"
  },
  {
    "date": "2026-11-24",
    "hash": "b6135f4c",
    "type": "feat",
    "title": "feat(vfx,spells): add 64-bit Frost Blades (93030) vapor swords, idle orbital swap, and SpellVisualKit impact"
  },
  {
    "date": "2026-11-24",
    "hash": "b5d722c7",
    "type": "fix",
    "title": "fix(ui): add dedicated ChatFrame1 drag-to-move handle and enforce readable minimum resize bounds"
  },
  {
    "date": "2026-11-24",
    "hash": "8eb6218e",
    "type": "fix",
    "title": "fix(spells): support DK Rune Strike CasterAuraSpell (56817) proc, auto-attack engagement, and off-GCD next-swing queueing"
  },
  {
    "date": "2026-11-24",
    "hash": "91f558af",
    "type": "fix",
    "title": "fix(combatlog,ui): populate ChatFrame2 Blizzard_CombatLog with WoW 3.3.5a flags/history and hide stale floating DPS box"
  },
  {
    "date": "2026-11-24",
    "hash": "74da7393",
    "type": "fix",
    "title": "fix(ui): target units reliably on nameplate click and show sword hover cursor on enemy nameplates and PvP players"
  },
  {
    "date": "2026-11-23",
    "hash": "96ba354e",
    "type": "fix",
    "title": "fix(ui): render retail-style floating XP gain ('EXP: <N>') in large magenta FRIZQT above the player"
  },
  {
    "date": "2026-11-23",
    "hash": "3ea99d59",
    "type": "fix",
    "title": "fix(hair): include occipital/nape skin in cranium anchoring so mohawk hair bases stay pinned while crest tips curve"
  },
  {
    "date": "2026-11-23",
    "hash": "d3a0d252",
    "type": "fix",
    "title": "fix(vfx): feather non-wrapping and dual-texture spell card borders to remove rectangular ground smoke blocks"
  },
  {
    "date": "2026-11-23",
    "hash": "46c39d58",
    "type": "fix",
    "title": "fix(ui): anchor overhead nameplate bar and name strictly above unit heads at all distances"
  },
  {
    "date": "2026-11-23",
    "hash": "8da71e94",
    "type": "fix",
    "title": "fix(vfx,movement): render SpellChainEffects.dbc beams (Death Grip, Chain Lightning, channels) and evaluate parabolic MonsterMove splines"
  },
  {
    "date": "2026-11-23",
    "hash": "9be8a041",
    "type": "fix",
    "title": "fix(vfx): enable M2 dual-texture spell masks, cylindrical Z-billboards and 3D Icy Touch snow volume"
  },
  {
    "date": "2026-11-23",
    "hash": "3537c9b5",
    "type": "fix",
    "title": "fix(addons): suppress InCombatLockdown during UI load/reload bootstrap so DragonUI bars build cleanly when spawning in combat"
  },
  {
    "date": "2026-11-23",
    "hash": "6a27e73d",
    "type": "fix",
    "title": "fix(cloak): add extra 2cm clearance on Draenei tail first dorsal scale segment"
  },
  {
    "date": "2026-11-23",
    "hash": "9eaac5d0",
    "type": "fix",
    "title": "fix(combat): automatically draw sheathed weapons on UNIT_FLAG_IN_COMBAT engage"
  },
  {
    "date": "2026-11-23",
    "hash": "88c372ab",
    "type": "fix",
    "title": "fix(cloak): fit Draenei tail capsules to dorsal scale silhouette so scales never poke through the cloak"
  },
  {
    "date": "2026-11-23",
    "hash": "cd117a76",
    "type": "fix",
    "title": "fix(adt): use MCNK.sizeAlpha - 8 for MCAL payload and guard decodeLayerAlpha bounds"
  },
  {
    "date": "2026-11-23",
    "hash": "85f08809",
    "type": "fix",
    "title": "fix(cloak): keep Draenei braided ponytail and hair crest on top of the cloak instead of inside it"
  },
  {
    "date": "2026-11-23",
    "hash": "11255ed9",
    "type": "fix",
    "title": "fix(preview): preserve headroom above tall races on glue character-select scenes"
  },
  {
    "date": "2026-11-23",
    "hash": "5bf23e62",
    "type": "fix",
    "title": "fix(hair,cloak): scope hair accessory mask to Blood Elf Female and keep Draenei cloak clear of ponytail, tail and back weapons"
  },
  {
    "date": "2026-11-23",
    "hash": "08808d20",
    "type": "fix",
    "title": "fix(camera): exit first-person immediately on the first scroll-out notch"
  },
  {
    "date": "2026-11-23",
    "hash": "1d7d22c0",
    "type": "fix",
    "title": "fix(living-hair): detect color-invariant hair accessories (tiaras/headbands/clasps), exclude them from strands/deform and render crisp solid mesh"
  },
  {
    "date": "2026-11-23",
    "hash": "590fbf33",
    "type": "fix",
    "title": "fix(terrain): stitch and feather discontinuous ADT chunk alpha boundaries and parse exact MCAL subchunk size"
  },
  {
    "date": "2026-11-22",
    "hash": "0f0a41d9",
    "type": "fix",
    "title": "fix(shaman,spells): allow Wind Path pass-through, kneel precast StartAnimID and local-player server charge spline dash"
  },
  {
    "date": "2026-11-22",
    "hash": "79c5bd32",
    "type": "fix",
    "title": "fix(inspect,equipment): parse full WotLK BuildEnchantmentsInfoData fields, prevent naked players and refresh inspect weapon icons"
  },
  {
    "date": "2026-11-22",
    "hash": "64afd664",
    "type": "fix",
    "title": "fix(spells,rendering): cast Arcane Cataclysm (70009) from aimed staff/wand tip with melee bare-hand fallback"
  },
  {
    "date": "2026-11-22",
    "hash": "aac3f5c1",
    "type": "fix",
    "title": "fix(shaders,rendering): eliminate distant banner light/shadow flicker on M2 and WMO cloth"
  },
  {
    "date": "2026-11-22",
    "hash": "426b68b8",
    "type": "fix",
    "title": "fix(camera): prevent camera clipping into character body and through walls/corners"
  },
  {
    "date": "2026-11-22",
    "hash": "7d4a67e7",
    "type": "fix",
    "title": "fix(rendering): sheath weapons 1:1 with WoW 3.3.5a M2 attachment bones (staves, 2H, 1H, shields)"
  },
  {
    "date": "2026-11-22",
    "hash": "d8152cde",
    "type": "fix",
    "title": "fix(ui): add Numeric/Percentage/Both health text display option defaulting to Numeric"
  },
  {
    "date": "2026-11-22",
    "hash": "e32c15dd",
    "type": "fix",
    "title": "fix(ui): match WoW 3.3.5a NPC and Auction House hover cursors 1:1"
  },
  {
    "date": "2026-11-22",
    "hash": "407c022f",
    "type": "fix",
    "title": "fix(addons,ui): implement Slider GetThumbTexture/SetThumbTexture region, non-recursive HookScript, button font getters and EditBox blink speed for DragonUI_Options"
  },
  {
    "date": "2026-11-22",
    "hash": "b4cb510a",
    "type": "fix",
    "title": "fix(inventory,ui): display Soulbound state on bound items and confirm BoE drag-equip"
  },
  {
    "date": "2026-11-22",
    "hash": "9ec604ee",
    "type": "fix",
    "title": "fix(bg,render): preserve ghost flag on repop HP=1, robust spirit healer queueing & non-blocking background acquire"
  },
  {
    "date": "2026-11-22",
    "hash": "823cf77c",
    "type": "fix",
    "title": "fix(combat): block Charge/auto-attack on allies, cancel auto-attack on mount/target clear and suppress stale out-of-range speech"
  },
  {
    "date": "2026-11-22",
    "hash": "29949c86",
    "type": "fix",
    "title": "fix(ui): wire side/extra action bar toggles (SHOW_MULTI_ACTIONBAR_1..4, SetActionBarToggles & DragonUI sync)"
  },
  {
    "date": "2026-11-21",
    "hash": "794ce9e1",
    "type": "fix",
    "title": "fix(rendering,spells): real waist/glute cloak colliders for idle/jump and guaranteed stun head swirl"
  },
  {
    "date": "2026-11-21",
    "hash": "05dce28a",
    "type": "fix",
    "title": "fix(rendering): beard root lock, mount cast T-pose & turn anim, cloak mount/shield/2H immersion and saddle height"
  },
  {
    "date": "2026-11-21",
    "hash": "26b8d5ea",
    "type": "fix",
    "title": "fix(client): fix max camera distance, GM chat commands, shaman totem bar, ESC/click target clear, CharSections face flags, and clone static hair"
  },
  {
    "date": "2026-11-20",
    "hash": "4cf365bd",
    "type": "feat",
    "title": "feat(hair,combat): commit pending hair physics/shader updates and combat finalize spell fix"
  },
  {
    "date": "2026-11-19",
    "hash": "bd3099d0",
    "type": "fix",
    "title": "fix(physics): restore 0252fd92 base with vertical Z damping only to stop idle breathing bounce"
  },
  {
    "date": "2026-11-19",
    "hash": "95bf9bdb",
    "type": "fix",
    "title": "fix(physics): replace noisy per-vert Verlet with slow critically-damped metal pendulum (zero idle buzz, 1-2s return)"
  },
  {
    "date": "2026-11-19",
    "hash": "b1184963",
    "type": "fix",
    "title": "fix(physics): inextensible mail links, zero idle Z bounce, angular turn drag + study doc"
  },
  {
    "date": "2026-11-19",
    "hash": "0252fd92",
    "type": "fix",
    "title": "fix(physics): restore real pendulum swing on Chainmail without rigid rest glue"
  },
  {
    "date": "2026-11-19",
    "hash": "34f2ae9f",
    "type": "feat",
    "title": "feat(physics): separate heavy Chainmail pendulum profile from light Cloth and anchor shoulder colliders to upper spine"
  },
  {
    "date": "2026-11-19",
    "hash": "2df9f538",
    "type": "fix",
    "title": "fix(rendering): sample only base skin submeshId 0 for fitted coif skull/colliders"
  },
  {
    "date": "2026-11-19",
    "hash": "8a5884b5",
    "type": "feat",
    "title": "feat(rendering): skull-fitted PBD chainmail coif cloth mesh & colliders"
  },
  {
    "date": "2026-11-19",
    "hash": "56186d02",
    "type": "feat",
    "title": "feat(helm): preview attachment, snug HD undead fit, and chainmail coif pendulum physics"
  },
  {
    "date": "2026-11-19",
    "hash": "77b617e0",
    "type": "fix",
    "title": "fix(helm): only hide group 1 geosets when facial1 mask hides them"
  },
  {
    "date": "2026-11-19",
    "hash": "67404dbd",
    "type": "fix",
    "title": "fix(helm): open Helm_Mail_A_02 coif fit cleanly on HD ScourgeMale face"
  },
  {
    "date": "2026-11-19",
    "hash": "b3c888bd",
    "type": "fix",
    "title": "fix(world,helm): release entry guard inside underground WMOs and fit ScM coif on HD Scourge"
  },
  {
    "date": "2026-11-19",
    "hash": "9f3227a9",
    "type": "fix",
    "title": "fix(glue): anchor 16:9 UI, disable camera sway/sky fog, and clamp pet floor"
  },
  {
    "date": "2026-11-19",
    "hash": "6145dda8",
    "type": "fix",
    "title": "fix(glue): corrigir alpha opaco, emissive de cenas, escala bone att0, FOV Hor+ e layout 1:1 da selecao/criacao"
  },
  {
    "date": "2026-11-19",
    "hash": "e6a2da96",
    "type": "feat",
    "title": "feat(glue): enquadramento 1:1, fundos UI_Gnome/UI_Troll e resolucao nativa na selecao e criacao de personagem"
  },
  {
    "date": "2026-11-18",
    "hash": "4e5d5db2",
    "type": "fix",
    "title": "fix(gameplay): shadow clones visibility/anim/smoke, grounding inside WMOs, mimicry UI and beard physics"
  },
  {
    "date": "2026-11-18",
    "hash": "99f78189",
    "type": "fix",
    "title": "fix(lua): UnitBuff/UnitDebuff accept an aura name, as 3.3.5 does"
  },
  {
    "date": "2026-11-18",
    "hash": "458ef6d9",
    "type": "fix",
    "title": "fix(fx): particle twinkle - HD spell effects were drawn 12-30x too small, practically invisible"
  },
  {
    "date": "2026-11-18",
    "hash": "53b67a32",
    "type": "feat",
    "title": "diag(fx): SODER_FX_LOG=1 logs every spell effect model spawned and its particle emitters"
  },
  {
    "date": "2026-11-18",
    "hash": "72785580",
    "type": "fix",
    "title": "fix(fx): Moonfire, Starfire and Faerie Fire are not drawn as fire volumes"
  },
  {
    "date": "2026-11-18",
    "hash": "8a3427d0",
    "type": "fix",
    "title": "fix(ui): weapons in the dressing room and inspect model found by type, not list position"
  },
  {
    "date": "2026-11-18",
    "hash": "eb3aa079",
    "type": "fix",
    "title": "fix(ui): selection circle sized by the unit's own radius, as Wow.exe does"
  },
  {
    "date": "2026-11-17",
    "hash": "3aef0b57",
    "type": "feat",
    "title": "diag(hair): SODER_HAIR_SHELLS=1 logs each separate piece of a hairstyle"
  },
  {
    "date": "2026-11-17",
    "hash": "6db0ddcc",
    "type": "fix",
    "title": "fix(ui): distant nameplates no longer drawn across the player's own body"
  },
  {
    "date": "2026-11-17",
    "hash": "b96369b6",
    "type": "fix",
    "title": "fix(camera): the camera stops at rocks, walls, fences and tree trunks too, not only buildings"
  },
  {
    "date": "2026-11-17",
    "hash": "5a9fb30f",
    "type": "fix",
    "title": "fix(ui): no reputation bar unless a faction is watched; option to hide the experience bar"
  },
  {
    "date": "2026-11-17",
    "hash": "f101652a",
    "type": "other",
    "title": "docs: nameplate revision of 17/11 (night)"
  },
  {
    "date": "2026-11-17",
    "hash": "d2161046",
    "type": "fix",
    "title": "fix(ui): nameplates styled after Juliano's references; loss-of-control alert without a known duration; BG resurrection diagnosis"
  },
  {
    "date": "2026-11-17",
    "hash": "938b6661",
    "type": "feat",
    "title": "feat(ui): loss-of-control alert on screen, thicker nameplates with debuff icons on top"
  },
  {
    "date": "2026-11-17",
    "hash": "da9fc7d6",
    "type": "fix",
    "title": "fix(ui): dragging the chat window no longer squeezes it smaller"
  },
  {
    "date": "2026-11-17",
    "hash": "8ea1318b",
    "type": "fix",
    "title": "fix(ui): dressing room Reset works and a tried-on weapon can be swapped for another"
  },
  {
    "date": "2026-11-17",
    "hash": "6340860a",
    "type": "fix",
    "title": "fix(anim): cubs and small creatures step faster instead of sliding with the adult's stride"
  },
  {
    "date": "2026-11-17",
    "hash": "c450c969",
    "type": "fix",
    "title": "fix(anim): no weapon \"put away\" animation on every stop or landing in combat"
  },
  {
    "date": "2026-11-17",
    "hash": "ab6591e0",
    "type": "other",
    "title": "docs(hair): state on 17/11 - validated elf free strands, draenei ponytail, sword over hair; lessons and what is next"
  },
  {
    "date": "2026-11-17",
    "hash": "1f80817e",
    "type": "fix",
    "title": "fix(hair): a sword sheathed on the back is worn over the hair, not lifting it"
  },
  {
    "date": "2026-11-17",
    "hash": "910eeb12",
    "type": "fix",
    "title": "fix(hair): elf hair firm near the root, loose at the tip - no raised arch at the nape after a run"
  },
  {
    "date": "2026-11-17",
    "hash": "eb6e5bc1",
    "type": "fix",
    "title": "fix(hair): draenei ponytail pendulum actually runs; cloak follows the swung ponytail; elf back hair swings back, not into a bush"
  },
  {
    "date": "2026-11-17",
    "hash": "58bbd07c",
    "type": "feat",
    "title": "feat(hair): draenei ponytail swings from the nape with a slight lag; elf back hair moves from the back of the head"
  },
  {
    "date": "2026-11-17",
    "hash": "678fd432",
    "type": "fix",
    "title": "fix(hair): elf hair slow and overdamped, side locks held; draenei hair tail as modelled, cloak collider from its mesh"
  },
  {
    "date": "2026-11-17",
    "hash": "d584fca0",
    "type": "fix",
    "title": "fix(hair): elf front locks stay in front; draenei back to its mesh with a heavy rigid tail the cloak arches around"
  },
  {
    "date": "2026-11-17",
    "hash": "736672f0",
    "type": "feat",
    "title": "feat(hair): elf hair with air resistance, whole locks swinging, natural waves and staggered tips"
  },
  {
    "date": "2026-11-17",
    "hash": "da5d76a3",
    "type": "fix",
    "title": "fix(hair): every elf strand grows from the scalp - no root bands across the back, no loose flapping block"
  },
  {
    "date": "2026-11-17",
    "hash": "05d95633",
    "type": "feat",
    "title": "feat(hair): elf hair loose and heavy below the ears, scalp under the strands, no face paint"
  },
  {
    "date": "2026-11-17",
    "hash": "e1f43582",
    "type": "fix",
    "title": "fix(hair): elf hair combed and held to the ears, swings below; no ghost strands on humans"
  },
  {
    "date": "2026-11-17",
    "hash": "ac4e45a8",
    "type": "fix",
    "title": "fix(hair): strands were never on screen - negative projection scale and MSAA rounding"
  },
  {
    "date": "2026-11-17",
    "hash": "55f87e3d",
    "type": "fix",
    "title": "fix(hair): elf long hair strands run the whole lock (were 15 cm stubs: bald head)"
  },
  {
    "date": "2026-11-16",
    "hash": "08da749a",
    "type": "fix",
    "title": "fix(hair): elf/draenei long hair strands walk the card's painted lock in UV space (3D tracing stopped at the first fold, leaving only scalp stubs)"
  },
  {
    "date": "2026-11-16",
    "hash": "94be8680",
    "type": "fix",
    "title": "fix(hair): elf/draenei free strands drawn as thick solid locks (were sub-pixel: bald head); SODER_HAIR_FREE_DEBUG paints them magenta"
  },
  {
    "date": "2026-11-16",
    "hash": "dc9fa133",
    "type": "feat",
    "title": "feat(hair): elf and draenei long hair is drawn as free strands, not cards"
  },
  {
    "date": "2026-11-16",
    "hash": "5c0c8171",
    "type": "fix",
    "title": "fix(hair): elf/draenei/troll locks no longer lift like a flag; strands drape over back-sheathed weapons"
  },
  {
    "date": "2026-11-16",
    "hash": "15411218",
    "type": "feat",
    "title": "feat(hair): every strand simulated on the GPU - hair opens into strands when moving"
  },
  {
    "date": "2026-11-16",
    "hash": "ceaf5fdf",
    "type": "fix",
    "title": "fix(hair): artist-boned hairstyles (troll braids, elf locks, draenei tails) are simulated on their bones"
  },
  {
    "date": "2026-11-16",
    "hash": "2744f18a",
    "type": "feat",
    "title": "feat(hair): livelier Enhanced physics and one more bend per segment"
  },
  {
    "date": "2026-11-16",
    "hash": "11685fbc",
    "type": "feat",
    "title": "feat(hair): hair lifts when falling from a jump and settles on landing"
  },
  {
    "date": "2026-11-16",
    "hash": "9d2ad18a",
    "type": "fix",
    "title": "fix(character): plain legs (1301) shade like the torso - no light/dark line at the waist"
  },
  {
    "date": "2026-11-16",
    "hash": "5825e45b",
    "type": "fix",
    "title": "fix(rendering): camera-relative characters and hair, local-origin hair simulation - no more trembling"
  },
  {
    "date": "2026-11-16",
    "hash": "4eb49c0d",
    "type": "feat",
    "title": "feat(physics): extra character physics - gentle breast motion on female characters, with a toggle"
  },
  {
    "date": "2026-11-16",
    "hash": "b06018ad",
    "type": "fix",
    "title": "fix(hair): smooth contact with back, weapons and cape instead of hard pushes - no more tip tremble"
  },
  {
    "date": "2026-11-16",
    "hash": "8f557340",
    "type": "fix",
    "title": "fix(hair): no cracks from half-subdivided locks, no trembling against weapons and the back"
  },
  {
    "date": "2026-11-16",
    "hash": "96b67a3d",
    "type": "feat",
    "title": "feat(hair): hair ties hold still, no collision pushes out, long loose hair gets 60k strands and 36 bends"
  },
  {
    "date": "2026-11-16",
    "hash": "0892b18f",
    "type": "feat",
    "title": "feat(hair): strand nodes evaluated once per frame on the GPU; Enhanced draws smooth 27-bend curves"
  },
  {
    "date": "2026-11-16",
    "hash": "31ed947a",
    "type": "fix",
    "title": "fix(hair): cape no longer throws the ponytail off the head; hair band stays centred"
  },
  {
    "date": "2026-11-16",
    "hash": "d8fff528",
    "type": "fix",
    "title": "fix(hair): weld seam vertices so locks no longer crack open"
  },
  {
    "date": "2026-11-16",
    "hash": "8dcfc698",
    "type": "fix",
    "title": "fix(hair): continuous hair mesh, no popping strands; Enhanced with 40k waved, frayed, depth-shaded strands"
  },
  {
    "date": "2026-11-16",
    "hash": "c41f903c",
    "type": "fix",
    "title": "fix(hair): rest under back weapons instead of sticking to them; no trembling, no torn locks"
  },
  {
    "date": "2026-11-16",
    "hash": "fa73fe54",
    "type": "fix",
    "title": "fix(hair): hair sways back and aside, never forward into the face or around the neck; calmer motion"
  },
  {
    "date": "2026-11-16",
    "hash": "1b3da0fb",
    "type": "fix",
    "title": "fix(hair): keep swinging locks off the jaw, beard and neck; no fur shells on hair"
  },
  {
    "date": "2026-11-15",
    "hash": "0b7452a4",
    "type": "fix",
    "title": "fix(hair): beards as fur shells glued to the face, hair never swung into the face"
  },
  {
    "date": "2026-11-15",
    "hash": "7ebedf5d",
    "type": "feat",
    "title": "feat(hair): strand groom grown over the original hairstyles (TressFX-style fibres)"
  },
  {
    "date": "2026-11-15",
    "hash": "b535e01d",
    "type": "other",
    "title": "build(hair): vendor AMD TressFX 4.1 (ba0bdac, MIT) core + compile its 6 GPU simulation kernels to SPIR-V"
  },
  {
    "date": "2026-11-15",
    "hash": "ccc3747a",
    "type": "fix",
    "title": "fix(hair,cape,sheath): fix Human hair/beards, Enhanced follow strands, 2H/staff clearance, and Draenei tail cloak drape"
  },
  {
    "date": "2026-11-15",
    "hash": "f84256fd",
    "type": "fix",
    "title": "fix(hair): rigid ring clasp detection, final-guide re-projection, and GPU capsule/cape collisions"
  },
  {
    "date": "2026-11-15",
    "hash": "4982d751",
    "type": "fix",
    "title": "recover: working tree of feature/living-hair after the 2026-11-15 NVMe crash"
  },
  {
    "date": "2026-11-15",
    "hash": "ed4935d8",
    "type": "fix",
    "title": "fix(m2,fx): fix Blood Elf empty-key pose tilt and Shadow Clones smoke flipbooks, drag, ribbons, and fade scale"
  },
  {
    "date": "2026-11-15",
    "hash": "c989c308",
    "type": "fix",
    "title": "fix(combat,spell): sync stun/fear anims, spell hit flinch, and single-target spell go casts"
  },
  {
    "date": "2026-11-15",
    "hash": "872037f4",
    "type": "fix",
    "title": "fix(chat): show local player speech bubbles and position above entity head height"
  },
  {
    "date": "2026-11-15",
    "hash": "808169b5",
    "type": "fix",
    "title": "fix(creatures,fx): calibrate diseased wolf scale and implement M2 sphere particle spawning"
  },
  {
    "date": "2026-11-15",
    "hash": "cc9f86d3",
    "type": "fix",
    "title": "fix(units): allow synthetic mirror-image displayIds past DBC cap"
  },
  {
    "date": "2026-11-15",
    "hash": "d9d59096",
    "type": "fix",
    "title": "fix(portrait): clear target cleanly on despawn and avoid NPC class circles behind portraits"
  },
  {
    "date": "2026-11-15",
    "hash": "a3992292",
    "type": "fix",
    "title": "fix(anim,movement): clear stale creature/player death pose and play WALK_BACKWARDS in BG"
  },
  {
    "date": "2026-11-15",
    "hash": "1aa09c86",
    "type": "fix",
    "title": "fix(bg): preserve post-match scoreboard rows and wire BG runtime/expiration timers"
  },
  {
    "date": "2026-11-15",
    "hash": "616ebd03",
    "type": "fix",
    "title": "fix(rendering): fix lamp red/black artifacts and lift recessed brazier flames above rims"
  },
  {
    "date": "2026-11-15",
    "hash": "61900b12",
    "type": "fix",
    "title": "fix(mail,ui): use high-res coin icons, hide raw AH invoice body, honor SetOwner offsets"
  },
  {
    "date": "2026-11-15",
    "hash": "fa38b67b",
    "type": "fix",
    "title": "fix(shaders): eliminate cloth banner two-sided shadow and RT GI flashing"
  },
  {
    "date": "2026-11-15",
    "hash": "83b23231",
    "type": "feat",
    "title": "feat(hair): Living Hair phase 1 - physics on the model's own hair bones"
  },
  {
    "date": "2026-11-15",
    "hash": "16fb2dea",
    "type": "fix",
    "title": "fix(cape): keep lower cloak and outer tip clear of flared armored boot cuffs"
  },
  {
    "date": "2026-11-14",
    "hash": "d7b836b8",
    "type": "fix",
    "title": "fix(animation): landing no longer replays the JumpEnd crouch under the fade to Stand"
  },
  {
    "date": "2026-11-14",
    "hash": "cbb0ad13",
    "type": "feat",
    "title": "feat(spell): escala de efeito e volume de som das linhas Soder novas (Shadow Clones: saida -20% fumaca, -10% som)"
  },
  {
    "date": "2026-11-14",
    "hash": "087f6ebd",
    "type": "fix",
    "title": "fix(sky): sort sky M2 batches by priorityPlane and sample second texture mask"
  },
  {
    "date": "2026-11-14",
    "hash": "3eaf147e",
    "type": "fix",
    "title": "fix(character): apply flat skin shading to bare forearms and shins"
  },
  {
    "date": "2026-11-14",
    "hash": "845fe2ba",
    "type": "fix",
    "title": "fix(character): resolve skirt/kilt GeosetGroup3 and kneepads/cuffs parity"
  },
  {
    "date": "2026-11-14",
    "hash": "c3249df6",
    "type": "feat",
    "title": "rendering: flatten ear and SkinExtra character materials to match face skin"
  },
  {
    "date": "2026-11-14",
    "hash": "119e188b",
    "type": "fix",
    "title": "fix(rendering): map scalp/facial overlays to head regions in compositeWithRegions"
  },
  {
    "date": "2026-11-14",
    "hash": "7bbfe7f6",
    "type": "fix",
    "title": "fix(client): cabelo 1:1 Wow.exe, cores sem FSR, animacoes e nameplates"
  },
  {
    "date": "2026-11-14",
    "hash": "5ac66f70",
    "type": "feat",
    "title": "rendering: keep opaque M2_BLEND_ALPHA (!hasAlpha) batches in Pass 1 depth write"
  },
  {
    "date": "2026-11-14",
    "hash": "acd888ef",
    "type": "fix",
    "title": "rendering: fix WMO wall dFdx moire and M2/WMO cloth banner splitting/shadows"
  },
  {
    "date": "2026-11-14",
    "hash": "00ef0039",
    "type": "fix",
    "title": "fix(rendering): eliminate RT Monte Carlo grain on characters/walls & fix WMO wall shadow bands"
  },
  {
    "date": "2026-11-14",
    "hash": "470c859f",
    "type": "fix",
    "title": "fix(rendering): restore full-color stable FSR 3/4.1 compute path & ensure visible RT lighting"
  },
  {
    "date": "2026-11-13",
    "hash": "53c91a2f",
    "type": "fix",
    "title": "fix(rendering): fix FSR 4.1/3 jitter sign & RDNA3 FPS drop, restore visible RT AO/shadows/bounce"
  },
  {
    "date": "2026-11-13",
    "hash": "145b8066",
    "type": "fix",
    "title": "fix(rendering): revert FSR MSAA/jitter regressions and fix Ray Tracing darkening, ghost silhouette and BLAS stalls"
  },
  {
    "date": "2026-11-10",
    "hash": "70ad4dfc",
    "type": "perf",
    "title": "perf(core): parallelize UI layout, scale M2 culling chunks and bound terrain streaming budget"
  },
  {
    "date": "2026-11-10",
    "hash": "18f9a6a1",
    "type": "perf",
    "title": "diag(perf): media do beginFrame por parte com SODER_NEXTGEN_FRAME_PROFILE"
  },
  {
    "date": "2026-11-10",
    "hash": "4488935d",
    "type": "fix",
    "title": "fix(grass): grama sem granulado - lamina converge para a cor do chao com a distancia"
  },
  {
    "date": "2026-11-10",
    "hash": "ff9d5521",
    "type": "fix",
    "title": "fix(visual): texto de combate e preset Ultra mais fieis ao original"
  },
  {
    "date": "2026-11-10",
    "hash": "8c5ab8d0",
    "type": "fix",
    "title": "fix(bg): bandeira do portador inimigo volta se for coberta nas costas"
  },
  {
    "date": "2026-11-10",
    "hash": "1479ef71",
    "type": "fix",
    "title": "fix(audio): sons de magia dos outros saem posicionais, nao no ouvido"
  },
  {
    "date": "2026-11-10",
    "hash": "6328c804",
    "type": "fix",
    "title": "fix(party): quadros do grupo na BG com nome e so o seu subgrupo"
  },
  {
    "date": "2026-11-10",
    "hash": "9cbb0e51",
    "type": "fix",
    "title": "fix(bg): entrar na BG nao cai mais por baixo do piso da sala"
  },
  {
    "date": "2026-11-09",
    "hash": "eaf46eee",
    "type": "fix",
    "title": "fix(fire): lampadas e lanternas voltam a chama do proprio modelo"
  },
  {
    "date": "2026-11-09",
    "hash": "f8aac430",
    "type": "fix",
    "title": "fix(names): nomes sobre a cabeca em FRIZQT e cores de reacao do 3.3.5"
  },
  {
    "date": "2026-11-09",
    "hash": "53156e86",
    "type": "fix",
    "title": "fix(mount): cavaleiro remoto na sela e montaria virando como no 3.3.5"
  },
  {
    "date": "2026-11-09",
    "hash": "5ce4d42b",
    "type": "fix",
    "title": "fix(glue): cena de selecao do morto-vivo sem o segundo fundo claro"
  },
  {
    "date": "2026-11-09",
    "hash": "8e4e5d71",
    "type": "fix",
    "title": "fix(combat-text): numeros de combate 1:1 com o 3.3.5"
  },
  {
    "date": "2026-11-09",
    "hash": "66418fd3",
    "type": "fix",
    "title": "fix(ui): Region:GetDrawLayer real; janela de dialogo de NPC sem arte antiga vazando"
  },
  {
    "date": "2026-11-09",
    "hash": "7672ce35",
    "type": "fix",
    "title": "fix(login): pet do hunter no ponto do cenario (attachment 1 da cena da raca), no chao atras do personagem"
  },
  {
    "date": "2026-11-09",
    "hash": "1833b60b",
    "type": "fix",
    "title": "fix(portrait): undead enquadrado pela camera de retrato do proprio modelo (corcunda saia pequeno e baixo)"
  },
  {
    "date": "2026-11-09",
    "hash": "0d3854c2",
    "type": "fix",
    "title": "fix(ui): dressing room gira com os botoes; UnitInRaid devolve o indice do raid (menu do clique direito em aliado na BG)"
  },
  {
    "date": "2026-11-09",
    "hash": "cc274c1a",
    "type": "fix",
    "title": "fix(druid): Primal Mimicry (70004) nao e mais tratado como golpe corpo a corpo"
  },
  {
    "date": "2026-11-09",
    "hash": "5c45695f",
    "type": "fix",
    "title": "fix(units): imagem espelhada (Shadow Clones, Mirror Image) com a aparencia do conjurador"
  },
  {
    "date": "2026-11-09",
    "hash": "16ac8232",
    "type": "fix",
    "title": "fix(char): draenei mulher com rabo (geoset 601, grupo 6) - jogadores e NPCs"
  },
  {
    "date": "2026-11-08",
    "hash": "c8f0ec43",
    "type": "feat",
    "title": "feat(arcane): explosao arcana propria (clarao, casca, aneis de choque, nucleo crepitando, sem fumaca)"
  },
  {
    "date": "2026-11-08",
    "hash": "e2499517",
    "type": "fix",
    "title": "fix(arcane): 70009 no 64 bits ignora o precast do DBC (o circulo e o proprio)"
  },
  {
    "date": "2026-11-08",
    "hash": "616807c7",
    "type": "feat",
    "title": "feat(arcane): Arcane Cataclysm com arma na mao e som de explosao no impacto"
  },
  {
    "date": "2026-11-08",
    "hash": "bac537ab",
    "type": "feat",
    "title": "feat(arcane): Arcane Cataclysm com circulo magico, orbe estrela de neutrons e explosao arcana"
  },
  {
    "date": "2026-11-08",
    "hash": "ad43e403",
    "type": "feat",
    "title": "feat(fire): bola de fogo mini-sol com cauda que afina em fumaca e explosao no impacto"
  },
  {
    "date": "2026-11-08",
    "hash": "3c38e709",
    "type": "fix",
    "title": "fix(anim): mob atacado nao corre mais deitado - 0x08 e 'tapped', morto e 0x20"
  },
  {
    "date": "2026-11-08",
    "hash": "d17ad16c",
    "type": "fix",
    "title": "fix(spells): magias com missil voam do conjurador ate o alvo (bola de fogo)"
  },
  {
    "date": "2026-11-08",
    "hash": "13f40d2b",
    "type": "fix",
    "title": "fix: bola de fogo invisivel e mob ressuscitado correndo deitado"
  },
  {
    "date": "2026-11-08",
    "hash": "e712cfa6",
    "type": "fix",
    "title": "fix(fire): fogo atras dos objetos (profundidade real da chama) e fim do granizo vermelho"
  },
  {
    "date": "2026-11-08",
    "hash": "fb61039c",
    "type": "feat",
    "title": "feat(fire): fogo volumetrico next gen - tochas, braseiros, lareiras, velas e magias de fogo"
  },
  {
    "date": "2026-11-08",
    "hash": "c749ac9f",
    "type": "fix",
    "title": "revert: fogo de flipbook (77b27198) reprovado pelo Juliano - volta ao fogo anterior"
  },
  {
    "date": "2026-11-08",
    "hash": "77b27198",
    "type": "feat",
    "title": "feat(fire): fogo das fogueiras/tochas fiel ao autorado + fumaca e brasas"
  },
  {
    "date": "2026-11-08",
    "hash": "d15dbe5a",
    "type": "fix",
    "title": "fix(sky): riscos do entardecer suavizados - borda dos cards do ceu esmaece e textura .bl truncada carrega como .blp"
  },
  {
    "date": "2026-11-08",
    "hash": "6d8f2b5b",
    "type": "fix",
    "title": "fix(sky): discos de sol do M2 do ceu (ovo em Durotar, sol cortado em Ventobravo) trocados pelo sol do motor"
  },
  {
    "date": "2026-11-08",
    "hash": "542069d5",
    "type": "fix",
    "title": "fix(sky): trilhas do M2 do ceu pela hora do dia e lua desenhada depois do modelo do ceu"
  },
  {
    "date": "2026-11-08",
    "hash": "6cc2eb24",
    "type": "feat",
    "title": "feat(render): PBR Cook-Torrance GGX lighting and surface roughness for WMO buildings and roads"
  },
  {
    "date": "2026-11-08",
    "hash": "d5cedafc",
    "type": "feat",
    "title": "tools(smoke): tilt:<px> step pitches the camera, to look at the sky"
  },
  {
    "date": "2026-11-08",
    "hash": "cf597a83",
    "type": "fix",
    "title": "fix(ui): mount shown in DragonUI's Mounts window; model frames resolve by name every frame"
  },
  {
    "date": "2026-11-08",
    "hash": "7554fdc5",
    "type": "fix",
    "title": "fix(auth): SRP6 hashes A, B and the salt as 32 bytes, so a correct password is not refused"
  },
  {
    "date": "2026-11-08",
    "hash": "bc81b93c",
    "type": "fix",
    "title": "fix(ui): dressing room shows the character inside its window"
  },
  {
    "date": "2026-11-08",
    "hash": "a65d48f3",
    "type": "fix",
    "title": "fix(anim): resurrected player stands up; mount idle fidgets are Stand variations only"
  },
  {
    "date": "2026-11-08",
    "hash": "6c7dbdd8",
    "type": "fix",
    "title": "fix(audio): race voice for melee out-of-range and the two group refusals"
  },
  {
    "date": "2026-11-08",
    "hash": "966fb2b8",
    "type": "fix",
    "title": "fix(spells): BG flag carrier draws one flag, not the banner plus a translucent effect copy"
  },
  {
    "date": "2026-11-07",
    "hash": "08382c8c",
    "type": "fix",
    "title": "fix(client): lote de correcoes criticas - bandeiras BG, sentado estavel, montarias bots, camera e sons hunter"
  },
  {
    "date": "2026-11-07",
    "hash": "ccb2a2a9",
    "type": "fix",
    "title": "fix(anim): prevent dead bots and creatures from standing up on locomotion stop"
  },
  {
    "date": "2026-11-07",
    "hash": "2493c74c",
    "type": "fix",
    "title": "fix(rendering,worldmap): lua 1:1 identica ao 32bits e correcao definitiva de mapas sobrepostos"
  },
  {
    "date": "2026-11-07",
    "hash": "52d4b5c0",
    "type": "fix",
    "title": "fix(bg,queue,visuals): corrigir saida de fila bg via AcceptBattlefieldPort, opcode 0x1F90, olho azul 8753 em guardas e warmup WMO em bgs"
  },
  {
    "date": "2026-11-06",
    "hash": "a7305aa0",
    "type": "fix",
    "title": "fix(rendering): lua 1:1 autentica 3.3.5a (Textures\\moon.blp), remocao de glare borrado e resolucao de race condition de assets"
  },
  {
    "date": "2026-11-06",
    "hash": "718399f9",
    "type": "fix",
    "title": "fix(bg,ui,spells): corrigir entrada/saida de bg, nome duplicado do player, olho azul em guardas e terreno de bg"
  },
  {
    "date": "2026-11-06",
    "hash": "f50dcea3",
    "type": "fix",
    "title": "fix(client): correcao alvo/foco em si mesmo, inspecao party/foco, vestuario gigante 3d, nameplates e cvars de nomes"
  },
  {
    "date": "2026-11-06",
    "hash": "fa9b66f2",
    "type": "fix",
    "title": "fix(client): resolucoes criticas - preview 3d montarias, lua 1:1, olho azul em NPCs, piso de BG e cor de zona"
  },
  {
    "date": "2026-11-06",
    "hash": "34d6a001",
    "type": "feat",
    "title": "Floating names without \"??\", pet beside the hunter, PrimalMimicry always staged"
  },
  {
    "date": "2026-11-03",
    "hash": "9b2c754c",
    "type": "feat",
    "title": "feat(gamepad): map left paddle to target nearest enemy (TAB) and update unit tests"
  },
  {
    "date": "2026-11-03",
    "hash": "0dd36c1f",
    "type": "fix",
    "title": "fix(client): paridade 1:1 Drez, warpaint facial, quiver nas costas, tiro hunter e pet"
  },
  {
    "date": "2026-11-03",
    "hash": "8fc3d4dd",
    "type": "fix",
    "title": "fix(client): authentic loading screen wallpapers, classic progress bar and helmet hair hiding"
  },
  {
    "date": "2026-11-03",
    "hash": "10b01fc5",
    "type": "fix",
    "title": "fix(client): hunter missile rendering, spell impact callback, and smart tab targeting"
  },
  {
    "date": "2026-11-03",
    "hash": "95127670",
    "type": "fix",
    "title": "fix(client): corrigir textura do pet boar, distancia de nomes, buffs unknown, sons de tiro e spellbook"
  },
  {
    "date": "2026-11-03",
    "hash": "3a9cd4d1",
    "type": "fix",
    "title": "fix(client): correcao dos bugs reportados do cliente 64 bits"
  },
  {
    "date": "2026-11-02",
    "hash": "7e7a21fb",
    "type": "feat",
    "title": "Character creation: the race and class combinations this server opened"
  },
  {
    "date": "2026-11-02",
    "hash": "8ae7ab3b",
    "type": "feat",
    "title": "Pet mounts: draw them at the size their display carries"
  },
  {
    "date": "2026-11-02",
    "hash": "a3804798",
    "type": "feat",
    "title": "Character creation: Tauren Paladin, Troll Druid, Gnome Priest"
  },
  {
    "date": "2026-10-31",
    "hash": "499bfc70",
    "type": "feat",
    "title": "DragonUI always staged with the client build"
  },
  {
    "date": "2026-10-31",
    "hash": "434b8120",
    "type": "feat",
    "title": "Rename WoWee to soder-nextgen everywhere"
  },
  {
    "date": "2026-10-31",
    "hash": "4de56bae",
    "type": "feat",
    "title": "Game menu: \"WoW Classic LK Plus\" in place of \"About WoWee\""
  },
  {
    "date": "2026-10-31",
    "hash": "4920477f",
    "type": "feat",
    "title": "vkBasalt found through the link: F11 toggles the 32-bit look again"
  },
  {
    "date": "2026-10-31",
    "hash": "3a0219d4",
    "type": "feat",
    "title": "Sheep are drawn: an opaque material ignores its texture's alpha"
  },
  {
    "date": "2026-10-31",
    "hash": "ba4a62af",
    "type": "feat",
    "title": "Worn spell effects: Stand, then Hold, then Decay; solid layers drawn solid"
  },
  {
    "date": "2026-10-31",
    "hash": "daad90b8",
    "type": "feat",
    "title": "Spell effects are never merged into one instance; worn kits moved only on movement"
  },
  {
    "date": "2026-10-31",
    "hash": "eaae21a1",
    "type": "feat",
    "title": "Battlegrounds load their floor on the loading screen"
  },
  {
    "date": "2026-10-31",
    "hash": "fa5e94b6",
    "type": "feat",
    "title": "Auto-attack: combat mode on the click at any distance, off only when the target goes"
  },
  {
    "date": "2026-10-31",
    "hash": "258e538c",
    "type": "feat",
    "title": "Auto-attack keeps up with a runner; leaving combat by self-target or clear"
  },
  {
    "date": "2026-10-31",
    "hash": "a105a3f8",
    "type": "feat",
    "title": "Regressions: UnitClass('player') between maps; helm hides long-hair locks again"
  },
  {
    "date": "2026-10-30",
    "hash": "b0974cdd",
    "type": "feat",
    "title": "Creatures that channel are seen channelling: BG spirit guides, scene NPCs"
  },
  {
    "date": "2026-10-30",
    "hash": "1af4a4f9",
    "type": "feat",
    "title": "No more gear clank; nobody falls through an unloaded floor"
  },
  {
    "date": "2026-10-30",
    "hash": "958e5865",
    "type": "feat",
    "title": "PvP crowd control: aura state kits, transforms, server-driven movement, stun"
  },
  {
    "date": "2026-10-30",
    "hash": "c7180a23",
    "type": "feat",
    "title": "Cloak cloth: 120 Hz solver instead of 300"
  },
  {
    "date": "2026-10-30",
    "hash": "e93c524e",
    "type": "feat",
    "title": "UI layout: back to a full pass every frame"
  },
  {
    "date": "2026-10-30",
    "hash": "2b6cfa4f",
    "type": "fix",
    "title": "Characters: no self-shadow flicker on faces and hair"
  },
  {
    "date": "2026-10-30",
    "hash": "1777b81f",
    "type": "feat",
    "title": "Helms hide what HelmetGeosetVisData says, per race: ears, facial channels, hair"
  },
  {
    "date": "2026-10-30",
    "hash": "004aa7e0",
    "type": "feat",
    "title": "FSR motion, UI layout, cloth, bones, portraits and weapons (sessions of 2026-10-29/30)"
  },
  {
    "date": "2026-10-30",
    "hash": "bb4117a7",
    "type": "perf",
    "title": "Frame limiter: 30 fps only for a window that cannot be seen"
  },
  {
    "date": "2026-10-30",
    "hash": "10ce1fa2",
    "type": "feat",
    "title": "Shadow pass: casters recorded in parallel secondaries"
  },
  {
    "date": "2026-10-29",
    "hash": "37819a7c",
    "type": "feat",
    "title": "Ray traced bounce light: no fireflies"
  },
  {
    "date": "2026-10-29",
    "hash": "ab209ec8",
    "type": "feat",
    "title": "Upscaling: jitter in the right direction, FSR 4 fed RGBA16F, FSR 1 not overruled by FXAA"
  },
  {
    "date": "2026-10-29",
    "hash": "22595d93",
    "type": "feat",
    "title": "Upscaling: FSR 4.1 (experimental) through fsr4-vk; frame generation off the panel"
  },
  {
    "date": "2026-10-29",
    "hash": "0b5889ae",
    "type": "feat",
    "title": "Shadows: normal offset in yards, from the geometry - no more stripes on lit ground"
  },
  {
    "date": "2026-10-29",
    "hash": "a79a37cb",
    "type": "feat",
    "title": "Ray traced lighting: no sun, no sun shadows - and no cost for them"
  },
  {
    "date": "2026-10-29",
    "hash": "58948d7b",
    "type": "feat",
    "title": "Video options: changes wait for Apply or Okay, as in the game's own window"
  },
  {
    "date": "2026-10-29",
    "hash": "e36a204c",
    "type": "feat",
    "title": "Start under the 32-bit client's vkBasalt pipeline"
  },
  {
    "date": "2026-10-29",
    "hash": "af64bac9",
    "type": "feat",
    "title": "Ghost bars: a bar's actionpage is not a button; stances get one sound"
  },
  {
    "date": "2026-10-29",
    "hash": "6821635c",
    "type": "fix",
    "title": "Revert \"Moon: billboard bones face the screen like Wow.exe; the sky's own moon is drawn\""
  },
  {
    "date": "2026-10-28",
    "hash": "ba272398",
    "type": "feat",
    "title": "Moon: billboard bones face the screen like Wow.exe; the sky's own moon is drawn"
  },
  {
    "date": "2026-10-28",
    "hash": "14db0ced",
    "type": "feat",
    "title": "Guards, mounts, spell sounds, moon: undo the guesses"
  },
  {
    "date": "2026-10-28",
    "hash": "51663658",
    "type": "feat",
    "title": "Lua stack overflow at login; moon and sun from the original textures"
  },
  {
    "date": "2026-10-28",
    "hash": "e7119133",
    "type": "fix",
    "title": "fix(client): remediacao de charge em combate, inspect gear, nomes pvp em vermelho, fisica de montanha, raytracing e lua autentica 1:1"
  },
  {
    "date": "2026-10-28",
    "hash": "661fe64e",
    "type": "fix",
    "title": "fix(client): remediacao completa de lua, minimapa, audios, nameplates, montarias e combate"
  },
  {
    "date": "2026-10-28",
    "hash": "326afc47",
    "type": "fix",
    "title": "fix(client): supressao total de audios no login, correcao de stance warrior, vehicle exit button, zoom/rotacao paperdoll e estabilizacao do combate hunter/warrior"
  },
  {
    "date": "2026-10-28",
    "hash": "a2c531fe",
    "type": "fix",
    "title": "fix(client): restaura capacetes 1:1, suprime áudio de engrenagem no login/BG, sincroniza chão em BGs e corrige action bar de stances"
  },
  {
    "date": "2026-10-28",
    "hash": "dd03e3d9",
    "type": "fix",
    "title": "fix(client): modelo autêntico do escudo da Aliança, capacete Stormwind sem calvície, debounce de pouso/spawn de 5s, som 1:1 de BG e atualização da barra na postura defensiva"
  },
  {
    "date": "2026-10-28",
    "hash": "600f95f0",
    "type": "fix",
    "title": "fix(client): supressão definitiva do som uEscapeScreenOpen no login, restauração 1:1 de escudo, capacete e ombreiras de Stormwind"
  },
  {
    "date": "2026-10-28",
    "hash": "c0fcac73",
    "type": "fix",
    "title": "fix(client): correções de postura do guerreiro, ressurreição, som de spawn, escudo SW e efeitos de magias (roots/frost/rend)"
  },
  {
    "date": "2026-10-27",
    "hash": "d4cb1592",
    "type": "fix",
    "title": "fix(client): correções de BG, warrior stances, charge auto-facing e sons autênticos 3.3.5a"
  },
  {
    "date": "2026-10-27",
    "hash": "9945acdb",
    "type": "feat",
    "title": "Units on a server spline face along the path, the spline facing on arrival"
  },
  {
    "date": "2026-10-27",
    "hash": "155d2958",
    "type": "feat",
    "title": "BG map: carrier dots in wire order, no second self marker, real instance type"
  },
  {
    "date": "2026-10-27",
    "hash": "9f0ae3ad",
    "type": "feat",
    "title": "Refuse front-facing spells at a target behind; turn the model on Charge"
  },
  {
    "date": "2026-10-27",
    "hash": "66dba595",
    "type": "feat",
    "title": "SecureCmdOptionParse: real conditions, so state drivers work (stance bars)"
  },
  {
    "date": "2026-10-26",
    "hash": "d9346013",
    "type": "feat",
    "title": "Cape (NvCloth): swords start inside the cloak, real legs, room for the mount"
  },
  {
    "date": "2026-10-26",
    "hash": "677c43b6",
    "type": "feat",
    "title": "Cape: NVIDIA NvCloth simulates the cloak"
  },
  {
    "date": "2026-10-26",
    "hash": "f542414e",
    "type": "feat",
    "title": "Cape: back to f1fdabc8, plus the hip sword's collision where the sword is"
  },
  {
    "date": "2026-10-26",
    "hash": "483caf1c",
    "type": "feat",
    "title": "Cape: a hip sword worn under a cloak hangs along the thigh"
  },
  {
    "date": "2026-10-26",
    "hash": "c65c11d7",
    "type": "feat",
    "title": "Cape: weapons collide with their real shape; the cloth itself, not only its nodes"
  },
  {
    "date": "2026-10-26",
    "hash": "7d29e2db",
    "type": "feat",
    "title": "Cape: kept outside the body's real surface; drawn cloth meets the hip blade"
  },
  {
    "date": "2026-10-26",
    "hash": "5b36242d",
    "type": "feat",
    "title": "Cape: draw the cloak wholly from the simulation, on the body's skinning"
  },
  {
    "date": "2026-10-26",
    "hash": "f1fdabc8",
    "type": "feat",
    "title": "Cape: a hip sword is a thin solid blade again; denser cloth grid"
  },
  {
    "date": "2026-10-26",
    "hash": "f7902b4e",
    "type": "feat",
    "title": "Cape: the cloak lies on a hip sword's blade; the top follows the bending back"
  },
  {
    "date": "2026-10-26",
    "hash": "19853944",
    "type": "feat",
    "title": "Cape: solid hip sword and limbs, room under a back greatsword, debug log"
  },
  {
    "date": "2026-10-26",
    "hash": "4c1f2fbc",
    "type": "feat",
    "title": "Entry guard: only a floor over the player's head counts as fallen through"
  },
  {
    "date": "2026-10-26",
    "hash": "aa4736f0",
    "type": "feat",
    "title": "Cape: position based solver without rebound, bending that resists folding"
  },
  {
    "date": "2026-10-26",
    "hash": "c5a8df9e",
    "type": "feat",
    "title": "Auction house: right-click a bag item into the sell slot"
  },
  {
    "date": "2026-10-26",
    "hash": "91ff46bd",
    "type": "feat",
    "title": "Cape: let the cloak out below a back item along an opening curve"
  },
  {
    "date": "2026-10-26",
    "hash": "cc74a1e8",
    "type": "feat",
    "title": "Cape: under a back shield, hang out to the shield's inside face"
  },
  {
    "date": "2026-10-26",
    "hash": "9325b7c0",
    "type": "feat",
    "title": "Cape: follow the bending back, drape off back items, lie over the mount"
  },
  {
    "date": "2026-10-26",
    "hash": "42156138",
    "type": "feat",
    "title": "Terrain: compressed alpha runs are the low seven bits, not one more"
  },
  {
    "date": "2026-10-26",
    "hash": "1f4febe4",
    "type": "feat",
    "title": "Cape: subdivided cloak mesh, leg/blade contact at run start, more air lag"
  },
  {
    "date": "2026-10-26",
    "hash": "6e7880e0",
    "type": "feat",
    "title": "Music: stop playing the WoWee tracks, keep only the game's own soundtrack"
  },
  {
    "date": "2026-10-26",
    "hash": "4559d39b",
    "type": "other",
    "title": "Test aids: WOWEE_FORCE_HOUR and WOWEE_SMOKE_ORBIT_YREL for night-sky captures"
  },
  {
    "date": "2026-10-26",
    "hash": "51dd7826",
    "type": "fix",
    "title": "fix: botão direito em jogador inimigo inicia o ataque; fantasma consulta o curandeiro de área sozinho"
  },
  {
    "date": "2026-10-26",
    "hash": "c5b5b80a",
    "type": "fix",
    "title": "fix(BG): a guarda de entrada aceitava o relevo 9 jd abaixo do piso da sala da bandeira"
  },
  {
    "date": "2026-10-26",
    "hash": "1a1bed3e",
    "type": "fix",
    "title": "fix: personagem morre e fica deitado até soltar o espírito; guarda de entrada contra queda no mapa"
  },
  {
    "date": "2026-10-26",
    "hash": "4bdd6d86",
    "type": "fix",
    "title": "fix(criação): Death Knight usa só a cena de Icecrown (UI_DeathKnight), sem a cena da raça"
  },
  {
    "date": "2026-10-26",
    "hash": "66518aeb",
    "type": "fix",
    "title": "fix(capa): dinâmica de pano de verdade no lugar das ondas senoidais e do \"puxar para a pose\""
  },
  {
    "date": "2026-10-26",
    "hash": "faa20e01",
    "type": "fix",
    "title": "fix(capa): restaura fisica fluida estilo Helldivers/Witcher e corrige faixa retangular do BackCeiling"
  },
  {
    "date": "2026-10-25",
    "hash": "d07434cd",
    "type": "fix",
    "title": "fix(capa): corrige colisao com escudo, espada 2M diagonal, espada na cintura e fisica de pulo"
  },
  {
    "date": "2026-10-25",
    "hash": "78d7b037",
    "type": "fix",
    "title": "fix(capa): preserva manto 3D da gola nos ombros e corrige colisao de perna e repouso no humano"
  },
  {
    "date": "2026-10-25",
    "hash": "be8d08be",
    "type": "fix",
    "title": "fix(capa): corrige gola esticada e mantém capa colada nas costas sob escudo/arma 2H"
  },
  {
    "date": "2026-10-25",
    "hash": "2505859f",
    "type": "feat",
    "title": "feat(capa): malha 12x18 (216 nós), barreira anatômica costas/bunda, colisão direcional armas/escudo/pernas e sombras"
  },
  {
    "date": "2026-10-25",
    "hash": "1da20018",
    "type": "feat",
    "title": "feat: capa como pano de verdade (grade de nós sobre a malha, offset por vértice)"
  },
  {
    "date": "2026-10-25",
    "hash": "8a69a73f",
    "type": "feat",
    "title": "feat: física de pano na capa (inércia, vento, colisão com pernas, torso e armas)"
  },
  {
    "date": "2026-10-25",
    "hash": "061705fa",
    "type": "fix",
    "title": "fix: alvo limpo quando o corpo some por fora de alcance (retrato vazio com o atlas de classes)"
  },
  {
    "date": "2026-10-25",
    "hash": "0e34cc21",
    "type": "fix",
    "title": "fix(combate): animação de habilidade era cancelada antes de tocar"
  },
  {
    "date": "2026-10-25",
    "hash": "f0c2f312",
    "type": "fix",
    "title": "fix: caixinhas do raid na BG, modelo do painel C, cavaleiro em pé, capa x armas, tempo do ressuscitador"
  },
  {
    "date": "2026-10-22",
    "hash": "f9956dfd",
    "type": "feat",
    "title": "diag: log remote rider animation state (WOWEE_DIAG_RIDER)"
  },
  {
    "date": "2026-10-22",
    "hash": "07f999d6",
    "type": "feat",
    "title": "charge: face target during and after charge"
  },
  {
    "date": "2026-10-21",
    "hash": "8fe7bdfe",
    "type": "fix",
    "title": "fix(combate): estado de combate do servidor, golpe em toda habilidade, lutas alheias animadas, morte que fica"
  },
  {
    "date": "2026-10-21",
    "hash": "23f16e88",
    "type": "feat",
    "title": "feat: capa sob escudo/arma das costas (balanço só abaixo do item)"
  },
  {
    "date": "2026-10-21",
    "hash": "38ef02b7",
    "type": "perf",
    "title": "perf: fim das travadas ao correr e do teto de 37,5 fps no monitor de 75 Hz"
  },
  {
    "date": "2026-10-21",
    "hash": "90e4315d",
    "type": "feat",
    "title": "feat(ui): tela de criação no vidro dourado da lista de personagens"
  },
  {
    "date": "2026-10-21",
    "hash": "2ad98d62",
    "type": "fix",
    "title": "fix: portão de Westfall (WMO duas camadas), cabelo da gnoma, alvo após despawn"
  },
  {
    "date": "2026-10-21",
    "hash": "7f4d3237",
    "type": "fix",
    "title": "fix: habilidades de raiva acesas, cor animada de efeitos, perna sem bota, mira do caçador"
  },
  {
    "date": "2026-10-20",
    "hash": "94dddcd4",
    "type": "fix",
    "title": "fix: ícones de bolsas e loot, barras de poder, postura, W+A/D, escudo, tela de login e mais"
  },
  {
    "date": "2026-10-19",
    "hash": "8affc547",
    "type": "feat",
    "title": "feat/fix: progresso de implementacao das tarefas do backlog (lua, castbar, animacoes, UI)"
  },
  {
    "date": "2026-10-14",
    "hash": "694c94e8",
    "type": "other",
    "title": "chore: checkpoint do trabalho interrompido das tarefas 032 e 034"
  },
  {
    "date": "2026-10-14",
    "hash": "02512347",
    "type": "feat",
    "title": "fidelity: WMO MOGP truncado (paredes invisíveis), animação/mão/nomes (028), poder x10, regras de cast, UI de addons mais barata (034 P-A)"
  },
  {
    "date": "2026-10-13",
    "hash": "ef19c4d2",
    "type": "perf",
    "title": "perf(m2): sombras M2 em instancing, partículas só no frustum, UI de addons mais barata (Tarefa 016)"
  },
  {
    "date": "2026-10-13",
    "hash": "b076d36b",
    "type": "fix",
    "title": "fix(movement): física em passo fixo e constantes do Wow.exe (Tarefa 025)"
  },
  {
    "date": "2026-10-13",
    "hash": "7d6a161f",
    "type": "feat",
    "title": "nextgen: smoke de mundo limpo (ping 29 s, JUMP), fidelidade visual, caches e pré-carga (Tarefas 017, 020-023)"
  },
  {
    "date": "2026-10-12",
    "hash": "6503c179",
    "type": "perf",
    "title": "perf(terrain): fatia por tempo o upload de texturas e chunks do terreno (3 ms/passo)"
  },
  {
    "date": "2026-10-12",
    "hash": "4b6a6e0c",
    "type": "feat",
    "title": "nextgen: profiling de carregamento e dedupe de normal maps de WMO (63,6 -> 34,7 s); medição de frametime (CSV) e WOWEE_VSYNC"
  },
  {
    "date": "2026-10-12",
    "hash": "6925efb1",
    "type": "feat",
    "title": "nextgen: caminho isolado de dados, auto-login/auto-personagem de teste, keepalive no carregamento do mundo, smoke script"
  },
  {
    "date": "2026-10-11",
    "hash": "a2b11653",
    "type": "other",
    "title": "refactor(combat): extrai limites de alcance do auto-ataque (Tarefa 008)"
  },
  {
    "date": "2026-10-11",
    "hash": "310238bc",
    "type": "feat",
    "title": "auth: refuse account names longer than 16 characters"
  }
]
