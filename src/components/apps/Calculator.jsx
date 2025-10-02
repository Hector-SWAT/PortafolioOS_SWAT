// src/apps/Calculator.jsx
import { useState, useEffect } from 'react';

const Calculator = ({ windowId }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(0);
  const [isScientific, setIsScientific] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(false);

  const themes = {
    dark: {
      background: '#1a1a1a',
      display: '#2a2a2a',
      button: '#333',
      buttonText: '#fff',
      operation: '#8B5CF6',
      scientific: '#06B6D4',
      memory: '#10B981',
      equals: '#F59E0B'
    },
    light: {
      background: '#f5f5f5',
      display: '#ffffff',
      button: '#e0e0e0',
      buttonText: '#333',
      operation: '#7C3AED',
      scientific: '#0891B2',
      memory: '#059669',
      equals: '#D97706'
    },
    blue: {
      background: '#0F172A',
      display: '#1E293B',
      button: '#334155',
      buttonText: '#F1F5F9',
      operation: '#3B82F6',
      scientific: '#06B6D4',
      memory: '#10B981',
      equals: '#F59E0B'
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

  // Manejar entrada de números
  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Manejar punto decimal
  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Limpiar display
  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  // Limpiar entrada actual
  const clearEntry = () => {
    setDisplay('0');
  };

  // Borrar último carácter
  const backspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Cambiar signo
  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  // Calcular porcentaje
  const calculatePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  // Realizar operación
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Agregar a historial
      setHistory(prev => [{
        id: Date.now(),
        calculation: `${currentValue} ${getOperationSymbol(operation)} ${inputValue} = ${newValue}`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  // Calcular resultado
  const calculateResult = () => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);

      // Agregar a historial
      setHistory(prev => [{
        id: Date.now(),
        calculation: `${previousValue} ${getOperationSymbol(operation)} ${inputValue} = ${result}`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    }
  };

  // Función de cálculo
  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  // Obtener símbolo de operación
  const getOperationSymbol = (op) => {
    const symbols = {
      '+': '+',
      '-': '-',
      '×': '×',
      '÷': '÷',
      '^': '^'
    };
    return symbols[op] || op;
  };

  // Funciones científicas
  const scientificFunction = (func) => {
    const value = parseFloat(display);
    let result;

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'square':
        result = Math.pow(value, 2);
        break;
      case 'cube':
        result = Math.pow(value, 3);
        break;
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'exp':
        result = Math.exp(value);
        break;
      case 'factorial':
        result = factorial(value);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  // Factorial
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Funciones de memoria
  const memoryFunction = (func) => {
    const value = parseFloat(display);

    switch (func) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        setWaitingForNewValue(true);
        break;
      case 'M+':
        setMemory(memory + value);
        setWaitingForNewValue(true);
        break;
      case 'M-':
        setMemory(memory - value);
        setWaitingForNewValue(true);
        break;
      case 'MS':
        setMemory(value);
        setWaitingForNewValue(true);
        break;
      default:
        break;
    }
  };

  // Manejar teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      
      if (/[0-9]/.test(key)) {
        inputNumber(parseInt(key));
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        e.preventDefault();
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
      } else if (key === 'Backspace') {
        backspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, waitingForNewValue, previousValue, operation]);

  // Botones básicos
  const basicButtons = [
    { label: 'C', action: clearDisplay, type: 'clear' },
    { label: 'CE', action: clearEntry, type: 'clear' },
    { label: '⌫', action: backspace, type: 'clear' },
    { label: '÷', action: () => performOperation('÷'), type: 'operation' },
    
    { label: '7', action: () => inputNumber(7), type: 'number' },
    { label: '8', action: () => inputNumber(8), type: 'number' },
    { label: '9', action: () => inputNumber(9), type: 'number' },
    { label: '×', action: () => performOperation('×'), type: 'operation' },
    
    { label: '4', action: () => inputNumber(4), type: 'number' },
    { label: '5', action: () => inputNumber(5), type: 'number' },
    { label: '6', action: () => inputNumber(6), type: 'number' },
    { label: '-', action: () => performOperation('-'), type: 'operation' },
    
    { label: '1', action: () => inputNumber(1), type: 'number' },
    { label: '2', action: () => inputNumber(2), type: 'number' },
    { label: '3', action: () => inputNumber(3), type: 'number' },
    { label: '+', action: () => performOperation('+'), type: 'operation' },
    
    { label: '±', action: toggleSign, type: 'scientific' },
    { label: '0', action: () => inputNumber(0), type: 'number' },
    { label: '.', action: inputDecimal, type: 'number' },
    { label: '=', action: calculateResult, type: 'equals' }
  ];

  // Botones científicos
  const scientificButtons = [
    { label: 'x²', action: () => scientificFunction('square'), type: 'scientific' },
    { label: 'x³', action: () => scientificFunction('cube'), type: 'scientific' },
    { label: '√', action: () => scientificFunction('sqrt'), type: 'scientific' },
    { label: '^', action: () => performOperation('^'), type: 'scientific' },
    
    { label: 'sin', action: () => scientificFunction('sin'), type: 'scientific' },
    { label: 'cos', action: () => scientificFunction('cos'), type: 'scientific' },
    { label: 'tan', action: () => scientificFunction('tan'), type: 'scientific' },
    { label: 'π', action: () => scientificFunction('pi'), type: 'scientific' },
    
    { label: 'log', action: () => scientificFunction('log'), type: 'scientific' },
    { label: 'ln', action: () => scientificFunction('ln'), type: 'scientific' },
    { label: 'e', action: () => scientificFunction('e'), type: 'scientific' },
    { label: 'x!', action: () => scientificFunction('factorial'), type: 'scientific' },
    
    { label: '(', action: () => inputNumber('('), type: 'scientific' },
    { label: ')', action: () => inputNumber(')'), type: 'scientific' },
    { label: '%', action: calculatePercentage, type: 'scientific' },
    { label: 'exp', action: () => scientificFunction('exp'), type: 'scientific' }
  ];

  // Botones de memoria
  const memoryButtons = [
    { label: 'MC', action: () => memoryFunction('MC'), type: 'memory' },
    { label: 'MR', action: () => memoryFunction('MR'), type: 'memory' },
    { label: 'M+', action: () => memoryFunction('M+'), type: 'memory' },
    { label: 'M-', action: () => memoryFunction('M-'), type: 'memory' },
    { label: 'MS', action: () => memoryFunction('MS'), type: 'memory' }
  ];

  const getButtonStyle = (type) => {
    const baseStyle = {
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '14px' : '18px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: isMobile ? '45px' : '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    };

    const typeStyles = {
      number: {
        background: currentTheme.button,
        color: currentTheme.buttonText
      },
      operation: {
        background: currentTheme.operation,
        color: 'white'
      },
      scientific: {
        background: currentTheme.scientific,
        color: 'white',
        fontSize: isMobile ? '12px' : '16px'
      },
      memory: {
        background: currentTheme.memory,
        color: 'white',
        fontSize: isMobile ? '10px' : '14px'
      },
      equals: {
        background: currentTheme.equals,
        color: 'white'
      },
      clear: {
        background: '#EF4444',
        color: 'white'
      }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  return (
    <div className="calculator" style={{ background: currentTheme.background }}>
      <div className="calculator-container">
        {/* Header */}
        <div className="calculator-header">
          <div className="header-left">
            <div className="app-icon">🧮</div>
            <div className="app-title">
              <h1>Calculator - System SWAT</h1>
              <p>Scientific Calculator with Memory</p>
            </div>
          </div>
          <div className="header-controls">
            <button 
              className={`mode-toggle ${isScientific ? 'active' : ''}`}
              onClick={() => setIsScientific(!isScientific)}
              style={{ 
                background: isScientific ? currentTheme.scientific : currentTheme.button,
                color: 'white'
              }}
            >
              {isScientific ? 'Scientific' : 'Basic'}
            </button>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
              style={{ 
                background: currentTheme.button,
                color: currentTheme.buttonText,
                border: `1px solid ${currentTheme.operation}`
              }}
            >
              <option value="dark">🌙 Dark</option>
              <option value="light">☀️ Light</option>
              <option value="blue">🔵 Blue</option>
            </select>
          </div>
        </div>

        <div className="calculator-main">
          {/* Panel izquierdo - Calculadora */}
          <div className="calculator-panel">
            {/* Display */}
            <div className="display-container" style={{ background: currentTheme.display }}>
              <div className="display-memory" style={{ color: currentTheme.memory }}>
                {memory !== 0 && `M: ${memory}`}
              </div>
              <div className="display-operation">
                {previousValue} {operation && getOperationSymbol(operation)}
              </div>
              <div className="display-value">
                {display}
              </div>
            </div>

            {/* Botones de memoria */}
            <div className="memory-buttons">
              {memoryButtons.map((button, index) => (
                <button
                  key={index}
                  style={getButtonStyle(button.type)}
                  onClick={button.action}
                  className="calc-button"
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Botones de la calculadora */}
            <div className="buttons-grid">
              {basicButtons.map((button, index) => (
                <button
                  key={index}
                  style={getButtonStyle(button.type)}
                  onClick={button.action}
                  className="calc-button"
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Botones científicos */}
            {isScientific && (
              <div className="scientific-buttons">
                {scientificButtons.map((button, index) => (
                  <button
                    key={index}
                    style={getButtonStyle(button.type)}
                    onClick={button.action}
                    className="calc-button"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Panel derecho - Historial (oculto en móvil) */}
          {!isMobile && (
            <div className="history-panel" style={{ background: currentTheme.display }}>
              <div className="history-header">
                <h3>History</h3>
                <button 
                  onClick={() => setHistory([])}
                  className="clear-history"
                  style={{ 
                    background: currentTheme.button,
                    color: currentTheme.buttonText
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="history-list">
                {history.length === 0 ? (
                  <div className="no-history">
                    <div className="history-icon">📝</div>
                    <p>No calculations yet</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-calculation">{item.calculation}</div>
                      <div className="history-time">{item.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer con información */}
        <div className="calculator-footer" style={{ background: currentTheme.button, color: currentTheme.buttonText }}>
          <div className="footer-info">
            <span>💡 Tip: Use keyboard for faster input</span>
            {!isMobile && <span>🔢 Supports: +, -, *, /, Enter, Escape, Backspace</span>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .calculator {
          width: 100%;
          height: 100%;
          font-family: 'Ubuntu', sans-serif;
          overflow: auto;
          padding: 0;
        }

        .calculator-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 16px;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .calculator-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
          color: ${currentTheme.buttonText};
          font-size: 18px;
          line-height: 1.2;
        }

        .app-title p {
          margin: 4px 0 0 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
        }

        .header-controls {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .mode-toggle {
          padding: 6px 12px;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .theme-select {
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          min-width: 100px;
        }

        .calculator-main {
          display: grid;
          grid-template-columns: ${isMobile ? '1fr' : '1fr 300px'};
          gap: 16px;
          flex: 1;
          min-height: 0;
        }

        .calculator-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
        }

        .display-container {
          padding: 16px;
          border-radius: 12px;
          text-align: right;
          min-height: ${isMobile ? '80px' : '100px'};
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          word-break: break-all;
        }

        .display-memory {
          font-size: 12px;
          margin-bottom: 4px;
          min-height: 16px;
        }

        .display-operation {
          font-size: ${isMobile ? '14px' : '16px'};
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          min-height: 18px;
        }

        .display-value {
          font-size: ${isMobile ? '24px' : '28px'};
          font-weight: bold;
          font-family: 'Ubuntu Mono', monospace;
          line-height: 1.2;
          word-wrap: break-word;
        }

        .memory-buttons {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }

        .buttons-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .scientific-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 8px;
        }

        .calc-button {
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: ${isMobile ? '45px' : '60px'};
          font-size: ${isMobile ? '14px' : '18px'};
          padding: 4px 8px;
        }

        .calc-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .calc-button:active {
          transform: translateY(0);
        }

        .history-panel {
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .history-header h3 {
          margin: 0;
          color: ${currentTheme.buttonText};
          font-size: 16px;
        }

        .clear-history {
          padding: 4px 8px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .no-history {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 20px 16px;
          font-size: 14px;
        }

        .history-icon {
          font-size: 36px;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .history-item {
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          border-left: 3px solid ${currentTheme.operation};
          font-size: 12px;
        }

        .history-calculation {
          font-family: 'Ubuntu Mono', monospace;
          font-size: 12px;
          margin-bottom: 2px;
          color: ${currentTheme.buttonText};
          word-break: break-all;
        }

        .history-time {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
        }

        .calculator-footer {
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

        /* Responsive Design Mejorado */
        @media (max-width: 1024px) {
          .calculator-main {
            grid-template-columns: 1fr 250px;
          }
        }

        @media (max-width: 968px) {
          .calculator-main {
            grid-template-columns: 1fr;
          }
          
          .history-panel {
            height: 200px;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .calculator-container {
            padding: 12px;
          }
          
          .calculator-header {
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
          
          .buttons-grid,
          .scientific-buttons {
            gap: 6px;
          }
          
          .memory-buttons {
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
          }
          
          .calc-button {
            min-height: 40px;
            font-size: 13px;
          }
          
          .display-value {
            font-size: 22px;
          }

          .display-container {
            min-height: 70px;
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .calculator-container {
            padding: 8px;
          }

          .memory-buttons {
            grid-template-columns: repeat(5, 1fr);
          }
          
          .buttons-grid,
          .scientific-buttons {
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
          }
          
          .calc-button {
            min-height: 35px;
            font-size: 12px;
            padding: 2px 4px;
          }
          
          .display-value {
            font-size: 20px;
          }
          
          .footer-info {
            flex-direction: column;
            gap: 4px;
            font-size: 10px;
          }

          .app-title h1 {
            font-size: 16px;
          }

          .app-title p {
            font-size: 11px;
          }

          .mode-toggle,
          .theme-select {
            font-size: 11px;
            padding: 4px 8px;
          }

          .display-container {
            min-height: 60px;
            padding: 10px;
          }
        }

        @media (max-width: 360px) {
          .buttons-grid,
          .scientific-buttons {
            grid-template-columns: repeat(4, 1fr);
            gap: 3px;
          }
          
          .calc-button {
            min-height: 32px;
            font-size: 11px;
          }
          
          .display-value {
            font-size: 18px;
          }

          .memory-buttons {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Mejoras de usabilidad táctil */
        @media (hover: none) and (pointer: coarse) {
          .calc-button:hover {
            transform: none;
            box-shadow: none;
          }
          
          .calc-button:active {
            transform: scale(0.95);
            opacity: 0.8;
          }
        }

        /* Soporte para orientación landscape en móviles */
        @media (max-height: 500px) and (orientation: landscape) {
          .calculator-container {
            padding: 8px;
          }
          
          .calculator-main {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .buttons-grid,
          .scientific-buttons {
            grid-template-columns: repeat(8, 1fr);
          }
          
          .calc-button {
            min-height: 35px;
            font-size: 12px;
          }
          
          .display-container {
            min-height: 50px;
            padding: 8px;
          }
          
          .display-value {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default Calculator;