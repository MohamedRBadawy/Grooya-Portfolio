
import React from 'react';
import type { ShapeDivider } from '../../types';

interface ShapeDividerProps extends ShapeDivider {
  position: 'top' | 'bottom';
}

// Predefined SVG path data for different divider shapes.
// These paths are designed for a 1200x120 viewBox.
const SHAPE_PATHS: Record<ShapeDivider['type'], string> = {
  wave: "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
  slant: "M1200 0L0 0 1200 160 1200 0z",
  curve: "M1200 120L0 16.48 0 0 1200 0 1200 120z",
};

/**
 * A component to render SVG shape dividers at the top or bottom of a block.
 */
const ShapeDividerComponent: React.FC<ShapeDividerProps> = ({ type, color, flipX, height, position }) => {
  const path = SHAPE_PATHS[type];

  // The container div is used to position the shape correctly and clip the overflow.
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: `${height}px`,
    zIndex: 1, // Ensure it's above the background image but below the content.
    overflow: 'hidden',
    pointerEvents: 'none', // The divider should not be interactive.
  };

  if (position === 'top') {
    containerStyle.top = 0;
  } else {
    containerStyle.bottom = 0;
  }
  
  // The SVG itself is styled to fill the container and apply transformations.
  const svgStyle: React.CSSProperties = {
      position: 'relative',
      display: 'block',
      width: 'calc(100% + 1.3px)', // Small overlap to prevent rendering gaps at the edges.
      height: `${height}px`,
      // Apply horizontal flip if needed.
      transform: `scaleX(${flipX ? -1 : 1})`,
  };
  
  // If the divider is at the bottom, it needs to be flipped vertically as well.
  if (position === 'bottom') {
      svgStyle.transform += ` rotate(180deg)`;
  }

  return (
    <div style={containerStyle}>
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none" // Stretches the SVG to fill the container.
        style={svgStyle}
      >
        <path d={path} style={{ fill: color }}></path>
      </svg>
    </div>
  );
};

export default ShapeDividerComponent;