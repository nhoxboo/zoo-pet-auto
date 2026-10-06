// ==UserScript==
// @name         Zoo Pet - All-in-One Auto Pro Tool
// @namespace    https://zoo-pet.store/
// @version      2.2.1
// @description  Tool Auto toàn diện cho Zoo Pet (zoo-pet.store): Auto Nông trại, Auto Câu cá Chuẩn xác/Instant (Hỗ trợ Đại Dương & Mọi map), Auto Săn Boss Xuyên Hành Tinh cày cấp, Lọc Boss Titan, Tự làm & Nhận thưởng Nhiệm vụ/Bounty, Auto Chạy ngầm khi Hạ Tab.
// @author       Antigravity & Nam Pro
// @match        https://zoo-pet.store/*
// @match        http://zoo-pet.store/*
// @match        https://*.cloudfront.net/*
// @updateURL    https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js
// @downloadURL  https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log('%c🐾 [Zoo Pet Auto Pro v2.2.1] Đang khởi tạo...', 'color: #0284c7; font-size: 16px; font-weight: bold;');

    // ==========================================
    // 0. BẢO VỆ CHẠY ẨN NỀN KHI HẠ TAB (ANTI-THROTTLE)
    // ==========================================
    try {
        // Đánh lừa trình duyệt để tab luôn ở trạng thái visible
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', e => e.stopImmediatePropagation(), true);
    } catch (e) {
        console.warn('[Zoo Pet Auto] Visibility override warning:', e);
    }

    // Web Worker Timer để duy trì nhịp tick 100ms khi người dùng ẩn/hạ tab
    try {
        const workerBlob = new Blob([`
            let timer = null;
            self.onmessage = function(e) {
                if (e.data === 'start') {
                    if (!timer) {
                        timer = setInterval(function() {
                            self.postMessage('tick');
                        }, 100);
                    }
                } else if (e.data === 'stop') {
                    if (timer) {
                        clearInterval(timer);
                        timer = null;
                    }
                }
            };
        `], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(workerBlob);
        const bgWorker = new Worker(workerUrl);
        bgWorker.postMessage('start');
        bgWorker.onmessage = function (e) {
            if (e.data === 'tick') {
                if (typeof window.__zp_bg_tick === 'function') {
                    window.__zp_bg_tick();
                }
            }
        };
    } catch (e) {
        console.warn('[Zoo Pet Auto] Background worker timer fallback:', e);
    }

    // ==========================================
    // 1. ENGINE HOOK & GAME DETECTION
    // ==========================================
    try {
        const origTest = RegExp.prototype.test;
        RegExp.prototype.test = function (str) {
            if (this.source && (this.source.includes('localhost') || this.source.includes('127.0.0.1'))) {
                return true;
            }
            return origTest.apply(this, arguments);
        };
    } catch (e) {
        console.warn('[Zoo Pet Auto] RegExp hook warning:', e);
    }

    let G = null;

    function getGameInstance() {
        if (window.game && window.game.player) return window.game;
        if (window.$ && window.$.player) return window.$;
        return null;
    }

    // ==========================================
    // 2. CẤU HÌNH AUTO (CONFIG & SETTINGS)
    // ==========================================
    const STORAGE_KEY = 'zp_auto_pro_cfg_v22';
    const DEFAULT_CFG = {
        enabled: true,

        // 🚀 SĂN BOSS & DU HÀNH XUYÊN HÀNH TINH
        bossHopper: {
            enabled: false,
            waitLootSeconds: 6,
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

        // 🎯 BỘ LỌC BOSS (TRÁNH TITAN & BOSS QUÁ MẠNH)
        bossFilter: {
            ignoreTitans: true,        // Tự động bỏ qua Boss Titan
            ignoreSuperBoss: true,     // Bỏ qua Boss Thế Giới
            minHpPercent: 30,          // Mức máu tối thiểu để né tránh hồi phục
            customSelect: {
                // Boss thường theo từng hành tinh
                bear: true,            // Mầm Xanh (HP 400)
                boar: true,            // Mầm Xanh (HP 300)
                robot: true,           // Đồ Chơi (HP 800)
                cake: true,            // Kẹo Ngọt (HP 900)
                gingerbread: true,     // Kẹo Ngọt (HP 850)
                jellyqueen: true,      // Kẹo Ngọt (HP 950)
                gorilla: true,         // Rừng Rậm (HP 1000)
                yeti: true,            // Băng Giá (HP 1100)
                mammoth: true,         // Băng Giá (HP 1200)
                frostowl: true,        // Băng Giá (HP 1050)
                leviathan: true,       // Đại Dương (HP 1300)
                golem: true,           // Dung Nham (HP 1400)
                dragon: true,          // Dung Nham (HP 1500)
                phoenix: true,         // Mây Trời (HP 1600)
                shadowlord: true,      // Bóng Tối (HP 1800)

                // Boss Titan (Mặc định tắt để tránh bị hạ gục)
                titan_turtle: false,   // Rùa Núi (HP 1500)
                titan_hydra: false,    // Mãng Xà 3 Đầu (HP 1600)
                titan_clock: false,    // Nhện Đồng Hồ (HP 1500)
                titan_flower: false,   // Hoa Tử Thần (HP 1650)
                titan_crystal: false,  // Nữ Vương Băng (HP 1700)
                titan_kraken: false,   // Kraken Vực Thẳm (HP 1750)
                titan_scorpion: false, // Bọ Cạp Hỏa Ngục (HP 1800)
                titan_whale: false     // Cá Voi Mây (HP 1850)
            }
        },

        // 📜 TỰ LÀM & NHẬN THƯỞNG NHIỆM VỤ
        quests: {
            autoClaimDaily: true,
            autoClaimWeekly: true,
            autoClaimBounty: true,
            autoClaimStory: true,
            autoClaimPass: true
        },

        // 🌾 NÔNG TRẠI
        farm: {
            harvest: true,
            plant: true,
            selectedCrop: 'auto',
            collectAnimals: true,
            waterCrop: true
        },

        // 🎣 CÂU CÁ
        fish: {
            enabled: false,
            mode: 'perfect', // 'perfect' hoặc 'instant'
            autoRecast: true
        },

        // ⚔️ COMBAT THƯỜNG
        combat: {
            enabled: false,
            targetMode: 'all', // 'all', 'monsters_only', 'boss_only'
            autoApproach: true,
            comboSkills: true,
            skillQ: true,
            skillW: true,
            skillE: true,
            skillR: true,
            attackRadius: 35
        },

        // 🎁 TIỆN ÍCH & LOOT
        utils: {
            magnetLoot: true,
            lootRadius: 40,
            autoRevive: true,
            speedHack: false,
            speedMultiplier: 1.35
        },

        // 👥 BẠN BÈ
        social: {
            autoWaterFriend: true,
            autoStealFriend: false
        },

        // UI
        pos: { top: 65, right: 20 }
    };

    let CFG = loadConfig();

    function loadConfig() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return deepMerge(JSON.parse(JSON.stringify(DEFAULT_CFG)), JSON.parse(raw));
        } catch (e) {}
        return JSON.parse(JSON.stringify(DEFAULT_CFG));
    }

    function saveConfig() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(CFG));
        } catch (e) {}
    }

    function deepMerge(target, source) {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    const stats = {
        harvestCount: 0,
        fishCount: 0,
        bossesKilled: 0,
        mobsKilled: 0,
        itemsLooted: 0,
        petProducts: 0,
        questsClaimed: 0,
        planetsVisited: 0
    };

    // ==========================================
    // 3. METADATA HÀNH TINH & BOSS
    // ==========================================
    const PLANETS = {
        home: { name: 'Mầm Xanh', lvl: 1, icon: '🌱' },
        toy: { name: 'Đồ Chơi', lvl: 4, icon: '🧸' },
        candy: { name: 'Kẹo Ngọt', lvl: 6, icon: '🍭' },
        jungle: { name: 'Rừng Rậm', lvl: 8, icon: '🌿' },
        ice: { name: 'Băng Giá', lvl: 10, icon: '❄️' },
        ocean: { name: 'Đại Dương', lvl: 12, icon: '🌊' },
        lava: { name: 'Dung Nham', lvl: 14, icon: '🌋' },
        sky: { name: 'Mây Trời', lvl: 16, icon: '☁️' },
        shadow: { name: 'Bóng Tối', lvl: 18, icon: '🌑' }
    };

    const BOSS_METADATA = [
        { id: 'bear', name: 'Gấu Vua', planet: 'home', hp: 400, titan: false },
        { id: 'boar', name: 'Heo Rừng Cường Bạo', planet: 'home', hp: 300, titan: false },
        { id: 'robot', name: 'Robot Cơ Khí', planet: 'toy', hp: 800, titan: false },
        { id: 'cake', name: 'Bánh Kem Khổng Lồ', planet: 'candy', hp: 900, titan: false },
        { id: 'gingerbread', name: 'Người Gừng Đột Biến', planet: 'candy', hp: 850, titan: false },
        { id: 'jellyqueen', name: 'Nữ Hoàng Thạch', planet: 'candy', hp: 950, titan: false },
        { id: 'gorilla', name: 'Vượn Cổ Đại', planet: 'jungle', hp: 1000, titan: false },
        { id: 'yeti', name: 'Người Tuyết Yeti', planet: 'ice', hp: 1100, titan: false },
        { id: 'mammoth', name: 'Voi Ma Mút', planet: 'ice', hp: 1200, titan: false },
        { id: 'frostowl', name: 'Cú Băng Tinh', planet: 'ice', hp: 1050, titan: false },
        { id: 'leviathan', name: 'Thủy Quái Leviathan', planet: 'ocean', hp: 1300, titan: false },
        { id: 'golem', name: 'Người Đá Dung Nham', planet: 'lava', hp: 1400, titan: false },
        { id: 'dragon', name: 'Hỏa Long Dung Nham', planet: 'lava', hp: 1500, titan: false },
        { id: 'phoenix', name: 'Phượng Hoàng Lửa', planet: 'sky', hp: 1600, titan: false },
        { id: 'shadowlord', name: 'Chúa Tể Bóng Tối', planet: 'shadow', hp: 1800, titan: false },

        // TITAN BOSSES
        { id: 'titan_turtle', name: 'Rùa Núi Cổ Đại (Titan)', planet: 'home', hp: 1500, titan: true },
        { id: 'titan_hydra', name: 'Mãng Xà 3 Đầu (Titan)', planet: 'candy', hp: 1600, titan: true },
        { id: 'titan_clock', name: 'Nhện Đồng Hồ (Titan)', planet: 'toy', hp: 1500, titan: true },
        { id: 'titan_flower', name: 'Hoa Tử Thần (Titan)', planet: 'jungle', hp: 1650, titan: true },
        { id: 'titan_crystal', name: 'Nữ Vương Băng Tinh (Titan)', planet: 'ice', hp: 1700, titan: true },
        { id: 'titan_kraken', name: 'Kraken Vực Thẳm (Titan)', planet: 'ocean', hp: 1750, titan: true },
        { id: 'titan_scorpion', name: 'Bọ Cạp Hỏa Ngục (Titan)', planet: 'lava', hp: 1800, titan: true },
        { id: 'titan_whale', name: 'Cá Voi Thiên Không (Titan)', planet: 'sky', hp: 1850, titan: true }
    ];

    const CROPS = [
        { id: 'auto', name: '🌟 Tốt nhất theo Cấp' },
        { id: 'goldcorn', name: 'Ngô Vàng (Lv13)', lvl: 13 },
        { id: 'clover', name: 'Cỏ 4 Lá (Lv10)', lvl: 10 },
        { id: 'melon', name: 'Dưa Cầu Vồng (Lv9)', lvl: 9 },
        { id: 'moonflower', name: 'Hoa Trăng Rằm (Lv8)', lvl: 8 },
        { id: 'coffee', name: 'Cà Phê (Lv7)', lvl: 7 },
        { id: 'star', name: 'Nấm Sao (Lv6)', lvl: 6 },
        { id: 'berry', name: 'Dâu Tiên (Lv6)', lvl: 6 },
        { id: 'bean', name: 'Đậu Thần (Lv5)', lvl: 5 },
        { id: 'candy', name: 'Hoa Kẹo (Lv4)', lvl: 4 },
        { id: 'chili', name: 'Ớt Rồng Lửa (Lv4)', lvl: 4 },
        { id: 'mint', name: 'Bạc Hà (Lv3)', lvl: 3 },
        { id: 'pumpkin', name: 'Bí Ngô (Lv2)', lvl: 2 },
        { id: 'carrot', name: 'Cà Rốt (Lv1)', lvl: 1 },
        { id: 'radish', name: 'Củ Cải (Lv1)', lvl: 1 }
    ];

    // ==========================================
    // 4. CÁC MODULE LOGIC CHÍNH
    // ==========================================

    // --- MODULE 1: DU HÀNH & SĂN BOSS XUYÊN HÀNH TINH ---
    let lastBossClearedTime = 0;
    let isHoppingPlanet = false;

    async function travelToPlanet(targetPlanet) {
        if (!G || !G.save || isHoppingPlanet) return;
        isHoppingPlanet = true;

        console.log(`[Zoo Pet Auto] 🚀 Du hành tới hành tinh: ${targetPlanet}`);
        try {
            sessionStorage.setItem('zp-flight', JSON.stringify({ to: targetPlanet, t: Date.now() }));
        } catch (e) {}

        G.save.planet = targetPlanet;
        if (typeof G.persist === 'function') G.persist();
        if (G.ui?.toast) G.ui.toast(`🚀 Đang chuyển tới <b>${PLANETS[targetPlanet]?.name || targetPlanet}</b>...`, 3);

        if (G.cloud?.flushNow) {
            try { await G.cloud.flushNow(); } catch (e) {}
        }
        G.noSave = true;
        location.href = location.pathname;
    }

    function isBossValidTarget(m) {
        if (!m || !m.alive || m.hp <= 0) return false;
        const isBoss = !!(m.boss || m.def?.boss || m.def?.titan || m.def?.sboss);
        if (!isBoss) return false;

        const isTitan = !!m.def?.titan;
        const isSuperBoss = !!m.def?.sboss;

        if (isTitan && CFG.bossFilter.ignoreTitans) return false;
        if (isSuperBoss && CFG.bossFilter.ignoreSuperBoss) return false;

        const bType = m.type || m.def?.id;
        if (bType && CFG.bossFilter.customSelect[bType] === false) return false;

        return true;
    }

    function runPlanetBossHopper() {
        if (!CFG.bossHopper.enabled || !G || !G.player || isHoppingPlanet) return;

        const player = G.player;
        if (!player.alive || player.state === 'dead') return;

        const currentPlanet = G.world?.planet || G.save?.planet || 'home';
        const playerLvl = G.save?.lvl || 1;
        const enemiesList = G.enemies?.list || [];

        const aliveTargetBosses = enemiesList.filter(m => isBossValidTarget(m));

        const statusEl = document.getElementById('zp-boss-status');

        if (aliveTargetBosses.length > 0) {
            lastBossClearedTime = 0;
            const b = aliveTargetBosses[0];
            const bName = b.def?.name || b.type || 'Boss';
            const hpPercent = Math.round((b.hp / (b.maxHp || b.hp)) * 100);
            if (statusEl) {
                statusEl.innerHTML = `⚔️ Đang săn: <b>${bName}</b> (${hpPercent}% HP)`;
                statusEl.style.color = '#dc2626';
            }
            return;
        }

        // Không còn Boss hợp lệ trên hành tinh hiện tại
        if (statusEl) {
            statusEl.innerHTML = `✅ Đã diệt sạch Boss hành tinh này!`;
            statusEl.style.color = '#16a34a';
        }

        if (lastBossClearedTime === 0) {
            lastBossClearedTime = Date.now();
            stats.bossesKilled++;
            updateStatUI();
            return;
        }

        // Chờ thời gian nhặt đồ trước khi chuyển map
        const elapsed = (Date.now() - lastBossClearedTime) / 1000;
        if (elapsed < CFG.bossHopper.waitLootSeconds) {
            if (statusEl) {
                statusEl.innerHTML = `🧲 Đang nhặt đồ... Chuyển hành tinh sau: <b>${Math.ceil(CFG.bossHopper.waitLootSeconds - elapsed)}s</b>`;
                statusEl.style.color = '#0284c7';
            }
            return;
        }

        // Chọn hành tinh kế tiếp đã mở khóa
        const planetKeys = ['toy', 'candy', 'jungle', 'ice', 'ocean', 'lava', 'sky', 'shadow', 'home'];
        const validPlanets = planetKeys.filter(p => CFG.bossHopper.planets[p] && playerLvl >= PLANET_DATA[p].lvl);

        if (validPlanets.length === 0) return;

        let nextIdx = validPlanets.indexOf(currentPlanet) + 1;
        if (nextIdx >= validPlanets.length || nextIdx < 0) nextIdx = 0;

        const nextPlanet = validPlanets[nextIdx];
        if (nextPlanet !== currentPlanet) {
            stats.planetsVisited++;
            lastBossClearedTime = 0;
            travelToPlanet(nextPlanet);
        }
    }

    // --- MODULE 2: COMBAT ENGINE (COMBO CHIÊU & NÉ ĐÒN) ---
    let lastCombatMove = 0;
    function runCombatEngine() {
        if (!G || !G.player || !G.enemies) return;
        const player = G.player;
        if (!player.alive || player.state === 'dead' || player.state === 'fish' || player.state === 'ship') return;

        const enemiesList = G.enemies.list || [];
        const aliveMobs = enemiesList.filter(m => m.alive && m.hp > 0);
        if (aliveMobs.length === 0) return;

        // 1. Kiểm tra an toàn máu
        const maxHp = player.maxHp || 100;
        const curHp = player.hp || 100;
        const hpPercent = (curHp / maxHp) * 100;

        if (hpPercent < CFG.bossFilter.minHpPercent) {
            const nearestThreat = aliveMobs.find(e => e.pos && e.pos.distanceTo(player.pos) < 10);
            if (nearestThreat) {
                const retreatDir = player.pos.clone().sub(nearestThreat.pos).normalize();
                player.pos.addScaledVector(retreatDir, 0.45);
                return;
            }
        }

        // 2. Lựa chọn mục tiêu
        let target = null;

        if (CFG.bossHopper.enabled) {
            target = aliveMobs.find(m => isBossValidTarget(m));
        } else if (CFG.combat.enabled) {
            if (CFG.combat.targetMode === 'boss_only') {
                target = aliveMobs.find(m => isBossValidTarget(m));
            } else if (CFG.combat.targetMode === 'monsters_only') {
                target = aliveMobs.find(m => !m.boss && !m.def?.titan && !m.def?.sboss);
            } else {
                target = aliveMobs.find(m => !m.def?.titan || !CFG.bossFilter.ignoreTitans);
            }
        }

        if (!target) return;

        const targetDist = player.pos.distanceTo(target.pos);

        // Hướng nhân vật về phía mục tiêu
        player.facing = Math.atan2(target.pos.x - player.pos.x, target.pos.z - player.pos.z);

        // Áp sát mục tiêu
        if (CFG.combat.autoApproach && targetDist > 2.8 && Date.now() - lastCombatMove > 250) {
            lastCombatMove = Date.now();
            if (typeof player.moveTo === 'function') {
                player.moveTo(target.pos);
            } else {
                const moveDir = target.pos.clone().sub(player.pos).normalize();
                player.pos.addScaledVector(moveDir, (player.speed || 4.0) * 0.08);
            }
        }

        // Tấn công thường
        if (targetDist <= (CFG.combat.attackRadius || 35)) {
            if (typeof player.attack === 'function') player.attack(target);
            if (typeof player.slash === 'function') player.slash();
        }

        // Combo 4 kỹ năng Q - W - E - R
        if (CFG.combat.comboSkills && typeof player.useSkill === 'function') {
            if (CFG.combat.skillR && player.cd?.special <= 0 && targetDist <= 8) {
                player.useSkill('special');
            }
            if (CFG.combat.skillE && player.cd?.slam <= 0 && targetDist <= 5) {
                player.useSkill('slam');
            }
            if (CFG.combat.skillQ && player.cd?.spin <= 0 && targetDist <= 3.5) {
                player.useSkill('spin');
            }
            if (CFG.combat.skillW && player.cd?.dash <= 0 && targetDist > 3.5 && targetDist <= 12) {
                player.useSkill('dash');
            }
        }
    }

    // --- MODULE 3: TỰ LÀM & NHẬN THƯỞNG NHIỆM VỤ (QUESTS & BOUNTY) ---
    let lastQuestCheck = 0;
    function runQuestsEngine() {
        if (!G || !G.quests || Date.now() - lastQuestCheck < 2500) return;
        lastQuestCheck = Date.now();

        const qSys = G.quests;
        try {
            qSys.refreshDay?.();
            qSys.refreshWeek?.();
            qSys.refreshPass?.();

            // 1. Nhận thưởng Nhiệm Vụ Ngày
            if (CFG.quests.autoClaimDaily && G.save?.quests?.list) {
                G.save.quests.list.forEach((q, idx) => {
                    if (q.p >= q.n && !q.claimed && typeof qSys.claim === 'function') {
                        qSys.claim(idx);
                        stats.questsClaimed++;
                        updateStatUI();
                    }
                });
                if (qSys.allDone && !G.save.quests.allClaimed && typeof qSys.claimAll === 'function') {
                    qSys.claimAll();
                    stats.questsClaimed++;
                    updateStatUI();
                }
            }

            // 2. Nhận thưởng Nhiệm Vụ Tuần
            if (CFG.quests.autoClaimWeekly && G.save?.week?.list) {
                G.save.week.list.forEach((w, idx) => {
                    if (w.p >= w.n && !w.claimed && typeof qSys.claimWeek === 'function') {
                        qSys.claimWeek(idx);
                        stats.questsClaimed++;
                        updateStatUI();
                    }
                });
                if (qSys.weekAllDone && !G.save.week.chest && typeof qSys.claimWeekChest === 'function') {
                    qSys.claimWeekChest();
                    stats.questsClaimed++;
                    updateStatUI();
                }
            }

            // 3. Nhận thưởng Lệnh Truy Nã (Bounty)
            if (CFG.quests.autoClaimBounty && typeof qSys.bounty === 'function') {
                const b = qSys.bounty();
                if (b && b.p >= b.n && !b.claimed && typeof qSys.claimBounty === 'function') {
                    qSys.claimBounty();
                    stats.questsClaimed++;
                    updateStatUI();
                }
            }

            // 4. Nhận thưởng Hành Trình (Story)
            if (CFG.quests.autoClaimStory && qSys.storyReady && typeof qSys.claimStory === 'function') {
                qSys.claimStory();
                stats.questsClaimed++;
                updateStatUI();
            }

            // 5. Nhận thưởng Thẻ Sao (Pass)
            if (CFG.quests.autoClaimPass && typeof qSys.claimPassAll === 'function') {
                qSys.claimPassAll();
            }
        } catch (e) {
            // Safe ignore
        }
    }

    // --- MODULE 4: AUTO NÔNG TRẠI ---
    function runFarmEngine() {
        if (!G || !G.farm || !G.farm.plots) return;
        const isHome = G.world?.planet === 'home';
        const isVisiting = G.farm.viewOnly || !!G.visiting;

        if (isHome && !isVisiting) {
            // Thu hoạch
            if (CFG.farm.harvest) {
                for (const plot of G.farm.plots) {
                    if (G.farm.ready(plot)) {
                        G.farm.harvest(plot);
                        stats.harvestCount++;
                        updateStatUI();
                    }
                }
            }

            // Gieo hạt
            if (CFG.farm.plant) {
                const emptyPlots = G.farm.plots.filter(p => !p.state);
                if (emptyPlots.length > 0) {
                    const chosenCrop = determineCropToPlant();
                    if (chosenCrop) {
                        for (const plot of emptyPlots) {
                            G.farm.plant(plot, chosenCrop);
                        }
                    }
                }
            }

            // Thu sản phẩm thú nuôi
            if (CFG.farm.collectAnimals && G.decor?.items) {
                for (const item of G.decor.items) {
                    if (item.d && item.animal && G.decor.stock(item.d) > 0) {
                        const collected = G.decor.collect(item.d);
                        if (collected > 0) {
                            stats.petProducts += collected;
                            updateStatUI();
                        }
                    }
                }
            }
        }

        // Bạn bè
        if (isVisiting && G.net) {
            if (CFG.social.autoWaterFriend) {
                for (const plot of G.farm.plots) {
                    if (plot.state && !G.farm.ready(plot) && !plot.state.watered) {
                        G.net.act({ k: 'water', id: plot.id });
                    }
                }
            }
            if (CFG.social.autoStealFriend) {
                for (const plot of G.farm.plots) {
                    if (plot.state && G.farm.ready(plot)) {
                        G.net.act({ k: 'steal', id: plot.id });
                    }
                }
            }
        }
    }

    function determineCropToPlant() {
        const playerLvl = G.save?.lvl || 1;
        if (CFG.farm.selectedCrop && CFG.farm.selectedCrop !== 'auto') return CFG.farm.selectedCrop;
        for (const c of CROPS) {
            if (c.lvl && playerLvl >= c.lvl) return c.id;
        }
        return 'radish';
    }

    // --- MODULE 5: AUTO CÂU CÁ (TƯƠNG THÍCH MỌI HÀNH TINH, ĐẶC BIỆT LÀ HÀNH TINH ĐẠI DƯƠNG) ---
    let fishCastCooldown = 0;
    let fishNavigating = false;

    function runFishingEngine() {
        if (!CFG.fish.enabled || !G || !G.fishing || !G.player || !G.player.alive) return;

        const fishing = G.fishing;
        const player = G.player;
        const Vector3 = player.pos.constructor;

        // Nếu đang trong trạng thái câu cá
        if (fishing.active) {
            fishNavigating = false;
            fishCastCooldown = Date.now() + 2000;

            // 1. Cá cắn câu -> Giật cần ngay lập tức
            if (fishing.phase === 'bite') {
                if (typeof fishing.hook === 'function') fishing.hook();
                return;
            }

            // 2. Đang kéo cá (Hooked)
            if (fishing.phase === 'hooked') {
                if (CFG.fish.mode === 'instant') {
                    fishing.progress = 1;
                    if (fishing.interest && typeof fishing.finish === 'function') {
                        fishing.finish(true);
                        stats.fishCount++;
                        updateStatUI();
                    }
                } else {
                    // Chế độ Chuẩn xác: Giữ lực căng dây tối ưu (40% - 68%) không bao giờ đứt
                    if (fishing.tension > 0.68) {
                        fishing.release();
                    } else if (fishing.tension < 0.42) {
                        fishing.press();
                    }
                    if (fishing.progress >= 1) {
                        stats.fishCount++;
                        updateStatUI();
                    }
                }
            }
            return;
        }

        // Nếu chưa bắt đầu câu -> Chuẩn bị thả câu
        if (!CFG.fish.autoRecast || Date.now() < fishCastCooldown) return;

        // 1. Tự động trang bị Cần Câu từ balo nếu chưa cầm
        if (!fishing.rod && G.bag?.slots) {
            const rodSlot = G.bag.slots.find(s => s && s.id && (s.id.includes('rod') || s.id.startsWith('rod_')));
            if (rodSlot) {
                G.save.equip.weapon = rodSlot.id;
                player.refreshEquip?.();
            }
        }

        // 2. Tìm điểm câu / hồ nước gần nhất (Hỗ trợ cả Ocean Planet rạn san hô, Hồ Mầm Xanh, Băng Giá, Kẹo Ngọt, Dung Nham)
        let watersList = G.world?.waters || [];
        if (watersList.length === 0 && G.world?.waterAt) {
            // Fallback nếu map không có list waters tường minh
            watersList = [{ x: player.pos.x + 3, z: player.pos.z + 3, r: 4, kind: G.world.planet || 'lake' }];
        }

        if (watersList.length > 0) {
            let nearestWater = null;
            let minDist = Infinity;

            for (const w of watersList) {
                const d = Math.hypot(w.x - player.pos.x, w.z - player.pos.z);
                if (d < minDist) {
                    minDist = d;
                    nearestWater = w;
                }
            }

            if (nearestWater) {
                // Tính toán vị trí đứng câu (shore) và vị trí quăng mồi (cast)
                let shorePos, castPos;
                if (typeof fishing.plan === 'function') {
                    try {
                        const targetCenter = new Vector3(nearestWater.x, 0, nearestWater.z);
                        const planned = fishing.plan(nearestWater, targetCenter);
                        shorePos = planned.shore;
                        castPos = planned.cast;
                    } catch (e) {
                        // Fallback
                        const angle = Math.atan2(nearestWater.z - player.pos.z, nearestWater.x - player.pos.x);
                        shorePos = new Vector3(nearestWater.x - Math.cos(angle) * (nearestWater.r + 0.8), 0, nearestWater.z - Math.sin(angle) * (nearestWater.r + 0.8));
                        castPos = new Vector3(nearestWater.x + Math.cos(angle) * (nearestWater.r * 0.4), 0, nearestWater.z + Math.sin(angle) * (nearestWater.r * 0.4));
                    }
                } else {
                    const angle = Math.atan2(nearestWater.z - player.pos.z, nearestWater.x - player.pos.x);
                    shorePos = new Vector3(nearestWater.x - Math.cos(angle) * (nearestWater.r + 0.8), 0, nearestWater.z - Math.sin(angle) * (nearestWater.r + 0.8));
                    castPos = new Vector3(nearestWater.x + Math.cos(angle) * (nearestWater.r * 0.4), 0, nearestWater.z + Math.sin(angle) * (nearestWater.r * 0.4));
                }

                const distToShore = Math.hypot(player.pos.x - shorePos.x, player.pos.z - shorePos.z);

                // Nếu còn cách xa bờ/điểm câu -> Tự động di chuyển tới điểm câu
                if (distToShore > 2.6) {
                    fishNavigating = true;
                    player.moveTo(shorePos);
                    return;
                }

                // Khi đã tới gần mép nước / rạn san hô -> Dừng bước và quăng câu
                if (fishNavigating) {
                    player.target = null;
                    fishNavigating = false;
                }

                fishCastCooldown = Date.now() + 2500;
                try {
                    fishing.start(nearestWater, castPos);
                } catch (err) {
                    console.warn('[ZooPet Auto] Lỗi khi start câu cá:', err);
                }
            }
        }
    }

    // --- MODULE 6: AUTO LOOT & UTILS ---
    function runLootAndUtilsEngine() {
        if (!G || !G.player) return;
        const player = G.player;

        // Auto Revive
        if (CFG.utils.autoRevive && !player.alive) {
            if (typeof player.respawn === 'function') player.respawn();
            else if (typeof player.revive === 'function') player.revive();
        }

        // Magnet Loot
        if (CFG.utils.magnetLoot && G.drops) {
            // Hũ đồ rơi
            if (G.drops.bags?.length > 0) {
                for (const bag of [...G.drops.bags]) {
                    const dist = Math.hypot(bag.x - player.pos.x, bag.z - player.pos.z);
                    if (dist < 3.5) {
                        G.drops.pickupBag(bag);
                        stats.itemsLooted++;
                        updateStatUI();
                    }
                }
            }
            // Vật phẩm rơi trên đất
            if (G.drops.items?.length > 0) {
                for (const item of G.drops.items) {
                    if (!item.obj) continue;
                    const dist = Math.hypot(item.obj.position.x - player.pos.x, item.obj.position.z - player.pos.z);
                    if (dist < (CFG.utils.lootRadius || 40)) {
                        item.obj.position.x += (player.pos.x - item.obj.position.x) * 0.35;
                        item.obj.position.z += (player.pos.z - item.obj.position.z) * 0.35;
                    }
                }
            }
        }

        // Speed Hack
        if (CFG.utils.speedHack && player) {
            player.buffs = player.buffs || {};
            player.buffs.speed = { v: (CFG.utils.speedMultiplier - 1), until: player.time + 10 };
        }
    }

    // ==========================================
    // 5. MASTER TICK (CHẠY ĐƯỢC CẢ ẨN NỀN)
    // ==========================================
    function masterTick() {
        G = getGameInstance();
        if (!G || !G.player || !G.save) return;
        if (!CFG.enabled) return;

        runPlanetBossHopper();
        runCombatEngine();
        runQuestsEngine();
        runFarmEngine();
        runFishingEngine();
        runLootAndUtilsEngine();
    }

    window.__zp_bg_tick = masterTick;

    function rAF_Loop() {
        if (!document.hidden) {
            masterTick();
        }
        requestAnimationFrame(rAF_Loop);
    }
    requestAnimationFrame(rAF_Loop);

    // ==========================================
    // 6. GIAO DIỆN ĐIỀU KHIỂN TRẮNG - XANH SÁNG SỦA
    // ==========================================
    let uiRoot = null;

    function buildUI() {
        if (document.getElementById('zp-auto-ui-root')) return;

        const css = `
            #zp-auto-ui-root {
                position: fixed;
                top: ${CFG.pos.top}px;
                right: ${CFG.pos.right}px;
                width: 360px;
                max-height: 88vh;
                background: #ffffff;
                border: 1px solid #bfdbfe;
                border-radius: 16px;
                box-shadow: 0 14px 40px rgba(2, 132, 199, 0.18), 0 2px 8px rgba(0,0,0,0.04);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #1e293b;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                user-select: none;
            }
            #zp-auto-ui-root.minimized {
                width: 180px;
                max-height: 44px;
            }
            #zp-auto-ui-root.hidden {
                display: none !important;
            }
            .zp-header {
                background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                color: #ffffff;
                padding: 10px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: grab;
                font-weight: 700;
                font-size: 13.5px;
            }
            .zp-header:active { cursor: grabbing; }
            .zp-title { display: flex; align-items: center; gap: 6px; }
            .zp-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #4ade80;
                box-shadow: 0 0 8px #4ade80;
            }
            .zp-btn-group { display: flex; gap: 4px; }
            .zp-icon-btn {
                background: rgba(255,255,255,0.22);
                border: none;
                color: #fff;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }
            .zp-icon-btn:hover { background: rgba(255,255,255,0.38); }
            
            /* Tabs */
            .zp-tabs {
                display: flex;
                background: #f0f7ff;
                border-bottom: 1px solid #e0effe;
                padding: 4px;
                gap: 2px;
                overflow-x: auto;
            }
            .zp-tab {
                flex: 1;
                padding: 6px 4px;
                text-align: center;
                font-size: 11px;
                font-weight: 600;
                color: #64748b;
                border-radius: 8px;
                cursor: pointer;
                white-space: nowrap;
                border: none;
                background: transparent;
            }
            .zp-tab:hover { color: #0284c7; background: #e0effe; }
            .zp-tab.active {
                color: #0369a1;
                background: #ffffff;
                box-shadow: 0 2px 6px rgba(0, 100, 200, 0.1);
            }

            /* Body */
            .zp-body {
                padding: 12px 14px;
                overflow-y: auto;
                max-height: 58vh;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .zp-tab-content { display: none; flex-direction: column; gap: 8px; }
            .zp-tab-content.active { display: flex; }

            /* Controls */
            .zp-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12.5px;
                font-weight: 500;
                color: #334155;
            }
            .zp-switch {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
            }
            .zp-switch input { opacity: 0; width: 0; height: 0; }
            .zp-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #cbd5e1;
                transition: .2s;
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
                transition: .2s;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            input:checked + .zp-slider { background-color: #0284c7; }
            input:checked + .zp-slider:before { transform: translateX(16px); }

            .zp-select {
                background: #f8fafc;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 4px 8px;
                font-size: 11.5px;
                color: #1e293b;
                outline: none;
            }

            .zp-card-box {
                background: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 10px;
                padding: 8px 10px;
                font-size: 11.5px;
                line-height: 1.4;
            }
            .zp-grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5px;
                margin-top: 4px;
            }
            .zp-item-box {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11.5px;
                background: #f8fafc;
                padding: 5px 7px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
            }
            .zp-item-box.titan {
                border-left: 3px solid #ef4444;
            }

            .zp-stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }
            .zp-stat-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 6px 8px;
                text-align: center;
            }
            .zp-stat-num { font-size: 15px; font-weight: 700; color: #0284c7; }
            .zp-stat-label { font-size: 10px; color: #64748b; font-weight: 500; }

            /* FAB Button */
            #zp-fab-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: linear-gradient(135deg, #0284c7, #0369a1);
                color: #fff;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
                border: 2px solid #fff;
                cursor: pointer;
                z-index: 999998;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.id = 'zp-auto-style';
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        uiRoot = document.createElement('div');
        uiRoot.id = 'zp-auto-ui-root';
        uiRoot.innerHTML = `
            <div class="zp-header" id="zp-header-drag">
                <div class="zp-title">
                    <span class="zp-status-dot"></span>
                    <span>Zoo Pet Auto Pro v2.2</span>
                </div>
                <div class="zp-btn-group">
                    <button class="zp-icon-btn" id="zp-btn-min" title="Thu nhỏ">_</button>
                    <button class="zp-icon-btn" id="zp-btn-close" title="Ẩn (F2)">✕</button>
                </div>
            </div>

            <div class="zp-tabs" id="zp-tabs-bar">
                <button class="zp-tab active" data-tab="boss">🚀 Săn Boss</button>
                <button class="zp-tab" data-tab="filter">🎯 Lọc Boss</button>
                <button class="zp-tab" data-tab="quests">📜 Nhiệm Vụ</button>
                <button class="zp-tab" data-tab="farm">🌾 Nông Trại</button>
                <button class="zp-tab" data-tab="fish">🎣 Câu Cá</button>
                <button class="zp-tab" data-tab="combat">⚔️ Combat</button>
                <button class="zp-tab" data-tab="loot">🎁 Tiện Ích</button>
                <button class="zp-tab" data-tab="stats">📊 Thống Kê</button>
            </div>

            <div class="zp-body" id="zp-body-content">
                <!-- TAB 1: SĂN BOSS & DU HÀNH -->
                <div class="zp-tab-content active" data-tab-content="boss">
                    <div class="zp-card-box">
                        <div id="zp-boss-status" style="font-weight:600;color:#0284c7;">🚀 Đang quét Boss các hành tinh...</div>
                    </div>

                    <div class="zp-row">
                        <span>🚀 <b>Auto Du Hành Diệt Boss Cày Cấp</b></span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-boss-hopper" ${CFG.bossHopper.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:2px;">CHỌN HÀNH TINH SĂN BOSS:</div>
                    <div class="zp-grid-2">
                        ${Object.keys(PLANETS).map(p => `
                            <label class="zp-item-box">
                                <input type="checkbox" class="cfg-planet" data-p="${p}" ${CFG.bossHopper.planets[p] ? 'checked' : ''}>
                                <span>${PLANETS[p].icon} ${PLANETS[p].name} (Lv${PLANETS[p].lvl})</span>
                            </label>
                        `).join('')}
                    </div>

                    <div class="zp-row" style="margin-top:4px;">
                        <span>Thời gian nhặt đồ trước khi chuyển map:</span>
                        <select class="zp-select" id="cfg-wait-loot">
                            <option value="4" ${CFG.bossHopper.waitLootSeconds === 4 ? 'selected' : ''}>4 giây</option>
                            <option value="6" ${CFG.bossHopper.waitLootSeconds === 6 ? 'selected' : ''}>6 giây</option>
                            <option value="8" ${CFG.bossHopper.waitLootSeconds === 8 ? 'selected' : ''}>8 giây</option>
                            <option value="12" ${CFG.bossHopper.waitLootSeconds === 12 ? 'selected' : ''}>12 giây</option>
                        </select>
                    </div>
                </div>

                <!-- TAB 2: LỌC BOSS (TRÁNH TITAN) -->
                <div class="zp-tab-content" data-tab-content="filter">
                    <div class="zp-row" style="background:#fef2f2;padding:6px 8px;border-radius:8px;border:1px solid #fecaca">
                        <div>
                            <b style="color:#ef4444">🛡️ Bỏ qua Boss Titan (Siêu trâu)</b>
                            <div style="font-size:10px;color:#888">Tránh Boss Titan HP > 1500 để không bị hạ gục</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-ignore-titans" ${CFG.bossFilter.ignoreTitans ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <div class="zp-row">
                        <div>
                            <span>🩸 Né đòn khi máu dưới (%)</span>
                        </div>
                        <input type="number" id="cfg-min-hp" value="${CFG.bossFilter.minHpPercent}" min="10" max="60" style="width:50px;padding:3px;border:1px solid #cbd5e1;border-radius:4px;text-align:center">
                    </div>

                    <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:2px;">CHỌN TỪNG BOSS MUỐN SĂN:</div>
                    <div class="zp-grid-2">
                        ${BOSS_METADATA.map(b => `
                            <label class="zp-item-box ${b.titan ? 'titan' : ''}">
                                <input type="checkbox" class="cfg-boss-select" data-boss="${b.id}" ${CFG.bossFilter.customSelect[b.id] ? 'checked' : ''}>
                                <div>
                                    <div style="font-weight:600;font-size:11px">${b.name}</div>
                                    <div style="font-size:9px;color:#888">${PLANETS[b.planet]?.name || b.planet} • HP: ${b.hp}</div>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- TAB 3: NHIỆM VỤ -->
                <div class="zp-tab-content" data-tab-content="quests">
                    <div class="zp-row">
                        <span>📜 Tự nhận thưởng Nhiệm vụ Ngày & Rương</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-q-daily" ${CFG.quests.autoClaimDaily ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>🗓️ Tự nhận thưởng Nhiệm vụ Tuần & Rương</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-q-week" ${CFG.quests.autoClaimWeekly ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>🎯 Tự nhận thưởng Lệnh Truy Nã (Bounty)</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-q-bounty" ${CFG.quests.autoClaimBounty ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>🧭 Tự nhận thưởng Hành Trình (Story)</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-q-story" ${CFG.quests.autoClaimStory ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>⭐ Tự nhận toàn bộ quà Thẻ Sao (Star Pass)</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-q-pass" ${CFG.quests.autoClaimPass ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB 4: NÔNG TRẠI -->
                <div class="zp-tab-content" data-tab-content="farm">
                    <div class="zp-row">
                        <span>🌾 Tự động thu hoạch cây chín</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-harvest" ${CFG.farm.harvest ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>🌱 Tự động gieo hạt luống trống</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-plant" ${CFG.farm.plant ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>Loại cây trồng:</span>
                        <select class="zp-select" id="cfg-farm-crop">
                            ${CROPS.map(c => `<option value="${c.id}" ${CFG.farm.selectedCrop === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="zp-row">
                        <span>🐔 Thu sản phẩm thú nuôi</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-animals" ${CFG.farm.collectAnimals ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB 5: CÂU CÁ -->
                <div class="zp-tab-content" data-tab-content="fish">
                    <div class="zp-row">
                        <span>🎣 Bật Auto Câu Cá</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-toggle" ${CFG.fish.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>Chế độ câu:</span>
                        <select class="zp-select" id="cfg-fish-mode">
                            <option value="perfect" ${CFG.fish.mode === 'perfect' ? 'selected' : ''}>🎯 Chuẩn xác (Giữ căng dây)</option>
                            <option value="instant" ${CFG.fish.mode === 'instant' ? 'selected' : ''}>⚡ Siêu tốc (Instant Catch)</option>
                        </select>
                    </div>
                    <div class="zp-row">
                        <span>🔁 Tự quăng lại cần</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-recast" ${CFG.fish.autoRecast ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB 6: COMBAT THƯỜNG -->
                <div class="zp-tab-content" data-tab-content="combat">
                    <div class="zp-row">
                        <span>⚔️ Bật Auto Đánh Quái</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-combat-toggle" ${CFG.combat.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <span>Mục tiêu:</span>
                        <select class="zp-select" id="cfg-combat-target">
                            <option value="all" ${CFG.combat.targetMode === 'all' ? 'selected' : ''}>Tất cả quái</option>
                            <option value="monsters_only" ${CFG.combat.targetMode === 'monsters_only' ? 'selected' : ''}>Chỉ quái thường</option>
                            <option value="boss_only" ${CFG.combat.targetMode === 'boss_only' ? 'selected' : ''}>Chỉ Boss</option>
                        </select>
                    </div>
                    <div class="zp-row">
                        <span>💥 Auto Combo chiêu Q - W - E - R</span>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-combat-combo" ${CFG.combat.comboSkills ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB 7: TIỆN ÍCH & LOOT -->
                <div class="zp-tab-content" data-tab-content="loot">
                    <div class="zp-row">
                        <span>🧲 Tự hút đồ rơi (Magnet Loot)</span>
                        <label class="zp-switch"><input type="checkbox" id="cfg-util-magnet" ${CFG.utils.magnetLoot ? 'checked' : ''}><span class="zp-slider"></span></label>
                    </div>
                    <div class="zp-row">
                        <span>❤️ Tự hồi sinh khi gục ngã</span>
                        <label class="zp-switch"><input type="checkbox" id="cfg-util-revive" ${CFG.utils.autoRevive ? 'checked' : ''}><span class="zp-slider"></span></label>
                    </div>
                    <div class="zp-row">
                        <span>⚡ Tăng tốc độ chạy (Speed Hack)</span>
                        <label class="zp-switch"><input type="checkbox" id="cfg-util-speed" ${CFG.utils.speedHack ? 'checked' : ''}><span class="zp-slider"></span></label>
                    </div>
                </div>

                <!-- TAB 8: THỐNG KÊ -->
                <div class="zp-tab-content" data-tab-content="stats">
                    <div class="zp-stats-grid">
                        <div class="zp-stat-card">
                            <div class="zp-stat-num" id="stat-boss">0</div>
                            <div class="zp-stat-label">Boss đã hạ</div>
                        </div>
                        <div class="zp-stat-card">
                            <div class="zp-stat-num" id="stat-planets">0</div>
                            <div class="zp-stat-label">Hành tinh đã qua</div>
                        </div>
                        <div class="zp-stat-card">
                            <div class="zp-stat-num" id="stat-harvest">0</div>
                            <div class="zp-stat-label">Cây thu hoạch</div>
                        </div>
                        <div class="zp-stat-card">
                            <div class="zp-stat-num" id="stat-fish">0</div>
                            <div class="zp-stat-label">Cá đã câu</div>
                        </div>
                    </div>
                    <div class="zp-row" style="margin-top:6px;">
                        <span>📜 Nhiệm vụ đã nhận quà:</span>
                        <b style="color:#0284c7" id="stat-quests">0</b>
                    </div>
                    <div class="zp-row">
                        <span>🎁 Đồ đã nhặt:</span>
                        <b style="color:#0284c7" id="stat-loot">0</b>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(uiRoot);

        const fab = document.createElement('button');
        fab.id = 'zp-fab-btn';
        fab.title = 'Bật/Tắt Menu Auto (Phím tắt: F2)';
        fab.innerHTML = '🤖';
        document.body.appendChild(fab);

        bindUIEvents(uiRoot, fab);
    }

    function bindUIEvents(root, fab) {
        // Tab switching
        const tabs = root.querySelectorAll('.zp-tab');
        const contents = root.querySelectorAll('.zp-tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const target = root.querySelector(`[data-tab-content="${tab.dataset.tab}"]`);
                if (target) target.classList.add('active');
            });
        });

        const bindChk = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.onchange = e => { fn(e.target.checked); saveConfig(); };
        };
        const bindVal = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.onchange = e => { fn(e.target.value); saveConfig(); };
        };

        // Boss & Planets
        bindChk('cfg-boss-hopper', v => CFG.bossHopper.enabled = v);
        bindVal('cfg-wait-loot', v => CFG.bossHopper.waitLootSeconds = Number(v) || 6);
        bindChk('cfg-ignore-titans', v => CFG.bossFilter.ignoreTitans = v);
        bindVal('cfg-min-hp', v => CFG.bossFilter.minHpPercent = Number(v) || 30);

        root.querySelectorAll('.cfg-planet').forEach(cb => {
            cb.onchange = () => {
                CFG.bossHopper.planets[cb.dataset.p] = cb.checked;
                saveConfig();
            };
        });

        root.querySelectorAll('.cfg-boss-select').forEach(cb => {
            cb.onchange = () => {
                CFG.bossFilter.customSelect[cb.dataset.boss] = cb.checked;
                saveConfig();
            };
        });

        // Quests
        bindChk('cfg-q-daily', v => CFG.quests.autoClaimDaily = v);
        bindChk('cfg-q-week', v => CFG.quests.autoClaimWeekly = v);
        bindChk('cfg-q-bounty', v => CFG.quests.autoClaimBounty = v);
        bindChk('cfg-q-story', v => CFG.quests.autoClaimStory = v);
        bindChk('cfg-q-pass', v => CFG.quests.autoClaimPass = v);

        // Farm
        bindChk('cfg-farm-harvest', v => CFG.farm.harvest = v);
        bindChk('cfg-farm-plant', v => CFG.farm.plant = v);
        bindVal('cfg-farm-crop', v => CFG.farm.selectedCrop = v);
        bindChk('cfg-farm-animals', v => CFG.farm.collectAnimals = v);

        // Fishing & Combat & Loot
        bindChk('cfg-fish-toggle', v => CFG.fish.enabled = v);
        bindVal('cfg-fish-mode', v => CFG.fish.mode = v);
        bindChk('cfg-fish-recast', v => CFG.fish.autoRecast = v);

        bindChk('cfg-combat-toggle', v => CFG.combat.enabled = v);
        bindVal('cfg-combat-target', v => CFG.combat.targetMode = v);
        bindChk('cfg-combat-combo', v => CFG.combat.comboSkills = v);

        bindChk('cfg-util-magnet', v => CFG.utils.magnetLoot = v);
        bindChk('cfg-util-revive', v => CFG.utils.autoRevive = v);
        bindChk('cfg-util-speed', v => CFG.utils.speedHack = v);

        // Minimize / Close / Open
        document.getElementById('zp-btn-min')?.addEventListener('click', () => root.classList.toggle('minimized'));
        document.getElementById('zp-btn-close')?.addEventListener('click', () => root.classList.add('hidden'));
        fab.addEventListener('click', () => root.classList.toggle('hidden'));

        window.addEventListener('keydown', e => {
            if (e.key === 'F2') {
                e.preventDefault();
                root.classList.toggle('hidden');
            }
        });

        // Dragging
        const header = document.getElementById('zp-header-drag');
        let isDragging = false, startX, startY, origTop, origRight;

        header?.addEventListener('pointerdown', e => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = root.getBoundingClientRect();
            origTop = rect.top;
            origRight = window.innerWidth - rect.right;
            header.setPointerCapture?.(e.pointerId);
        });

        window.addEventListener('pointermove', e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newTop = Math.max(10, Math.min(window.innerHeight - 80, origTop + dy));
            const newRight = Math.max(10, Math.min(window.innerWidth - 180, origRight - dx));
            root.style.top = newTop + 'px';
            root.style.right = newRight + 'px';
            CFG.pos = { top: newTop, right: newRight };
        });

        window.addEventListener('pointerup', () => {
            if (isDragging) {
                isDragging = false;
                saveConfig();
            }
        });
    }

    function updateStatUI() {
        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setTxt('stat-boss', stats.bossesKilled);
        setTxt('stat-planets', stats.planetsVisited);
        setTxt('stat-harvest', stats.harvestCount);
        setTxt('stat-fish', stats.fishCount);
        setTxt('stat-quests', stats.questsClaimed);
        setTxt('stat-loot', stats.itemsLooted);
    }

    // ==========================================
    // 7. KHỞI TẠO TỔNG THỂ
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(buildUI, 1000));
    } else {
        setTimeout(buildUI, 1000);
    }

})();
