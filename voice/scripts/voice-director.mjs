const segmenter = new Intl.Segmenter('vi', {granularity:'sentence'});
const reveal = /^(?:hóa ra|thì ra|điều (?:thú vị|bất ngờ|quan trọng)|điểm mấu chốt|bất ngờ thay|không phải đâu)(?=[\s,:.!?]|$)/iu;
const outro = /^(?:tóm lại|nói ngắn gọn|hãy nhớ|điều cần nhớ|chốt lại)(?=[\s,:.!?]|$)/iu;
const phenomenon = /^(?:hãy (?:nhìn|quan sát|tưởng tượng)|thử tưởng tượng|ngay lúc đó|bỗng nhiên|khi ấy)(?=[\s,:.!?]|$)/iu;
const explanation = /^(?:vì |do |bởi |khi |nếu |nguyên lý|cơ chế)/iu;

const classify = (text, index, sentences) => {
  if (/\?$/u.test(text)) return index===0?'hook':'question';
  if (reveal.test(text)) return 'discovery';
  if (outro.test(text) || (index===sentences.length-1 && index>=2 && /^(?:vậy nên|vì vậy|cho nên)(?=[\s,:.!?]|$)/iu.test(text))) return 'conclusion';
  if (phenomenon.test(text) || /!$/u.test(text) || (index===1 && !explanation.test(text))) return 'phenomenon';
  return 'explanation';
};

export function directNarration(display, pronounce, direction) {
  const sentences = [...segmenter.segment(display.replace(/\s+/gu,' '))]
    .map(({segment})=>segment.trim())
    .filter(Boolean);
  const beats = sentences.map((displayText,index)=>{
    const role=classify(displayText,index,sentences);
    // Add a prosodic boundary only after an unambiguous opening expression.
    const phrased=displayText.replace(/^(hóa ra|thì ra|tóm lại|bất ngờ thay) +(?=[\p{L}\p{N}])/iu,'$1, ');
    return {role,displayText,spokenText:pronounce(phrased), ...direction.roles[role]};
  });
  return {profile:direction.profile,beats};
}
