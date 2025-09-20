import React from 'react';

import { FaTrash } from 'react-icons/fa';

interface PhotUploadProps {
  onChange: any;
  files: Blob[];
  message: string;
  onClick: any;
}

const PhotoUpload: React.FC<PhotUploadProps> = ({
  onChange,
  files,
  message,
  onClick,
}) => {
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="rounded-lg h-auto min-h-96 bg-white w-full">
            <span className="flex justify-center items-center text-[12px] mb-4 text-red-500">
              {message}
            </span>
            <div className="flex items-center justify-center">
              <label className="flex cursor-pointer flex-col w-full h-52 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300 justify-center">
                <div className="flex flex-col items-center justify-center pt-7 px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="pt-1 text-md tracking-wider text-gray-400 group-hover:text-gray-600">
                    Odaberite slike *
                  </p>
                  <p className="pt-1 text-xs tracking-wider text-gray-400 group-hover:text-gray-600">
                    Dozvoljeni formati su: JPEG, PNG i WEBP
                  </p>
                  <p className="pt-1 text-xs tracking-wider text-gray-400 group-hover:text-gray-600">
                    Maksimalna veličina jedne fotografije je 2 MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  onChange={onChange}
                  className="opacity-0"
                  multiple
                  name="files[]"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-5 mt-8 justify-center">
              {files.map((file: any, key: any) => {
                return (
                  <div key={key} className="overflow-hidden relative group">
                    <div className="absolute w-full h-full hover:bg-gray-500 hover:bg-opacity-80 hidden group-hover:flex flex-wrap">
                      <p className="flex flex-wrap text-xs px-2 pt-2 text-white">
                        {file.name.slice(0, 15) + '... ' + file.type}
                      </p>
                      <p className="flex flex-wrap text-xs p-2 text-white">
                        Size: {(file.size / 1024 ** 2).toFixed(2) + ' MB'}
                      </p>
                      <i
                        onClick={() => onClick(file)}
                        className="absolute right-2 bottom-3 text-white cursor-pointer"
                      >
                        <FaTrash size={20} />
                      </i>
                    </div>
                    <img
                      className="h-32 w-32 rounded-md object-fit"
                      src={URL.createObjectURL(file)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </>
  );
};

export default PhotoUpload;
