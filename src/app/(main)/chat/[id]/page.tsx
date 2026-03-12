"use client";

import DateDivider from "@/components/date-divider";
import { formatTime, isSameDay } from "@/components/formatTime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PhoneCall, Send, Smile, Trash2 } from "lucide-react";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import apiRequestMessage from "@/apiRequest/message";
import { handleErrorApi } from "@/lib/utils";
import { useWebSocket } from "@/providers/web-socket-provider";
import { useEffect, useRef, useState } from "react";
import { useConversations } from "@/providers/conversation-provider";
import userApiResquest from "@/apiRequest/user";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  displayOrder: number;
  createdAt: string;
  deleted?: boolean;
};

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

type User = {
  displayName: string;
  online: boolean;
  image: string;
};

export default function Chat({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<ConversationItem | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  const userStored = localStorage.getItem("user");
  const userParsed = userStored ? JSON.parse(userStored) : null;

  const [input, setInput] = useState("");
  const ws = useWebSocket();

  const { conversations, setConversations } = useConversations();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!ws || !userParsed) return;

    const handler = async (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      if (payload.type !== "MESSAGE") return;

      const msg = payload.data;
      const senderId = msg.senderId;
      const receiverId = msg.receiverId;
      const { id } = await params;

      if (String(msg.senderId) === String(userParsed.id)) {
        return;
      }

      if (!senderId || !receiverId) {
        return;
      }

      const partnerId =
        String(senderId) === String(userParsed.id)
          ? receiverId || id
          : senderId;

      // neu dang mo doan chat thi append message
      if (String(partnerId) === String(id)) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: msg.id,
              senderId,
              receiverId,
              content: msg.content,
              displayOrder: msg.displayOrder,
              createdAt: msg.createdAt,
            },
          ];
        });
      }
    };

    ws.addEventListener("message", handler);
    return () => {
      ws.removeEventListener("message", handler);
    };
  }, [ws, userParsed?.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const { id } = await params;

    const tempMessage = {
      id: "temp-" + Date.now(),
      senderId: userParsed?.id || "",
      receiverId: selectedUser?.partner.id || id || "",
      content: input,
      displayOrder: messages.length + 1,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    if (loading) return;
    setLoading(true);
    try {
      const result = await apiRequestMessage.sendMessages({
        receiverId: selectedUser?.partner.id || id || "",
        content: tempMessage.content,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, ...result.data.data, isTemp: false }
            : msg,
        ),
      );
      setConversations((prev) => {
        const partnerId = selectedUser?.partner.id;

        if (!partnerId) return prev;

        const exist = prev.find(
          (c) => String(c.partner.id) === String(partnerId),
        );

        const newLastMessage = {
          content: input,
          createdAt: new Date().toISOString(),
          senderId: userParsed.id,
        };

        if (exist) {
          const others = prev.filter(
            (c) => String(c.partner.id) !== String(partnerId),
          );

          return [
            {
              ...exist,
              lastMessage: newLastMessage,
            },
            ...others,
          ];
        }

        return [
          {
            conversationId: result.data.data.conversationId,
            partner: {
              id: partnerId,
              displayName: selectedUser?.partner.displayName || "",
              online: true,
              image: "",
            },
            lastMessage: newLastMessage,
          },
          ...prev,
        ];
      });
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    } finally {
      setLoading(false);
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, deleted: true } : m)),
    );
    try {
      await apiRequestMessage.deleteMessage(messageId);
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, deleted: false } : m)),
      );
      handleErrorApi({ error, setError: () => {} } as any);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { id } = await params;

      setMessages([]);
      if (loading) return;
      setLoading(true);
      try {
        const result = await apiRequestMessage.getMessages(id);
        setMessages(result.data.data);
      } catch (error) {
        handleErrorApi({ error, setError: () => {} } as any);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [params]);

  useEffect(() => {
    const setUser = async () => {
      const { id } = await params;

      const conversation = conversations.find((c) => c.partner.id === id);
      if (conversation) {
        setSelectedUser(conversation);
      }
    };
    setUser();
  }, [conversations, params]);

  useEffect(() => {
    const fetchUser = async () => {
      const { id } = await params;
      try {
        const result = await userApiResquest.getUser(id);
        setUser(result.data.data);
      } catch (error) {
        handleErrorApi({ error, setError: () => {} } as any);
      }
    };
    fetchUser();
  }, [params]);

  return (
    <div className="w-full bg-[#f2f2f2] flex flex-col justify-between">
      {/* Header chat */}
      <div className="bg-white pl-4 pr-10 py-2 flex justify-between items-center border-b">
        <div className="flex gap-4">
          <Image src={"/Profile.svg"} alt="" width={46} height={46} />
          <div className="py-1">
            <p className="font-medium text-gray-700">
              {selectedUser?.partner.displayName || user?.displayName}
            </p>
            <div className="flex items-center gap-2">
              {selectedUser?.partner.online === true ? (
                <>
                  <div className="bg-green-500 w-2 h-2 rounded-full" />
                  <p className="font-normal text-gray-500 text-sm">Online</p>
                </>
              ) : (
                <>
                  <div className="bg-yellow-500 w-2 h-2 rounded-full" />
                  <p className="font-normal text-gray-500 text-sm">Offline</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Content chat */}
      <div className="h-full px-4 py-6 space-y-6 overflow-y-auto">
        {messages.map((message, index) => {
          const isMe = String(message.senderId) === String(userParsed?.id);

          const prevMessage = messages[index - 1];
          const showDateDivider =
            index === 0 || !isSameDay(message.createdAt, prevMessage.createdAt);

          return (
            <div key={message.id} className="space-y-2">
              {showDateDivider && <DateDivider date={message.createdAt} />}
              <div className={isMe ? "flex justify-end" : "flex gap-4"}>
                {!isMe && (
                  <Image src={"/Profile.svg"} alt="" width={36} height={60} />
                )}
                <HoverCard
                  openDelay={10}
                  closeDelay={90}
                  open={message.deleted ? false : !isMe ? false : undefined}
                >
                  <HoverCardTrigger asChild>
                    {message.deleted ? (
                      <p
                        className={
                          isMe
                            ? "text-gray-500 italic bg-[#85c1f7] p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl"
                            : "text-gray-500 italic bg-white p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl"
                        }
                      >
                        Tin nhắn đã bị xóa
                      </p>
                    ) : (
                      <div>
                        <div
                          className={
                            isMe
                              ? "bg-[#85c1f7] p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl"
                              : "bg-white p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl"
                          }
                        >
                          <p className={isMe ? "text-white" : ""}>
                            {message.content}
                          </p>
                          <span
                            className={
                              isMe
                                ? "text-xs font-light text-white"
                                : "text-xs font-light"
                            }
                          >
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    )}
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="w-auto p-2 cursor-pointer"
                    side={isMe ? "left" : "right"}
                    align="end"
                  >
                    <Trash2
                      className="size-4"
                      onClick={() => handleDeleteMessage(message.id)}
                    />
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {/* Footer chat */}
      <div className="bg-white flex items-end p-6 border-t">
        <InputGroup className="h-11">
          <InputGroupInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Nhập tin nhắn tới ${selectedUser?.partner.displayName || user?.displayName}...`}
          />
          <InputGroupAddon align={"inline-end"}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Smile className="size-6 cursor-pointer text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-6">
                <EmojiPicker
                  onEmojiClick={(emoji) =>
                    setInput((prev) => prev + emoji.emoji)
                  }
                  width={360}
                  height={350}
                />
              </DropdownMenuContent>
            </DropdownMenu>
            <Send
              className="size-6 cursor-pointer text-blue-300 "
              onClick={handleSend}
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
