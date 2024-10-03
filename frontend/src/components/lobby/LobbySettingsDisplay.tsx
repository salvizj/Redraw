import React from "react";
import { useLanguage } from "../../context/languageContext";
import { LobbySettingsDisplayProps } from "../../types";

const LobbySettingsDisplay: React.FC<LobbySettingsDisplayProps> = ({
  role,
  isEditing,
  setIsEditing,
  maxPlayerCount,
  setMaxPlayerCount,
  promptInputTime,
  setPromptInputTime,
  drawingTime,
  setDrawingTime,
  handleUpdateClick,
  error,
  lobbySettings,
}) => {
  const selectClassName =
    "p-2 bg-background-light dark:bg-background-dark border-2 border-primary-light dark:border-primary-dark rounded-lg text-text-light dark:text-text-dark text-xl w-32 appearance-none cursor-pointer";
  const { language } = useLanguage();
  const translations = {
    maxPlayerCount: {
      en: "Max Player Count:",
      lv: "Maksimālais spēlētāju skaits:",
    },
    promptInputTime: {
      en: "Prompt Input Time:",
      lv: "Nosacījuma ievades laiks:",
    },
    drawingTime: {
      en: "Drawing Time:",
      lv: "Zīmēšanas laiks:",
    },
    saveChanges: {
      en: "Save Changes",
      lv: "Saglabāt izmaiņas",
    },
    cancel: {
      en: "Cancel",
      lv: "Atcelt",
    },
    editSettings: {
      en: "Edit Lobby Settings",
      lv: "Rediģēt istabas iestatījumus",
    },
    errorExceeded: {
      en: "Current player count exceeds the selected maximum player count.",
      lv: "Pašreizējais spēlētāju skaits pārsniedz izvēlēto maksimālo spēlētāju skaitu.",
    },
    lobbySettings: {
      en: "Lobby Settings",
      lv: "Istabas iestatījumi",
    },
  } as const;

  type TranslationKey = keyof typeof translations;

  const translate = (key: TranslationKey): string => {
    return translations[key][language];
  };

  const renderLobbySettingsDefault = () => (
    <div className="flex flex-col items-center p-6 border-2 border-primary-light dark:border-primary-dark rounded-lg">
      <div className="flex justify-between w-full max-w-lg mb-4">
        <p className="text-xl font-semibold text-text-light dark:text-text-dark pr-4">
          {translate("maxPlayerCount")}
        </p>
        <p className="text-text-light dark:text-text-dark">
          {lobbySettings.maxPlayerCount}
        </p>
      </div>

      <div className="flex justify-between w-full max-w-lg mb-4">
        <p className="text-xl font-semibold text-text-light dark:text-text-dark pr-4">
          {translate("promptInputTime")}
        </p>
        <p className="text-text-light dark:text-text-dark">
          {lobbySettings.promptInputTime}
        </p>
      </div>

      <div className="flex justify-between w-full max-w-lg">
        <p className="text-xl font-semibold text-text-light dark:text-text-dark pr-4">
          {translate("drawingTime")}
        </p>
        <p className="text-text-light dark:text-text-dark">
          {lobbySettings.drawingTime}
        </p>
      </div>
    </div>
  );

  const renderLobbySettingsEdit = () => (
    <div className="flex flex-col items-center p-6 border-2 border-primary-light dark:border-primary-dark rounded-lg">
      <div className="flex justify-between w-full max-w-lg mb-4">
        <p className="text-xl font-semibold text-text-light dark:text-text-dark pr-4">
          {translate("maxPlayerCount")}
        </p>
        <div className="relative">
          <select
            value={maxPlayerCount}
            onChange={(e) => setMaxPlayerCount(Number(e.target.value))}
            className={selectClassName}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option
                key={i + 1}
                value={i + 1}
                className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
              >
                {i + 1}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-light dark:text-text-dark">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full max-w-lg mb-4">
        <p className="text-xl font-semibold text-text-light dark:text-text-dark pr-4">
          {translate("promptInputTime")}
        </p>
        <div className="relative">
          <select
            value={promptInputTime}
            onChange={(e) => setPromptInputTime(Number(e.target.value))}
            className={selectClassName}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option
                key={(i + 1) * 10}
                value={(i + 1) * 10}
                className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
              >
                {(i + 1) * 10}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-light dark:text-text-dark">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full max-w-lg">
        <p className="text-xl font-semibold text-text-light dark:text-text-dark pr-4">
          {translate("drawingTime")}
        </p>
        <div className="relative">
          <select
            value={drawingTime}
            onChange={(e) => setDrawingTime(Number(e.target.value))}
            className={selectClassName}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option
                key={(i + 1) * 10}
                value={(i + 1) * 10}
                className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
              >
                {(i + 1) * 10}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-light dark:text-text-dark">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 mb-4 text-lg">
          {translate("errorExceeded")}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-background-light dark:bg-background-dark">
      <h3 className="text-primary-light dark:text-primary-dark text-4xl font-bold mb-4">
        {translate("lobbySettings")}
      </h3>
      {isEditing ? renderLobbySettingsEdit() : renderLobbySettingsDefault()}
      {role === "leader" && (
        <div className="flex justify-center gap-4 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdateClick}
                className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-full transition duration-200 hover:bg-primary-dark dark:hover:bg-primary-light text-lg"
              >
                {translate("saveChanges")}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-full transition duration-200 hover:bg-primary-dark dark:hover:bg-primary-light text-lg"
              >
                {translate("cancel")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 hover:bg-primary-dark dark:hover:bg-primary-light"
            >
              {translate("editSettings")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LobbySettingsDisplay;
