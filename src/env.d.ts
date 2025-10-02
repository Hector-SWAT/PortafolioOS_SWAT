// src/env.d.ts
/// <reference types="astro/client" />

declare global {
  interface Window {
    windowManager: {
      openApp: (appName: string) => void;
      bringToFront: (window: HTMLElement) => void;
      windows: Map<string, HTMLElement>;
      topZIndex: number;
    };
  }
}

// Extender EventTarget para el método closest
declare global {
  interface EventTarget {
    closest?: (selector: string) => Element | null;
  }
}

export {};