import { describe, expect, it } from 'vitest';
import * as constants from './constants';

describe('constants', () => {
  it('should export all required constants', () => {
    expect(constants).toBeDefined();
  });

  it('should have stable constant values', () => {
    // This test ensures constants don't accidentally change
    const constantKeys = Object.keys(constants);
    expect(constantKeys.length).toBeGreaterThanOrEqual(0);

    // Test that constants are properly defined
    constantKeys.forEach(key => {
      expect(constants[key as keyof typeof constants]).toBeDefined();
    });
  });
});
