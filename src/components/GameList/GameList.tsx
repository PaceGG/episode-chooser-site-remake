import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import AddGameModal from "./AddGameModal";
import EditorWindow from "./EditorWindow";

export interface GameSeries {
<<<<<<< HEAD
  id: string;
=======
  id: number;
>>>>>>> ed1eb63de0aaa67adaa0163462f4c82bc9af2e7a
  name: string;
}

export interface Game {
<<<<<<< HEAD
  id: string;
=======
>>>>>>> ed1eb63de0aaa67adaa0163462f4c82bc9af2e7a
  name: string;
  seriesId: string;
  status: string;
  time: number;
  episodesCount: number;
  playlistLink: string;
}

const GameList: React.FC = () => {
  const [gameSeries, setGameSeries] = useState<GameSeries[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [showAddGameModal, setShowAddGameModal] = useState(false);

<<<<<<< HEAD
  const fetchGames = async () => {
    const seriesSnapshot = await getDocs(collection(db, "gameSeries"));
    const seriesData = seriesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as GameSeries)
    );
    setGameSeries(seriesData);

    const gameSnapshot = await getDocs(collection(db, "game"));
    const gameData = gameSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data } as Game)
    );
    setGames(gameData);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const processSeries = (series: GameSeries) => {
    const seriesGames = games.filter((game) => game.seriesId === series.id);
    if (seriesGames.length === 1) {
      return <li key={seriesGames[0].id}>{formatGame(seriesGames[0])}</li>;
=======
  const processGame = (game: GameSeries) => {
    if (game.games.length === 1) {
      return (
        <li>
          {formatGame(game.games[0])} <EditorWindow game={game.games[0]} />
        </li>
      );
>>>>>>> ed1eb63de0aaa67adaa0163462f4c82bc9af2e7a
    } else {
      return (
        <details key={series.id}>
          <summary>{series.name}</summary>
          <ul>
<<<<<<< HEAD
            {seriesGames.map((game) => (
              <div>
                <li key={game.id}>
=======
            {game.games.map((game) => (
              <div>
                <li>
>>>>>>> ed1eb63de0aaa67adaa0163462f4c82bc9af2e7a
                  {formatGame(game)} <EditorWindow game={game} />
                </li>
              </div>
            ))}
          </ul>
        </details>
      );
    }
  };

  const handleRightCLick = () => {};

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  const formatGame = (game: Game) => {
    return (
      <>
        {game.name}
        {game.episodesCount !== 0 ? ` - ${game.episodesCount}` : ``}
        {game.time !== 0 ? ` - ${formatTime(game.time)}` : ``}
      </>
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => setShowAddGameModal(true)}>Add Game</button>
        {showAddGameModal && (
          <AddGameModal
            setModalVisible={setShowAddGameModal}
            setGameSeries={setGameSeries}
            setGames={setGames}
          />
        )}
      </div>
      <ul>{gameSeries.map((series) => processSeries(series))}</ul>
    </div>
  );
};

export default GameList;
