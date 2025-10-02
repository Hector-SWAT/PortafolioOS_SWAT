// src/scripts/taskbar.client.ts

interface WindowManager {
  topZIndex: number;
  openAppWindow: (title: string, content: string) => void;
  setupWindowEvents: (win: HTMLDivElement) => void;
  setupWindowDrag: (win: HTMLDivElement) => void;
  handleOpenApp: (appName: string) => void;
}

const windowManager: WindowManager = {
  topZIndex: 1000,

  openAppWindow(title: string, content: string): void {
    const win = document.createElement('div');
    win.classList.add('app-window');
    win.style.top = String(100 + Math.random() * 100) + 'px';
    win.style.left = String(100 + Math.random() * 200) + 'px';
    win.style.width = '400px';
    win.style.height = '300px';
    win.style.zIndex = String(++this.topZIndex);

    win.innerHTML = `
      <div class="window-header">
        <strong>${title}</strong>
        <div class="window-controls">
          <button class="minimize-btn" title="Minimizar">−</button>
          <button class="close-btn" title="Cerrar">×</button>
        </div>
      </div>
      <div class="app-content">${content}</div>
    `;

    document.body.appendChild(win);
    this.setupWindowEvents(win);
  },

  setupWindowEvents(win: HTMLDivElement): void {
    // Traer ventana al frente
    win.addEventListener('mousedown', (): void => {
      win.style.zIndex = String(++this.topZIndex);
    });

    // Cerrar ventana
    const closeBtn = win.querySelector('.close-btn') as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener('click', (): void => win.remove());
    }

    // Minimizar ventana
    const minBtn = win.querySelector('.minimize-btn') as HTMLButtonElement;
    const contentEl = win.querySelector('.app-content') as HTMLDivElement;
    if (minBtn && contentEl) {
      minBtn.addEventListener('click', (): void => {
        if (contentEl.style.display !== 'none') {
          contentEl.style.display = 'none';
          win.style.height = '45px';
        } else {
          contentEl.style.display = '';
          win.style.height = '300px';
        }
      });
    }

    this.setupWindowDrag(win);
  },

  setupWindowDrag(win: HTMLDivElement): void {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const header = win.querySelector('.window-header') as HTMLDivElement;

    if (!header) return;

    header.addEventListener('mousedown', (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') return;
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      win.style.opacity = '0.9';
      e.preventDefault();
    });

    document.addEventListener('mouseup', (): void => {
      isDragging = false;
      win.style.opacity = '1';
    });

    document.addEventListener('mousemove', (e: MouseEvent): void => {
      if (!isDragging) return;
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;

      const maxLeft = window.innerWidth - win.offsetWidth;
      const maxTop = window.innerHeight - win.offsetHeight;

      win.style.left = String(Math.max(0, Math.min(newLeft, maxLeft))) + 'px';
      win.style.top = String(Math.max(0, Math.min(newTop, maxTop))) + 'px';
    });
  },

handleOpenApp(appName: string): void {
  console.log('Abriendo app:', appName);

  // Crear contenedor de contenido
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = '10px';

  let title = appName;
  
  switch(appName) {
    case 'browser':
      title = 'Navegador';
      const inputBrowser = document.createElement('input');
      inputBrowser.type = 'url';
      inputBrowser.placeholder = 'Ingresa una URL...';
      inputBrowser.style.flex = '1';
      inputBrowser.style.padding = '8px';
      inputBrowser.style.borderRadius = '4px';
      inputBrowser.style.border = '1px solid #444';
      inputBrowser.style.background = 'rgba(255,255,255,0.05)';
      inputBrowser.style.color = 'white';

      const btnBrowser = document.createElement('button');
      btnBrowser.textContent = 'Ir';
      btnBrowser.style.padding = '8px 15px';
      btnBrowser.style.background = '#1e8a4a';
      btnBrowser.style.color = 'white';
      btnBrowser.style.border = 'none';
      btnBrowser.style.borderRadius = '4px';
      btnBrowser.style.cursor = 'pointer';
      btnBrowser.addEventListener('click', () => {
        const url = inputBrowser.value || 'https://www.google.com';
        window.open(url, '_blank');
        iframeBrowser.src = url;
      });

      const iframeBrowser = document.createElement('iframe');
      iframeBrowser.src = 'https://www.google.com';
      iframeBrowser.style.width = '100%';
      iframeBrowser.style.height = '200px';
      iframeBrowser.style.border = '1px solid #444';
      iframeBrowser.style.borderRadius = '4px';

      const wrapperBrowser = document.createElement('div');
      wrapperBrowser.style.display = 'flex';
      wrapperBrowser.style.alignItems = 'center';
      wrapperBrowser.style.gap = '10px';
      wrapperBrowser.appendChild(inputBrowser);
      wrapperBrowser.appendChild(btnBrowser);

      content.appendChild(wrapperBrowser);
      content.appendChild(iframeBrowser);
      break;

    case 'mail':
      title = 'Correo';
      const btnMail = document.createElement('button');
      btnMail.textContent = 'Abrir Gmail';
      btnMail.style.padding = '10px 20px';
      btnMail.style.background = '#1e8a4a';
      btnMail.style.color = 'white';
      btnMail.style.border = 'none';
      btnMail.style.borderRadius = '4px';
      btnMail.style.cursor = 'pointer';
      btnMail.addEventListener('click', () => {
        window.open('https://mail.google.com', '_blank');
      });

      const wrapperMail = document.createElement('div');
      wrapperMail.style.textAlign = 'center';
      wrapperMail.style.padding = '20px';
      const hMail = document.createElement('h3');
      hMail.textContent = '📧 Cliente de Correo';
      const pMail = document.createElement('p');
      pMail.textContent = 'Simulación de aplicación de correo';

      wrapperMail.appendChild(hMail);
      wrapperMail.appendChild(pMail);
      wrapperMail.appendChild(btnMail);
      content.appendChild(wrapperMail);
      break;

    case 'terminal':
      title = 'Terminal';
      const termWrapper = document.createElement('div');
      termWrapper.style.background = '#000';
      termWrapper.style.padding = '10px';
      termWrapper.style.borderRadius = '4px';
      termWrapper.style.fontFamily = 'monospace';
      termWrapper.style.height = '200px';
      termWrapper.style.overflowY = 'auto';

      const lines = [
        'user@parrot:~$ Bienvenido a la terminal simulada',
        "user@parrot:~$ Escribe 'help' para ver comandos disponibles"
      ];

      lines.forEach(l => {
        const div = document.createElement('div');
        div.style.color = '#00ff00';
        div.innerHTML = l.replace('Bienvenido', '<span style="color:white">Bienvenido a la terminal simulada</span>');
        termWrapper.appendChild(div);
      });

      const inputTerm = document.createElement('input');
      inputTerm.type = 'text';
      inputTerm.placeholder = 'comando...';
      inputTerm.style.background = 'transparent';
      inputTerm.style.border = 'none';
      inputTerm.style.color = 'white';
      inputTerm.style.outline = 'none';
      inputTerm.style.width = '100%';
      inputTerm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = inputTerm.value.trim();
          const div = document.createElement('div');
          div.style.color = '#00ff00';
          div.textContent = `user@parrot:~$ ${cmd}`;
          termWrapper.appendChild(div);
          inputTerm.value = '';
          termWrapper.scrollTop = termWrapper.scrollHeight;
        }
      });

      termWrapper.appendChild(inputTerm);
      content.appendChild(termWrapper);
      break;

    case 'editor':
      title = 'Editor de Texto';
      const textArea = document.createElement('textarea');
      textArea.placeholder = 'Escribe tu texto aquí...';
      textArea.style.width = '100%';
      textArea.style.height = '200px';
      textArea.style.background = 'rgba(255,255,255,0.05)';
      textArea.style.color = 'white';
      textArea.style.border = '1px solid #444';
      textArea.style.borderRadius = '4px';
      textArea.style.padding = '10px';
      textArea.style.fontFamily = 'monospace';
      textArea.style.resize = 'none';

      const btnNew = document.createElement('button');
      btnNew.textContent = 'Nuevo';
      btnNew.style.padding = '5px 10px';
      btnNew.style.marginRight = '5px';
      btnNew.style.background = '#1e8a4a';
      btnNew.style.color = 'white';
      btnNew.style.border = 'none';
      btnNew.style.borderRadius = '3px';
      btnNew.style.cursor = 'pointer';
      btnNew.addEventListener('click', () => textArea.value = '');

      const btnSave = document.createElement('button');
      btnSave.textContent = 'Guardar';
      btnSave.style.padding = '5px 10px';
      btnSave.style.background = '#1e8a4a';
      btnSave.style.color = 'white';
      btnSave.style.border = 'none';
      btnSave.style.borderRadius = '3px';
      btnSave.style.cursor = 'pointer';
      btnSave.addEventListener('click', () => alert('Función de guardar simulada'));

      const toolbar = document.createElement('div');
      toolbar.style.marginBottom = '10px';
      toolbar.appendChild(btnNew);
      toolbar.appendChild(btnSave);

      content.appendChild(toolbar);
      content.appendChild(textArea);
      break;

    default:
      title = appName;
      const defDiv = document.createElement('div');
      defDiv.style.textAlign = 'center';
      defDiv.style.padding = '20px';
      const hDef = document.createElement('h3');
      hDef.textContent = `📱 ${appName}`;
      const pDef = document.createElement('p');
      pDef.textContent = 'Esta aplicación está en desarrollo';
      defDiv.appendChild(hDef);
      defDiv.appendChild(pDef);
      content.appendChild(defDiv);
      break;
  }

  // Abrir la ventana con el contenido
  this.openAppWindow(title, '');
  const lastWin = document.querySelector('.app-window:last-child .app-content') as HTMLDivElement;
  if (lastWin) lastWin.appendChild(content);
} 
};


document.addEventListener('DOMContentLoaded', (): void => {
  const taskbarApps = document.querySelectorAll('.taskbar-app');
  const startButton = document.getElementById('startButton') as HTMLButtonElement;
  const startMenu = document.getElementById('startMenu') as HTMLElement;
  const startWrapper = document.getElementById('startWrapper') as HTMLElement;
  const menuItems = document.querySelectorAll('.start-menu .menu-item');
  const timeEl = document.getElementById('time') as HTMLElement;
  const dateEl = document.getElementById('date') as HTMLElement;
  const trayIcons = document.querySelectorAll('.tray-icon');
  const searchInput = document.getElementById('startSearch') as HTMLInputElement;

  function toggleStartMenu(): void {
    if (!startMenu || !startButton) return;
    const isOpen = startMenu.classList.toggle('show');
    startButton.setAttribute('aria-expanded', String(isOpen));
    startMenu.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen && searchInput) searchInput.focus();
  }

  if (startButton) {
    startButton.addEventListener('click', (e: Event): void => {
      e.stopPropagation();
      toggleStartMenu();
    });
  }

  menuItems.forEach((btn: Element): void => {
    btn.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      const app = btn.getAttribute('data-app') || '';
      windowManager.handleOpenApp(app);
      taskbarApps.forEach((a: Element): void => {
        const aName = a.getAttribute('data-app') || '';
        a.classList.toggle('active', aName === app);
      });
      if (startMenu) {
        startMenu.classList.remove('show');
        if (startButton) startButton.setAttribute('aria-expanded', 'false');
        startMenu.setAttribute('aria-hidden', 'true');
      }
    });
  });

  taskbarApps.forEach((appEl: Element): void => {
    appEl.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      const appName = appEl.getAttribute('data-app') || '';
      taskbarApps.forEach((a: Element): void => a.classList.remove('active'));
      appEl.classList.add('active');
      windowManager.handleOpenApp(appName);
    });
  });

  document.addEventListener('keydown', (e: Event): void => {
    const ev = e as KeyboardEvent;
    if (ev.key === 'Escape' && startMenu && startMenu.classList.contains('show')) {
      startMenu.classList.remove('show');
      if (startButton) startButton.setAttribute('aria-expanded', 'false');
      startMenu.setAttribute('aria-hidden', 'true');
    }
  });

  console.log('Taskbar inicializado correctamente');
});

export { windowManager };
