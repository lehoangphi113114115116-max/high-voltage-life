export const localVieNeuProfile = {
  profileId: "hvl-science-male-v1",
  provider: "local",
  engine: "vieneu-v3-turbo",
  modelRepository: "pnnbao-ump/VieNeu-TTS-v3-Turbo",
  voice: "Thái Sơn",
  language: "vi-VN",
  backend: "onnx-cpu",
  sampleRate: 48_000,
  speed: 1.166,
  sampling: {
    temperature: 0.72,
    topK: 25,
    topP: 0.92,
    repetitionPenalty: 1.2,
  },
} as const;

export type LocalVieNeuProfile = typeof localVieNeuProfile;
