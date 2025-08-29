
import React, { useState, useEffect, useCallback } from 'react';

const SIDEBAR_WIDTH_KEY = 'grooya_sidebar_width';
const DEFAULT_SIDEBAR_WIDTH = 480;
const MIN_SIDEBAR_WIDTH = 320;
const MAX_SIDEBAR_WIDTH = 800;

export const useResizableSidebar = () => {
    const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
        try {
            const stored = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
            const storedWidth = stored ? parseInt(stored, 10) : DEFAULT_SIDEBAR_WIDTH;
            return Math.max(MIN_SIDEBAR_WIDTH, Math.min(storedWidth, MAX_SIDEBAR_WIDTH));
        } catch {
            return DEFAULT_SIDEBAR_WIDTH;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
        } catch (error) {
            console.error("Error saving sidebar width:", error);
        }
    }, [sidebarWidth]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = e.clientX;
            const clampedWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(newWidth, MAX_SIDEBAR_WIDTH));
            setSidebarWidth(clampedWidth);
        };

        const handleMouseUp = () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, []);

    return { sidebarWidth, handleMouseDown };
};
