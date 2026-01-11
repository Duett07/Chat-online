import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import {
  CircleUserRound,
  Dot,
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
import Link from "next/link";

export default function Home() {
  const conversations = [
    {
      id: 1,
      name: "Nguyen Van A",
      lastMessage: "kajfldk kajsdlf kajdlfk klajs asdf asdf asf",
      time: "7 giờ",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 2,
      name: "Tran Thi B",
      lastMessage: "Hello! How are you?",
      time: "1 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 3,
      name: "Le Van C",
      lastMessage: "Let's catch up later.",
      time: "2 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 4,
      name: "Pham Thi D",
      lastMessage: "See you tomorrow!",
      time: "3 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 5,
      name: "Hoang Van E",
      lastMessage: "Good night!",
      time: "5 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 6,
      name: "Nguyen Van F",
      lastMessage: "See you tomorrow!",
      time: "3 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 7,
      name: "Tran Thi G",
      lastMessage: "Good night!",
      time: "5 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 8,
      name: "Le Van H",
      lastMessage: "See you tomorrow!",
      time: "3 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 9,
      name: "Pham Thi I",
      lastMessage: "Good night!",
      time: "5 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 10,
      name: "Hoang Van J",
      lastMessage: "See you tomorrow!",
      time: "3 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 11,
      name: "Nguyen Van K",
      lastMessage: "Good night!",
      time: "5 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 12,
      name: "Tran Thi L",
      lastMessage: "See you tomorrow!",
      time: "3 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 13,
      name: "Le Van M",
      lastMessage: "Good night!",
      time: "5 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
    {
      id: 14,
      name: "Pham Thi N",
      lastMessage: "See you tomorrow!",
      time: "3 ngày",
      avatar: "/Profile.svg",
      isOnline: false,
    },
    {
      id: 15,
      name: "Hoang Van O",
      lastMessage: "Good night!",
      time: "5 ngày",
      avatar: "/Profile.svg",
      isOnline: true,
    },
  ];
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
                  <p className="text-red-600">Đăng xuất</p>
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
            <InputGroupInput placeholder="Tìm kiếm" />
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
        <div className="pt-1 px-4 space-y-2 h-screen overflow-y-auto">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="flex gap-4 p-2">
              <Image src={conversation.avatar} alt="" width={46} height={46} />
              <div className="w-full min-w-0">
                <div className="flex items-center justify-between w-full">
                  <p className="font-medium text-gray-700">
                    {conversation.name}
                  </p>
                  <span className="font-normal text-gray-500 text-sm text-end">
                    {conversation.time}
                  </span>
                </div>
                <div>
                  <p className="font-normal text-gray-500 text-sm truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full bg-[#f2f2f2] flex flex-col justify-between">
        {/* Header chat */}
        <div className="bg-white pl-4 pr-10 py-2 flex justify-between items-center border-b">
          <div className="flex gap-4">
            <Image src={"/Profile.svg"} alt="" width={46} height={46} />
            <div className="py-1">
              <p className="font-medium text-gray-700">Nguyen Van A</p>
              <div className="flex items-center gap-2">
                <div className="bg-green-500 w-2 h-2 rounded-full" />
                <p className="font-normal text-gray-500 text-sm">Online</p>
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
          <div className="flex justify-center">
            <p className="bg-[#d0d0d0] text-white px-6 py-1 rounded-2xl text-xs">
              Hôm qua
            </p>
          </div>
          <div className="flex gap-4">
            <Image src={"/Profile.svg"} alt="" width={36} height={60} />
            <div className="bg-white p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)]">
              <p>Hello ban</p>
              <span className="text-xs font-light">10:00</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-[#85c1f7] p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)]">
              <p className="text-white">Lo loooooo</p>
              <span className="text-xs font-light text-white">10:02</span>
            </div>
          </div>
          <div className="flex justify-center">
            <p className="bg-[#d0d0d0] text-white px-6 py-1 rounded-2xl text-xs">
              Hôm nay
            </p>
          </div>
          <div className="flex gap-4">
            <Image src={"/Profile.svg"} alt="" width={36} height={60} />
            <div className="bg-white p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias voluptates tempore ea explicabo animi impedit
                eligendi? Porro voluptatibus reiciendis doloribus unde aut
                quaerat odio minus nisi fugiat id, alias eius? Pariatur
                cupiditate dignissimos eaque illum nostrum unde dicta
                perspiciatis? Ratione debitis aspernatur adipisci velit, unde ad
                iure, distinctio esse nostrum illum, fugit neque accusamus
                repellendus reprehenderit exercitationem repellat impedit porro.
              </p>
              <span className="text-xs font-light">10:00</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-[#85c1f7] p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl">
                <p className="text-white">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  unde alias magnam, pariatur vel tempore quibusdam iste, saepe,
                  facilis natus repellat officia deleniti consequuntur sit
                  eveniet fugiat eaque. Vel, itaque? Aut, minus repellat nam
                  nemo maiores doloribus ipsa alias vitae soluta non, ipsum
                  voluptate sunt eaque perferendis enim et aspernatur.
                  Repellendus, deleniti quod! Nam nulla suscipit ad laboriosam
                  fugiat rem.
                </p>
                <span className="text-xs font-light text-white">10:02</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#85c1f7] p-2 rounded-sm shadow-[0px_1px_0px_0px_rgba(0,0,0,0.20)] max-w-2xl">
                <p className="text-white">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  unde alias magnam, pariatur vel tempore quibusdam iste, saepe,
                  facilis natus repellat officia deleniti consequuntur sit
                  eveniet fugiat eaque. Vel, itaque? Aut, minus repellat nam
                  nemo maiores doloribus ipsa alias vitae soluta non, ipsum
                  voluptate sunt eaque perferendis enim et aspernatur.
                  Repellendus, deleniti quod! Nam nulla suscipit ad laboriosam
                  fugiat rem.
                </p>
                <span className="text-xs font-light text-white">10:02</span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer chat */}
        <div className="bg-white flex items-end p-6 border-t">
          <InputGroup className="h-11">
            <InputGroupInput />
            <InputGroupAddon align={"inline-end"}>
              <Smile className="size-6 cursor-pointer text-gray-700" />
              <Send className="size-6 cursor-pointer text-blue-300 " />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
