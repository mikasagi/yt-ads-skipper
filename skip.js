{
  // 非表示にする広告の要素
  const hideElements = [
    'ytd-display-ad-renderer', // トップ左上の広告
    'ytd-in-feed-ad-layout-renderer', // 検索時に出てくる広告
    'ytd-promoted-sparkles-web-renderer', // 動画リスト上部の広告
    '.ytd-player-legacy-desktop-watch-ads-renderer', // 広告動画を再生した場合に動画リスト上部に出てくる広告
  ];

  // 動画以外の広告を非表示
  const newStyle = document.createElement('style');
  hideElements.forEach((e) => { newStyle.textContent += `${e}{ display:none!important; }\n`; });
  document.getElementsByTagName('head').item(0).appendChild(newStyle);

  const adsPlayerClassName = 'ytp-ad-player-overlay';

  const skipAds = () => {
    // 再生位置を最後まで移動
    const ads = document.getElementsByClassName(adsPlayerClassName);
    const video = document.getElementsByClassName("html5-main-video")[0];
    if(ads.length && video) video.currentTime = video.duration;

    // スキップボタンが残っていたら押す
    const skipButton = document.getElementsByClassName("ytp-ad-skip-button-container")[0];
    if(skipButton) skipButton.click();
  };

  // DOM監視
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if(mutation.addedNodes.length && mutation.addedNodes[0].className === adsPlayerClassName) skipAds();
    });
  });

  const playerId = 'ytd-player';
  const observeOptions = {
    childList: true,
    subtree: true,
  };

  // 監視が始まるまで1秒毎にskip処理
  const initInterval = setInterval(() => {
    if(document.getElementById(playerId)) {
      const observeTarget = document.getElementById(playerId);
      observer.observe(observeTarget, observeOptions);
      clearInterval(initInterval);
    }
    skipAds();
  }, 1000);
};
