import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSocket } from '../../context/SocketContext';
import { TicTacToeBox } from '../../components';
import { winningCombinations } from '../../consts/ticTacToe';

export const TicTacToePage = () => {
  const [game, setGame] = useState(Array(9).fill(''));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [xo, setXO] = useState('X');
  const [player, setPlayer] = useState('');
  const [hasOpponent, setHasOpponent] = useState(false);
  const [share, setShare] = useState(false);

  const { socket } = useSocket();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsRoom = params.get('room');
  const [room, setRoom] = useState(paramsRoom);
  const [turnData, setTurnData] = useState<boolean>(false);

  const sendTurn = (index:number) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit('reqTurn', JSON.stringify({ index, value: xo, room }));
    }
  };

  const sendRestart = () => {
    socket.emit('reqRestart', JSON.stringify({ room }));
  };

  const restart = () => {
    setGame(Array(9).fill(''));
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  useEffect(() => {
    winningCombinations.forEach((c) => {
      if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== '') {
        setWinner(true);
      }
    });

    if (turnNumber === 0) {
      setMyTurn(xo === 'X' ? true : false);
    }
  }, [game, turnNumber, xo]);

  useEffect(() => {
    socket.on('playerTurn', (json:boolean) => {
      setTurnData(json);
    });

    socket.on('restart', () => {
      restart();
    });

    socket.on('opponent_joined', () => {
      setHasOpponent(true);
      setShare(false);    
    });
  }, []);

  useEffect(() => {
    console.log(turnData)
    if (turnData) {
      const data = parseInt(turnData.toString());
      console.log(data) 
      let g = [...game];
      if (!g[data] && !winner) {    
        g[data] = data;
        setGame(g);
        setTurnNumber(turnNumber + 1);
        setTurnData(false);
        setMyTurn(!myTurn);
        setPlayer(data.toString());
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn]);

  useEffect(() => {
    if (paramsRoom) {
      // means you are player 2
      setXO('O');
      socket.emit('join', paramsRoom);
      setRoom(paramsRoom);
      setMyTurn(false);
    } else {
      // means you are player 1
      const newRoomName = random();
      socket.emit('create', newRoomName);
      setRoom(newRoomName);
      setMyTurn(true);
    }
  }, [paramsRoom]);

  return (
    <div className="container">
      Room: {room}
      <button className="btn" onClick={() => setShare(share => !share)}>
        Share
      </button>
      {share ? (
        <>
          <br />
          <br />
          Share link: <input type="text" value={`${window.location.href}?room=${room}`} readOnly />
        </>
      ) : null}
      <br />
      <br />
      Turn: {myTurn ? 'You' : 'Opponent'}
      <br />
      {hasOpponent ? '' : 'Waiting for opponent...'}
      <p>
        {winner || turnNumber === 9 ? (
          <button className="btn" onClick={sendRestart}>
            Restart
          </button>
        ) : null}
        {winner ? <span>We have a winner: {player}</span> : turnNumber === 9 ? <span>It's a tie!</span> : <br />}
      </p>
      <div className="row">
        <TicTacToeBox index={0} turn={sendTurn} value={game[0]} />
        <TicTacToeBox index={1} turn={sendTurn} value={game[1]} />
        <TicTacToeBox index={2} turn={sendTurn} value={game[2]} />
      </div>
      <div className="row">
        <TicTacToeBox index={3} turn={sendTurn} value={game[3]} />
        <TicTacToeBox index={4} turn={sendTurn} value={game[4]} />
        <TicTacToeBox index={5} turn={sendTurn} value={game[5]} />
      </div>
      <div className="row">
        <TicTacToeBox index={6} turn={sendTurn} value={game[6]} />
        <TicTacToeBox index={7} turn={sendTurn} value={game[7]} />
        <TicTacToeBox index={8} turn={sendTurn} value={game[8]} />
      </div>
    </div>
  );
}


const random = () => {
  return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};
