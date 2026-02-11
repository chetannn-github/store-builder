import Navbar from "../_components/Navbar";

export default function NavLayout({ children }) {
  
  return (
    <html lang="en">
      <body>
        
          <Navbar/>
          
          {children}
       
      </body>
    </html>
  );
}
