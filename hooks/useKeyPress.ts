
import { useEffect } from 'react';

/**
 * A custom hook to perform an action when a specific key combination (with Ctrl or Cmd) is pressed.
 * @param callback The function to execute when the key combination is pressed.
 * @param keyCodes An array of key codes to listen for (e.g., ['k', 's']). The hook checks for `(Cmd/Ctrl) + key`.
 */
export const useKeyPress = (callback: (event: KeyboardEvent) => void, keyCodes: string[]): void => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Check if the metaKey (Cmd on Mac) or ctrlKey (on Windows/Linux) is pressed,
      // along with one of the specified key codes.
      if ((event.metaKey || event.ctrlKey) && keyCodes.includes(event.key.toLowerCase())) {
        event.preventDefault(); // Prevent default browser actions (e.g., Cmd+S for saving the page).
        callback(event);
      }
    };

    window.addEventListener('keydown', handler);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [callback, keyCodes]); // Re-run the effect only if callback or keyCodes change.
};