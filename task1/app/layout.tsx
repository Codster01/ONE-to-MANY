import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ButtonAppBar from "@/components/ui/ButtonAppBar";
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Providers from "@/components/ui/Providers";
import SignInButton from "@/components/ui/SignInButton";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/ui/Layout";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
        <Providers>
      <body className={inter.className}>
      <ToastContainer />
        <NextTopLoader color="#fff" />
        {children}</body>
        </Providers>
    </html>
   
  );
}
