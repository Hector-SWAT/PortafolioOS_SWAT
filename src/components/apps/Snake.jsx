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
  
  const gameBoardRef = useRef(null);
  const directionRef = useRef(direction);

  // Los 3 mapas fáciles
  const maps = [
    // Mapa 1: Vacío (clásico)
    {
      name: "Clásico",
      walls: []
    },
    // Mapa 2: Marco simple
    {
      name: "Marco",
      walls: [
        // Bordes superiores e inferiores
        ...Array(20).fill().map((_, i) => ({ x: i, y: 0 })),
        ...Array(20).fill().map((_, i) => ({ x: i, y: 19 })),
        // Bordes izquierdo y derecho
        ...Array(18).fill().map((_, i) => ({ x: 0, y: i + 1 })),
        ...Array(18).fill().map((_, i) => ({ x: 19, y: i + 1 }))
      ]
    },
    // Mapa 3: Cuatro esquinas
    {
      name: "Esquinas",
      walls: [
        // Esquina superior izquierda
        { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 },
        // Esquina superior derecha
        { x: 14, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 6 },
        // Esquina inferior izquierda
        { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 5, y: 13 },
        // Esquina inferior derecha
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

    // Verificar que la comida no esté en la serpiente o en un muro
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

  // Controles del teclado
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
        if (directionRef.current !== 'DOWN') {
          directionRef.current = 'UP';
          setDirection('UP');
        }
        break;
      case 'ArrowDown':
        if (directionRef.current !== 'UP') {
          directionRef.current = 'DOWN';
          setDirection('DOWN');
        }
        break;
      case 'ArrowLeft':
        if (directionRef.current !== 'RIGHT') {
          directionRef.current = 'LEFT';
          setDirection('LEFT');
        }
        break;
      case 'ArrowRight':
        if (directionRef.current !== 'LEFT') {
          directionRef.current = 'RIGHT';
          setDirection('RIGHT');
        }
        break;
      default:
        break;
    }
  }, [gameOver, initGame]);

  // Efecto para el game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, speed]);

  // Efecto para los controles
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Efecto para enfocar el tablero
  useEffect(() => {
    if (gameBoardRef.current) {
      gameBoardRef.current.focus();
    }
  }, []);

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
          <div>Flechas para mover • Espacio para pausa</div>
        </div>
      </div>

      <div className="game-board">
        {renderBoard()}
      </div>

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
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 400px;
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

        .game-over {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          border: 2px solid #fc8181;
          backdrop-filter: blur(10px);
        }

        .game-over h2 {
          color: #fc8181;
          margin-bottom: 15px;
        }

        .restart-button {
          background: #68d391;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
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
          .game-header {
            width: 320px;
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .game-board {
            grid-template-columns: repeat(20, 15px);
            grid-template-rows: repeat(20, 15px);
          }

          .cell {
            width: 15px;
            height: 15px;
          }
        }

        @media (max-width: 480px) {
          .snake-game {
            padding: 10px;
          }

          .game-header {
            width: 280px;
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
        }
      `}</style>
    </div>
  );
};

export default Snake;