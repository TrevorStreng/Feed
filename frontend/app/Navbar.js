import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full mb-8 flex justify-between items-center bg-blue-500 text-white p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold hover:text-gray-300">
        Feed
      </Link>
      <div className="flex space-x-4">
        <Link href="/notifications" className="hover:text-gray-300">
          Notifications
        </Link>
        <Link href="/login" className="hover:text-gray-300">
          Login
        </Link>
      </div>
    </header>
  );
}
