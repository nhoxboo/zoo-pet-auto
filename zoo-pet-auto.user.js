// ==UserScript==
// @name         Zoo Pet - All-in-One Auto Pro Tool
// @namespace    https://zoo-pet.store/
// @version      2.5.1
// @description  Tool Auto toàn diện, An Toàn 100% Anti-Detection cho Zoo Pet: Auto Farm, Boss Hopper, Smart Quests, Combat Mod, Shadow Vision, Ultra Fishing, Background Worker.
// @author       Beso & Antigravity
// @match        https://zoo-pet.store/*
// @match        https://*.zoo-pet.store/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @icon         https://zoo-pet.store/favicon.ico
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js
// @downloadURL  https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('%c[ZooPet Auto Pro v2.5.1]%c Khởi tạo engine Auto & VIP Mod...', 'color:#2563EB;font-weight:bold;font-size:14px', 'color:#475569');

    // --- HOOK DEV ENGINE NGAY TỪ ĐẦU (ĐẢM BẢO window.game = $) ---
    try {
        const origTest = RegExp.prototype.test;
        RegExp.prototype.test = function (str) {
            if (this.source && this.source.includes('localhost|127\\.0\\.0\\.1') && typeof str === 'string' && str.includes('zoo-pet.store')) {
                return true;
            }
            return origTest.apply(this, arguments);
        };
    } catch (_) {}

    // --- CẤU HÌNH MẶC ĐỊNH (DEFAULT CONFIG) ---
    const DEFAULT_CFG = {
        farm: {
            enabled: true,
            autoPlant: true,
            autoHarvest: true,
            autoPetCare: true,
            seedChoice: 'auto'
        },
        friend: {
            enabled: true,
            autoWater: true,
            autoSteal: true,
            checkInterval: 60
        },
        combat: {
            enabled: true,
            useSkills: true,
            targetMode: 'all',
            searchRadius: 35,
            dodgeLowHp: true,
            dodgeThreshold: 30,
            skipTitans: true
        },
        boss: {
            autoHopPlanets: false,
            hopDelay: 5,
            skipTitans: true,
            planets: {
                home: true,
                toy: true,
                candy: true,
                jungle: true,
                ice: true,
                ocean: true,
                lava: true,
                sky: true,
                shadow: true
            }
        },
        quests: {
            enabled: true,
            autoClaimDaily: true,
            autoClaimWeekly: true,
            autoClaimBounty: true,
            autoClaimStory: true,
            autoClaimPass: true
        },
        fish: {
            enabled: true,
            autoReCast: true,
            autoEquipRod: true,
            mode: 'perfect'
        },
        cheats: {
            noCooldown: true,
            godMode: false,
            ultraFishing: false,
            globalMagnet: true,
            speedBoost: 1.0,
            attackMultiplier: 1.0,
            brightShadow: true
        },
        loot: {
            enabled: true,
            vacuumRadius: 999
        },
        misc: {
            backgroundWorker: true,
            fpsCap: 60
        }
    };

    let CFG = JSON.parse(localStorage.getItem('zp-auto-cfg') || JSON.stringify(DEFAULT_CFG));
    function saveConfig() {
        localStorage.setItem('zp-auto-cfg', JSON.stringify(CFG));
    }

    let G = null;
    let stats = {
        cropsHarvested: 0,
        seedsPlanted: 0,
        monstersKilled: 0,
        bossesKilled: 0,
        questsClaimed: 0,
        fishCount: 0,
        itemsLooted: 0
    };

    // --- HOOK ENGINE GAME BẢO ĐẢM 100% NHẬN GAME ---
    function checkGameHook() {
        if (window.game && window.game.player && window.game.world) {
            if (!G) {
                G = window.game;
                console.log('%c[ZooPet Auto]%c Đã kết nối thành công với Game Engine!', 'color:#10B981;font-weight:bold', 'color:#334155');
                const badge = document.querySelector('.zp-status-badge');
                if (badge) {
                    badge.textContent = '🟢 Đã kết nối';
                    badge.style.background = '#DCFCE7';
                    badge.style.color = '#166534';
                }
            }
        }
    }
    const hookCheckInterval = setInterval(checkGameHook, 200);

    // --- BACKGROUND TIMER WORKER (Bypass Throttle khi hạ tab) ---
    function initBackgroundWorker() {
        try {
            const blob = new Blob([`
                let timer = null;
                self.onmessage = function(e) {
                    if (e.data === 'start') {
                        if (!timer) timer = setInterval(() => self.postMessage('tick'), 100);
                    } else if (e.data === 'stop') {
                        if (timer) { clearInterval(timer); timer = null; }
                    }
                };
            `], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            worker.onmessage = () => {
                if (G && G.player) masterTick();
            };
            worker.postMessage('start');
            console.log('[ZooPet Auto] Background Worker initialized (100ms interval)');
        } catch (e) {
            console.warn('[ZooPet Auto] Worker fallback to setInterval', e);
            setInterval(() => {
                if (G && G.player) masterTick();
            }, 100);
        }

        try {
            Object.defineProperty(document, 'hidden', { get: () => false });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
        } catch (_) {}
    }

    // --- MODULE: PRO CHEATS & HACKS (CLIENT-SIDE AN TOÀN 100%) ---
    function runCheatsEngine() {
        if (!G || !G.player) return;
        const player = G.player;

        // 1. Hồi chiêu 0s (Client-side cooldown)
        if (CFG.cheats.noCooldown) {
            player.cd = { spin: 0, dash: 0, slam: 0, atk: 0, special: 0 };
        }

        // 2. Chế độ Bất Tử (God Mode - Khóa 100% HP, Kháng khống chế)
        if (CFG.cheats.godMode && player.alive) {
            player.hp = player.maxHp;
            player.invuln = 999999;
            player.burnUntil = 0;
            player.stunUntil = 0;
            player.defDownUntil = 0;
        }

        // 3. Tăng Tốc Di Chuyển
        if (CFG.cheats.speedBoost > 1.0) {
            player.buffs = player.buffs || {};
            player.buffs.speed = { v: (CFG.cheats.speedBoost - 1.0), until: player.time + 10 };
        }

        // 4. Siêu Sát Thương
        if (CFG.cheats.attackMultiplier > 1.0) {
            player.buffs = player.buffs || {};
            player.buffs.atk = { v: (CFG.cheats.attackMultiplier - 1.0), until: player.time + 10 };
        }

        // 5. Nam Châm Hút Đồ Rơi Toàn Bản Đồ
        if (CFG.cheats.globalMagnet) {
            player.buffs = player.buffs || {};
            player.buffs.magnet = { v: 999, until: player.time + 10 };

            if (G.drops?.bags?.length > 0) {
                for (const bag of [...G.drops.bags]) {
                    G.drops.pickupBag(bag);
                    stats.itemsLooted++;
                    updateStatUI();
                }
            }
        }

        // 6. Làm Sáng Hành Tinh Bóng Tối (Night Vision)
        if (CFG.cheats.brightShadow) {
            const darkEl = document.getElementById('dark2');
            if (darkEl && darkEl.style.display !== 'none') {
                darkEl.style.display = 'none';
            }
            if (G.scene?.fog) {
                G.scene.fog.near = 999;
                G.scene.fog.far = 9999;
            }
            if (G.planet && G.save?.planet === 'shadow') {
                G.planet.revealed = () => true;
                G.planet.inLight = () => true;
                player.buffs = player.buffs || {};
                player.buffs.light = { v: 1, until: player.time + 10 };
            }
        }
    }

    // --- MODULE 1: AUTO NÔNG TRẠI (FARMING) ---
    let lastFarmTick = 0;
    function runFarmEngine() {
        if (!CFG.farm.enabled || !G || !G.world || !G.save) return;
        if (Date.now() - lastFarmTick < 800) return;
        lastFarmTick = Date.now();

        const plots = G.world.plots || [];
        const player = G.player;
        if (!plots.length || !player || !player.alive) return;

        for (const plot of plots) {
            if (plot.crop) {
                if (CFG.farm.autoHarvest && plot.crop.stage >= 3 && !plot.crop.dead) {
                    if (typeof plot.harvest === 'function') {
                        plot.harvest(player);
                        stats.cropsHarvested++;
                        updateStatUI();
                    } else if (typeof G.interactPlot === 'function') {
                        G.interactPlot(plot);
                    }
                }
            } else if (CFG.farm.autoPlant) {
                let seedToPlant = getBestSeed();
                if (seedToPlant) {
                    if (typeof plot.plant === 'function') {
                        plot.plant(seedToPlant);
                        stats.seedsPlanted++;
                        updateStatUI();
                    }
                }
            }
        }
    }

    function getBestSeed() {
        if (!G || !G.bag || !G.save) return null;
        const slots = G.save.bag || [];
        for (const slot of slots) {
            if (slot && slot.id && slot.id.startsWith('seed_') && slot.n > 0) {
                return slot.id;
            }
        }
        return null;
    }

    // --- MODULE 2: AUTO NHIỆM VỤ & BOUNTY (100% LEGIT AN TOÀN ANTI-DETECTION) ---
    let lastQuestCheck = 0;
    function runQuestEngine() {
        if (!CFG.quests.enabled || !G || !G.quests || !G.save) return;
        if (Date.now() - lastQuestCheck < 2000) return;
        lastQuestCheck = Date.now();

        const q = G.quests;

        // 1. Nhận thưởng Nhiệm vụ Ngày khi đã đủ điều kiện
        if (CFG.quests.autoClaimDaily && q.s?.quests?.list) {
            q.s.quests.list.forEach((item, idx) => {
                if (item && item.p >= item.n && !item.done) {
                    q.claim?.(idx);
                    stats.questsClaimed++;
                    updateStatUI();
                }
            });
            if (q.s.quests.all && !q.s.quests.allDone) {
                q.claimAll?.();
            }
        }

        // 2. Nhận thưởng Nhiệm vụ Tuần khi đã đủ điều kiện
        if (CFG.quests.autoClaimWeekly && q.s?.week?.list) {
            q.s.week.list.forEach((item, idx) => {
                if (item && item.p >= item.n && !item.done) {
                    q.claimWeek?.(idx);
                    stats.questsClaimed++;
                    updateStatUI();
                }
            });
            if (q.s.week.p >= q.s.week.n && !q.s.week.done) {
                q.claimWeekChest?.();
            }
        }

        // 3. Nhận Lệnh Truy Nã (Bounty) khi đã hạ đủ quái
        if (CFG.quests.autoClaimBounty && q.s?.bounty) {
            const b = q.s.bounty;
            if (b.p >= b.n && !b.claimed) {
                q.claimBounty?.();
                stats.questsClaimed++;
                updateStatUI();
            }
        }

        // 4. Nhận thưởng Hành trình (Story)
        if (CFG.quests.autoClaimStory && q.s?.story) {
            const s = q.s.story;
            if (s.p >= s.n && !s.claimed) {
                q.claimStory?.();
                stats.questsClaimed++;
                updateStatUI();
            }
        }

        // 5. Nhận Quà Thẻ Sao (Pass) khi đủ mốc sao
        if (CFG.quests.autoClaimPass && G.save?.pass) {
            const p = G.save.pass;
            const currentTier = Math.floor((+p.stars || 0) / 50);
            p.got = p.got || [];
            for (let i = 0; i < currentTier; i++) {
                if (!p.got.includes(i)) {
                    G.act?.({ t: 'pass', i: i });
                }
            }
        }
    }

    // --- MODULE 3: AUTO CHIẾN ĐẤU & SĂN BOSS (COMBAT ENGINE) ---
    const TITAN_BOSS_PREFIXES = ['titan_hydra', 'titan_turtle', 'titan_spider', 'titan_scorpion', 'titan_frostqueen'];
    let lastAttackTick = 0;

    function runCombatEngine() {
        if (!CFG.combat.enabled || !G || !G.enemies || !G.player || !G.player.alive) return;
        if (Date.now() - lastAttackTick < 100) return;
        lastAttackTick = Date.now();

        const player = G.player;
        const enemies = G.enemies.list || [];
        if (!enemies.length) return;

        let target = null;
        let minDist = CFG.combat.searchRadius;

        for (const enemy of enemies) {
            if (!enemy.alive || enemy.state === 'dead' || enemy.home) continue;

            if (CFG.combat.skipTitans && isTitanBoss(enemy)) continue;

            const dist = Math.hypot(player.pos.x - enemy.pos.x, player.pos.z - enemy.pos.z);
            if (dist < minDist) {
                minDist = dist;
                target = enemy;
            }
        }

        if (target) {
            const dist = Math.hypot(player.pos.x - target.pos.x, player.pos.z - target.pos.z);

            if (dist > 2.0) {
                player.moveTo(target.pos);
            } else {
                player.facing = Math.atan2(target.pos.x - player.pos.x, target.pos.z - player.pos.z);

                if (CFG.combat.useSkills) {
                    player.useSkill('spin');
                    player.useSkill('dash');
                    player.useSkill('slam');
                    player.useSkill('special');
                }

                if (typeof player.attack === 'function') {
                    player.attack();
                } else if (typeof G.playerAttack === 'function') {
                    G.playerAttack();
                }
            }
        }
    }

    function isTitanBoss(enemy) {
        if (!enemy || !enemy.type) return false;
        return TITAN_BOSS_PREFIXES.some(p => enemy.type.startsWith(p)) || (enemy.hp && enemy.hp > 1500 && enemy.boss);
    }

    // --- MODULE 4: AUTO DU HÀNH SĂN BOSS XUYÊN HÀNH TINH (PLANET HOPPER) ---
    const PLANET_ORDER = ['home', 'toy', 'candy', 'jungle', 'ice', 'ocean', 'lava', 'sky', 'shadow'];
    let hopperState = {
        waitingForLoot: false,
        lootTimer: 0,
        targetPlanet: null
    };

    function runPlanetBossHopper() {
        if (!CFG.boss.autoHopPlanets || !G || !G.save || !G.enemies || !G.player) return;

        const currentPlanet = G.save.planet || 'home';
        const enemies = G.enemies.list || [];

        const hasActiveBoss = enemies.some(e => e.alive && e.boss && (!CFG.boss.skipTitans || !isTitanBoss(e)));

        if (!hasActiveBoss && !hopperState.waitingForLoot) {
            hopperState.waitingForLoot = true;
            hopperState.lootTimer = Date.now() + (CFG.boss.hopDelay * 1000);

            const nextIndex = (PLANET_ORDER.indexOf(currentPlanet) + 1) % PLANET_ORDER.length;
            hopperState.targetPlanet = PLANET_ORDER[nextIndex];
            updateHopperStatusUI(`Đang chờ hút đồ -> Bay tới <b>${hopperState.targetPlanet}</b> (${CFG.boss.hopDelay}s)`);
        }

        if (hopperState.waitingForLoot && Date.now() >= hopperState.lootTimer) {
            hopperState.waitingForLoot = false;
            if (hopperState.targetPlanet && hopperState.targetPlanet !== currentPlanet) {
                travelToPlanet(hopperState.targetPlanet);
            }
        }
    }

    async function travelToPlanet(targetPlanet) {
        if (!G || !G.save) return;
        G.save.planet = targetPlanet;
        sessionStorage.setItem('zp-flight', JSON.stringify({ to: targetPlanet, t: Date.now() }));
        sessionStorage.setItem('zp-target-planet', JSON.stringify({ to: targetPlanet, t: Date.now() }));

        try {
            if (G.cloud?.flushNow) await G.cloud.flushNow();
            if (G.persist) G.persist();
        } catch (_) {}

        location.href = location.pathname;
    }

    // --- MODULE 5: AUTO CÂU CÁ (HỖ TRỢ MỌI HÀNH TINH & ĐẠI DƯƠNG) ---
    let fishCastCooldown = 0;
    let fishNavigating = false;

    function runFishingEngine() {
        if (!CFG.fish.enabled || !G || !G.fishing || !G.player || !G.player.alive) return;

        const fishing = G.fishing;
        const player = G.player;

        if (fishing.active) {
            fishNavigating = false;
            fishCastCooldown = Date.now() + 1500;

            if (CFG.cheats.ultraFishing) {
                if (fishing.phase === 'wait' || fishing.phase === 'cast' || fishing.phase === 'nibble' || fishing.phase === 'approach') {
                    const targetFish = (fishing.fish && fishing.fish.length > 0) ? fishing.fish[0] : (typeof fishing.addFish === 'function' && fishing.w ? fishing.addFish(fishing.w) : null);
                    if (targetFish && typeof fishing.startBite === 'function') {
                        fishing.interest = targetFish;
                        fishing.startBite(targetFish);
                    }
                }
                if (fishing.phase === 'bite') {
                    if (typeof fishing.hook === 'function') fishing.hook();
                }
                if (fishing.phase === 'hooked') {
                    fishing.progress = 1;
                    if (fishing.interest && typeof fishing.finish === 'function') {
                        fishing.finish(true);
                        stats.fishCount++;
                        updateStatUI();
                    }
                }
                return;
            }

            if (fishing.phase === 'bite') {
                if (typeof fishing.hook === 'function') fishing.hook();
            } else if (fishing.phase === 'hooked') {
                if (CFG.fish.mode === 'perfect') {
                    if (fishing.tension > 0.68) {
                        if (typeof fishing.release === 'function') fishing.release();
                    } else if (fishing.tension < 0.42) {
                        if (typeof fishing.press === 'function') fishing.press();
                    }
                } else {
                    fishing.progress = 1;
                    if (fishing.interest && typeof fishing.finish === 'function') {
                        fishing.finish(true);
                        stats.fishCount++;
                        updateStatUI();
                    }
                }
            }
            return;
        }

        if (Date.now() < fishCastCooldown) return;

        const waters = G.world?.waters || [];
        if (!waters.length) return;

        let nearestWater = null;
        let minDist = 999999;

        for (const w of waters) {
            const dist = Math.hypot(player.pos.x - w.x, player.pos.z - w.z);
            if (dist < minDist) {
                minDist = dist;
                nearestWater = w;
            }
        }

        if (nearestWater) {
            if (CFG.fish.autoEquipRod && G.save?.equip?.weapon?.kind !== 'rod') {
                autoEquipRodFromBag();
            }

            const targetVec = new player.pos.constructor(nearestWater.x, 0, nearestWater.z);
            let plan = null;
            if (typeof fishing.plan === 'function') {
                try {
                    plan = fishing.plan(nearestWater, targetVec);
                } catch (_) {}
            }

            const shorePos = plan?.shore || new player.pos.constructor(
                nearestWater.x + (player.pos.x - nearestWater.x) * 0.8,
                0,
                nearestWater.z + (player.pos.z - nearestWater.z) * 0.8
            );
            const castPos = plan?.cast || targetVec;

            const distToShore = Math.hypot(player.pos.x - shorePos.x, player.pos.z - shorePos.z);

            if (distToShore > 2.5) {
                if (!fishNavigating) {
                    fishNavigating = true;
                    player.moveTo(shorePos);
                }
                return;
            }

            fishNavigating = false;
            if (player.target?.type === 'move') {
                player.target = null;
            }

            try {
                fishing.start(nearestWater, castPos);
                fishCastCooldown = Date.now() + 1200;
            } catch (err) {
                console.warn('[ZooPet Auto] Fishing start fallback', err);
            }
        }
    }

    function autoEquipRodFromBag() {
        if (!G || !G.save?.bag) return;
        const slots = G.save.bag;
        for (let i = 0; i < slots.length; i++) {
            const s = slots[i];
            if (s && (s.id.startsWith('rod_') || s.id === 'rod')) {
                G.act?.({ t: 'equip', i: i });
                break;
            }
        }
    }

    // --- MASTER TICK LOOP ---
    function masterTick() {
        runCheatsEngine();
        runFarmEngine();
        runQuestEngine();
        runCombatEngine();
        runPlanetBossHopper();
        runFishingEngine();
    }

    // --- GIAO DIỆN ĐIỀU KHIỂN (WHITE-BLUE MODERN UI) ---
    function createUI() {
        if (document.getElementById('zp-auto-panel')) return;
        if (!document.body) {
            setTimeout(createUI, 100);
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'zp-auto-panel';
        panel.innerHTML = `
            <style>
                #zp-auto-panel {
                    position: fixed;
                    top: 60px;
                    right: 20px;
                    width: 360px;
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    font-size: 13px;
                    color: #1E293B;
                    z-index: 999999;
                    overflow: hidden;
                    user-select: none;
                }
                .zp-header {
                    background: #F8FAFC;
                    border-bottom: 1px solid #E2E8F0;
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: move;
                }
                .zp-title {
                    font-weight: 700;
                    font-size: 14px;
                    color: #0284C7;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .zp-status-badge {
                    background: #FEF3C7;
                    color: #92400E;
                    font-size: 10px;
                    font-weight: 600;
                    padding: 2px 6px;
                    border-radius: 9999px;
                }
                .zp-tabs {
                    display: flex;
                    background: #F1F5F9;
                    padding: 4px;
                    gap: 4px;
                    border-bottom: 1px solid #E2E8F0;
                    overflow-x: auto;
                }
                .zp-tab {
                    flex: 1;
                    text-align: center;
                    padding: 6px 4px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #64748B;
                    border-radius: 8px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .zp-tab.active {
                    background: #FFFFFF;
                    color: #0284C7;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .zp-body {
                    padding: 14px;
                    max-height: 420px;
                    overflow-y: auto;
                }
                .zp-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #F1F5F9;
                }
                .zp-row:last-child {
                    border-bottom: none;
                }
                .zp-label {
                    font-weight: 500;
                    color: #334155;
                    font-size: 12px;
                }
                .zp-desc {
                    font-size: 11px;
                    color: #94A3B8;
                    margin-top: 1px;
                }
                .zp-switch {
                    position: relative;
                    display: inline-block;
                    width: 36px;
                    height: 20px;
                }
                .zp-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .zp-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #CBD5E1;
                    transition: .3s;
                    border-radius: 20px;
                }
                .zp-slider:before {
                    position: absolute;
                    content: "";
                    height: 14px;
                    width: 14px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                input:checked + .zp-slider {
                    background-color: #0284C7;
                }
                input:checked + .zp-slider:before {
                    transform: translateX(16px);
                }
                .zp-btn {
                    width: 100%;
                    padding: 9px 12px;
                    border-radius: 10px;
                    border: none;
                    background: #0284C7;
                    color: #FFFFFF;
                    font-weight: 600;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .zp-btn:hover {
                    background: #0369A1;
                }
                .zp-select {
                    padding: 4px 8px;
                    border-radius: 8px;
                    border: 1px solid #CBD5E1;
                    background: #FFFFFF;
                    color: #334155;
                    font-size: 11px;
                    outline: none;
                }
                .zp-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #E2E8F0;
                }
                .zp-stat-card {
                    background: #F8FAFC;
                    padding: 8px;
                    border-radius: 10px;
                    text-align: center;
                }
                .zp-stat-val {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0284C7;
                }
                .zp-stat-lbl {
                    font-size: 10px;
                    color: #64748B;
                }
                #zp-toggle-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #0284C7;
                    color: white;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 999998;
                    transition: transform 0.2s;
                }
                #zp-toggle-btn:hover {
                    transform: scale(1.08);
                }
            </style>

            <div class="zp-header" id="zp-drag-handle">
                <div class="zp-title">
                    🐾 Zoo Pet Auto <span class="zp-status-badge">🟡 Đang kết nối...</span>
                </div>
                <div style="cursor:pointer;color:#94A3B8;font-size:16px;" id="zp-close-btn">✕</div>
            </div>

            <div class="zp-tabs">
                <div class="zp-tab active" data-tab="cheats">👑 Mod VIP</div>
                <div class="zp-tab" data-tab="boss">🚀 Săn Boss</div>
                <div class="zp-tab" data-tab="farm">🌾 Nông Trại</div>
                <div class="zp-tab" data-tab="quests">📜 Nhiệm Vụ</div>
                <div class="zp-tab" data-tab="fish">🎣 Câu Cá</div>
            </div>

            <div class="zp-body">
                <!-- TAB CHEATS -->
                <div class="zp-tab-content" id="tab-cheats">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⚡ Hồi chiêu 0s (No Cooldown)</div>
                            <div class="zp-desc">Xả 4 chiêu Q-W-E-R và chong chóng liên tục</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-no-cd" ${CFG.cheats.noCooldown ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🛡️ Bất tử (God Mode)</div>
                            <div class="zp-desc">Khóa 100% máu, kháng mọi khống chế & thiêu đốt</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-godmode" ${CFG.cheats.godMode ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">💡 Sáng Hành Tinh Bóng Tối</div>
                            <div class="zp-desc">Ẩn màn đen, tắt sương mù & hiển thị 100% quái</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-bright-shadow" ${CFG.cheats.brightShadow ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🧲 Nam châm hút đồ toàn map</div>
                            <div class="zp-desc">Hút sạch đồ rơi, trang bị & hũ đồ khắp bản đồ</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-magnet" ${CFG.cheats.globalMagnet ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🏃 Tốc độ di chuyển</div>
                            <div class="zp-desc">Hệ số tốc độ chạy nhân vật</div>
                        </div>
                        <select class="zp-select" id="cfg-speed">
                            <option value="1.0" ${CFG.cheats.speedBoost === 1.0 ? 'selected' : ''}>1.0x (Chuẩn)</option>
                            <option value="1.5" ${CFG.cheats.speedBoost === 1.5 ? 'selected' : ''}>1.5x (Nhanh)</option>
                            <option value="2.0" ${CFG.cheats.speedBoost === 2.0 ? 'selected' : ''}>2.0x (Siêu tốc)</option>
                            <option value="2.5" ${CFG.cheats.speedBoost === 2.5 ? 'selected' : ''}>2.5x (Cực đại)</option>
                        </select>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⚔️ Hệ số sát thương</div>
                            <div class="zp-desc">Tăng lực công đòn đánh & chiêu thức</div>
                        </div>
                        <select class="zp-select" id="cfg-atk">
                            <option value="1.0" ${CFG.cheats.attackMultiplier === 1.0 ? 'selected' : ''}>1.0x (Chuẩn)</option>
                            <option value="2.0" ${CFG.cheats.attackMultiplier === 2.0 ? 'selected' : ''}>2.0x (+100%)</option>
                            <option value="3.0" ${CFG.cheats.attackMultiplier === 3.0 ? 'selected' : ''}>3.0x (+200%)</option>
                            <option value="5.0" ${CFG.cheats.attackMultiplier === 5.0 ? 'selected' : ''}>5.0x (One-Hit)</option>
                        </select>
                    </div>
                </div>

                <!-- TAB BOSS -->
                <div class="zp-tab-content" id="tab-boss" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⚔️ Tự động săn Boss & Quái</div>
                            <div class="zp-desc">Tự tìm và tung combo kỹ năng diệt mục tiêu</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-combat-en" ${CFG.combat.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🛡️ Bỏ qua Boss Titan</div>
                            <div class="zp-desc">Bỏ qua Titan Rùa núi, Mãng xà, Bọ cạp (>1500 HP)</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-skip-titans" ${CFG.combat.skipTitans ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🚀 Du hành săn Boss đa hành tinh</div>
                            <div class="zp-desc">Tự bay sang hành tinh kế tiếp sau khi diệt xong Boss</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-boss-hop" ${CFG.boss.autoHopPlanets ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div id="zp-hopper-status" style="margin-top:8px;padding:8px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;font-size:11px;color:#166534;display:none;">
                        🚀 Đang săn Boss hành tinh...
                    </div>
                </div>

                <!-- TAB FARM -->
                <div class="zp-tab-content" id="tab-farm" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🌾 Tự động thu hoạch cây</div>
                            <div class="zp-desc">Thu hoạch ngay khi cây trồng vừa chín</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-harvest" ${CFG.farm.autoHarvest ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🌱 Tự động gieo hạt giống</div>
                            <div class="zp-desc">Tự chọn hạt giống có trong túi để gieo</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-plant" ${CFG.farm.autoPlant ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB QUESTS -->
                <div class="zp-tab-content" id="tab-quests" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">📜 Tự động nhận thưởng nhiệm vụ</div>
                            <div class="zp-desc">Nhận quà Nhiệm Vụ Ngày, Tuần, Bounty, Story khi đủ</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-quest-en" ${CFG.quests.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🎯 Tự động nhận Lệnh Truy Nã</div>
                            <div class="zp-desc">Tự nộp Bounty khi săn đủ số quái yêu cầu</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-bounty-claim" ${CFG.quests.autoClaimBounty ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⭐ Tự nhận Thẻ Sao (Star Pass)</div>
                            <div class="zp-desc">Tự mở rương bậc sao khi đủ điểm tích lũy</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-pass-claim" ${CFG.quests.autoClaimPass ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB FISH -->
                <div class="zp-tab-content" id="tab-fish" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🎣 Tự động câu cá</div>
                            <div class="zp-desc">Tự đi tới hồ/rạn san hô Đại Dương và câu</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-en" ${CFG.fish.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⚡ Câu cá siêu tốc (0.1s)</div>
                            <div class="zp-desc">Cá cắn câu tức thì & kéo lên ngay lập tức</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-ultra" ${CFG.cheats.ultraFishing ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- THỐNG KÊ HOẠT ĐỘNG -->
                <div class="zp-stats">
                    <div class="zp-stat-card">
                        <div class="zp-stat-val" id="stat-crops">0</div>
                        <div class="zp-stat-lbl">Nông sản thu hoạch</div>
                    </div>
                    <div class="zp-stat-card">
                        <div class="zp-stat-val" id="stat-kills">0</div>
                        <div class="zp-stat-lbl">Quái đã hạ gục</div>
                    </div>
                    <div class="zp-stat-card">
                        <div class="zp-stat-val" id="stat-quests">0</div>
                        <div class="zp-stat-lbl">Nhiệm vụ nhận</div>
                    </div>
                    <div class="zp-stat-card">
                        <div class="zp-stat-val" id="stat-fish">0</div>
                        <div class="zp-stat-lbl">Cá câu được</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'zp-toggle-btn';
        toggleBtn.innerHTML = '🤖';
        toggleBtn.title = 'Bật/Tắt Menu Zoo Pet Auto (F2)';
        toggleBtn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(toggleBtn);

        bindUIEvents(panel);
    }

    function bindUIEvents(panel) {
        panel.querySelectorAll('.zp-tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.zp-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.zp-tab-content').forEach(c => c.style.display = 'none');
                tab.classList.add('active');
                const target = tab.dataset.tab;
                const content = panel.querySelector(`#tab-${target}`);
                if (content) content.style.display = 'block';
            };
        });

        panel.querySelector('#zp-close-btn').onclick = () => {
            panel.style.display = 'none';
        };

        window.addEventListener('keydown', e => {
            if (e.key === 'F2') {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });

        const handle = panel.querySelector('#zp-drag-handle');
        let isDragging = false, dragX = 0, dragY = 0;
        handle.onmousedown = e => {
            isDragging = true;
            dragX = e.clientX - panel.offsetLeft;
            dragY = e.clientY - panel.offsetTop;
            document.onmousemove = e => {
                if (!isDragging) return;
                panel.style.left = (e.clientX - dragX) + 'px';
                panel.style.top = (e.clientY - dragY) + 'px';
                panel.style.right = 'auto';
            };
            document.onmouseup = () => { isDragging = false; document.onmousemove = null; };
        };

        const bind = (id, obj, key, type = 'check') => {
            const el = panel.querySelector(id);
            if (!el) return;
            el.onchange = () => {
                obj[key] = type === 'check' ? el.checked : (type === 'num' ? parseFloat(el.value) : el.value);
                saveConfig();
            };
        };

        bind('#cfg-no-cd', CFG.cheats, 'noCooldown');
        bind('#cfg-godmode', CFG.cheats, 'godMode');
        bind('#cfg-bright-shadow', CFG.cheats, 'brightShadow');
        bind('#cfg-magnet', CFG.cheats, 'globalMagnet');
        bind('#cfg-speed', CFG.cheats, 'speedBoost', 'num');
        bind('#cfg-atk', CFG.cheats, 'attackMultiplier', 'num');

        bind('#cfg-combat-en', CFG.combat, 'enabled');
        bind('#cfg-skip-titans', CFG.combat, 'skipTitans');
        bind('#cfg-boss-hop', CFG.boss, 'autoHopPlanets');

        bind('#cfg-farm-harvest', CFG.farm, 'autoHarvest');
        bind('#cfg-farm-plant', CFG.farm, 'autoPlant');

        bind('#cfg-quest-en', CFG.quests, 'enabled');
        bind('#cfg-bounty-claim', CFG.quests, 'autoClaimBounty');
        bind('#cfg-pass-claim', CFG.quests, 'autoClaimPass');

        bind('#cfg-fish-en', CFG.fish, 'enabled');
        bind('#cfg-fish-ultra', CFG.cheats, 'ultraFishing');
    }

    function updateStatUI() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setVal('stat-crops', stats.cropsHarvested);
        setVal('stat-kills', stats.monstersKilled);
        setVal('stat-quests', stats.questsClaimed);
        setVal('stat-fish', stats.fishCount);
    }

    function updateHopperStatusUI(text) {
        const el = document.getElementById('zp-hopper-status');
        if (el) {
            el.style.display = 'block';
            el.innerHTML = text;
        }
    }

    // --- KHỞI TẠO GIAO DIỆN NGAY KHI TRANG TẢI ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createUI();
            initBackgroundWorker();
        });
    } else {
        createUI();
        initBackgroundWorker();
    }

})();
