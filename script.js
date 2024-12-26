// 添加全局错误处理
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});

// 添加网络错误重试机制
const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
};

function checkUrls(type) {
    const urls = document.getElementById('urls').value.split('\n').filter(url => url.trim());
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    if (urls.length === 0) {
        alert('请输入需要检测的网址！');
        return;
    }
    
    urls.forEach(async url => {
        try {
            const response = await fetch(`api/api.php?url=${encodeURIComponent(url)}&type=${type}`);
            const data = await response.json();
            
            if (data.error) {
                displayResult(resultsDiv, url, false, `错误: ${data.msg}`);
                return;
            }
            
            const isSafe = data.code === "1001";
            const message = data.msg || (isSafe ? '域名正常' : '已被封禁');
            const details = [];
            
            if (data.reason) details.push(data.reason);
            if (data.describe) details.push(data.describe);
            
            const fullMessage = details.length > 0 
                ? `${message} (${details.join(', ')})` 
                : message;
                
            displayResult(resultsDiv, url, isSafe, fullMessage);
            
        } catch (error) {
            displayResult(resultsDiv, url, false, "检测失败，请稍后重试");
            console.error('Fetch error:', error);
        }
    });
}

function displayResult(container, url, isSafe, message = '') {
    const div = document.createElement('div');
    div.className = `result-item ${isSafe ? 'safe' : 'unsafe'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'result-content';
    
    const urlSpan = document.createElement('span');
    urlSpan.className = 'url-text';
    urlSpan.textContent = url;
    
    const detailSpan = document.createElement('span');
    detailSpan.className = 'detail-text';
    detailSpan.textContent = message ? ` - ${message}` : '';
    
    const statusSpan = document.createElement('span');
    statusSpan.className = 'status-badge';
    statusSpan.textContent = isSafe ? '安全' : '不安全';
    
    contentDiv.appendChild(urlSpan);
    contentDiv.appendChild(detailSpan);
    div.appendChild(contentDiv);
    div.appendChild(statusSpan);
    container.appendChild(div);
} 