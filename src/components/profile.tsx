"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { ChevronLeft, PenLine } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import userApiResquest from "@/apiRequest/user";
import { handleErrorApi } from "@/lib/utils";
import { formatDate, formatTime } from "./formatTime";
import { useRouter } from "next/navigation";

type User = {
  displayName: string;
  gender: string;
  dateOfBirth: string;
  avatar?: string;
};

export default function Profile({
  action,
  onClose,
}: {
  action: boolean;
  onClose: () => void;
  image?: string;
}) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await userApiResquest.getProfile();
        setUser(result.data.data);
      } catch (error) {
        handleErrorApi({ error, setError: () => {} } as any);
      }
    };
    fetchUserProfile();
    router.refresh();
  }, []);

  return (
    <div className="flex justify-center">
      <AlertDialog open={action} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex justify-between">
            <div className="flex gap-2">
              {mode === "edit" && (
                <ChevronLeft
                  className="cursor-pointer"
                  onClick={() => setMode("view")}
                />
              )}
              <h1 className="font-bold">
                {mode === "view"
                  ? "Thông tin tài khoản"
                  : "Cập nhật thông tin cá nhân"}
              </h1>
            </div>
            <p onClick={onClose} className="cursor-pointer">
              X
            </p>
          </AlertDialogHeader>
          {mode === "view" ? (
            <View onEdit={() => setMode("edit")} user={user} />
          ) : (
            <Edit
              onCancel={() => setMode("view")}
              user={user}
              onUpdate={(newUser) => setUser(newUser)}
            />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function View({ onEdit, user }: { onEdit: () => void; user?: User }) {
  return (
    <>
      <AspectRatio ratio={16 / 6}>
        <Image
          src={"/bg.webp"}
          alt="Background profile"
          className="object-cover rounded-xs"
          fill
        />
      </AspectRatio>
      <div className="flex items-center gap-6 font-medium">
        <Image src={"/Profile.svg"} alt="Profile" width={60} height={60} />
        <h2>{user?.displayName}</h2>
      </div>
      <hr />
      <div className="flex flex-col space-y-4">
        <h2 className="font-medium">Thông tin cá nhân</h2>
        <div className="flex ">
          <p className="font-light w-34">Giới tính</p>
          <p>
            {user?.gender ? (user?.gender === "Male" ? "Nam" : "Nữ") : "..."}
          </p>
        </div>
        <div className="flex ">
          <p className="font-light w-34">Ngày sinh</p>
          <p>
            {user?.dateOfBirth === null
              ? "dd/mm/yyyy"
              : formatDate(String(user?.dateOfBirth))}
          </p>
        </div>
      </div>
      <hr />
      <Button
        variant={"default"}
        className="cursor-pointer bg-white text-black font-bold text-md hover:bg-gray-100"
        onClick={onEdit}
      >
        <PenLine className="size-5" />
        Cập nhật
      </Button>
    </>
  );
}

function Edit({
  onCancel,
  user,
  onUpdate,
}: {
  onCancel: () => void;
  user?: User;
  onUpdate: (user: User) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(user?.gender || "");

  const handleUpdateProfile = async () => {
    try {
      const result = await userApiResquest.updateProfile({
        displayName: inputValue,
        gender: gender,
        dateOfBirth: dateOfBirth,
      });
      onUpdate(result.data.data);
      onCancel();
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Tên hiển thị</Label>
        <Input
          type="text"
          defaultValue={user?.displayName}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div className="mt-2 space-y-8">
        <h2 className="font-medium">Thông tin cá nhân</h2>
        <div className="space-y-4">
          <Label>Giới tính</Label>
          <RadioGroup
            defaultValue={user?.gender}
            className="flex gap-10"
            value={gender}
            onValueChange={(value) => setGender(value)}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Male"
                id="male"
                className="cursor-pointer"
              />
              <Label htmlFor="male">Nam</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="Female"
                id="female"
                className="cursor-pointer"
              />
              <Label htmlFor="female">Nữ</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-4">
          <Label>Ngày sinh</Label>
          <Input
            type="date"
            defaultValue={formatDate(String(user?.dateOfBirth))}
            className="cursor-pointer"
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant={"default"}
          className="cursor-pointer"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          variant={"outline"}
          className="cursor-pointer"
          onClick={handleUpdateProfile}
        >
          Lưu
        </Button>
      </div>
    </>
  );
}
