// ==UserScript==
// @name         Zoo Pet - Auto Fishing Pro (Tự Động Câu Cá VIP)
// @namespace    https://zoo-pet.store/
// @version      1.0.0
// @description  Module chuyên dụng Tự Động Câu Cá Đỉnh Cao cho Zoo Pet: Tự tìm hồ nước, quăng cần, cắn câu siêu tốc, kéo cần chuẩn xác chống đứt dây, triệu hồi cá huyền thoại, bất tử khi câu. Phím tắt F2. Bản quyền: Hoài Nam.
// @author       Hoài Nam
// @copyright    Bản quyền © Hoài Nam - All Rights Reserved
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
// @updateURL    https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-fishing-auto.user.js
// @downloadURL  https://raw.githubusercontent.com/nhoxboo/zoo-pet-auto/main/zoo-pet-fishing-auto.user.js
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

    console.log('%c[ZooPet Fishing Pro v1.0.0]%c Khởi tạo module Auto Câu Cá VIP - Bản quyền: Hoài Nam', 'color:#0284C7;font-weight:bold;font-size:14px', 'color:#475569');

    const globalWin = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;
    let _capturedGame = null;

    // --- CƠ CHẾ TIÊM HOOK MAIN WORLD TRỰC TIẾP (BẮT GAME ENGINE AN TOÀN) ---
    try {
        const inlineScript = document.createElement('script');
        inlineScript.textContent = `
        (function() {
            if (window.__zp_fishing_injected__) return;
            window.__zp_fishing_injected__ = true;

            const isLocal = (str) => {
                if (typeof str !== 'string') return false;
                return str.includes('localhost') || str.includes('127.0.0.1') || str.includes('::1') || str.includes('zoo-pet.store') || str.includes('cloudfront.net');
            };

            const origTest = RegExp.prototype.test;
            RegExp.prototype.test = function(str) {
                const pat = this.source;
                if (pat && (pat.includes('localhost') || pat.includes('127') || pat.includes('::1'))) {
                    return true;
                }
                return origTest.call(this, str);
            };

            const origExec = RegExp.prototype.exec;
            RegExp.prototype.exec = function(str) {
                const pat = this.source;
                if (pat && (pat.includes('localhost') || pat.includes('127') || pat.includes('::1'))) {
                    return [str || 'localhost'];
                }
                return origExec.call(this, str);
            };

            let _internalGame = null;
            Object.defineProperty(window, 'game', {
                configurable: true,
                enumerable: true,
                get() {
                    return _internalGame;
                },
                set(val) {
                    _internalGame = val;
                    window.__zp_raw_game__ = val;
                    window.dispatchEvent(new CustomEvent('zp_fishing_game_ready', { detail: val }));
                }
            });
        })();
        `;
        (document.head || document.documentElement).appendChild(inlineScript);
        inlineScript.remove();
    } catch (_) {}

    // --- CẤU HÌNH AUTO CÂU CÁ (MẶC ĐỊNH TẮT - OFF) ---
    const DEFAULT_CFG = {
        enabled: false,           // Bật/Tắt Auto Câu Cá tổng
        autoWalk: true,           // Tự tìm hồ nước & đi tới bờ hồ gần nhất
        quickBite: true,          // Cá cắn câu siêu tốc khi phao chạm nước
        autoReel: true,           // Tự động giữ cần kéo cá
        tensionControl: true,     // Tự động nhả nhịp chống đứt dây khi quá căng
        ultraSpeed: false,        // Kéo cá siêu tốc (Tiết kiệm thời gian)
        summonMystery: true,      // Triệu hồi bóng cá bí ẩn / khổng lồ
        luckBuff: true,           // Kích hoạt buff may mắn (+Luck)
        safeGodmode: true,        // Bất tử khi câu cá (Quái không cắn chết)
        alertRare: true           // Thông báo nổi khi câu trúng cá hiếm/huyền thoại
    };

    let CFG = Object.assign({}, DEFAULT_CFG);

    function loadConfig() {
        try {
            const raw = localStorage.getItem('zp_fishing_cfg');
            if (raw) {
                const parsed = JSON.parse(raw);
                CFG = Object.assign({}, DEFAULT_CFG, parsed);
            }
        } catch (_) {}
    }

    function saveConfig() {
        try {
            localStorage.setItem('zp_fishing_cfg', JSON.stringify(CFG));
        } catch (_) {}
    }

    loadConfig();

    // Thống kê phiên câu cá
    const stats = {
        fishCaught: 0,
        rareCaught: 0,
        legendCaught: 0,
        sessionStart: Date.now()
    };

    // Danh sách cá hiếm & huyền thoại trong Zoo Pet
    const RARE_FISH_IDS = [
        'fish_golden',    // Cá Rồng Vàng (HUYỀN THOẠI - 600 vàng, hồi 9999 HP, Buff Toàn Diện)
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

    // Bắt đối tượng Game Engine
    function getGame() {
        if (_capturedGame && _capturedGame.player && _capturedGame.fishing) return _capturedGame;
        const g = globalWin.game || globalWin.__zp_raw_game__;
        if (g && g.player && g.fishing) {
            _capturedGame = g;
            return g;
        }
        return null;
    }

    window.addEventListener('zp_fishing_game_ready', (e) => {
        if (e.detail) _capturedGame = e.detail;
    });

    // --- CƠ CHẾ AUTO CÂU CÁ CHUYÊN SÂU ---
    let fishCastCooldown = 0;
    let isWalkingToWater = false;

    // Tự động trang bị Cần câu Vàng hoặc Cần câu thường
    function ensureRodEquipped(G) {
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

    // Di chuyển nhân vật mượt mà
    function walkTo(targetPos, G) {
        if (!G || !G.player) return;
        const player = G.player;
        if (!targetPos) {
            player.target = null;
            return;
        }
        player.target = { x: targetPos.x, y: targetPos.y || 0, z: targetPos.z };
        const dx = targetPos.x - player.pos.x;
        const dz = targetPos.z - player.pos.z;
        const len = Math.hypot(dx, dz);
        if (len > 0.1) {
            const speed = (player.stats?.speed || 4.5);
            player.vel.x = (dx / len) * speed;
            player.vel.z = (dz / len) * speed;
            if (player.mesh) {
                player.mesh.rotation.y = Math.atan2(dx, dz);
            }
        }
    }

    // Tìm điểm mép hồ nước và quăng cần
    function castAtNearestWater(G) {
        if (!G || !G.fishing || !G.world || !G.player || !G.player.alive) return;
        const waters = G.world.waters || [];
        if (waters.length === 0) return;

        const player = G.player;
        const fishing = G.fishing;

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
        if (distToShore > 2.0 && CFG.autoWalk) {
            walkTo(shorePos, G);
            isWalkingToWater = true;
            return;
        }

        isWalkingToWater = false;
        player.target = null;
        if (player.vel) player.vel.set(0, 0, 0);

        ensureRodEquipped(G);

        if (CFG.summonMystery && typeof fishing.callMystery === 'function') {
            try { fishing.callMystery(); } catch (_) {}
        }

        try {
            fishing.start(nearestWater, castPos);
        } catch (_) {}
    }

    // Vòng lặp Engine Câu Cá
    function runFishingLoop() {
        const G = getGame();
        if (!G || !G.fishing || !G.player || !G.player.alive) return;

        const fishing = G.fishing;
        const player = G.player;

        // 1. Duy trì bất tử khi đang câu cá nếu bật
        if (CFG.safeGodmode && CFG.enabled) {
            player.invuln = 999999;
            player.fireres = 1.0;
            if (player.hp < player.maxHp) player.hp = player.maxHp;
        }

        // 2. Kích hoạt buff may mắn (+Luck)
        if (CFG.luckBuff && CFG.enabled) {
            if (!player.buffs) player.buffs = {};
            player.buffs.luck = { until: 9999999999, v: 5.0 };
        }

        if (!CFG.enabled) return;

        if (fishing.active) {
            fishCastCooldown = Date.now() + 1000;

            // Đang quăng phao
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

            // Giai đoạn chờ cá: Kích hoạt cá cắn câu siêu tốc
            if (CFG.quickBite) {
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

            // Giai đoạn cá đớp mồi (Bite) -> Giật cần (Hook)
            if (fishing.phase === 'bite') {
                if (typeof fishing.hook === 'function') {
                    try { fishing.hook(); } catch (_) {}
                } else if (typeof fishing.press === 'function') {
                    try { fishing.press(); } catch (_) {}
                }
                return;
            }

            // Giai đoạn kéo cá (Hooked / Reeling) -> Kiểm soát độ căng dây
            if (fishing.phase === 'hooked' && CFG.autoReel) {
                const reelBtn = document.querySelector('#reel');
                if (reelBtn) reelBtn.classList.add('down');

                if (CFG.tensionControl && fishing.tension >= 0.85) {
                    // Dây quá căng -> Nhả nhịp chống đứt dây
                    if (typeof fishing.release === 'function') {
                        try { fishing.release(); } catch (_) {}
                    }
                    fishing.holding = false;
                } else {
                    // Dây an toàn -> Giữ kéo cần liên tục
                    if (typeof fishing.press === 'function') {
                        try { fishing.press(); } catch (_) {}
                    }
                    fishing.holding = true;
                }

                // Chế độ kéo cá siêu tốc
                if (CFG.ultraSpeed) {
                    fishing.holding = true;
                    fishing.progress = Math.min(1, (fishing.progress || 0) + 0.06);
                    fishing.tension = Math.min(0.45, fishing.tension || 0);
                }

                // Khi tiến trình kéo đạt 100% -> Hoàn thành câu cá
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
                            stats.fishCaught++;
                            if (isRare) {
                                stats.rareCaught++;
                                if (CFG.alertRare) {
                                    showToast(`🌟 [CÂU CÁ VIP] Bạn đã câu được: <b>${fishName}</b> (Hiếm / Huyền Thoại)!`, 4000);
                                }
                            }
                            updateStatsUI();
                        } catch (err) {
                            console.error('[FishingPro] Lỗi hoàn thành câu cá:', err);
                        }
                    }
                }
            }
        } else {
            // Khi chưa quăng câu -> Tự tìm mép nước và quăng câu
            if (Date.now() > fishCastCooldown) {
                castAtNearestWater(G);
                fishCastCooldown = Date.now() + 1000;
            }
        }
    }

    // --- GIAO DIỆN NGƯỜI DÙNG (WHITE-BLUE THEME) ---
    function injectUI() {
        if (document.getElementById('zp-fishing-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'zp-fishing-panel';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            width: 320px;
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1E293B;
            z-index: 999999;
            overflow: hidden;
            display: none;
            user-select: none;
        `;

        panel.innerHTML = `
            <!-- Header Trắng - Xanh -->
            <div id="zp-fishing-header" style="background: linear-gradient(135deg, #2563EB, #0284C7); padding: 12px 16px; color: #FFFFFF; cursor: move; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">🎣</span>
                    <div>
                        <div style="font-weight: 700; font-size: 13px; letter-spacing: 0.3px;">ZOO PET • AUTO FISHING PRO</div>
                        <div style="font-size: 10px; color: #E0F2FE; font-weight: 500;">Bản quyền: Hoài Nam</div>
                    </div>
                </div>
                <button id="zp-fishing-close" style="background: rgba(255,255,255,0.2); border: none; color: #FFFFFF; width: 24px; height: 24px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
            </div>

            <!-- Bảng thống kê nhanh -->
            <div style="padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                    <div style="font-size: 10px; color: #64748B; font-weight: 600;">TỔNG CÁ ĐÃ CÂU</div>
                    <div id="zp-stat-fish" style="font-size: 16px; font-weight: 700; color: #0284C7;">0</div>
                </div>
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 10px; text-align: center;">
                    <div style="font-size: 10px; color: #64748B; font-weight: 600;">CÁ HIẾM / HUYỀN THOẠI</div>
                    <div id="zp-stat-rare" style="font-size: 16px; font-weight: 700; color: #EAB308;">0</div>
                </div>
            </div>

            <!-- Trạng thái câu hiện tại -->
            <div style="padding: 6px 14px; background: #F1F5F9; border-bottom: 1px solid #E2E8F0; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #64748B;">Trạng thái câu:</span>
                <span id="zp-fishing-status" style="font-weight: 600; color: #2563EB;">Đang chờ lệnh...</span>
            </div>

            <!-- Thân danh sách tính năng -->
            <div style="padding: 12px 14px; max-height: 380px; overflow-y: auto;">
                <!-- Master Switch -->
                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:8px 10px; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px;">
                    <div>
                        <div style="font-weight: 700; font-size: 12px; color: #1E40AF;">🎣 BẬT AUTO CÂU CÁ</div>
                        <div style="font-size: 10px; color: #3B82F6;">Tự động toàn bộ chu trình câu cá</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-en" ${CFG.enabled ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <!-- Các tùy chọn chi tiết -->
                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">🚶 Tự tìm hồ & đi tới mép nước</div>
                        <div style="font-size: 10px; color: #64748B;">Tự động chạy đến hồ gần nhất</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-walk" ${CFG.autoWalk ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">⚡ Cá cắn câu siêu tốc</div>
                        <div style="font-size: 10px; color: #64748B;">Thu hút cá và cắn câu ngay khi phao chạm nước</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-bite" ${CFG.quickBite ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">🎯 Điều tiết lực căng chống đứt dây</div>
                        <div style="font-size: 10px; color: #64748B;">Tự động nhả nhịp khi lực căng >= 85%</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-tension" ${CFG.tensionControl ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">🚀 Kéo cá siêu tốc (Ultra Reel)</div>
                        <div style="font-size: 10px; color: #64748B;">Tăng tốc tiến trình kéo cá lên bờ</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-ultra" ${CFG.ultraSpeed ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">✨ Triệu hồi cá bí ẩn / khổng lồ</div>
                        <div style="font-size: 10px; color: #64748B;">Tăng tối đa tỷ lệ gặp cá hiếm & vàng</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-mystery" ${CFG.summonMystery ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">🍀 Tự động buff May Mắn (+Luck)</div>
                        <div style="font-size: 10px; color: #64748B;">Tăng phẩm chất cá câu được</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-luck" ${CFG.luckBuff ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <div class="zp-fish-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <div style="font-weight: 600; font-size: 11.5px;">🛡️ Bất tử khi câu cá</div>
                        <div style="font-size: 10px; color: #64748B;">Không bị quái vật cắn chết khi cắm câu</div>
                    </div>
                    <label class="zp-fish-switch">
                        <input type="checkbox" id="cfg-fish-godmode" ${CFG.safeGodmode ? 'checked' : ''}>
                        <span class="zp-fish-slider"></span>
                    </label>
                </div>

                <!-- Nút hành động nhanh -->
                <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
                    <button id="zp-btn-cast-now" style="background: #16A34A; color: #FFFFFF; border: none; padding: 8px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer;">
                        🎣 Quăng Cần Ngay Lập Tức
                    </button>
                </div>
            </div>

            <!-- Footer bản quyền Hoài Nam -->
            <div style="padding: 8px 14px; background: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 10.5px; color: #64748B;">
                Phím tắt bật/tắt: <b style="color: #2563EB;">F2</b> • Bản quyền: <b style="color: #1E293B;">Hoài Nam</b>
            </div>
        `;

        document.body.appendChild(panel);

        // Nút tròn nổi mở menu (Floating Button)
        const floatBtn = document.createElement('div');
        floatBtn.id = 'zp-fishing-float';
        floatBtn.style.cssText = `
            position: fixed;
            bottom: 85px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563EB, #0284C7);
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            cursor: pointer;
            z-index: 999998;
            user-select: none;
            transition: transform 0.2s;
        `;
        floatBtn.title = 'Bấm hoặc nhấn F2 để mở Auto Câu Cá Pro (Bản quyền: Hoài Nam)';
        floatBtn.innerHTML = '🎣';
        document.body.appendChild(floatBtn);

        // Thêm CSS Toggle Switch
        const style = document.createElement('style');
        style.textContent = `
            .zp-fish-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
            .zp-fish-switch input { opacity: 0; width: 0; height: 0; }
            .zp-fish-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #CBD5E1; transition: .3s; border-radius: 20px; }
            .zp-fish-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
            input:checked + .zp-fish-slider { background-color: #2563EB; }
            input:checked + .zp-fish-slider:before { transform: translateX(16px); }
        `;
        document.head.appendChild(style);

        // Kéo thả menu
        makeDraggable(panel, document.getElementById('zp-fishing-header'));

        // Toggle ẩn/hiện menu
        function togglePanel() {
            panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
        }

        floatBtn.addEventListener('click', togglePanel);
        document.getElementById('zp-fishing-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Phím tắt F2
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                e.preventDefault();
                togglePanel();
            }
        });

        // Gắn sự kiện cho các Switch
        const bindCheck = (id, prop) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    CFG[prop] = el.checked;
                    saveConfig();
                    if (prop === 'enabled') {
                        showToast(el.checked ? '🎣 Đã BẬT Auto Câu Cá Pro!' : '🛑 Đã TẮT Auto Câu Cá Pro.');
                    }
                });
            }
        };

        bindCheck('cfg-fish-en', 'enabled');
        bindCheck('cfg-fish-walk', 'autoWalk');
        bindCheck('cfg-fish-bite', 'quickBite');
        bindCheck('cfg-fish-tension', 'tensionControl');
        bindCheck('cfg-fish-ultra', 'ultraSpeed');
        bindCheck('cfg-fish-mystery', 'summonMystery');
        bindCheck('cfg-fish-luck', 'luckBuff');
        bindCheck('cfg-fish-godmode', 'safeGodmode');

        // Nút quăng cần ngay
        document.getElementById('zp-btn-cast-now')?.addEventListener('click', () => {
            const G = getGame();
            if (G) {
                castAtNearestWater(G);
                showToast('🎣 Đang quăng cần tới hồ nước gần nhất...');
            } else {
                showToast('⚠️ Chưa kết nối được Game Engine. Vui lòng vào game trước!');
            }
        });
    }

    function updateStatsUI() {
        const elFish = document.getElementById('zp-stat-fish');
        const elRare = document.getElementById('zp-stat-rare');
        const elStatus = document.getElementById('zp-fishing-status');

        if (elFish) elFish.textContent = stats.fishCaught;
        if (elRare) elRare.textContent = stats.rareCaught;

        if (elStatus) {
            const G = getGame();
            if (!G || !G.fishing) {
                elStatus.textContent = 'Chưa vào game';
                elStatus.style.color = '#94A3B8';
            } else if (!CFG.enabled) {
                elStatus.textContent = 'Đang TẮT (OFF)';
                elStatus.style.color = '#64748B';
            } else if (isWalkingToWater) {
                elStatus.textContent = 'Đang chạy ra hồ nước...';
                elStatus.style.color = '#0284C7';
            } else if (G.fishing.active) {
                const phase = G.fishing.phase;
                if (phase === 'cast') elStatus.textContent = 'Đang quăng phao...';
                else if (phase === 'wait' || phase === 'nibble') elStatus.textContent = 'Đang chờ cá đớp mồi...';
                else if (phase === 'bite') elStatus.textContent = 'Cá cắn câu! Đang giật...';
                else if (phase === 'hooked') elStatus.textContent = `Đang kéo cá (${Math.round((G.fishing.progress||0)*100)}%)`;
                elStatus.style.color = '#16A34A';
            } else {
                elStatus.textContent = 'Sẵn sàng quăng cần';
                elStatus.style.color = '#2563EB';
            }
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
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Khởi tạo và chu kỳ thực thi
    function init() {
        injectUI();
        setInterval(runFishingLoop, 100);
        setInterval(updateStatsUI, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
