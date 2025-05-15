/**
 * Dynamic iframe resizer for Hayloft Woodshed product catalogs
 * This script should be included on pages that embed catalog iframes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set up message listener for iframe resize requests
    window.addEventListener('message', function(event) {
        // Check if the message is a resize request
        if (event.data && event.data.type === 'resize') {
            // Find all iframes
            const iframes = document.querySelectorAll('iframe');
            
            // Try to identify which iframe sent the message
            iframes.forEach(iframe => {
                try {
                    if (iframe.contentWindow === event.source) {
                        // Add a larger buffer (25px) to prevent scrollbars in all browsers
                        iframe.style.height = (event.data.height + 25) + 'px';
                        // Smooth transition for height changes
                        iframe.style.transition = 'height 0.3s ease';
                    }
                } catch (e) {
                    // Cross-origin issues might prevent access to contentWindow
                    console.warn('Could not access iframe contentWindow', e);
                }
            });
        }
    });
    
    // Improved helper function to initialize iframes with proper attributes
    window.initResponsiveIframe = function(iframeSelector) {
        const iframe = document.querySelector(iframeSelector);
        if (iframe) {
            // Set essential iframe attributes
            iframe.setAttribute('scrolling', 'no');
            iframe.style.overflow = 'hidden';
            iframe.style.width = '100%';
            iframe.style.border = 'none';
            iframe.style.transition = 'height 0.3s ease';
            
            // Initial height setting (can be adjusted as needed)
            iframe.style.height = '500px';
            
            // Add resize event listener for the window to handle viewport changes
            window.addEventListener('resize', debounce(function() {
                // Force a resize check after window resize is complete
                if (iframe.contentWindow) {
                    try {
                        // Try to trigger a resize computation in the iframe
                        iframe.contentWindow.postMessage({ type: 'checkSize' }, '*');
                    } catch (e) {
                        console.warn('Could not send resize check to iframe', e);
                    }
                }
            }, 250));
            
            // Add a load event listener to ensure proper sizing after initial load
            iframe.addEventListener('load', function() {
                // Small delay to ensure content is rendered
                setTimeout(function() {
                    try {
                        iframe.contentWindow.postMessage({ type: 'checkSize' }, '*');
                    } catch (e) {
                        console.warn('Could not send initial resize check to iframe', e);
                    }
                }, 100);
            });
        }
    };
    
    // Utility function to limit frequent calls (debounce)
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
});
