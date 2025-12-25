import type { Metadata } from "next";
import { Baloo_Da_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const baloo_da = Baloo_Da_2({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prueba técnica - Appinit",
  description: "Gestión de ingresos y gastos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={baloo_da.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}