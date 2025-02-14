import { useState } from "react";
import { Game } from "./GameList";

interface EditorWindowProps {
  game: Game;
}

const EditorWindow: React.FC<EditorWindowProps> = ({ game }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("none");
  const [playlistUrl, setPlaylistUrl] = useState<string>("");

  const handleStatus = (value: string) => {
    setSelectedStatus((prev) => (prev === value ? "none" : value));
  };

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistUrl(e.target.value);
  };

  const handleConfirm = () => {};

  return (
    <div>
      <div>
        {["complete", "bad", "inProcess", "wait"].map((option) => (
          <button key={option} onClick={() => handleStatus(option)}>
            {option}
          </button>
        ))}
      </div>
      <div>
        <input type="url" value={playlistUrl} onChange={handleUrl} />
      </div>
      <div>
        <button>Confirm</button>
      </div>
    </div>
  );
};

export default EditorWindow;
