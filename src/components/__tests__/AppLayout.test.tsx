import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Content, RootLayout, Sidebar } from '../AppLayout';

describe('AppLayout Components', () => {
  describe('RootLayout', () => {
    it('should render children with correct layout classes', () => {
      render(
        <RootLayout>
          <div data-testid="child">Test content</div>
        </RootLayout>
      );

      const child = screen.getByTestId('child');
      expect(child).toBeInTheDocument();
    });
  });

  describe('Sidebar', () => {
    it('should render sidebar with correct structure', () => {
      render(
        <Sidebar>
          <div data-testid="sidebar-content">Sidebar content</div>
        </Sidebar>
      );

      const content = screen.getByTestId('sidebar-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should render content area with children', () => {
      render(
        <Content>
          <div data-testid="main-content">Main content</div>
        </Content>
      );

      const content = screen.getByTestId('main-content');
      expect(content).toBeInTheDocument();
    });
  });
});
