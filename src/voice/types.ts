export type VoiceProviderName =
  | "disabled"
  | "elevenlabs"
  | "azure"
  | "playai"
  | "resemble"
  | "local";

export type PronunciationEntry = {
  display: string;
  spoken: string;
  match: "literal" | "regex";
  flags?: string;
};

export type VoiceProfile = {
  profileId: string;
  provider: VoiceProviderName;
  language: "vi-VN";
  voiceIdEnv: string;
  apiKeyEnv: string;
  model: string | null;
  consent: {
    confirmed: boolean;
    scope: string | null;
    confirmedAt: string | null;
  };
};

export type WordTimestamp = {
  text: string;
  spoken?: string;
  startMs: number;
  endMs: number;
  confidence?: number;
};

export type SynthesisRequest = {
  displayText: string;
  spokenText: string;
  language: "vi-VN";
};

export type SynthesisResult = {
  audioPath: string;
  durationMs: number;
  words: WordTimestamp[];
};

export interface VoiceProviderAdapter {
  readonly name: VoiceProviderName;
  synthesize(request: SynthesisRequest): Promise<SynthesisResult>;
}
