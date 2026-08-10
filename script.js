// スクロール時に画面を小さくする処理
window.addEventListener('scroll', () => {
    const wrapper = document.getElementById('mediaWrapper');
    if (!wrapper) return;

    // 現在のスクロール量を取得
    const scrollY = window.scrollY;

    // スクロール量に応じてスケール（大きさ）を計算（最大1.0、最小0.6）
    let scale = 1 - (scrollY / 1500);
    if (scale < 0.6) scale = 0.6;
    if (scale > 1) scale = 1;

    // スクロール量に応じて角の丸み（border-radius）を計算
    let radius = (1 - scale) * 100;

    // CSSに数値を適用
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.borderRadius = `${radius}px`;
});