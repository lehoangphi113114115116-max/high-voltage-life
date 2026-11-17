import type {
  SynthesisRequest,
  SynthesisResult,
  VoiceProviderAdapter,
} from "../types";

export const disabledVoiceProvider: VoiceProviderAdapter = {
  name: "disabled",
  async synthesize(_request: SynthesisRequest): Promise<SynthesisResult> {
    throw new Error(
      "Voice Cloning/TTS chưa được kích hoạt. Cần xác nhận quyền sử dụng và chi phí trước.",
    );
  },
};
