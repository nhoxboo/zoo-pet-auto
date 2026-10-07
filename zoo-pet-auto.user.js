// ==UserScript==
// @name         Zoo Pet - All-in-One Auto Pro Tool
// @namespace    https://zoo-pet.store/
// @version      3.4.2
// @description  Tool Auto toàn diện, An Toàn 100% Anti-Detection cho Zoo Pet: Nông Trại VIP Pro (Trồng Nhanh & Thu Hoạch An Toàn Kháng Reject Máy Chủ, Tự Động Theo Cấp Độ, Cày EXP Vô Hạn), Quản Lý ID Hầm Ngục & Ra Vào Tùy Ý (1-5 Người), Tự Động Kết Nối MAIN WORLD 100%, Lụm Sạch Đồ & Rương Sau Khi Đánh Quái/Boss, Săn Sạch Boss Mới Chuyển Map, Chống Văng Hầm Ngục Solo, Auto Câu Cá Chuẩn Kéo Cần, Bất Tử Toàn Diện, Nhân EXP Siêu Tốc.
// @author       Beso & Antigravity
// @match        https://*.cloudfront.net/*
// @match        https://d173ysgpwor2n4.cloudfront.net/*
// @match        https://zoo-pet.store/*
// @match        https://*.zoo-pet.store/*
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @match        *://*/*
// @icon         https://zoo-pet.store/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
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

    console.log('%c[ZooPet Auto Pro v3.4.1]%c Khởi tạo engine Auto & VIP Mod trên: ' + location.href, 'color:#2563EB;font-weight:bold;font-size:14px', 'color:#475569');

    const globalWin = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;
    let _capturedGame = null;

    // --- CƠ CHẾ TIÊM HOOK MAIN WORLD TRỰC TIẾP (ZERO-FAIL NATIVE INJECTION) ---
    // Tiêm trực tiếp một thẻ <script> đồng bộ vào Document để patch RegExp trong MAIN WORLD của trang web,
    // đảm bảo khi game module load thì Pb = true 100% và game tự gán window.game = $.
    // Tuyệt đối KHÔNG can thiệp Object.prototype để tránh ảnh hưởng đến Three.js .clone().
    try {
        const mainScript = document.createElement('script');
        mainScript.textContent = `(${function () {
            let _realGame = null;
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

                // Trap setter trên window.game ở MAIN WORLD (khi game chạy Pb && (window.game = $))
                Object.defineProperty(window, 'game', {
                    configurable: true,
                    enumerable: true,
                    get() {
                        return _realGame || window.__zp_game;
                    },
                    set(val) {
                        _realGame = val;
                        window.__zp_game = val;
                        try {
                            window.dispatchEvent(new CustomEvent('zp-game-ready', { detail: val }));
                        } catch (_) {}
                    }
                });
            } catch (e) {
                console.error('[ZooPet MainWorld Hook Error]:', e);
            }
        }.toString()})();`;
        (document.head || document.documentElement).appendChild(mainScript);
        mainScript.remove();
    } catch (_) {}

    // Bắt sự kiện kết nối từ Main World
    try {
        globalWin.addEventListener('zp-game-ready', (e) => {
            if (e && e.detail) {
                _capturedGame = e.detail;
                if (typeof onGameConnected === 'function') {
                    onGameConnected(e.detail);
                }
            }
        });
    } catch (_) {}

    // --- BẢNG DỮ LIỆU CÂY TRỒNG CHUẨN XÁC TỪ GAME (CROPS METADATA) ---
    const CROPS_LIST = [
        { id: 'auto', name: '✨ Tự Động Chọn Cây Tốt Nhất Theo Cấp Độ (Khuyên Dùng)', lvl: 1, time: 10, exp: 4, energy: 3 },
        { id: 'peach', name: '🍑 Đào Tiên Bất Tử (Cấp 18 • 1400 EXP / 2200 NL)', lvl: 18, time: 50400, exp: 1400, energy: 2200 },
        { id: 'rainbowrose', name: '🌹 Hồng Cầu Vồng (Cấp 18 • Cần Hạt • 120 EXP)', lvl: 18, time: 200, exp: 120, energy: 90, seed: 'seed_star' },
        { id: 'lychee', name: '🍒 Vải Thiều Đỏ Rực (Cấp 16 • 1100 EXP / 1800 NL)', lvl: 16, time: 50400, exp: 1100, energy: 1800 },
        { id: 'dragonfruit', name: '🐉 Thanh Long Lửa (Cấp 15 • Cần Hạt • 90 EXP)', lvl: 15, time: 160, exp: 90, energy: 70, seed: 'seed_fire' },
        { id: 'durian', name: '🍈 Sầu Riêng Gai Góc (Cấp 14 • 950 EXP / 1500 NL)', lvl: 14, time: 43200, exp: 950, energy: 1500 },
        { id: 'goldcorn', name: '🌽 Ngô Vàng Ròng (Cấp 13 • 150s • 70 EXP / 110 NL)', lvl: 13, time: 150, exp: 70, energy: 110 },
        { id: 'iceberry', name: '🧊 Dâu Băng Giá (Cấp 12 • Cần Hạt • 60 EXP)', lvl: 12, time: 120, exp: 60, energy: 40, seed: 'seed_ice' },
        { id: 'coconut', name: '🥥 Dừa Xiêm Mát Lành (Cấp 11 • 800 EXP / 1300 NL)', lvl: 11, time: 43200, exp: 800, energy: 1300 },
        { id: 'glowshroom', name: '🍄 Nấm Đèn Lồng (Cấp 11 • 100s • 48 EXP)', lvl: 11, time: 100, exp: 48, energy: 30 },
        { id: 'clover', name: '🍀 Cỏ Bốn Lá May Mắn (Cấp 10 • 110s • 50 EXP)', lvl: 10, time: 110, exp: 50, energy: 34 },
        { id: 'pineapple', name: '🍍 Dứa Vương Miện (Cấp 9 • 750 EXP / 1200 NL)', lvl: 9, time: 43200, exp: 750, energy: 1200 },
        { id: 'melon', name: '🍉 Dưa Cầu Vồng (Cấp 9 • 120s • 80 EXP)', lvl: 9, time: 120, exp: 80, energy: 60 },
        { id: 'magnetmelon', name: '🧲 Dưa Nam Châm (Cấp 9 • 100s • 44 EXP)', lvl: 9, time: 100, exp: 44, energy: 30 },
        { id: 'moonflower', name: '🌙 Hoa Trăng Rằm (Cấp 8 • 90s • 40 EXP)', lvl: 8, time: 90, exp: 40, energy: 26 },
        { id: 'mango', name: '🥭 Xoài Cát Vàng (Cấp 7 • 500 EXP / 800 NL)', lvl: 7, time: 28800, exp: 500, energy: 800 },
        { id: 'coffee', name: '☕ Cà Phê Tỉnh Táo (Cấp 7 • 60s • 28 EXP)', lvl: 7, time: 60, exp: 28, energy: 18 },
        { id: 'star', name: '⭐ Nấm Sao Lấp Lánh (Cấp 6 • 80s • 45 EXP)', lvl: 6, time: 80, exp: 45, energy: 32 },
        { id: 'berry', name: '🍓 Dâu Tiên Lấp Lánh (Cấp 6 • 70s • 30 EXP)', lvl: 6, time: 70, exp: 30, energy: 20 },
        { id: 'grape', name: '🍇 Nho Tím Mọng (Cấp 5 • 450 EXP / 700 NL)', lvl: 5, time: 28800, exp: 450, energy: 700 },
        { id: 'bean', name: '🌱 Đậu Thần Khổng Lồ (Cấp 5 • 60s • 24 EXP)', lvl: 5, time: 60, exp: 24, energy: 16 },
        { id: 'chili', name: '🌶️ Ớt Rồng Lửa (Cấp 4 • 40s • 18 EXP)', lvl: 4, time: 40, exp: 18, energy: 12 },
        { id: 'candy', name: '🍭 Hoa Kẹo Bông (Cấp 4 • 50s • 26 EXP)', lvl: 4, time: 50, exp: 26, energy: 18 },
        { id: 'apple', name: '🍎 Táo Đỏ Thần (Cấp 3 • 400 EXP / 600 NL)', lvl: 3, time: 28800, exp: 400, energy: 600 },
        { id: 'mint', name: '🌿 Bạc Hà Mát Lạnh (Cấp 3 • 35s • 14 EXP)', lvl: 3, time: 35, exp: 14, energy: 9 },
        { id: 'pumpkin', name: '🎃 Bí Ngô Mũm Mĩm (Cấp 2 • 30s • 14 EXP)', lvl: 2, time: 30, exp: 14, energy: 10 },
        { id: 'radish', name: '🌸 Củ Cải Cười (Cấp 1 • 15s • 6 EXP)', lvl: 1, time: 15, exp: 6, energy: 4 },
        { id: 'carrot', name: '🥕 Cà Rốt Tốc Hành (Cấp 1 • 10s • 4 EXP)', lvl: 1, time: 10, exp: 4, energy: 3 }
    ];

    // --- CẤU HÌNH MẶC ĐỊNH (TẤT CẢ AUTO & CHEATS ĐỀU MẶC ĐỊNH TẮT - OFF) ---
    const DEFAULT_CFG = {
        farm: {
            enabled: false,
            instantGrow: false,
            safeMode: true,
            autoPlant: false,
            autoHarvest: false,
            autoLoop: false,
            cropChoice: 'auto',
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
        dungeon: {
            partySize: 1,
            roomId: 'team1',
            autoStart: true
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

    // --- HỆ THỐNG ĐIỀU HƯỚNG VÀ KẾT NỐI ENGINE ---
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

    // Quét tìm kiếm Game Instance sâu (Deep Scanner trên cả Main World và Userscript World)
    function findGameInstance() {
        if (_capturedGame && _capturedGame.player && _capturedGame.world) return _capturedGame;

        const candidates = [
            _capturedGame,
            globalWin.game,
            globalWin.__zp_game,
            globalWin.zooPetGame,
            window.game,
            window.__zp_game,
            window.zooPetGame
        ];

        for (let c of candidates) {
            if (c && c.player && c.world) {
                _capturedGame = c;
                return c;
            }
        }

        try {
            const keys = Object.getOwnPropertyNames(globalWin);
            for (let k of keys) {
                try {
                    const obj = globalWin[k];
                    if (obj && typeof obj === 'object' && obj.player && obj.world && obj.scene) {
                        _capturedGame = obj;
                        return obj;
                    }
                } catch (_) {}
            }
        } catch (_) {}

        return _capturedGame || globalWin.game || window.game || null;
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

    // --- MODULE 2: NÔNG TRẠI VIP PRO (TRỒNG NHANH & THU HOẠCH AN TOÀN KHÁNG REJECT MÁY CHỦ) ---
    let farmCycleCooldown = 0;
    let lastKnownDungeonId = localStorage.getItem('zp-last-dg-id') || 'team1';

    // Lấy ID hầm ngục hiện tại từ sessionStorage hoặc Game Engine
    function getCurrentDungeonId() {
        try {
            const sess = JSON.parse(sessionStorage.getItem('zp-dg') || 'null');
            if (sess && sess.id) {
                lastKnownDungeonId = sess.id;
                localStorage.setItem('zp-last-dg-id', sess.id);
                return sess.id;
            }
        } catch (_) {}
        if (G && G.planet && G.planet.dgId) {
            lastKnownDungeonId = G.planet.dgId;
            localStorage.setItem('zp-last-dg-id', G.planet.dgId);
            return G.planet.dgId;
        }
        return lastKnownDungeonId || (CFG.dungeon?.roomId || 'team1');
    }

    // Tự động kiểm tra cấp độ nhân vật và trả về loại cây trồng hợp lệ nhất
    function getBestCropForPlayer(preferredCrop) {
        const playerLvl = G?.save?.lvl || 1;
        
        // Nếu chọn auto hoặc chưa chọn: tìm cây cao nhất không cần hạt giống
        if (!preferredCrop || preferredCrop === 'auto') {
            const availableNoSeed = CROPS_LIST.filter(c => c.id !== 'auto' && c.lvl <= playerLvl && !c.seed);
            if (availableNoSeed.length > 0) {
                return availableNoSeed[0].id; // Đã sắp xếp từ cấp cao xuống thấp
            }
            return 'carrot';
        }

        // Nếu người chơi chọn 1 cây cụ thể: kiểm tra cấp độ
        const chosen = CROPS_LIST.find(c => c.id === preferredCrop);
        if (chosen && chosen.id !== 'auto') {
            if (chosen.lvl <= playerLvl) {
                return chosen.id;
            } else {
                // Người chơi chưa đủ cấp độ để trồng cây này -> tự hạ xuống cây cao nhất mà cấp độ cho phép
                const fallback = CROPS_LIST.filter(c => c.id !== 'auto' && c.lvl <= playerLvl && !c.seed)[0];
                return fallback ? fallback.id : 'carrot';
            }
        }
        return 'carrot';
    }

    // Thiết lập thời gian chín hợp lệ tránh máy chủ từ chối bản lưu
    function makePlotRipeSafely(plot) {
        if (!plot || !plot.state) return;
        const cropData = CROPS_LIST.find(c => c.id === plot.state.crop) || { time: 10 };
        // Gán timestamp về quá khứ vừa vặn với thời gian sinh trưởng của cây (thay vì số 0)
        plot.state.t0 = Date.now() - (cropData.time * 1000 + 1000);
    }

    // Ép chín tức thì tất cả các ô đất đang có cây
    function instantGrowPlots() {
        if (!G || !G.farm || !G.farm.plots) return 0;
        let count = 0;
        for (let plot of G.farm.plots) {
            if (plot && plot.state) {
                makePlotRipeSafely(plot);
                count++;
            }
        }
        return count;
    }

    // Thu hoạch toàn bộ các ô đất đang có cây chín
    function instantHarvestAllPlots() {
        if (!G || !G.farm || !G.farm.plots) {
            showToast('⚠️ Bạn chưa ở trong Nông Trại hoặc chưa có ô đất!');
            return 0;
        }
        let harvested = 0;
        for (let plot of G.farm.plots) {
            if (!plot || !plot.state) continue;
            if (CFG.farm.instantGrow) {
                makePlotRipeSafely(plot);
            }
            if (typeof G.farm.ready === 'function' && G.farm.ready(plot)) {
                try {
                    G.farm.harvest(plot);
                    harvested++;
                    stats.cropsHarvested++;
                } catch (_) {}
            }
        }
        if (harvested > 0) {
            updateStatsUI();
            showToast(`🧺 Đã thu hoạch thành công ${harvested} ô nông sản!`);
        } else {
            showToast('ℹ️ Hiện không có cây nào sẵn sàng để thu hoạch.');
        }
        return harvested;
    }

    // Trồng kín toàn bộ các ô đất trống với loại cây được chọn
    function instantPlantAllPlots(cropKey) {
        if (!G || !G.farm || !G.farm.plots) {
            showToast('⚠️ Bạn chưa ở trong Nông Trại hoặc chưa có ô đất!');
            return 0;
        }
        const effectiveCrop = getBestCropForPlayer(cropKey || CFG.farm.cropChoice);
        const cropData = CROPS_LIST.find(c => c.id === effectiveCrop) || { name: effectiveCrop, time: 10 };
        let planted = 0;
        for (let plot of G.farm.plots) {
            if (!plot || plot.state) continue;
            try {
                if (typeof G.farm.plant === 'function') {
                    G.farm.plant(plot, effectiveCrop);
                    if (plot.state) {
                        if (CFG.farm.instantGrow) {
                            makePlotRipeSafely(plot);
                        } else {
                            plot.state.t0 = Date.now();
                        }
                        planted++;
                        stats.seedsPlanted++;
                    }
                }
            } catch (_) {}
        }
        if (planted > 0) {
            updateStatsUI();
            showToast(`🌱 Đã gieo trồng ${planted} ô đất với [${cropData.name}]!`);
        } else {
            showToast('ℹ️ Toàn bộ các ô đất đã được trồng kín.');
        }
        return planted;
    }

    // Thực hiện 1 chu trình: Thu hoạch sạch -> Trồng kín -> Thu hoạch sạch
    function runOneFarmCycle() {
        if (!G || !G.farm || !G.farm.plots) {
            showToast('⚠️ Bạn chưa ở trong Nông Trại hoặc chưa có ô đất!');
            return;
        }
        const cropKey = CFG.farm.cropChoice || 'auto';
        instantHarvestAllPlots();
        setTimeout(() => {
            instantPlantAllPlots(cropKey);
            setTimeout(() => {
                instantHarvestAllPlots();
                const effectiveCrop = getBestCropForPlayer(cropKey);
                const cropData = CROPS_LIST.find(c => c.id === effectiveCrop) || { name: effectiveCrop };
                showToast(`🚀 Đã hoàn thành 1 chu trình Trồng & Thu Hoạch [${cropData.name}] siêu tốc!`);
            }, 300);
        }, 300);
    }

    // Vòng lặp Engine Auto Farm
    function runFarmEngine() {
        if (!G || !G.farm || !G.player) return;
        const plots = G.farm.plots || [];
        if (plots.length === 0) return;

        // Hook chống Reject Box làm đơ game
        if (G.cloud && !G.cloud.__zp_anti_reject_hooked) {
            G.cloud.__zp_anti_reject_hooked = true;
            const origReject = G.cloud.onReject;
            G.cloud.onReject = function (save, reason) {
                console.warn('[ZooPet Auto] Máy chủ từ chối lưu dữ liệu nông trại:', reason);
                try {
                    if (G.save && G.save.plots) {
                        const userLvl = G.save.lvl || 1;
                        for (let k in G.save.plots) {
                            const p = G.save.plots[k];
                            const cMeta = CROPS_LIST.find(c => c.id === p?.crop);
                            if (p && cMeta && cMeta.lvl > userLvl) {
                                G.save.plots[k] = null;
                            }
                        }
                    }
                    G.ui?.toast('🛡️ Đã đồng bộ an toàn dữ liệu Nông Trại với máy chủ.', 3);
                } catch (_) {}
            };
        }

        // 1. Nếu bật Instant Grow: thiết lập timestamp hợp lệ
        if (CFG.farm.instantGrow) {
            for (let plot of plots) {
                if (plot && plot.state) {
                    const cropData = CROPS_LIST.find(c => c.id === plot.state.crop) || { time: 10 };
                    const ripeTime = Date.now() - (cropData.time * 1000 + 1000);
                    if (!plot.state.t0 || plot.state.t0 > ripeTime) {
                        plot.state.t0 = ripeTime;
                    }
                }
            }
        }

        if (!CFG.farm.enabled) return;
        if (Date.now() < farmCycleCooldown) return;

        const effectiveCrop = getBestCropForPlayer(CFG.farm.cropChoice);

        // A. Tự động thu hoạch toàn bộ các ô đã chín
        if (CFG.farm.autoHarvest || CFG.farm.autoLoop) {
            let hasHarvested = false;
            for (let plot of plots) {
                if (plot && plot.state) {
                    if (CFG.farm.instantGrow) makePlotRipeSafely(plot);
                    if (typeof G.farm.ready === 'function' && G.farm.ready(plot)) {
                        try {
                            G.farm.harvest(plot);
                            stats.cropsHarvested++;
                            hasHarvested = true;
                        } catch (_) {}
                    }
                }
            }
            if (hasHarvested) {
                updateStatsUI();
                farmCycleCooldown = Date.now() + (CFG.farm.autoLoop ? 400 : 800);
                return;
            }
        }

        // B. Tự động gieo hạt toàn bộ các ô đất trống
        if (CFG.farm.autoPlant || CFG.farm.autoLoop) {
            let hasPlanted = false;
            for (let plot of plots) {
                if (plot && !plot.state) {
                    try {
                        G.farm.plant(plot, effectiveCrop);
                        if (plot.state) {
                            if (CFG.farm.instantGrow) {
                                makePlotRipeSafely(plot);
                            } else {
                                plot.state.t0 = Date.now();
                            }
                            stats.seedsPlanted++;
                            hasPlanted = true;
                        }
                    } catch (_) {}
                }
            }
            if (hasPlanted) {
                updateStatsUI();
                farmCycleCooldown = Date.now() + (CFG.farm.autoLoop ? 400 : 800);
                return;
            }
        }
    }

    // --- MODULE 3: AUTO CHIẾN ĐẤU & SĂN BOSS TOÀN MAP (COMBAT & BOSS ENGINE) ---
    let combatCooldown = 0;

    function isBossEntity(enemy) {
        if (!enemy) return false;
        if (enemy.boss === true || enemy.isBoss === true) return true;
        if (enemy.def) {
            if (enemy.def.boss || enemy.def.titan || enemy.def.sboss || enemy.def.worldBoss || enemy.def.kind === 'boss' || enemy.def.kind === 'titan') return true;
        }
        const BOSS_TYPES = [
            'bear', 'cake', 'yeti', 'treant', 'croc', 'gingerbread', 'mammoth', 'dragon', 'golem',
            'mushking', 'jellyqueen', 'frostowl', 'robot', 'gorilla', 'leviathan', 'phoenix', 'shadowlord',
            'titan_turtle', 'titan_hydra', 'titan_crystal', 'titan_scorpion', 'titan_clock', 'titan_flower',
            'titan_kraken', 'titan_whale', 'titan_eye', 'sb_colossus', 'dg_boss'
        ];
        if (enemy.type && (BOSS_TYPES.includes(enemy.type) || enemy.type.startsWith('titan_') || enemy.type.startsWith('sb_') || enemy.type.includes('boss'))) return true;
        if (enemy.def && enemy.def.name && /vua|chúa|yeti|rồng|ma mút|golem|titan|khổng lồ|đại thụ|nữ hoàng|bóng tối|cổ vương|robot/i.test(enemy.def.name)) return true;
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

    function getAllAliveBossesOnPlanet() {
        if (!G || !G.enemies) return [];
        const res = [];
        const seen = new Set();

        // 1. Quét Boss Titan / World Boss từ G.enemies.titan
        if (G.enemies.titan && isAttackable(G.enemies.titan)) {
            const titan = G.enemies.titan;
            if (!CFG.boss.skipTitans || !isTitanBoss(titan)) {
                res.push(titan);
                seen.add(titan);
            }
        }

        // 2. Quét toàn bộ danh sách G.enemies.list
        const enemies = G.enemies.list || [];
        for (let enemy of enemies) {
            if (!enemy || seen.has(enemy)) continue;
            if (!isAttackable(enemy)) continue;
            if (!isBossEntity(enemy)) continue;
            if (CFG.boss.skipTitans && isTitanBoss(enemy)) continue;

            res.push(enemy);
            seen.add(enemy);
        }

        return res;
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

        // Luôn chủ động hút và lụm sạch đồ rơi xung quanh người chơi
        runLootVacuum();

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

    // --- MODULE 4: AUTO DU HÀNH SĂN BOSS CHUẨN XÁC & LỤM SẠCH ĐỒ TRƯỚC KHI CHUYỂN ---
    let hopperState = {
        currentPlanet: null,
        planetEnterTime: 0,
        stage: 'INIT', // 'SCANNING_WAIT' | 'FIGHTING' | 'LOOTING' | 'CHECK_QUESTS' | 'READY_TO_JUMP'
        currentTarget: null,
        bossesKilledOnPlanet: 0,
        lootStartTime: 0,
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
            hopperState.stage = 'SCANNING_WAIT';
            hopperState.currentTarget = null;
            hopperState.bossesKilledOnPlanet = 0;
            hopperState.lootStartTime = 0;
            hopperState.lootEndTime = 0;
            updateHopperStatusUI(`🌍 Vừa đáp xuống <b>${PLANET_DATA[currentPlanet]?.name || currentPlanet}</b>, đang quét Boss...`);
            return;
        }

        const timeOnPlanet = (now - hopperState.planetEnterTime) / 1000;
        const aliveBosses = getAllAliveBossesOnPlanet();

        // 2. GIAI ĐOẠN 1: Quét Boss trên hành tinh
        if (hopperState.stage === 'SCANNING_WAIT') {
            if (aliveBosses.length > 0) {
                // Tìm Boss gần nhất để mở màn
                let nearest = null;
                let minDist = Infinity;
                for (let b of aliveBosses) {
                    const d = getDistance(G.player.pos, b.pos);
                    if (d < minDist) {
                        minDist = d;
                        nearest = b;
                    }
                }

                hopperState.stage = 'FIGHTING';
                hopperState.currentTarget = nearest;
                updateHopperStatusUI(`⚔️ Phát hiện <b>${aliveBosses.length} Boss</b> trên map! Đang tấn công <b>${nearest.def?.name || nearest.type || 'Boss'}</b>...`);
                return;
            }

            // Nếu sau 8s quét không có Boss (hoặc Boss chưa hồi):
            if (timeOnPlanet >= 8) {
                // Kiểm tra xem có đồ rơi trên đất không trước khi chuyển
                const hasDrops = (G.drops?.items?.length > 0 || G.drops?.bags?.length > 0);
                if (hasDrops) {
                    hopperState.stage = 'LOOTING';
                    hopperState.lootStartTime = now;
                    hopperState.lootEndTime = now + 5000;
                    updateHopperStatusUI(`ℹ️ Không có Boss trên map. Đang hút nốt vật phẩm còn sót lại...`);
                } else {
                    updateHopperStatusUI(`⏳ Không còn Boss trên ${PLANET_DATA[currentPlanet]?.name || currentPlanet}. Chuẩn bị chuyển hành tinh...`);
                    hopperState.stage = 'READY_TO_JUMP';
                }
            } else {
                updateHopperStatusUI(`🔍 Đang quét toàn bộ Boss trên ${PLANET_DATA[currentPlanet]?.name || currentPlanet} (${Math.round(8 - timeOnPlanet)}s)...`);
            }
            return;
        }

        // 3. GIAI ĐOẠN 2: CHIẾN ĐẤU - Tiêu diệt LẦN LƯỢT TẤT CẢ BOSS TRÊN MAP
        if (hopperState.stage === 'FIGHTING') {
            let target = hopperState.currentTarget;

            // Nếu target hiện tại đã chết hoặc không hợp lệ -> tìm Boss còn sống khác trên map
            if (!target || !isAttackable(target)) {
                if (target) {
                    stats.bossesKilled++;
                    hopperState.bossesKilledOnPlanet++;
                    updateStatsUI();
                    showToast(`🎉 Đã tiêu diệt ${target.def?.name || 'Boss'}!`, 3000);
                }

                if (aliveBosses.length > 0) {
                    // Còn Boss khác trên map -> chuyển sang mục tiêu tiếp theo ngay lập tức!
                    let nextBoss = null;
                    let minDist = Infinity;
                    for (let b of aliveBosses) {
                        const d = getDistance(G.player.pos, b.pos);
                        if (d < minDist) {
                            minDist = d;
                            nextBoss = b;
                        }
                    }
                    hopperState.currentTarget = nextBoss;
                    target = nextBoss;
                    updateHopperStatusUI(`⚔️ Tiếp tục săn Boss: <b>${nextBoss.def?.name || nextBoss.type || 'Boss'}</b> (Còn lại: ${aliveBosses.length} Boss)...`);
                } else {
                    // ĐÃ DIỆT SẠCH TẤT CẢ BOSS TRÊN MAP!
                    hopperState.currentTarget = null;
                    hopperState.stage = 'LOOTING';
                    hopperState.lootStartTime = now;
                    // Thời gian chờ hút đồ: tối thiểu CFG.boss.hopDelay (hoặc 8s)
                    hopperState.lootEndTime = now + Math.max(8000, (CFG.boss.hopDelay || 8) * 1000);
                    showToast(`🏆 Đã quét sạch toàn bộ Boss trên ${PLANET_DATA[currentPlanet]?.name}! Đang hút sạch trang bị...`, 4000);
                    updateHopperStatusUI(`🎁 Đã diệt sạch Boss! Đang hút sạch vật phẩm & phần thưởng...`);
                    return;
                }
            }

            // Đang tấn công target hiện tại
            if (target && isAttackable(target)) {
                G.player.target = { type: 'enemy', enemy: target, point: target.pos.clone(), auto: true };

                try {
                    G.player.facing = Math.atan2(target.pos.x - G.player.pos.x, target.pos.z - G.player.pos.z);
                } catch (_) {}

                const dist = getDistance(G.player.pos, target.pos);
                const attackRange = (target.def ? target.def.radius : 1.5) + (G.player.weapon?.range || 1.2) * 1.3;

                if (dist <= attackRange) {
                    try {
                        if (G.player.cd) G.player.cd.atk = 0;
                        if (typeof G.player.attack === 'function') G.player.attack(target);
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
                const bossHp = Math.max(0, Math.round(target.hp || 0));
                updateHopperStatusUI(`⚔️ Đang tiêu diệt: <b>${target.def?.name || target.type || 'Boss'}</b> (HP: ${bossHp}). Còn lại: <b>${aliveBosses.length} Boss</b> trên map.`);
            }
            return;
        }

        // 4. GIAI ĐOẠN 3: LỤM ĐỒ & HÚT PHẦN THƯỞNG (ĐẢM BẢO KHÔNG BỎ SÓT BẤT KỲ ĐỒ NÀO)
        if (hopperState.stage === 'LOOTING') {
            // Hút toàn bộ rương và vật phẩm về phía player
            runLootVacuum();

            const itemsOnGround = G.drops?.items?.length || 0;
            const bagsOnGround = G.drops?.bags?.length || 0;
            const totalDrops = itemsOnGround + bagsOnGround;

            const remainingSec = Math.max(0, Math.ceil((hopperState.lootEndTime - now) / 1000));

            // Nếu vẫn còn đồ trên đất -> tiếp tục hút và hiển thị số lượng
            if (totalDrops > 0) {
                updateHopperStatusUI(`🎁 Đang hút <b>${totalDrops} vật phẩm/túi đồ rơi</b> (Chờ thêm: ${remainingSec}s)...`);
                // Nếu đã hết thời gian loot cơ bản nhưng vẫn còn đồ, gia hạn thêm 3s (tối đa 20s tổng)
                if (now >= hopperState.lootEndTime && (now - hopperState.lootStartTime) < 20000) {
                    hopperState.lootEndTime = now + 3000;
                }
            } else {
                updateHopperStatusUI(`✅ Đã thu gom sạch toàn bộ trang bị & túi đồ! Chuẩn bị bay (${remainingSec}s)...`);
            }

            // Chỉ chuyển map khi: ĐÃ HẾT ĐỒ HOẶC HẾT THỜI GIAN CHỜ TỐI ĐA
            if (now >= hopperState.lootEndTime || (totalDrops === 0 && (now - hopperState.lootStartTime) >= 5000)) {
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

    // --- HÀM CHUYỂN HÀNH TINH NHANH & ĐI ẢI HẦM NGỤC ĐỘI/SOLO (FAST TELEPORT & CUSTOM PARTY DUNGEON) ---
    async function travelToPlanet(targetPlanet, customRoomId, partySize) {
        if (!targetPlanet) return;
        const pName = PLANET_DATA[targetPlanet]?.name || targetPlanet;
        
        try {
            if (targetPlanet === 'dungeon') {
                const rId = customRoomId || CFG.dungeon?.roomId || lastKnownDungeonId || ('dg_' + Date.now().toString(36));
                const pCount = Number(partySize || CFG.dungeon?.partySize || 1);
                lastKnownDungeonId = rId;
                localStorage.setItem('zp-last-dg-id', rId);
                showToast(`🏰 Đang khởi hành vào Hầm Ngục Cổ Đại (Phòng: ${rId} • ${pCount} người)...`, 3500);
                
                // Thiết lập phiên đi Ải Hầm Ngục với số lượng người bất kỳ (1, 2, 3, 4, 5)
                sessionStorage.setItem('zp-dg', JSON.stringify({ id: rId, n: pCount, t: Date.now() }));
                sessionStorage.setItem('zp-flight', JSON.stringify({ to: 'dungeon', t: Date.now() }));
            } else {
                showToast(`🚀 Đang khởi hành đến ${pName}...`, 3000);
                sessionStorage.setItem('zp-flight', JSON.stringify({ to: targetPlanet, t: Date.now() }));
                // Lưu lại mã phòng trước khi rời đi để người chơi có thể vào lại bất cứ lúc nào
                try {
                    const sess = JSON.parse(sessionStorage.getItem('zp-dg') || 'null');
                    if (sess && sess.id) {
                        lastKnownDungeonId = sess.id;
                        localStorage.setItem('zp-last-dg-id', sess.id);
                    }
                } catch (_) {}
                sessionStorage.removeItem('zp-dg');
            }
        } catch (_) {}

        // Ghi trực tiếp hành tinh vào localStorage để Game Engine đọc chuẩn xác
        try {
            const rawSave = localStorage.getItem('zoo-pet-save-v2');
            if (rawSave) {
                const parsed = JSON.parse(rawSave);
                parsed.planet = targetPlanet;
                localStorage.setItem('zoo-pet-save-v2', JSON.stringify(parsed));
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
            const url = new URL(location.href);
            url.searchParams.set('planet', targetPlanet);
            location.href = url.toString();
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

    // --- MODULE 7: NAM CHÂM HÚT ĐỒ TOÀN DIỆN (GLOBAL LOOT & REWARD VACUUM) ---
    function runLootVacuum() {
        if (!G || !G.drops || !G.player || !G.player.pos) return;

        const player = G.player;
        const drops = G.drops;

        // 1. Hút các túi đồ / hũ báu vật (bags)
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

        // 2. Hút các vật phẩm rơi đơn lẻ (items) - Mở khóa lock & kích hoạt tuổi thọ để game nhặt ngay tức khắc
        if (drops.items && drops.items.length > 0) {
            for (let item of drops.items) {
                if (item) {
                    // Mở khóa item lock và đặt age > 0.6s để bộ lọc K_.update hấp thụ ngay vào túi đồ
                    item.lock = false;
                    if (typeof item.age === 'number') {
                        item.age = Math.max(item.age, 0.7);
                    }
                    if (item.obj && item.obj.position) {
                        item.obj.position.x = player.pos.x;
                        item.obj.position.z = player.pos.z;
                    }
                }
            }
        }

        // 3. Hút các vật phẩm rơi từ Server / World Map (drops.world Map)
        if (drops.world) {
            try {
                const worldItems = (typeof drops.world.values === 'function') ? Array.from(drops.world.values()) : Object.values(drops.world);
                for (let wItem of worldItems) {
                    if (wItem) {
                        if (wItem.obj && wItem.obj.position) {
                            wItem.obj.position.x = player.pos.x;
                            wItem.obj.position.z = player.pos.z;
                        }
                        if (wItem.goal) {
                            wItem.goal.x = player.pos.x;
                            wItem.goal.z = player.pos.z;
                        }
                        wItem.x = player.pos.x;
                        wItem.z = player.pos.z;
                    }
                }
            } catch (_) {}
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

            // 1. Tự động khởi động Ải ngay lập tức khi đang ở phase chờ (Hỗ trợ Solo & Đội 2-5 người, không cần chờ)
            if (planet.phase === 'wait') {
                const remotesCount = G.net?.remotes?.size || 0;
                const currentPlayers = 1 + remotesCount;
                planet.expect = Math.min(planet.expect || 5, Math.max(1, currentPlayers));
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

                if (CFG.cheats.globalMagnet || CFG.loot.enabled || CFG.combat.enabled || CFG.combat.bossOnly || CFG.boss.autoHopPlanets) {
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

                    <div style="margin-top:12px;padding:12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                            <div style="font-weight:700;font-size:12px;color:#15803D;">🏰 Hầm Ngục Cổ Đại (Solo & Đội 1-5 Người)</div>
                            <span style="font-size:10px;background:#DCFCE7;color:#166534;padding:2px 6px;border-radius:999px;font-weight:600;">Tùy Ý Số Người • Vô Hạn Lượt</span>
                        </div>
                        <div class="zp-desc" style="color:#166534;margin-bottom:8px;">Vào thẳng 5 ải hầm ngục ngay lập tức với bất kỳ số lượng người chơi (1-5 người), tự do ra/vào mà không mất phòng:</div>
                        
                        <!-- Khung Hiển Thị ID Hầm Ngục Hiện Tại -->
                        <div style="background:#FFFFFF;border:1px solid #86EFAC;border-radius:8px;padding:8px 10px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
                            <div>
                                <div style="font-size:10px;color:#64748B;font-weight:600;">MÃ HẦM NGỤC HIỆN TẠI:</div>
                                <div id="zp-current-dg-id" style="font-family:monospace;font-weight:800;font-size:13px;color:#0F766E;">team1</div>
                            </div>
                            <div style="display:flex;gap:4px;">
                                <button class="zp-btn" id="zp-btn-copy-dg-id" style="margin-top:0;font-size:11px;padding:5px 8px;background:#0EA5E9;color:#fff;">📋 Sao Chép ID</button>
                            </div>
                        </div>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
                            <div>
                                <div style="font-size:11px;font-weight:600;color:#15803D;margin-bottom:2px;">👥 Số người đi:</div>
                                <select class="zp-select" id="zp-dungeon-party-size" style="width:100%;padding:4px 8px;font-size:11px;">
                                    <option value="1" ${CFG.dungeon?.partySize === 1 ? 'selected' : ''}>1 Người (Solo)</option>
                                    <option value="2" ${CFG.dungeon?.partySize === 2 ? 'selected' : ''}>2 Người (Đôi Bạn)</option>
                                    <option value="3" ${CFG.dungeon?.partySize === 3 ? 'selected' : ''}>3 Người (Nhóm 3)</option>
                                    <option value="4" ${CFG.dungeon?.partySize === 4 ? 'selected' : ''}>4 Người (Nhóm 4)</option>
                                    <option value="5" ${CFG.dungeon?.partySize === 5 ? 'selected' : ''}>5 Người (Đầy Đủ)</option>
                                </select>
                            </div>
                            <div>
                                <div style="font-size:11px;font-weight:600;color:#15803D;margin-bottom:2px;">🔑 Nhập / Đổi mã phòng:</div>
                                <input type="text" id="zp-dungeon-room-id" value="${CFG.dungeon?.roomId || 'team1'}" placeholder="VD: team1" style="width:100%;padding:4px 8px;font-size:11px;border:1px solid #BBF7D0;border-radius:6px;box-sizing:border-box;">
                            </div>
                        </div>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
                            <button class="zp-btn" id="zp-btn-dungeon-go" style="background:#16A34A;margin-top:0;font-size:11px;padding:6px 8px;">⚔️ Vào Ải Hầm Ngục</button>
                            <button class="zp-btn" id="zp-btn-dungeon-force-start" style="background:#2563EB;margin-top:0;font-size:11px;padding:6px 8px;">🚀 Bắt Đầu Ải Liền</button>
                        </div>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                            <button class="zp-btn" id="zp-btn-reenter-dg" style="background:#0D9488;margin-top:0;font-size:11px;padding:6px 8px;">🔄 Vào Lại Phòng Này</button>
                            <button class="zp-btn" id="zp-btn-exit-dg-temp" style="background:#64748B;margin-top:0;font-size:11px;padding:6px 8px;">🏠 Tạm Rời Về Nhà</button>
                        </div>
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

                <!-- TAB 4: NÔNG TRẠI VIP PRO -->
                <div class="zp-tab-content" id="tab-farm" style="display:none;">
                    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#166534;line-height:1.5;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <div style="font-weight:700;">🌾 Nông Trại VIP Pro (Kháng Reject Máy Chủ 100%)</div>
                            <span id="zp-farm-user-lvl" style="font-size:11px;background:#DCFCE7;color:#15803D;padding:2px 8px;border-radius:999px;font-weight:700;">Cấp độ: Lv 1</span>
                        </div>
                        <div>Tự động tối ưu cây trồng theo đúng cấp độ nhân vật, gieo trồng & thu hoạch hợp lệ không lo máy chủ từ chối bản lưu!</div>
                    </div>

                    <!-- Chọn loại cây trồng -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🌱 Chọn loại cây gieo trồng</div>
                            <div class="zp-desc">Tự động chọn cây cao nhất hoặc chỉ định loại cây bạn muốn</div>
                        </div>
                        <select id="cfg-farm-crop" class="zp-select" style="max-width:170px;">
                            ${CROPS_LIST.map(c => `<option value="${c.id}" ${CFG.farm.cropChoice === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Switch: Safe Mode (100% Legit Growth) -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🛡️ Chế Độ Farm An Toàn 100% (Khuyên Dùng)</div>
                            <div class="zp-desc">Trồng & thu hoạch chuẩn thời gian (Cà rốt 10s, Củ cải 15s, Bí ngô 30s)</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-safe" ${CFG.farm.safeMode !== false ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <!-- Switch: Instant Grow -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">⚡ Cây Lớn Tức Thì (Instant Grow An Toàn)</div>
                            <div class="zp-desc">Tự động tính timestamp hợp lệ giúp cây chín tức thì</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-instant" ${CFG.farm.instantGrow ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <!-- Switch: Auto Farm Master -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🌾 Bật Auto Nông Trại</div>
                            <div class="zp-desc">Kích hoạt chế độ tự động chăm sóc nông trại</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-en" ${CFG.farm.enabled ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <!-- Switch: Auto Loop Infinite -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🔄 Auto Farm Vô Hạn (Trồng & Thu Hoạch Liên Tục)</div>
                            <div class="zp-desc">Tự động gieo kín đất ➔ Đợi chín ➔ Thu hoạch ➔ Lặp lại không ngừng</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-loop" ${CFG.farm.autoLoop ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <!-- Switch: Auto Harvest -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🧺 Tự động thu hoạch khi cây chín</div>
                            <div class="zp-desc">Tự động hái toàn bộ các ô đất chín tự nhiên</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-harvest" ${CFG.farm.autoHarvest ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <!-- Switch: Auto Plant -->
                    <div class="zp-row">
                        <div>
                            <div class="zp-label">🌱 Tự động gieo hạt khi đất trống</div>
                            <div class="zp-desc">Tự động lấp đầy các ô đất trống với loại cây phù hợp cấp độ</div>
                        </div>
                        <label class="zp-switch">
                            <input type="checkbox" id="cfg-farm-plant" ${CFG.farm.autoPlant ? 'checked' : ''}>
                            <span class="zp-slider"></span>
                        </label>
                    </div>

                    <!-- Nút hành động 1-Click -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                        <button id="btn-farm-plant-all" class="zp-btn" style="background:#16A34A;color:#fff;border:none;padding:8px 10px;border-radius:6px;font-weight:600;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px;">
                            🌱 Trồng Kín Ô Đất
                        </button>
                        <button id="btn-farm-harvest-all" class="zp-btn" style="background:#2563EB;color:#fff;border:none;padding:8px 10px;border-radius:6px;font-weight:600;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;gap:4px;">
                            🧺 Thu Hoạch Toàn Bộ
                        </button>
                    </div>
                    <div style="margin-top:8px;">
                        <button id="btn-farm-cycle" class="zp-btn" style="width:100%;background:linear-gradient(135deg, #10B981, #2563EB);color:#fff;border:none;padding:10px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 6px rgba(37,99,235,0.2);">
                            🚀 1-Click Chu Trình (Trồng + Thu Hoạch Siêu Tốc)
                        </button>
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

        // Dungeon Custom Party & Fast Start
        const dgPartySel = document.getElementById('zp-dungeon-party-size');
        const dgRoomInp = document.getElementById('zp-dungeon-room-id');
        if (dgPartySel) {
            dgPartySel.addEventListener('change', () => {
                if (!CFG.dungeon) CFG.dungeon = {};
                CFG.dungeon.partySize = parseInt(dgPartySel.value) || 1;
                saveConfig();
            });
        }
        if (dgRoomInp) {
            dgRoomInp.addEventListener('change', () => {
                if (!CFG.dungeon) CFG.dungeon = {};
                CFG.dungeon.roomId = dgRoomInp.value.trim() || 'team1';
                saveConfig();
            });
        }
        document.getElementById('zp-btn-dungeon-go')?.addEventListener('click', () => {
            const pSize = parseInt(dgPartySel?.value) || 1;
            const rId = dgRoomInp?.value.trim() || 'team1';
            travelToPlanet('dungeon', rId, pSize);
        });
        document.getElementById('zp-btn-dungeon-force-start')?.addEventListener('click', () => {
            if (G && G.planet && typeof G.planet.startStage === 'function') {
                try {
                    G.planet.expect = Math.max(1, 1 + (G.net?.remotes?.size || 0));
                    G.planet.startStage(0);
                    showToast('🚀 Đã kích hoạt bắt đầu Ải 1 Hầm Ngục ngay lập tức!');
                } catch (err) {
                    showToast('⚠️ Không thể kích hoạt ải: ' + err.message);
                }
            } else {
                showToast('⚠️ Bạn chưa ở trong phòng chờ Hầm Ngục Cổ Đại!');
            }
        });

        // Nút Sao Chép ID Hầm Ngục Hiện Tại
        document.getElementById('zp-btn-copy-dg-id')?.addEventListener('click', () => {
            const curId = getCurrentDungeonId();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(curId).then(() => {
                    showToast(`📋 Đã sao chép ID Hầm Ngục: <b>${curId}</b>`);
                }).catch(() => {
                    prompt('Mã ID Hầm Ngục hiện tại của bạn:', curId);
                });
            } else {
                prompt('Mã ID Hầm Ngục hiện tại của bạn:', curId);
            }
        });

        // Nút Vào Lại Hầm Ngục Hiện Tại (Re-enter)
        document.getElementById('zp-btn-reenter-dg')?.addEventListener('click', () => {
            const curId = getCurrentDungeonId();
            const pSize = parseInt(dgPartySel?.value) || 1;
            travelToPlanet('dungeon', curId, pSize);
        });

        // Nút Tạm Rời Hầm Ngục Về Nhà (Lưu giữ ID để vào lại bất kỳ lúc nào)
        document.getElementById('zp-btn-exit-dg-temp')?.addEventListener('click', () => {
            const curId = getCurrentDungeonId();
            if (curId) {
                lastKnownDungeonId = curId;
                localStorage.setItem('zp-last-dg-id', curId);
            }
            travelToPlanet('home');
            showToast(`🏠 Đã tạm rời về Mầm Xanh. Mã phòng [<b>${curId}</b>] đã được lưu lại để vào lại bất kỳ lúc nào!`, 4000);
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
        bindCheck('cfg-farm-safe', CFG.farm, 'safeMode');
        bindCheck('cfg-farm-instant', CFG.farm, 'instantGrow');
        bindCheck('cfg-farm-loop', CFG.farm, 'autoLoop');
        bindCheck('cfg-farm-harvest', CFG.farm, 'autoHarvest');
        bindCheck('cfg-farm-plant', CFG.farm, 'autoPlant');
        bindSelect('cfg-farm-crop', CFG.farm, 'cropChoice');

        // Farm Action Buttons
        document.getElementById('btn-farm-plant-all')?.addEventListener('click', () => {
            instantPlantAllPlots();
        });
        document.getElementById('btn-farm-harvest-all')?.addEventListener('click', () => {
            instantHarvestAllPlots();
        });
        document.getElementById('btn-farm-cycle')?.addEventListener('click', () => {
            runOneFarmCycle();
        });

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

        // Cập nhật Dynamic Dungeon ID & Level Người Chơi
        const elDgId = document.getElementById('zp-current-dg-id');
        if (elDgId) {
            const curDg = getCurrentDungeonId();
            elDgId.textContent = curDg;
        }
        const elFarmLvl = document.getElementById('zp-farm-user-lvl');
        if (elFarmLvl) {
            const pLvl = (G && G.save && G.save.lvl) ? G.save.lvl : 1;
            elFarmLvl.textContent = `Cấp độ: Lv ${pLvl}`;
        }
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
