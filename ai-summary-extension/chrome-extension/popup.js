import { BASE_URL } from './config.js';
document.addEventListener('DOMContentLoaded', function() {
    const captureBtn = document.getElementById('captureBtn');
    const status = document.getElementById('status');
    const loading = document.getElementById('loading');

    captureBtn.addEventListener('click', async function() {
        try {
            // Disable button and show loading
            captureBtn.disabled = true;
            loading.style.display = 'block';
            status.textContent = 'Capturing page content...';
            status.className = 'status';

            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('No active tab found');
            }

            // Execute content script to capture page content
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: capturePageContent
            });

            const pageContent = results[0].result;
            
            if (!pageContent || !pageContent.content) {
                throw new Error('No content captured from page');
            }

            // Validate that we captured meaningful content
            if (pageContent.content.trim().length < 50) {
                throw new Error('Page appears to have very little text content');
            }

            status.textContent = 'Sending to API...';

            // Send content to API
            const response = await fetch(`${BASE_URL}/api/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: pageContent.url || tab.url,
                    title: pageContent.title || tab.title,
                    content: pageContent.content,
                    wordCount: pageContent.wordCount,
                    contentLength: pageContent.contentLength,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            // Show detailed success message with word count
            const wordCount = pageContent.wordCount || pageContent.content.split(/\s+/).length;
            status.textContent = `✅ Success! Captured ${wordCount} words and sent to server.`;
            status.className = 'status success';
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                if (status.className.includes('success')) {
                    status.textContent = '';
                    status.className = 'status';
                }
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            status.textContent = `Error: ${error.message}`;
            status.className = 'status error';
        } finally {
            // Re-enable button and hide loading
            captureBtn.disabled = false;
            loading.style.display = 'none';
        }
    });
});

// Function to capture page content (executed in the page context)
function capturePageContent() {
    // Create a clone of the document body to work with
    const bodyClone = document.body.cloneNode(true);
    
    // Remove unwanted elements that don't contain meaningful text
    const elementsToRemove = bodyClone.querySelectorAll(
        'script, style, noscript, iframe, img, video, audio, canvas, svg, ' +
        'nav, header, footer, aside, .nav, .header, .footer, .sidebar, ' +
        '.advertisement, .ads, .banner, .popup, .modal, .overlay, ' +
        '.social-share, .share-buttons, .comments, .comment-section'
    );
    
    elementsToRemove.forEach(el => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });

    // Get the main content using multiple strategies
    let content = '';
    let mainElement = null;
    
    // Strategy 1: Try to find the main content area
    const contentSelectors = [
        'main',
        'article',
        '.content',
        '.post-content',
        '.entry-content',
        '#content',
        '.main-content',
        '.article-content',
        '.post-body',
        '.entry-body'
    ];

    for (const selector of contentSelectors) {
        const element = bodyClone.querySelector(selector);
        if (element && element.textContent.trim().length > 200) {
            mainElement = element;
            break;
        }
    }

    // Strategy 2: If no main content found, try to find the largest text block
    if (!mainElement) {
        const allElements = bodyClone.querySelectorAll('div, section, article, p');
        let maxLength = 0;
        
        allElements.forEach(el => {
            const textLength = el.textContent.trim().length;
            if (textLength > maxLength && textLength > 500) {
                maxLength = textLength;
                mainElement = el;
            }
        });
    }

    // Strategy 3: Fallback to body content
    if (!mainElement) {
        mainElement = bodyClone;
    }

    // Extract text content
    content = mainElement.textContent;

    // Clean up the content
    content = content
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
        .replace(/\t+/g, ' ') // Replace tabs with spaces
        .trim();

    // Remove excessive whitespace
    content = content.replace(/\s{2,}/g, ' ');

    // Limit content length to avoid API limits
    const maxLength = 50000;
    if (content.length > maxLength) {
        content = content.substring(0, maxLength) + '... [Content truncated]';
    }

    // Calculate word count
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    return {
        title: document.title,
        url: window.location.href,
        content: content,
        wordCount: wordCount,
        contentLength: content.length
    };
} 