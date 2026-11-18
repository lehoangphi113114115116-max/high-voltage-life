// Choose only renderers backed by reusable components. Footage remains an inset
// selected independently by the existing licensed-footage director.
export const chooseSceneRenderer = ({shot, text, policy}) => {
  if (policy?.breakerContact3D && shot.subject === 'breaker' && shot.action === 'open-contacts'
    && /mặt cắt|bên trong|khoảng hở|dọc trục|không gian/iu.test(text)) {
    return 'breaker-contact-3d';
  }
  return shot.framing === 'diagram' || shot.subject === 'relay' || shot.subject === 'breaker'
    ? 'svg' : 'parallax';
};
