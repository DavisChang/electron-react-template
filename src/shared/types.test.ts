import { describe, expect, it } from 'vitest';
import { type DeviceInfo, type Note, type Statistics } from './types';

describe('types', () => {
  describe('DeviceInfo', () => {
    it('should have correct structure for DeviceInfo type', () => {
      const mockDeviceInfo: DeviceInfo = {
        platform: 'darwin',
      };

      expect(mockDeviceInfo.platform).toBeDefined();
      expect(typeof mockDeviceInfo.platform).toBe('string');
    });
  });

  describe('Statistics', () => {
    it('should have correct structure for Statistics type', () => {
      const mockStats: Statistics = {
        cupUsage: 45.2,
        ramUsage: 1024,
        storageUsage: 512000,
      };

      expect(mockStats.cupUsage).toBeDefined();
      expect(mockStats.ramUsage).toBeDefined();
      expect(mockStats.storageUsage).toBeDefined();
      expect(typeof mockStats.cupUsage).toBe('number');
      expect(typeof mockStats.ramUsage).toBe('number');
      expect(typeof mockStats.storageUsage).toBe('number');
    });
  });

  describe('Note', () => {
    it('should have correct structure for Note type', () => {
      const mockNote: Note = {
        title: 'Test Note',
        lastEditTime: Date.now(),
        content: 'This is a test note',
      };

      expect(mockNote.title).toBeDefined();
      expect(mockNote.lastEditTime).toBeDefined();
      expect(mockNote.content).toBeDefined();
      expect(typeof mockNote.title).toBe('string');
      expect(typeof mockNote.lastEditTime).toBe('number');
      expect(typeof mockNote.content).toBe('string');
    });
  });
});
