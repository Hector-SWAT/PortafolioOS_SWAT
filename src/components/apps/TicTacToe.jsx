// components/apps/TicTacToe.jsx
import { useState, useEffect } from 'react';

const TicTacToe = ({ windowId }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
      [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const getStatus = () => {
    if (winner) {
      return `🎉 Ganador: ${winner}`;
    } else if (board.every(square => square !== null)) {
      return '🤝 Empate!';
    } else {
      return `Turno de: ${isXNext ? 'X' : 'O'}`;
    }
  };

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setScore(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
    } else if (board.every(square => square !== null)) {
      setScore(prev => ({
        ...prev,
        ties: prev.ties + 1
      }));
    }
  }, [board]);

  const renderSquare = (index) => {
    const value = board[index];
    let displayValue = '';
    let className = 'square';

    if (value === 'X') {
      displayValue = '❌';
      className += ' x';
    } else if (value === 'O') {
      displayValue = '⭕';
      className += ' o';
    }

    return (
      <button
        className={className}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index]}
      >
        {displayValue}
      </button>
    );
  };

  return (
    <div className="tictactoe">
      <div className="game-header">
        <h2>🎮 Tic Tac Toe</h2>
        <div className="game-status">{getStatus()}</div>
      </div>

      <div className="score-board">
        <div className="score-item">
          <span className="score-label">❌ X:</span>
          <span className="score-value">{score.X}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Empates:</span>
          <span className="score-value">{score.ties}</span>
        </div>
        <div className="score-item">
          <span className="score-label">⭕ O:</span>
          <span className="score-value">{score.O}</span>
        </div>
      </div>

      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>

      <div className="game-controls">
        <button className="reset-button" onClick={resetGame}>
          🔄 Nuevo Juego
        </button>
        <button className="reset-score-button" onClick={() => setScore({ X: 0, O: 0, ties: 0 })}>
          🎯 Reiniciar Marcador
        </button>
      </div>

      // En TicTacToe.jsx, actualiza los estilos:
<style jsx>{`
  .tictactoe {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 3vh, 30px) clamp(10px, 3vw, 20px);
    font-family: 'Arial', sans-serif;
    overflow: auto;
  }

  .game-header h2 {
    color: white;
    margin: 0 0 clamp(8px, 2vh, 12px) 0;
    font-size: clamp(18px, 5vw, 28px);
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    text-align: center;
  }

  .game-status {
    color: white;
    font-size: clamp(14px, 4vw, 18px);
    font-weight: bold;
    background: rgba(255,255,255,0.2);
    padding: clamp(6px, 1.5vh, 10px) clamp(12px, 3vw, 20px);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    text-align: center;
  }

  .score-board {
    display: flex;
    gap: clamp(10px, 3vw, 20px);
    margin-bottom: clamp(15px, 4vh, 30px);
    background: rgba(255,255,255,0.1);
    padding: clamp(10px, 2vh, 15px);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    flex-wrap: wrap;
    justify-content: center;
  }

  .score-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    min-width: 60px;
  }

  .score-label {
    font-size: clamp(12px, 3vw, 14px);
    margin-bottom: clamp(3px, 1vh, 5px);
    opacity: 0.8;
  }

  .score-value {
    font-size: clamp(18px, 5vw, 24px);
    font-weight: bold;
  }

  .game-board {
    background: rgba(255,255,255,0.1);
    padding: clamp(10px, 2vh, 20px);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    margin-bottom: clamp(15px, 4vh, 20px);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .board-row {
    display: flex;
    gap: 2px;
  }

  .square {
    width: clamp(50px, 20vw, 100px);
    height: clamp(50px, 20vw, 100px);
    background: rgba(255,255,255,0.9);
    border: 2px solid rgba(255,255,255,0.3);
    font-size: clamp(20px, 8vw, 36px);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .game-controls {
    display: flex;
    gap: clamp(8px, 2vw, 15px);
    flex-wrap: wrap;
    justify-content: center;
  }

  .reset-button, .reset-score-button {
    background: rgba(255,255,255,0.9);
    border: none;
    padding: clamp(8px, 2vh, 12px) clamp(12px, 3vw, 24px);
    border-radius: 25px;
    font-size: clamp(12px, 3vw, 14px);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #333;
    white-space: nowrap;
  }

  /* Media Queries específicas para Tic-Tac-Toe */
  @media (max-width: 480px) {
    .tictactoe {
      justify-content: flex-start;
      padding-top: 20px;
    }
    
    .score-board {
      gap: 15px;
    }
    
    .score-item {
      min-width: 50px;
    }
  }

  @media (max-height: 600px) {
    .tictactoe {
      padding: 10px;
      justify-content: flex-start;
    }
    
    .game-board {
      margin-bottom: 10px;
    }
    
    .score-board {
      margin-bottom: 15px;
    }
  }

  @media (orientation: landscape) and (max-height: 500px) {
    .tictactoe {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
    
    .game-header {
      width: 100%;
      margin-bottom: 0;
    }
    
    .score-board {
      order: 3;
      margin-bottom: 0;
    }
    
    .game-controls {
      order: 4;
    }
  }
`}</style>
    </div>
  );
};

export default TicTacToe;