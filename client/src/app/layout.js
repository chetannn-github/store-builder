import Navbar from "./_components/Navbar";
import { AuthProvider } from "./_hooks/useAuth";
import "./globals.css";



export const metadata = {
  title: "Store Builder",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
