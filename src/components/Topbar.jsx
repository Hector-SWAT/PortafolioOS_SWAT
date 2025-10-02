import { useEffect, useRef, useState } from 'react';
import '../styles/global.css';

export default function Topbar() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showResourceCenter, setShowResourceCenter] = useState(false);
  const [cpuUsage, setCpuUsage] = useState([45, 60, 30]);
  const [ramUsage, setRamUsage] = useState(65);
  const startMenuRef = useRef(null);
  const startButtonRef = useRef(null);
  const volumeRef = useRef(null);
  const resourceRef = useRef(null);

  // Categorías organizadas según tu solicitud
  const menuCategories = {
    privacy: {
      name: "Privacy",
      icon: "🔒",
      apps: [
        { id: 'tor', name: 'Tor Browser', icon: 'https://img.icons8.com/?size=100&id=hLMTBGNK3SyO&format=png&color=000000' },
        { id: 'vpn', name: 'VPN Client', icon: 'https://img.icons8.com/color/48/vpn.png' },
        { id: 'encryption', name: 'File Encryption', icon: 'https://img.icons8.com/?size=100&id=vhelEx8inlrI&format=png&color=000000' },
        { id: 'password', name: 'Password Manager', icon: 'https://img.icons8.com/color/48/password.png' }
      ]
    },
    office: {
      name: "Office",
      icon: "📊",
      apps: [
        { id: 'writer', name: 'Text Editor', icon: 'https://img.icons8.com/color/48/document.png' },
        { id: 'calc', name: 'Calculator', icon: 'https://img.icons8.com/color/48/calculator.png' },
        { id: 'spreadsheet', name: 'Spreadsheet', icon: 'https://img.icons8.com/?size=100&id=20830&format=png&color=000000' },
        { id: 'pdf', name: 'PDF Reader', icon: 'https://img.icons8.com/color/48/pdf.png' }
      ]
    },
    internet: {
      name: "Internet",
      icon: "🌐",
      apps: [
        { id: 'browser', name: 'FireFox', icon: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/firefox.svg' },
        { id: 'youtube', name: 'YouTube', icon: 'https://img.icons8.com/color/48/youtube-play.png' },
        { id: 'spotify', name: 'Spotify', icon: 'https://img.icons8.com/color/48/spotify--v1.png' },
        { id: 'chromedragon', name: 'Chrome Dragon', icon: 'https://img.icons8.com/?size=100&id=XypsZnOAIrci&format=png&color=000000' }
      ]
    },
    graphics: {
      name: "Graphics",
      icon: "🎨",
      apps: [
        { id: 'gimp', name: 'GIMP', icon: 'https://img.icons8.com/color/48/gimp.png' },
        { id: 'inkscape', name: 'Inkscape', icon: 'https://img.icons8.com/color/48/inkscape.png' },
        { id: 'blender', name: 'Blender', icon: 'https://img.icons8.com/color/48/blender-3d.png' },
        { id: 'screenshot', name: 'Screenshot Tool', icon: 'https://img.icons8.com/color/48/screenshot.png' }
      ]
    },
    sound: {
      name: "Sound & Video",
      icon: "🎵",
      apps: [
        { id: 'vlc', name: 'VLC Player', icon: 'https://img.icons8.com/color/48/vlc.png' },
        { id: 'audacity', name: 'Audacity', icon: 'https://img.icons8.com/color/48/audacity.png' },
        { id: 'camera', name: 'Camera', icon: 'https://img.icons8.com/color/48/camera.png' },
        { id: 'gallery', name: 'Gallery', icon: 'https://img.icons8.com/color/48/picture.png' }
      ]
    },
    games: {
      name: "Games",
      icon: "🎮",
      apps: [
        { id: 'flappybird', name: 'Flappy Bird', icon: './icons/Flapybird.png' },
        { id: 'tictactoe', name: 'Tic Tac Toe', icon: 'https://img.icons8.com/?size=100&id=lbJCBsemR2JG&format=png&color=000000' },
        { id: 'snake', name: 'Snake Game', icon: 'https://img.icons8.com/color/48/snake.png' },
        { id: 'nintendo', name: 'NES Emulator', icon: 'https://img.icons8.com/color/48/nintendo-switch.png' }
      ]
    },
    pentesting: {
      name: "Pentesting",
      icon: "🛡️",
      apps: [
        { id: 'nmap', name: 'Network Scanner', icon: './icons/UserNetworkScanner.png' },
        { id: 'wireshark', name: 'Wireshark', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Wireshark_icon_new.png' },
        { id: 'metasploit', name: 'Metasploit', icon: 'https://img.icons8.com/?size=100&id=97AFS4JiW8vx&format=png&color=000000' },
        { id: 'burp', name: 'Burp Suite', icon: './icons/UserBurpSuite.ico' }
      ]
    },
    programming: {
      name: "Programming",
      icon: "💻",
      apps: [
        { id: 'terminal', name: 'Terminal', icon: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/utilities-terminal.svg' },
        { id: 'nvim', name: 'Neovim', icon: './icons/UserNvim.ico' },
        { id: 'vscode', name: 'Code Editor', icon: 'https://img.icons8.com/color/48/visual-studio-code-2019.png' },
        { id: 'git', name: 'Git GUI', icon: 'https://img.icons8.com/color/48/git.png' }
      ]
    },
    system: {
      name: "System Tools",
      icon: "⚙️",
      apps: [
        { id: 'files', name: 'File Manager', icon: 'https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/system-file-manager.svg' },
        { id: 'monitor', name: 'System Monitor', icon: 'https://img.icons8.com/color/48/monitor.png' },
        { id: 'settings', name: 'Settings', icon: 'https://img.icons8.com/?size=100&id=12784&format=png&color=000000' },
        { id: 'updater', name: 'Software Updater', icon: 'https://img.icons8.com/?size=100&id=wLgsZitlWmzO&format=png&color=000000' }
      ]
    },
    services: {
      name: "System Services",
      icon: "🔧",
      apps: [
        { id: 'services', name: 'Service Manager', icon: 'https://img.icons8.com/color/48/services.png' },
        { id: 'logs', name: 'System Logs', icon: 'https://img.icons8.com/color/48/maintenance.png' },
        { id: 'backup', name: 'Backup Tool', icon: './icons/UserBackupTool.png' },
        { id: 'firewall', name: 'Firewall Config', icon: 'https://img.icons8.com/color/48/firewall.png' }
      ]
    },
    accessories: {
      name: "Accessories",
      icon: "📁",
      apps: [
        { id: 'notes', name: 'Text Editor', icon: 'https://img.icons8.com/color/48/note.png' },
        { id: 'calendar', name: 'Calendar', icon: 'https://img.icons8.com/color/48/calendar.png' },
        { id: 'calculator', name: 'Calculator', icon: 'https://img.icons8.com/color/48/calculator.png' },
        { id: 'screenshot', name: 'Screenshot', icon: 'https://img.icons8.com/color/48/screenshot.png' }
      ]
    },
    universal: {
      name: "Universal Access",
      icon: "♿",
      apps: [
        { id: 'magnifier', name: 'Screen Magnifier', icon: 'https://img.icons8.com/?size=100&id=s9g93QuMnUPE&format=png&color=000000' },
        { id: 'reader', name: 'Screen Reader', icon: 'https://img.icons8.com/?size=100&id=u0R1sbtKdYC6&format=png&color=000000' },
        { id: 'keyboard', name: 'On-Screen Keyboard', icon: 'https://img.icons8.com/color/48/keyboard.png' },
        { id: 'highcontrast', name: 'High Contrast', icon: 'https://img.icons8.com/?size=100&id=2oDjYHY9ZT8s&format=png&color=000000' }
      ]
    }
  };

  // Simular datos del sistema
  useEffect(() => {
    const updateSystemStats = () => {
      setCpuUsage(prev => prev.map(usage =>
        Math.min(100, Math.max(0, usage + (Math.random() * 10 - 5)))
      ));
      setRamUsage(prev => Math.min(100, Math.max(0, prev + (Math.random() * 6 - 3))));
    };

    updateSystemStats();
    const interval = setInterval(updateSystemStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar reloj
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isStartMenuOpen && startMenuRef.current && !startMenuRef.current.contains(event.target) && startButtonRef.current && !startButtonRef.current.contains(event.target)) {
        setIsStartMenuOpen(false);
        setActiveCategory(null);
      }
      if (showVolumeSlider && volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
      if (showResourceCenter && resourceRef.current && !resourceRef.current.contains(event.target)) {
        setShowResourceCenter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen, showVolumeSlider, showResourceCenter]);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
    if (!isStartMenuOpen) {
      setActiveCategory(null);
    }
    setShowVolumeSlider(false);
    setShowResourceCenter(false);
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
    setIsStartMenuOpen(false);
    setActiveCategory(null);
    setShowResourceCenter(false);
  };

  const toggleResourceCenter = () => {
    setShowResourceCenter(!showResourceCenter);
    setIsStartMenuOpen(false);
    setActiveCategory(null);
    setShowVolumeSlider(false);
  };

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(activeCategory === categoryKey ? null : categoryKey);
  };

  const handleAppClick = (appId) => {
    if (window.windowManager) {
      window.windowManager.openApp(appId);
    }
    setIsStartMenuOpen(false);
    setActiveCategory(null);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  return (
    <div className="topbar">
      {/* IZQUIERDA - MENÚ APPLICATIONS */}
      <div className="topbar-left">
        <div className="start-menu-wrapper">
          <button
            ref={startButtonRef}
            className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
            onClick={toggleStartMenu}
          >
            <img src="/icons/parrot.svg" alt="Parrot OS" className="start-button-icon" style={{
              width: '24px',
              height: '24px',
              filter: 'none',
              opacity: '1'
            }} />
            <span>Applications</span>
          </button>

          {/* START MENU */}
          <nav
            ref={startMenuRef}
            className={`start-menu ${isStartMenuOpen ? 'show' : ''}`}
          >
            <div className="start-menu-content">
              {/* CATEGORÍAS */}
              <div className="categories-sidebar">
                {Object.entries(menuCategories).map(([key, category]) => (
                  <button
                    key={key}
                    className={`category-item ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(key)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <img 
                      src="https://img.icons8.com/?size=100&id=85837&format=png&color=000000" 
                      alt="arrow"
                      className={`category-arrow ${activeCategory === key ? 'rotated' : ''}`}
                    />
                  </button>
                ))}
              </div>

              {/* APLICACIONES - Solo se muestra cuando hay categoría activa */}
              <div className="apps-panel">
                {activeCategory ? (
                  <div className="apps-grid">
                    <h3 className="apps-panel-title">{menuCategories[activeCategory].name}</h3>
                    <div className="apps-list">
                      {menuCategories[activeCategory].apps.map((app) => (
                        <button
                          key={app.id}
                          className="app-item"
                          onClick={() => handleAppClick(app.id)}
                        >
                          <img src={app.icon} alt={app.name} className="app-icon" />
                          <span className="app-name">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty-panel">
                    <div className="empty-icon">📱</div>
                    <p>Select a category to view applications</p>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* APLICACIONES FIJAS EN TOPBAR */}
        <div className="quick-apps">
          <div className="quick-app" onClick={() => handleAppClick('browser')} title="Firefox">
            <img src="https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/firefox.svg" alt="Firefox" />
          </div>
          <div className="quick-app" onClick={() => handleAppClick('terminal')} title="Terminal">
            <img src="https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/utilities-terminal.svg" alt="Terminal" />
          </div>
          <div className="quick-app" onClick={() => handleAppClick('files')} title="File Manager">
            <img src="https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/32x32/apps/system-file-manager.svg" alt="Files" />
          </div>
          <div className="quick-app" onClick={() => handleAppClick('settings')} title="Settings">
            <img src="https://img.icons8.com/?size=100&id=12784&format=png&color=000000" alt="Settings" />
          </div>
        </div>
      </div>

      {/* CENTRO - RECURSOS DEL SISTEMA */}
      <div className="topbar-center">
        <div className="resource-monitor" onClick={toggleResourceCenter}>
          <div className="resource-display">
            <div className="cpu-display">
              <span className="resource-title">CPU</span>
              <div className="cpu-bars">
                {cpuUsage.slice(0, 3).map((usage, index) => (
                  <div key={index} className="cpu-core">
                    <div
                      className="cpu-bar"
                      style={{ height: `${usage}%` }}
                    ></div>
                    <span className="core-label">{index + 1}</span>
                  </div>
                ))}
              </div>
              <span className="resource-value">{Math.round(cpuUsage[0])}%</span>
            </div>

            <div className="ram-display">
              <span className="resource-title">RAM</span>
              <div className="ram-bar-container">
                <div
                  className="ram-bar"
                  style={{ width: `${ramUsage}%` }}
                ></div>
              </div>
              <span className="resource-value">{Math.round(ramUsage)}%</span>
            </div>
          </div>

          {/* PANEL EXPANDIDO */}
          {showResourceCenter && (
            <div className="resource-panel console-style" ref={resourceRef}>
              <div className="console-header">
                <span className="console-title">SYSTEM MONITOR</span>
                <span className="console-close" onClick={toggleResourceCenter}>×</span>
              </div>

              <div className="console-content">
                <div className="console-section">
                  <div className="console-line">
                    <span className="console-prompt">$</span>
                    <span className="console-text">cpu_usage --cores 4 --live</span>
                  </div>
                  {cpuUsage.map((usage, index) => (
                    <div key={index} className="console-line">
                      <span className="console-output">Core {index + 1}: </span>
                      <span className="console-value">{Math.round(usage)}%</span>
                      <div className="console-bar">
                        <div
                          className="console-bar-fill"
                          style={{ width: `${usage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="console-section">
                  <div className="console-line">
                    <span className="console-prompt">$</span>
                    <span className="console-text">memory_status --detailed</span>
                  </div>
                  <div className="console-line">
                    <span className="console-output">RAM Usage: </span>
                    <span className="console-value">{Math.round(ramUsage)}%</span>
                    <div className="console-bar">
                      <div
                        className="console-bar-fill"
                        style={{ width: `${ramUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="console-line">
                    <span className="console-output">Memory: </span>
                    <span className="console-value">{(ramUsage * 0.08).toFixed(1)}GB / 8.0GB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DERECHA - SISTEMA Y RELOJ */}
      <div className="topbar-right">
        <div className="system-tray">
          <div className="tray-icon" title="Ethernet Connection">
            <img src="https://img.icons8.com/?size=100&id=43824&format=png&color=FFFFFF" alt="Ethernet" />
          </div>

          <div className="tray-icon volume-control" ref={volumeRef} title="Volume Control">
            <img
              src="https://img.icons8.com/?size=100&id=8EyaKMqDrrMI&format=png&color=FFFFFF"
              alt="Volume"
              onClick={toggleVolumeSlider}
            />
            {showVolumeSlider && (
              <div className="volume-slider">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-range"
                />
                <span className="volume-percent">{volume}%</span>
              </div>
            )}
          </div>

          <div className="clock">
            <span className="time">{currentTime}</span>
            <span className="date">{currentDate}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 40px;
          background: #0F2030;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          z-index: 1000;
          box-sizing: border-box;
          font-family: 'Ubuntu Mono', monospace;
        }

        .topbar-left,
        .topbar-center,
        .topbar-right {
          display: flex;
          align-items: center;
          height: 100%;
        }

        .topbar-left {
          flex: 1;
        }

        .topbar-center {
          flex: 0 1 auto;
        }

        .topbar-right {
          flex: 1;
          justify-content: flex-end;
        }

        /* START BUTTON */
        .start-menu-wrapper {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .start-button {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0 12px;
          color: white;
          font-size: 12px;
          font-family: 'Ubuntu', sans-serif;
        }

        .start-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .start-button.active {
          background: #4a90e2;
        }

        .start-button-icon {
          width: 20px;
          height: 20px;
          filter: brightness(0) invert(1);
        }

        /* QUICK APPS */
        .quick-apps {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-left: 10px;
          height: 100%;
        }

        .quick-app {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-app:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .quick-app img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        /* START MENU */
        .start-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background: #0F2030;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          min-width: 700px;
          max-width: 80vw;
          height: 500px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          animation: slideDown 0.2s ease-out;
          z-index: 1001;
          overflow: hidden;
        }

        .start-menu.show {
          display: block;
        }

        .start-menu-content {
          display: flex;
          height: 100%;
        }

        .categories-sidebar {
          width: 220px;
          background: rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow-y: auto;
        }

        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          color: white;
          padding: 10px 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          text-align: left;
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .category-item.active {
          background: #4a90e2;
        }

        .category-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          margin-right: 10px;
        }

        .category-name {
          flex: 1;
        }

        .category-arrow {
          width: 12px;
          height: 12px;
          opacity: 0.7;
          transition: transform 0.2s ease;
          filter: brightness(0) invert(1);
        }

        .category-arrow.rotated {
          transform: rotate(90deg);
        }

        .apps-panel {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
        }

        .apps-grid {
          width: 100%;
        }

        .apps-panel-title {
          color: white;
          margin-bottom: 20px;
          font-size: 18px;
          font-weight: 600;
        }

        .apps-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }

        .app-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          border-radius: 6px;
          padding: 12px 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .app-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .app-icon {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .app-name {
          font-size: 11px;
          text-align: center;
        }

        /* PANEL VACÍO - Reemplaza al welcome panel */
        .empty-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.5;
        }

        .empty-panel p {
          font-size: 14px;
          margin: 0;
        }

        /* RESOURCE MONITOR - CENTRO */
        .resource-monitor {
          position: relative;
          cursor: pointer;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .resource-display {
          display: flex;
          align-items: center;
          gap: 20px;
          height: 100%;
          padding: 0 15px;
        }

        .cpu-display, .ram-display {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #22c55e;
          font-size: 11px;
        }

        .resource-title {
          font-weight: bold;
          color: #22c55e;
        }

        .cpu-bars {
          display: flex;
          align-items: end;
          gap: 3px;
          height: 20px;
        }

        .cpu-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .cpu-bar {
          width: 6px;
          background: #22c55e;
          border-radius: 1px;
          min-height: 2px;
          transition: height 0.3s ease;
        }

        .core-label {
          font-size: 8px;
          color: #22c55e;
        }

        .ram-bar-container {
          width: 40px;
          height: 8px;
          background: rgba(34, 197, 94, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

        .ram-bar {
          height: 100%;
          background: #22c55e;
          transition: width 0.3s ease;
        }

        .resource-value {
          font-weight: bold;
          color: #22c55e;
          min-width: 25px;
          text-align: right;
        }

        /* PANEL DE RECURSOS - ESTILO CONSOLA */
        .resource-panel.console-style {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #000000;
          border: 1px solid #22c55e;
          border-radius: 4px;
          padding: 0;
          min-width: 400px;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
          z-index: 1001;
          font-family: 'Ubuntu Mono', monospace;
        }

        .console-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #0a0a0a;
          border-bottom: 1px solid #22c55e;
        }

        .console-title {
          color: #22c55e;
          font-weight: bold;
          font-size: 12px;
        }

        .console-close {
          color: #22c55e;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
        }

        .console-content {
          padding: 12px;
        }

        .console-section {
          margin-bottom: 15px;
        }

        .console-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          font-size: 11px;
        }

        .console-prompt {
          color: #22c55e;
          font-weight: bold;
        }

        .console-text {
          color: #ffffff;
        }

        .console-output {
          color: #cccccc;
        }

        .console-value {
          color: #22c55e;
          font-weight: bold;
        }

        .console-bar {
          flex: 1;
          max-width: 100px;
          height: 6px;
          background: rgba(34, 197, 94, 0.3);
          border-radius: 1px;
          overflow: hidden;
        }

        .console-bar-fill {
          height: 100%;
          background: #22c55e;
          transition: width 0.3s ease;
        }

        /* SYSTEM TRAY */
        .system-tray {
          display: flex;
          align-items: center;
          gap: 5px;
          height: 100%;
        }

        .tray-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .tray-icon:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .tray-icon img {
          width: 18px;
          height: 18px;
          opacity: 0.9;
        }

        /* VOLUME SLIDER */
        .volume-slider {
          position: absolute;
          top: 100%;
          right: 0;
          background: #0F2030;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 12px;
          margin-top: 5px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          min-width: 120px;
          z-index: 1001;
        }

        .volume-range {
          width: 100%;
          margin: 8px 0;
        }

        .volume-percent {
          display: block;
          text-align: center;
          font-size: 11px;
          color: white;
        }

        /* CLOCK */
        .clock {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: white;
          font-size: 11px;
          line-height: 1.2;
          padding: 0 10px;
          font-family: 'Ubuntu Mono', monospace;
        }

        .time {
          font-weight: 600;
          color: #22c55e;
        }

        .date {
          opacity: 0.8;
          font-size: 9px;
        }

        /* ANIMATIONS */
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .topbar {
            height: 35px;
            padding: 0 8px;
          }

          .start-menu {
            min-width: 95vw;
            height: 450px;
          }

          .categories-sidebar {
            width: 180px;
          }

          .apps-list {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }

          .resource-display {
            gap: 15px;
          }

          .resource-panel.console-style {
            min-width: 350px;
            left: 20px;
            transform: none;
          }

          .quick-apps {
            margin-left: 5px;
            gap: 1px;
          }

          .quick-app {
            width: 28px;
            height: 28px;
          }

          .quick-app img {
            width: 18px;
            height: 18px;
          }
        }

        @media (max-width: 480px) {
          .topbar {
            height: 32px;
          }

          .start-button span {
            display: none;
          }

          .resource-display {
            gap: 10px;
            padding: 0 8px;
          }

          .cpu-display, .ram-display {
            gap: 5px;
          }

          .resource-panel.console-style {
            min-width: 300px;
            left: 10px;
          }

          .clock {
            display: none;
          }

          .quick-apps {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}