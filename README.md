# SN Toolkit — Lite Bookmarklet

> The Lite bookmarklet version of the SN Toolkit browser extension.

## About

This JavaScript bookmarklet is the lite version of the SN Toolkit Chrome extension. It is designed for ServiceNow administrators and developers who want to use the extension's basic functionalities without installing it.

## Quick Start

1. Paste the code below to your bookmarks bar:

    ```javascript:(function(){const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/gh/sn-toolkit/sn-toolkit-lite@main/sn-toolkit-lite.js';script.type='text/javascript';document.head.appendChild(script)})();```

2. Rename the bookmark as "SN Toolkit Lite".
3. Click on the bookmark while on a service-now.com instance.
