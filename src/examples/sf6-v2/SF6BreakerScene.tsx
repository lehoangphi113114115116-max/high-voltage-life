import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {breakerSvg} from './breakerSvg.mjs';

/**
 * Stylized technical illustration — SVG components and objects are generated
 * deterministically per frame. No AI-generated raster footage is used.
 *
 * Add to Root.tsx as a Composition of 540 frames at 30 fps, 1080×1920.
 */
export const SF6BreakerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#0b2437'}}>
      <div style={{width: '100%', height: '100%'}} dangerouslySetInnerHTML={{__html: breakerSvg(frame, fps)}} />
    </AbsoluteFill>
  );
};
