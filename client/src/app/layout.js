import Navbar from "./_components/Navbar";
import { AuthProvider } from "./_hooks/useAuth";
import "./globals.css";
import { Toaster } from "react-hot-toast";


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
          <Toaster
          position="top-right"
          toastOptions={{
            
            style: {
              background: 'hsl(var(--card))',     
              color: 'hsl(var(--foreground))',  
              border: '1px solid hsl(var(--border))', 
              padding: '12px 16px',
              fontFamily: "'Space Grotesk', sans-serif", 
              fontSize: '14px',
            },

            
            success: {
              iconTheme: {
                primary: 'hsl(var(--success))', 
                secondary: 'hsl(var(--foreground))',
              },
              style: {
                border: '1px solid hsl(var(--success) / 0.2)', 
              }
            },

            error: {
              iconTheme: {
                primary: 'hsl(var(--destructive))',
                secondary: 'hsl(var(--foreground))',
              },
              style: {
                border: '1px solid hsl(var(--destructive) / 0.2)',
              }
            },
          }}
        />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
