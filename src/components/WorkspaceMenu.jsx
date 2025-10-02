// components/WorkspaceMenu.jsx
import { useState, useEffect } from 'react'

const WorkspaceMenu = ({ 
  isOpen, 
  onClose, 
  currentWorkspace, 
  setCurrentWorkspace,
  workspaces,
  setWorkspaces 
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  // Inicializar escritorios si no existen
  useEffect(() => {
    if (workspaces.length === 0) {
      setWorkspaces([
        { id: 1, name: '1', windows: [] },
        { id: 2, name: '2', windows: [] },
        { id: 3, name: '3', windows: [] },
        { id: 4, name: '4', windows: [] }
      ])
    }
  }, [workspaces, setWorkspaces])

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.workspace-menu')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Cambiar al escritorio seleccionado
  const switchWorkspace = (workspaceId) => {
    setCurrentWorkspace(workspaceId)
    onClose()
  }

  // Crear nuevo escritorio
  const createNewWorkspace = () => {
    if (newWorkspaceName.trim()) {
      const newId = Math.max(...workspaces.map(w => w.id), 0) + 1
      const newWorkspace = {
        id: newId,
        name: newWorkspaceName.trim(),
        windows: []
      }
      setWorkspaces([...workspaces, newWorkspace])
      setNewWorkspaceName('')
    }
  }

  // Eliminar escritorio (solo si no es el actual y hay más de 1)
  const deleteWorkspace = (workspaceId, e) => {
    e.stopPropagation()
    if (workspaces.length > 1 && workspaceId !== currentWorkspace) {
      setWorkspaces(workspaces.filter(w => w.id !== workspaceId))
    }
  }

  if (!isOpen) return null

  return (
    <div className="workspace-menu-overlay">
      <div className="workspace-menu">
        <div className="workspace-header">
          <h3>Escritorios Virtuales</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="workspace-current">
          <span className="current-label">Escritorio actual:</span>
          <span className="current-workspace">
            {workspaces.find(w => w.id === currentWorkspace)?.name || '1'}
          </span>
        </div>

        <div className="workspace-list">
          <h4>Cambiar escritorio:</h4>
          {workspaces.map(workspace => (
            <div
              key={workspace.id}
              className={`workspace-item ${workspace.id === currentWorkspace ? 'active' : ''}`}
              onClick={() => switchWorkspace(workspace.id)}
            >
              <div className="workspace-info">
                <span className="workspace-name">{workspace.name}</span>
                <span className="workspace-windows">
                  {workspace.windows?.length || 0} ventanas
                </span>
              </div>
              <div className="workspace-actions">
                {workspace.id === currentWorkspace && (
                  <span className="current-badge">Actual</span>
                )}
                {workspaces.length > 1 && workspace.id !== currentWorkspace && (
                  <button
                    className="delete-workspace"
                    onClick={(e) => deleteWorkspace(workspace.id, e)}
                    title="Eliminar escritorio"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="workspace-create">
          <h4>Crear nuevo escritorio:</h4>
          <div className="create-input-group">
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Nombre del escritorio..."
              className="workspace-input"
              onKeyPress={(e) => e.key === 'Enter' && createNewWorkspace()}
            />
            <button
              onClick={createNewWorkspace}
              disabled={!newWorkspaceName.trim()}
              className="create-button"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="workspace-shortcuts">
          <h4>Atajos de teclado:</h4>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>←</kbd> / <kbd>→</kbd>
            <span>Cambiar entre escritorios</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>D</kbd>
            <span>Crear nuevo escritorio</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .workspace-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .workspace-menu {
          background: #0F2030;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.2s ease-out;
        }

        .workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .workspace-header h3 {
          color: white;
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .workspace-current {
          padding: 15px 20px;
          background: rgba(74, 144, 226, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .current-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          margin-right: 8px;
        }

        .current-workspace {
          color: #4a90e2;
          font-weight: bold;
          font-size: 14px;
        }

        .workspace-list {
          padding: 20px;
        }

        .workspace-list h4 {
          color: white;
          margin: 0 0 15px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .workspace-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .workspace-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .workspace-item.active {
          background: rgba(74, 144, 226, 0.2);
          border-color: rgba(74, 144, 226, 0.5);
        }

        .workspace-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .workspace-name {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .workspace-windows {
          color: rgba(255, 255, 255, 0.6);
          font-size: 11px;
        }

        .workspace-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-badge {
          background: #4a90e2;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
        }

        .delete-workspace {
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff4444;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .delete-workspace:hover {
          background: rgba(255, 0, 0, 0.3);
          border-color: rgba(255, 0, 0, 0.5);
        }

        .workspace-create {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .workspace-create h4 {
          color: white;
          margin: 0 0 15px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .create-input-group {
          display: flex;
          gap: 10px;
        }

        .workspace-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 10px 12px;
          color: white;
          font-size: 14px;
          outline: none;
        }

        .workspace-input:focus {
          border-color: #4a90e2;
        }

        .workspace-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .create-button {
          background: #4a90e2;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .create-button:hover:not(:disabled) {
          background: #3a80d6;
        }

        .create-button:disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          cursor: not-allowed;
        }

        .workspace-shortcuts {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
        }

        .workspace-shortcuts h4 {
          color: white;
          margin: 0 0 15px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .shortcut-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }

        .shortcut-item kbd {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 10px;
          font-family: monospace;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .workspace-menu {
            width: 95%;
            max-height: 90vh;
          }

          .create-input-group {
            flex-direction: column;
          }

          .shortcut-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  )
}

export default WorkspaceMenu