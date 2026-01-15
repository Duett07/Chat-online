import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Path, UseFormSetError } from "react-hook-form";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = <T extends Record<string, any>>({
  error,
  setError,
  duration,
}: {
  error: any;
  setError: UseFormSetError<T>;
  duration?: number;
}) => {
  if (error instanceof EntityError) {
    error.payload.errors.forEach((item) => {
      setError(item.field as Path<T>, {
        type: "server",
        message: item.message,
      });
    });
    return;
  } else if ((error as any)?.response?.status === 401) {
    toast.error("Error", {
      description:
        (error as any)?.response.data.message || "Vui lòng đăng nhập",
      duration: 5000,
    });
    return;
  } else {
    toast.error("Error", {
      description:
        (error as any)?.response?.data?.message ||
        "Đã có lỗi xảy ra, vui lòng thử lại",
      duration: duration ?? 5000,
    });
  }
};

/**
 * Delete '/' first
 */

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
};
