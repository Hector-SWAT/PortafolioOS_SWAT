// components/apps/Browser.jsx
import { useState, useRef } from 'react';

const Browser = ({ windowId }) => {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef(null);

  const handleNavigate = (e) => {
    e.preventDefault();
    let finalUrl = url;
    
    // Agregar https:// si no tiene protocolo
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    
    setCurrentUrl(finalUrl);
    setLoading(true);
    
    // Agregar a historial
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setUrl(currentUrl);
  };

  const handleIframeError = () => {
    setLoading(false);
    setCommandHistory(prev => [
      ...prev,
      { type: 'error', content: 'Error loading page. Please check the URL and try again.' }
    ]);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setUrl(history[newIndex]);
      setLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setUrl(history[newIndex]);
      setLoading(true);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      setLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const home = () => {
    const homeUrl = 'https://www.google.com';
    setUrl(homeUrl);
    setCurrentUrl(homeUrl);
    setLoading(true);
    
    // Agregar a historial
    const newHistory = [...history, homeUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNavigate(e);
    }
  };

  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="browser-controls">
          <button 
            onClick={goBack} 
            title="Atrás"
            disabled={historyIndex === 0}
          >
            ←
          </button>
          <button 
            onClick={goForward} 
            title="Adelante"
            disabled={historyIndex === history.length - 1}
          >
            →
          </button>
          <button onClick={refresh} title="Recargar">
            ↻
          </button>
          <button onClick={home} title="Inicio">
            ⌂
          </button>
        </div>
        
        <div className="browser-url-container">
          <form onSubmit={handleNavigate} className="browser-url-bar">
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              placeholder="Ingresa una URL o término de búsqueda..."
              spellCheck="false"
            />
            <button type="submit">Ir</button>
          </form>
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
        
        <div className="browser-actions">
          <button title="Seguridad">🔒</button>
        </div>
      </div>

      <div className="browser-content">
        {loading && (
          <div className="browser-loading">
            <div className="loading-content">
              <div className="spinner"></div>
              <p>Cargando {currentUrl}...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            display: loading ? 'none' : 'block'
          }}
          title="Navegador web"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          allow="geolocation; microphone; camera; midi; encrypted-media"
          allowFullScreen
        />
      </div>

      // En Browser.jsx, actualiza los estilos:
<style jsx>{`
  .browser {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .browser-toolbar {
    background: #2b2a33;
    padding: clamp(6px, 1.5vh, 10px) clamp(8px, 2vw, 15px);
    display: flex;
    align-items: center;
    gap: clamp(6px, 1.5vw, 12px);
    border-bottom: 1px solid #42414d;
    min-height: clamp(40px, 10vh, 50px);
    flex-wrap: wrap;
  }

  .browser-controls {
    display: flex;
    gap: clamp(2px, 0.5vw, 4px);
    flex-shrink: 0;
  }

  .browser-controls button {
    background: #52525e;
    border: none;
    border-radius: 4px;
    padding: clamp(6px, 1.5vh, 8px) clamp(8px, 2vw, 12px);
    cursor: pointer;
    font-size: clamp(12px, 3vw, 16px);
    color: white;
    transition: all 0.2s ease;
    min-width: clamp(32px, 8vw, 40px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .browser-url-bar {
    flex: 1;
    display: flex;
    gap: clamp(4px, 1vw, 8px);
    min-width: 200px;
  }

  .url-input {
    flex: 1;
    padding: clamp(8px, 2vh, 10px) clamp(12px, 3vw, 16px);
    border: 1px solid #52525e;
    border-radius: 4px;
    font-size: clamp(12px, 3vw, 14px);
    outline: none;
    background: #42414d;
    color: white;
    min-width: 120px;
  }

  @media (max-width: 768px) {
    .browser-toolbar {
      gap: 8px;
    }
    
    .browser-url-bar {
      min-width: 150px;
    }
  }

  @media (max-width: 480px) {
    .browser-toolbar {
      flex-direction: column;
      height: auto;
      gap: 6px;
    }
    
    .browser-url-bar {
      min-width: 100%;
      order: 3;
    }
    
    .browser-controls {
      order: 1;
    }
    
    .browser-actions {
      order: 2;
    }
  }
`}</style>

    </div>
  );
};

export default Browser;