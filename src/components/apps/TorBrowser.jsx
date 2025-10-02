import { useState, useEffect, useRef } from 'react';

const TorBrowser = ({ windowId }) => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [securityLevel, setSecurityLevel] = useState('standard');
  const [circuitInfo, setCircuitInfo] = useState(null);
  const [bookmarks, setBookmarks] = useState([
    { name: 'DuckDuckGo', url: 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/' },
    { name: 'ProPublica', url: 'http://p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd.onion/' },
    { name: 'BBC News', url: 'https://www.bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion/' },
    { name: 'Facebook', url: 'https://www.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/' }
  ]);
  const [history, setHistory] = useState([]);
  const [showCircuit, setShowCircuit] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const loadingIntervalRef = useRef(null);

  // Simular conexión a la red Tor
  useEffect(() => {
    simulateTorConnection();
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);

  const simulateTorConnection = () => {
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('connected');
      const circuit = {
        relays: [
          { country: 'US', type: 'Guard' },
          { country: 'DE', type: 'Middle' },
          { country: 'NL', type: 'Exit' }
        ],
        pathLength: 3,
        established: new Date().toLocaleTimeString()
      };
      setCircuitInfo(circuit);
    }, 2000);
  };

  const navigateToUrl = (targetUrl = url) => {
    if (!targetUrl.trim()) return;

    // Limpiar intervalo anterior si existe
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }

    let finalUrl = targetUrl;
    if (!targetUrl.startsWith('http')) {
      finalUrl = 'https://' + targetUrl;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setUrl(finalUrl);

    // Simular progreso de carga
    loadingIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(loadingIntervalRef.current);
          setIsLoading(false);
          setCurrentUrl(finalUrl);
          
          // Agregar a historial
          setHistory(prev => [
            { url: finalUrl, title: getPageTitle(finalUrl), timestamp: new Date() },
            ...prev.slice(0, 49)
          ]);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const getPageTitle = (pageUrl) => {
    const titles = {
      'duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion': 'DuckDuckGo - Privacy Search',
      'p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd.onion': 'ProPublica - Investigative Journalism',
      'www.bbcnewsd73hkzno2ini43t4gblxvycyac5aw4gnv7t2rccijh7745uqd.onion': 'BBC News - Trusted News',
      'www.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion': 'Facebook - Secure Access'
    };
    
    for (const [domain, title] of Object.entries(titles)) {
      if (pageUrl.includes(domain)) {
        return title;
      }
    }
    
    return 'Onion Site - Tor Browser';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigateToUrl();
    }
  };

  const newIdentity = () => {
    setConnectionStatus('new_identity');
    setIsLoading(true);
    
    setTimeout(() => {
      simulateTorConnection();
      setCurrentUrl('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/');
      setUrl('https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/');
      setIsLoading(false);
    }, 3000);
  };

  const getSecurityIcon = () => {
    switch(securityLevel) {
      case 'high': return '🛡️';
      case 'standard': return '🔒';
      case 'low': return '⚠️';
      default: return '🔒';
    }
  };

  const getConnectionStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return '#10B981';
      case 'connecting': return '#F59E0B';
      case 'new_identity': return '#8B5CF6';
      default: return '#EF4444';
    }
  };

  // Función segura para manejar clicks
  const handleSafeClick = (callback, e) => {
    if (e && e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    callback();
  };

  const renderPageContent = () => {
    if (currentUrl.includes('duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion')) {
      return (
        <div className="page-content">
          <div className="search-page">
            <div className="tor-logo">🎭</div>
            <h1>DuckDuckGo</h1>
            <p className="tagline">The search engine that doesn't track you.</p>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search privately..." 
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && navigateToUrl(`https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/?q=${e.target.value}`)}
              />
              <button className="search-button">Search</button>
            </div>
            <div className="privacy-info">
              <p>🔒 Privacy Protection Active</p>
              <p>🌐 Connected via Tor Network</p>
              <p>🚫 No Tracking • No Cookies</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentUrl.includes('p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd.onion')) {
      return (
        <div className="page-content">
          <div className="news-page">
            <h1>ProPublica</h1>
            <p className="subtitle">Journalism in the Public Interest</p>
            <div className="articles">
              <div className="article">
                <h3>Investigative Report: Government Surveillance</h3>
                <p>An in-depth look at modern surveillance techniques and their impact on privacy...</p>
              </div>
              <div className="article">
                <h3>Whistleblower Protection Laws</h3>
                <p>Analysis of current legal frameworks protecting those who expose wrongdoing...</p>
              </div>
              <div className="article">
                <h3>Digital Rights in 2024</h3>
                <p>The state of digital privacy and freedom across different jurisdictions...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Página por defecto para otros sitios .onion
    return (
      <div className="page-content">
        <div className="generic-onion-site">
          <h1>Onion Service</h1>
          <div className="onion-icon">🧅</div>
          <p>This is a secure .onion service accessible only through the Tor network.</p>
          <div className="security-status">
            <p><strong>Connection Status:</strong> Secure (Tor Network)</p>
            <p><strong>Anonymity:</strong> Protected</p>
            <p><strong>Location:</strong> Hidden</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tor-browser">
      {/* Barra de herramientas superior */}
      <div className="tor-toolbar">
        <div className="toolbar-left">
          <button 
            className="toolbar-button"
            onClick={(e) => handleSafeClick(() => setShowBookmarks(!showBookmarks), e)}
            onTouchEnd={(e) => handleSafeClick(() => setShowBookmarks(!showBookmarks), e)}
            title="Bookmarks"
          >
            ⭐
          </button>
          <button className="toolbar-button" title="Back">←</button>
          <button className="toolbar-button" title="Forward">→</button>
          <button className="toolbar-button" title="Reload">↻</button>
        </div>
        
        <div className="url-bar">
          <span className="security-icon">{getSecurityIcon()}</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter .onion URL..."
            className="url-input"
          />
          <button 
            onClick={(e) => handleSafeClick(() => navigateToUrl(), e)}
            onTouchEnd={(e) => handleSafeClick(() => navigateToUrl(), e)}
            className="go-button"
            disabled={isLoading}
          >
            {isLoading ? '⌛' : '→'}
          </button>
        </div>

        <div className="toolbar-right">
          <button 
            className="toolbar-button"
            onClick={(e) => handleSafeClick(() => setShowCircuit(!showCircuit), e)}
            onTouchEnd={(e) => handleSafeClick(() => setShowCircuit(!showCircuit), e)}
            title="Circuit Info"
          >
            🔄
          </button>
          <button 
            className="toolbar-button"
            onClick={(e) => handleSafeClick(newIdentity, e)}
            onTouchEnd={(e) => handleSafeClick(newIdentity, e)}
            title="New Identity"
          >
            🆔
          </button>
          <button className="toolbar-button" title="Security Settings">⚙️</button>
        </div>
      </div>

      {/* Barra de estado de Tor */}
      <div className="tor-status-bar">
        <div className="status-left">
          <div 
            className="connection-indicator"
            style={{ backgroundColor: getConnectionStatusColor() }}
          ></div>
          <span className="status-text">
            {connectionStatus === 'connected' && 'Connected to Tor Network'}
            {connectionStatus === 'connecting' && 'Establishing Tor Circuit...'}
            {connectionStatus === 'new_identity' && 'Getting New Identity...'}
          </span>
        </div>
        
        <div className="status-right">
          <span className="security-level">
            Security: {securityLevel.toUpperCase()}
          </span>
          <select 
            value={securityLevel}
            onChange={(e) => setSecurityLevel(e.target.value)}
            className="security-select"
          >
            <option value="low">Low</option>
            <option value="standard">Standard</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Barra de progreso */}
      {isLoading && (
        <div className="loading-bar">
          <div 
            className="loading-progress" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      )}

      {/* Panel de bookmarks */}
      {showBookmarks && (
        <div className="bookmarks-panel">
          <h3>Bookmarks</h3>
          <div className="bookmarks-list">
            {bookmarks.map((bookmark, index) => (
              <div 
                key={index}
                className="bookmark-item"
                onClick={(e) => handleSafeClick(() => {
                  navigateToUrl(bookmark.url);
                  setShowBookmarks(false);
                }, e)}
                onTouchEnd={(e) => handleSafeClick(() => {
                  navigateToUrl(bookmark.url);
                  setShowBookmarks(false);
                }, e)}
              >
                <span className="bookmark-icon">🔖</span>
                <span className="bookmark-name">{bookmark.name}</span>
                <span className="bookmark-url">{bookmark.url}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información del circuito Tor */}
      {showCircuit && circuitInfo && (
        <div className="circuit-panel">
          <h3>Tor Circuit Information</h3>
          <div className="circuit-diagram">
            {circuitInfo.relays.map((relay, index) => (
              <div key={index} className="circuit-hop">
                <div className="hop-number">{index + 1}</div>
                <div className="hop-info">
                  <span className="hop-country">{relay.country}</span>
                  <span className="hop-type">{relay.type}</span>
                </div>
                {index < circuitInfo.relays.length - 1 && (
                  <div className="hop-connector">→</div>
                )}
              </div>
            ))}
          </div>
          <div className="circuit-stats">
            <p><strong>Path Length:</strong> {circuitInfo.pathLength} relays</p>
            <p><strong>Established:</strong> {circuitInfo.established}</p>
            <p><strong>Anonymity:</strong> High</p>
          </div>
        </div>
      )}

      {/* Contenido principal del navegador */}
      <div className="browser-content">
        {renderPageContent()}
      </div>

      <style jsx>{`
        .tor-browser {
          width: 100%;
          height: 100%;
          background: #f0f0f0;
          display: flex;
          flex-direction: column;
          font-family: 'Ubuntu', sans-serif;
        }

        .tor-toolbar {
          display: flex;
          align-items: center;
          background: #2c2c2c;
          padding: 8px 12px;
          border-bottom: 1px solid #444;
          gap: 10px;
        }

        .toolbar-left, .toolbar-right {
          display: flex;
          gap: 5px;
        }

        .toolbar-button {
          background: #404040;
          border: none;
          border-radius: 3px;
          color: white;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .toolbar-button:hover {
          background: #505050;
        }

        .toolbar-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .url-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: #1a1a1a;
          border-radius: 20px;
          padding: 4px 12px;
          gap: 8px;
        }

        .security-icon {
          font-size: 14px;
        }

        .url-input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 13px;
          outline: none;
          font-family: 'Ubuntu Mono', monospace;
        }

        .url-input::placeholder {
          color: #888;
        }

        .go-button {
          background: #404040;
          border: none;
          border-radius: 50%;
          color: white;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 12px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .tor-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1a1a1a;
          padding: 4px 12px;
          color: #ccc;
          font-size: 11px;
          border-bottom: 1px solid #333;
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .connection-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .security-select {
          background: #2a2a2a;
          border: 1px solid #444;
          color: #ccc;
          border-radius: 3px;
          padding: 2px 6px;
          font-size: 11px;
        }

        .loading-bar {
          width: 100%;
          height: 3px;
          background: #333;
        }

        .loading-progress {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #06B6D4);
          transition: width 0.3s ease;
        }

        .bookmarks-panel, .circuit-panel {
          background: #2a2a2a;
          border-bottom: 1px solid #444;
          padding: 12px;
          color: white;
        }

        .bookmarks-panel h3, .circuit-panel h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #ccc;
        }

        .bookmarks-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bookmark-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .bookmark-item:hover {
          background: #404040;
        }

        .bookmark-name {
          font-weight: 500;
          color: #fff;
        }

        .bookmark-url {
          font-size: 10px;
          color: #888;
          font-family: 'Ubuntu Mono', monospace;
        }

        .circuit-diagram {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .circuit-hop {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hop-number {
          background: #8B5CF6;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .hop-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hop-country {
          font-weight: bold;
          font-size: 12px;
        }

        .hop-type {
          font-size: 10px;
          color: #888;
        }

        .hop-connector {
          color: #8B5CF6;
          font-weight: bold;
        }

        .circuit-stats {
          font-size: 11px;
          color: #ccc;
        }

        .circuit-stats p {
          margin: 4px 0;
        }

        .browser-content {
          flex: 1;
          background: white;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }

        .page-content {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-page {
          text-align: center;
          padding: 40px 20px;
        }

        .tor-logo {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .search-page h1 {
          color: #2c2c2c;
          margin-bottom: 10px;
          font-size: 36px;
        }

        .tagline {
          color: #666;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .search-box {
          display: flex;
          max-width: 500px;
          margin: 0 auto 30px auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-radius: 24px;
          overflow: hidden;
        }

        .search-input {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #8B5CF6;
          border-right: none;
          outline: none;
          font-size: 16px;
        }

        .search-button {
          background: #8B5CF6;
          color: white;
          border: none;
          padding: 12px 24px;
          cursor: pointer;
          font-weight: 500;
        }

        .privacy-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          color: #666;
          font-size: 14px;
        }

        .news-page {
          color: #2c2c2c;
        }

        .news-page h1 {
          color: #8B5CF6;
          margin-bottom: 5px;
        }

        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-style: italic;
        }

        .articles {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .article {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fafafa;
        }

        .article h3 {
          color: #2c2c2c;
          margin-bottom: 10px;
        }

        .article p {
          color: #666;
          line-height: 1.5;
        }

        .generic-onion-site {
          text-align: center;
          padding: 40px 20px;
        }

        .onion-icon {
          font-size: 64px;
          margin: 20px 0;
        }

        .security-status {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          text-align: left;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .tor-toolbar {
            padding: 6px 8px;
          }
          
          .toolbar-button {
            padding: 4px 8px;
            font-size: 12px;
          }
          
          .url-bar {
            padding: 3px 8px;
          }
          
          .page-content {
            padding: 15px;
          }
          
          .privacy-info {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default TorBrowser;