import { useState, useEffect, useRef } from 'react';
import Browser from './apps/Browser';
import Terminal from './apps/Terminal';
import TicTacToe from './apps/TicTacToe';
import Portfolio from './apps/Portfolio';
import AboutMe from './apps/AboutMe';
import Tetris from './apps/Tetris';
import FlappyBird from './apps/FlappyBird'; 
import Snake from './apps/Snake';
import TorBrowser from './apps/TorBrowser';
import VPNClient from './apps/VPNClient';
import FileEncryption from './apps/FileEncryption';
import PasswordManager from './apps/PasswordManager';
import TextEditor from './apps/TextEditor';
import Calculator from './apps/Calculator';
import Spreadsheet from './apps/Spreadsheet';

const WindowManager = ({ activeWindows = [], setActiveWindows, activeApp, setActiveApp }) => {
  const [draggingWindow, setDraggingWindow] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [nextId, setNextId] = useState(1);

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
        // Privacy - AGREGADO PASSWORD MANAGER
        'tor-browser': '🌐 Tor Browser - System SWAT',
        'vpn-client': '🛡️ VPN Client - System SWAT',
        'file-encryption': '🔒 File Encryption - System SWAT',
        'password-manager': '🔑 Password Manager - System SWAT',
        'passwordmanager': '🔑 Password Manager - System SWAT', // Alias adicional
        
        // Office
        'text-editor': '📝 Text Editor - System SWAT',
        calculator: '🧮 Calculator - System SWAT',
        spreadsheet: '📊 Spreadsheet - System SWAT',
        'pdf-reader': '📄 PDF Reader - System SWAT',
        
        // Internet
        browser: '🌐 Firefox Browser - System SWAT',
        firefox: '🌐 Firefox Browser - System SWAT',
        youtube: '📺 YouTube - System SWAT',
        spotify: '🎵 Spotify - System SWAT',
        chromedragon: '🐉 Chrome Dragon - System SWAT',
        chrome: '🐉 Chrome Dragon - System SWAT',
        
        // Graphics
        gimp: '🎨 GIMP - System SWAT',
        inkscape: '✏️ Inkscape - System SWAT',
        blender: '🎬 Blender - System SWAT',
        screenshot: '📸 Screenshot Tool - System SWAT',
        
        // Sound & Video
        vlc: '🎬 VLC Player - System SWAT',
        audacity: '🎵 Audacity - System SWAT',
        camera: '📷 Camera - System SWAT',
        gallery: '🖼️ Gallery - System SWAT',
        
        // Games
        tictactoe: '🎮 Tic Tac Toe - System SWAT',
        flappybird: '🐦 Flappy Bird - System SWAT',
        snake: '🐍 Snake Game - System SWAT',
        'nes-emulator': '🎮 NES Emulator - System SWAT',
        nintendo: '🎮 NES Emulator - System SWAT',
        tetris: '🧊 Tetris - System SWAT',
        
        // Pentesting
        nmap: '🔍 Network Scanner - System SWAT',
        wireshark: '📡 Wireshark - System SWAT',
        metasploit: '⚔️ Metasploit - System SWAT',
        'burp-suite': '🛡️ Burp Suite - System SWAT',
        
        // Programming
        terminal: '💻 Terminal - System SWAT',
        neovim: '⚡ Neovim - System SWAT',
        nvim: '⚡ Neovim - System SWAT',
        vscode: '📝 Code Editor - System SWAT',
        'code-editor': '📝 Code Editor - System SWAT',
        'git-gui': '📚 Git GUI - System SWAT',
        
        // System Tools
        files: '📁 File Manager - System SWAT',
        'file-manager': '📁 File Manager - System SWAT',
        'system-monitor': '📊 System Monitor - System SWAT',
        monitor: '📊 System Monitor - System SWAT',
        settings: '⚙️ Settings - System SWAT',
        'software-updater': '🔄 Software Updater - System SWAT',
        
        // System Services
        'service-manager': '🛠️ Service Manager - System SWAT',
        'system-logs': '📋 System Logs - System SWAT',
        'backup-tool': '💾 Backup Tool - System SWAT',
        firewall: '🔥 Firewall Config - System SWAT',
        
        // Accessories
        calendar: '📅 Calendar - System SWAT',
        
        // Universal Access
        'screen-magnifier': '🔍 Screen Magnifier - System SWAT',
        'screen-reader': '📢 Screen Reader - System SWAT',
        'on-screen-keyboard': '⌨️ On-Screen Keyboard - System SWAT',
        'high-contrast': '⚫ High Contrast - System SWAT',
        
        // Personal
        portfolio: '🚀 My Portfolio - System SWAT',
        about: '👨‍💻 About Me - System SWAT',
        'about-me': '👨‍💻 About Me - System SWAT'
      };
      return titles[appName] || `${appName} - System SWAT`;
    };

    const getDefaultSize = (appName) => {
      const sizes = {
        // Apps principales
        browser: { width: 900, height: 650 },
        terminal: { width: 750, height: 500 },
        tictactoe: { width: 400, height: 500 },
        portfolio: { width: 800, height: 600 },
        about: { width: 600, height: 450 },
        tetris: { width: 400, height: 500 },
        flappybird: { width: 450, height: 700 },
        snake: { width: 500, height: 600 },
        TorBrowser: { width: 900, height: 700 },
        VPNClient: { width: 600, height: 500 },
        
        // PASSWORD MANAGER - TAMAÑOS ESPECÍFICOS
        'password-manager': { width: 800, height: 600 },
        'passwordmanager': { width: 800, height: 600 },
        
        // Nuevas apps - tamaños por defecto
        'file-encryption': { width: 500, height: 400 },
        'text-editor': { width: 700, height: 500 },
        calculator: { width: 320, height: 420 },
        spreadsheet: { width: 800, height: 600 },
        'pdf-reader': { width: 700, height: 600 },
        youtube: { width: 800, height: 600 },
        spotify: { width: 400, height: 600 },
        chromedragon: { width: 900, height: 650 },
        gimp: { width: 800, height: 600 },
        inkscape: { width: 800, height: 600 },
        blender: { width: 900, height: 700 },
        screenshot: { width: 400, height: 300 },
        vlc: { width: 800, height: 500 },
        audacity: { width: 700, height: 500 },
        camera: { width: 500, height: 400 },
        gallery: { width: 700, height: 500 },
        nintendo: { width: 600, height: 500 },
        nmap: { width: 700, height: 500 },
        wireshark: { width: 800, height: 600 },
        metasploit: { width: 750, height: 550 },
        'burp-suite': { width: 800, height: 600 },
        neovim: { width: 700, height: 500 },
        vscode: { width: 900, height: 700 },
        'git-gui': { width: 600, height: 500 },
        files: { width: 800, height: 500 },
        monitor: { width: 700, height: 500 },
        'software-updater': { width: 500, height: 400 },
        'service-manager': { width: 600, height: 500 },
        'system-logs': { width: 700, height: 500 },
        'backup-tool': { width: 500, height: 450 },
        firewall: { width: 600, height: 500 },
        calendar: { width: 400, height: 500 },
        'screen-magnifier': { width: 500, height: 400 },
        'screen-reader': { width: 500, height: 400 },
        'on-screen-keyboard': { width: 600, height: 300 },
        'high-contrast': { width: 400, height: 300 }
      };
      return sizes[appName] || { width: 700, height: 500 };
    };

    const getMobileSize = (appName) => {
      const sizes = {
        // Apps principales
        browser: { width: '95vw', height: '80vh' },
        terminal: { width: '95vw', height: '70vh' },
        tictactoe: { width: '95vw', height: '80vh' },
        portfolio: { width: '95vw', height: '80vh' },
        about: { width: '95vw', height: '70vh' },
        flappybird: { width: '95vw', height: '80vh' },
        snake: { width: '95vw', height: '85vh' },
        TorBrowser: { width: '95vw', height: '80vh' },
        VPNClient: { width: '95vw', height: '70vh' },
        
        // PASSWORD MANAGER - TAMAÑOS MÓVIL
        'password-manager': { width: '95vw', height: '85vh' },
        'passwordmanager': { width: '95vw', height: '85vh' },
        
        // Nuevas apps - tamaños móviles
        calculator: { width: '90vw', height: '60vh' },
        youtube: { width: '95vw', height: '70vh' },
        spotify: { width: '90vw', height: '70vh' },
        camera: { width: '95vw', height: '80vh' },
        gallery: { width: '95vw', height: '80vh' },
        vlc: { width: '95vw', height: '70vh' },
        files: { width: '95vw', height: '80vh' },
        settings: { width: '95vw', height: '80vh' }
      };
      return sizes[appName] || { width: '95vw', height: '80vh' };
    };

    const getAppComponent = (appName, id) => {
      const components = {
        // Apps existentes y funcionales
        browser: <Browser windowId={id} />,
        terminal: <Terminal windowId={id} />,
        tictactoe: <TicTacToe windowId={id} />,
        portfolio: <Portfolio windowId={id} />,
        about: <AboutMe windowId={id} />,
        tetris: <Tetris windowId={id} />,
        flappybird: <FlappyBird windowId={id} />,
        snake: <Snake windowId={id} />,
        'tor-browser': <TorBrowser windowId={id} />,
        'vpn-client': <VPNClient windowId={id} />,
        'file-encryption': <FileEncryption windowId={id} />,
        
        // PASSWORD MANAGER - COMPONENTE REAL
        'password-manager': <PasswordManager windowId={id} />,
        'passwordmanager': <PasswordManager windowId={id} />,
        'text-editor': <TextEditor windowId={id} />,

        calculator: <Calculator windowId={id} />,
        // Placeholders mejorados para todas las nuevas apps
        spreadsheet: <Spreadsheet windowId={id} />,
        
        // ... resto de placeholders (igual que antes)
       
        'pdf-reader': (
          <div className="app-content">
            <div className="app-header">
              <h2>📄 PDF Reader</h2>
              <p>Document viewer</p>
            </div>
            <div className="pdf-viewer">
              <div className="document-placeholder">
                <p>📄 No document opened</p>
                <button className="open-button">Open PDF File</button>
              </div>
            </div>
          </div>
        ),
        youtube: (
          <div className="app-content">
            <div className="app-header">
              <h2>📺 YouTube</h2>
              <p>Video platform</p>
            </div>
            <div className="video-container">
              <div className="video-placeholder">
                <p>🎬 Video Player</p>
                <p>Search for videos to watch</p>
              </div>
            </div>
          </div>
        ),
        spotify: (
          <div className="app-content">
            <div className="app-header">
              <h2>🎵 Spotify</h2>
              <p>Music streaming</p>
            </div>
            <div className="music-player">
              <div className="now-playing">
                <p>🎧 Now Playing</p>
                <p>No song selected</p>
              </div>
            </div>
          </div>
        ),
        // ... resto de placeholders
        chromedragon: <div className="app-content"><h2>🐉 Chrome Dragon</h2><p>Alternative browser</p></div>,
        gimp: <div className="app-content"><h2>🎨 GIMP</h2><p>Image editor</p></div>,
        inkscape: <div className="app-content"><h2>✏️ Inkscape</h2><p>Vector graphics editor</p></div>,
        blender: <div className="app-content"><h2>🎬 Blender</h2><p>3D modeling software</p></div>,
        screenshot: <div className="app-content"><h2>📸 Screenshot Tool</h2><p>Screen capture utility</p></div>,
        audacity: <div className="app-content"><h2>🎵 Audacity</h2><p>Audio editor</p></div>,
        camera: <div className="app-content"><h2>📷 Camera</h2><p>Camera application</p></div>,
        gallery: <div className="app-content"><h2>🖼️ Gallery</h2><p>Image viewer</p></div>,
        nintendo: <div className="app-content"><h2>🎮 NES Emulator</h2><p>Nintendo emulator</p></div>,
        nmap: <div className="app-content"><h2>🔍 Network Scanner</h2><p>Network security scanner</p></div>,
        wireshark: <div className="app-content"><h2>📡 Wireshark</h2><p>Network protocol analyzer</p></div>,
        metasploit: <div className="app-content"><h2>⚔️ Metasploit</h2><p>Penetration testing framework</p></div>,
        'burp-suite': <div className="app-content"><h2>🛡️ Burp Suite</h2><p>Web security testing</p></div>,
        neovim: <div className="app-content"><h2>⚡ Neovim</h2><p>Modal text editor</p></div>,
        vscode: <div className="app-content"><h2>📝 Code Editor</h2><p>Development environment</p></div>,
        'git-gui': <div className="app-content"><h2>📚 Git GUI</h2><p>Graphical Git interface</p></div>,
        files: <div className="app-content"><h2>📁 File Manager</h2><p>File system browser</p></div>,
        monitor: <div className="app-content"><h2>📊 System Monitor</h2><p>System performance monitor</p></div>,
        'software-updater': <div className="app-content"><h2>🔄 Software Updater</h2><p>System updates manager</p></div>,
        'service-manager': <div className="app-content"><h2>🛠️ Service Manager</h2><p>System services control</p></div>,
        'system-logs': <div className="app-content"><h2>📋 System Logs</h2><p>System logs viewer</p></div>,
        'backup-tool': <div className="app-content"><h2>💾 Backup Tool</h2><p>Data backup utility</p></div>,
        firewall: <div className="app-content"><h2>🔥 Firewall Config</h2><p>Firewall configuration</p></div>,
        calendar: <div className="app-content"><h2>📅 Calendar</h2><p>Calendar and scheduler</p></div>,
        'screen-magnifier': <div className="app-content"><h2>🔍 Screen Magnifier</h2><p>Screen magnification tool</p></div>,
        'screen-reader': <div className="app-content"><h2>📢 Screen Reader</h2><p>Screen reading utility</p></div>,
        'on-screen-keyboard': <div className="app-content"><h2>⌨️ On-Screen Keyboard</h2><p>Virtual keyboard</p></div>,
        'high-contrast': <div className="app-content"><h2>⚫ High Contrast</h2><p>High contrast mode</p></div>
      };
      return components[appName] || <div className="app-content"><h2>{appName}</h2><p>Aplicación - System SWAT</p></div>;
    };

    const getAppIcon = (appName) => {
      const icons = {
        // Privacy - AGREGADO PASSWORD MANAGER
        'tor-browser': 'https://img.icons8.com/color/48/tor-project.png',
        'vpn-client': 'https://img.icons8.com/color/48/vpn.png',
        'file-encryption': 'https://img.icons8.com/color/48/encryption.png',
        'password-manager': 'https://img.icons8.com/color/48/password.png',
        'passwordmanager': 'https://img.icons8.com/color/48/password.png',
        
        // Office
        'text-editor': 'https://img.icons8.com/color/48/document.png',
        calculator: 'https://img.icons8.com/color/48/calculator.png',
        spreadsheet: 'https://img.icons8.com/color/48/spreadsheet.png',
        'pdf-reader': 'https://img.icons8.com/color/48/pdf.png',
        
        // Internet
        browser: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/firefox.svg',
        firefox: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/firefox.svg',
        youtube: 'https://img.icons8.com/color/48/youtube-play.png',
        spotify: 'https://img.icons8.com/color/48/spotify--v1.png',
        chromedragon: 'https://img.icons8.com/color/48/chrome--v1.png',
        
        // Graphics
        gimp: 'https://img.icons8.com/color/48/gimp.png',
        inkscape: 'https://img.icons8.com/color/48/inkscape.png',
        blender: 'https://img.icons8.com/color/48/blender-3d.png',
        screenshot: 'https://img.icons8.com/color/48/screenshot.png',
        
        // Sound & Video
        vlc: 'https://img.icons8.com/color/48/vlc.png',
        audacity: 'https://img.icons8.com/color/48/audacity.png',
        camera: 'https://img.icons8.com/color/48/camera.png',
        gallery: 'https://img.icons8.com/color/48/picture.png',
        
        // Games
        tictactoe: 'https://img.icons8.com/color/48/tic-tac-toe.png',
        flappybird: 'https://img.icons8.com/color/48/bird.png',
        snake: 'https://img.icons8.com/color/48/snake.png',
        'nes-emulator': 'https://img.icons8.com/color/48/nintendo-switch.png',
        nintendo: 'https://img.icons8.com/color/48/nintendo-switch.png',
        tetris: 'https://img.icons8.com/color/48/tetris.png',
        
        // Pentesting
        nmap: 'https://img.icons8.com/color/48/network.png',
        wireshark: 'https://img.icons8.com/color/48/wireshark.png',
        metasploit: 'https://img.icons8.com/color/48/security-shield.png',
        'burp-suite': 'https://img.icons8.com/color/48/bug.png',
        
        // Programming
        terminal: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/utilities-terminal.svg',
        neovim: 'https://img.icons8.com/color/48/console.png',
        nvim: 'https://img.icons8.com/color/48/console.png',
        vscode: 'https://img.icons8.com/color/48/visual-studio-code-2019.png',
        'code-editor': 'https://img.icons8.com/color/48/visual-studio-code-2019.png',
        'git-gui': 'https://img.icons8.com/color/48/git.png',
        
        // System Tools
        files: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/system-file-manager.svg',
        'file-manager': 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/system-file-manager.svg',
        'system-monitor': 'https://img.icons8.com/color/48/monitor.png',
        monitor: 'https://img.icons8.com/color/48/monitor.png',
        settings: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/preferences-system.svg',
        'software-updater': 'https://img.icons8.com/color/48/update.png',
        
        // System Services
        'service-manager': 'https://img.icons8.com/color/48/services.png',
        'system-logs': 'https://img.icons8.com/color/48/maintenance.png',
        'backup-tool': 'https://img.icons8.com/color/48/backup.png',
        firewall: 'https://img.icons8.com/color/48/firewall.png',
        
        // Accessories
        calendar: 'https://img.icons8.com/color/48/calendar.png',
        
        // Universal Access
        'screen-magnifier': 'https://img.icons8.com/color/48/search.png',
        'screen-reader': 'https://img.icons8.com/color/48/audio.png',
        'on-screen-keyboard': 'https://img.icons8.com/color/48/keyboard.png',
        'high-contrast': 'https://img.icons8.com/color/48/contrast.png',
        
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
          window.id === id ? { ...window, minimized: !window.minimized } : window
        ));
      },
      maximizeApp: (id) => {
        const window = activeWindows.find(w => w.id === id);
        const isMobile = window?.isMobile || window.innerWidth <= 768;
        const isMaximized = window.size.width === '95%' || window.size.width === '98vw';
        
        if (isMaximized) {
          // Restaurar
          const defaultSize = isMobile ? getMobileSize(window.appName) : getDefaultSize(window.appName);
          setActiveWindows(prev => prev.map(w => 
            w.id === id ? { 
              ...w, 
              size: defaultSize,
              position: isMobile ? { x: '2.5vw', y: '5vh' } : { x: 100, y: 100 }
            } : w
          ));
        } else {
          // Maximizar
          setActiveWindows(prev => prev.map(w => 
            w.id === id ? { 
              ...w, 
              size: isMobile ? { width: '98vw', height: '90vh' } : { width: '95%', height: '90%' },
              position: isMobile ? { x: '1vw', y: '2vh' } : { x: '2.5%', y: '5%' }
            } : w
          ));
        }
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

  // Resto del código del WindowManager (las funciones de drag y drop) se mantienen igual...
  // Función para manejar el inicio del arrastre (CORREGIDA)
  const handleDragStart = (windowId, e) => {
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

    windowElement.classList.add('window-dragging');
    
    if (e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  // Función para manejar el arrastre (CORREGIDA)
  const handleDrag = (e) => {
    if (!draggingWindow) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const windowIndex = activeWindows.findIndex(w => w.id === draggingWindow);
    if (windowIndex === -1) return;

    const currentWindow = activeWindows[windowIndex];
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

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

  // Función para manejar el fin del arrastre (CORREGIDA)
  const handleDragEnd = (e) => {
    if (!draggingWindow) return;

    const windowElement = document.querySelector(`.window[data-window-id="${draggingWindow}"]`);
    if (windowElement) {
      windowElement.classList.remove('window-dragging');
    }

    setDraggingWindow(null);
    setDragOffset({ x: 0, y: 0 });

    if (e && e.cancelable) {
      e.preventDefault();
    }
  };

  // Efecto para manejar eventos globales (CORREGIDO)
  useEffect(() => {
    if (draggingWindow) {
      const handleMouseMove = (e) => {
        if (e.cancelable) e.preventDefault();
        handleDrag(e);
      };

      const handleTouchMove = (e) => {
        if (e.cancelable) e.preventDefault();
        handleDrag(e);
      };

      const handleMouseUp = (e) => {
        handleDragEnd(e);
      };

      const handleTouchEnd = (e) => {
        handleDragEnd(e);
      };

      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchEnd);
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

  // FUNCIONES CORREGIDAS PARA LOS BOTONES
  const handleMinimize = (id, e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (window.windowManager && window.windowManager.minimizeApp) {
      window.windowManager.minimizeApp(id);
    }
  };

  const handleMaximize = (id, e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (window.windowManager && window.windowManager.maximizeApp) {
      window.windowManager.maximizeApp(id);
    }
  };

  const handleClose = (id, e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (window.windowManager && window.windowManager.closeApp) {
      window.windowManager.closeApp(id);
    }
  };

  return (
    <div className="window-manager">
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
            height: window.size.height,
            display: window.minimized ? 'none' : 'flex'
          }}
          onClick={() => bringToFront(window.id)}
          onTouchStart={() => bringToFront(window.id)}
        >
          {/* HEADER ESTILO PARROT OS */}
          <div 
            className="window-header"
            onMouseDown={(e) => handleDragStart(window.id, e)}
            onTouchStart={(e) => handleDragStart(window.id, e)}
          >
            <div className="window-title-section">
              <img src={window.icon} alt="" className="window-title-icon" />
              <div className="window-title">
                {window.title}
              </div>
            </div>
            <div className="window-controls">
              <button 
                onClick={(e) => handleMinimize(window.id, e)}
                onTouchEnd={(e) => handleMinimize(window.id, e)}
                title="Minimizar"
                className="control-button minimize-button"
              >
                <span className="control-dot"></span>
              </button>
              <button 
                onClick={(e) => handleMaximize(window.id, e)}
                onTouchEnd={(e) => handleMaximize(window.id, e)}
                title="Maximizar"
                className="control-button maximize-button"
              >
                <span className="control-dot"></span>
              </button>
              <button 
                onClick={(e) => handleClose(window.id, e)}
                onTouchEnd={(e) => handleClose(window.id, e)}
                title="Cerrar"
                className="control-button close-button"
              >
                <span className="control-dot"></span>
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
          border: 1px solid #3a3f4b;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          pointer-events: all;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
          resize: both;
        }
        
        .window.desktop {
          min-width: min(400px, 90vw);
          min-height: min(300px, 50vh);
          max-width: 95vw;
          max-height: 90vh;
        }
        
        .window.mobile {
          min-width: 85vw;
          min-height: 50vh;
          max-width: 98vw;
          max-height: 90vh;
          border-width: 1px;
          border-radius: 12px;
        }
        
        .window.minimized {
          display: none !important;
        }
        
        .window.active {
          border-color: #4a5568;
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        
        .window-dragging {
          opacity: 0.95;
          cursor: grabbing !important;
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.15);
          transition: none;
          z-index: 9999 !important;
        }
        
        .window-header {
          background: #2F343F;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #3a3f4b;
          cursor: grab;
          user-select: none;
          touch-action: pan-x pan-y;
          min-height: 36px;
          gap: 12px;
        }
        
        .window.mobile .window-header {
          min-height: 44px;
          padding: 12px 16px;
          cursor: default;
          touch-action: pan-x pan-y;
        }
        
        .window-dragging .window-header {
          touch-action: none;
        }
        
        .window-header:active {
          cursor: grabbing;
        }
        
        .window-title-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        
        .window-title-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          flex-shrink: 0;
        }
        
        .window-title {
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Ubuntu', sans-serif;
          letter-spacing: 0.2px;
        }
        
        .window.mobile .window-title {
          font-size: 14px;
        }
        
        .window-controls {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        
        .window.mobile .window-controls {
          gap: 8px;
        }
        
        .control-button {
          background: none;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          font-family: 'Ubuntu Mono', monospace;
          font-weight: bold;
          touch-action: manipulation;
          position: relative;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        .window.desktop .control-button {
          width: 12px;
          height: 12px;
        }
        
        .window.mobile .control-button {
          width: 16px;
          height: 16px;
        }
        
        .control-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .window.desktop .control-dot {
          width: 6px;
          height: 6px;
        }
        
        .window.mobile .control-dot {
          width: 10px;
          height: 10px;
        }
        
        .minimize-button .control-dot {
          background: #f6ad55;
        }
        
        .minimize-button:hover .control-dot {
          background: #fbd38d;
          transform: scale(1.2);
        }
        
        .maximize-button .control-dot {
          background: #68d391;
        }
        
        .maximize-button:hover .control-dot {
          background: #9ae6b4;
          transform: scale(1.2);
        }
        
        .close-button .control-dot {
          background: #fc8181;
        }
        
        .close-button:hover .control-dot {
          background: #feb2b2;
          transform: scale(1.2);
        }
        
        .control-button:active {
          transform: scale(0.9);
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
          background: #1a202c;
          color: var(--text-primary);
        }

        .app-header {
          text-align: center;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid #2d3748;
        }

        .app-header h2 {
          color: #e2e8f0;
          margin-bottom: var(--space-sm);
          font-size: var(--text-xl);
          font-weight: 600;
        }

        .app-header p {
          color: #a0aec0;
          font-size: var(--text-md);
        }

        .app-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .feature-section {
          background: #2d3748;
          padding: var(--space-md);
          border-radius: 8px;
        }

        .feature-section h3 {
          color: #e2e8f0;
          margin-bottom: var(--space-sm);
          font-size: var(--text-lg);
        }

        .feature-section ul {
          color: #a0aec0;
          padding-left: var(--space-md);
        }

        .feature-section li {
          margin-bottom: var(--space-xs);
        }

        .vault-status {
          background: #2d3748;
          padding: var(--space-md);
          border-radius: 8px;
          text-align: center;
        }

        .vault-status p {
          margin-bottom: var(--space-sm);
          font-size: var(--text-md);
        }

        .editor-area {
          flex: 1;
          display: flex;
        }

        .text-editor {
          flex: 1;
          background: #2d3748;
          border: 1px solid #4a5568;
          border-radius: 4px;
          padding: var(--space-md);
          color: #e2e8f0;
          font-family: 'Ubuntu Mono', monospace;
          resize: none;
          outline: none;
        }

        .calculator-display {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .display {
          background: #2d3748;
          padding: var(--space-md);
          border-radius: 4px;
          text-align: right;
          font-size: var(--text-xl);
          font-family: 'Ubuntu Mono', monospace;
          color: #e2e8f0;
        }

        .calculator-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .button-row {
          display: flex;
          gap: var(--space-sm);
        }

        .button-row button {
          flex: 1;
          padding: var(--space-md);
          background: #4a5568;
          border: none;
          border-radius: 4px;
          color: #e2e8f0;
          cursor: pointer;
          transition: background 0.2s;
        }

        .button-row button:hover {
          background: #718096;
        }

        .spreadsheet-grid {
          flex: 1;
          overflow: auto;
        }

        .spreadsheet-grid table {
          width: 100%;
          border-collapse: collapse;
        }

        .spreadsheet-grid th,
        .spreadsheet-grid td {
          border: 1px solid #4a5568;
          padding: var(--space-sm);
          text-align: center;
          min-width: 80px;
        }

        .spreadsheet-grid th {
          background: #2d3748;
          color: #e2e8f0;
          font-weight: 600;
        }

        .spreadsheet-grid td {
          background: #1a202c;
          color: #a0aec0;
        }

        .pdf-viewer {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .document-placeholder {
          text-align: center;
          color: #a0aec0;
        }

        .open-button {
          margin-top: var(--space-md);
          padding: var(--space-sm) var(--space-md);
          background: #4a5568;
          border: none;
          border-radius: 4px;
          color: #e2e8f0;
          cursor: pointer;
        }

        .video-container,
        .music-player {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-placeholder,
        .now-playing {
          text-align: center;
          color: #a0aec0;
        }

        .window.mobile .app-content {
          padding: var(--space-md);
        }

        @media (max-width: 768px) {
          .window.desktop {
            min-width: 85vw;
            min-height: 50vh;
          }
          
          .window-header {
            padding: 10px 14px;
            min-height: 40px;
          }
          
          .window-title {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .window.mobile {
            min-width: 92vw;
            min-height: 60vh;
          }
          
          .window-header {
            padding: 8px 12px;
            min-height: 36px;
          }
          
          .window.mobile .control-button {
            width: 14px;
            height: 14px;
          }
          
          .window.mobile .control-dot {
            width: 8px;
            height: 8px;
          }
        }

        .window-content::-webkit-scrollbar {
          width: 6px;
        }

        .window.mobile .window-content::-webkit-scrollbar {
          width: 4px;
        }

        .window-content::-webkit-scrollbar-track {
          background: #2d3748;
        }

        .window-content::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 3px;
        }

        .window-content::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
};

export default WindowManager;