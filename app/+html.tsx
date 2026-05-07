import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />

        {/* PWA iOS fullscreen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Itadaki" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />

        {/* PWA Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#F5EFE0" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Prevent auto-formatting */}
        <meta name="format-detection" content="telephone=no" />

        {/* 
          iOS PWA Fullscreen Fix
          - 100dvh is WRONG in standalone mode (subtracts safe area incorrectly)
          - 100vh is CORRECT in standalone mode (equals full screen)
          - Use CSS variable with JS override for standalone detection
        */}
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after {
            box-sizing: border-box;
          }
          
          :root {
            --app-height: 100dvh;
          }
          
          html {
            height: var(--app-height, 100dvh);
            overflow: hidden;
            background-color: #F5EFE0;
            -webkit-text-size-adjust: 100%;
          }
          
          body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            overscroll-behavior: none;
            background-color: #F5EFE0;
            -webkit-overflow-scrolling: touch;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }
          
          #root {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
            overflow: hidden;
          }
        `}} />

        {/* JS: Override to 100vh in standalone PWA mode */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // Detect iOS standalone mode
            var isStandalone = window.navigator.standalone === true || 
                               window.matchMedia('(display-mode: standalone)').matches;
            var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            
            if (isStandalone && isIOS) {
              // In iOS standalone mode, 100vh is correct (equals full screen)
              // 100dvh is wrong (subtracts safe area incorrectly)
              document.documentElement.style.setProperty('--app-height', '100vh');
            }
          })();
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
