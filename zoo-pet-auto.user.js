// ==UserScript==
// @name         Zoo Pet - All-in-One Auto Pro Tool
// @namespace    https://zoo-pet.store/
// @version      3.2.0
// @description  Tool Auto toàn diện, An Toàn 100% Anti-Detection cho Zoo Pet: Tự Động Kết Nối Đa Tầng Bất Khả Xâm Phạm (Triple-Resilient Auto-Connect), Bắt Dính Engine Ngay Lập Tức Ở Mọi Map & Hầm Ngục, Chống Văng Hầm Ngục Solo, Vô Hạn Lượt Đi Ải, Auto Câu Cá Chuẩn Kéo Cần, Auto Săn Boss Toàn Map, Bất Tử Toàn Diện, Nhân EXP Siêu Tốc.
// @author       Beso & Antigravity
// @match        https://*.cloudfront.net/*
// @match        https://d173ysgpwor2n4.cloudfront.net/*
// @match        https://zoo-pet.store/*
// @match        https://*.zoo-pet.store/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @match        *://*/*
// @icon         https://zoo-pet.store/favicon.ico
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js
// @downloadURL  https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-auto.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Chỉ chạy trên các trang Zoo Pet hoặc CloudFront CDN của game
    const isZooPetPage = location.hostname.includes('zoo-pet.store') ||
                         location.hostname.includes('cloudfront.net') ||
                         location.hostname.includes('localhost') ||
                         location.hostname.includes('127.0.0.1') ||
                         document.title.toLowerCase().includes('zoo pet');

    if (!isZooPetPage) return;

    console.log('%c[ZooPet Auto Pro v2.6.0]%c Khởi tạo engine Auto & VIP Mod trên: ' + location.href, 'color:#2563EB;font-weight:bold;font-size:14px', 'color:#475569');

    // --- HOOK DEV ENGINE NGAY TỪ ĐẦU (ĐẢM BẢO window.game = $) ---
    try {
        const origTest = RegExp.prototype.test;
        RegExp.prototype.test = function (str) {
            if (this.source && this.source.includes('localhost|127\\.0\\.0\\.1') && typeof str === 'string') {
                return true;
            }
            return origTest.apply(this, arguments);
        };
    } catch (_) {}

    // --- CẤU HÌNH MẶC ĐỊNH (TẤT CẢ AUTO & CHEATS ĐỀU MẶC ĐỊNH TẮT - OFF) ---
    const DEFAULT_CFG = {
        farm: {
            enabled: false,
            autoPlant: false,
            autoHarvest: false,
            autoPetCare: false,
            seedChoice: 'auto'
        },
        friend: {
            enabled: false,
            autoWater: false,
            autoSteal: false,
            checkInterval: 60
        },
        combat: {
            enabled: false,
            useSkills: false,
            targetMode: 'all',
            bossOnly: false,
            searchRadius: 9999,
            dodgeLowHp: false,
            dodgeThreshold: 30,
            skipTitans: false
        },
        boss: {
            autoHopPlanets: false,
            hopDelay: 8,
            skipTitans: false,
            waitForBossKill: true,
            waitForQuests: false,
            planets: {
                home: false,
                toy: true,
                candy: true,
                jungle: true,
                ice: true,
                ocean: true,
                lava: true,
                sky: true,
                dark: true
            }
        },
        quests: {
            enabled: false,
            autoDoQuests: false,
            autoClaimDaily: false,
            autoClaimWeekly: false,
            autoClaimBounty: false,
            autoClaimStory: false,
            autoClaimPass: false
        },
        fish: {
            enabled: false,
            rareOnly: false,
            summonMystery: false,
            luckBuff: false,
            autoReCast: true,
            autoEquipRod: false,
            mode: 'perfect'
        },
        cheats: {
            noCooldown: false,
            godMode: false,
            ultraFishing: false,
            globalMagnet: false,
            speedBoost: 1.0,
            attackMultiplier: 1.0,
            expMultiplier: 1.0,
            brightShadow: false
        },
        loot: {
            enabled: false,
            vacuumRadius: 999
        },
        misc: {
            backgroundWorker: false,
            fpsCap: 60
        }
    };

    // Load config (Tự động khởi tạo nếu là lần đầu hoặc version mới)
    let CFG = DEFAULT_CFG;
    try {
        const saved = localStorage.getItem('zp-auto-cfg-v26');
        if (saved) {
            CFG = JSON.parse(saved);
        } else {
            // Khởi tạo mới sạch sẽ với mọi mục đều OFF
            CFG = JSON.parse(JSON.stringify(DEFAULT_CFG));
            localStorage.setItem('zp-auto-cfg-v26', JSON.stringify(CFG));
        }
    } catch (_) {
        CFG = JSON.parse(JSON.stringify(DEFAULT_CFG));
    }

    function saveConfig() {
        try {
            localStorage.setItem('zp-auto-cfg-v26', JSON.stringify(CFG));
        } catch (_) {}
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

    // --- DANH SÁCH 9 HÀNH TINH & DỮ LIỆU ---
    const PLANET_ORDER = ['home', 'toy', 'candy', 'jungle', 'ice', 'ocean', 'lava', 'sky', 'dark', 'dungeon'];
    const PLANET_DATA = {
        home: { name: '🌱 Mầm Xanh', lvl: 1, boss: 'Không có Boss' },
        toy: { name: '🧸 Đồ Chơi', lvl: 4, boss: 'Robot Khổng Lồ' },
        candy: { name: '🍭 Kẹo Ngọt', lvl: 6, boss: 'Bánh Kem Vua / Jelly Queen' },
        jungle: { name: '🌿 Rừng Rậm', lvl: 8, boss: 'Khỉ Đột Gorilla' },
        ice: { name: '❄️ Băng Giá', lvl: 10, boss: 'Người Tuyết Yeti / Voi Mammoth' },
        ocean: { name: '🌊 Đại Dương', lvl: 12, boss: 'Thủy Quái Leviathan' },
        lava: { name: '🌋 Dung Nham', lvl: 14, boss: 'Golem Nham Thạch / Rồng Lửa' },
        sky: { name: '☁️ Mây Trời', lvl: 16, boss: 'Phượng Hoàng Phoenix' },
        dark: { name: '🌑 Bóng Tối', lvl: 20, boss: 'Chúa Tể Bóng Đêm' },
        dungeon: { name: '🏰 Hầm Ngục Cổ Đại (5 Ải Solo)', lvl: 1, boss: '5 Trùm Hầm Ngục & Cổ Vương' }
    };

    // --- HOOK MẠNG WEBSOCKET: BẢO VỆ PHÒNG HẦM NGỤC SOLO (ANTI-DG-GONE) ---
    // Ngăn chặn máy chủ gửi gói tin `dgGone` làm văng người chơi về Hành Tinh Mầm Xanh
    try {
        const _OrigWS = window.WebSocket;
        if (_OrigWS) {
            window.WebSocket = function (...args) {
                const ws = new _OrigWS(...args);

                const origAddEventListener = ws.addEventListener;
                ws.addEventListener = function (type, listener, options) {
                    if (type === 'message') {
                        const wrappedListener = function (event) {
                            try {
                                if (event && typeof event.data === 'string') {
                                    const data = JSON.parse(event.data);
                                    if (data && data.t === 'dgGone') {
                                        console.log('[ZooPetAuto] 🛡️ Đã chặn gói tin dgGone (Bảo vệ phòng Dungeon Solo không bị văng về Mầm Xanh)!');
                                        return;
                                    }
                                }
                            } catch (_) {}
                            return listener.apply(this, arguments);
                        };
                        return origAddEventListener.call(this, type, wrappedListener, options);
                    }
                    return origAddEventListener.apply(this, arguments);
                };

                let _onmsg = null;
                Object.defineProperty(ws, 'onmessage', {
                    get() { return _onmsg; },
                    set(fn) {
                        _onmsg = function (event) {
                            try {
                                if (event && typeof event.data === 'string') {
                                    const data = JSON.parse(event.data);
                                    if (data && data.t === 'dgGone') {
                                        console.log('[ZooPetAuto] 🛡️ Đã chặn ws.onmessage(dgGone)!');
                                        return;
                                    }
                                }
                            } catch (_) {}
                            if (typeof fn === 'function') {
                                return fn.apply(this, arguments);
                            }
                        };
                    }
                });

                return ws;
            };
            window.WebSocket.prototype = _OrigWS.prototype;
        }
    } catch (_) {}

    // --- HOOK ENGINE GAME NATIVE ĐA TẦNG (TRIPLE-RESILIENT AUTO-CONNECT) ---
    // Game gốc chỉ tự gán `window.game = $` khi Pb = true (/localhost|127.0.0.1/.test(location.hostname)).
    // Hook can thiệp toàn bộ các phương thức regex/string test để Pb luôn là true ở mọi hoàn cảnh,
    // đồng thời đặt trap getter/setter trên `window.game` để bắt dính Game Instance ngay mili-giây đầu tiên!

    let _capturedGame = null;

    try {
        const isTargetRegex = (src) => {
            if (!src || typeof src !== 'string') return false;
            return src.includes('localhost') || src.includes('127') || src.includes('::1');
        };

        const origTest = RegExp.prototype.test;
        RegExp.prototype.test = function (str) {
            if (this.source && isTargetRegex(this.source)) {
                return true;
            }
            return origTest.apply(this, arguments);
        };

        const origExec = RegExp.prototype.exec;
        RegExp.prototype.exec = function (str) {
            if (this.source && isTargetRegex(this.source)) {
                const res = ['localhost'];
                res.index = 0;
                res.input = str;
                return res;
            }
            return origExec.apply(this, arguments);
        };

        const origMatch = String.prototype.match;
        String.prototype.match = function (matcher) {
            if (matcher && matcher.source && isTargetRegex(matcher.source)) {
                return ['localhost'];
            }
            return origMatch.apply(this, arguments);
        };

        const origSearch = String.prototype.search;
        String.prototype.search = function (matcher) {
            if (matcher && matcher.source && isTargetRegex(matcher.source)) {
                return 0;
            }
            return origSearch.apply(this, arguments);
        };
    } catch (_) {}

    // Trap setter trên window.game để kích hoạt ngay khi game gốc gán `window.game = $`
    try {
        Object.defineProperty(window, 'game', {
            configurable: true,
            enumerable: true,
            get() {
                return _capturedGame;
            },
            set(val) {
                _capturedGame = val;
                if (val) {
                    onGameConnected(val);
                }
            }
        });
    } catch (_) {}

    function getPlanetDisplayName() {
        if (!G) return '';
        try {
            if (G.planet && (G.planet.stage !== undefined || (G.planet.constructor && G.planet.constructor.name === 'Pv'))) {
                return `Hầm Ngục Ải ${(G.planet.stage || 0) + 1}`;
            }
            if (G.save && G.save.planet) {
                return PLANET_DATA[G.save.planet]?.name || G.save.planet;
            }
        } catch (_) {}
        return '';
    }

    function onGameConnected(gameObj) {
        if (!gameObj) return;
        _capturedGame = gameObj;
        G = gameObj;

        // Hook Game Net onMsg để chặn triệt để dgGone ở tầng Engine
        if (G.net && !G.net._hookedMsg) {
            G.net._hookedMsg = true;
            const origOnMsg = G.net.onMsg;
            if (typeof origOnMsg === 'function') {
                G.net.onMsg = function (msg) {
                    if (msg && msg.t === 'dgGone') {
                        console.log('[ZooPetAuto] 🛡️ Đã chặn G.net.onMsg(dgGone)!');
                        return;
                    }
                    return origOnMsg.apply(this, arguments);
                };
            }
        }

        if (G.player && G.world) {
            const pName = getPlanetDisplayName();
            updateStatusBadge(true, pName ? `🟢 Đã kết nối (${pName})` : '🟢 Đã kết nối');
            initEngine();
        } else {
            updateStatusBadge(false, '🟡 Đang tải map 3D...');
        }
    }

    // Quét tìm kiếm Game Instance sâu (Deep Scanner)
    function findGameInstance() {
        if (_capturedGame && _capturedGame.player && _capturedGame.world) return _capturedGame;
        if (window.game && window.game.player && window.game.world) return window.game;

        try {
            const keys = Object.getOwnPropertyNames(window);
            for (let k of keys) {
                try {
                    const obj = window[k];
                    if (obj && typeof obj === 'object' && obj.player && obj.world && obj.scene) {
                        _capturedGame = obj;
                        return obj;
                    }
                } catch (_) {}
            }
        } catch (_) {}

        return _capturedGame || window.game || null;
    }

    // Hàm kết nối lại cưỡng bức và quét liên tục trong 5 giây (Resilient Scanner)
    function forceReconnectGame(callback) {
        let attempts = 0;
        const maxAttempts = 25; // 25 lần * 200ms = 5 giây

        const scan = () => {
            attempts++;
            const found = findGameInstance();
            if (found && found.player && found.world) {
                onGameConnected(found);
                if (callback) callback(true, found);
                return;
            }

            if (found && found.save) {
                updateStatusBadge(false, '🟡 Đang tải tài nguyên map...');
            } else {
                updateStatusBadge(false, `🟡 Đang tìm Engine (${attempts}/${maxAttempts})...`);
            }

            if (attempts < maxAttempts) {
                setTimeout(scan, 200);
            } else {
                if (callback) callback(false, null);
            }
        };

        scan();
    }

    function checkGameHook() {
        const found = findGameInstance();
        if (found) {
            if (found.player && found.world) {
                if (!G || G !== found || !G.player) {
                    onGameConnected(found);
                } else {
                    const pName = getPlanetDisplayName();
                    updateStatusBadge(true, pName ? `🟢 Đã kết nối (${pName})` : '🟢 Đã kết nối');
                }
            } else if (found.save) {
                updateStatusBadge(false, '🟡 Đang tải map 3D...');
            }
        }
    }

    const hookInterval = setInterval(checkGameHook, 200);

    // --- MODULE 1: CHEATS & HACKS ENGINE ---
    let origTakeDamage = null;
    let origHazard = null;
    let origGainExp = null;
    let origRollDamage = null;
    let origAimDir = null;

    function initCheatsEngine() {
        if (!G || !G.player) return;

        const p = G.player;

        // 1. GOD MODE (Bất tử máu 100% - Miễn nhiễm sát thương quái, Boss, Độc, Nham thạch, Acid, Gai)
        if (!origTakeDamage && typeof p.takeDamage === 'function') {
            origTakeDamage = p.takeDamage;
            p.takeDamage = function (dmg, src, type) {
                if (CFG.cheats.godMode) {
                    if (this.hp !== undefined && this.maxHp !== undefined) {
                        this.hp = this.maxHp;
                    }
                    return;
                }
                return origTakeDamage.apply(this, arguments);
            };
        }

        if (!origHazard && typeof p.hazard === 'function') {
            origHazard = p.hazard;
            p.hazard = function (dmg, type) {
                if (CFG.cheats.godMode) {
                    if (this.hp !== undefined && this.maxHp !== undefined) {
                        this.hp = this.maxHp;
                    }
                    return;
                }
                return origHazard.apply(this, arguments);
            };
        }

        if (CFG.cheats.godMode) {
            if (p.hp !== undefined && p.maxHp !== undefined) {
                p.hp = p.maxHp;
            }
            p.invuln = 999999;
            if (!p.buffs) p.buffs = {};
            p.buffs.fireres = { until: 9999999999, v: 1.0 };
        }

        // 2. TĂNG ĐIỂM KINH NGHIỆM EXP SIÊU TỐC (EXP Multiplier)
        if (!origGainExp && typeof p.gainExp === 'function') {
            origGainExp = p.gainExp;
            p.gainExp = function (amount) {
                const mult = (CFG.cheats.expMultiplier && Number(CFG.cheats.expMultiplier) > 1) ? Number(CFG.cheats.expMultiplier) : 1;
                const finalExp = amount * mult;
                return origGainExp.call(this, finalExp);
            };
        }
        if (CFG.cheats.expMultiplier && Number(CFG.cheats.expMultiplier) > 1) {
            if (!p.buffs) p.buffs = {};
            p.buffs.xp = { until: 9999999999, v: Number(CFG.cheats.expMultiplier) - 1 };
        }

        // 3. TĂNG SÁT THƯƠNG (Damage Multiplier)
        if (!origRollDamage && typeof p.rollDamage === 'function') {
            origRollDamage = p.rollDamage;
            p.rollDamage = function (e = 1) {
                const res = origRollDamage.call(this, e);
                const mult = (CFG.cheats.attackMultiplier && CFG.cheats.attackMultiplier > 1) ? CFG.cheats.attackMultiplier : 1;
                if (mult > 1 && res && typeof res.dmg === 'number') {
                    res.dmg = Math.round(res.dmg * mult);
                }
                return res;
            };
        }

        // 4. NO COOLDOWN (Xóa hồi chiêu)
        if (CFG.cheats.noCooldown) {
            if (p.cd) {
                p.cd.atk = 0;
                p.cd.spin = 0;
                p.cd.dash = 0;
                p.cd.slam = 0;
                p.cd.special = 0;
            }
            if (p.skills) {
                for (let s in p.skills) {
                    if (p.skills[s] && p.skills[s].cd) p.skills[s].cd = 0;
                }
            }
        }

        // 5. SPEED BOOST
        if (CFG.cheats.speedBoost > 1.0) {
            p.speedMult = CFG.cheats.speedBoost;
        } else {
            p.speedMult = 1.0;
        }

        // 6. SÁNG HÀNH TINH BÓNG TỐI
        if (CFG.cheats.brightShadow) {
            try {
                const darkMask = document.querySelector('#dark2, .dark-mask, #dark-overlay');
                if (darkMask) darkMask.style.display = 'none';

                if (G.scene && G.scene.fog) {
                    G.scene.fog.far = 99999;
                    G.scene.fog.near = 99999;
                }
                if (G.planet) {
                    G.planet.revealed = () => true;
                    G.planet.inLight = () => true;
                }
                if (p.buffs) {
                    p.buffs.light = { v: 1, until: Date.now() + 999999999 };
                }
            } catch (_) {}
        }
    }

    // --- MODULE 2: AUTO THU HOẠCH & TRỒNG TRỌT (FARM ENGINE) ---
    let farmCooldown = 0;

    function runFarmEngine() {
        if (!CFG.farm.enabled || !G || !G.farm || !G.player) return;
        if (Date.now() < farmCooldown) return;

        const farm = G.farm;
        const plots = farm.plots || [];

        for (let plot of plots) {
            if (!plot) continue;

            // 1. Thu hoạch cây chín
            if (CFG.farm.autoHarvest && typeof farm.ready === 'function' && farm.ready(plot)) {
                if (typeof farm.harvest === 'function') {
                    try {
                        farm.harvest(plot);
                        stats.cropsHarvested++;
                        updateStatsUI();
                        farmCooldown = Date.now() + 150;
                        return;
                    } catch (_) {}
                }
            }

            // 2. Gieo hạt nếu đất trống
            if (CFG.farm.autoPlant && !plot.state) {
                if (typeof farm.plant === 'function') {
                    const crop = findAvailableCrop();
                    if (crop) {
                        try {
                            farm.plant(plot, crop);
                            stats.seedsPlanted++;
                            updateStatsUI();
                            farmCooldown = Date.now() + 150;
                            return;
                        } catch (_) {}
                    }
                }
            }
        }
    }

    function findAvailableCrop() {
        if (!G || !G.bag) return null;
        const CROPS = ['radish', 'carrot', 'pumpkin', 'mint', 'chili', 'candy', 'bean', 'star', 'berry', 'coffee', 'moonflower'];
        for (let crop of CROPS) {
            const seedId = 'seed_' + crop;
            if (typeof G.bag.count === 'function' && G.bag.count(seedId) > 0) {
                return crop;
            }
        }
        return null;
    }

    // --- MODULE 3: AUTO CHIẾN ĐẤU & SĂN BOSS TOÀN MAP (COMBAT & BOSS ENGINE) ---
    let combatCooldown = 0;

    function isBossEntity(enemy) {
        if (!enemy) return false;
        if (enemy.boss === true || enemy.isBoss === true) return true;
        if (enemy.def && (enemy.def.boss || enemy.def.titan || enemy.def.sboss || enemy.def.worldBoss)) return true;
        if (enemy.type && /boss|titan|bear|cake|yeti|dragon|golem|treant|croc|mammoth|gingerbread/i.test(enemy.type)) return true;
        if (enemy.def && enemy.def.name && /vua|chúa|yeti|rồng|ma mút|golem|titan|khổng lồ|đại thụ/i.test(enemy.def.name)) return true;
        return false;
    }

    function isTitanBoss(enemy) {
        if (!enemy || !enemy.type) return false;
        if (enemy.def && (enemy.def.sboss || enemy.def.titan || enemy.def.worldBoss)) return true;
        const TITAN_PREFIXES = ['titan_', 'colossus_', 'sb_', 'sbm_', 'worldboss_'];
        return TITAN_PREFIXES.some(p => enemy.type.startsWith(p)) || (enemy.hp && enemy.hp > 2500 && isBossEntity(enemy));
    }

    function isAttackable(enemy) {
        if (!enemy) return false;
        if (enemy.alive === false || (enemy.hp !== undefined && enemy.hp <= 0)) return false;
        if (enemy.state === 'dead') return false;
        return true;
    }

    function findBestTarget() {
        if (!G || !G.enemies || !G.player) return null;
        const player = G.player;
        const enemies = G.enemies.list || [];
        const bossOnly = !!CFG.combat.bossOnly;

        let bestBoss = null;
        let minBossDist = Infinity;

        let bestMob = null;
        let minMobDist = Infinity;

        // 1. Quét Boss Titan / World Boss trực tiếp từ G.enemies.titan
        if (G.enemies.titan && isAttackable(G.enemies.titan)) {
            const titan = G.enemies.titan;
            const d = getDistance(player.pos, titan.pos);
            if (!CFG.combat.skipTitans || !isTitanBoss(titan)) {
                bestBoss = titan;
                minBossDist = d;
            }
        }

        // 2. Quét toàn bộ quái và Boss trên toàn map (Không giới hạn bán kính)
        for (let enemy of enemies) {
            if (!isAttackable(enemy)) continue;

            const isBoss = isBossEntity(enemy);
            if (isBoss && CFG.combat.skipTitans && isTitanBoss(enemy)) continue;

            const d = getDistance(player.pos, enemy.pos);

            if (isBoss) {
                if (d < minBossDist) {
                    minBossDist = d;
                    bestBoss = enemy;
                }
            } else if (!bossOnly) {
                const searchRad = (CFG.combat.searchRadius && CFG.combat.searchRadius > 0) ? CFG.combat.searchRadius : 9999;
                if (d <= searchRad && d < minMobDist) {
                    minMobDist = d;
                    bestMob = enemy;
                }
            }
        }

        return bestBoss || (!bossOnly ? bestMob : null);
    }

    function runCombatEngine() {
        // Tự động kích hoạt khi bật Tự Động Đánh HOẶC Chỉ Giết Boss
        const isCombatWanted = CFG.combat.enabled || CFG.combat.bossOnly;
        if (!isCombatWanted || !G || !G.enemies || !G.player || !G.player.alive) return;
        if (G.fishing && G.fishing.active) return; // Không can thiệp khi đang câu cá
        if (Date.now() < combatCooldown) return;

        const player = G.player;
        const target = findBestTarget();

        if (!target) {
            if (player.target && player.target.type === 'enemy') {
                player.target = null;
            }
            return;
        }

        const dist = getDistance(player.pos, target.pos);
        const attackRange = (target.def ? target.def.radius : 1.2) + (player.weapon?.range || 1.2) * 1.3;

        // Hướng mặt về mục tiêu
        try {
            player.facing = Math.atan2(target.pos.x - player.pos.x, target.pos.z - player.pos.z);
        } catch (_) {}

        // Nếu ở ngoài tầm đánh -> Di chuyển & Khóa mục tiêu toàn map
        if (dist > attackRange) {
            walkTo(target.pos);
            if (typeof player.interact === 'function') {
                try {
                    player.interact({
                        type: 'enemy',
                        enemy: target,
                        point: (typeof target.pos.clone === 'function' ? target.pos.clone() : target.pos),
                        auto: true
                    });
                } catch (_) {}
            }
        } else {
            // Đã trong tầm đánh -> Gán target và Đánh thường + Xả combo skill
            player.target = { type: 'enemy', enemy: target, point: target.pos.clone(), auto: true };
            try {
                if (player.cd) player.cd.atk = 0;
                if (typeof player.attack === 'function') {
                    player.attack(target);
                }
            } catch (err) {
                console.error('[ZooPetAuto] Lỗi attack:', err);
            }

            // Xả các chiêu thức hợp lệ trong game: spin (Q), dash (W), slam (E), special (R)
            if (CFG.combat.useSkills) {
                const validSkills = ['spin', 'dash', 'slam', 'special'];
                for (let s of validSkills) {
                    try {
                        const cdReady = !player.cd || !player.cd[s] || player.cd[s] <= 0;
                        if (cdReady && typeof player.useSkill === 'function') {
                            player.useSkill(s);
                        }
                    } catch (_) {}
                }
            }
        }

        combatCooldown = Date.now() + 100;
    }

    function walkTo(pos) {
        const player = G.player;
        if (!player || !pos || typeof player.moveTo !== 'function') return;
        try {
            if (typeof pos.clone === 'function') {
                player.moveTo(pos.clone());
                return;
            }
            player.moveTo({ x: pos.x || 0, y: 0, z: pos.z || 0, clone: () => ({ x: pos.x || 0, y: 0, z: pos.z || 0 }) });
        } catch (_) { }
    }

    function getDistance(p1, p2) {
        if (!p1 || !p2) return 9999;
        const dx = (p1.x || 0) - (p2.x || 0);
        const dz = (p1.z || 0) - (p2.z || 0);
        return Math.sqrt(dx * dx + dz * dz);
    }

    // --- MODULE 4: AUTO DU HÀNH SĂN BOSS CHUẨN XÁC (KHÔNG BỊ CHUYỂN LIÊN TỤC) ---
    let hopperState = {
        currentPlanet: null,
        planetEnterTime: 0,
        stage: 'INIT', // 'WAIT_SPAWN' | 'FIGHTING' | 'LOOTING' | 'CHECK_QUESTS' | 'READY_TO_JUMP'
        targetBoss: null,
        bossKilledThisVisit: false,
        lootEndTime: 0,
        statusText: 'Đang chờ kích hoạt'
    };

    function runPlanetBossHopper() {
        if (!CFG.boss.autoHopPlanets || !G || !G.save || !G.enemies || !G.player) return;

        const currentPlanet = G.save.planet || 'home';
        const now = Date.now();

        // 1. Nếu vừa bước sang hành tinh mới -> Khởi tạo lại trạng thái
        if (hopperState.currentPlanet !== currentPlanet) {
            hopperState.currentPlanet = currentPlanet;
            hopperState.planetEnterTime = now;
            hopperState.stage = 'WAIT_SPAWN';
            hopperState.targetBoss = null;
            hopperState.bossKilledThisVisit = false;
            hopperState.lootEndTime = 0;
            updateHopperStatusUI(`🌍 Vừa đáp xuống <b>${PLANET_DATA[currentPlanet]?.name || currentPlanet}</b>, đang quét quái & Boss...`);
            return;
        }

        const enemies = G.enemies.list || [];
        const timeOnPlanet = (now - hopperState.planetEnterTime) / 1000;

        // 2. GIAI ĐOẠN 1: Chờ quái & Boss xuất hiện đầy đủ (Chờ tối thiểu 6s)
        if (hopperState.stage === 'WAIT_SPAWN') {
            const activeBoss = enemies.find(e => isAttackable(e) && isBossEntity(e) && (!CFG.boss.skipTitans || !isTitanBoss(e)));

            if (activeBoss) {
                hopperState.stage = 'FIGHTING';
                hopperState.targetBoss = activeBoss;
                updateHopperStatusUI(`⚔️ Phát hiện Boss: <b>${activeBoss.def?.name || activeBoss.type || 'Boss'}</b> (HP: ${Math.round(activeBoss.hp)}). Đang tiến đánh!`);
            } else if (timeOnPlanet >= 10) {
                // Nếu sau 10s không có boss (ví dụ map Home hoặc Boss chưa hồi):
                if (currentPlanet === 'home' || !PLANET_DATA[currentPlanet]?.boss || PLANET_DATA[currentPlanet]?.boss.includes('Không')) {
                    updateHopperStatusUI(`ℹ️ ${PLANET_DATA[currentPlanet]?.name} không có Boss. Chuẩn bị chuyển hành tinh tiếp theo...`);
                    hopperState.stage = 'READY_TO_JUMP';
                    hopperState.lootEndTime = now + 4000;
                } else if (timeOnPlanet >= 20) {
                    updateHopperStatusUI(`⏳ Boss chưa hồi sau 20s. Chuẩn bị chuyển hành tinh kế tiếp...`);
                    hopperState.stage = 'READY_TO_JUMP';
                    hopperState.lootEndTime = now + 3000;
                }
            } else {
                updateHopperStatusUI(`🔍 Đang quét tìm Boss trên ${PLANET_DATA[currentPlanet]?.name} (${Math.round(10 - timeOnPlanet)}s)...`);
            }
            return;
        }

        // 3. GIAI ĐOẠN 2: Đang chiến đấu với Boss (TUYỆT ĐỐI KHÔNG CHUYỂN MAP TRONG KHI ĐÁNH)
        if (hopperState.stage === 'FIGHTING') {
            const boss = hopperState.targetBoss;

            // Kiểm tra Boss còn sống không
            if (boss && boss.alive && boss.hp > 0 && enemies.includes(boss)) {
                // Gán target chuẩn cho player (game engine tự động di chuyển tới Boss)
                G.player.target = { type: 'enemy', enemy: boss, point: boss.pos.clone(), auto: true };

                try {
                    G.player.facing = Math.atan2(boss.pos.x - G.player.pos.x, boss.pos.z - G.player.pos.z);
                } catch (_) {}

                const dist = getDistance(G.player.pos, boss.pos);
                const attackRange = (boss.def ? boss.def.radius : 1.5) + (G.player.weapon?.range || 1.2) * 1.2;

                if (dist <= attackRange) {
                    try {
                        if (G.player.cd) G.player.cd.atk = 0;
                        if (typeof G.player.attack === 'function') G.player.attack(boss);
                    } catch (_) {}

                    if (typeof G.player.useSkill === 'function') {
                        const validSkills = ['spin', 'dash', 'slam', 'special'];
                        for (let s of validSkills) {
                            try {
                                const cdReady = !G.player.cd || !G.player.cd[s] || G.player.cd[s] <= 0;
                                if (cdReady) G.player.useSkill(s);
                            } catch (_) {}
                        }
                    }
                }
                updateHopperStatusUI(`⚔️ Đang tiêu diệt Boss: <b>${boss.def?.name || boss.type || 'Boss'}</b> (HP còn: ${Math.round(boss.hp)})...`);
                return;
            } else {
                // Boss ĐÃ CHẾT!
                hopperState.bossKilledThisVisit = true;
                hopperState.stage = 'LOOTING';
                hopperState.lootEndTime = now + (CFG.boss.hopDelay * 1000 || 8000);
                stats.bossesKilled++;
                updateStatsUI();
                showToast(`🎉 Boss trên ${PLANET_DATA[currentPlanet]?.name} đã bị tiêu diệt! Đang hút phần thưởng...`, 4000);
                updateHopperStatusUI(`🎁 Đã diệt xong Boss! Đang hút sạch trang bị & phần thưởng (${CFG.boss.hopDelay}s)...`);
                return;
            }
        }

        // 4. GIAI ĐOẠN 3: Hút phần thưởng sau khi diệt Boss
        if (hopperState.stage === 'LOOTING') {
            // Kích hoạt hút đồ
            runLootVacuum();

            const remaining = Math.max(0, Math.ceil((hopperState.lootEndTime - now) / 1000));
            updateHopperStatusUI(`🎁 Đang hút sạch phần thưởng rơi (còn <b>${remaining}s</b>)...`);

            if (now >= hopperState.lootEndTime) {
                if (CFG.boss.waitForQuests) {
                    hopperState.stage = 'CHECK_QUESTS';
                } else {
                    hopperState.stage = 'READY_TO_JUMP';
                }
            }
            return;
        }

        // 5. GIAI ĐOẠN 4: Kiểm tra nhiệm vụ hành tinh (nếu bật tùy chọn chờ nhiệm vụ)
        if (hopperState.stage === 'CHECK_QUESTS') {
            const hasPendingQuests = checkPendingQuestsForPlanet(currentPlanet);
            if (hasPendingQuests && timeOnPlanet < 60) {
                updateHopperStatusUI(`📜 Đang làm nốt nhiệm vụ trên ${PLANET_DATA[currentPlanet]?.name}...`);
                return;
            } else {
                hopperState.stage = 'READY_TO_JUMP';
            }
        }

        // 6. GIAI ĐOẠN 5: Chuyển sang hành tinh kế tiếp
        if (hopperState.stage === 'READY_TO_JUMP') {
            const nextPlanet = getNextEnabledPlanet(currentPlanet);
            if (nextPlanet && nextPlanet !== currentPlanet) {
                updateHopperStatusUI(`🚀 Đang bay sang <b>${PLANET_DATA[nextPlanet]?.name || nextPlanet}</b>...`);
                travelToPlanet(nextPlanet);
                hopperState.stage = 'INIT'; // Tránh gọi lặp lại
            }
        }
    }

    function getNextEnabledPlanet(currentPlanet) {
        const curIdx = PLANET_ORDER.indexOf(currentPlanet);
        for (let i = 1; i <= PLANET_ORDER.length; i++) {
            const nextIdx = (curIdx + i) % PLANET_ORDER.length;
            const pKey = PLANET_ORDER[nextIdx];
            if (CFG.boss.planets[pKey] !== false) {
                return pKey;
            }
        }
        return 'candy';
    }

    function checkPendingQuestsForPlanet(planet) {
        if (!G || !G.quests || !G.quests.s) return false;
        const list = G.quests.s.quests?.list || [];
        return list.some(q => q && q.p < q.n);
    }

    // --- HÀM CHUYỂN HÀNH TINH NHANH & ĐI ẢI SOLO (FAST TELEPORT & SOLO DUNGEON) ---
    async function travelToPlanet(targetPlanet) {
        if (!targetPlanet) return;
        const pName = PLANET_DATA[targetPlanet]?.name || targetPlanet;
        showToast(`🚀 Đang khởi hành đến ${pName}...`, 3000);

        try {
            if (targetPlanet === 'dungeon') {
                // Thiết lập phiên đi Ải Solo 1 người, không cần đợi đủ 5 người và không giới hạn lượt
                sessionStorage.setItem('zp-dg', JSON.stringify({ id: 'solo_' + Date.now(), n: 1, t: Date.now() }));
                sessionStorage.setItem('zp-flight', JSON.stringify({ to: 'dungeon', t: Date.now() }));
            } else {
                sessionStorage.setItem('zp-flight', JSON.stringify({ to: targetPlanet, t: Date.now() }));
                sessionStorage.removeItem('zp-dg');
            }
        } catch (_) {}

        if (G && G.save) {
            G.save.planet = targetPlanet;
            if (typeof G.persist === 'function') G.persist();
            if (G.cloud && typeof G.cloud.flushNow === 'function') {
                await G.cloud.flushNow().catch(() => {});
            }
            G.noSave = true;
        }

        setTimeout(() => {
            location.href = location.pathname;
        }, 500);
    }

    // --- MODULE 5: AUTO CÂU CÁ TOÀN DIỆN 100% MỌI HỒ & HÀNH TINH ---
    let fishCastCooldown = 0;
    let isWalkingToWater = false;

    const RARE_FISH_IDS = [
        'fish_golden',    // Cá Rồng Vàng (HUYỀN THOẠI - 600 vàng, hồi 9999 HP, Buff Atk/Def/Crit/Luck)
        'fish_whale',     // Cá Voi Con (HUYỀN THOẠI - 420 vàng, Def +25, Regen)
        'fish_kraken',    // Bạch Tuộc Khổng Lồ (HUYỀN THOẠI - 380 vàng, Atk +35%)
        'fish_manta',     // Cá Đuối Khổng Lồ (HUYỀN THOẠI - Đại Dương)
        'fish_rainbow',   // Cá Cầu Vồng (HIẾM - 160 vàng, Atk +20%)
        'fish_swordfish', // Cá Kiếm (HIẾM - 90 vàng, Crit +10%)
        'fish_angler',    // Cá Lồng Đèn (HIẾM - 85 vàng)
        'fish_eel',       // Lươn Điện (HIẾM - 70 vàng, Tốc độ +30%)
        'fish_shark',     // Cá Mập Con (HIẾM - 65 vàng)
        'fish_koi',       // Cá Koi Rồng (HIẾM - 45 vàng, Luck +30%)
        'fish_icepike'    // Cá Chó Băng (HIẾM - 48 vàng)
    ];

    function isRareOrLegendFish(fishId, prize) {
        if (!fishId) return false;
        if (prize && (prize.mystery || prize.giant || prize.huge)) return true;
        if (RARE_FISH_IDS.includes(fishId)) return true;
        try {
            if (window.W && window.W[fishId] && (window.W[fishId].rare || window.W[fishId].legend)) return true;
        } catch (_) {}
        return false;
    }

    function ensureRodEquipped() {
        if (!G || !G.player || !G.save || !G.save.equip) return;
        try {
            if (G.player.weapon && G.player.weapon.kind === 'rod') {
                return;
            }
            let rodSlot = -1;
            if (G.bag && G.bag.slots) {
                for (let i = 0; i < G.bag.slots.length; i++) {
                    const item = G.bag.slots[i];
                    if (item && (item.id === 'rod_gold' || item.id === 'rod')) {
                        rodSlot = i;
                        break;
                    }
                }
            }
            if (rodSlot >= 0 && typeof G.equip === 'function') {
                G.equip(rodSlot);
            } else {
                G.save.equip.weapon = 'rod_gold';
                if (typeof G.player.refreshEquip === 'function') {
                    G.player.refreshEquip();
                }
            }
        } catch (_) {}
    }

    function runFishingEngine() {
        if (!CFG.fish.enabled || !G || !G.fishing || !G.player || !G.player.alive) return;

        const fishing = G.fishing;
        const player = G.player;

        // Tự động kích hoạt Buff may mắn câu cá an toàn nếu bật (Không can thiệp setter của game)
        if (CFG.fish.luckBuff && player) {
            if (!player.buffs) player.buffs = {};
            player.buffs.luck = { until: 9999999999, v: 5.0 };
        }

        if (fishing.active) {
            fishCastCooldown = Date.now() + 1000;

            // Đang trong giai đoạn quăng phao (cast) -> Chờ phao rơi xuống nước tự nhiên
            if (fishing.phase === 'cast') {
                return;
            }

            // Đảm bảo hồ nước luôn có cá
            if (fishing.w && typeof fishing.addFish === 'function') {
                const fishesInWater = (fishing.fish || []).filter(f => f.w === fishing.w);
                if (fishesInWater.length === 0) {
                    try { fishing.addFish(fishing.w); } catch (_) {}
                }
            }

            // 1. Kích hoạt cắn câu siêu tốc (Ultra Catch) khi phao đã chạm nước
            if (CFG.cheats.ultraFishing) {
                if (fishing.phase === 'wait' || fishing.phase === 'approach' || fishing.phase === 'nibble') {
                    fishing.waitT = 0;
                    if (!fishing.interest && typeof fishing.attract === 'function') {
                        try { fishing.attract(); } catch (_) {}
                    }
                    if (fishing.interest) {
                        if (typeof fishing.startBite === 'function' && fishing.phase !== 'bite') {
                            try { fishing.startBite(fishing.interest); } catch (_) {}
                        }
                        fishing.phase = 'bite';
                    }
                }
            }

            // 2. Giai đoạn cá cắn câu (Bite) -> Giật cần để cắn lưỡi câu (Hook)
            if (fishing.phase === 'bite') {
                if (typeof fishing.hook === 'function') {
                    try { fishing.hook(); } catch (_) {}
                } else if (typeof fishing.press === 'function') {
                    try { fishing.press(); } catch (_) {}
                }
                return;
            }

            // 3. Giai đoạn kéo cá (Hooked / Reeling) -> Giữ cần, kéo cá và kiểm soát lực căng dây mượt mà
            if (fishing.phase === 'hooked') {
                const reelBtn = document.querySelector('#reel');
                if (reelBtn) reelBtn.classList.add('down');

                // Kiểm soát lực căng dây thông minh (Tug-of-War Auto Reel):
                if (fishing.tension >= 0.85) {
                    // Dây quá căng -> Nhả nhẹ một nhịp để không đứt dây
                    if (typeof fishing.release === 'function') {
                        try { fishing.release(); } catch (_) {}
                    }
                    fishing.holding = false;
                } else {
                    // Dây an toàn -> Giữ và kéo cần liên tục
                    if (typeof fishing.press === 'function') {
                        try { fishing.press(); } catch (_) {}
                    }
                    fishing.holding = true;
                }

                // Nếu bật Ultra Fishing -> Tăng tốc độ kéo cần mượt mà, đầy đủ hiệu ứng
                if (CFG.cheats.ultraFishing) {
                    fishing.holding = true;
                    fishing.progress = Math.min(1, (fishing.progress || 0) + 0.05);
                    fishing.tension = Math.min(0.5, fishing.tension || 0);
                }

                // Khi tiến trình kéo đạt 100% (progress >= 1) -> Thu cá lên bờ thành công
                if (fishing.progress >= 1) {
                    if (typeof fishing.finish === 'function' && fishing.interest) {
                        const catchId = fishing.catchId || (fishing.interest ? fishing.interest.species : null);
                        const isRare = isRareOrLegendFish(catchId, fishing.prize);
                        let fishName = catchId || 'Cá';
                        try {
                            if (window.W && window.W[catchId]) fishName = window.W[catchId].name;
                        } catch (_) {}

                        try {
                            fishing.finish(true);
                            stats.fishCount++;
                            updateStatsUI();

                            if (isRare) {
                                showToast(`🌟 [CÂU CÁ VIP] Bạn đã câu trúng <b>${fishName}</b> (Hiếm / Huyền Thoại)!`, 4000);
                            }
                        } catch (err) {
                            console.error('[ZooPetAuto] Lỗi finish fishing:', err);
                        }
                    }
                }
            }
        } else {
            // Khi chưa quăng cần -> Tự tìm hồ nước gần nhất và quăng câu
            if (Date.now() > fishCastCooldown) {
                castAtNearestWater();
                fishCastCooldown = Date.now() + 1000;
            }
        }
    }

    function castAtNearestWater() {
        if (!G || !G.fishing || !G.world || !G.player || !G.player.alive) return;
        const waters = G.world.waters || [];
        if (waters.length === 0) return;

        const player = G.player;
        const fishing = G.fishing;

        // 1. Tìm điểm nước / rạn san hô gần nhất
        let nearestWater = null;
        let minDist = Infinity;
        for (let w of waters) {
            if (!w) continue;
            const d = Math.hypot(player.pos.x - w.x, player.pos.z - w.z);
            if (d < minDist) {
                minDist = d;
                nearestWater = w;
            }
        }

        if (!nearestWater) return;

        // 2. Tính toán điểm đứng bờ (shore) và điểm quăng phao (cast) chuẩn xác bằng native plan của game
        let plan = null;
        if (typeof fishing.plan === 'function') {
            try {
                let centerPoint = player.pos.clone();
                centerPoint.x = nearestWater.x;
                centerPoint.z = nearestWater.z;
                centerPoint.y = 0;
                plan = fishing.plan(nearestWater, centerPoint);
            } catch (_) {}
        }

        const shorePos = plan ? plan.shore : { x: nearestWater.x, y: 0, z: nearestWater.z };
        const castPos = plan ? plan.cast : player.pos.clone();

        const distToShore = Math.hypot(player.pos.x - shorePos.x, player.pos.z - shorePos.z);
        if (distToShore > 2.0) {
            walkTo(shorePos);
            isWalkingToWater = true;
            return;
        }

        isWalkingToWater = false;

        // 3. Đã đứng sát mép nước -> Dừng di chuyển và bắt đầu câu
        player.target = null;
        if (player.vel) player.vel.set(0, 0, 0);

        // Đảm bảo trang bị cần câu
        ensureRodEquipped();

        // Triệu hồi bóng cá bí ẩn phát sáng nếu bật
        if (CFG.fish.summonMystery && typeof fishing.callMystery === 'function') {
            try { fishing.callMystery(); } catch (_) {}
        }

        try {
            fishing.start(nearestWater, castPos);
        } catch (err) {
            console.error('[ZooPetAuto] Lỗi start fishing:', err);
        }
    }

    // --- MODULE 6: AUTO NHẬN & LÀM NHIỆM VỤ AN TOÀN (ANTI-DETECTION) ---
    let questCheckCooldown = 0;

    function runQuestEngine() {
        if (!CFG.quests.enabled || !G || !G.quests) return;
        if (Date.now() < questCheckCooldown) return;

        const q = G.quests;

        // Tự động nhận thưởng nhiệm vụ đã đạt mốc
        try {
            if (CFG.quests.autoClaimDaily && q.s && q.s.quests && q.s.quests.list) {
                q.s.quests.list.forEach((item, idx) => {
                    if (item && item.p >= item.n && !item.claimed) {
                        if (typeof q.claim === 'function') {
                            q.claim(idx);
                            stats.questsClaimed++;
                            updateStatsUI();
                        }
                    }
                });
            }

            if (CFG.quests.autoClaimWeekly && q.s && q.s.week && q.s.week.list) {
                q.s.week.list.forEach((item, idx) => {
                    if (item && item.p >= item.n && !item.claimed) {
                        if (typeof q.claimWeek === 'function') {
                            q.claimWeek(idx);
                            stats.questsClaimed++;
                            updateStatsUI();
                        }
                    }
                });
            }

            if (CFG.quests.autoClaimBounty && typeof q.claimBounty === 'function') {
                q.claimBounty();
            }
        } catch (_) {}

        questCheckCooldown = Date.now() + 2000;
    }

    // --- MODULE 7: NAM CHÂM HÚT ĐỒ (GLOBAL MAGNET) ---
    function runLootVacuum() {
        if (!G || !G.drops || !G.player || !G.player.pos) return;

        const player = G.player;
        const drops = G.drops;

        // 1. Hút các túi đồ (bags)
        if (drops.bags && drops.bags.length > 0) {
            for (let bag of drops.bags) {
                if (bag) {
                    if (bag.obj && bag.obj.position) {
                        bag.obj.position.x = player.pos.x;
                        bag.obj.position.z = player.pos.z;
                    }
                    bag.x = player.pos.x;
                    bag.z = player.pos.z;
                }
            }
        }

        // 2. Hút các vật phẩm đơn lẻ (items)
        if (drops.items && drops.items.length > 0) {
            for (let item of drops.items) {
                if (item && item.obj && item.obj.position) {
                    item.obj.position.x = player.pos.x;
                    item.obj.position.z = player.pos.z;
                }
            }
        }
    }

    // --- MODULE 8: AUTO ĐI ẢI HẦM NGỤC (DUNGEON CONTROLLER ENGINE) ---
    function runDungeonEngine() {
        if (!G || !G.planet) return;
        const planet = G.planet;
        // Kiểm tra nếu đang ở map Dungeon (Hầm Ngục 5 Ải)
        if (planet.stage !== undefined || (planet.constructor && planet.constructor.name === 'Pv')) {
            // Ngăn chặn cờ leavingDg bị kích hoạt ngoài ý muốn khi chưa phá đảo
            if (planet.phase !== 'done') {
                G.leavingDg = false;
            }

            // 1. Tự động khởi động Ải ngay lập tức khi đang ở phase chờ (Solo Fast-Start, không cần chờ)
            if (planet.phase === 'wait') {
                planet.expect = 1;
                if (typeof planet.startStage === 'function') {
                    try {
                        planet.startStage(0);
                    } catch (_) {}
                }
            }

            // 2. Kích hoạt quái vật nếu chưa thức tỉnh
            if (planet.phase === 'mobs' && planet.groups && planet.groups[planet.stage]) {
                const curGroup = planet.groups[planet.stage];
                if (curGroup.mobs && G.enemies && typeof G.enemies.wake === 'function') {
                    for (let mob of curGroup.mobs) {
                        if (mob && !mob.active && mob.alive) {
                            try {
                                G.enemies.wake(mob, mob.spawn || mob.pos);
                            } catch (_) {}
                        }
                    }
                }
            }

            // 3. Khi đã dọn sạch quái & Boss ải hiện tại (phase: clear) -> Tự động chạy tới cổng ải tiếp theo
            if (planet.phase === 'clear') {
                const arena = planet.A || (planet.arenas ? planet.arenas[planet.stage] : null);
                if (arena && G.player && G.player.alive) {
                    const portalPos = { x: arena.x, y: 0, z: arena.z };
                    const d = getDistance(G.player.pos, portalPos);
                    if (d > 1.8) {
                        walkTo(portalPos);
                    } else if (typeof planet.place === 'function' && planet.stage < 4) {
                        try {
                            planet.place(planet.stage + 1);
                        } catch (_) {}
                    }
                }
            }

            // 4. Khi phá đảo Ải 5 (phase: done) -> Tự động hút rương và quà rơi
            if (planet.phase === 'done' && !planet._claimedDoneToast) {
                planet._claimedDoneToast = true;
                showToast('🏆 [PHÁ ĐẢO HẦM NGỤC] Đã hoàn thành 5 Ải Hầm Ngục Cổ Đại! Đang thu gom trọn bộ vật phẩm...', 6000);
            }
        }
    }

    // --- VÒNG LẶP CHÍNH CỦA AUTO TOOL (MAIN LOOP) ---
    // ⚠️ FIX v2.7.0: requestAnimationFrame bị trình duyệt ĐÌNH HOÀN TOÀN khi chuyển tab
    // (document.hidden = true) => nhân vật đứng yên, không di chuyển, không đánh.
    // => Dùng ticker lai: rAF khi tab hiển thị, setInterval khi tab ẩn (timer chỉ bị
    // throttle nhẹ ~1s ở background nên vẫn chạy, và luôn có Web Worker để đánh thức).
    function autoTick() {
        try {
            if (G) {
                initCheatsEngine();

                // Nếu đang trong tiến trình câu cá -> ưu tiên câu cá, không để combat/farm xen vào làm ngắt trạng thái câu
                if (CFG.fish.enabled && G.fishing && G.fishing.active) {
                    runFishingEngine();
                } else {
                    runDungeonEngine();
                    runFarmEngine();
                    runCombatEngine();
                    runPlanetBossHopper();
                    runFishingEngine();
                }

                runQuestEngine();

                if (CFG.cheats.globalMagnet || CFG.loot.enabled) {
                    runLootVacuum();
                }
            }
        } catch (err) {
            // Safe silent error suppression
        }
    }

    let autoRafId = null;
    let hiddenTickerId = null;

    function startAutoLoop() {
        if (autoRafId) return;

        const rafLoop = () => {
            if (document.hidden) return; // tạm dừng vòng rAF, chờ sự kiện focus/visibility
            autoTick();
            autoRafId = requestAnimationFrame(rafLoop);
        };

        autoRafId = requestAnimationFrame(rafLoop);

        // Timer nền: luôn chạy (kể cả khi tab ẩn) để game không bị "đứng hình"
        hiddenTickerId = setInterval(() => {
            if (document.hidden) autoTick();
        }, 200);

        // Chuyển tab: rAF bị treo -> đánh thức lại ngay khi tab hiện lại
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (autoRafId) { cancelAnimationFrame(autoRafId); autoRafId = null; }
            } else if (!autoRafId) {
                autoRafId = requestAnimationFrame(rafLoop);
                autoTick(); // bù ngay 1 nhịp cho tab vừa mở
            }
        });

        addEventListener('focus', () => {
            if (!autoRafId && !document.hidden) autoRafId = requestAnimationFrame(rafLoop);
            autoTick();
        });
    }

    function initEngine() {
        startAutoLoop();
    }

    // --- XÂY DỰNG GIAO DIỆN ĐIỀU KHIỂN (UI WHITE-BLUE CHUẨN XỊN) ---
    function createUI() {
        if (document.getElementById('zp-auto-panel')) return;

        const container = document.createElement('div');
        container.id = 'zp-auto-panel';
        container.innerHTML = `
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
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
                .zp-btn-secondary {
                    background: #F1F5F9;
                    color: #334155;
                    border: 1px solid #CBD5E1;
                }
                .zp-btn-secondary:hover {
                    background: #E2E8F0;
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
                .zp-planet-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                    margin-top: 8px;
                }
                .zp-planet-btn {
                    padding: 6px 4px;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #334155;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.15s;
                }
                .zp-planet-btn:hover {
                    background: #E0F2FE;
                    border-color: #38BDF8;
                    color: #0284C7;
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
                #zp-reconnect-btn:hover {
                    background: #0284C7 !important;
                    color: #FFFFFF !important;
                }
            </style>

            <div class="zp-header" id="zp-drag-handle">
                <div class="zp-title">
                    🐾 Zoo Pet Auto <span class="zp-status-badge">🟡 Đang kết nối...</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <button id="zp-reconnect-btn" title="Thử quét và kết nối lại với Game Engine" style="background:#E0F2FE;color:#0284C7;border:1px solid #BAE6FD;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s;">
                        🔄 Kết nối lại
                    </button>
                    <div style="cursor:pointer;color:#94A3B8;font-size:16px;" id="zp-close-btn">✕</div>
                </div>
            </div>

            <div class="zp-tabs">
                <div class="zp-tab active" data-tab="teleport">🚀 Du Hành</div>
                <div class="zp-tab" data-tab="boss">⚔️ Săn Boss</div>
                <div class="zp-tab" data-tab="cheats">👑 Mod VIP</div>
                <div class="zp-tab" data-tab="farm">🌾 Nông Trại</div>
                <div class="zp-tab" data-tab="quests">📜 Nhiệm Vụ</div>
                <div class="zp-tab" data-tab="fish">🎣 Câu Cá</div>
            </div>

            <div class="zp-body">
                <!-- TAB 1: DU HÀNH & CHUYỂN HÀNH TINH NHANH -->
                <div class="zp-tab-content" id="tab-teleport">
                    <div style="font-weight:600;font-size:12px;color:#0284C7;margin-bottom:4px;">🚀 Chuyển Hành Tinh Nhanh (1-Click)</div>
                    <div class="zp-desc" style="margin-bottom:8px;">Bấm vào hành tinh bất kỳ để phi thuyền hạ cánh ngay lập tức:</div>

                    <div class="zp-planet-grid">
                        <div class="zp-planet-btn" data-planet="home">🌱 Mầm Xanh</div>
                        <div class="zp-planet-btn" data-planet="toy">🧸 Đồ Chơi</div>
                        <div class="zp-planet-btn" data-planet="candy">🍭 Kẹo Ngọt</div>
                        <div class="zp-planet-btn" data-planet="jungle">🌿 Rừng Rậm</div>
                        <div class="zp-planet-btn" data-planet="ice">❄️ Băng Giá</div>
                        <div class="zp-planet-btn" data-planet="ocean">🌊 Đại Dương</div>
                        <div class="zp-planet-btn" data-planet="lava">🌋 Dung Nham</div>
                        <div class="zp-planet-btn" data-planet="sky">☁️ Mây Trời</div>
                        <div class="zp-planet-btn" data-planet="dark">🌑 Bóng Tối</div>
                        <div class="zp-planet-btn" data-planet="dungeon" style="grid-column: span 3;background:#FAF5FF;border-color:#D8B4FE;color:#7E22CE;font-weight:700;">🏰 Hầm Ngục Cổ Đại (5 Ải Solo)</div>
                    </div>

                    <div style="margin-top:12px;padding:10px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                            <div style="font-weight:700;font-size:12px;color:#15803D;">🏰 Hầm Ngục Cổ Đại (Đi Ải Solo)</div>
                            <span style="font-size:10px;background:#DCFCE7;color:#166534;padding:2px 6px;border-radius:999px;font-weight:600;">1 Người • Vô Hạn Lượt</span>
                        </div>
                        <div class="zp-desc" style="color:#166534;margin-bottom:8px;">Vào thẳng 5 ải hầm ngục ngay lập tức, không cần đợi đủ 5 người và không bị giới hạn 2 lượt/ngày:</div>
                        <button class="zp-btn" id="zp-btn-dungeon-solo" style="background:#16A34A;margin-top:0;">⚔️ Vào Ải Hầm Ngục Solo Ngay</button>
                    </div>

                    <div style="margin-top:14px;padding-top:10px;border-top:1px solid #F1F5F9;">
                        <div style="font-weight:600;font-size:12px;color:#334155;margin-bottom:6px;">🎯 Chọn nhanh theo danh sách:</div>
                        <div style="display:flex;gap:6px;">
                            <select class="zp-select" id="zp-select-planet" style="flex:1;">
                                <option value="home">🌱 Hành Tinh Mầm Xanh (Lv 1)</option>
                                <option value="toy">🧸 Hành Tinh Đồ Chơi (Lv 4)</option>
                                <option value="candy">🍭 Hành Tinh Kẹo Ngọt (Lv 6)</option>
                                <option value="jungle">🌿 Rừng Rậm Nguyên Sinh (Lv 8)</option>
                                <option value="ice">❄️ Hành Tinh Băng Giá (Lv 10)</option>
                                <option value="ocean">🌊 Hành Tinh Đại Dương (Lv 12)</option>
                                <option value="lava">🌋 Hành Tinh Dung Nham (Lv 14)</option>
                                <option value="sky">☁️ Quần Đảo Mây Trời (Lv 16)</option>
                                <option value="dark">🌑 Tinh Cầu Bóng Đêm (Lv 20)</option>
                                <option value="dungeon">🏰 Hầm Ngục Cổ Đại (5 Ải Solo • Vô Hạn Lượt)</option>
                            </select>
                            <button class="zp-btn" id="zp-btn-teleport-go" style="width:auto;margin-top:0;padding:6px 14px;">Bay Ngay</button>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: SĂN BOSS & DU HÀNH TỰ ĐỘNG -->
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
                            <div class="zp-label">💀 CHỈ GIẾT BOSS (Bỏ Qua Quái Nhỏ)</div>
                            <div class="zp-desc">Auto đi tới vị trí Boss trên bản đồ, KHÔNG đánh quái nhỏ</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-boss-only" ${CFG.combat.bossOnly ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🛡️ Bỏ qua Boss Titan</div>
                            <div class="zp-desc">Bỏ qua Titan Rùa núi, Mãng xà (>2500 HP)</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-skip-titans" ${CFG.combat.skipTitans ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🚀 Tự động bay săn Boss liên hành tinh</div>
                            <div class="zp-desc">Chỉ bay khi ĐÃ TIÊU DIỆT XONG BOSS và nhặt hết quà</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-boss-hop" ${CFG.boss.autoHopPlanets ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">📜 Chờ xong nhiệm vụ mới chuyển map</div>
                            <div class="zp-desc">Đợi làm xong nhiệm vụ hành tinh rồi mới bay tiếp</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-wait-quests" ${CFG.boss.waitForQuests ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⏱️ Thời gian hút đồ sau diệt Boss</div>
                            <div class="zp-desc">Thời gian nam châm gom quà trước khi bay</div>
                        </div>
                        <select class="zp-select" id="cfg-hop-delay">
                            <option value="5" ${CFG.boss.hopDelay === 5 ? 'selected' : ''}>5 giây</option>
                            <option value="8" ${CFG.boss.hopDelay === 8 ? 'selected' : ''}>8 giây (Chuẩn)</option>
                            <option value="12" ${CFG.boss.hopDelay === 12 ? 'selected' : ''}>12 giây</option>
                            <option value="15" ${CFG.boss.hopDelay === 15 ? 'selected' : ''}>15 giây</option>
                        </select>
                    </div>
                    <div id="zp-hopper-status" style="margin-top:8px;padding:8px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;font-size:11px;color:#166534;">
                        🚀 Trạng thái: Sẵn sàng
                    </div>
                </div>

                <!-- TAB 3: MOD CHEATS VIP -->
                <div class="zp-tab-content" id="tab-cheats" style="display:none;">
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
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">✨ Tăng Điểm Kinh Nghiệm (EXP)</div>
                            <div class="zp-desc">Hệ số nhân EXP khi diệt quái/làm quest để lên cấp siêu tốc</div>
                        </div>
                        <select class="zp-select" id="cfg-exp-mult">
                            <option value="1.0" ${CFG.cheats.expMultiplier === 1.0 ? 'selected' : ''}>1.0x (Mặc định)</option>
                            <option value="2.0" ${CFG.cheats.expMultiplier === 2.0 ? 'selected' : ''}>2.0x (Gấp 2 lần EXP)</option>
                            <option value="5.0" ${CFG.cheats.expMultiplier === 5.0 ? 'selected' : ''}>5.0x (Gấp 5 lần EXP)</option>
                            <option value="10.0" ${CFG.cheats.expMultiplier === 10.0 ? 'selected' : ''}>10.0x (Gấp 10 lần EXP)</option>
                            <option value="20.0" ${CFG.cheats.expMultiplier === 20.0 ? 'selected' : ''}>20.0x (Gấp 20 lần EXP)</option>
                            <option value="50.0" ${CFG.cheats.expMultiplier === 50.0 ? 'selected' : ''}>50.0x (Lên cấp Siêu Tốc)</option>
                        </select>
                    </div>
                </div>

                <!-- TAB 4: NÔNG TRẠI -->
                <div class="zp-tab-content" id="tab-farm" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🌾 Bật Auto Nông Trại</div>
                            <div class="zp-desc">Tổng kích hoạt chăm sóc vườn và thú cưng</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-en" ${CFG.farm.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
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

                <!-- TAB 5: NHIỆM VỤ -->
                <div class="zp-tab-content" id="tab-quests" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">📜 Tự động nhận thưởng nhiệm vụ</div>
                            <div class="zp-desc">Tự nhận quà Nhiệm Vụ Ngày, Tuần, Bounty khi xong</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-quest-en" ${CFG.quests.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">📅 Tự nhận Nhiệm Vụ Ngày</div>
                            <div class="zp-desc">Tự click nhận rương và quà ngày</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-quest-daily" ${CFG.quests.autoClaimDaily ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🎯 Tự nhận Lệnh Truy Nã (Bounty)</div>
                            <div class="zp-desc">Tự nhận thưởng truy nã khi quái bị diệt</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-quest-bounty" ${CFG.quests.autoClaimBounty ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- TAB 6: CÂU CÁ -->
                <div class="zp-tab-content" id="tab-fish" style="display:none;">
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🎣 Tự động câu cá (Auto Fish)</div>
                            <div class="zp-desc">Tự tìm hồ nước, quăng cần chuẩn xác và kéo cá lên 100%</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-en" ${CFG.fish.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⚡ Câu cá siêu tốc (Ultra Catch)</div>
                            <div class="zp-desc">Tự động thu hút cá và giật cần tức thì trong 0.1s</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-ultra" ${CFG.cheats.ultraFishing ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🔮 Triệu hồi Bóng Cá Bí Ẩn</div>
                            <div class="zp-desc">Tự động gọi bóng cá phát sáng khổng lồ mỗi khi quăng câu</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-mystery" ${CFG.fish.summonMystery ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🍀 Tăng Tỷ Lệ May Mắn Bắt Cá (+Luck)</div>
                            <div class="zp-desc">Tăng tối đa cơ hội cắn câu cá huyền thoại và kích thước khủng</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-fish-luck" ${CFG.fish.luckBuff ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- THỐNG KÊ HOẠT ĐỘNG -->
                <div class="zp-stats">
                    <div class="zp-stat-card">
                        <div class="zp-stat-val" id="stat-boss">0</div>
                        <div class="zp-stat-lbl">Boss Đã Diệt</div>
                    </div>
                    <div class="zp-stat-card">
                        <div class="zp-stat-val" id="stat-crops">0</div>
                        <div class="zp-stat-lbl">Nông Sản Thu Hoạch</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Nút tròn bật tắt nổi
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'zp-toggle-btn';
        toggleBtn.title = 'Ẩn / Hiện Bảng Menu Auto (F2)';
        toggleBtn.innerHTML = '🤖';
        document.body.appendChild(toggleBtn);

        bindUIEvents(container, toggleBtn);
    }

    function bindUIEvents(panel, toggleBtn) {
        // Toggle ẩn hiện menu
        toggleBtn.addEventListener('click', () => {
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        });

        document.getElementById('zp-close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
            }
        });

        // Tabs switching
        const tabs = panel.querySelectorAll('.zp-tab');
        const contents = panel.querySelectorAll('.zp-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.style.display = 'none');

                tab.classList.add('active');
                const target = document.getElementById('tab-' + tab.dataset.tab);
                if (target) target.style.display = 'block';
            });
        });

        // Fast Planet Buttons (1-Click Teleport)
        panel.querySelectorAll('.zp-planet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPlanet = btn.dataset.planet;
                travelToPlanet(targetPlanet);
            });
        });

        // Dropdown Teleport Button
        document.getElementById('zp-btn-teleport-go')?.addEventListener('click', () => {
            const sel = document.getElementById('zp-select-planet');
            if (sel) travelToPlanet(sel.value);
        });

        // Solo Dungeon 1-Click Button
        document.getElementById('zp-btn-dungeon-solo')?.addEventListener('click', () => {
            travelToPlanet('dungeon');
        });

        // Bind Config Checkboxes & Inputs
        const bindCheck = (id, obj, prop) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    obj[prop] = el.checked;
                    saveConfig();
                });
            }
        };

        const bindSelect = (id, obj, prop, isNum = false) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    obj[prop] = isNum ? parseFloat(el.value) : el.value;
                    saveConfig();
                });
            }
        };

        // Tab Boss
        bindCheck('cfg-combat-en', CFG.combat, 'enabled');
        bindCheck('cfg-skip-titans', CFG.combat, 'skipTitans');
        bindCheck('cfg-boss-only', CFG.combat, 'bossOnly');
        bindCheck('cfg-boss-hop', CFG.boss, 'autoHopPlanets');
        bindCheck('cfg-wait-quests', CFG.boss, 'waitForQuests');
        bindSelect('cfg-hop-delay', CFG.boss, 'hopDelay', true);

        // Tab Cheats
        bindCheck('cfg-no-cd', CFG.cheats, 'noCooldown');
        bindCheck('cfg-godmode', CFG.cheats, 'godMode');
        bindCheck('cfg-bright-shadow', CFG.cheats, 'brightShadow');
        bindCheck('cfg-magnet', CFG.cheats, 'globalMagnet');
        bindSelect('cfg-speed', CFG.cheats, 'speedBoost', true);
        bindSelect('cfg-atk', CFG.cheats, 'attackMultiplier', true);
        bindSelect('cfg-exp-mult', CFG.cheats, 'expMultiplier', true);

        // Tab Farm
        bindCheck('cfg-farm-en', CFG.farm, 'enabled');
        bindCheck('cfg-farm-harvest', CFG.farm, 'autoHarvest');
        bindCheck('cfg-farm-plant', CFG.farm, 'autoPlant');

        // Tab Quests
        bindCheck('cfg-quest-en', CFG.quests, 'enabled');
        bindCheck('cfg-quest-daily', CFG.quests, 'autoClaimDaily');
        bindCheck('cfg-quest-bounty', CFG.quests, 'autoClaimBounty');

        // Tab Fish
        bindCheck('cfg-fish-en', CFG.fish, 'enabled');
        bindCheck('cfg-fish-mystery', CFG.fish, 'summonMystery');
        bindCheck('cfg-fish-luck', CFG.fish, 'luckBuff');
        bindCheck('cfg-fish-ultra', CFG.cheats, 'ultraFishing');

        // Nút kết nối lại thủ công (Manual Reconnect) với cơ chế quét kiên trì 5s
        const reconnectBtn = document.getElementById('zp-reconnect-btn');
        if (reconnectBtn) {
            reconnectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                reconnectBtn.textContent = '⏳ Đang quét...';
                reconnectBtn.style.opacity = '0.7';
                forceReconnectGame((success) => {
                    reconnectBtn.style.opacity = '1';
                    if (success) {
                        reconnectBtn.textContent = '✅ Đã kết nối';
                        showToast('🟢 Đã kết nối thành công với Game Engine!');
                    } else {
                        reconnectBtn.textContent = '❌ Thử lại';
                        showToast('⚠️ Chưa tìm thấy Game Engine. Hãy đảm bảo bạn đã vào bản đồ game!');
                    }
                    setTimeout(() => {
                        reconnectBtn.textContent = '🔄 Kết nối lại';
                    }, 2500);
                });
            });
        }

        // Kéo thả menu (Drag & Drop)
        makeDraggable(panel, document.getElementById('zp-drag-handle'));
    }

    function updateStatusBadge(connected, customText) {
        const badge = document.querySelector('.zp-status-badge');
        if (badge) {
            if (connected) {
                badge.textContent = customText || '🟢 Đã kết nối';
                badge.style.background = '#DCFCE7';
                badge.style.color = '#15803D';
            } else {
                badge.textContent = customText || '🟡 Đang kết nối...';
                badge.style.background = '#FEF3C7';
                badge.style.color = '#92400E';
            }
        }
    }

    function updateHopperStatusUI(html) {
        const el = document.getElementById('zp-hopper-status');
        if (el) el.innerHTML = html;
    }

    function updateStatsUI() {
        const elBoss = document.getElementById('stat-boss');
        const elCrops = document.getElementById('stat-crops');
        if (elBoss) elBoss.textContent = stats.bossesKilled;
        if (elCrops) elCrops.textContent = stats.cropsHarvested;
    }

    function showToast(msg, duration = 3000) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #0284C7;
            color: #FFFFFF;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
            z-index: 9999999;
            pointer-events: none;
            transition: opacity 0.3s;
        `;
        toast.innerHTML = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // --- KHỞI ĐỘNG VẼ GIAO DIỆN NGAY KHI CÓ DOM ---
    if (document.body) {
        createUI();
    } else {
        document.addEventListener('DOMContentLoaded', createUI);
    }

})();
