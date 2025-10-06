// src/app/layout.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import RootProvider from "./RootProvider";
import NewUpdatesMsg from "@/components/NewUpdatesMsg";

export const metadata = {
  title: "TrendiKala",
  description: "Best online store for fashion products",
};

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "About Us", path: "/about-us" },
  { name: "Manufacturing", path: "/manufacturing" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
           <NewUpdatesMsg/> 
          <Navbar links={navLinks} />
          <main className="">{children}</main>
          <Footer />
        </RootProvider>
      </body>
    </html>
  );
}
