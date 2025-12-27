{ // this wrapper avoids name clashing of outer variables and functions

    function showNotification(message) {
        const notification = document.createElement('div')
        notification.textContent = message
        notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:16px;border-radius:4px;box-shadow:0 2px 5px rgba(0,0,0,0.2);z-index:10000;transition:opacity 0.3s'
        document.body.appendChild(notification)
        setTimeout(() => {
            notification.style.opacity = '0'
            setTimeout(() => notification.remove(), 300)
        }, 2000)
    }

    function copyToClipboard(text) {
        // Try modern clipboard API first (HTTPS only)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text)
        }
        
        // Fallback for HTTP sites
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand('copy')
            document.body.removeChild(textarea)
            return Promise.resolve()
        } catch (err) {
            document.body.removeChild(textarea)
            return Promise.reject(err)
        }
    }

    HFS.onEvent('afterEntryName', ({ entry }) => {
        if (/\.(mp4|mov|wmv|mkv|avi|flv|webm|m4v)$/i.test(entry.n)) {
            const fullUrl = window.location.origin + window.location.pathname + entry.n
            const escapedUrl = fullUrl.replace(/'/g, "\\'")  // Escape single quotes for onclick

            return `<button class='video-copy-link' title='Copy video link' onclick="copyToClipboard('${escapedUrl}').then(() => showNotification('Video link copied!')).catch(() => showNotification('Failed to copy')); event.preventDefault(); return false;"> 📺 Copy</button>`
        }
    })

}