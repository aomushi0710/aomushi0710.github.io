// スクロール時に画面を小さくする
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


// GitHub APIからコミット履歴を取得します
async function fetchRecentCommits() {
    const username = 'aomushi0710';
    const logContainer = document.getElementById('commit-log');
    
    // id="commit-log" を持つ要素がそのページになければ、エラーを防ぐためにここで処理を止める
    if (!logContainer) return; 

    try {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
            cache: 'no-store' // ★追加：古い記憶（キャッシュ）を使わず、必ず最新を取得する
        });
        const events = await response.json();
        
        const pushEvents = events.filter(event => {
            return event.type === 'PushEvent' && 
                   event.payload && 
                   event.payload.commits && 
                   Array.isArray(event.payload.commits) && 
                   event.payload.commits.length > 0;
        }).slice(0, 5);
        logContainer.innerHTML = ''; 

        if (pushEvents.length === 0) {
            logContainer.innerHTML = '<li>最近のコミット記録は見つかりませんでした。</li>';
            return;
        }

        pushEvents.forEach(event => {
            const repoName = event.repo.name.split('/')[1]; 
            
            // ブランチ名がない場合は 'unknown-branch' とする
            const ref = event.payload.ref || 'unknown-branch';
            const branchName = ref.replace('refs/heads/', '');
            
            // ★ここが最大のポイント：commitsが存在し、かつ配列であるかを確認する
            if (!event.payload.commits || !Array.isArray(event.payload.commits) || event.payload.commits.length === 0) {
                 return; // コミットの中身がないPushEventなら、何もせずに次へスキップする
            }

            const latestCommit = event.payload.commits[event.payload.commits.length - 1];
            
            // 念のためlatestCommitが本当に存在するかもう一度確認
            if(!latestCommit) return; 

            const commitHash = latestCommit.sha.substring(0, 7);
            const commitMessage = latestCommit.message.split('\n')[0]; 
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="repo-name">[${repoName}]</span> 
                <span class="branch-name">(${branchName})</span> 
                <span class="commit-hash">#${commitHash}</span> 
                <span class="commit-msg">${commitMessage}</span>
            `;
            logContainer.appendChild(li);
        });
        
    } catch (error) {
        console.error("記録取得エラーの詳細:", error);
        logContainer.innerHTML = '<li style="color: red;">通信エラー：記録の取得に失敗しました。</li>';
    }
}

// HTMLがすべて読み込まれてから術式を発動する（安全対策）
document.addEventListener('DOMContentLoaded', fetchRecentCommits);