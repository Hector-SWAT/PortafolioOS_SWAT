// src/components/Desktop.jsx
import { useEffect, useState } from 'react';
import '../styles/global.css';
import Topbar from './Topbar.jsx';
import WindowManager from './WindowManager.jsx';
import Taskbar from './Taskbar.jsx';

export default function Desktop() {
  const [currentWallpaper, setCurrentWallpaper] = useState('/wallpapers/parrot-default.jpg');
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [activeWindows, setActiveWindows] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(1)
  const [workspaces, setWorkspaces] = useState([])

  // Lista de wallpapers disponibles (incluyendo los subidos por el usuario)
  const [wallpapers, setWallpapers] = useState([
    { id: 1, name: 'Parrot Default', path: '/wallpapers/kali-red-sticker.jpg' },
    { id: 2, name: 'Wallpaper 1', path: '/wallpapers/parrot-dark.jpg' },
    { id: 3, name: 'Wallpaper 2', path: '/wallpapers/parrot-default.jpg' },
    { id: 4, name: 'Wallpaper 3', path: '/wallpapers/wallpaper.png' }
  ]);

  // Esquema de colores por categoría
  const categoryColors = {
    internet: { primary: '#3B82F6', secondary: '#60A5FA', glow: 'rgba(59, 130, 246, 0.4)' },
    multimedia: { primary: '#8B5CF6', secondary: '#A78BFA', glow: 'rgba(139, 92, 246, 0.4)' },
    development: { primary: '#10B981', secondary: '#34D399', glow: 'rgba(16, 185, 129, 0.4)' },
    games: { primary: '#EF4444', secondary: '#F87171', glow: 'rgba(239, 68, 68, 0.4)' },
    system: { primary: '#F59E0B', secondary: '#FBBF24', glow: 'rgba(245, 158, 11, 0.4)' },
    personal: { primary: '#EC4899', secondary: '#F472B6', glow: 'rgba(236, 72, 153, 0.4)' },
    tools: { primary: '#06B6D4', secondary: '#22D3EE', glow: 'rgba(6, 182, 212, 0.4)' }
  };

  // Mapeo de aplicaciones a categorías y colores
  const appCategories = {
    'browser': 'internet',
    'firefox': 'internet',
    'youtube': 'internet',
    'spotify': 'internet',
    'chrome': 'internet',
    'vlc': 'multimedia',
    'camera': 'multimedia',
    'gallery': 'multimedia',
    'terminal': 'development',
    'neovim': 'development',
    'vscode': 'development',
    'code-editor': 'development',
    'tictactoe': 'games',
    'flappy-bird': 'games',
    'snake-game': 'games',
    'nes-emulator': 'games',
    'files': 'system',
    'file-manager': 'system',
    'calculator': 'system',
    'settings': 'system',
    'system-monitor': 'system',
    'portfolio': 'personal',
    'about': 'personal',
    'about-me': 'personal',
    'wallpaper-changer': 'tools'
  };

  // Función para obtener el color de una app
  const getAppColor = (appName) => {
    const category = appCategories[appName] || 'tools';
    return categoryColors[category] || categoryColors.tools;
  };

  // Función auxiliar para convertir hex a rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '30, 138, 74';
  };

  // AÑADIR ESTA FUNCIÓN FALTANTE
  const toggleStartMenu = () => {
    setShowAppMenu(!showAppMenu);
  };

  useEffect(() => {
    // Inicializar windowManager global
    if (!window.windowManager) {
      window.windowManager = {
        openApp: (appName) => {
          console.log('Opening app:', appName);
        },
        closeApp: (id) => {
          console.log('Closing window:', id);
        },
        minimizeApp: (id) => {
          console.log('Minimizing window:', id);
        }
      };
    }

    // Cargar wallpaper guardado del localStorage
    const savedWallpaper = localStorage.getItem('desktop-wallpaper');
    if (savedWallpaper) {
      setCurrentWallpaper(savedWallpaper);
    }

    // Cargar wallpapers subidos por el usuario
    const savedCustomWallpapers = localStorage.getItem('custom-wallpapers');
    if (savedCustomWallpapers) {
      const customWallpapers = JSON.parse(savedCustomWallpapers);
      setWallpapers(prev => [...prev, ...customWallpapers]);
    }
  }, []);

  // Función para manejar clicks en iconos del desktop
  const handleDesktopIconClick = (appName) => {
    if (window.windowManager && window.windowManager.openApp) {
      window.windowManager.openApp(appName);
    }
  };

  // Función para cambiar el wallpaper
  const changeWallpaper = (wallpaperPath) => {
    setCurrentWallpaper(wallpaperPath);
    setShowWallpaperMenu(false);
    localStorage.setItem('desktop-wallpaper', wallpaperPath);
  };

  // Función para toggle del menú de wallpapers
  const toggleWallpaperMenu = () => {
    setShowWallpaperMenu(!showWallpaperMenu);
  };

  // NUEVA FUNCIÓN: Manejar subida de archivos
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const imageUrl = e.target.result;

      // Crear nuevo objeto wallpaper
      const newWallpaper = {
        id: Date.now(), // ID único basado en timestamp
        name: `Personalizado ${wallpapers.filter(w => w.name.startsWith('Personalizado')).length + 1}`,
        path: imageUrl,
        isCustom: true
      };

      // Agregar a la lista de wallpapers
      const updatedWallpapers = [...wallpapers, newWallpaper];
      setWallpapers(updatedWallpapers);

      // Guardar en localStorage
      const customWallpapers = updatedWallpapers.filter(w => w.isCustom);
      localStorage.setItem('custom-wallpapers', JSON.stringify(customWallpapers));

      // Aplicar automáticamente el nuevo wallpaper
      changeWallpaper(imageUrl);

      // Limpiar el input file
      event.target.value = '';
    };

    reader.onerror = () => {
      alert('Error al leer el archivo. Inténtalo de nuevo.');
    };

    reader.readAsDataURL(file);
  };

  // NUEVA FUNCIÓN: Eliminar wallpaper personalizado
  const deleteCustomWallpaper = (wallpaperId, event) => {
    event.stopPropagation(); // Prevenir que se active el cambio de wallpaper

    if (window.confirm('¿Estás seguro de que quieres eliminar este wallpaper?')) {
      const updatedWallpapers = wallpapers.filter(w => w.id !== wallpaperId);
      setWallpapers(updatedWallpapers);

      // Actualizar localStorage
      const customWallpapers = updatedWallpapers.filter(w => w.isCustom);
      localStorage.setItem('custom-wallpapers', JSON.stringify(customWallpapers));

      // Si el wallpaper actual era el que se eliminó, cambiar al default
      const deletedWallpaper = wallpapers.find(w => w.id === wallpaperId);
      if (deletedWallpaper && currentWallpaper === deletedWallpaper.path) {
        changeWallpaper('/wallpapers/parrot-default.jpg');
      }
    }
  };

  return (
    <div className="parrot-os-emulator">
      {/* Fondo de pantalla con imagen personalizada */}
      <div
        className="desktop-background"
        style={{
          backgroundImage: `url('${currentWallpaper}')`
        }}
      >
        <div className="wallpaper-overlay"></div>
      </div>

      {/* WindowManager con todas las props requeridas */}
      <WindowManager
        activeWindows={activeWindows}
        setActiveWindows={setActiveWindows}
        activeApp={activeApp}
        setActiveApp={setActiveApp}
      />

      {/* Topbar */}
      <Topbar />

      {/* Íconos del escritorio */}
      <div className="desktop-icons">
        {/* Portfolio */}
        <div
          className="desktop-icon"
          data-app="portfolio"
          data-category="personal"
          onClick={() => handleDesktopIconClick('portfolio')}
        >
          <div className="icon-wrapper">
            <img
              src="/icons/UserPortafolio.ico"
              alt="Portfolio"
              className="icon-img"
            />
          </div>
          <span>My Portfolio</span>
        </div>

        {/* About Me */}
        <div
          className="desktop-icon"
          data-app="about"
          data-category="personal"
          onClick={() => handleDesktopIconClick('about')}
        >
          <div className="icon-wrapper">
            <img
              src="/icons/UserAbout.ico"
              alt="About Me"
              className="icon-img"
            />
          </div>
          <span>About Me</span>
        </div>

        {/* Browser */}
        <div
          className="desktop-icon"
          data-app="browser"
          data-category="internet"
          onClick={() => handleDesktopIconClick('browser')}
        >
          <div className="icon-wrapper">
            <img
              src="https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/48x48/apps/firefox.svg"
              alt="Navegador"
              className="icon-img"
            />
          </div>
          <span>Firefox</span>
        </div>

        {/* Terminal */}
        <div
          className="desktop-icon"
          data-app="terminal"
          data-category="development"
          onClick={() => handleDesktopIconClick('terminal')}
        >
          <div className="icon-wrapper">
            <img
              src="https://raw.githubusercontent.com/PapirusDevelopmentTeam/papirus-icon-theme/master/Papirus/48x48/apps/utilities-terminal.svg"
              alt="Terminal"
              className="icon-img"
            />
          </div>
          <span>Terminal</span>
        </div>

        {/* TicTacToe */}
        <div
          className="desktop-icon"
          data-app="tictactoe"
          data-category="games"
          onClick={() => handleDesktopIconClick('tictactoe')}
        >
          <div className="icon-wrapper">
            <img
              src="https://img.icons8.com/?size=100&id=lbJCBsemR2JG&format=png&color=000000"
              alt="TicTacToe"
              className="icon-img"
            />
          </div>
          <span>TicTacToe</span>
        </div>

        {/* Change Wallpaper Button */}
        <div
          className="desktop-icon wallpaper-changer"
          data-app="wallpaper-changer"
          data-category="tools"
          onClick={toggleWallpaperMenu}
        >
          <div className="icon-wrapper">
            <img
              src="https://img.icons8.com/?size=100&id=ehnLSgwXdyAB&format=png&color=000000"
              alt="Change Wallpaper"
              className="icon-img"
            />
          </div>
          <span>Wallpapers</span>
        </div>
      </div>

      {/* Menú de selección de wallpapers */}
      {showWallpaperMenu && (
        <div className="wallpaper-menu">
          <div className="wallpaper-menu-header">
            <h3>🎨 Cambiar Fondo de Pantalla</h3>
            <button
              className="close-menu-button"
              onClick={() => setShowWallpaperMenu(false)}
            >
              ×
            </button>
          </div>

          {/* Sección para subir nuevo wallpaper */}
          <div className="upload-section">
            <label htmlFor="wallpaper-upload" className="upload-button">
              📁 Subir Nuevo Wallpaper
            </label>
            <input
              id="wallpaper-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <p className="upload-hint">Formatos: JPG, PNG, GIF (Máx. 5MB)</p>
          </div>

          <div className="wallpaper-grid">
            {wallpapers.map((wallpaper) => (
              <div
                key={wallpaper.id}
                className={`wallpaper-option ${currentWallpaper === wallpaper.path ? 'active' : ''} ${wallpaper.isCustom ? 'custom' : ''}`}
                onClick={() => changeWallpaper(wallpaper.path)}
              >
                <div
                  className="wallpaper-thumbnail"
                  style={{ backgroundImage: `url('${wallpaper.path}')` }}
                >
                  {currentWallpaper === wallpaper.path && (
                    <div className="wallpaper-active-indicator">✓</div>
                  )}
                  {wallpaper.isCustom && (
                    <button
                      className="delete-wallpaper-button"
                      onClick={(e) => deleteCustomWallpaper(wallpaper.id, e)}
                      title="Eliminar wallpaper"
                    >
                      ×
                    </button>
                  )}
                </div>
                <span className="wallpaper-name">{wallpaper.name}</span>
                {wallpaper.isCustom && <span className="custom-badge">Personalizado</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú */}
      {showWallpaperMenu && (
        <div
          className="wallpaper-menu-overlay"
          onClick={() => setShowWallpaperMenu(false)}
        />
      )}

      {/* Taskbar con las props necesarias */}
      <Taskbar
        activeWindows={activeWindows}
        setActiveWindows={setActiveWindows}
        activeApp={activeApp}
        setActiveApp={setActiveApp}
        onShowMenu={toggleStartMenu}
        currentWorkspace={currentWorkspace}
        setCurrentWorkspace={setCurrentWorkspace}
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
      />

      {/* CSS actualizado */}


      <style jsx>{`
  .parrot-os-emulator {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: var(--dark-bg);
    font-family: 'JetBrains Mono', monospace;
    margin: 0;
    padding: 0;
  }

  .desktop-background {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-image 0.5s ease-in-out;
  }

  .wallpaper-overlay {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(10, 10, 10, 0.4) 0%,
      rgba(30, 138, 74, 0.1) 50%,
      rgba(10, 10, 10, 0.4) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(1px);
  }

  .desktop-icons {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    grid-auto-rows: min-content;
    gap: 1rem;
    z-index: 20;
    padding: 0.5rem;
    box-sizing: border-box;
    width: calc(100% - 2rem);
    max-width: 500px;
  }

  .desktop-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 100px;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 12px;
    background: transparent;
    border: 1px solid transparent;
    position: relative;
  }

  .desktop-icon:hover {
    background: rgba(var(--hover-rgb, 30, 138, 74), 0.25);
    transform: translateY(-0.5rem) scale(1.05);
    box-shadow: 
      0 1rem 2rem var(--hover-glow, rgba(30, 138, 74, 0.3)),
      0 0 0 1px rgba(var(--hover-rgb, 30, 138, 74), 0.3);
    border-color: rgba(var(--hover-rgb, 30, 138, 74), 0.5);
  }

  .desktop-icon:active {
    transform: translateY(-0.25rem) scale(1.02);
    transition: all 0.1s ease;
  }

  .desktop-icon.wallpaper-changer:hover {
    background: rgba(6, 182, 212, 0.25);
    border-color: rgba(6, 182, 212, 0.5);
    box-shadow: 
      0 1rem 2rem rgba(6, 182, 212, 0.3),
      0 0 0 1px rgba(6, 182, 212, 0.3);
  }

  .desktop-icon::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--hover-primary, var(--parrot-green)), transparent);
    border-radius: var(--radius-lg);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  .desktop-icon.wallpaper-changer::before {
    background: linear-gradient(45deg, var(--primary-cyan), transparent);
  }
  .desktop-icon:hover::before {
    opacity: 0.3;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 0.25rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .desktop-icon:hover .icon-wrapper {
    background: rgba(var(--hover-rgb, 30, 138, 74), 0.3);
    border-color: rgba(var(--hover-rgb, 30, 138, 74), 0.6);
    box-shadow: 
      0 0 1.5rem var(--hover-glow, rgba(30, 138, 74, 0.4)),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .desktop-icon.wallpaper-changer:hover .icon-wrapper {
    background: rgba(6, 182, 212, 0.3);
    border-color: rgba(6, 182, 212, 0.6);
    box-shadow: 
      0 0 1.5rem rgba(6, 182, 212, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .icon-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: 
      drop-shadow(0 0.125rem 0.25rem rgba(0, 0, 0, 0.6)) 
      brightness(1.1)
      saturate(1.1);
    transition: all 0.3s ease;
  }

  .desktop-icon:hover .icon-img {
    filter: 
      drop-shadow(0 0.25rem 0.5rem var(--hover-glow, rgba(30, 138, 74, 0.6))) 
      brightness(1.3)
      saturate(1.3);
    transform: scale(1.15);
  }
  .desktop-icon.wallpaper-changer:hover .icon-img {
    filter: 
      drop-shadow(0 0.25rem 0.5rem rgba(6, 182, 212, 0.6)) 
      brightness(1.3)
      saturate(1.3);
  }

  .desktop-icon span {
    color: #ffffff;
    font-size: 0.75rem;
    text-align: center;
    text-shadow: 
      0 0.125rem 0.25rem rgba(0, 0, 0, 0.9),
      0 0 0.5rem rgba(var(--hover-rgb, 30, 138, 74), 0.3);
    font-weight: 600;
    max-width: 90px;
    word-break: break-word;
    line-height: 1.2;
    font-family: 'Ubuntu', sans-serif;
    transition: all 0.3s ease;
  }

  .desktop-icon:hover span {
    color: var(--hover-secondary, #a0f0a0);
    text-shadow: 
      0 0.125rem 0.25rem rgba(0, 0, 0, 0.9),
      0 0 1rem var(--hover-glow, rgba(30, 138, 74, 0.6));
  }

  .desktop-icon.wallpaper-changer:hover span {
    color: #80f0ff;
    text-shadow: 
      0 0.125rem 0.25rem rgba(0, 0, 0, 0.9),
      0 0 1rem rgba(6, 182, 212, 0.6);
  }

  /* Colores dinámicos según categoría */
  .desktop-icon[data-category="internet"]:hover {
    --hover-rgb: 59, 130, 246;
    --hover-primary: #3B82F6;
    --hover-secondary: #60A5FA;
    --hover-glow: rgba(59, 130, 246, 0.4);
  }
  .desktop-icon[data-category="multimedia"]:hover {
    --hover-rgb: 139, 92, 246;
    --hover-primary: #8B5CF6;
    --hover-secondary: #A78BFA;
    --hover-glow: rgba(139, 92, 246, 0.4);
  }
  .desktop-icon[data-category="development"]:hover {
    --hover-rgb: 16, 185, 129;
    --hover-primary: #10B981;
    --hover-secondary: #34D399;
    --hover-glow: rgba(16, 185, 129, 0.4);
  }
  .desktop-icon[data-category="games"]:hover {
    --hover-rgb: 239, 68, 68;
    --hover-primary: #EF4444;
    --hover-secondary: #F87171;
    --hover-glow: rgba(239, 68, 68, 0.4);
  }
  .desktop-icon[data-category="system"]:hover {
    --hover-rgb: 245, 158, 11;
    --hover-primary: #F59E0B;
    --hover-secondary: #FBBF24;
    --hover-glow: rgba(245, 158, 11, 0.4);
  }
  .desktop-icon[data-category="personal"]:hover {
    --hover-rgb: 236, 72, 153;
    --hover-primary: #EC4899;
    --hover-secondary: #F472B6;
    --hover-glow: rgba(236, 72, 153, 0.4);
  }
  .desktop-icon[data-category="tools"]:hover {
    --hover-rgb: 6, 182, 212;
    --hover-primary: #06B6D4;
    --hover-secondary: #22D3EE;
    --hover-glow: rgba(6, 182, 212, 0.4);
  }

  /* Sección de subida de archivos */
  .upload-section {
    margin-bottom: var(--space-lg);
    padding: var(--space-md);
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    border: 2px dashed rgba(255, 255, 255, 0.2);
    text-align: center;
  }

  .upload-button {
    display: inline-block;
    padding: var(--space-sm) var(--space-md);
    background: var(--parrot-green);
    color: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    margin-bottom: var(--space-xs);
  }

  .upload-button:hover {
    background: var(--primary-cyan);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  }

  .upload-hint {
    color: var(--text-secondary);
    font-size: var(--text-xs);
    margin: 0;
  }

  /* Estilos para wallpapers personalizados */
  .wallpaper-option.custom {
    border: 2px solid rgba(6, 182, 212, 0.3);
  }

  .wallpaper-option.custom:hover {
    border-color: var(--primary-cyan);
  }

  .custom-badge {
    font-size: 0.625rem;
    color: var(--primary-cyan);
    background: rgba(6, 182, 212, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 0.75rem;
    margin-top: 0.25rem;
  }

  .delete-wallpaper-button {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 10;
  }

  .wallpaper-thumbnail:hover .delete-wallpaper-button {
    opacity: 1;
  }

  .delete-wallpaper-button:hover {
    background: #dc2626;
    transform: scale(1.1);
  }

  .wallpaper-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--window-bg);
    border: 2px solid var(--parrot-green);
    border-radius: var(--radius-xl);
    padding: var(--space-lg);
    z-index: 100;
    max-width: min(90vw, 700px);
    max-height: min(80vh, 600px);
    backdrop-filter: blur(20px);
    box-shadow: 
      var(--shadow-xl),
      0 0 40px rgba(30, 138, 74, 0.3);
    animation: slideDown 0.3s ease-out;
  }
  .wallpaper-menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99;
    backdrop-filter: blur(5px);
    animation: fadeIn 0.3s ease-out;
  }
  .wallpaper-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .wallpaper-menu-header h3 {
    color: var(--primary-cyan);
    margin: 0;
    font-size: var(--text-lg);
  }
  .close-menu-button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: var(--text-primary);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-lg);
    transition: all 0.3s ease;
  }
  .close-menu-button:hover {
    background: rgba(239, 68, 68, 0.8);
    transform: scale(1.1);
  }
  .wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-md);
    max-height: 400px;
    overflow-y: auto;
    padding-right: var(--space-xs);
  }
  .wallpaper-grid::-webkit-scrollbar {
    width: 6px;
  }
  .wallpaper-grid::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  .wallpaper-grid::-webkit-scrollbar-thumb {
    background: var(--parrot-green);
    border-radius: 3px;
  }
  .wallpaper-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    transition: all 0.3s ease;
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    border: 2px solid transparent;
    position: relative;
  }
  .wallpaper-option:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
  .wallpaper-option.active {
    border-color: var(--parrot-green);
    background: rgba(30, 138, 74, 0.1);
  }
  .wallpaper-thumbnail {
    width: 100px;
    height: 60px;
    border-radius: var(--radius-md);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 2px solid rgba(255, 255, 255, 0.2);
    position: relative;
    transition: all 0.3s ease;
  }
  .wallpaper-option:hover .wallpaper-thumbnail {
    border-color: var(--primary-cyan);
    transform: scale(1.05);
  }
  .wallpaper-option.active .wallpaper-thumbnail {
    border-color: var(--parrot-green);
    box-shadow: 0 0 15px rgba(30, 138, 74, 0.5);
  }
  .wallpaper-active-indicator {
    position: absolute;
    top: -8px;
    left: -8px;
    background: var(--parrot-green);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xs);
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  .wallpaper-name {
    color: var(--text-primary);
    font-size: var(--text-xs);
    text-align: center;
    font-weight: 500;
    max-width: 100px;
    word-break: break-word;
  }

  /* Animaciones */
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* ===== RESPONSIVE DESIGN ===== */
  /* Tablets */
  @media (max-width: 768px) {
    .desktop-icons {
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 0.75rem;
      max-width: 400px;
    }
    .desktop-icon {
      width: 80px;
      height: 90px;
    }
    .icon-wrapper {
      width: 40px;
      height: 40px;
    }
    .icon-img {
      width: 28px;
      height: 28px;
    }
    .desktop-icon span {
      font-size: 0.6875rem;
      max-width: 80px;
    }
    .wallpaper-menu {
      padding: 1rem;
      max-width: 95vw;
    }
    .wallpaper-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 0.75rem;
    }
    .wallpaper-thumbnail {
      width: 80px;
      height: 50px;
    }
    .upload-section {
      padding: var(--space-sm);
    }
    .upload-button {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--text-sm);
    }
  }
  /* Móviles */
  @media (max-width: 480px) {
    .desktop-icons {
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      width: calc(100% - 1rem);
      max-width: 300px;
      left: 0.5rem;
    }
    .desktop-icon {
      width: 70px;
      height: 80px;
      padding: 0.25rem;
    }
    .icon-wrapper {
      width: 36px;
      height: 36px;
      margin-bottom: 0.125rem;
    }
    .icon-img {
      width: 24px;
      height: 24px;
    }
    .desktop-icon span {
      font-size: 0.625rem;
      max-width: 70px;
      line-height: 1.1;
    }
    .wallpaper-menu {
      padding: 0.75rem;
      max-height: 70vh;
    }
    .wallpaper-grid {
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 0.5rem;
    }
    .wallpaper-thumbnail {
      width: 70px;
      height: 45px;
    }
    .wallpaper-name {
      font-size: 0.625rem;
    }
  }
  /* Móviles muy pequeños */
  @media (max-width: 320px) {
    .desktop-icons {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      max-width: 280px;
    }
    .desktop-icon {
      width: 65px;
      height: 75px;
    }
    .icon-wrapper {
      width: 32px;
      height: 32px;
    }
    .icon-img {
      width: 22px;
      height: 22px;
    }
    .desktop-icon span {
      font-size: 0.5625rem;
      max-width: 65px;
    }
    .wallpaper-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  /* Landscape en móviles */
  @media (max-height: 500px) and (orientation: landscape) {
    .desktop-icons {
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .desktop-icon {
      width: 70px;
      height: 75px;
    }
    .desktop-icon:hover {
      transform: translateY(-0.125rem) scale(1.03);
    }
    .wallpaper-menu {
      max-height: 90vh;
    }
    .wallpaper-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      max-height: 60vh;
    }
  }
  /* Tablets en landscape */
  @media (min-width: 768px) and (max-height: 600px) and (orientation: landscape) {
    .desktop-icons {
      grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
      gap: 1rem;
    }
    .desktop-icon {
      width: 90px;
      height: 95px;
    }
  }
  /* Pantallas grandes */
  @media (min-width: 1200px) {
    .desktop-icons {
      top: 2rem;
      left: 2rem;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      max-width: 600px;
    }
    .desktop-icon {
      width: 100px;
      height: 110px;
    }
    .icon-wrapper {
      width: 56px;
      height: 56px;
    }
    .icon-img {
      width: 40px;
      height: 40px;
    }
    .desktop-icon span {
      font-size: 0.8rem;
      max-width: 100px;
    }
  }
  /* High DPI screens */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .icon-img {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
  }
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .desktop-icon,
    .desktop-icon:hover,
    .icon-wrapper,
    .icon-img,
    .wallpaper-option,
    .wallpaper-menu {
      transition: none;
      transform: none;
      animation: none;
    }
    .desktop-icon:hover {
      background: rgba(30, 138, 74, 0.4);
      box-shadow: 0 0 0 1px rgba(30, 138, 74, 0.5);
    }
    .desktop-background {
      transition: none;
    }
  }
  /* Modo alto contraste */
  @media (prefers-contrast: high) {
    .desktop-icon:hover {
      background: rgba(30, 138, 74, 0.6);
      border: 2px solid #ffffff;
    }
    .desktop-icon span {
      text-shadow: 0 0.125rem 0.25rem #000000;
    }
  }
  /* Focus para accesibilidad */
  .desktop-icon:focus-visible {
    outline: 2px solid var(--primary-cyan);
    outline-offset: 2px;
    background: rgba(30, 138, 74, 0.4);
    transform: translateY(-0.25rem);
  }
`}</style>
    </div>
  );
}