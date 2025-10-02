import { useState, useEffect, useRef } from 'react';
import Browser from './apps/Browser';
import Terminal from './apps/Terminal';
import TicTacToe from './apps/TicTacToe';
import Portfolio from './apps/Portfolio';
import AboutMe from './apps/AboutMe';
import Tetris from './apps/Tetris';

const WindowManager = ({ activeWindows = [], setActiveWindows, activeApp, setActiveApp }) => {
  const [draggingWindow, setDraggingWindow] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detectar si es dispositivo táctil
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  useEffect(() => {
    const getAppTitle = (appName) => {
      const titles = {
        // Internet
        browser: '🌐 Firefox Browser',
        firefox: '🌐 Firefox Browser',
        youtube: '📺 YouTube',
        spotify: '🎵 Spotify',
        chromedragon: '🐉 Chrome Dragon',
        chrome: '🐉 Chrome Dragon',
        
        // Multimedia
        vlc: '🎬 VLC Player',
        camera: '📷 Camera',
        gallery: '🖼️ Gallery',
        
        // Development
        terminal: '💻 Terminal',
        neovim: '⚡ Neovim',
        nvim: '⚡ Neovim',
        vscode: '📝 Code Editor',
        'code-editor': '📝 Code Editor',
        
        // Games
        tictactoe: '🎮 Tic Tac Toe',
        'flappy-bird': '🐦 Flappy Bird',
        flappybird: '🐦 Flappy Bird',
        'snake-game': '🐍 Snake Game',
        snake: '🐍 Snake Game',
        'nes-emulator': '🎮 NES Emulator',
        nintendo: '🎮 NES Emulator',
        tetris: '🧊 Tetris',
        
        // System Tools
        files: '📁 File Manager',
        'file-manager': '📁 File Manager',
        calculator: '🧮 Calculator',
        settings: '⚙️ Settings',
        'system-monitor': '📊 System Monitor',
        monitor: '📊 System Monitor',
        
        // Personal
        portfolio: '🚀 My Portfolio',
        about: '👨‍💻 About Me',
        'about-me': '👨‍💻 About Me'
      };
      return titles[appName] || appName;
    };

    const getDefaultSize = (appName) => {
      const sizes = {
        browser: { width: 800, height: 600 },
        terminal: { width: 700, height: 450 },
        tictactoe: { width: 400, height: 500 },
        portfolio: { width: 600, height: 400 },
        about: { width: 500, height: 350 },
        youtube: { width: 800, height: 600 },
        spotify: { width: 400, height: 600 },
        vlc: { width: 600, height: 400 },
        calculator: { width: 300, height: 400 },
        settings: { width: 500, height: 400 },
        files: { width: 700, height: 500 },
        tetris: { width: 400, height: 500 }
      };
      return sizes[appName] || { width: 600, height: 400 };
    };

    const getMobileSize = (appName) => {
      const sizes = {
        browser: { width: '95vw', height: '80vh' },
        terminal: { width: '95vw', height: '70vh' },
        tictactoe: { width: '95vw', height: '80vh' },
        portfolio: { width: '95vw', height: '80vh' },
        about: { width: '95vw', height: '70vh' },
        youtube: { width: '95vw', height: '80vh' },
        spotify: { width: '95vw', height: '70vh' },
        vlc: { width: '95vw', height: '70vh' },
        calculator: { width: '90vw', height: '60vh' },
        settings: { width: '95vw', height: '80vh' },
        files: { width: '95vw', height: '80vh' },
        tetris: { width: '95vw', height: '80vh' }
      };
      return sizes[appName] || { width: '95vw', height: '80vh' };
    };

    const getAppComponent = (appName, id) => {
      const components = {
        // Apps existentes
        browser: <Browser windowId={id} />,
        terminal: <Terminal windowId={id} />,
        tictactoe: <TicTacToe windowId={id} />,
        portfolio: <Portfolio windowId={id} />,
        about: <AboutMe windowId={id} />,
        tetris: <Tetris windowId={id} />,
        
        // Placeholders para apps futuras
        snake: <div className="app-content"><h2>🐍 Snake Game</h2><p>Próximamente...</p></div>,
        files: <div className="app-content"><h2>📁 File Manager</h2><p>Próximamente...</p></div>,
        flappybird: <div className="app-content"><h2>🐦 Flappy Bird</h2><p>Próximamente...</p></div>,
        nintendo: <div className="app-content"><h2>🎮 NES Emulator</h2><p>Próximamente...</p></div>,
        youtube: <div className="app-content"><h2>📺 YouTube</h2><p>Próximamente...</p></div>,
        spotify: <div className="app-content"><h2>🎵 Spotify</h2><p>Próximamente...</p></div>,
        chromedragon: <div className="app-content"><h2>🐉 Chrome Dragon</h2><p>Próximamente...</p></div>,
        vlc: <div className="app-content"><h2>🎬 VLC Player</h2><p>Próximamente...</p></div>,
        camera: <div className="app-content"><h2>📷 Camera</h2><p>Próximamente...</p></div>,
        gallery: <div className="app-content"><h2>🖼️ Gallery</h2><p>Próximamente...</p></div>,
        neovim: <div className="app-content"><h2>⚡ Neovim</h2><p>Próximamente...</p></div>,
        vscode: <div className="app-content"><h2>📝 Code Editor</h2><p>Próximamente...</p></div>,
        calculator: <div className="app-content"><h2>🧮 Calculator</h2><p>Próximamente...</p></div>,
        settings: <div className="app-content"><h2>⚙️ Settings</h2><p>Próximamente...</p></div>,
        monitor: <div className="app-content"><h2>📊 System Monitor</h2><p>Próximamente...</p></div>
      };
      return components[appName] || <div className="app-content">App not available: {appName}</div>;
    };

    const getAppIcon = (appName) => {
      const icons = {
        // Internet
        browser: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/firefox.svg',
        firefox: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/firefox.svg',
        youtube: 'https://img.icons8.com/color/48/youtube-play.png',
        spotify: 'https://img.icons8.com/color/48/spotify--v1.png',
        chromedragon: 'https://img.icons8.com/color/48/chrome--v1.png',
        chrome: 'https://img.icons8.com/color/48/chrome--v1.png',
        
        // Multimedia
        vlc: 'https://img.icons8.com/color/48/vlc.png',
        camera: 'https://img.icons8.com/color/48/camera.png',
        gallery: 'https://img.icons8.com/color/48/picture.png',
        
        // Development
        terminal: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/utilities-terminal.svg',
        neovim: 'https://img.icons8.com/color/48/console.png',
        nvim: 'https://img.icons8.com/color/48/console.png',
        vscode: 'https://img.icons8.com/color/48/visual-studio-code-2019.png',
        'code-editor': 'https://img.icons8.com/color/48/visual-studio-code-2019.png',
        
        // Games
        tictactoe: 'https://img.icons8.com/?size=100&id=lbJCBsemR2JG&format=png&color=000000',
        'flappy-bird': 'https://img.icons8.com/color/48/bird.png',
        flappybird: 'https://img.icons8.com/color/48/bird.png',
        'snake-game': 'https://img.icons8.com/color/48/snake.png',
        snake: 'https://img.icons8.com/color/48/snake.png',
        'nes-emulator': 'https://img.icons8.com/color/48/nintendo-switch.png',
        nintendo: 'https://img.icons8.com/color/48/nintendo-switch.png',
        tetris: 'https://img.icons8.com/color/48/tetris.png',
        
        // System Tools
        files: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/system-file-manager.svg',
        'file-manager': 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/system-file-manager.svg',
        calculator: 'https://img.icons8.com/color/48/calculator.png',
        settings: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/preferences-system.svg',
        'system-monitor': 'https://img.icons8.com/color/48/monitor.png',
        monitor: 'https://img.icons8.com/color/48/monitor.png',
        
        // Personal
        portfolio: '/icons/UserPortafolio.ico',
        about: '/icons/UserAbout.ico',
        'about-me': '/icons/UserAbout.ico'
      };
      return icons[appName] || 'https://img.icons8.com/color/48/window.png';
    };

    // Actualizar el windowManager global
    window.windowManager = {
      openApp: (appName) => {
        const id = Date.now().toString();
        const isMobile = window.innerWidth <= 768;
        const defaultSize = isMobile ? getMobileSize(appName) : getDefaultSize(appName);
        
        const newWindow = {
          id,
          appName,
          title: getAppTitle(appName),
          icon: getAppIcon(appName),
          minimized: false,
          position: { 
            x: isMobile ? '2.5vw' : Math.max(50, 100 + activeWindows.length * 30), 
            y: isMobile ? '5vh' : Math.max(50, 100 + activeWindows.length * 30) 
          },
          size: defaultSize,
          component: getAppComponent(appName, id),
          zIndex: 1000 + activeWindows.length,
          isMobile: isMobile
        };
        
        setActiveWindows(prev => [...prev, newWindow]);
        setActiveApp(id);
      },
      closeApp: (id) => {
        setActiveWindows(prev => prev.filter(window => window.id !== id));
        if (activeApp === id) {
          setActiveApp(activeWindows.length > 1 ? activeWindows[0].id : null);
        }
      },
      minimizeApp: (id) => {
        setActiveWindows(prev => prev.map(window => 
          window.id === id ? { ...window, minimized: true } : window
        ));
        if (activeApp === id) {
          const nextWindow = activeWindows.find(w => w.id !== id && !w.minimized);
          setActiveApp(nextWindow ? nextWindow.id : null);
        }
      },
      maximizeApp: (id) => {
        const window = activeWindows.find(w => w.id === id);
        const isMobile = window?.isMobile || window.innerWidth <= 768;
        
        setActiveWindows(prev => prev.map(window => 
          window.id === id ? { 
            ...window, 
            size: isMobile ? { width: '98vw', height: '90vh' } : { width: '95%', height: '90%' },
            position: isMobile ? { x: '1vw', y: '2vh' } : { x: '2.5%', y: '5%' }
          } : window
        ));
      },
      restoreApp: (id) => {
        const window = activeWindows.find(w => w.id === id);
        const isMobile = window?.isMobile || window.innerWidth <= 768;
        const defaultSize = isMobile ? getMobileSize(window.appName) : getDefaultSize(window.appName);
        
        setActiveWindows(prev => prev.map(window => 
          window.id === id ? { 
            ...window, 
            size: defaultSize,
            position: isMobile ? { x: '2.5vw', y: '5vh' } : { x: 100, y: 100 }
          } : window
        ));
      },
      focusApp: (id) => {
        setActiveApp(id);
        // Traer al frente
        setActiveWindows(prev => prev.map(window => ({
          ...window,
          zIndex: window.id === id ? 1000 + prev.length : window.zIndex
        })));
      }
    };
  }, [activeWindows, activeApp, setActiveWindows, setActiveApp]);

  // Función para manejar el inicio del arrastre (mouse y touch)
  const handleDragStart = (windowId, e) => {
    // Para mouse: solo click izquierdo, para touch: cualquier touch
    if (e.type === 'mousedown' && e.button !== 0) return;
    
    const windowElement = e.currentTarget.closest('.window');
    if (!windowElement) return;

    const rect = windowElement.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    setDraggingWindow(windowId);
    setDragOffset({ x: offsetX, y: offsetY });
    setActiveApp(windowId);

    // Agregar clases para feedback visual
    windowElement.classList.add('window-dragging');
    
    // Prevenir acciones por defecto
    e.preventDefault();
    e.stopPropagation();
  };

  // Función para manejar el arrastre
  const handleDrag = (e) => {
    if (!draggingWindow) return;

    const windowIndex = activeWindows.findIndex(w => w.id === draggingWindow);
    if (windowIndex === -1) return;

    const currentWindow = activeWindows[windowIndex];
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    // Para ventanas móviles, usar porcentajes
    if (currentWindow.isMobile || window.innerWidth <= 768) {
      const percentX = (newX / window.innerWidth) * 100;
      const percentY = (newY / window.innerHeight) * 100;
      
      const boundedX = Math.max(0, Math.min(percentX, 95));
      const boundedY = Math.max(0, Math.min(percentY, 90));

      setActiveWindows(prev => prev.map((window, index) => 
        index === windowIndex 
          ? { ...window, position: { x: `${boundedX}vw`, y: `${boundedY}vh` } }
          : window
      ));
    } else {
      // Para desktop, usar píxeles
      const maxX = window.innerWidth - (typeof currentWindow.size.width === 'number' ? currentWindow.size.width : 300);
      const maxY = window.innerHeight - (typeof currentWindow.size.height === 'number' ? currentWindow.size.height : 200);

      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      setActiveWindows(prev => prev.map((window, index) => 
        index === windowIndex 
          ? { ...window, position: { x: boundedX, y: boundedY } }
          : window
      ));
    }
  };

  // Función para manejar el fin del arrastre
  const handleDragEnd = () => {
    if (!draggingWindow) return;

    const windowElement = document.querySelector(`.window[data-window-id="${draggingWindow}"]`);
    if (windowElement) {
      windowElement.classList.remove('window-dragging');
    }

    setDraggingWindow(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Efecto para manejar eventos globales de mouse y touch
  useEffect(() => {
    if (draggingWindow) {
      const events = {
        mousemove: handleDrag,
        mouseup: handleDragEnd,
        touchmove: handleDrag,
        touchend: handleDragEnd,
        touchcancel: handleDragEnd
      };

      Object.entries(events).forEach(([event, handler]) => {
        document.addEventListener(event, handler, { passive: false });
      });
      
      return () => {
        Object.entries(events).forEach(([event, handler]) => {
          document.removeEventListener(event, handler);
        });
      };
    }
  }, [draggingWindow, dragOffset, activeWindows]);

  const bringToFront = (id) => {
    setActiveApp(id);
    setActiveWindows(prev => prev.map(window => ({
      ...window,
      zIndex: window.id === id ? 1000 + prev.length : window.zIndex
    })));
  };

  const handleMinimize = (id, e) => {
    e.stopPropagation();
    window.windowManager.minimizeApp(id);
  };

  const handleMaximize = (id, e) => {
    e.stopPropagation();
    const window = activeWindows.find(w => w.id === id);
    const isMaximized = window.size.width === '95%' || window.size.width === '98vw';
    
    if (isMaximized) {
      window.windowManager.restoreApp(id);
    } else {
      window.windowManager.maximizeApp(id);
    }
  };

  const handleClose = (id, e) => {
    e.stopPropagation();
    window.windowManager.closeApp(id);
  };

  return (
    <div 
      className="window-manager" 
      onMouseMove={draggingWindow ? handleDrag : undefined}
      onTouchMove={draggingWindow ? handleDrag : undefined}
    >
      {activeWindows.map((window) => (
        <div
          key={window.id}
          data-window-id={window.id}
          className={`window ${activeApp === window.id ? 'active' : ''} ${window.minimized ? 'minimized' : ''} ${window.isMobile ? 'mobile' : 'desktop'}`}
          style={{
            zIndex: window.zIndex || 1000,
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height
          }}
          onClick={() => bringToFront(window.id)}
          onTouchStart={() => bringToFront(window.id)}
        >
          <div 
            className="window-header"
            onMouseDown={(e) => handleDragStart(window.id, e)}
            onTouchStart={(e) => handleDragStart(window.id, e)}
          >
            <div className="window-title">
              {window.title}
            </div>
            <div className="window-controls">
              <button 
                onClick={(e) => handleMinimize(window.id, e)}
                onTouchEnd={(e) => handleMinimize(window.id, e)}
                title="Minimizar"
                className="control-button"
              >
                _
              </button>
              <button 
                onClick={(e) => handleMaximize(window.id, e)}
                onTouchEnd={(e) => handleMaximize(window.id, e)}
                title={window.size.width === '95%' || window.size.width === '98vw' ? 'Restaurar' : 'Maximizar'}
                className="control-button"
              >
                {window.size.width === '95%' || window.size.width === '98vw' ? '❐' : '□'}
              </button>
              <button 
                onClick={(e) => handleClose(window.id, e)}
                onTouchEnd={(e) => handleClose(window.id, e)}
                title="Cerrar"
                className="control-button close-button"
              >
                ×
              </button>
            </div>
          </div>
          <div className="window-content">
            {window.component}
          </div>
        </div>
      ))}
      
      <style jsx>{`
        .window-manager {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: var(--z-modal);
          user-select: none;
          touch-action: none;
        }
        
        .window {
          position: absolute;
          background: var(--window-bg);
          border: 2px solid var(--parrot-green);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          pointer-events: all;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
          resize: both;
        }
        
        /* Tamaños para desktop */
        .window.desktop {
          min-width: min(300px, 90vw);
          min-height: min(200px, 50vh);
          max-width: 95vw;
          max-height: 90vh;
        }
        
        /* Tamaños para móvil */
        .window.mobile {
          min-width: 85vw;
          min-height: 50vh;
          max-width: 98vw;
          max-height: 90vh;
          border-width: 3px;
          border-radius: var(--radius-xl);
        }
        
        .window.minimized {
          display: none;
        }
        
        .window.active {
          border-color: var(--primary-cyan);
          box-shadow: 
            var(--shadow-xl),
            0 0 0 2px var(--primary-cyan);
        }
        
        .window-dragging {
          opacity: 0.95;
          cursor: grabbing !important;
          box-shadow: 
            var(--shadow-xl),
            0 0 40px rgba(30, 138, 74, 0.5),
            0 0 0 3px var(--primary-cyan);
          transition: none;
          z-index: 9999 !important;
        }
        
        .window-header {
          background: linear-gradient(90deg, var(--parrot-green), #16a085);
          padding: var(--space-sm) var(--space-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          cursor: grab;
          user-select: none;
          touch-action: none;
          min-height: 2.5rem;
          gap: var(--space-sm);
        }
        
        .window.mobile .window-header {
          min-height: 3rem;
          padding: var(--space-md);
          cursor: default;
        }
        
        .window-header:active {
          cursor: grabbing;
        }
        
        .window-title {
          color: #fff;
          font-size: var(--text-sm);
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          font-family: 'Ubuntu', sans-serif;
        }
        
        .window.mobile .window-title {
          font-size: var(--text-base);
        }
        
        .window-controls {
          display: flex;
          gap: var(--space-xs);
          flex-shrink: 0;
        }
        
        .window.mobile .window-controls {
          gap: var(--space-sm);
        }
        
        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #fff;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: var(--text-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          font-family: 'Ubuntu Mono', monospace;
          font-weight: bold;
          touch-action: manipulation;
        }
        
        .window.desktop .control-button {
          width: clamp(18px, 4vw, 22px);
          height: clamp(18px, 4vw, 22px);
        }
        
        .window.mobile .control-button {
          width: 2.5rem;
          height: 2.5rem;
          font-size: var(--text-lg);
          border-radius: var(--radius-md);
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        .control-button:active {
          transform: scale(0.95);
        }
        
        .close-button:hover {
          background: rgba(239, 68, 68, 0.8);
        }
        
        .window-content {
          flex: 1;
          overflow: auto;
          background: var(--terminal-bg);
          color: var(--text-primary);
          position: relative;
          user-select: text;
          cursor: auto;
          -webkit-overflow-scrolling: touch;
        }

        .app-content {
          padding: var(--space-lg);
          height: 100%;
          overflow: auto;
          user-select: text;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-primary);
        }

        .app-content h2 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-md);
          font-size: var(--text-xl);
        }

        .app-content p {
          color: var(--text-secondary);
          font-size: var(--text-md);
        }

        .window.mobile .app-content {
          padding: var(--space-md);
        }

        /* Responsive Design Mejorado */
        @media (max-width: 768px) {
          .window.desktop {
            min-width: 85vw;
            min-height: 50vh;
            border-width: 3px;
          }
          
          .window-header {
            padding: var(--space-md);
            min-height: 3rem;
          }
          
          .window-title {
            font-size: var(--text-base);
          }
        }

        @media (max-width: 480px) {
          .window.mobile {
            min-width: 92vw;
            min-height: 60vh;
            border-width: 2px;
          }
          
          .window-header {
            padding: 0.75rem 1rem;
            min-height: 2.75rem;
          }
          
          .window.mobile .control-button {
            width: 2.25rem;
            height: 2.25rem;
            font-size: var(--text-base);
          }
        }

        @media (max-width: 320px) {
          .window.mobile {
            min-width: 96vw;
            min-height: 65vh;
          }
          
          .window-header {
            padding: 0.5rem 0.75rem;
            min-height: 2.5rem;
          }
          
          .window.mobile .control-button {
            width: 2rem;
            height: 2rem;
            font-size: var(--text-sm);
          }
        }

        /* Scrollbars para móvil */
        .window-content::-webkit-scrollbar {
          width: 6px;
        }

        .window.mobile .window-content::-webkit-scrollbar {
          width: 4px;
        }

        .window-content::-webkit-scrollbar-track {
          background: var(--surface-bg);
        }

        .window-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .window-content::-webkit-scrollbar-thumb:hover {
          background: var(--primary-cyan);
        }

        /* Mejoras para touch en móvil */
        @media (hover: none) and (pointer: coarse) {
          .control-button:hover {
            transform: none;
            background: rgba(255, 255, 255, 0.2);
          }
          
          .window-header {
            cursor: default;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .window,
          .control-button {
            transition: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .window {
            border-width: 3px;
          }
          
          .window-dragging {
            border-width: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default WindowManager;