import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

interface MobileMenuProps {
  visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (!visible) return null;
  return (
    <div className="md:hidden fixed z-50 w-screen h-screen bg-white bg-opacity-90 overscroll-auto overflow-y-scroll">
      <div className="flex flex-col gap-28 justify-center h-screen items-center">
        <button className="w-full h-10">
          <p>Test</p>
        </button>
        <button className="w-full h-10">
          <p>Test</p>
        </button>
        <button className="w-full h-10">
          <p>Test</p>
        </button>
        <button className="w-full h-10">
          <p>Test</p>
        </button>
        {session ? (
          <button
            onClick={() => signOut()}
            type="button"
            className=" bg-cyan-500 w-4/5 border-2 border-cyan-500 h-12 items-center font-semibold text-white hover:bg-cyan-800 hover:text-white hover:border-cyan-800"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => router.push('/auth')}
            type="button"
            className=" bg-cyan-500 w-4/5 border-2 border-cyan-500 h-12 items-center font-semibold text-white hover:bg-cyan-800 hover:text-white hover:border-cyan-800"
          >
            Login / Register
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
