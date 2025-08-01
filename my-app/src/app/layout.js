import "./globals.css";

export const metadata = {
  title: "API Manager - Manage Your API Keys",
  description: "A modern API key management dashboard built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
