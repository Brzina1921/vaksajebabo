import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { BsChevronDown } from 'react-icons/bs';
import { HiMenu } from 'react-icons/hi';
import { IoMdAdd } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';

import NavbarItem from './NavbarItem';
import AccountMenu from './AccountMenu';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accountMenu, setAccountMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const ref = useRef<HTMLDivElement>();

  // const node = ref.current;
  // const handleClickOutside = (event: any) => {
  //   if (node?.contains(event.target)) {
  //     setAccountMenu(false);
  //   }
  // };
  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  return (
    <>
      <MobileMenu visible={mobileMenu} />
      {mobileMenu && (
        <div className="absolute pt-6 pl-6 z-50 md:hidden">
          <button onClick={() => setMobileMenu(false)}>
            <GrClose className="cursor-pointer" size={30} />
          </button>
        </div>
      )}
      <nav className="bg-white fixed z-40 w-full">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="relative md:hidden">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              type="button"
              id="mobile"
              className={`items-center p-2 text-sm rounded-md focus:outline-none focus:ring-gray-600 text-black ${
                mobileMenu && 'text-white'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              <HiMenu className="text" size={30} />
            </button>
          </div>
          <div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center"
            >
              <img
                src="../images/logo-1.png"
                className="h-10 md:h-11"
                alt="Logo"
              />
            </button>
          </div>
          <div className="flex items-center md:order-2">
            {session?.user && (
              <>
                <button
                  onClick={() => router.push('/nekretnina/nova')}
                  type="button"
                  className="hidden bg-blue-500 lg:flex mr-5 rounded md:mr-5 border-2 border-blue-500 h-12 items-center px-3 font-semibold text-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
                >
                  Dodaj nekretninu
                </button>
                <button
                  onClick={() => router.push('/nekretnina/nova')}
                  type="button"
                  className="bg-blue-500 lg:hidden rounded-md mr-5 border-2 border-blue-500 h-9 px-1 items-center font-semibold text-white"
                >
                  <IoMdAdd size={25} />
                </button>
              </>
            )}
            {session?.user ? (
              <div className="relative">
                <AccountMenu visible={accountMenu} innerRef={ref} />
                <button
                  onClick={() => {
                    setAccountMenu(!accountMenu)
                  }}
                  type="button"
                  className="flex mr-1 text-sm rounded-md md:mr-0 items-center"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-9 rounded-md"
                    src="../images/avatar.png"
                    alt="Avatar"
                  />
                  <p className="hidden lg:flex ml-2 font-medium">
                    {session?.user?.name}
                  </p>
                  <BsChevronDown
                    className={`ml-2 transition ${
                      accountMenu ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/auth/')}
                type="button"
                className="md:flex rounded-md md:mr-5 md:border-2 md:border-blue-500 h-12 items-center px-3 font-semibold md:text-blue-500 md:hover:bg-blue-500 md:hover:text-white"
              >
                <FaUser size={23} className="md:hidden" />
                <p className="hidden md:flex">Login / register</p>
              </button>
            )}
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 font-medium gap-7 lg:gap-14">
            <NavbarItem label="Buy" />
            <NavbarItem label="Sell" />
            <NavbarItem label="Rent" />
            <NavbarItem label="About" />
            <NavbarItem label="Advertise" />
            <NavbarItem label="Help" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
