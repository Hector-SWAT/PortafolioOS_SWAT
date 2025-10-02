// components/apps/Tetris.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

const Tetris = ({ windowId }) => {
  // Estados del juego
  const [board, setBoard] = useState(Array(20).fill().map(() => Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [nextPiece, setNextPiece] = useState(null);

  // Referencias
  const boardRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastDropTimeRef = useRef(0);

  // Piezas del Tetris con sus colores
  const TETROMINOS = {
    I: {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#00f5ff'
    },
    J: {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#0000ff'
    },
    L: {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#ffa500'
    },
    O: {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: '#ffff00'
    },
    S: {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      color: '#00ff00'
    },
    T: {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#800080'
    },
    Z: {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      color: '#ff0000'
    }
  };

  const TETROMINO_NAMES = Object.keys(TETROMINOS);

  // Función para crear una pieza aleatoria
  const createRandomPiece = useCallback(() => {
    const name = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    return {
      name,
      shape: TETROMINOS[name].shape,
      color: TETROMINOS[name].color
    };
  }, []);

  // Inicializar juego
  const initGame = useCallback(() => {
    const newBoard = Array(20).fill().map(() => Array(10).fill(0));
    setBoard(newBoard);
    setCurrentPiece(createRandomPiece());
    setNextPiece(createRandomPiece());
    setCurrentPosition({ x: 3, y: 0 });
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsPaused(false);
    lastDropTimeRef.current = Date.now();
  }, [createRandomPiece]);

  // Verificar colisión
  const checkCollision = useCallback((piece, position, board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const newX = position.x + x;
          const newY = position.y + y;

          // Verificar límites del tablero
          if (
            newX < 0 || 
            newX >= 10 || 
            newY >= 20 ||
            (newY >= 0 && board[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotar pieza
  const rotatePiece = useCallback((piece) => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Mover pieza
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || isPaused) return;

    let newPosition;
    switch (direction) {
      case 'left':
        newPosition = { ...currentPosition, x: currentPosition.x - 1 };
        break;
      case 'right':
        newPosition = { ...currentPosition, x: currentPosition.x + 1 };
        break;
      case 'down':
        newPosition = { ...currentPosition, y: currentPosition.y + 1 };
        break;
      default:
        return;
    }

    if (!checkCollision(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition);
    } else if (direction === 'down') {
      // Colisión al bajar - fijar la pieza
      placePiece();
    }
  }, [currentPiece, currentPosition, board, checkCollision]);

  // Rotar pieza actual
  const rotateCurrentPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, currentPosition, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, currentPosition, board, checkCollision, rotatePiece]);

  // Colocar pieza en el tablero
  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    
    // Colocar la pieza actual en el tablero
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = currentPosition.y + y;
          const boardX = currentPosition.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }

    // Verificar líneas completas
    let linesCleared = 0;
    for (let y = 19; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(10).fill(0));
        linesCleared++;
        y++; // Revisar la misma posición otra vez
      }
    }

    // Actualizar puntuación
    if (linesCleared > 0) {
      const points = [0, 40, 100, 300, 1200][linesCleared] * level;
      setScore(prev => prev + points);
      setLines(prev => prev + linesCleared);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
    }

    setBoard(newBoard);

    // Nueva pieza
    const newPiece = nextPiece;
    const newNextPiece = createRandomPiece();
    const newPosition = { x: 3, y: 0 };

    // Verificar game over
    if (checkCollision(newPiece, newPosition, newBoard)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setNextPiece(newNextPiece);
      setCurrentPosition(newPosition);
    }
  }, [currentPiece, currentPosition, board, nextPiece, checkCollision, createRandomPiece, level, lines]);

  // Caída automática
  const dropPiece = useCallback(() => {
    if (!gameOver && !isPaused) {
      movePiece('down');
    }
  }, [gameOver, isPaused, movePiece]);

  // Controles del teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) {
        if (e.key === ' ') {
          initGame();
        }
        return;
      }

      if (isPaused && e.key !== 'p') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotateCurrentPiece();
          break;
        case ' ':
          e.preventDefault();
          // Hard drop
          while (!checkCollision(currentPiece, { ...currentPosition, y: currentPosition.y + 1 }, board)) {
            setCurrentPosition(prev => ({ ...prev, y: prev.y + 1 }));
          }
          placePiece();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          initGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotateCurrentPiece, checkCollision, currentPiece, currentPosition, board, placePiece, gameOver, isPaused, initGame]);

  // Controles táctiles para móvil
  const handleTouchStart = useCallback((e) => {
    if (!boardRef.current) return;
    
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const startX = touch.clientX - rect.left;
    const startY = touch.clientY - rect.top;
    
    // Almacenar posición inicial para gestos
    boardRef.current.touchStartX = startX;
    boardRef.current.touchStartY = startY;
    boardRef.current.touchStartTime = Date.now();
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!boardRef.current || !boardRef.current.touchStartX) return;

    const touch = e.changedTouches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const endX = touch.clientX - rect.left;
    const endY = touch.clientY - rect.top;
    const deltaX = endX - boardRef.current.touchStartX;
    const deltaY = endY - boardRef.current.touchStartY;
    const deltaTime = Date.now() - boardRef.current.touchStartTime;

    // Determinar el gesto basado en el movimiento
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimiento horizontal
      if (Math.abs(deltaX) > 20) {
        if (deltaX > 0) {
          movePiece('right');
        } else {
          movePiece('left');
        }
      }
    } else {
      // Movimiento vertical
      if (Math.abs(deltaY) > 20) {
        if (deltaY > 0) {
          // Swipe down - hard drop
          while (!checkCollision(currentPiece, { ...currentPosition, y: currentPosition.y + 1 }, board)) {
            setCurrentPosition(prev => ({ ...prev, y: prev.y + 1 }));
          }
          placePiece();
        } else {
          // Swipe up - rotate
          rotateCurrentPiece();
        }
      } else if (deltaTime < 300) {
        // Tap - soft drop
        movePiece('down');
      }
    }

    // Limpiar datos del touch
    boardRef.current.touchStartX = null;
    boardRef.current.touchStartY = null;
  }, [movePiece, rotateCurrentPiece, checkCollision, currentPiece, currentPosition, board, placePiece]);

  // Bucle del juego
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const dropInterval = 1000 - (level - 1) * 50; // Aumenta velocidad con el nivel

      if (now - lastDropTimeRef.current > dropInterval && !gameOver && !isPaused) {
        dropPiece();
        lastDropTimeRef.current = now;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [dropPiece, gameOver, isPaused, level]);

  // Inicializar juego al montar
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Renderizar el tablero con la pieza actual
  const renderBoard = () => {
    const displayBoard = JSON.parse(JSON.stringify(board));

    // Dibujar la pieza actual
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  // Renderizar la siguiente pieza
  const renderNextPiece = () => {
    if (!nextPiece) return null;

    return (
      <div className="next-piece-preview">
        {nextPiece.shape.map((row, y) => (
          <div key={y} className="next-piece-row">
            {row.map((cell, x) => (
              <div
                key={x}
                className="next-piece-cell"
                style={{
                  backgroundColor: cell ? nextPiece.color : 'transparent',
                  border: cell ? `1px solid ${nextPiece.color}` : 'none'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const displayBoard = renderBoard();

  return (
    <div className="tetris-app">
      <div className="tetris-header">
        <h2>🧊 Tetris</h2>
        <div className="game-controls">
          <button onClick={() => setIsPaused(!isPaused)} className="control-button">
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={initGame} className="control-button">
            🔄
          </button>
        </div>
      </div>

      <div className="tetris-game-area">
        <div className="game-info">
          <div className="info-card">
            <h3>Puntuación</h3>
            <div className="info-value">{score}</div>
          </div>
          <div className="info-card">
            <h3>Líneas</h3>
            <div className="info-value">{lines}</div>
          </div>
          <div className="info-card">
            <h3>Nivel</h3>
            <div className="info-value">{level}</div>
          </div>
          <div className="info-card">
            <h3>Siguiente</h3>
            {renderNextPiece()}
          </div>
        </div>

        <div 
          className="game-board"
          ref={boardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {displayBoard.map((row, y) => (
            <div key={y} className="board-row">
              {row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="board-cell"
                  style={{
                    backgroundColor: cell || '#1a1a1a',
                    border: cell ? `1px solid ${cell}` : '1px solid #333'
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mobile-controls">
          <button 
            className="mobile-button left"
            onTouchStart={(e) => { e.preventDefault(); movePiece('left'); }}
          >
            ←
          </button>
          <button 
            className="mobile-button rotate"
            onTouchStart={(e) => { e.preventDefault(); rotateCurrentPiece(); }}
          >
            ↻
          </button>
          <button 
            className="mobile-button right"
            onTouchStart={(e) => { e.preventDefault(); movePiece('right'); }}
          >
            →
          </button>
          <button 
            className="mobile-button down"
            onTouchStart={(e) => { e.preventDefault(); movePiece('down'); }}
          >
            ↓
          </button>
        </div>
      </div>

      {(gameOver || isPaused) && (
        <div className="game-overlay">
          {gameOver ? (
            <div className="game-over">
              <h2>💀 Game Over</h2>
              <p>Puntuación final: {score}</p>
              <button onClick={initGame} className="restart-button">
                Jugar de Nuevo
              </button>
            </div>
          ) : (
            <div className="paused">
              <h2>⏸️ Pausado</h2>
              <button onClick={() => setIsPaused(false)} className="resume-button">
                Continuar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="game-instructions">
        <div className="instructions-section">
          <h4>🎮 Controles PC</h4>
          <p>← → : Mover</p>
          <p>↑ : Rotar</p>
          <p>↓ : Bajar</p>
          <p>Espacio: Caída rápida</p>
          <p>P: Pausar</p>
          <p>R: Reiniciar</p>
        </div>
        <div className="instructions-section">
          <h4>📱 Controles Móvil</h4>
          <p>Deslizar: Mover/Rotar</p>
          <p>Tap: Bajar rápido</p>
          <p>Botones: Controles directos</p>
        </div>
      </div>

      <style jsx>{`
        .tetris-app {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #e0e0e0;
          padding: var(--space-md);
          overflow-y: auto;
          font-family: 'JetBrains Mono', monospace;
          display: flex;
          flex-direction: column;
        }

        .tetris-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-sm);
          border-bottom: 2px solid var(--parrot-green);
        }

        .tetris-header h2 {
          color: var(--primary-cyan);
          margin: 0;
          font-size: var(--text-xl);
        }

        .game-controls {
          display: flex;
          gap: var(--space-sm);
        }

        .control-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          padding: var(--space-sm);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: var(--text-lg);
        }

        .control-button:hover {
          background: var(--parrot-green);
          transform: scale(1.1);
        }

        .tetris-game-area {
          display: flex;
          gap: var(--space-lg);
          flex: 1;
          min-height: 0;
        }

        .game-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          min-width: 120px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          text-align: center;
        }

        .info-card h3 {
          color: var(--text-secondary);
          font-size: var(--text-sm);
          margin: 0 0 var(--space-xs) 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          color: var(--primary-cyan);
          font-size: var(--text-lg);
          font-weight: bold;
        }

        .next-piece-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .next-piece-row {
          display: flex;
          gap: 2px;
        }

        .next-piece-cell {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .game-board {
          display: flex;
          flex-direction: column;
          border: 3px solid var(--parrot-green);
          border-radius: var(--radius-md);
          background: #0a0a0a;
          touch-action: none;
          flex: 1;
          max-width: 300px;
          max-height: 600px;
        }

        .board-row {
          display: flex;
          flex: 1;
        }

        .board-cell {
          flex: 1;
          margin: 1px;
          border-radius: 2px;
          transition: all 0.1s ease;
        }

        .mobile-controls {
          display: none;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: var(--space-sm);
          padding: var(--space-md);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          min-width: 150px;
        }

        .mobile-button {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: var(--text-primary);
          border-radius: var(--radius-md);
          font-size: var(--text-lg);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          touch-action: manipulation;
          user-select: none;
        }

        .mobile-button:active {
          background: var(--parrot-green);
          transform: scale(0.95);
        }

        .mobile-button.left { grid-column: 1; grid-row: 2; }
        .mobile-button.rotate { grid-column: 2; grid-row: 1; }
        .mobile-button.right { grid-column: 3; grid-row: 2; }
        .mobile-button.down { grid-column: 2; grid-row: 2; }

        .game-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .game-over, .paused {
          background: var(--parrot-darker);
          border: 3px solid var(--parrot-green);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          text-align: center;
          max-width: 300px;
          width: 90%;
        }

        .game-over h2, .paused h2 {
          color: var(--primary-cyan);
          margin-bottom: var(--space-md);
        }

        .restart-button, .resume-button {
          background: var(--parrot-green);
          color: white;
          border: none;
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: var(--space-md);
          width: 100%;
        }

        .restart-button:hover, .resume-button:hover {
          background: #27ca3f;
          transform: translateY(-2px);
        }

        .game-instructions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          margin-top: var(--space-md);
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .instructions-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
        }

        .instructions-section h4 {
          color: var(--primary-cyan);
          margin: 0 0 var(--space-sm) 0;
          font-size: var(--text-sm);
        }

        .instructions-section p {
          color: var(--text-secondary);
          margin: var(--space-xs) 0;
          font-size: var(--text-xs);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .tetris-app {
            padding: var(--space-sm);
          }

          .tetris-game-area {
            flex-direction: column;
            align-items: center;
          }

          .game-info {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            min-width: auto;
            width: 100%;
          }

          .info-card {
            flex: 1;
            min-width: 100px;
          }

          .game-board {
            max-width: 250px;
            max-height: 500px;
          }

          .mobile-controls {
            display: grid;
            width: 100%;
            max-width: 250px;
          }

          .game-instructions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .tetris-header {
            flex-direction: column;
            gap: var(--space-sm);
            text-align: center;
          }

          .game-board {
            max-width: 200px;
            max-height: 400px;
          }

          .info-card {
            min-width: 80px;
            padding: var(--space-sm);
          }

          .info-value {
            font-size: var(--text-base);
          }

          .mobile-controls {
            max-width: 200px;
          }

          .mobile-button {
            min-height: 40px;
            font-size: var(--text-base);
          }
        }

        @media (max-width: 320px) {
          .game-board {
            max-width: 180px;
            max-height: 360px;
          }

          .mobile-controls {
            max-width: 180px;
          }
        }

        /* Landscape orientation for mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .tetris-game-area {
            flex-direction: row;
          }

          .game-info {
            flex-direction: column;
            min-width: 100px;
          }

          .game-board {
            max-height: 300px;
            max-width: 150px;
          }

          .mobile-controls {
            display: none;
          }

          .game-instructions {
            display: none;
          }
        }

        /* High DPI screens */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .board-cell {
            margin: 0.5px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .board-cell,
          .control-button,
          .mobile-button,
          .restart-button,
          .resume-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Tetris;