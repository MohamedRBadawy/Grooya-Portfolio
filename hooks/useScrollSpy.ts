import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (
  ids: string[],
  options?: IntersectionObserverInit,
  rootElementRef?: React.RefObject<Element | null>
): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observerOptions = {
        ...options,
        root: rootElementRef?.current ?? null,
    };

    observerRef.current = new IntersectionObserver(entries => {
      // Find the entry that is currently intersecting the most or is the first one visible
      const visibleEntries = entries.filter(e => e.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Sort by position on screen to prioritize the one closest to the top
        visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(visibleEntries[0].target.id);
      }
    }, observerOptions);

    elements.forEach(el => observerRef.current?.observe(el!));
    
    return () => observerRef.current?.disconnect();
  }, [ids, options, rootElementRef?.current]);

  return activeId;
};