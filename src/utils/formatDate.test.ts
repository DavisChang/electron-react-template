import { describe, expect, it } from 'vitest';
import { formatDateFromMs } from './formatDate';

describe('formatDate utility', () => {
  describe('formatDateFromMs', () => {
    it('should format timestamp to readable date string', () => {
      // Test with a known timestamp: 2024-01-15 12:30:45
      const timestamp = 1705317045000;
      const result = formatDateFromMs(timestamp);

      // Should return a formatted date string (actual format may vary by locale)
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
    });

    it('should handle current timestamp', () => {
      const now = Date.now();
      const result = formatDateFromMs(now);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format zero timestamp', () => {
      const result = formatDateFromMs(0);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle negative timestamps', () => {
      const result = formatDateFromMs(-1000);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format dates consistently', () => {
      const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
      const result1 = formatDateFromMs(timestamp);
      const result2 = formatDateFromMs(timestamp);

      expect(result1).toBe(result2);
    });
  });
});
