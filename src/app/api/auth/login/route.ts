import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// In a real application, this would be in a database
const MOCK_USER = {
  email: 'test@example.com',
  password: 'password123',
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In a real application, you would:
    // 1. Hash the password
    // 2. Check against a database
    // 3. Use proper password hashing (e.g., bcrypt)
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      // Generate JWT token
      const token = jwt.sign({ email: MOCK_USER.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
