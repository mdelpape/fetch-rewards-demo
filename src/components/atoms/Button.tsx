'use client';
import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, onClick, ...props }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log('Button clicked');
    setLoading(true);

    if (onClick) {
      await onClick(e); // Ensure it's an async function
    }

    setLoading(false);
  };

  return (
    <button {...props} onClick={handleClick} disabled={loading}>
      {loading ? <Loader className='animate-spin'/> : children}
    </button>
  );
}
