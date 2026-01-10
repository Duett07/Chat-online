import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/register"} className="text-blue-700">Register</Link>
    </div>
  );
}
