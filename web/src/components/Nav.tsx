"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-lg shadow-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold hover:scale-105 transition-transform">
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
        <nav className="hidden md:flex items-center gap-2 text-sm text-slate-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-200 hover:text-cyan-300",
                pathname === link.href && "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ConnectButton />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
          <nav className="flex flex-col p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200",
                  pathname === link.href && "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <ConnectButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

