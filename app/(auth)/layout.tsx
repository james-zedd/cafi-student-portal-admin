import Image from "next/image";
import loginBg from "@/public/images/admin_bg_1.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen justify-center md:justify-start md:pl-[100px]">
      <Image
        src={loginBg}
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0" />
      <div className="relative flex w-full min-w-[200px] max-w-sm">
        {children}
      </div>
    </main>
  );
}
