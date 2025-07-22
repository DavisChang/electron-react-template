import { describe, it, expect } from 'vitest';
import cn from './cn';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('handles conditional class names', () => {
    const condition = true;
    const result = cn(condition && 'class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('ignores falsy values', () => {
    const result = cn(false && 'class1', null, undefined, 'class2');
    expect(result).toBe('class2');
  });

  it('merges Tailwind CSS classes correctly', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('handles complex combinations', () => {
    const result = cn('text-red-500', 'text-blue-500', 'bg-gray-200', 'p-4');
    expect(result).toBe('text-blue-500 bg-gray-200 p-4');
  });
});
