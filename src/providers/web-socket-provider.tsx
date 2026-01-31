"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!isAuthenticated) {
      if (wsRef.current) {
        wsRef.current?.close();
        wsRef.current = null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(null);
      }
      return;
    }

    const timer = setTimeout(() => {
      const ws = new WebSocket(`ws://localhost:8080/ws`);
      wsRef.current = ws;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(ws);
    }, 50);

    return () => {
      clearTimeout(timer);
      wsRef.current?.close();
      wsRef.current = null;
      setSocket(null);
    };
  }, [isAuthenticated]);

  return (
    <WebSocketContext.Provider value={sk}>{children}</WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
