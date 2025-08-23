
import { useRef, useEffect, useMemo } from 'react';

/**
 * Creates a debounced version of a callback function that delays its execution.
 * This is useful for preventing a function from being called too frequently,
 * such as on every keystroke in an input field.
 * @param callback The function to debounce.
 * @param wait The delay in milliseconds.
 * @returns A memoized, debounced version of the callback function.
 */
export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  wait: number
) {
  // Use a ref to store the latest arguments passed to the debounced function.
  const argsRef = useRef<A | undefined>(undefined);
  // Use a ref to store the timeout ID.
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  // Cleanup any pending timeout on component unmount.
  useEffect(() => cleanup, []);

  // useMemo ensures that the debounced function is not recreated on every render.
  const debouncedCallback = useMemo(() => {
    const fun = (...args: A) => {
      // Store the latest arguments.
      argsRef.current = args;
      // Clear any existing pending timeout.
      cleanup();
      // Set a new timeout to execute the callback after the specified wait time.
      timeout.current = setTimeout(() => {
        if (argsRef.current) {
          callback(...argsRef.current);
        }
      }, wait);
    };

    return fun;
  }, [callback, wait]);

  return debouncedCallback;
}