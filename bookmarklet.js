// Bookmarklet / Console code cho Zoo Pet Auto Pro
// Bạn có thể mở F12 -> tab Console -> Dán toàn bộ đoạn code này vào và nhấn Enter để chạy ngay lập tức!

(function() {
    if (document.getElementById('zp-auto-ui-root')) {
        alert('Tool Auto Zoo Pet đã được bật rồi!');
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/nhoxboo/zoo-pet-auto@main/zoo-pet-auto.user.js?' + Date.now();
    script.onerror = function() {
        console.log('Đang tải script cục bộ...');
    };
    document.body.appendChild(script);
})();
