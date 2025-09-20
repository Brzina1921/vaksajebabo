import React from 'react';

interface MobileMenuProps {
  visible?: boolean;
  innerRef?: any;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible, innerRef }) => {
  if (!visible) return null;
  return (
    <div className="items-center justify-between w-full md:hidden relative transition">
      <div
        ref={innerRef}
        className="flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-800"
      >
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white bg-cyan-500 rounded"
          >
            Buy
          </a>
        </p>
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 border-gray-700"
          >
            Sell
          </a>
        </p>
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 border-gray-700"
          >
            Rent
          </a>
        </p>
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 border-gray-700"
          >
            Help
          </a>
        </p>
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 border-gray-700"
          >
            About
          </a>
        </p>
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 border-gray-700"
          >
            Advertise
          </a>
        </p>
        <p>
          <a
            href="#"
            className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-700 border-gray-700"
          >
            Contact
          </a>
        </p>
      </div>
    </div>
  );
};

export default MobileMenu;
