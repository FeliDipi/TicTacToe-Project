import "./App.css";
import { useEffect, useState } from "react";

import confetti from "canvas-confetti";

import { TURNS } from "./constants.js";

import { checkWinner, checkEndGame } from "./logic/boardCheck.js";

import { WinnerModal } from "./Components/WinnerModal.jsx";
import { Board } from "./Components/Board.jsx";
import { TurnIndicator } from "./Components/TurnIndicator.jsx";

const App = () =>
{
    const [board, setBoard] = useState(()=>
    {
        const boardFromStorage = window.localStorage.getItem("board");
        return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
    });

    const [turn, setTurn] = useState(()=>
    {
        const turnFromStorage = window.localStorage.getItem("turn");
        return turnFromStorage ?? TURNS.X;
    });

    const [winner, setWinner] = useState(null);

    const updateBoard = (index) =>
    {
        if(board[index] || winner) return;

        /* ... spread operator (clonacion superficial), es importante siempre tratas las variables utilizadas 
        por los hooks como inmutables, en su defecto crear nuevas a partir de ellas, para luego reemplazar*/

        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);

        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);

        const newWinner = checkWinner(newBoard);
        if(newWinner)
        {
            confetti();
            setWinner(newWinner);
        }
        else if(checkEndGame(newBoard))
        {
            setWinner(false);
        }
    }

    const resetGame = () =>
    {
        setBoard(Array(9).fill(null));
        setTurn(TURNS.X);
        setWinner(null);

        window.localStorage.removeItem("board");
        window.localStorage.removeItem("turn");
    }

    useEffect(()=>
    {
        window.localStorage.setItem("board", JSON.stringify(board));
        window.localStorage.setItem("turn", turn);
    },
    [turn])

    return (
        <main className="board">
            <h1>Tic tac toe</h1>
            <button onClick={resetGame}>Empezar de nuevo</button>

            <Board board={board} updateBoard={updateBoard}/>

            <TurnIndicator turn={turn}/>

            <WinnerModal winner={winner} resetGame={resetGame}/>

        </main>
    )
};

export default App;