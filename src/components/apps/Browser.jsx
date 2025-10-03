// components/apps/Browser.jsx
import { useState } from 'react';

const Browser = () => {
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [history, setHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [iframeError, setIframeError] = useState(false);

  const popularSites = [
    { name: 'YouTube', url: 'https://www.youtube.com', color: '#FF0000' },
    { name: 'GitHub', url: 'https://github.com', color: '#181717' },
    { name: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
    { name: 'Reddit', url: 'https://reddit.com', color: '#FF4500' },
    { name: 'Wikipedia', url: 'https://wikipedia.org', color: '#000000' },
    { name: 'Amazon', url: 'https://amazon.com', color: '#FF9900' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#F48024' },
    { name: 'MDN', url: 'https://developer.mozilla.org', color: '#000000' },
  ];

  const navigateToUrl = (targetUrl) => {
    let finalUrl = targetUrl;
    
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
        finalUrl = 'https://' + targetUrl;
      } else {
        // Usar DuckDuckGo en lugar de Google (mejor para iframes)
        finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(targetUrl)}`;
      }
    }
    
    setCurrentPage(finalUrl);
    setUrl(finalUrl);
    setIframeError(false);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToUrl(searchQuery);
      setSearchQuery('');
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      navigateToUrl(url);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevPage = history[newIndex];
      setCurrentPage(prevPage);
      setUrl(prevPage === 'home' ? '' : prevPage);
      setIframeError(false);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextPage = history[newIndex];
      setCurrentPage(nextPage);
      setUrl(nextPage === 'home' ? '' : nextPage);
      setIframeError(false);
    }
  };

  const goHome = () => {
    setCurrentPage('home');
    setUrl('');
    setIframeError(false);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push('home');
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const openInNewTab = () => {
    if (currentPage !== 'home') {
      window.open(currentPage, '_blank');
    }
  };

  const renderHomePage = () => (
    <div style={styles.homePage}>
      <div style={styles.homeContainer}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h1 style={styles.title}>Firefox Browser</h1>
          <p style={styles.subtitle}>Tu navegador privado y seguro</p>
        </div>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchContainer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar o escribir URL..."
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              Buscar
            </button>
          </div>
        </form>

        {/* Sitios populares */}
        <div style={styles.popularSection}>
          <h2 style={styles.popularTitle}>Sitios frecuentes</h2>
          <div style={styles.popularGrid}>
            {popularSites.map((site) => (
              <button
                key={site.name}
                onClick={() => navigateToUrl(site.url)}
                style={styles.siteCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{...styles.siteIcon, backgroundColor: site.color}}>
                  {site.name[0]}
                </div>
                <p style={styles.siteName}>{site.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>🔒 Navegación privada y segura</p>
          <p style={{fontSize: '12px', marginTop: '8px', color: '#9ca3af'}}>
            Tip: Algunos sitios pueden no permitir ser embebidos por seguridad (X-Frame-Options)
          </p>
        </div>
      </div>
    </div>
  );

  const renderErrorPage = () => (
    <div style={styles.errorPage}>
      <div style={styles.errorContent}>
        <div style={styles.errorIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 style={styles.errorTitle}>Este sitio no permite ser embebido</h2>
        <p style={styles.errorText}>
          El sitio <strong>{currentPage}</strong> tiene restricciones de seguridad (X-Frame-Options) 
          que impiden mostrarlo dentro de otro sitio web.
        </p>
        <div style={styles.errorButtons}>
          <button onClick={openInNewTab} style={styles.errorButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{marginRight: '8px'}}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Abrir en Nueva Pestaña
          </button>
          <button onClick={goHome} style={styles.errorButtonSecondary}>
            Volver al Inicio
          </button>
        </div>
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>💡 Sitios que funcionan mejor:</p>
          <ul style={styles.infoList}>
            <li>Wikipedia, MDN, Stack Overflow</li>
            <li>Sitios de documentación técnica</li>
            <li>Muchos blogs y sitios personales</li>
          </ul>
          <p style={styles.infoNote}>
            ❌ No funcionan: Google, Facebook, Twitter, bancos (por seguridad)
          </p>
        </div>
      </div>
    </div>
  );

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1f2937',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    toolbar: {
      backgroundColor: '#1f2937',
      borderBottom: '1px solid #374151',
      padding: '8px 16px',
    },
    toolbarContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    },
    navControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    navButton: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#d1d5db',
      transition: 'background-color 0.2s',
    },
    urlForm: {
      flex: 1,
      minWidth: '200px',
    },
    urlContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#374151',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    lockIcon: {
      marginLeft: '12px',
      color: '#10b981',
    },
    urlInput: {
      flex: 1,
      backgroundColor: 'transparent',
      border: 'none',
      padding: '8px 12px',
      color: '#e5e7eb',
      fontSize: '14px',
      outline: 'none',
    },
    goButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    content: {
      flex: 1,
      overflow: 'auto',
      position: 'relative',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      backgroundColor: 'white',
    },
    homePage: {
      minHeight: '100%',
      background: 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 50%, #fce7f3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    },
    homeContainer: {
      width: '100%',
      maxWidth: '768px',
    },
    logoSection: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logoCircle: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #f97316 0%, #9333ea 100%)',
      borderRadius: '50%',
      marginBottom: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #9333ea 0%, #2563eb 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px',
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px',
    },
    searchForm: {
      marginBottom: '48px',
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    searchIcon: {
      marginLeft: '24px',
    },
    searchInput: {
      flex: 1,
      padding: '20px 16px',
      fontSize: '18px',
      border: 'none',
      outline: 'none',
    },
    searchButton: {
      background: 'linear-gradient(90deg, #9333ea 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      padding: '20px 32px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    popularSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '32px',
    },
    popularTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '24px',
    },
    popularGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
    },
    siteCard: {
      position: 'relative',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      textAlign: 'left',
    },
    siteIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '24px',
      marginBottom: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    siteName: {
      fontWeight: '600',
      color: '#1f2937',
      margin: 0,
    },
    footer: {
      marginTop: '32px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
    errorPage: {
      minHeight: '100%',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    },
    errorContent: {
      textAlign: 'center',
      maxWidth: '600px',
    },
    errorIcon: {
      marginBottom: '24px',
    },
    errorTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
    },
    errorText: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '32px',
      lineHeight: '1.6',
    },
    errorButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      marginBottom: '32px',
      flexWrap: 'wrap',
    },
    errorButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(90deg, #9333ea 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
    },
    errorButtonSecondary: {
      backgroundColor: '#e5e7eb',
      color: '#1f2937',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      border: '2px solid #bfdbfe',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'left',
    },
    infoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '12px',
    },
    infoList: {
      color: '#374151',
      marginBottom: '12px',
      paddingLeft: '20px',
    },
    infoNote: {
      fontSize: '14px',
      color: '#dc2626',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarContent}>
          {/* Controles de navegación */}
          <div style={styles.navControls}>
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              style={{
                ...styles.navButton,
                opacity: historyIndex === 0 ? 0.4 : 1,
                cursor: historyIndex === 0 ? 'not-allowed' : 'pointer',
              }}
              title="Atrás"
              onMouseEnter={(e) => historyIndex !== 0 && (e.currentTarget.style.backgroundColor = '#374151')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              style={{
                ...styles.navButton,
                opacity: historyIndex === history.length - 1 ? 0.4 : 1,
                cursor: historyIndex === history.length - 1 ? 'not-allowed' : 'pointer',
              }}
              title="Adelante"
              onMouseEnter={(e) => historyIndex !== history.length - 1 && (e.currentTarget.style.backgroundColor = '#374151')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage(currentPage)}
              style={styles.navButton}
              title="Recargar"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
              </svg>
            </button>
            <button
              onClick={goHome}
              style={styles.navButton}
              title="Inicio"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </button>
          </div>

          {/* Barra de URL */}
          <form onSubmit={handleUrlSubmit} style={styles.urlForm}>
            <div style={styles.urlContainer}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={styles.lockIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Buscar o escribir URL..."
                style={styles.urlInput}
              />
              <button
                type="submit"
                style={styles.goButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Ir
              </button>
            </div>
          </form>

          {/* Acciones */}
          <div style={styles.actions}>
            <button
              onClick={goHome}
              style={styles.navButton}
              title="Nueva pestaña"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5v14"/>
              </svg>
            </button>
            {currentPage !== 'home' && (
              <button
                onClick={openInNewTab}
                style={styles.navButton}
                title="Abrir en nueva pestaña del navegador real"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={styles.content}>
        {currentPage === 'home' ? (
          renderHomePage()
        ) : iframeError ? (
          renderErrorPage()
        ) : (
          <iframe
            src={currentPage}
            style={styles.iframe}
            title="Navegador web"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onError={() => setIframeError(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Browser;