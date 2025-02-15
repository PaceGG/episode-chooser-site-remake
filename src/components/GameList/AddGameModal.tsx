import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { GameSeries, Game } from "./GameList";

interface Input {
  id: number;
  value: string;
}

interface AddGameModalProps {
  setModalVisible: (visible: boolean) => void;
  setGameSeries: React.Dispatch<React.SetStateAction<GameSeries[]>>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

const AddGameModal: React.FC<AddGameModalProps> = ({
  setModalVisible,
  setGameSeries,
  setGames,
}) => {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [mainGameName, setMainGameName] = useState<string>("");
  const [history, setHistory] = useState<Input[][]>([]); // История для отката
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [currentMaskType, setCurrentMaskType] = useState<number>(0);

  const handleMainGameNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainGameName(e.target.value);
  };

  const addInput = () => {
    setInputs((prevInput) => {
      const newInputs = [...prevInput, { id: Date.now(), value: "" }];
      setHistory((prevHistory) => [...prevHistory, prevInput]); // Сохраняем состояние перед изменением
      return newInputs;
    });
  };

  const removeInput = (id: number) => {
    setInputs((prevInputs) => {
      const newInputs = prevInputs.filter((input) => input.id !== id);
      setHistory((prevHistory) => [...prevHistory, prevInputs]); // Сохраняем состояние перед удалением
      return newInputs;
    });
    inputRefs.current.splice(inputRefs.current.length, 1);
  };

  const clearFields = () => {
    setInputs(
      (prevInputs) => prevInputs.map((input) => ({ ...input, value: "" })) // Устанавливаем значение в пустую строку для каждого поля
    );
  };

  const maskTypes = ['": "', '" "', '"pre"', '"i"', '"i: "', '"I"', '"I: "'];

  const applyMask = (maskType: number, indexToApply?: number) => {
    setInputs((prevInputs) => {
      const newInputs = prevInputs.map((input, index) => {
        if (indexToApply !== undefined && index !== indexToApply) {
          return input;
        }

        let newValue = input.value; // Сохраняем текущее значение input
        switch (maskType) {
          case 0:
            newValue = `${mainGameName}: ${input.value}`;
            break;
          case 1:
            newValue = `${mainGameName} ${input.value}`;
            break;
          case 2:
            newValue = `${input.value} ${mainGameName}`;
            break;
          case 3:
            newValue =
              index === 0 ? mainGameName : `${mainGameName} ${index + 1}`;
            break;
          case 4:
            newValue =
              index === 0
                ? `${mainGameName}: ${input.value}`
                : `${mainGameName} ${index + 1}: ${input.value}`;
            break;
          case 5:
            newValue =
              index === 0
                ? mainGameName
                : `${mainGameName} ${toRoman(index + 1)}`;
            break;
          case 6:
            newValue =
              index === 0
                ? `${mainGameName}: ${input.value}`
                : `${mainGameName} ${toRoman(index + 1)}: ${input.value}`;
            break;
          default:
            break;
        }
        return { ...input, value: newValue };
      });

      setHistory((prevHistory) => [...prevHistory, prevInputs]); // Сохраняем состояние перед применением маски
      return newInputs;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undoChanges();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [history]);

  function toRoman(num: number) {
    const roman = [
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
    ];
    return roman[num];
  }

  const handleInputChange = (id: number, newValue: string) => {
    setInputs((prevInputs) => {
      const newInputs = prevInputs.map((input) =>
        input.id === id ? { ...input, value: newValue } : input
      );
      setHistory((prevHistory) => [...prevHistory, prevInputs]); // Сохраняем состояние перед изменением
      return newInputs;
    });
  };

  const handleConfirm = async () => {
    let gameslist = [];
    if (inputs.length === 0) {
      gameslist = [
        {
          name: mainGameName,
          status: "none",
          time: 0,
          episodesCount: 0,
          playlistLink: "",
        },
      ];
    } else {
      gameslist = inputs.map((input) => ({
        name: input.value,
        status: "none",
        time: 0,
        episodesCount: 0,
        playlistLink: "",
      }));
    }

    try {
      const seriesDocRef = await addDoc(collection(db, "gameSeries"), {
        name: mainGameName,
      });

      const newSeries = { id: seriesDocRef.id, name: mainGameName };
      setGameSeries((prev) => [...prev, newSeries]);

      const newGames: Game[] = [];

      for (const game of gameslist) {
        const gameDocRef = await addDoc(collection(db, "game"), {
          ...game,
          seriesId: seriesDocRef.id,
        });

        newGames.push({
          ...game,
          id: gameDocRef.id,
          seriesId: seriesDocRef.id,
        });
      }

      setGames((prev) => [...prev, ...newGames]);
    } catch (error) {
      console.error("Error adding game:", error);
    }

    cancelConfirm();
  };

  const cancelConfirm = () => {
    setModalVisible(false);
    setInputs([]);
    setMainGameName("");
  };

  const undoChanges = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const lastState = prevHistory[prevHistory.length - 1];
        setInputs(lastState);
        return prevHistory.slice(0, prevHistory.length - 1);
      }
      return prevHistory;
    });
  };

  return (
    <div>
      <input
        type="text"
        id="main"
        placeholder={inputs.length === 0 ? "Game" : "Game series"}
        value={mainGameName}
        onChange={handleMainGameNameChange}
      />
      {inputs.length > 0 && (
        <div>
          <div>
            {maskTypes.map((maskType, index) => (
              <button key={index} onClick={() => setCurrentMaskType(index)}>
                {maskType}
              </button>
            ))}
          </div>
          <div>
            <button onClick={() => applyMask(currentMaskType)}>
              Apply All
            </button>
            <button onClick={() => clearFields()}>Clear fields</button>
          </div>
        </div>
      )}
      {inputs.map((input, index) => (
        <div key={input.id}>
          <input
            ref={(el) => (inputRefs.current[index] = el!)}
            type="text"
            placeholder={`Game ${index + 1}`}
            value={input.value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
          <button onClick={() => applyMask(currentMaskType, index)}>
            {maskTypes[currentMaskType]}
          </button>
          <button onClick={() => removeInput(input.id)}>X</button>
        </div>
      ))}
      <button onClick={addInput}>Add Game</button>
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={cancelConfirm}>Cancel</button>
    </div>
  );
};

export default AddGameModal;
