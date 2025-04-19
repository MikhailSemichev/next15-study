import { POST } from './route';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock NextResponse and jwt
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, options })),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
}));

describe('Login API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when email and password are provided', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'password123',
      }),
    } as unknown as Request;

    await POST(mockRequest);

    expect(jwt.sign).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      expect.any(String),
      { expiresIn: '1h' }
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { token: 'mock-token' },
      { status: 200 }
    );
  });

  it('should return error when email or password is missing', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
    } as unknown as Request;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Email and password are required' },
      { status: 401 }
    );
  });

  it('should handle errors properly', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Test error')),
    } as unknown as Request;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Internal server error' },
      { status: 500 }
    );
  });
});
