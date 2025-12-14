"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/kyc", label: "KYC" },
  { href: "/mint", label: "Mint" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
          <Image 
            src="/image.png" 
            alt="OblivionID Logo" 
            width={40} 
            height={40}
            className="object-contain"
            priority
          />
          <div className="flex flex-col">
            <span className="gradient-text">OblivionID</span>
            <span className="text-xs text-slate-400">zkPassport</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-slate-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-3 py-1 rounded-full hover:bg-white/10 transition",
                pathname === link.href && "bg-white/10 border border-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

