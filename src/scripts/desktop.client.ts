// src/scripts/desktop.client.ts
import { WindowManager } from './windowManager.client';

document.addEventListener('DOMContentLoaded', () => {
  const wm = new WindowManager();

  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {
      const appName = icon.getAttribute('data-app') || '';
      wm.handleOpenApp(appName);
    });
  });

  console.log('Desktop initialized ✅');
});
