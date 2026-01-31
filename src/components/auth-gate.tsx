"use client";
import { useAppContext } from "@/app/app-provider";
import { WebSocketProvider } from "@/providers/web-socket-provider";
import React from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();

  return (
    <WebSocketProvider isAuthenticated={isAuthenticated}>
      {children}
    </WebSocketProvider>
  );
}
