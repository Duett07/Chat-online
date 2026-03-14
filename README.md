# Chat Smart

A real-time chat application built with Next.js and WebSocket. Users can register, log in, search for other users, start conversations, and exchange messages in real time.

## Features

- **Real-time messaging** -- send and receive messages instantly via WebSocket
- **User authentication** -- register and log in with secure password validation
- **Conversation management** -- view, search, and delete conversations
- **Message management** -- send, receive, and delete messages with optimistic UI updates
- **User search** -- find other users by display name and start chatting
- **Profile management** -- view and edit your display name, gender, and date of birth
- **Emoji picker** -- send emojis in your messages
- **Online status indicators** -- see who is currently online

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Real-time:** WebSocket
- **Notifications:** Sonner (toast)
- **Icons:** Lucide React

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- A running backend API server (this is the frontend only)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Duett07/Chat-online.git
cd Chat-online/fe
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp env.example .env
```

Edit `.env` and set the backend API URL:

```
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8080
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build for production         |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint                   |

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (main)/              # Main app pages
│   │   ├── page.tsx         # Home / welcome page
│   │   └── chat/[id]/       # Chat conversation page
│   ├── api/auth/            # Next.js API routes for cookie-based auth
│   └── schemaValidations/   # Zod schemas for form validation
├── apiRequest/              # API client functions (auth, messages, users)
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # Sidebar layout
│   ├── add-friend.tsx       # User search and add friend
│   └── profile.tsx          # Profile view/edit dialog
├── lib/
│   ├── http.ts              # Axios instance with auth interceptors
│   └── utils.ts             # Utility functions
├── providers/
│   ├── app-provider.tsx     # Global auth/user state context
│   ├── web-socket-provider.tsx  # WebSocket connection context
│   └── conversation-provider.tsx # Conversation list state context
├── config.ts                # Environment variable validation
└── proxy.ts                 # Next.js middleware for route protection
```

## Backend API

This frontend expects a backend API with the following endpoints:

| Method | Endpoint                            | Description                        |
| ------ | ----------------------------------- | ---------------------------------- |
| POST   | `/api/v1/auth/register`             | Register a new user                |
| POST   | `/api/v1/auth/login`                | Log in and receive an access token |
| GET    | `/api/v1/conversations/get`         | Get all conversations              |
| PUT    | `/api/v1/conversations/delete/{id}` | Delete a conversation              |
| GET    | `/api/v1/messages/with/{userId}`    | Get messages with a user           |
| POST   | `/api/v1/messages/send`             | Send a message                     |
| PUT    | `/api/v1/messages/delete/{id}`      | Delete a message                   |
| GET    | `/api/v1/user/profile`              | Get current user profile           |
| PUT    | `/api/v1/user/update`               | Update user profile                |
| POST   | `/api/v1/user/find-user`            | Search users by display name       |

The backend should also expose a WebSocket endpoint at `/ws?userId={userId}` for real-time messaging.
