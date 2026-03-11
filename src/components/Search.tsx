import { User } from "./add-friend";
import {
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

export default function Search({
  onDetail,
  user,
  onClose,
  setValue,
  handleSearch,
}: {
  onDetail: () => void;
  user: User[] | null;
  onClose: () => void;
  setValue: (value: string) => void;
  handleSearch: () => void;
}) {
  return (
    <>
      <div className="h-70">
        <Input
          placeholder="Tên người dùng"
          type="text"
          onChange={(e) => setValue(e.target.value)}
        />
        {user && user.length > 0 ? (
          <div
            className="mt-4 bg-[#f9f9f9] p-2 rounded-sm hover:bg-[#e6e5e5]"
            onClick={onDetail}
          >
            {user.map((item) => (
              <div
                key={item.displayName}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Image
                  src={"/Profile.svg"}
                  alt="avatar"
                  width={40}
                  height={40}
                />
                <p>{item.displayName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="flex justify-center mt-6 text-sm">
            Không có kết quả tìm kiếm
          </p>
        )}
      </div>
      <AlertDialogFooter>
        <Button
          variant={"secondary"}
          className="cursor-pointer hover:bg-[#d5d4d4]"
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          variant={"default"}
          className="hover:bg-black/80 cursor-pointer"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </AlertDialogFooter>
    </>
  );
}
