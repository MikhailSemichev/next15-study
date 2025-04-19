import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from './Chat';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('Chat Component', () => {
  const mockMessages = [
    { id: 1, sender: 'user', text: 'Test message 1' },
    { id: 2, sender: 'support', text: 'Test response 1' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';

    // Reset fetch mock implementation
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url === '/api/messages' && !options?.method) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMessages),
        });
      }

      // Use a consistent ID for messages in tests
      const messageId = 3;

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            userMessage: {
              id: messageId,
              sender: 'user',
              text: options?.body ? JSON.parse(options.body).text : '',
              ...(options?.body && JSON.parse(options.body).file
                ? { file: JSON.parse(options.body).file }
                : {}),
            },
            supportMessage: {
              id: messageId + 1,
              sender: 'support',
              text: 'Support response',
            },
          }),
      });
    });
  });

  it('renders the chat component and loads messages', async () => {
    await act(async () => {
      render(<Chat />);
    });

    // Wait for messages to load
    await screen.findByText('Test message 1');
    await screen.findByText('Test response 1');

    const messages = screen.getAllByRole('article');
    expect(messages).toHaveLength(2);
    expect(messages[0]).toHaveTextContent('Test message 1');
    expect(messages[1]).toHaveTextContent('Test response 1');

    expect(
      screen.getByPlaceholderText('Type your message here')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send message' })
    ).toBeInTheDocument();
  });

  it('sends a new message when clicking send button', async () => {
    await act(async () => {
      render(<Chat />);
    });

    // Wait for messages to load
    await screen.findByText('Test message 1');

    const input = screen.getByPlaceholderText('Type your message here');
    const sendButton = screen.getByRole('button', { name: 'Send message' });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'New message' } });
    });

    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"text":"New message"'),
      });
    });
  });

  it('handles file selection and display', async () => {
    await act(async () => {
      render(<Chat />);
    });

    // Wait for component to load
    await screen.findByRole('textbox');

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(input!, { target: { files: [file] } });
    });

    const fileStatus = await screen.findByRole('status');
    expect(fileStatus).toHaveTextContent('Selected file: test.txt');
  });

  it('sends a message with file attachment', async () => {
    await act(async () => {
      render(<Chat />);
    });

    // Wait for component to load
    await screen.findByRole('textbox');

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(input!, { target: { files: [file] } });
    });

    const sendButton = screen.getByRole('button', { name: 'Send message' });

    await act(async () => {
      fireEvent.click(sendButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('test.txt'),
      });
    });
  });

  it('handles keyboard navigation for sending messages', async () => {
    await act(async () => {
      render(<Chat />);
    });

    // Wait for component to load
    await screen.findByRole('textbox');

    const input = screen.getByPlaceholderText('Type your message here');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test message' } });
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/messages',
        expect.any(Object)
      );
    });
  });

  it('renders with proper accessibility attributes', async () => {
    await act(async () => {
      render(<Chat />);
    });

    // Wait for component to load
    await screen.findByRole('region');

    const chatRegion = screen.getByRole('region', { name: 'Chat messages' });
    expect(chatRegion).toBeInTheDocument();

    const messageLog = screen.getByRole('log');
    expect(messageLog).toHaveAttribute('aria-live', 'polite');
    expect(messageLog).toHaveAttribute('aria-atomic', 'false');

    const messageInput = screen.getByRole('textbox', { name: 'Message input' });
    expect(messageInput).toBeInTheDocument();

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    expect(sendButton).toBeInTheDocument();
  });
});
