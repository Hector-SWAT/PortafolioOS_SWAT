// Taskbar.jsx
import { useState, useEffect } from 'react'
import WorkspaceMenu from './WorkspaceMenu'
import '../styles/global.css'

const Taskbar = ({ 
  activeWindows = [], 
  setActiveWindows, 
  activeApp, 
  setActiveApp, 
  onShowMenu,
  // Props para escritorios virtuales
  currentWorkspace = 1,
  setCurrentWorkspace,
  workspaces = [],
  setWorkspaces = () => {}
}) => {
  const [hoveredWindow, setHoveredWindow] = useState(null)
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)

  // Inicializar escritorios si no existen
  useEffect(() => {
    if (workspaces.length === 0 && setWorkspaces) {
      setWorkspaces([
        { id: 1, name: '1', windows: [] },
        { id: 2, name: '2', windows: [] },
        { id: 3, name: '3', windows: [] },
        { id: 4, name: '4', windows: [] }
      ])
    }
  }, [workspaces, setWorkspaces])

  // Cerrar una aplicación
  const closeApp = (appId, e) => {
    e?.stopPropagation()
    if (window.windowManager && window.windowManager.closeApp) {
      window.windowManager.closeApp(appId)
    }
  }

  // Minimizar/restaurar una aplicación
  const toggleMinimizeApp = (appId, e) => {
    e?.stopPropagation()
    if (window.windowManager && window.windowManager.minimizeApp) {
      window.windowManager.minimizeApp(appId)
    }
  }

  // Mover ventana entre escritorios
  const moveWindowToWorkspace = (windowId, targetWorkspaceId, e) => {
    e?.stopPropagation()
    
    // Actualizar el workspace de la ventana
    const updatedWindows = activeWindows.map(window => 
      window.id === windowId 
        ? { ...window, workspace: targetWorkspaceId }
        : window
    )
    
    setActiveWindows(updatedWindows)
    
    // Si la ventana movida es la activa y nos cambiamos de workspace
    const movedWindow = updatedWindows.find(w => w.id === windowId)
    if (movedWindow && activeApp === windowId) {
      setCurrentWorkspace(targetWorkspaceId)
    }
  }

  // Función para enfocar una ventana
  const focusWindow = (windowId) => {
    if (window.windowManager && window.windowManager.focusApp) {
      window.windowManager.focusApp(windowId)
    }
    setActiveApp(windowId)
  }

  return (
    <>
      <div className="taskbar">
        {/* Botón de menú de aplicaciones */}
        <div className="taskbar-left">
          <button 
            className="menu-button"
            onClick={onShowMenu}
            aria-label="Abrir menú de aplicaciones"
          >
            <img 
              src="https://img.icons8.com/?size=100&id=fG5Tnj4ARIoI&format=png&color=000000" 
              alt="Parrot OS" 
              className="menu-icon" 
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkgxMFYxMEg0VjZNMTQgNkgyMFYxMEgxNFY2TTQgMTRIMTBWMThINFYxNE0xNCAxNEgyMFYxOEgxNFYxNFoiIGZpbGw9IiNmZmZmZmYiLz4KPC9zdmc+'
              }}
              style={{
              width: '24px',
              height: '24px',
              filter: 'none',
              opacity: '1'
            }}
            />
            <span>Menu</span>
          </button>
        </div>

        {/* Botón de escritorios virtuales */}
        <div className="taskbar-workspace">
          <button 
            className="workspace-button"
            onClick={() => setShowWorkspaceMenu(true)}
            aria-label="Menú de escritorios virtuales"
          >
            <span className="workspace-icon">🖥️</span>
            <span className="workspace-indicator">
              WS {workspaces.find(w => w.id === currentWorkspace)?.name || '1'}
            </span>
          </button>
        </div>

        {/* Ventanas abiertas */}
        <div className="taskbar-windows">
          {activeWindows
            .filter(window => !window.workspace || window.workspace === currentWorkspace)
            .map(window => (
            <div
              key={window.id}
              className={`taskbar-window ${activeApp === window.id ? 'active' : ''} ${window.minimized ? 'minimized' : ''}`}
              onClick={() => {
                if (window.minimized) {
                  toggleMinimizeApp(window.id, { stopPropagation: () => {} })
                } else {
                  focusWindow(window.id)
                }
              }}
              onMouseEnter={() => setHoveredWindow(window.id)}
              onMouseLeave={() => setHoveredWindow(null)}
            >
              <img 
                src={window.icon} 
                alt={window.title || window.appName} 
                className="window-icon" 
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgZmlsbD0iIzRFOTBGMiIvPgo8L3N2Zz4K'
                }}
              />
              
              {/* Mini vista previa al hacer hover */}
              {hoveredWindow === window.id && (
                <div className="window-preview">
                  <div className="preview-header">
                    <span className="preview-title">{window.title || window.appName}</span>
                    <div className="preview-actions">
                      <button 
                        className="preview-minimize"
                        onClick={(e) => toggleMinimizeApp(window.id, e)}
                        aria-label={`Minimizar ${window.title || window.appName}`}
                        title="Minimizar"
                      >
                        _
                      </button>
                      <button 
                        className="preview-close"
                        onClick={(e) => closeApp(window.id, e)}
                        aria-label={`Cerrar ${window.title || window.appName}`}
                        title="Cerrar"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-placeholder">
                      {window.title || window.appName}
                    </div>
                    {/* Opciones para mover entre escritorios */}
                    <div className="workspace-options">
                      <span>Mover a:</span>
                      <div className="workspace-buttons">
                        {workspaces.filter(ws => ws.id !== currentWorkspace).map(workspace => (
                          <button
                            key={workspace.id}
                            className="workspace-option"
                            onClick={(e) => moveWindowToWorkspace(window.id, workspace.id, e)}
                            title={`Mover a escritorio ${workspace.name}`}
                          >
                            WS {workspace.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Área del sistema */}
        <div className="taskbar-system">
          <div className="system-time">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <style jsx>{`
          .taskbar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40px;
            background: #0F2030;
            backdrop-filter: blur(1rem) saturate(180%);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            z-index: 999;
            box-sizing: border-box;
            gap: 15px;
          }

          .taskbar-left {
            display: flex;
            align-items: center;
          }

          .taskbar-workspace {
            display: flex;
            align-items: center;
          }

          .taskbar-windows {
            display: flex;
            align-items: center;
            gap: 2px;
            height: 100%;
            flex: 1;
            justify-content: center;
          }

          .taskbar-system {
            display: flex;
            align-items: center;
          }

          .menu-button {
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

          .menu-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .menu-icon {
            width: 20px;
            height: 20px;
            object-fit: contain;
            filter: brightness(0) invert(1);
          }

          .workspace-button {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 28px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0 10px;
            color: white;
            font-size: 11px;
            font-family: 'Ubuntu Mono', monospace;
          }

          .workspace-button:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
          }

          .workspace-icon {
            font-size: 14px;
          }

          .workspace-indicator {
            font-weight: 600;
            color: #4a90e2;
          }

          .taskbar-window {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            height: 32px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0 8px;
          }

          .taskbar-window:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .taskbar-window.active {
            background: rgba(74, 144, 226, 0.3);
            border-color: rgba(74, 144, 226, 0.5);
          }

          .taskbar-window.minimized {
            opacity: 0.6;
          }

          .window-icon {
            width: 16px;
            height: 16px;
            object-fit: contain;
          }

          .system-time {
            color: white;
            font-size: 11px;
            font-family: 'Ubuntu Mono', monospace;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }

          /* MINI VISTA PREVIA */
          .window-preview {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #0F2030;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            min-width: 250px;
            max-width: 300px;
            z-index: 1000;
            margin-bottom: 5px;
            animation: slideUp 0.2s ease-out;
          }

          .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .preview-title {
            color: white;
            font-size: 12px;
            font-weight: 600;
            font-family: 'Ubuntu', sans-serif;
            max-width: 180px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .preview-actions {
            display: flex;
            gap: 4px;
          }

          .preview-minimize,
          .preview-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            line-height: 1;
            transition: background 0.2s ease;
          }

          .preview-minimize:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .preview-close:hover {
            background: rgba(255, 0, 0, 0.3);
          }

          .preview-content {
            padding: 15px;
          }

          .preview-placeholder {
            color: rgba(255, 255, 255, 0.7);
            font-size: 11px;
            text-align: center;
            font-family: 'Ubuntu', sans-serif;
            margin-bottom: 10px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }

          .workspace-options {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .workspace-options span {
            color: rgba(255, 255, 255, 0.7);
            font-size: 10px;
            display: block;
            margin-bottom: 5px;
          }

          .workspace-buttons {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
          }

          .workspace-option {
            background: rgba(74, 144, 226, 0.2);
            border: 1px solid rgba(74, 144, 226, 0.3);
            color: #4a90e2;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .workspace-option:hover {
            background: rgba(74, 144, 226, 0.3);
            border-color: rgba(74, 144, 226, 0.5);
          }

          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateX(-50%) translateY(5px); 
            }
            to { 
              opacity: 1; 
              transform: translateX(-50%) translateY(0); 
            }
          }

          /* RESPONSIVE */
          @media (max-width: 768px) {
            .taskbar {
              height: 35px;
              padding: 0 8px;
              gap: 10px;
            }

            .menu-button span {
              display: none;
            }

            .workspace-button span:first-child {
              display: none;
            }

            .taskbar-window {
              min-width: 35px;
              height: 28px;
              padding: 0 6px;
            }

            .window-icon {
              width: 14px;
              height: 14px;
            }

            .window-preview {
              min-width: 200px;
            }

            .system-time {
              font-size: 10px;
              padding: 4px 8px;
            }
          }

          @media (max-width: 480px) {
            .taskbar {
              height: 32px;
              padding: 0 5px;
              gap: 8px;
            }

            .taskbar-window {
              min-width: 32px;
              height: 26px;
              padding: 0 4px;
            }

            .window-icon {
              width: 12px;
              height: 12px;
            }

            .window-preview {
              min-width: 180px;
            }

            .workspace-button {
              padding: 0 6px;
              font-size: 10px;
            }

            .system-time {
              display: none;
            }
          }
        `}</style>
      </div>

      {/* Menú de escritorios virtuales */}
      <WorkspaceMenu
        isOpen={showWorkspaceMenu}
        onClose={() => setShowWorkspaceMenu(false)}
        currentWorkspace={currentWorkspace}
        setCurrentWorkspace={setCurrentWorkspace}
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
      />
    </>
  )
}

export default Taskbar