import type {
  PronunciationEntry,
  SynthesisResult,
  VoiceProfile,
  VoiceProviderAdapter,
} from "./types";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const applyPronunciationDictionary = (
  text: string,
  dictionary: PronunciationEntry[],
): string => {
  return [...dictionary]
    .sort((a, b) => b.display.length - a.display.length)
    .reduce((result, entry) => {
      const expression =
        entry.match === "regex"
          ? new RegExp(entry.display, entry.flags ?? "giu")
          : new RegExp(escapeRegExp(entry.display), entry.flags ?? "giu");
      return result.replace(expression, entry.spoken);
    }, text);
};

export const assertVoiceUseAllowed = (profile: VoiceProfile): void => {
  if (profile.provider === "disabled") {
    throw new Error("Voice provider đang bị khóa (disabled). Không có API nào được gọi.");
  }
  if (!profile.consent.confirmed || !profile.consent.scope) {
    throw new Error("Chưa có xác nhận quyền sử dụng giọng và phạm vi đồng thuận.");
  }
};

export const createHighVoltageLifeVoice = ({
  profile,
  dictionary,
  adapter,
}: {
  profile: VoiceProfile;
  dictionary: PronunciationEntry[];
  adapter: VoiceProviderAdapter;
}) => ({
  profile,
  prepareText: (displayText: string) =>
    applyPronunciationDictionary(displayText, dictionary),
  synthesize: async (displayText: string): Promise<SynthesisResult> => {
    assertVoiceUseAllowed(profile);
    if (adapter.name !== profile.provider) {
      throw new Error("Adapter không khớp với provider trong voice profile.");
    }
    return adapter.synthesize({
      displayText,
      spokenText: applyPronunciationDictionary(displayText, dictionary),
      language: profile.language,
    });
  },
});
