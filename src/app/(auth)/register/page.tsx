"use client";

import apiRequest from "@/apiRequest/auth";
import { registerBody, RegisterSchema } from "@/app/schemaValidations/auth.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerBody) });

  const onSubmit = async (data: RegisterSchema) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiRequest.register(data);
      toast.success(result.data.message);
      router.push("/login");
    } catch (error) {
      handleErrorApi<RegisterSchema>({
        error,
        setError,
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center pt-20">
      <Card className="bg-white p-8 shadow-[0px_0px_4px_2px_rgba(0,0,0,0.10)] rounded-lg space-y-6 w-lg">
        <CardHeader className="flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-2xl">
            <Image src={"/Logo.svg"} alt="Logo" width={40} height={40} />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-2xl">Đăng ký tài khoản</h1>
            <p className="text-gray-500 text-sm">
              Tạo tài khoản mới để bắt đầu
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="">
                Tên người dùng<span className="text-red-500">*</span>
              </Label>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="Nhập tên người dùng"
                  {...register("username")}
                />
              </InputGroup>
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="">
                Mật khẩu<span className="text-red-500">*</span>
              </Label>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••••"
                  {...register("password")}
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    onClick={() => setShowPassword((v) => !v)}
                    variant={"ghost"}
                    className="cursor-pointer"
                  >
                    {showPassword ? (
                      <Eye className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="">
                Xác nhận mật khẩu<span className="text-red-500">*</span>
              </Label>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="•••••••••"
                  {...register("confirmPassword")}
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    variant={"ghost"}
                    className="cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <Eye className="size-5" />
                    ) : (
                      <EyeOff className="size-5" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              className="w-full h-11 rounded-xl bg-blue-500 font-medium hover:bg-blue-600 cursor-pointer"
            >
              Đăng ký
            </Button>
            <div className="flex justify-between items-center gap-2">
              <hr className="w-1/2" />
              <span className="text-xs text-gray-500">hoặc</span>
              <hr className="w-1/2" />
            </div>
            <div className="flex justify-center gap-1">
              <p className="text-sm text-gray-600 font-medium">
                Đã có tài khoản?
              </p>
              <Link href="/login" className="text-blue-600 font-medium text-sm">
                Đăng nhập ngay
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
