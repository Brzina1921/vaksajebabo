import React from 'react';
import { signOut, useSession } from 'next-auth/react';

interface AccountMenuProps {
  visible?: boolean;
  innerRef?: any;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible, innerRef }) => {
  const { data: session, status } = useSession();
  if (!visible) return null;
  return (
    <div
      ref={innerRef}
      className="bg-white w-56 absolute top-12 right-0 py-5 flex-col border-2 border-gray-800 flex"
    >
      <div className="flex justify-center">
        <img className="w-12 rounded-md" src="../images/avatar.png" alt="" />
      </div>
      <div className="px-4 py-3 justify-center">
        <span className="block text-sm text-gray-900">{session?.user?.name}</span>
        <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
          {session?.user?.email}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="px-3 group/item flex flex-col gap-3 items-center w-full">
          <p className="text-black text-sm group-hover/item:underline cursor-pointer">
            Username
          </p>
          <p className="text-black text-sm group-hover/item:underline cursor-pointer">
            Username
          </p>
          <p className="text-black text-sm group-hover/item:underline cursor-pointer">
            Username
          </p>
          <p className="text-black text-sm group-hover/item:underline cursor-pointer">
            Username
          </p>
          <p className="text-black text-sm group-hover/item:underline cursor-pointer">
            Username
          </p>
        </div>
        <button
          onClick={() => signOut()}
          type="button"
          className=" bg-blue-500 w-full border-2 border-cyan-500 h-12 items-center px-3 font-semibold text-white hover:bg-cyan-800 hover:text-white hover:border-cyan-800"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AccountMenu;
