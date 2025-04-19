import { NextResponse } from 'next/server';
import type { Message } from '@/components/Chat';

// In-memory storage for messages (in a real app, this would be a database)
const messages: Message[] = [
  { id: 1, sender: 'user', text: 'Some Message' },
  { id: 2, sender: 'support', text: 'Some Response' },
  { id: 3, sender: 'user', text: 'Some Other message' },
  { id: 4, sender: 'support', text: 'Some Response 2' },
];

export async function GET() {
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const message: Message = await request.json();

    // Ensure the message has a unique ID
    const newId =
      messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;

    const newMessage = {
      ...message,
      id: newId,
    };

    messages.push(newMessage);

    // Simulate support response
    const supportMessage: Message = {
      id: newId + 1,
      sender: 'support',
      text: `This is an automated response to: "${message.text}"`,
    };

    messages.push(supportMessage);

    // Return both messages
    return NextResponse.json({
      userMessage: newMessage,
      supportMessage: supportMessage,
    });
  } catch (error: unknown) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 400 }
    );
  }
}
