import type {ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {motionProgress} from './motion';

/** SVG world layer: camera in world units, parallax proportional to depth. */
export const ParallaxLayer = ({children, cameraX = 0, cameraY = 0, depth = 1, zoom = 1}: {
  children: ReactNode; cameraX?: number; cameraY?: number; depth?: number; zoom?: number;
}) => <g transform={`scale(${zoom}) translate(${-cameraX * depth} ${-cameraY * depth})`}>{children}</g>;

/** Fixed painter order prevents scenery from covering labels or karaoke. */
export const IllustrationScene = ({background, midground, foreground, technicalOverlay, labels, subtitles}: {
  background: ReactNode; midground?: ReactNode; foreground?: ReactNode;
  technicalOverlay?: ReactNode; labels?: ReactNode; subtitles?: ReactNode;
}) => <AbsoluteFill style={{overflow:'hidden'}}>
  <svg width="100%" height="100%" viewBox="0 0 1080 1920">
    <g data-layer="background">{background}</g>
    <g data-layer="midground">{midground}</g>
    <g data-layer="foreground">{foreground}</g>
    <g data-layer="technical-overlay">{technicalOverlay}</g>
  </svg>
  {labels}{subtitles}
</AbsoluteFill>;

/** Keep outgoing scene below incoming; overlap centered on narration boundary. */
export const SceneReveal = ({children, boundarySeconds, durationSeconds = .8, kind = 'dissolve'}: {
  children: ReactNode; boundarySeconds: number; durationSeconds?: number; kind?: 'dissolve' | 'wipe';
}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const progress=motionProgress(frame, (boundarySeconds-durationSeconds/2)*fps, (boundarySeconds+durationSeconds/2)*fps);
  return <AbsoluteFill style={{opacity:kind==='dissolve'?progress:1, clipPath:kind==='wipe'?`inset(0 ${(1-progress)*100}% 0 0)`:undefined}}>{children}</AbsoluteFill>;
};
