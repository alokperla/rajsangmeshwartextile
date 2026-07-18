import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import CartSidebar from "../components/CartSidebar";
import ToastContainer from "../components/Toast";

export const metadata: Metadata = {
  title: "Rajsangmeshwar Textile – Premium Home Linens, SOLAPUR",
  description:
    "Quality cotton towels, bedsheets, napkins and home linens from Rajsangmeshwar Textile, Solapur. Retail & bulk B2B orders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <AnnouncementBar />
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <CartSidebar />
        <ToastContainer />
      </body>
    </html>
  );
}
