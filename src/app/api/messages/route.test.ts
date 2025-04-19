import { GET, POST } from './route';

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: ResponseInit) => ({
      json: () => Promise.resolve(body),
      ...init,
    }),
  },
}));

// Mock Headers class if not available in test environment
global.Headers = class MockHeaders {
  private headers: Record<string, string>;

  constructor(init?: Record<string, string>) {
    this.headers = init || {};
  }

  get(name: string): string | null {
    return this.headers[name.toLowerCase()] || null;
  }
} as unknown as typeof Headers;

describe('Messages API', () => {
  it('GET /api/messages returns all messages', async () => {
    const response = await GET();
    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('sender');
    expect(data[0]).toHaveProperty('text');
  });

  it('POST /api/messages creates a new message and returns user and support messages', async () => {
    const mockMessage = {
      id: 999,
      sender: 'user',
      text: 'Test message',
    };

    const request = {
      json: () => Promise.resolve(mockMessage),
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('userMessage');
    expect(data).toHaveProperty('supportMessage');
    expect(data.userMessage.text).toBe('Test message');
    expect(data.supportMessage.text).toContain('Test message');
    expect(data.userMessage.sender).toBe('user');
    expect(data.supportMessage.sender).toBe('support');
  });

  it('POST /api/messages handles invalid JSON', async () => {
    const request = {
      json: () => Promise.reject(new Error('Invalid JSON')),
    } as unknown as Request;

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to process message');

    consoleSpy.mockRestore();
  });
});
