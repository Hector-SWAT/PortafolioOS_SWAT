// src/scripts/desktop.ts

function initDesktop(): void {
  const wallpaperSelector = document.getElementById("wallpaperSelector") as HTMLElement | null;
  const desktopBackground = document.getElementById("desktopBackground") as HTMLElement | null;
  const contextMenu = document.getElementById("desktopContextMenu") as HTMLElement | null;

  if (!wallpaperSelector || !desktopBackground || !contextMenu) return;

  const closeWallpaperSelector = (): void => {
    wallpaperSelector.style.display = "none";
  };

  // Botón cerrar selector
  const closeBtn = document.querySelector(".close-selector") as HTMLElement | null;
  if (closeBtn) {
    closeBtn.addEventListener("click", closeWallpaperSelector);
  }

  // Opciones de wallpaper
  document.querySelectorAll<HTMLElement>(".wallpaper-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const wp = opt.dataset.wallpaper;
      switch (wp) {
        case "parrot-default":
          desktopBackground.style.backgroundImage = "url('/wallpapers/wallpaper.png')";
          break;
        case "parrot-dark":
          desktopBackground.style.backgroundImage = "url('/wallpapers/parrot-dark.jpg')";
          break;
        case "hacker-theme":
          desktopBackground.style.backgroundImage = "url('/wallpapers/hacker-theme.jpg')";
          break;
      }
      closeWallpaperSelector();
    });
  });

  // Menú contextual del escritorio
  document.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault();
    if (contextMenu) {
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.display = "block";
    }
  });

  document.addEventListener("click", () => {
    if (contextMenu) contextMenu.style.display = "none";
  });

  // Doble click en íconos → abrir apps
  document.querySelectorAll<HTMLElement>(".desktop-icon").forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      const app = icon.dataset.app;
      if (app) {
        // Aquí deberías invocar WindowManager en lugar de alert
        alert(`Abrir ventana: ${app}`);
      }
    });
  });
}

// Ejecutar automáticamente cuando cargue el DOM
document.addEventListener("DOMContentLoaded", initDesktop);

export {};
