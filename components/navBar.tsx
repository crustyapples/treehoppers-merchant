import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function NavBar() {
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  return (
    <>
      <nav className="bg-green-400 py-6 flex flex-wrap items-center justify-center dark:bg-[#121212]">
      <Link
          className={`px-4 py-2 text-white rounded-lg hover:bg-green-100 hover:text-gray-500 transition-all ${
            router.pathname === "/landingPage"
              ? "text-white font-bold dark:text-white"
              : "text-white dark:text-gray-400"
          }`}
          href="/landingPage"
        >
          Home
        </Link>        
      <Link
          className={`px-4 py-2 text-white rounded-lg hover:bg-green-100 hover:text-gray-500 transition-all ${
            router.pathname === "/addCoupon"
              ? "text-white font-bold dark:text-white"
              : "text-white dark:text-gray-400"
          }`}
          href="/addCoupon"
        >
          Add Coupon
        </Link>
        <Link
          className={`px-4 py-2 text-white rounded-lg hover:bg-green-100 hover:text-gray-500 transition-all ${
            router.pathname === "/"
              ? "text-white font-bold dark:text-white"
              : "text-white dark:text-gray-400"
          }`}
          href="/"
        >
          Dashboard
        </Link>

        <Link
          className={`px-4 py-2 text-white rounded-lg hover:bg-green-100 hover:text-gray-500 transition-all ${
            router.pathname === "/pending"
              ? "text-white font-bold dark:text-white"
              : "text-white dark:text-gray-400"
          }`}
          href="/pending"
        >
          Pending Claims
        </Link>

        <WalletMultiButtonDynamic />


        {/* <div className="px-4 py-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-300 transition-all "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-gray-800 dark:text-gray-200"
            >
              {theme === "dark" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              )}
            </svg>
          </button>
        </div> */}
      </nav>
    </>
  );
}

import React from "react";
