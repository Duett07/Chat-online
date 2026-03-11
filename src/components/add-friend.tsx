import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "./ui/alert-dialog";
import userApiResquest from "@/apiRequest/user";
import { handleErrorApi } from "@/lib/utils";
import Search from "./Search";
import Detail from "./Detail";
import { ChevronLeft } from "lucide-react";

export type User = {
  id: string;
  displayName: string;
  gender: string;
  dateOfBirth: string;
  avatar?: string;
};

export default function AddFriend({
  action,
  onClose,
}: {
  action: boolean;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [user, setUser] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"search" | "detail">("search");

  const handleSearch = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await userApiResquest.findUser(value);
      setUser(result.data.data);
    } catch (error) {
      handleErrorApi({ error, setError: () => {} } as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={action} onOpenChange={onClose}>
      <AlertDialogContent className="w-sm">
        <AlertDialogHeader className="flex justify-between">
          {mode === "detail" ? (
            <div className="flex gap-4 items-center">
              <ChevronLeft
                className="size-4 cursor-pointer"
                onClick={() => setMode("search")}
              />
              <h1 className="font-bold">Thông tin tài khoản</h1>
            </div>
          ) : (
            <h1 className="font-bold">Thêm bạn</h1>
          )}
          <p onClick={onClose} className="cursor-pointer">
            X
          </p>
        </AlertDialogHeader>
        {mode === "search" ? (
          <Search
            onDetail={() => setMode("detail")}
            user={user}
            onClose={onClose}
            setValue={setValue}
            handleSearch={handleSearch}
          />
        ) : (
          <Detail users={user} onClose={onClose} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
