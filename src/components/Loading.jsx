
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="flex flex-col items-center">
        <FaSpinner className="animate-spin text-5xl text-black mb-4" />
        <span className="text-lg text-gray-700 font-semibold">Loading, please wait...</span>
      </div>
    </div>
  );
}

export default Loading