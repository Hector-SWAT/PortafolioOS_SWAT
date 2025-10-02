// components/apps/FlappyBird.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

const FlappyBird = ({ windowId }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Constantes del juego
  const GRAVITY = 0.5;
  const JUMP = -10;
  const PIPE_WIDTH = 50;
  const PIPE_GAP = 150;
  const PIPE_SPEED = 3;
  const BIRD_SIZE = 30;

  // Estado del juego
  const gameState = useRef({
    bird: { x: 100, y: 250, velocity: 0 },
    pipes: [],
    frameCount: 0
  });

  // Inicializar el juego
  const initGame = useCallback(() => {
    gameState.current = {
      bird: { x: 100, y: 250, velocity: 0 },
      pipes: [],
      frameCount: 0
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  // Saltar
  const jump = useCallback(() => {
    if (!gameStarted || gameOver) {
      initGame();
      return;
    }
    gameState.current.bird.velocity = JUMP;
  }, [gameStarted, gameOver, initGame]);

  // Detectar colisiones
  const checkCollision = (bird, pipe) => {
    return (
      bird.x + BIRD_SIZE > pipe.x &&
      bird.x < pipe.x + PIPE_WIDTH &&
      (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.topHeight + PIPE_GAP)
    );
  };

  // Generar tuberías
  const generatePipe = () => {
    const topHeight = Math.floor(Math.random() * 200) + 50;
    return {
      x: 400,
      topHeight,
      passed: false
    };
  };

  // Actualizar juego
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { bird, pipes, frameCount } = gameState.current;

    // Actualizar pájaro
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Generar nuevas tuberías
    if (frameCount % 100 === 0) {
      pipes.push(generatePipe());
    }

    // Actualizar tuberías y puntuación
    let newScore = score;
    pipes.forEach((pipe, index) => {
      pipe.x -= PIPE_SPEED;

      // Verificar si pasó la tubería
      if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
        pipe.passed = true;
        newScore += 1;
        setScore(newScore);
      }

      // Eliminar tuberías fuera de pantalla
      if (pipe.x + PIPE_WIDTH < 0) {
        pipes.splice(index, 1);
      }
    });

    // Verificar colisiones
    if (bird.y <= 0 || bird.y + BIRD_SIZE >= canvas.height) {
      setGameOver(true);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      return;
    }

    pipes.forEach(pipe => {
      if (checkCollision(bird, pipe)) {
        setGameOver(true);
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return;
      }
    });

    // Dibujar
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar suelo
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Dibujar pájaro
    ctx.fillStyle = gameOver ? '#FF0000' : '#FFFF00';
    ctx.fillRect(bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(bird.x + 20, bird.y + 10, 15, 10);

    // Dibujar tuberías
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
      // Tubería superior
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Tubería inferior
      ctx.fillRect(
        pipe.x,
        pipe.topHeight + PIPE_GAP,
        PIPE_WIDTH,
        canvas.height - pipe.topHeight - PIPE_GAP - 50
      );
    });

    // Dibujar puntuación
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${newScore}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);

    // Dibujar mensajes
    if (!gameStarted) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('FLAPPY BIRD', canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = '20px Arial';
      ctx.fillText('Click or Press Space to Start', canvas.width / 2, canvas.height / 2);
    }

    if (gameOver) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = '20px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText('Click or Press Space to Restart', canvas.width / 2, canvas.height / 2 + 30);
    }

    gameState.current.frameCount++;
  }, [score, highScore, gameStarted, gameOver]);

  // Bucle del juego
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    function gameLoop() {
      updateGame();
      if (gameStarted && !gameOver) {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, updateGame]);

  // Controles
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  const handleCanvasClick = () => {
    jump();
  };

  return (
    <div className="flappy-bird-app">
      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          onClick={handleCanvasClick}
          style={{
            border: '2px solid #333',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto'
          }}
        />
        
        <div className="game-controls">
          <div className="control-info">
            <p><strong>Controls:</strong> Click or Press SPACE to jump</p>
            <p><strong>Objective:</strong> Navigate through pipes without hitting them!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flappy-bird-app {
          width: 100%;
          height: 100%;
          background: #1a1a1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }

        .game-container {
          text-align: center;
          background: #2a2a2a;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .game-controls {
          margin-top: 15px;
          color: #fff;
        }

        .control-info {
          font-size: 14px;
          line-height: 1.4;
        }

        .control-info p {
          margin: 5px 0;
        }

        /* Efectos de hover para el canvas */
        canvas:hover {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          transition: box-shadow 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .flappy-bird-app {
            padding: 10px;
          }
          
          .game-container {
            padding: 15px;
          }
          
          canvas {
            width: 100%;
            max-width: 400px;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default FlappyBird;