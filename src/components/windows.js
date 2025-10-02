// components/apps/Browser.js
import { useState, useRef, useEffect } from 'react';

export default function Browser({ windowId }) {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef(null);

  const handleNavigate = (e) => {
    e.preventDefault();
    setCurrentUrl(url);
    setLoading(true);
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const goBack = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.history.back();
    }
  };

  const goForward = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.history.forward();
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.location.reload();
    }
  };

  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="browser-controls">
          <button onClick={goBack} title="Atrás">←</button>
          <button onClick={goForward} title="Adelante">→</button>
          <button onClick={refresh} title="Recargar">↻</button>
        </div>
        
        <form onSubmit={handleNavigate} className="browser-url-bar">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ingresa una URL..."
          />
          <button type="submit">Ir</button>
        </form>
        
        <div className="browser-actions">
          <button title="Nueva pestaña">+</button>
        </div>
      </div>

      <div className="browser-content">
        {loading && (
          <div className="browser-loading">
            <div className="loading-spinner">Cargando...</div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          onLoad={handleIframeLoad}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            display: loading ? 'none' : 'block'
          }}
          title="Navegador web"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      <style jsx>{`
        .browser {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
        
        .browser-toolbar {
          background: #f0f0f0;
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #ddd;
        }
        
        .browser-controls {
          display: flex;
          gap: 4px;
        }
        
        .browser-controls button,
        .browser-actions button {
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .browser-controls button:hover,
        .browser-actions button:hover {
          background: #f8f8f8;
        }
        
        .browser-url-bar {
          flex: 1;
          display: flex;
          gap: 4px;
        }
        
        .browser-url-bar input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-size: 12px;
        }
        
        .browser-url-bar button {
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 3px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .browser-url-bar button:hover {
          background: #357ae8;
        }
        
        .browser-content {
          flex: 1;
          position: relative;
          background: #fff;
        }
        
        .browser-loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        
        .loading-spinner {
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}