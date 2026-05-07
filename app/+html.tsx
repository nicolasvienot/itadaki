import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
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
          Custom styles for iOS PWA fullscreen.
          We don't use ScrollViewStyleReset because it conflicts with PWA fullscreen.
        */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Reset */
          *, *::before, *::after {
            box-sizing: border-box;
          }
          
          /* 
           * iOS PWA Fullscreen Fix
           * The trick is to use position:fixed on html to cover the entire screen
           * including the area behind the home indicator (safe area).
           * Then body and #root fill that space.
           */
          html {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #F5EFE0;
            -webkit-text-size-adjust: 100%;
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 100%;
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
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
