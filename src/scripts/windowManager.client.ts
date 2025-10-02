// src/scripts/WindowManager.client.ts
export class WindowManager {
  private topZIndex = 1000;

  constructor() {
    document.addEventListener('openApp', (e: Event) => {
      const detail = (e as CustomEvent).detail;
      this.openAppWindow(detail.title, detail.content);
    });
  }

  openAppWindow(title: string, content: string) {
    const win = document.createElement('div');
    win.className = 'app-window';
    Object.assign(win.style, {
      position: 'absolute',
      top: '50px',
      left: '50px',
      width: '400px',
      height: '300px',
      backgroundColor: 'rgba(20,20,20,0.95)',
      color: 'white',
      border: '1px solid #1e8a4a',
      borderRadius: '8px',
      zIndex: (++this.topZIndex).toString(),
      overflow: 'hidden'
    });

    win.innerHTML = `
      <div class="window-header" style="padding:5px 10px; background: rgba(30,138,74,0.9); cursor: move; display:flex; justify-content:space-between; align-items:center;">
        <strong>${title}</strong>
        <button class="close-btn" style="background:none;border:none;color:white;cursor:pointer;">×</button>
      </div>
      <div class="app-content" style="padding:10px; overflow:auto; height: calc(100% - 30px);">
        ${content}
      </div>
    `;

    const closeBtn = win.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => win.remove());
    document.body.appendChild(win);

    this.makeDraggable(win);
  }

  private makeDraggable(win: HTMLElement) {
    const header = win.querySelector('.window-header') as HTMLElement;
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      win.style.opacity = '0.9';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      win.style.opacity = '1';
    });
  }

  handleOpenApp(appName: string) {
    let content = '';

    switch (appName) {
      case 'browser':
        content = `<iframe src="about:blank" style="width:100%; height:100%; border:none;"></iframe>`;
        break;
      case 'portfolio':
        content = `<p>Aquí irá tu portafolio 🚀</p>`;
        break;
      case 'about':
        content = `<p>Sobre mí...</p>`;
        break;
      default:
        content = `<p>App: ${appName}</p>`;
        break;
    }

    this.openAppWindow(appName, content);
  }
}

// Crear instancia global
export const windowManager = new WindowManager();
