import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center w-full space-y-8">
      <Image src={"/Hello.svg"} alt="Hello" width={200} height={200} />
      <h2 className="font-bold text-2xl">Chào mừng đến với Chat Smart</h2>
      <p>Khám phá tiện ích và gửi tin nhắn riêng cho bạn bè.</p>
    </div>
  );
}
