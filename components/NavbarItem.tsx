import React from 'react';

interface NavbarItemProps {
  label: String;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ label }) => {
  return (
    <div className="text-black cursor-pointer hover:text-blue-500 md:text-md transition ">
      {label}
    </div>
  );
};

export default NavbarItem;
