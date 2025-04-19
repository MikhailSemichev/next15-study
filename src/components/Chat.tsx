'use client';

import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import FileSelector from './FileSelector';

export interface Message {
  id: number;
  sender: 'user' | 'support';
  text: string;
  file?: {
    name: string;
    url: string;
  };
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchMessages = async (): Promise<void> => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    void fetchMessages();
  }, []);

  const addMessage = async (message: Message): Promise<void> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prevMessages => [
        ...prevMessages,
        data.userMessage,
        data.supportMessage,
      ]);
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const [newMessage, setNewMessage] = useState<string>('');

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (): Promise<void> => {
    if (newMessage.trim() || selectedFile) {
      const newId =
        messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;

      let message: Message = {
        id: newId,
        sender: 'user',
        text: newMessage.trim(),
      };

      if (selectedFile) {
        const fileUrl = URL.createObjectURL(selectedFile);
        message = {
          ...message,
          text: message.text || `Shared file: ${selectedFile.name}`,
          file: {
            name: selectedFile.name,
            url: fileUrl,
          },
        };
        setSelectedFile(null);
      }

      await addMessage(message);
      setNewMessage('');
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="w-full max-w-md" role="region" aria-label="Chat messages">
      <div className="border border-gray-300 rounded-md mb-4">
        <div
          className="p-4 space-y-4 h-[400px] overflow-y-auto"
          role="log"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-100 text-left'
                  : 'bg-gray-100 text-right'
              }`}
              role="article"
              aria-label={`Message from ${message.sender}`}
            >
              <p className="font-semibold text-gray-700 text-lg">
                <span className="sr-only">
                  {message.sender === 'user'
                    ? 'Your message'
                    : 'Support message'}
                </span>
                {message.sender === 'user' ? 'Me: ' : 'Support: '}
                <span className="font-normal text-lg">{message.text}</span>
              </p>
              {message.file && (
                <div className="mt-2">
                  <a
                    href={message.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    aria-label={`Download attached file: ${message.file.name}`}
                  >
                    <span role="img" aria-hidden="true">
                      📎
                    </span>{' '}
                    {message.file.name}
                  </a>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <textarea
          className="border border-gray-300 rounded-md p-2 flex-grow"
          placeholder="Type your message here"
          rows={2}
          value={newMessage}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewMessage(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSendMessage();
            }
          }}
          aria-label="Message input"
        />
        <div className="flex items-center gap-2">
          <FileSelector onFileSelect={handleFileSelect} />
          {selectedFile && (
            <span className="text-sm text-gray-600" role="status">
              Selected file: {selectedFile.name}
            </span>
          )}
          <button
            className="bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2 transition-colors"
            onClick={() => void handleSendMessage()}
            aria-label="Send message"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
