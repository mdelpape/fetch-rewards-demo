'use client';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function Header() {
  const { logout } = useAuth();
  const { triggerToast } = useToast();
  const handleLogout = async () => {
    await logout();
    triggerToast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <header className="row-start-1 flex justify-between items-center w-full p-4 bg-gray- text-white">
      <h1 className="text-xl">Dashboard</h1>
      <Button onClick={handleLogout} className="bg-red-400 px-4 py-2 rounded hover:bg-red-500 hover:shadow-md hover:cursor-pointer w-12 justify-center flex">
        Logout
      </Button>
    </header>
  );
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}