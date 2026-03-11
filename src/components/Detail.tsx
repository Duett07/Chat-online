'use client';

import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { formatDate } from "./formatTime";
import { User } from "./add-friend";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Detail({
  users,
  onClose,
}: {
  users: User[] | null;
  onClose?: () => void;
}) {

  return (
    <>
      {users &&
        users?.map((item) => (
          <div key={item.displayName} className="space-y-4">
            <AspectRatio ratio={16 / 6}>
              <Image
                src={"/bg.webp"}
                alt="Background profile"
                className="object-cover rounded-xs"
                fill
              />
            </AspectRatio>
            <div className="flex items-center gap-6 font-medium">
              <Image
                src={"/Profile.svg"}
                alt="Profile"
                width={60}
                height={60}
              />
              <h2>{item.displayName}</h2>
            </div>
            <div className="flex">
              <Link
                href={`/chat/${item.id}`}
                className="w-full cursor-pointer bg-[#f3f3f3] hover:bg-[#eaeaea] p-2 rounded-sm text-center"
                onClick={onClose}
              >
                Nhắn tin
              </Link>
            </div>
            <hr />
            <div className="flex flex-col space-y-4">
              <h2 className="font-medium">Thông tin cá nhân</h2>
              <div className="flex ">
                <p className="font-light w-34">Giới tính</p>
                <p>
                  {item.gender
                    ? item.gender === "Male"
                      ? "Nam"
                      : "Nữ"
                    : "..."}
                </p>
              </div>
              <div className="flex ">
                <p className="font-light w-34">Ngày sinh</p>
                <p>
                  {item.dateOfBirth === null
                    ? "dd/mm/yyyy"
                    : formatDate(String(item.dateOfBirth))}
                </p>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
