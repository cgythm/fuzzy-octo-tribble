# is-online
When you lose connective, it will report that you are offline. If you refresh the page while connectivity is lost, it will report that you are being served from the cache while also being offline. When you regain connectivity, it will report that you are online. But if you refresh while having connectivity, it can't tell you whether its being served from cache or not.  

#### other info:
1. [Application Cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache)
2. [Online/Offline events](https://developer.mozilla.org/en/docs/Online_and_offline_events)

#### places of interest:
- [offline.js](https://github.com/cgythm/fuzzy-octo-tribble/blob/gh-pages/shared/offline.js) hooks into Online/Offline events and, depending on an error of retriving the manifest file, it can tell you that it is offline and thus serving from cache. 
- [amicached.js](https://github.com/cgythm/fuzzy-octo-tribble/tree/gh-pages/stuff/is-online/amicached.js) and [amicached-yes.js](https://github.com/cgythm/fuzzy-octo-tribble/tree/gh-pages/stuff/is-online/amicached-yes.js) abuses the fallback mechanism to report network connectivity state, see [manifest file](https://github.com/cgythm/fuzzy-octo-tribble/blob/gh-pages/stuff/is-online/index.appcache). Since the fallback is cached when amicached.js isn't accessible, the fallback is served. The fallback to amicached.js is amicached-yes.js. 