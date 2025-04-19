# Next.js Chat App

A simple chat application built with Next.js and TypeScript that allows users to send messages and receive automated support responses.

## Features

- Real-time message display
- User-friendly interface
- Automated support responses
- Responsive design

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

The application uses Jest and React Testing Library for unit tests. To run tests:

```bash
# Run tests
npm test

# Run tests with coverage report
npm test -- --coverage
```

Current test coverage:

- Statement coverage: 92.45%
- Branch coverage: 83.33%
- Function coverage: 81.25%
- Line coverage: 94%

## Test Summary for QA

### Chat Component Tests (`src/components/Chat.test.tsx`)

- ✅ Renders chat interface and loads initial messages
- ✅ Sends messages via button click
- ✅ Sends messages via Enter key
- ✅ Prevents empty message submission
- ✅ Handles API fetch errors gracefully

### Messages API Tests (`src/app/api/messages/route.test.ts`)

- ✅ GET /api/messages returns message list
- ✅ POST /api/messages creates new message with support response
- ✅ Handles invalid JSON payloads

Test Coverage: 92.45% statements, 83.33% branches

## Project Structure

- `src/components/Chat.tsx` - Main chat component
- `src/app/api/messages/route.ts` - API endpoint for message handling

## Technologies Used

- Next.js
- TypeScript
- React
- Jest
- React Testing Library

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
