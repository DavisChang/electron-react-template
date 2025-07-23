import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window APIs that don't exist in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Electron APIs
Object.defineProperty(window, 'ipcRenderer', {
  writable: true,
  value: {
    on: vi.fn(),
    removeAllListeners: vi.fn(),
    send: vi.fn(),
    invoke: vi.fn(),
  },
});

Object.defineProperty(window, 'context', {
  writable: true,
  value: {
    getNotes: vi.fn(),
    readNote: vi.fn(),
    writeNote: vi.fn(),
    createNote: vi.fn(),
    deleteNote: vi.fn(),
    getDeviceInfo: vi.fn(),
    chromeVersion: vi.fn(),
    electronVersion: vi.fn(),
    openUrl: vi.fn(),
    openDevTool: vi.fn(),
    openSecondaryWindow: vi.fn(),
    subscribeSomeData: vi.fn(),
    onPerformanceData: vi.fn(),
    onPerformanceAlert: vi.fn(),
  },
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
