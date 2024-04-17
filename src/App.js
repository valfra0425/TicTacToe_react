import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner){
    status = "O vencedor é: " + winner;
  }
  else if (!squares.includes(null)) {
    status = "Empate"
  }
  else {
    status = "O próximo é: " + ((xIsNext) ? "X" : "O")
  }

  function handleClick(i){
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext){
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null;
  }

  return (
    // Nessa parte do código estou utilizando 2 interações para desenhar o tabuleiro
    // Importante se atentar ao uso de () quando for escrever html e o {} quando for escrever instruções de código
    <>
    <div className="status">{status}</div>
    {[0, 1, 2].map(row => (
      <div className="board-row" key={row}>
        {[0, 1, 2].map(col => {
          const squareIndex = row * 3 + col;
          return (
            <Square
              key={squareIndex}
              value={squares[squareIndex]}
              onSquareClick={() => handleClick(squareIndex)}
            />
          );
        })}
      </div>
    ))}
  </>
  );
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0 && move != currentMove) {
      description = 'Vá para o movimento #' + move;
    } else if (move > 0 && move == currentMove)  {
      description = 'Você está no movimento #' + move;
    } else if (move == 0 && 0 == currentMove){
      description = 'Faça algum movimento par ao jogo começar';
    } else {
      description = 'Vá para o início do jogo';
    }
    return (
      <li key={move}>
        {(move == currentMove ? <p>{description}</p> : <button onClick={() => jumpTo(move)}>{description}</button>)}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}