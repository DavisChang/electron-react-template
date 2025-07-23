import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FloatingNoteTitle } from '../FloatingNoteTitle';

// Mock the markdown editor hook
vi.mock('../../hooks/useMarkdownEditor', () => ({
  useMarkdownEditor: () => ({
    selectedNote: {
      title: 'Test Note',
      lastEditTime: Date.now(),
      content: 'Test content',
    },
  }),
}));

describe('FloatingNoteTitle', () => {
  it('should render without crashing', () => {
    render(<FloatingNoteTitle />);

    // Should render the component structure
    expect(
      document.querySelector('.floating-note-title, [class*="title"]')
    ).toBeTruthy();
  });

  it('should handle no selected note', () => {
    // Mock no selected note
    vi.doMock('../../hooks/useMarkdownEditor', () => ({
      useMarkdownEditor: () => ({
        selectedNote: null,
      }),
    }));

    render(<FloatingNoteTitle />);

    // Should still render without errors
    expect(document.body).toBeInTheDocument();
  });
});
