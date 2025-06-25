import { create } from 'zustand';

export const useMediaStore = create((set) => ({
  stream: null,
  setStream: (stream) => set({ stream }),
  clearStream: () => set({ stream: null, audioOn: false, videoOn: false }),
  audioOn: false,
  setAudioOn: (audioOn) => set({ audioOn }),
  videoOn: false,
  setVideoOn: (videoOn) => set({ videoOn }),
}));
