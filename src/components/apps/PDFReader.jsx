// src/apps/PDFReader.jsx
import { useState, useEffect, useRef } from 'react';

const PDFReader = ({ windowId }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [isMobile, setIsMobile] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInstanceRef = useRef(null);
  const renderTimeoutRef = useRef(null);

  const themes = {
    light: {
      background: '#ffffff',
      sidebar: '#f8f9fa',
      toolbar: '#e9ecef',
      text: '#000000',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      accent: '#007bff',
      hover: '#e9ecef'
    },
    dark: {
      background: '#1a1a1a',
      sidebar: '#2d2d2d',
      toolbar: '#343a40',
      text: '#ffffff',
      textSecondary: '#adb5bd',
      border: '#495057',
      accent: '#4dabf7',
      hover: '#343a40'
    },
    sepia: {
      background: '#f8f0e0',
      sidebar: '#e8dfce',
      toolbar: '#dfd2b8',
      text: '#5c4b37',
      textSecondary: '#8b7b66',
      border: '#d4c5a8',
      accent: '#d4a017',
      hover: '#e8dfce'
    }
  };

  const currentTheme = themes[theme];

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulación mejorada de PDF.js
  const createMockPDF = (numPages = 5) => {
    return {
      numPages,
      getPage: async (pageNumber) => {
        return {
          getViewport: ({ scale }) => ({
            width: 595 * scale,
            height: 842 * scale
          }),
          render: (context) => {
            // Verificar que el contexto y canvas existan
            if (!context?.canvas) {
              console.warn('Contexto de renderizado no disponible');
              return Promise.resolve();
            }

            const canvas = context.canvas;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              console.warn('Contexto 2D no disponible');
              return Promise.resolve();
            }

            try {
              // Limpiar canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Dibujar página simulada
              ctx.fillStyle = theme === 'dark' ? '#2d2d2d' : '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              ctx.strokeStyle = theme === 'dark' ? '#555555' : '#cccccc';
              ctx.lineWidth = 1;
              ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
              
              ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#333333';
              ctx.font = '16px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(`Página ${pageNumber}`, canvas.width / 2, 50);
              ctx.fillText('Documento PDF de ejemplo', canvas.width / 2, 80);
              
              // Contenido de ejemplo
              ctx.font = '12px Arial';
              ctx.textAlign = 'left';
              ctx.fillText('Este es un documento PDF de demostración.', 50, 120);
              ctx.fillText('Puede cargar sus propios archivos PDF.', 50, 140);
              ctx.fillText('Use los controles para navegar y hacer zoom.', 50, 160);
              
              // Información adicional
              ctx.fillText(`Zoom: ${Math.round(scale * 100)}%`, 50, 190);
              ctx.fillText(`Tema: ${theme}`, 50, 210);
              
              if (searchTerm) {
                ctx.fillStyle = '#ff6b6b';
                ctx.fillText(`Búsqueda: "${searchTerm}"`, 50, 240);
                
                // Simular texto resaltado
                if (searchResults.some(result => result.page === pageNumber)) {
                  ctx.fillStyle = 'rgba(255, 235, 59, 0.3)';
                  ctx.fillRect(45, 235, 200, 20);
                  
                  ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#333333';
                  ctx.fillText(`Búsqueda: "${searchTerm}"`, 50, 240);
                }
              }
              
            } catch (err) {
              console.error('Error al dibujar en el canvas:', err);
            }
            
            return Promise.resolve();
          }
        };
      }
    };
  };

  // Manejar carga de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      // Limpiar URL anterior si existe
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setError('');
      setCurrentPage(1);
      setSearchTerm('');
      setSearchResults([]);
    } else {
      setError('Por favor, seleccione un archivo PDF válido.');
    }
  };

  // Cargar PDF cuando cambie pdfUrl
  useEffect(() => {
    if (pdfUrl) {
      loadPDF();
    }

    // Cleanup
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [pdfUrl]);

  const loadPDF = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simular carga de PDF
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPDF = createMockPDF(5);
      pdfInstanceRef.current = mockPDF;
      setTotalPages(mockPDF.numPages);
      
      // Crear array de páginas
      const pagesArray = Array.from({ length: mockPDF.numPages }, (_, i) => i + 1);
      setPages(pagesArray);
      
      // Esperar a que el componente se renderice completamente
      setTimeout(() => {
        renderPage(currentPage);
      }, 100);
      
    } catch (err) {
      setError('Error al cargar el PDF: ' + err.message);
      console.error('Error loading PDF:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar página con manejo robusto de errores
  const renderPage = async (pageNumber) => {
    // Limpiar timeout anterior
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // Verificar que el canvas esté disponible
    if (!canvasRef.current) {
      console.log('Canvas no disponible, reintentando...');
      renderTimeoutRef.current = setTimeout(() => renderPage(pageNumber), 100);
      return;
    }

    // Verificar que el PDF esté cargado
    if (!pdfInstanceRef.current) {
      console.log('PDF no cargado, reintentando...');
      renderTimeoutRef.current = setTimeout(() => renderPage(pageNumber), 100);
      return;
    }

    const canvas = canvasRef.current;
    
    try {
      const page = await pdfInstanceRef.current.getPage(pageNumber);
      
      if (!page) {
        throw new Error('Página no encontrada');
      }

      const viewport = page.getViewport({ 
        scale: scale * (isMobile ? 0.8 : 1) 
      });
      
      // Configurar canvas
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Obtener contexto
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('No se pudo obtener el contexto 2D');
      }

      // Limpiar canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Renderizar página
      await page.render({ 
        canvasContext: context, 
        viewport 
      });
      
      console.log(`Página ${pageNumber} renderizada correctamente`);
      
    } catch (err) {
      console.error('Error al renderizar la página:', err);
      
      // Dibujar fallback en el canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6c757d';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Error al cargar la página', canvas.width / 2, canvas.height / 2);
        ctx.font = '12px Arial';
        ctx.fillText('Intente recargar el documento', canvas.width / 2, canvas.height / 2 + 30);
      }
    }
  };

  // Efecto para renderizar cuando cambian las dependencias
  useEffect(() => {
    if (pdfFile && currentPage) {
      renderPage(currentPage);
    }
  }, [currentPage, scale, rotation, theme, searchTerm]);

  // Navegación de páginas
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    const pageNum = parseInt(pageNumber);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Zoom
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const setZoom = (newScale) => {
    setScale(parseFloat(newScale));
  };

  // Búsqueda
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Simular resultados de búsqueda
    const results = [];
    for (let i = 1; i <= totalPages; i++) {
      if (Math.random() > 0.5) {
        results.push({
          page: i,
          count: Math.floor(Math.random() * 3) + 1
        });
      }
    }
    
    setSearchResults(results);
    setCurrentSearchIndex(0);
    
    if (results.length > 0) {
      goToPage(results[0].page);
    }
  };

  const goToNextSearchResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      goToPage(searchResults[nextIndex].page);
    }
  };

  const goToPreviousSearchResult = () => {
    if (searchResults.length > 0) {
      const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentSearchIndex(prevIndex);
      goToPage(searchResults[prevIndex].page);
    }
  };

  // Rotación
  const rotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  // Thumbnails
  const renderThumbnails = () => {
    return pages.map(page => (
      <div
        key={page}
        className={`thumbnail ${currentPage === page ? 'active' : ''}`}
        onClick={() => goToPage(page)}
        style={{
          background: currentTheme.background,
          border: `2px solid ${currentPage === page ? currentTheme.accent : currentTheme.border}`,
          color: currentTheme.text
        }}
      >
        <div className="thumbnail-number">{page}</div>
        <div className="thumbnail-content">
          <div className="thumbnail-page">Página {page}</div>
        </div>
      </div>
    ));
  };

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          setZoom(1);
          break;
        case 'f':
          if (e.ctrlKey) {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div className="pdf-reader" style={{ background: currentTheme.background, color: currentTheme.text }}>
      <div className="pdf-reader-container">
        {/* Header */}
        <div className="pdf-header">
          <div className="header-left">
            <div className="app-icon">📄</div>
            <div className="app-title">
              <h1>PDF Reader - System SWAT</h1>
              <p>Lector de PDF responsivo y moderno</p>
            </div>
          </div>
          <div className="header-controls">
            <button
              className={`thumbnails-toggle ${showThumbnails ? 'active' : ''}`}
              onClick={() => setShowThumbnails(!showThumbnails)}
              style={{
                background: showThumbnails ? currentTheme.accent : currentTheme.toolbar,
                color: showThumbnails ? '#fff' : currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
            >
              {showThumbnails ? 'Ocultar Miniaturas' : 'Mostrar Miniaturas'}
            </button>
            
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
              style={{
                background: currentTheme.toolbar,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
            >
              <option value="light">☀️ Claro</option>
              <option value="dark">🌙 Oscuro</option>
              <option value="sepia">📜 Sepia</option>
            </select>
          </div>
        </div>

        {/* Barra de herramientas principal */}
        <div className="toolbar" style={{ background: currentTheme.toolbar, borderBottom: `1px solid ${currentTheme.border}` }}>
          <div className="toolbar-section">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="toolbar-btn"
              style={{
                background: currentTheme.accent,
                color: '#fff'
              }}
            >
              📂 Abrir PDF
            </button>
            
            {pdfFile && (
              <span className="file-name" style={{ color: currentTheme.textSecondary }}>
                {pdfFile.name}
              </span>
            )}
          </div>

          {pdfFile && (
            <>
              <div className="toolbar-section">
                <div className="navigation-controls">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage <= 1}
                    className="toolbar-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    ◀ Anterior
                  </button>
                  
                  <div className="page-info">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => goToPage(parseInt(e.target.value))}
                      className="page-input"
                      style={{
                        background: currentTheme.background,
                        color: currentTheme.text,
                        border: `1px solid ${currentTheme.border}`
                      }}
                    />
                    <span style={{ color: currentTheme.textSecondary }}>
                      / {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                    className="toolbar-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    Siguiente ▶
                  </button>
                </div>
              </div>

              <div className="toolbar-section">
                <div className="zoom-controls">
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="toolbar-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    🔍−
                  </button>
                  
                  <select
                    value={scale}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="zoom-select"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    <option value="0.5">50%</option>
                    <option value="0.75">75%</option>
                    <option value="1">100%</option>
                    <option value="1.25">125%</option>
                    <option value="1.5">150%</option>
                    <option value="2">200%</option>
                  </select>
                  
                  <button
                    onClick={zoomIn}
                    disabled={scale >= 3}
                    className="toolbar-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    🔍+
                  </button>
                  
                  <button
                    onClick={rotate}
                    className="toolbar-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    🔄 Rotar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Barra de búsqueda */}
        {pdfFile && (
          <div className="search-bar" style={{ background: currentTheme.toolbar, borderBottom: `1px solid ${currentTheme.border}` }}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar en el documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
                style={{
                  background: currentTheme.background,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`
                }}
              />
              <button
                onClick={handleSearch}
                className="search-btn"
                style={{
                  background: currentTheme.accent,
                  color: '#fff'
                }}
              >
                Buscar
              </button>
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  <span style={{ color: currentTheme.textSecondary }}>
                    {searchResults.length} resultados
                  </span>
                  <button
                    onClick={goToPreviousSearchResult}
                    className="search-nav-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    ◀
                  </button>
                  <button
                    onClick={goToNextSearchResult}
                    className="search-nav-btn"
                    style={{
                      background: currentTheme.background,
                      color: currentTheme.text,
                      border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="pdf-main">
          {/* Sidebar de miniaturas */}
          {showThumbnails && pdfFile && (
            <div className="thumbnails-sidebar" style={{ 
              background: currentTheme.sidebar,
              borderRight: `1px solid ${currentTheme.border}`
            }}>
              <div className="thumbnails-header">
                <h3 style={{ color: currentTheme.text }}>Miniaturas</h3>
              </div>
              <div className="thumbnails-list">
                {renderThumbnails()}
              </div>
            </div>
          )}

          {/* Área del documento */}
          <div className="document-area">
            {isLoading && (
              <div className="loading" style={{ color: currentTheme.text }}>
                <div className="loading-spinner">⏳</div>
                <p>Cargando PDF...</p>
              </div>
            )}

            {error && (
              <div className="error" style={{ color: '#dc3545' }}>
                <div className="error-icon">❌</div>
                <p>{error}</p>
              </div>
            )}

            {!pdfFile && !isLoading && !error && (
              <div className="welcome" style={{ color: currentTheme.textSecondary }}>
                <div className="welcome-icon">📄</div>
                <h2>Bienvenido al Lector PDF</h2>
                <p>Seleccione un archivo PDF para comenzar</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="welcome-btn"
                  style={{
                    background: currentTheme.accent,
                    color: '#fff'
                  }}
                >
                  Abrir Archivo PDF
                </button>
                <div className="welcome-features">
                  <div className="feature">
                    <span>🔍</span>
                    <span>Zoom y Navegación</span>
                  </div>
                  <div className="feature">
                    <span>🔎</span>
                    <span>Búsqueda de Texto</span>
                  </div>
                  <div className="feature">
                    <span>🎨</span>
                    <span>Múltiples Temas</span>
                  </div>
                  <div className="feature">
                    <span>📱</span>
                    <span>Diseño Responsivo</span>
                  </div>
                </div>
              </div>
            )}

            {pdfFile && !isLoading && !error && (
              <div className="pdf-viewer">
                <div 
                  className="pdf-canvas-container"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <canvas 
                    ref={canvasRef} 
                    className="pdf-canvas"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pdf-footer" style={{ 
          background: currentTheme.toolbar, 
          color: currentTheme.textSecondary,
          borderTop: `1px solid ${currentTheme.border}`
        }}>
          <div className="footer-info">
            <span>
              {pdfFile ? `Documento: ${pdfFile.name} | Página ${currentPage} de ${totalPages} | Zoom: ${Math.round(scale * 100)}%` : 'Seleccione un archivo PDF'}
            </span>
            {!isMobile && (
              <span>💡 Atajos: Flechas para navegar, +/- para zoom, Ctrl+F para buscar</span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pdf-reader {
          width: 100%;
          height: 100%;
          font-family: 'Ubuntu', sans-serif;
          overflow: hidden;
        }

        .pdf-reader-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 100%;
        }

        .pdf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          flex-wrap: wrap;
          gap: 12px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 200px;
        }

        .app-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .app-title h1 {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
        }

        .app-title p {
          margin: 4px 0 0 0;
          opacity: 0.7;
          font-size: 12px;
        }

        .header-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .thumbnails-toggle, .theme-select {
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .theme-select {
          min-width: 120px;
        }

        .toolbar {
          display: flex;
          padding: 8px 16px;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
          flex-shrink: 0;
        }

        .toolbar-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .toolbar-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .toolbar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .file-name {
          font-size: 12px;
          margin-left: 8px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .navigation-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }

        .page-input {
          width: 50px;
          padding: 4px 6px;
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .zoom-select {
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          min-width: 70px;
        }

        .search-bar {
          padding: 8px 16px;
          flex-shrink: 0;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          max-width: 300px;
        }

        .search-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .search-results {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .search-nav-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
        }

        .pdf-main {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }

        .thumbnails-sidebar {
          width: 200px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .thumbnails-header {
          padding: 12px;
          border-bottom: 1px solid ${currentTheme.border};
        }

        .thumbnails-header h3 {
          margin: 0;
          font-size: 14px;
        }

        .thumbnails-list {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .thumbnail {
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .thumbnail:hover {
          background: ${currentTheme.hover} !important;
        }

        .thumbnail.active {
          background: ${currentTheme.hover} !important;
        }

        .thumbnail-number {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .thumbnail-content {
          font-size: 10px;
          opacity: 0.8;
        }

        .document-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
          padding: 20px;
        }

        .loading, .error, .welcome {
          text-align: center;
          padding: 40px 20px;
        }

        .loading-spinner, .error-icon, .welcome-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .welcome h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
        }

        .welcome p {
          margin: 0 0 20px 0;
          font-size: 16px;
        }

        .welcome-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 30px;
          transition: all 0.2s ease;
        }

        .welcome-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          max-width: 400px;
          margin: 0 auto;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .pdf-viewer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .pdf-canvas-container {
          transition: transform 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
          max-width: 100%;
          max-height: 100%;
        }

        .pdf-canvas {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .pdf-footer {
          padding: 8px 16px;
          flex-shrink: 0;
        }

        .footer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .thumbnails-sidebar {
            width: 150px;
          }
        }

        @media (max-width: 768px) {
          .pdf-header {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
          
          .header-left {
            justify-content: center;
            text-align: center;
          }
          
          .header-controls {
            justify-content: center;
            width: 100%;
          }
          
          .toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .toolbar-section {
            justify-content: center;
          }
          
          .thumbnails-sidebar {
            width: 120px;
          }
          
          .document-area {
            padding: 10px;
          }
          
          .footer-info {
            flex-direction: column;
            gap: 4px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .pdf-header {
            padding: 8px 12px;
          }
          
          .app-title h1 {
            font-size: 16px;
          }
          
          .app-title p {
            font-size: 11px;
          }
          
          .toolbar {
            padding: 6px 12px;
          }
          
          .toolbar-btn {
            font-size: 11px;
            padding: 4px 8px;
          }
          
          .search-input {
            min-width: 150px;
            font-size: 11px;
          }
          
          .thumbnails-sidebar {
            width: 100px;
          }
          
          .thumbnail {
            padding: 6px;
          }
          
          .welcome h2 {
            font-size: 20px;
          }
          
          .welcome p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFReader;