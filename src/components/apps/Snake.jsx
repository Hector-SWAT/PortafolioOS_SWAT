import { useState, useEffect, useCallback, useRef } from 'react';

const Snake = ({ windowId }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  const [isPaused, setIsPaused] = useState(false);
  const [currentMap, setCurrentMap] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const gameBoardRef = useRef(null);
  const directionRef = useRef(direction);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Los 3 mapas fáciles
  const maps = [
    {
      name: "Clásico",
      walls: []
    },
    {
      name: "Marco",
      walls: [
        ...Array(20).fill().map((_, i) => ({ x: i, y: 0 })),
        ...Array(20).fill().map((_, i) => ({ x: i, y: 19 })),
        ...Array(18).fill().map((_, i) => ({ x: 0, y: i + 1 })),
        ...Array(18).fill().map((_, i) => ({ x: 19, y: i + 1 }))
      ]
    },
    {
      name: "Esquinas",
      walls: [
        { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 },
        { x: 14, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 6 },
        { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 5, y: 13 },
        { x: 14, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 13 }
      ]
    }
  ];

  // Generar comida en posición aleatoria que no colisione
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };

    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    const isOnWall = maps[currentMap].walls.some(wall =>
      wall.x === newFood.x && wall.y === newFood.y
    );

    if (isOnSnake || isOnWall) {
      return generateFood();
    }

    return newFood;
  }, [snake, currentMap]);

  // Cambiar de mapa cuando se come una manzana
  const changeMap = useCallback(() => {
    setCurrentMap(prev => (prev + 1) % maps.length);
  }, []);

  // Inicializar juego
  const initGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setSpeed(150);
    setIsPaused(false);
    setFood(generateFood());
  }, [generateFood]);

  // Mover serpiente
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
        default: break;
      }

      // Verificar colisión con bordes
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true);
        return prevSnake;
      }

      // Verificar colisión con sí misma
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      // Verificar colisión con muros
      if (maps[currentMap].walls.some(wall => wall.x === head.x && wall.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Verificar si comió la comida
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => {
          const newScore = prev + 1;
          // Aumentar velocidad cada 5 puntos
          if (newScore % 5 === 0 && speed > 50) {
            setSpeed(prevSpeed => prevSpeed - 10);
          }
          // Cambiar de mapa cada vez que come
          changeMap();
          return newScore;
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, generateFood, speed, currentMap, changeMap]);

  // Cambiar dirección (usado por botones táctiles)
  const changeDirection = useCallback((newDirection) => {
    if (gameOver || isPaused) return;

    // Prevenir movimiento inverso
    if (
      (newDirection === 'UP' && directionRef.current !== 'DOWN') ||
      (newDirection === 'DOWN' && directionRef.current !== 'UP') ||
      (newDirection === 'LEFT' && directionRef.current !== 'RIGHT') ||
      (newDirection === 'RIGHT' && directionRef.current !== 'LEFT')
    ) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  }, [gameOver, isPaused]);

  // Controles del teclado (solo para PC)
  const handleKeyDown = useCallback((e) => {
    if (gameOver) {
      if (e.key === ' ' || e.key === 'Enter') {
        initGame();
      }
      return;
    }

    if (e.key === ' ') {
      setIsPaused(prev => !prev);
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        changeDirection('UP');
        break;
      case 'ArrowDown':
        changeDirection('DOWN');
        break;
      case 'ArrowLeft':
        changeDirection('LEFT');
        break;
      case 'ArrowRight':
        changeDirection('RIGHT');
        break;
      default:
        break;
    }
  }, [gameOver, initGame, changeDirection]);

  // Efecto para el game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, speed]);

  // Efecto para los controles de teclado (solo PC)
  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isMobile]);

  // Efecto para enfocar el tablero
  useEffect(() => {
    if (gameBoardRef.current && !isMobile) {
      gameBoardRef.current.focus();
    }
  }, [isMobile]);

  // Renderizar el tablero
  const renderBoard = () => {
    const board = [];
    
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isWall = maps[currentMap].walls.some(wall => wall.x === x && wall.y === y);
        const isHead = snake[0].x === x && snake[0].y === y;

        let cellClass = 'cell';
        if (isHead) cellClass += ' head';
        else if (isSnake) cellClass += ' snake';
        else if (isFood) cellClass += ' food';
        else if (isWall) cellClass += ' wall';

        board.push(
          <div key={`${x}-${y}`} className={cellClass} />
        );
      }
    }
    
    return board;
  };

  // Botones de control para móvil
  const MobileControls = () => (
    <div className="mobile-controls">
      <div className="controls-row">
        <button 
          className="control-btn up-btn"
          onClick={() => changeDirection('UP')}
          disabled={gameOver || isPaused}
        >
          ↑
        </button>
      </div>
      <div className="controls-row">
        <button 
          className="control-btn left-btn"
          onClick={() => changeDirection('LEFT')}
          disabled={gameOver || isPaused}
        >
          ←
        </button>
        <div className="control-spacer"></div>
        <button 
          className="control-btn right-btn"
          onClick={() => changeDirection('RIGHT')}
          disabled={gameOver || isPaused}
        >
          →
        </button>
      </div>
      <div className="controls-row">
        <button 
          className="control-btn down-btn"
          onClick={() => changeDirection('DOWN')}
          disabled={gameOver || isPaused}
        >
          ↓
        </button>
      </div>
    </div>
  );

  return (
    <div className="snake-game" ref={gameBoardRef} tabIndex={0}>
      <div className="game-header">
        <div className="score-board">
          <div className="score">Puntos: {score}</div>
          <div className="map">Mapa: {maps[currentMap].name}</div>
          <div className="speed">Velocidad: {Math.floor((150 - speed) / 10) + 1}</div>
        </div>
        <div className="controls-info">
          {isPaused && <div className="paused">PAUSADO</div>}
          <div>
            {isMobile ? (
              "Usa los botones para mover"
            ) : (
              "Flechas para mover • Espacio para pausa"
            )}
          </div>
        </div>
      </div>

      <div className="game-board">
        {renderBoard()}
      </div>

      {/* Botones de acción */}
      <div className="action-buttons">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="action-btn pause-btn"
          disabled={gameOver}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
        <button 
          onClick={initGame}
          className="action-btn restart-btn"
        >
          🔄
        </button>
      </div>

      {/* Controles móviles */}
      {isMobile && <MobileControls />}

      {gameOver && (
        <div className="game-over">
          <h2>¡Game Over!</h2>
          <p>Puntuación final: {score}</p>
          <button onClick={initGame} className="restart-button">
            Jugar de nuevo
          </button>
        </div>
      )}

      <style jsx>{`
        .snake-game {
          width: 100%;
          height: 100%;
          background: #1a202c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Ubuntu', sans-serif;
          color: white;
          outline: none;
          padding: 20px;
          box-sizing: border-box;
          position: relative;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 400px;
          margin-bottom: 20px;
          background: #2d3748;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #4a5568;
        }

        .score-board {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .score, .map, .speed {
          font-size: 14px;
          font-weight: 500;
        }

        .score {
          color: #68d391;
        }

        .map {
          color: #f6e05e;
        }

        .speed {
          color: #fc8181;
        }

        .controls-info {
          text-align: right;
          font-size: 12px;
          color: #a0aec0;
        }

        .paused {
          color: #f6ad55;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .game-board {
          display: grid;
          grid-template-columns: repeat(20, 20px);
          grid-template-rows: repeat(20, 20px);
          gap: 1px;
          background: #2d3748;
          border: 2px solid #4a5568;
          border-radius: 4px;
          padding: 2px;
          margin-bottom: 20px;
        }

        .cell {
          width: 20px;
          height: 20px;
          background: #4a5568;
          border-radius: 2px;
        }

        .snake {
          background: #68d391;
        }

        .head {
          background: #38a169;
        }

        .food {
          background: #fc8181;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }

        .wall {
          background: #718096;
        }

        /* Botones de acción */
        .action-buttons {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .action-btn {
          background: #4a5568;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover:not(:disabled) {
          background: #718096;
          transform: scale(1.1);
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Controles móviles */
        .mobile-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .controls-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
        }

        .control-btn {
          background: #4a5568;
          border: none;
          border-radius: 12px;
          width: 70px;
          height: 70px;
          font-size: 28px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          touch-action: manipulation;
        }

        .control-btn:hover:not(:disabled) {
          background: #718096;
          transform: scale(1.05);
        }

        .control-btn:active {
          background: #38a169;
          transform: scale(0.95);
        }

        .control-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .control-spacer {
          width: 70px;
        }

        .up-btn, .down-btn {
          background: #68d391;
        }

        .left-btn, .right-btn {
          background: #f6ad55;
        }

        .game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.95);
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          border: 2px solid #fc8181;
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .game-over h2 {
          color: #fc8181;
          margin-bottom: 15px;
        }

        .restart-button {
          background: #68d391;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          margin-top: 15px;
          transition: background 0.2s;
        }

        .restart-button:hover {
          background: #38a169;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .snake-game {
            padding: 15px 10px;
            justify-content: flex-start;
          }

          .game-header {
            flex-direction: column;
            gap: 10px;
            text-align: center;
            max-width: 320px;
            padding: 12px;
          }

          .game-board {
            grid-template-columns: repeat(20, 15px);
            grid-template-rows: repeat(20, 15px);
            margin-bottom: 15px;
          }

          .cell {
            width: 15px;
            height: 15px;
          }

          .control-btn {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }

          .control-spacer {
            width: 60px;
          }

          .action-btn {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .snake-game {
            padding: 10px 5px;
          }

          .game-header {
            max-width: 280px;
            padding: 10px;
          }

          .game-board {
            grid-template-columns: repeat(20, 12px);
            grid-template-rows: repeat(20, 12px);
          }

          .cell {
            width: 12px;
            height: 12px;
          }

          .control-btn {
            width: 50px;
            height: 50px;
            font-size: 20px;
            border-radius: 10px;
          }

          .control-spacer {
            width: 50px;
          }

          .action-btn {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
        }

        @media (max-width: 320px) {
          .game-board {
            grid-template-columns: repeat(20, 10px);
            grid-template-rows: repeat(20, 10px);
          }

          .cell {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Snake;