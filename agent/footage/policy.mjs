export const footagePolicy = {
  provider: 'wikimedia-commons', maxClips: 2, maxSeconds: 5,
  maxDownloadBytes: 40 * 1024 * 1024, requestTimeoutMs: 20000,
  minSceneSeconds: 2, minWidth: 480,
  licenses: ['CC0', 'CC BY'], paidServices: false,
};
const plain = value => String(value ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g,'&').trim();
export const metadataValue = (metadata, key) => plain(metadata[key]?.value);

/** Fail closed: no NC/ND/SA, unclear PD assertions, or extra restrictions. */
export const verifyLicense = info => {
  const m=info.extmetadata??{};
  const name=metadataValue(m,'LicenseShortName');
  const url=metadataValue(m,'LicenseUrl').replace(/^http:/,'https:').replace(/\/$/,'');
  const cc0=/^https:\/\/creativecommons\.org\/publicdomain\/zero\/1\.0$/.test(url)&&/CC0/i.test(name);
  const by=/^https:\/\/creativecommons\.org\/licenses\/by\/(1\.0|2\.0|2\.5|3\.0|4\.0)$/.test(url)&&/^CC BY /i.test(name);
  const creator=metadataValue(m,'Artist');
  if(!(cc0||by)||metadataValue(m,'Restrictions')||!creator||!info.descriptionurl?.startsWith('https://commons.wikimedia.org/wiki/')) return null;
  return {license:name,licenseUrl:url,creator,sourceUrl:info.descriptionurl,rightsVerified:true,
    verification:'Commons file metadata: exact license URL, creator and no additional restrictions',
    verifiedAt:new Date().toISOString(),attributionRequired:!cc0,
    attribution:`${creator} — ${name} — ${info.descriptionurl} — ${url}`,
    modifications:'trimmed, resized, muted and color adjusted for inset presentation',
    evidence:{LicenseShortName:m.LicenseShortName,LicenseUrl:m.LicenseUrl,Artist:m.Artist,Restrictions:m.Restrictions,Credit:m.Credit},
  };
};

const subjects=[
  {id:'sf6', trigger:/sf[₆6]|máy cắt/iu, query:'"SF6" "circuit breaker" filetype:video', anchor:/sf[₆6]|sulfur hexafluoride/i, detail:/breaker|switchgear/i},
  {id:'transformer',trigger:/máy biến áp|hạ áp|nâng áp/iu,query:'transformer electrical filetype:video',anchor:/transformer/i,detail:/power|electri|substation|distribution/i},
  {id:'wind',trigger:/điện gió|tua bin gió|tuabin gió/iu,query:'"wind turbine" filetype:video',anchor:/wind turbine/i},
  {id:'hydro',trigger:/thủy điện|thuỷ điện/iu,query:'hydroelectric power station filetype:video',anchor:/hydroelectric|hydropower|hydro power/i},
  {id:'solar',trigger:/điện mặt trời|pin mặt trời/iu,query:'solar photovoltaic panels filetype:video',anchor:/solar panel|photovoltaic/i},
  {id:'transmission',trigger:/truyền tải|đường dây|cột điện/iu,query:'"power line" transmission filetype:video',anchor:/power line|transmission line|electricity pylon/i},
  {id:'substation',trigger:/trạm biến áp|sân trạm/iu,query:'electrical substation filetype:video',anchor:/substation/i},
];
export const analyzeFootageNeed = (topic, text) => {
  // The narrated scene must name the physical subject, not merely the video title.
  if(/công thức|chênh lệch|sơ đồ|logic|khử ion|tái phóng|bằng không/iu.test(text)) return null;
  const subject=subjects.find(s=>s.trigger.test(text));
  return subject?{...subject,topic,purpose:'real-world-context-for-narrated-object'}:null;
};
export const matchesSubject = (candidate, need) => {
  const title=candidate.title.replace(/^File:/,'');
  const description=metadataValue(candidate.info.extmetadata??{},'ImageDescription');
  // Title must anchor the actual object. A transformer mentioned only in the
  // description of a Jacob's ladder is deliberately not a transformer clip.
  if(!need.anchor.test(title)||need.detail&&!need.detail.test(`${title} ${description}`)) return false;
  if(/animation|simulation|rendering|CGI|slideshow|diagram/i.test(`${title} ${description}`)) return false;
  if(/accident|explosion|fire|fault|flicker|burning/i.test(title)&&!/sự cố|cháy|nổ|hỏng|chập/iu.test(need.topic)) return false;
  return true;
};
