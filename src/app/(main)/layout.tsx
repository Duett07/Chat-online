import Sidebar from "@/components/layout/sidebar";
import React from "react";
import { ConversationProvider } from "../../providers/conversation-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-row h-screen overflow-hidden w-full">
        <ConversationProvider>
          <Sidebar />
          {children}
        </ConversationProvider>
      </div>
    </section>
  );
}
