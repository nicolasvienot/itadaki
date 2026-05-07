import { ScrollViewStyleReset } from 'expo-router/html';
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
        <link rel="apple-touch-icon" href="/assets/images/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icon.png" />

        {/* PWA Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#F5EFE0" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Prevent auto-formatting */}
        <meta name="format-detection" content="telephone=no" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: `
          html {
            height: 100%;
          }
          body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            height: 100%;
            background-color: #F5EFE0;
            overflow: hidden;
            overscroll-behavior: none;
            -webkit-overflow-scrolling: touch;
          }
          #root {
            display: flex;
            flex-direction: column;
            min-height: 100%;
            min-height: 100dvh;
            min-height: -webkit-fill-available;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
