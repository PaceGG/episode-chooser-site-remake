import React, { useEffect, useState } from "react";
import axios from "axios";
import AddGameModal from "./AddGameModal";
import EditorWindow from "./EditorWindow";

export interface GameSeries {
  id: number;
  name: string;
  games: Game[];
}

export interface Game {
  name: string;
  status: string;
  time: number;
  episodesCount: number;
  playlistLink: string;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<GameSeries[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3003/games")
      .then((response) => setGames(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const [showAddGameModal, setShowAddGameModal] = useState(false);

  const processGame = (game: GameSeries) => {
    if (game.games.length === 1) {
      return (
        <li>
          {formatGame(game.games[0])} <EditorWindow game={game.games[0]} />
        </li>
      );
    } else {
      return (
        <details>
          <summary>{game.name}</summary>
          <ul>
            {game.games.map((game) => (
              <div>
                <li>
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
          <AddGameModal setModalVisible={setShowAddGameModal} />
        )}
      </div>
      <ul>{games.map((game) => processGame(game))}</ul>
    </div>
  );
};

export default GameList;
