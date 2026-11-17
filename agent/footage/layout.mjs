export const overlaps = (a,b) => a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;

/** No safe slot = no footage. Never shrink away protected areas to force it in. */
export const chooseFootageLayout = ({width=1080,height=1920,reservedAreas,candidates}) => {
  if(!Array.isArray(reservedAreas)||!Array.isArray(candidates)) return null;
  return candidates.find(r=>r.width>=240&&r.height>=135&&r.x>=40&&r.y>=40&&r.x+r.width<=width-40&&r.y+r.height<=height-80&&r.width*r.height<=width*height*.22&&!reservedAreas.some(p=>overlaps(r,p)))??null;
};

/** Measured safe band for current AutonomousExplainer's normal SVG layout.
 * Other renderers must declare their own rectangles; no generic unsafe guess.
 */
export const autonomousFootageLayout = (headline, motionPreview=false) => {
  if(motionPreview||headline.length>80) return null;
  return {
    reservedAreas:[{x:0,y:0,width:1080,height:390},{x:0,y:560,width:1080,height:1000},{x:0,y:1580,width:1080,height:340}],
    candidates:[{mode:'inset',side:'right',x:730,y:396,width:280,height:158},{mode:'picture-in-picture',side:'left',x:70,y:396,width:280,height:158}],
  };
};
