/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAppContext } from "./app-provider";

const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocketProvider({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [sk, setSocket] = useState<WebSocket | null>(null);

  const { user } = useAppContext();
  const userId = user?.id;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      if (wsRef.current) {
        wsRef.current?.close();
        wsRef.current = null;
        setSocket(null);
      }
      return;
    }

    const ws = new WebSocket(`ws://localhost:8080/ws?userId=${userId}`);

    wsRef.current = ws;
    setSocket(ws);

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      setSocket(null);
    };
  }, [isAuthenticated, userId]);

  return (
    <WebSocketContext.Provider value={sk}>{children}</WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
