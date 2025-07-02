import { beforeAll, vi } from 'vitest'

// Web Audio API Mock
const AudioContextMock = vi.fn(() => ({
  createOscillator: vi.fn(() => ({
    frequency: { value: 0 },
    type: 'sine',
    connect: vi.fn().mockReturnThis(),
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    gain: { value: 0 },
    connect: vi.fn().mockReturnThis(),
  })),
  destination: {},
  currentTime: 0,
  sampleRate: 48000,
  suspend: vi.fn(),
  resume: vi.fn(),
  close: vi.fn(),
}))

beforeAll(() => {
  // Mock Web Audio API
  Object.defineProperty(global, 'AudioContext', {
    writable: true,
    value: AudioContextMock,
  })

  Object.defineProperty(global, 'webkitAudioContext', {
    writable: true,
    value: AudioContextMock,
  })

  // Mock MediaDevices API
  Object.defineProperty(global.navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn(),
      enumerateDevices: vi.fn(() => Promise.resolve([])),
    },
  })

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
  })

  // Mock fetch
  global.fetch = vi.fn()
}) 