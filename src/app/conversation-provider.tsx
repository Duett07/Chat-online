"use client";

import { createContext, Dispatch, useContext, useState } from "react";

type LastMessage = {
  content: string;
  createdAt: string;
  senderId: string;
  isDeleted?: boolean;
};

type ConversationItem = {
  conversationId: string;
  partner: {
    id: string;
    displayName: string;
    online: boolean;
    image: string;
  };
  lastMessage?: LastMessage;
};

type ConversationContextType = {
  conversations: ConversationItem[];
  setConversations: Dispatch<React.SetStateAction<ConversationItem[]>>;
};

const ConversationContext = createContext<ConversationContextType | null>(null);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  return (
    <ConversationContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ConversationContext.Provider>
  );
}

export const useConversations = () => {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error("useConversations must be used inside provider");
  return ctx;
};
