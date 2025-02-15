import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import AddGameModal from "./AddGameModal";
import EditorWindow from "./EditorWindow";

export interface GameSeries {
  id: string;
  name: string;
}

export interface Game {
  id: string;
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

  const fetchGames = async () => {
    const seriesSnapshot = await getDocs(collection(db, "gameSeries"));
    const seriesData = seriesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as GameSeries)
    );
    setGameSeries(seriesData);

    const gameSnapshot = await getDocs(collection(db, "game"));
    const gameData = gameSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Game)
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
    } else {
      return (
        <details key={series.id}>
          <summary>{series.name}</summary>
          <ul>
            {seriesGames.map((game) => (
              <li key={game.id}>
                {formatGame(game)} <EditorWindow game={game} />
              </li>
            ))}
          </ul>
        </details>
      );
    }
  };

  const handleRightClick = () => {};

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
