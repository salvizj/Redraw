export const HandleCopyToClipboard = (
  lobbyId: string | null,
  setCopied: React.Dispatch<React.SetStateAction<boolean>>,
  setCopyError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  if (lobbyId) {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const url = `${BASE_URL}/?l=${lobbyId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setCopyError(null);
      })
      .catch(() => {
        setCopyError("Failed to copy the text to clipboard.");
      });
  }
};
