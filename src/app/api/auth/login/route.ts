import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Allow any email and password combination
    if (email && password) {
      // Generate JWT token
      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
