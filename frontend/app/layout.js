import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './Footer';
import Navbar from './Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Feed',
  description: 'Welcome to Feed!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
