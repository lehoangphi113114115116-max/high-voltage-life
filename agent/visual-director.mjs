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

const primaryTools = {svg:'svg', parallax:'parallax', 'breaker-contact-3d':'three'};

// All these gaps require a concrete production note, not just a topic keyword.
const specialistNeeds = [
  [/asset lottie (?:đã cấp phép|đã có quyền)|licensed lottie asset/iu,'lottie'],
  [/morph.*(?:khác topology|khác số điểm)|morph.*dissimilar (?:svg )?paths/iu,'flubber'],
  [/biên tập keyframe trực quan|interactive keyframe editing/iu,'theatre'],
  [/sơ đồ.*thủ tục.*nhiều trục|procedural multi-axis diagram/iu,'motion-canvas'],
  [/nét phác thảo có chủ đích|intentional sketch style/iu,'rough'],
  [/pseudo[- ]3d.*(?:không dùng webgl|without webgl)/iu,'zdog'],
  [/hệ hạt.*vượt khả năng svg|particle field exceeds svg/iu,'particles'],
  [/khói trang trí.*(?:cần mô phỏng chất lỏng|bake mô phỏng)|decorative fluid bake/iu,'fluid'],
  [/shader trừu tượng.*(?:cần hydra|live coding)|abstract shader.*hydra/iu,'hydra'],
  [/timeline.*(?:gsap|nhiều track phụ thuộc).*remotion không đáp ứng/iu,'gsap'],
  [/chuỗi vector.*(?:anime\.js|seek phức tạp).*remotion không đáp ứng/iu,'anime'],
  [/shader glsl.*tái sử dụng|reusable glsl routine/iu,'lygia'],
];

export const planSceneTools = ({scene, formula, inset, visualReview = '', manifest}) => {
  const renderer = scene.visualDirection?.shot?.renderer;
  const primary = primaryTools[renderer] ?? 'svg';
  const selected = [manifest.engine, primary, ...(formula ? ['formula'] : []), ...(inset ? ['footage'] : [])];
  const visualNote = `${visualReview}\n${scene.toolRequirement ?? ''}`;
  const specialist = specialistNeeds.find(([need])=>need.test(visualNote))?.[1];
  const requested = specialist && manifest.tools[specialist]?.repository ? specialist : null;
  return {sceneId:scene.id,selected,purpose:manifest.tools[primary].use,
    repositoryNeed:requested, ...(requested ? {fallback:primary} : {})};
};
