// src/apps/Spreadsheet.jsx
import { useState, useEffect, useCallback } from 'react';

const Spreadsheet = ({ windowId }) => {
  const [data, setData] = useState({});
  const [selectedCell, setSelectedCell] = useState('A1');
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showFormulas, setShowFormulas] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const ROWS = isMobile ? 20 : 30;
  const COLS = isMobile ? 8 : 15;
  
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const themes = {
    light: {
      background: '#ffffff',
      grid: '#f8f9fa',
      cell: '#ffffff',
      cellBorder: '#e0e0e0',
      header: '#3f51b5',
      headerText: '#ffffff',
      selected: '#2196f3',
      text: '#000000',
      formulaBar: '#f5f5f5'
    },
    dark: {
      background: '#1a1a1a',
      grid: '#2d2d2d',
      cell: '#1e1e1e',
      cellBorder: '#404040',
      header: '#1976d2',
      headerText: '#ffffff',
      selected: '#64b5f6',
      text: '#ffffff',
      formulaBar: '#2d2d2d'
    },
    green: {
      background: '#1e3f2d',
      grid: '#2a4b3a',
      cell: '#1e3f2d',
      cellBorder: '#3a5b4a',
      header: '#4caf50',
      headerText: '#ffffff',
      selected: '#81c784',
      text: '#e8f5e9',
      formulaBar: '#2a4b3a'
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

  // Inicializar datos
  useEffect(() => {
    const initialData = {};
    for (let col = 0; col < COLS; col++) {
      for (let row = 1; row <= ROWS; row++) {
        const cellId = `${ALPHABET[col]}${row}`;
        initialData[cellId] = { value: '', formula: '', display: '' };
      }
    }
    setData(initialData);
    addToHistory(initialData);
  }, [ROWS, COLS]);

  // Manejar historial
  const addToHistory = useCallback((newData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newData)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Deshacer
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setData(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  // Rehacer
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setData(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  // Evaluar fórmulas simples
  const evaluateFormula = (formula, cellId) => {
    if (!formula.startsWith('=')) return formula;

    try {
      const expression = formula.substring(1).toUpperCase();
      
      // Suma de rango (ej: =SUM(A1:A5))
      if (expression.startsWith('SUM(')) {
        const range = expression.match(/SUM\(([^)]+)\)/)[1];
        const [start, end] = range.split(':');
        return evaluateRangeSum(start, end);
      }
      
      // Promedio de rango (ej: =AVG(A1:A5))
      if (expression.startsWith('AVG(')) {
        const range = expression.match(/AVG\(([^)]+)\)/)[1];
        const [start, end] = range.split(':');
        return evaluateRangeAvg(start, end);
      }
      
      // Operaciones matemáticas básicas
      let evalExpression = expression;
      const cellRefs = expression.match(/[A-Z]+\d+/g) || [];
      
      cellRefs.forEach(ref => {
        if (ref !== cellId) { // Evitar referencia circular
          const cellValue = parseFloat(data[ref]?.display) || 0;
          evalExpression = evalExpression.replace(ref, cellValue);
        }
      });
      
      // Reemplazar operadores para evaluación segura
      evalExpression = evalExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\,/g, '.');
      
      // Evaluación segura
      const result = Function(`"use strict"; return (${evalExpression})`)();
      return isNaN(result) ? '#ERROR!' : result.toString();
    } catch (error) {
      return '#ERROR!';
    }
  };

  // Evaluar suma de rango
  const evaluateRangeSum = (start, end) => {
    const [startCol, startRow] = parseCellId(start);
    const [endCol, endRow] = parseCellId(end);
    
    let sum = 0;
    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        const cellId = `${ALPHABET[col]}${row}`;
        const value = parseFloat(data[cellId]?.display) || 0;
        sum += value;
      }
    }
    return sum.toString();
  };

  // Evaluar promedio de rango
  const evaluateRangeAvg = (start, end) => {
    const [startCol, startRow] = parseCellId(start);
    const [endCol, endRow] = parseCellId(end);
    
    let sum = 0;
    let count = 0;
    
    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        const cellId = `${ALPHABET[col]}${row}`;
        const value = parseFloat(data[cellId]?.display) || 0;
        sum += value;
        count++;
      }
    }
    
    return count > 0 ? (sum / count).toString() : '0';
  };

  // Parsear ID de celda
  const parseCellId = (cellId) => {
    const col = ALPHABET.indexOf(cellId.match(/[A-Z]+/)[0]);
    const row = parseInt(cellId.match(/\d+/)[0]) - 1;
    return [col, row];
  };

  // Manejar selección de celda
  const handleCellSelect = (cellId) => {
    setSelectedCell(cellId);
    setEditMode(false);
    setEditValue(data[cellId]?.formula || data[cellId]?.value || '');
  };

  // Manejar doble clic para editar
  const handleCellDoubleClick = (cellId) => {
    setSelectedCell(cellId);
    setEditMode(true);
    setEditValue(data[cellId]?.formula || data[cellId]?.value || '');
  };

  // Manejar cambio de valor
  const handleValueChange = (value) => {
    setEditValue(value);
  };

  // Guardar cambios
  const saveChanges = () => {
    if (editValue.trim() === '') {
      // Celda vacía
      const newData = {
        ...data,
        [selectedCell]: { value: '', formula: '', display: '' }
      };
      setData(newData);
      addToHistory(newData);
    } else if (editValue.startsWith('=')) {
      // Es una fórmula
      const displayValue = evaluateFormula(editValue, selectedCell);
      const newData = {
        ...data,
        [selectedCell]: { value: displayValue, formula: editValue, display: displayValue }
      };
      setData(newData);
      addToHistory(newData);
    } else {
      // Es un valor directo
      const newData = {
        ...data,
        [selectedCell]: { value: editValue, formula: '', display: editValue }
      };
      setData(newData);
      addToHistory(newData);
    }
    
    setEditMode(false);
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditMode(false);
    setEditValue(data[selectedCell]?.formula || data[selectedCell]?.value || '');
  };

  // Manejar teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editMode) return;

      const [col, row] = parseCellId(selectedCell);
      
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          setEditMode(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (row > 0) handleCellSelect(`${ALPHABET[col]}${row}`);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (row < ROWS - 1) handleCellSelect(`${ALPHABET[col]}${row + 2}`);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (col > 0) handleCellSelect(`${ALPHABET[col - 1]}${row + 1}`);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (col < COLS - 1) handleCellSelect(`${ALPHABET[col + 1]}${row + 1}`);
          break;
        case 'Delete':
          e.preventDefault();
          const newData = {
            ...data,
            [selectedCell]: { value: '', formula: '', display: '' }
          };
          setData(newData);
          addToHistory(newData);
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            undo();
          }
          break;
        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            redo();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, editMode, data, ROWS, COLS]);

  // Renderizar celda
  const renderCell = (colIndex, rowIndex) => {
    const cellId = `${ALPHABET[colIndex]}${rowIndex + 1}`;
    const cellData = data[cellId] || { value: '', formula: '', display: '' };
    const isSelected = selectedCell === cellId;
    
    return (
      <div
        key={cellId}
        className={`spreadsheet-cell ${isSelected ? 'selected' : ''}`}
        style={{
          background: isSelected ? currentTheme.selected : currentTheme.cell,
          border: `1px solid ${currentTheme.cellBorder}`,
          color: currentTheme.text
        }}
        onClick={() => handleCellSelect(cellId)}
        onDoubleClick={() => handleCellDoubleClick(cellId)}
      >
        {showFormulas && cellData.formula ? cellData.formula : cellData.display}
      </div>
    );
  };

  // Generar encabezados de columnas
  const renderColumnHeaders = () => {
    const headers = [];
    headers.push(
      <div key="corner" className="header-cell corner" style={{
        background: currentTheme.header,
        border: `1px solid ${currentTheme.header}`
      }}></div>
    );
    
    for (let col = 0; col < COLS; col++) {
      headers.push(
        <div
          key={`col-${col}`}
          className="header-cell column-header"
          style={{
            background: currentTheme.header,
            color: currentTheme.headerText,
            border: `1px solid ${currentTheme.header}`
          }}
        >
          {ALPHABET[col]}
        </div>
      );
    }
    return headers;
  };

  // Generar filas
  const renderRows = () => {
    const rows = [];
    
    for (let row = 0; row < ROWS; row++) {
      const rowCells = [];
      
      // Encabezado de fila
      rowCells.push(
        <div
          key={`row-header-${row}`}
          className="header-cell row-header"
          style={{
            background: currentTheme.header,
            color: currentTheme.headerText,
            border: `1px solid ${currentTheme.header}`
          }}
        >
          {row + 1}
        </div>
      );
      
      // Celdas de la fila
      for (let col = 0; col < COLS; col++) {
        rowCells.push(renderCell(col, row));
      }
      
      rows.push(
        <div key={`row-${row}`} className="spreadsheet-row">
          {rowCells}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="spreadsheet" style={{ background: currentTheme.background }}>
      <div className="spreadsheet-container">
        {/* Header */}
        <div className="spreadsheet-header">
          <div className="header-left">
            <div className="app-icon">📊</div>
            <div className="app-title">
              <h1>Spreadsheet - System SWAT</h1>
              <p>Responsive Spreadsheet Application</p>
            </div>
          </div>
          <div className="header-controls">
            <button
              className={`formula-toggle ${showFormulas ? 'active' : ''}`}
              onClick={() => setShowFormulas(!showFormulas)}
              style={{
                background: showFormulas ? currentTheme.selected : currentTheme.cell,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.cellBorder}`
              }}
            >
              {showFormulas ? 'Hide Formulas' : 'Show Formulas'}
            </button>
            
            <div className="history-controls">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="history-btn"
                style={{
                  background: currentTheme.cell,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.cellBorder}`
                }}
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="history-btn"
                style={{
                  background: currentTheme.cell,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.cellBorder}`
                }}
              >
                ↷ Redo
              </button>
            </div>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
              style={{
                background: currentTheme.cell,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.cellBorder}`
              }}
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="green">🎄 Green</option>
            </select>
          </div>
        </div>

        {/* Barra de fórmulas */}
        <div className="formula-bar" style={{ background: currentTheme.formulaBar }}>
          <div className="cell-address" style={{ color: currentTheme.text }}>
            {selectedCell}
          </div>
          <div className="formula-input">
            {editMode ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveChanges();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  autoFocus
                  className="formula-input-field"
                  style={{
                    background: currentTheme.cell,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.selected}`
                  }}
                />
                <div className="edit-buttons">
                  <button onClick={saveChanges} className="save-btn">✓</button>
                  <button onClick={cancelEdit} className="cancel-btn">✕</button>
                </div>
              </div>
            ) : (
              <div
                className="formula-display"
                onClick={() => setEditMode(true)}
                style={{
                  background: currentTheme.cell,
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.cellBorder}`
                }}
              >
                {data[selectedCell]?.formula || data[selectedCell]?.value || ''}
              </div>
            )}
          </div>
        </div>

        {/* Hoja de cálculo */}
        <div className="spreadsheet-main">
          <div 
            className="spreadsheet-grid"
            style={{
              background: currentTheme.grid,
              border: `1px solid ${currentTheme.cellBorder}`
            }}
          >
            <div className="column-headers">
              {renderColumnHeaders()}
            </div>
            <div className="rows-container">
              {renderRows()}
            </div>
          </div>
        </div>

        {/* Información y ayuda */}
        <div className="spreadsheet-footer" style={{ 
          background: currentTheme.formulaBar, 
          color: currentTheme.text 
        }}>
          <div className="footer-info">
            <span>💡 {selectedCell}: {data[selectedCell]?.display || 'Empty'}</span>
            <span>🔢 Use formulas: =SUM(A1:A5), =AVG(B1:B10), =A1+B2, etc.</span>
            {!isMobile && <span>⌨️ Shortcuts: Enter to edit, Arrows to navigate, Del to clear</span>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .spreadsheet {
          width: 100%;
          height: 100%;
          font-family: 'Ubuntu', sans-serif;
          overflow: auto;
        }

        .spreadsheet-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 16px;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .spreadsheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid ${currentTheme.cellBorder};
          flex-wrap: wrap;
          gap: 12px;
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
          color: ${currentTheme.text};
          font-size: 18px;
          line-height: 1.2;
        }

        .app-title p {
          margin: 4px 0 0 0;
          color: ${currentTheme.text};
          opacity: 0.7;
          font-size: 12px;
        }

        .header-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .formula-toggle, .history-btn, .theme-select {
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .history-controls {
          display: flex;
          gap: 4px;
        }

        .history-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .theme-select {
          min-width: 100px;
        }

        .formula-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          min-height: 50px;
          box-sizing: border-box;
        }

        .cell-address {
          font-family: 'Ubuntu Mono', monospace;
          font-weight: bold;
          min-width: 40px;
          text-align: center;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.1);
        }

        .formula-input {
          flex: 1;
        }

        .edit-container {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .formula-input-field, .formula-display {
          flex: 1;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: 'Ubuntu Mono', monospace;
          font-size: 14px;
          min-height: 36px;
          box-sizing: border-box;
        }

        .formula-display {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .edit-buttons {
          display: flex;
          gap: 4px;
        }

        .save-btn, .cancel-btn {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
        }

        .save-btn {
          background: #10B981;
          color: white;
        }

        .cancel-btn {
          background: #EF4444;
          color: white;
        }

        .spreadsheet-main {
          flex: 1;
          overflow: auto;
          min-height: 0;
          border-radius: 8px;
        }

        .spreadsheet-grid {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .column-headers {
          display: grid;
          grid-template-columns: 50px repeat(${COLS}, 1fr);
          height: 30px;
        }

        .spreadsheet-row {
          display: grid;
          grid-template-columns: 50px repeat(${COLS}, 1fr);
          height: ${isMobile ? '35px' : '40px'};
        }

        .header-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          user-select: none;
        }

        .corner {
          border-radius: 0;
        }

        .column-header, .row-header {
          font-size: 11px;
        }

        .spreadsheet-cell {
          padding: 4px 8px;
          font-size: ${isMobile ? '11px' : '12px'};
          display: flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: cell;
          user-select: none;
          font-family: 'Ubuntu Mono', monospace;
          transition: all 0.1s ease;
        }

        .spreadsheet-cell.selected {
          box-shadow: inset 0 0 0 2px ${currentTheme.selected};
          z-index: 1;
          position: relative;
        }

        .spreadsheet-footer {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          text-align: center;
        }

        .footer-info {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 11px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .spreadsheet-container {
            padding: 12px;
          }
          
          .column-headers,
          .spreadsheet-row {
            grid-template-columns: 40px repeat(${COLS}, 1fr);
          }
          
          .header-cell {
            font-size: 11px;
          }
          
          .spreadsheet-cell {
            font-size: 11px;
            padding: 2px 4px;
          }
        }

        @media (max-width: 768px) {
          .spreadsheet-container {
            padding: 8px;
          }
          
          .spreadsheet-header {
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
          
          .formula-bar {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          
          .cell-address {
            align-self: flex-start;
          }
          
          .column-headers,
          .spreadsheet-row {
            grid-template-columns: 35px repeat(${COLS}, 1fr);
          }
          
          .spreadsheet-cell {
            height: 32px;
            font-size: 10px;
            padding: 1px 3px;
          }
          
          .header-cell {
            font-size: 10px;
          }
          
          .footer-info {
            flex-direction: column;
            gap: 4px;
          }
        }

        @media (max-width: 480px) {
          .spreadsheet-container {
            padding: 6px;
          }
          
          .app-title h1 {
            font-size: 16px;
          }
          
          .app-title p {
            font-size: 11px;
          }
          
          .header-controls {
            gap: 6px;
          }
          
          .formula-toggle, .history-btn, .theme-select {
            font-size: 11px;
            padding: 4px 8px;
          }
          
          .history-controls {
            flex-direction: column;
            gap: 2px;
          }
          
          .column-headers,
          .spreadsheet-row {
            grid-template-columns: 30px repeat(${COLS}, 1fr);
            height: 28px;
          }
          
          .spreadsheet-cell {
            height: 28px;
            font-size: 9px;
            padding: 1px 2px;
          }
          
          .formula-input-field, .formula-display {
            font-size: 12px;
            padding: 6px 8px;
          }
          
          .footer-info {
            font-size: 10px;
          }
        }

        @media (max-width: 360px) {
          .column-headers,
          .spreadsheet-row {
            grid-template-columns: 25px repeat(${COLS}, 1fr);
          }
          
          .header-cell {
            font-size: 9px;
          }
          
          .spreadsheet-cell {
            font-size: 8px;
          }
        }

        /* Scrollbars personalizados */
        .spreadsheet-main::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .spreadsheet-main::-webkit-scrollbar-track {
          background: ${currentTheme.grid};
        }

        .spreadsheet-main::-webkit-scrollbar-thumb {
          background: ${currentTheme.cellBorder};
          border-radius: 4px;
        }

        .spreadsheet-main::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.selected};
        }

        /* Mejoras de usabilidad táctil */
        @media (hover: none) and (pointer: coarse) {
          .spreadsheet-cell {
            min-height: 35px;
          }
          
          .formula-toggle:hover, .history-btn:hover, .theme-select:hover {
            transform: none;
          }
          
          .formula-toggle:active, .history-btn:active, .theme-select:active {
            transform: scale(0.95);
            opacity: 0.8;
          }
        }

        /* Soporte para orientación landscape en móviles */
        @media (max-height: 500px) and (orientation: landscape) {
          .spreadsheet-container {
            padding: 6px;
          }
          
          .spreadsheet-header {
            margin-bottom: 8px;
            padding-bottom: 8px;
          }
          
          .formula-bar {
            margin-bottom: 8px;
            padding: 8px;
            min-height: 40px;
          }
          
          .spreadsheet-footer {
            margin-top: 8px;
            padding: 8px 12px;
          }
          
          .column-headers,
          .spreadsheet-row {
            height: 25px;
          }
        }
      `}</style>
    </div>
  );
};

export default Spreadsheet;