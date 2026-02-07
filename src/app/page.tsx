"use client";

import apiRequest from "@/apiRequest/auth";
import apiRequestMessage from "@/apiRequest/message";
import DateDivider from "@/components/date-divider";
import {
  formatTime,
  isSameDay,
  isToday,
  isYesterday,
} from "@/components/formatTime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { handleErrorApi } from "@/lib/utils";
import { useWebSocket } from "@/providers/web-socket-provider";
import {
  HomeIcon,
  MessageCircleMore,
  PhoneCall,
  Search,
  Send,
  Settings,
  Smile,
  User,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiRequest.logout();
      toast.success("Đăng xuất thành công");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    }
  };

  type LastMessage = {
    content: string;
    createdAt: string;
    senderId: string;
  };

  type ConversationItem = {
    convetsationId: string;
    partner: {
      id: string;
      displayName: string;
      online: boolean;
      image: string;
    };
    lastMessage?: LastMessage;
  };

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await apiRequestMessage.getConversations();
        setConversations(result.data.data as ConversationItem[]);
      } catch (error) {
        handleErrorApi({ error, setError: () => {} } as any);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  type Message = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    displayOrder: number;
    createdAt: string;
  };

  const [selectedUser, setSelectedUser] =
    useState<ConversationItem["partner"]>();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSelectUser = async (user: ConversationItem["partner"]) => {
    setSelectedUser(user);
    setMessages([]);
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiRequestMessage.getMessages(user.id);
      setMessages(result.data.data);
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    } finally {
      setLoading(false);
    }
  };

  const userStored = localStorage.getItem("user");
  const userParsed = userStored ? JSON.parse(userStored) : null;

  const [input, setInput] = useState("");
  const ws = useWebSocket();

  useEffect(() => {
    if (!ws || !userParsed) return;

    ws.onmessage = (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      if (payload.type !== "MESSAGE") return;

      const msg = payload.data;
      const senderId = msg.senderId;
      const receiverId = msg.receiverId;

      if (!senderId || !receiverId) {
        return;
      }

      const partnerId =
        String(senderId) === String(userParsed.id) ? receiverId : senderId;

      setConversations((prev) => {
        const exists = prev.find((c) => c.partner.id === partnerId);

        if (!exists) return prev;

        return prev.map((c) =>
          c.partner.id === partnerId
            ? {
                ...c,
                lastMessage: {
                  content: msg.content,
                  createdAt: msg.createdAt,
                  senderId: senderId,
                },
              }
            : c,
        );
      });

      if (selectedUser && String(selectedUser.id) === String(partnerId)) {
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
    return () => {
      ws.onmessage = null;
    };
  }, [ws, selectedUser?.id, userParsed?.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const tempMessage = {
      id: "temp-" + Date.now(),
      senderId: userParsed?.id || "",
      receiverId: selectedUser?.id || "",
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
        receiverId: selectedUser?.id || "",
        content: tempMessage.content,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, ...result.data.data, isTemp: false }
            : msg,
        ),
      );
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

  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.partner.displayName
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-between bg-white shadow-[0px_0px_4px_2px_rgba(0,0,0,0.10)] px-4 py-6">
        <div className="space-y-10 flex flex-col items-center">
          <Image src={"/Logo.svg"} alt="Logo" width={40} height={40} />
          <div className="flex flex-col mt-8 space-y-8">
            <Tooltip>
              <TooltipTrigger className="bg-gray-200 p-2 rounded-sm cursor-pointer">
                <HomeIcon className="size-7" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Trang chủ</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="hover:bg-gray-200 p-2 rounded-sm cursor-pointer">
                <MessageCircleMore className="size-7" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tin nhắn</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="hover:bg-gray-200 p-2 rounded-sm cursor-pointer">
                <Search className="size-7" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tìm kiếm</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Tooltip>
                <TooltipTrigger>
                  <Settings className="size-7 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cài đặt</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-4 p-4">
              <DropdownMenuGroup className="space-y-2">
                <DropdownMenuItem className="gap-3">
                  <User className="size-5 text-black" />
                  <p>Thông tin tài khoản</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3">
                  <Settings className="size-5 text-black" />
                  <p>Cài đặt</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <p
                    className="text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="border-r w-84">
        <div className="flex items-center gap-4 border-b p-4">
          <InputGroup className="bg-gray-100">
            <InputGroupAddon>
              <Search className="size-5" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Tooltip>
            <TooltipTrigger>
              <UserRoundPlus className="text-gray-600 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm bạn</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="pt-1 px-4 space-y-2 h-screen overflow-y-auto w-80">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.partner.id}
              className="flex gap-4 p-2 cursor-pointer hover:bg-gray-100 hover:rounded-md"
              onClick={() => handleSelectUser(conversation.partner)}
            >
              {conversation.partner.image !== null ? (
                <Image
                  src={conversation.partner.image}
                  alt=""
                  width={46}
                  height={46}
                />
              ) : (
                <Image src={"/Profile.svg"} alt="" width={46} height={46} />
              )}

              <div className="w-full min-w-0">
                <div className="flex items-center justify-between w-full">
                  <p className="font-medium text-gray-700">
                    {conversation.partner.displayName}
                  </p>
                  <span className="font-normal text-gray-500 text-sm text-end">
                    {conversation.lastMessage
                      ? formatTime(conversation.lastMessage.createdAt)
                      : ""}
                  </span>
                </div>
                <div>
                  <p className="font-normal text-gray-500 text-sm truncate">
                    {conversation.lastMessage
                      ? String(conversation.lastMessage.senderId) ===
                        String(userParsed.id)
                        ? `Bạn: ${conversation.lastMessage.content}`
                        : conversation.lastMessage.content
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedUser !== undefined ? (
        <div className="w-full bg-[#f2f2f2] flex flex-col justify-between">
          {/* Header chat */}
          <div className="bg-white pl-4 pr-10 py-2 flex justify-between items-center border-b">
            <div className="flex gap-4">
              <Image src={"/Profile.svg"} alt="" width={46} height={46} />
              <div className="py-1">
                <p className="font-medium text-gray-700">
                  {selectedUser?.displayName}
                </p>
                <div className="flex items-center gap-2">
                  {selectedUser.online === true ? (
                    <>
                      <div className="bg-green-500 w-2 h-2 rounded-full" />
                      <p className="font-normal text-gray-500 text-sm">
                        Online
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="bg-yellow-500 w-2 h-2 rounded-full" />
                      <p className="font-normal text-gray-500 text-sm">
                        Offline
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="p-2 hover:bg-gray-100 flex items-center rounded-sm">
              <Tooltip>
                <TooltipTrigger>
                  <PhoneCall className="size-6 ml-auto cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cuộc gọi video</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {/* Content chat */}
          <div className="h-full px-4 py-6 space-y-6 overflow-y-auto">
            {messages.map((message, index) => {
              const isMe = String(message.senderId) === String(userParsed.id);

              const prevMessage = messages[index - 1];
              const showDateDivider =
                index === 0 ||
                !isSameDay(message.createdAt, prevMessage.createdAt);

              return (
                <div key={message.id} className="space-y-2">
                  {showDateDivider && <DateDivider date={message.createdAt} />}
                  <div className={isMe ? "flex justify-end" : "flex gap-4"}>
                    {!isMe && (
                      <Image
                        src={"/Profile.svg"}
                        alt=""
                        width={36}
                        height={60}
                      />
                    )}
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
      ) : (
        <div className="flex flex-col justify-center items-center w-full space-y-8">
          <Image src={"/Hello.svg"} alt="Hello" width={200} height={200} />
          <h2 className="font-bold text-2xl">Chào mừng đến với Chat Smart</h2>
          <p>Khám phá tiện ích và gửi tin nhắn riêng cho bạn bè.</p>
        </div>
      )}
    </div>
  );
}
