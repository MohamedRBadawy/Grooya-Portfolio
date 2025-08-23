
import { useState, useCallback } from 'react';

// Defines the shape of the state object, inspired by the Redux DevTools structure.
type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

/**
 * A custom hook that provides state management with undo/redo capabilities.
 * @param initialPresent The initial state value.
 * @returns An object with the current state and functions to manipulate the history.
 */
export const useHistoryState = <T,>(initialPresent: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  /**
   * Sets a new state. This action clears the future (redo) history.
   * @param newPresent The new state to set.
   */
  const set = useCallback((newPresent: T) => {
    setState(currentState => {
      // Avoid pushing duplicates to history. JSON.stringify is a simple deep-enough compare for this app's state.
      if (JSON.stringify(newPresent) === JSON.stringify(currentState.present)) {
        return currentState;
      }
      // The current present becomes the last item in the past.
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: [], // Clear future on new state set
      };
    });
  }, []);

  /**
   * Moves the present state to the future and sets the present to the last state in the past.
   */
  const undo = useCallback(() => {
    if (!canUndo) return;
    setState(currentState => {
      const newPresent = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);
      return {
        past: newPast,
        present: newPresent,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, [canUndo]);

  /**
   * Moves the present state to the past and sets the present to the first state in the future.
   */
  const redo = useCallback(() => {
    if (!canRedo) return;
    setState(currentState => {
      const newPresent = currentState.future[0];
      const newFuture = currentState.future.slice(1);
      return {
        past: [...currentState.past, currentState.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, [canRedo]);
  
  /**
   * Directly sets the present state without affecting the history.
   * This is useful for live updates (e.g., typing in an input) that you don't want
   * to record in the history until the user finishes (e.g., on blur or with a debounce).
   * @param newPresent The new present state.
   */
  const setPresentOnly = useCallback((newPresent: T) => {
    setState(s => ({...s, present: newPresent}));
  }, []);
  
  /**
   * Resets the entire history to a new initial state.
   * Useful for loading a completely new piece of data into the editor.
   * @param newInitialPresent The new state to initialize the history with.
   */
  const reset = useCallback((newInitialPresent: T) => {
    setState({
      past: [],
      present: newInitialPresent,
      future: [],
    });
  }, []);

  return { state: state.present, set, undo, redo, canUndo, canRedo, reset, setPresentOnly };
};