// src/apps/TextEditor.jsx
import { useState, useRef, useEffect } from 'react';

const TextEditor = ({ windowId }) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('monospace');
  const [theme, setTheme] = useState('dark');
  const [showStats, setShowStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const textAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Actualizar estadísticas cuando cambia el contenido
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characters = content.length;
    const lines = content ? content.split('\n').length : 1;
    
    setWordCount(words);
    setCharCount(characters);
    setLineCount(lines);
  }, [content]);

  // Actualizar posición del cursor
  const updateCursorPosition = () => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      const textUntilCursor = textarea.value.substring(0, textarea.selectionStart);
      const lines = textUntilCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
    }
  };

  // Manejar cambios en el contenido
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsSaved(false);
    updateCursorPosition();
  };

  // Nuevo archivo
  const handleNewFile = () => {
    if (!isSaved && content.trim() !== '') {
      const confirm = window.confirm('¿Guardar cambios en el archivo actual?');
      if (confirm) {
        handleSave();
      }
    }
    setContent('');
    setFileName('untitled.txt');
    setIsSaved(true);
  };

  // Abrir archivo
  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result);
        setFileName(file.name);
        setIsSaved(true);
      };
      reader.readAsText(file);
    }
  };

  // Guardar archivo
  const handleSave = () => {
    if (fileName === 'untitled.txt') {
      handleSaveAs();
    } else {
      downloadFile(content, fileName);
      setIsSaved(true);
    }
  };

  // Guardar como
  const handleSaveAs = () => {
    const name = prompt('Nombre del archivo:', fileName);
    if (name) {
      downloadFile(content, name);
      setFileName(name);
      setIsSaved(true);
    }
  };

  // Descargar archivo
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Buscar texto
  const handleSearch = () => {
    if (!searchTerm) return;
    
    const textarea = textAreaRef.current;
    const text = textarea.value;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + searchTerm.length);
    }
  };

  // Reemplazar texto
  const handleReplace = () => {
    if (!searchTerm) return;
    
    const textarea = textAreaRef.current;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    
    if (selectedText.toLowerCase() === searchTerm.toLowerCase()) {
      const newContent = content.substring(0, textarea.selectionStart) + 
                        replaceTerm + 
                        content.substring(textarea.selectionEnd);
      setContent(newContent);
    }
    handleSearch(); // Buscar siguiente ocurrencia
  };

  // Reemplazar todos
  const handleReplaceAll = () => {
    if (!searchTerm) return;
    
    const regex = new RegExp(searchTerm, 'gi');
    const newContent = content.replace(regex, replaceTerm);
    setContent(newContent);
  };

  // Formatear texto
  const handleFormatText = (format) => {
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = selectedText;
    
    switch (format) {
      case 'uppercase':
        formattedText = selectedText.toUpperCase();
        break;
      case 'lowercase':
        formattedText = selectedText.toLowerCase();
        break;
      case 'capitalize':
        formattedText = selectedText.replace(/\b\w/g, l => l.toUpperCase());
        break;
      case 'trim':
        formattedText = selectedText.trim();
        break;
      default:
        break;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Restaurar selección
    setTimeout(() => {
      textarea.setSelectionRange(start, start + formattedText.length);
      textarea.focus();
    }, 0);
  };

  // Insertar fecha/hora
  const handleInsertDateTime = () => {
    const now = new Date();
    const dateTime = now.toLocaleString();
    insertTextAtCursor(dateTime);
  };

  // Insertar texto en la posición del cursor
  const insertTextAtCursor = (text) => {
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    
    // Posicionar cursor después del texto insertado
    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length);
      textarea.focus();
    }, 0);
  };

  // Deshacer/Rehacer (simulado)
  const handleUndo = () => {
    // En una implementación real usarías un historial de estados
    alert('Funcionalidad Deshacer - En desarrollo');
  };

  const handleRedo = () => {
    alert('Funcionalidad Rehacer - En desarrollo');
  };

  // Temas disponibles
  const themes = {
    dark: {
      background: '#1a1a1a',
      text: '#e0e0e0',
      toolbar: '#2a2a2a',
      border: '#333'
    },
    light: {
      background: '#ffffff',
      text: '#333333',
      toolbar: '#f5f5f5',
      border: '#ddd'
    },
    solarized: {
      background: '#002b36',
      text: '#839496',
      toolbar: '#073642',
      border: '#586e75'
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className="text-editor" style={{ background: currentTheme.background, color: currentTheme.text }}>
      {/* Barra de herramientas superior */}
      <div className="toolbar" style={{ background: currentTheme.toolbar, borderBottom: `1px solid ${currentTheme.border}` }}>
        <div className="toolbar-left">
          <div className="file-actions">
            <button className="toolbar-btn" onClick={handleNewFile} title="Nuevo">
              <span className="btn-icon">📄</span>
              <span className="btn-text">Nuevo</span>
            </button>
            <button className="toolbar-btn" onClick={handleOpenFile} title="Abrir">
              <span className="btn-icon">📂</span>
              <span className="btn-text">Abrir</span>
            </button>
            <button className="toolbar-btn" onClick={handleSave} title="Guardar">
              <span className="btn-icon">💾</span>
              <span className="btn-text">Guardar</span>
            </button>
            <button className="toolbar-btn" onClick={handleSaveAs} title="Guardar como">
              <span className="btn-icon">💾</span>
              <span className="btn-text">Guardar como</span>
            </button>
          </div>

          <div className="edit-actions">
            <button className="toolbar-btn" onClick={handleUndo} title="Deshacer">
              <span className="btn-icon">↶</span>
            </button>
            <button className="toolbar-btn" onClick={handleRedo} title="Rehacer">
              <span className="btn-icon">↷</span>
            </button>
            <button 
              className="toolbar-btn" 
              onClick={() => setShowSearch(!showSearch)}
              title="Buscar y reemplazar"
            >
              <span className="btn-icon">🔍</span>
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="editor-settings">
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="setting-select"
              title="Fuente"
            >
              <option value="monospace">Monospace</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            <select 
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="setting-select"
              title="Tamaño de fuente"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
            </select>

            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="setting-select"
              title="Tema"
            >
              <option value="dark">🌙 Oscuro</option>
              <option value="light">☀️ Claro</option>
              <option value="solarized">🌅 Solarized</option>
            </select>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="search-bar" style={{ background: currentTheme.toolbar, borderBottom: `1px solid ${currentTheme.border}` }}>
          <div className="search-controls">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ background: currentTheme.background, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
            />
            <input
              type="text"
              placeholder="Reemplazar con..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="search-input"
              style={{ background: currentTheme.background, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
            />
            <button className="search-btn" onClick={handleSearch}>Buscar</button>
            <button className="search-btn" onClick={handleReplace}>Reemplazar</button>
            <button className="search-btn" onClick={handleReplaceAll}>Reemplazar todo</button>
            <button className="search-btn" onClick={() => setShowSearch(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Barra de formato */}
      <div className="format-bar" style={{ background: currentTheme.toolbar, borderBottom: `1px solid ${currentTheme.border}` }}>
        <div className="format-actions">
          <button 
            className="format-btn" 
            onClick={() => handleFormatText('uppercase')}
            title="Mayúsculas"
          >
            AA
          </button>
          <button 
            className="format-btn" 
            onClick={() => handleFormatText('lowercase')}
            title="Minúsculas"
          >
            aa
          </button>
          <button 
            className="format-btn" 
            onClick={() => handleFormatText('capitalize')}
            title="Capitalizar"
          >
            Aa
          </button>
          <button 
            className="format-btn" 
            onClick={() => handleFormatText('trim')}
            title="Trim espacios"
          >
            ⎵
          </button>
          <button 
            className="format-btn" 
            onClick={handleInsertDateTime}
            title="Insertar fecha/hora"
          >
            📅
          </button>
        </div>
      </div>

      {/* Área de edición principal */}
      <div className="editor-container">
        <textarea
          ref={textAreaRef}
          value={content}
          onChange={handleContentChange}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          className="text-area"
          style={{
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            background: currentTheme.background,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`
          }}
          placeholder="Escribe tu texto aquí..."
          spellCheck="true"
        />
      </div>

      {/* Barra de estado inferior */}
      <div className="status-bar" style={{ background: currentTheme.toolbar, borderTop: `1px solid ${currentTheme.border}` }}>
        <div className="status-left">
          <span className="file-info">
            {fileName} {!isSaved && '•'}
          </span>
          {!isSaved && <span className="unsaved-indicator">No guardado</span>}
        </div>

        <div className="status-center">
          <span className="cursor-position">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
        </div>

        <div className="status-right">
          {showStats && (
            <>
              <span className="stat-item">Palabras: {wordCount}</span>
              <span className="stat-item">Caracteres: {charCount}</span>
              <span className="stat-item">Líneas: {lineCount}</span>
            </>
          )}
          <button 
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
            title={showStats ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}
          >
            {showStats ? '📊' : '📈'}
          </button>
        </div>
      </div>

      {/* Input oculto para abrir archivos */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".txt,.md,.js,.jsx,.ts,.tsx,.html,.css,.json,.xml"
        style={{ display: 'none' }}
      />

      <style jsx>{`
        .text-editor {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: 'Ubuntu', sans-serif;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          min-height: 50px;
          flex-shrink: 0;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .file-actions, .edit-actions {
          display: flex;
          gap: 5px;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 4px;
          color: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
        }

        .toolbar-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .btn-icon {
          font-size: 14px;
        }

        .btn-text {
          white-space: nowrap;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .editor-settings {
          display: flex;
          gap: 8px;
        }

        .setting-select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 6px 8px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
        }

        .setting-select:focus {
          outline: none;
          border-color: #8B5CF6;
        }

        .search-bar {
          padding: 10px 12px;
          flex-shrink: 0;
        }

        .search-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-input {
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 13px;
          min-width: 120px;
          flex: 1;
        }

        .search-input:focus {
          outline: none;
          border-color: #8B5CF6;
        }

        .search-btn {
          padding: 6px 12px;
          background: #8B5CF6;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          white-space: nowrap;
        }

        .search-btn:hover {
          background: #7C3AED;
        }

        .format-bar {
          padding: 8px 12px;
          flex-shrink: 0;
        }

        .format-actions {
          display: flex;
          gap: 5px;
        }

        .format-btn {
          padding: 6px 10px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: inherit;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .format-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .editor-container {
          flex: 1;
          padding: 0;
          overflow: hidden;
        }

        .text-area {
          width: 100%;
          height: 100%;
          border: none;
          resize: none;
          padding: 15px;
          line-height: 1.5;
          font-family: 'Ubuntu Mono', monospace;
          outline: none;
          box-sizing: border-box;
        }

        .text-area:focus {
          outline: none;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          min-height: 35px;
          flex-shrink: 0;
          font-size: 12px;
        }

        .status-left, .status-center, .status-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .file-info {
          font-weight: 500;
        }

        .unsaved-indicator {
          color: #F59E0B;
          font-style: italic;
        }

        .cursor-position {
          color: #8B5CF6;
          font-family: 'Ubuntu Mono', monospace;
        }

        .stat-item {
          font-family: 'Ubuntu Mono', monospace;
          color: #888;
        }

        .stats-toggle {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          font-size: 14px;
        }

        .stats-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            gap: 10px;
            padding: 8px;
          }

          .toolbar-left, .toolbar-right {
            width: 100%;
            justify-content: center;
          }

          .btn-text {
            display: none;
          }

          .toolbar-btn {
            padding: 8px;
          }

          .editor-settings {
            justify-content: center;
            flex-wrap: wrap;
          }

          .search-controls {
            justify-content: center;
          }

          .search-input {
            min-width: 100px;
          }

          .status-bar {
            flex-direction: column;
            gap: 5px;
            text-align: center;
          }

          .status-left, .status-center, .status-right {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .toolbar-btn {
            padding: 6px;
          }

          .setting-select {
            padding: 4px 6px;
            font-size: 11px;
          }

          .search-input {
            min-width: 80px;
            font-size: 12px;
          }

          .search-btn {
            padding: 4px 8px;
            font-size: 11px;
          }

          .stat-item {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default TextEditor;