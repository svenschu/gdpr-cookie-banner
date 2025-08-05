# Story 4.2 – Performance and Stability

## Description

**As** a developer

**I want** loading the banner to not noticeably impact web performance,

**so that** the user experience remains positive.

## Acceptance Criteria

- The banner loads asynchronously and does not block essential resources.
- Script blocking is efficient without delaying the page.
- Consent settings are stored efficiently in local storage or via server-side API call.

## Detailed Description

### Performance Requirements
A cookie banner must not negatively impact website load time and performance:

1. **Load time targets**:
   - Maximum delay of First Contentful Paint (FCP): < 100ms
   - Maximum delay of Largest Contentful Paint (LCP): < 200ms
   - Maximum delay of Time to Interactive (TTI): < 300ms
   - Total banner code size: < 100KB (compressed)

2. **Resource usage**:
   - Minimal CPU usage
   - Minimal memory consumption
   - No blocking of the main thread for more than 50ms

3. **Network usage**:
   - Minimal number of HTTP requests
   - Efficient caching strategies
   - Minimal payload size

### Asynchronous Loading
To avoid blocking the main page, the cookie banner must load asynchronously:

1. **Implementation techniques**:
   - Use `async` or `defer` for script tags
   - Dynamically load banner code after the main page loads
   - Lazy loading for resources not needed immediately
   - Example:
   ```html
   <!-- Asynchronous loading of the cookie banner script -->
   <script async src="/path/to/cookie-banner.js"></script>

   <!-- Or dynamic loading after DOMContentLoaded -->
   <script>
     document.addEventListener('DOMContentLoaded', function() {
       const script = document.createElement('script');
       script.src = '/path/to/cookie-banner.js';
       document.head.appendChild(script);
     });
   </script>
   ```

2. **Prioritization**:
   - Critical resources of the main page take precedence
   - Banner code loads with lower priority
   - Use resource hints (preconnect, preload) for optimized load times

3. **Fallback strategies**:
   - Graceful degradation in case of loading issues
   - Minimal basic functionality even with network problems

### Efficient Script Blocking
Blocking tracking scripts must be implemented efficiently:

1. **Blocking mechanisms**:
   - Use Mutation Observers to monitor the DOM
   - Intercept `document.createElement` and similar methods
   - Blocking at DNS level for maximum efficiency
   - Example:
   ```javascript
   // Efficient script blocking by overriding document.createElement
   (function() {
     const originalCreateElement = document.createElement;

     document.createElement = function(tagName) {
       const element = originalCreateElement.call(document, tagName);

       if (tagName.toLowerCase() === 'script') {
         element.addEventListener('beforescriptexecute', function(e) {
           const src = element.src || '';
           if (isBlockedDomain(src) && !hasUserConsent('analytics')) {
             e.preventDefault();
             console.log('Blocked script:', src);
           }
         });
       }

       return element;
     };
   })();
   ```

2. **Optimization of blocking logic**:
   - Use lookup tables instead of complex regex patterns
   - Cache blocking decisions
   - Minimize number of checks

3. **Transparency and debugging**:
   - Log blocked scripts (debug mode only)
   - Performance metrics to monitor blocking mechanism
   - Option to disable in development environments

### Efficient Storage of Consent Settings
User settings must be stored efficiently:

1. **Local storage**:
   - Use localStorage or sessionStorage for quick access
   - Store only necessary data
   - Compress data if large
   - Example:
   ```javascript
   // Efficient storage of consent settings
   const consentManager = {
     saveConsent(settings) {
       const minimalData = {
         v: '1.0',
         ts: Date.now(),
         c: {
           a: settings.analytics ? 1 : 0,
           m: settings.marketing ? 1 : 0,
           f: settings.functional ? 1 : 0
         }
       };

       try {
         localStorage.setItem('userConsent', JSON.stringify(minimalData));
         return true;
       } catch (e) {
         console.error('Failed to save consent:', e);
         return false;
       }
     },

     loadConsent() {
       try {
         const data = JSON.parse(localStorage.getItem('userConsent') || '{}');
         return {
           analytics: data.c?.a === 1,
           marketing: data.c?.m === 1,
           functional: data.c?.f === 1,
           timestamp: data.ts || 0,
           version: data.v || '0'
         };
       } catch (e) {
         console.error('Failed to load consent:', e);
         return {
           analytics: false,
           marketing: false,
           functional: false,
           timestamp: 0,
           version: '0'
         };
       }
     }
   };
   ```

2. **Server-side storage**:
   - Efficient API calls (minimal payload)
   - Batch requests when volume is high
   - Use HTTP/2 or HTTP/3 for faster connections
   - Fallback to local storage on network issues

3. **Caching strategies**:
   - Cache settings in memory for quick access
   - Avoid redundant storage operations
   - Optimize sync between local and server cache

### Stability Requirements
The cookie banner must function reliably under all circumstances:

1. **Error handling**:
   - Robust error handling for all operations
   - No impact on the main page if the banner fails
   - Graceful degradation when features are missing

2. **Compatibility**:
   - Support all common browsers (including older versions)
   - Provide basic functionality when JavaScript is disabled
   - Work correctly under different network conditions

3. **Isolation**:
   - No conflicts with other scripts on the page
   - Use namespaces or module patterns
   - No global variables or functions (except defined API)

### Performance Monitoring
For continuous monitoring and optimization:

1. **Metrics**:
   - Banner load time
   - Impact on Core Web Vitals
   - Memory usage and CPU load
   - Network overhead

2. **Monitoring tools**:
   - Integration with Web Vitals monitoring
   - Real User Monitoring (RUM)
   - Synthetic monitoring for continuous tests

3. **Performance budget**:
   - Define clear performance limits
   - Automatic alerts on exceedance
   - Regular performance audits

### Test Scenarios
1. Load time test – measure impact on FCP, LCP and TTI
2. Resource test – monitor CPU and memory usage
3. Network test – analyze network requests and payload sizes
4. Blocking test – verify efficiency of script blocking
5. Storage test – performance of consent storage (local and remote)
6. Stability test – functionality under different network and browser conditions
7. Scaling test – behavior under high load and many simultaneous users
