"use client";

import apiRequest from "@/apiRequest/auth";
import apiRequestMessage from "@/apiRequest/message";
import { formatTime } from "@/components/formatTime";
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
  Search,
  Settings,
  User,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import Profile from "@/components/profile";
import AddFriend from "@/components/add-friend";
import Link from "next/link";
import { useConversations } from "@/providers/conversation-provider";
import { useAppContext } from "@/providers/app-provider";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";

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

export default function Sidebar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userStored = localStorage.getItem("user");
  const userParsed = userStored ? JSON.parse(userStored) : null;
  const [open, setOpen] = useState(false);
  const { conversations, setConversations } = useConversations();
  const ws = useWebSocket();
  const { setUser } = useAppContext();

  const handleLogout = async () => {
    try {
      await apiRequest.logout();
      toast.success("Đăng xuất thành công");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    }
  };

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

  const filteredConversations = conversations.filter((conversation) =>
    conversation.partner.displayName
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleAddFriendOpen = (action: boolean) => {
    setAddFriendOpen(action);
  };

  const handleOpen = (action: boolean) => {
    setOpen(action);
  };

  useEffect(() => {
    if (!ws || !userParsed) return;

    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type !== "MESSAGE") return;

      const msg = data.data;

      const isSender = String(msg.senderId) === String(userParsed.id);
      const partnerId = isSender ? msg.receiverId : msg.senderId;

      const newLastMessage = {
        content: msg.content,
        createdAt: msg.createdAt,
        senderId: msg.senderId,
      };

      setConversations((prev) => {
        const exist = prev.find(
          (conv) => String(conv.partner.id) === String(partnerId),
        );

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
            conversationId: msg.conversationId,
            partner: {
              id: partnerId,
              displayName: isSender
                ? msg.receiverName || "Unknown"
                : msg.senderName || "Unknown",
              online: true,
              image: "",
            },
            lastMessage: newLastMessage,
          },
          ...prev,
        ];
      });
    };
    ws.addEventListener("message", handler);

    return () => {
      ws.removeEventListener("message", handler);
    };
  }, [ws, userParsed?.id, userParsed, setConversations]);

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await apiRequestMessage.deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((c) => c.conversationId !== conversationId),
      );
      router.push("/");
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between bg-white shadow-[0px_0px_4px_2px_rgba(0,0,0,0.10)] px-4 py-6">
        <div className="space-y-10 flex flex-col items-center">
          <Image src={"/Logo.svg"} alt="Logo" width={50} height={50} />
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Settings className="size-7 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cài đặt</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-4 p-4">
              <DropdownMenuGroup className="space-y-2">
                <DropdownMenuItem
                  className="gap-3 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => handleOpen(true)}
                >
                  <User className="size-5 text-black" />
                  <p>Thông tin tài khoản</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <p
                    className="text-red-600 cursor-pointer hover:text-red-800 rounded-md"
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
            <TooltipTrigger onClick={() => handleAddFriendOpen(true)}>
              <UserRoundPlus className="text-gray-600 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm bạn</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="pt-1 px-4 space-y-2 h-screen overflow-y-auto w-80">
          {filteredConversations.map((conversation) => (
            <ContextMenu key={conversation.partner.id}>
              <ContextMenuTrigger className="flex gap-4 p-2 cursor-pointer hover:bg-gray-100 hover:rounded-md">
                <Link
                  href={`/chat/${conversation.partner.id}`}
                  className="flex gap-4 w-full"
                >
                  {conversation.partner.image !== null &&
                  conversation.partner.image !== "" ? (
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
                      {conversation.lastMessage?.isDeleted ? (
                        <p className="font-normal text-gray-500 text-sm truncate">
                          {conversation.lastMessage
                            ? String(conversation.lastMessage.senderId) ===
                              String(userParsed?.id)
                              ? "Bạn: Tin nhắn đã bị xóa"
                              : "Tin nhắn đã bị xóa"
                            : ""}
                        </p>
                      ) : (
                        <p className="font-normal text-gray-500 text-sm truncate">
                          {conversation.lastMessage
                            ? String(conversation.lastMessage.senderId) ===
                              String(userParsed?.id)
                              ? `Bạn: ${conversation.lastMessage.content}`
                              : conversation.lastMessage.content
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent
                className="p-2 text-sm text-red-600 cursor-pointer"
                onClick={() =>
                  handleDeleteConversation(conversation.conversationId)
                }
              >
                Xóa hội thoại
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
      <Profile
        action={open}
        onClose={() => setOpen(false)}
        image={userParsed?.avatar}
      />
      <AddFriend
        action={addFriendOpen}
        onClose={() => setAddFriendOpen(false)}
      />
    </>
  );
}
