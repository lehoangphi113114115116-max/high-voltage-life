const DEPTH_TERMS = [
  'cấu tạo',
  'bên trong',
  'mặt cắt',
  'cắt bổ',
  'cơ cấu',
  'chiều sâu',
  'cutaway',
  'exploded',
  '2.5d',
  '3d',
];

const includesAny = (text, terms) => terms.some((term) => text.includes(term));

/**
 * Chọn hướng dẫn chuyên môn cho Content Director. Hàm này chỉ định tuyến Skill;
 * Remotion vẫn là renderer và mọi hình học thiết bị thật phải có tài liệu nguồn.
 */
export const selectAgentSkills = ({topic, category, visualMode, format = 'short-form-video'}) => {
  const normalized = topic.toLocaleLowerCase('vi');
  const selected = [];

  if (format === 'short-form-video') {
    selected.push({
      id: 'social',
      requestedAlias: 'social-content',
      purpose: 'hook, nhịp kể và đóng gói video ngắn theo đối tượng người xem',
    });
  }

  selected.push({
    id: 'scientific-critical-thinking',
    purpose: 'kiểm tra tuyên bố kỹ thuật, mức độ bằng chứng, sai lệch và giới hạn kết luận',
  });

  const needsDepth = category === 'high-voltage-equipment'
    || includesAny(normalized, DEPTH_TERMS)
    || visualMode?.includes('cutaway');

  if (needsDepth) {
    selected.push({
      id: 'anatomy',
      purpose: 'bố cục minh họa kỹ thuật có chiều sâu hoặc mặt cắt',
      allowedScope: 'ngôn ngữ hình ảnh, phân lớp và chiều sâu tổng quát',
      evidenceGate: 'Cần tài liệu kỹ thuật được chấp thuận trước khi mô tả cấu tạo, kích thước hoặc chuyển động của thiết bị điện thật.',
      renderer: 'Remotion',
    });
  }

  return {
    selected,
    anatomyEnabled: needsDepth,
    anatomyEvidenceReady: false,
    paidServicesAllowed: false,
  };
};
