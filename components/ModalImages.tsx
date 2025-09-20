import { IoCloseOutline } from 'react-icons/io5';

const ModalImages = () => {
  return (
    <div className="w-full h-full fixed z-30 inset-0 bg-black bg-opacity-80 overflow-y-auto overflow-x-hidden">
      <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-6 text-white text-lg z-50">
        <IoCloseOutline size={50} />
      </div>
    </div>
  );
};

export default ModalImages;
