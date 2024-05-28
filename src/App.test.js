import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello aboud', () => {
  render(<App />);
  const linkElement = screen.getByText(/hello aboud/i);
  expect(linkElement).toBeInTheDocument();
});
