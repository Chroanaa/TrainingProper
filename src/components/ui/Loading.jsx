import React from "react";

function Loading({ text, show }) {
  return (
    <div
      className={`${
        show ? "flex" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-black/50 z-50 items-center justify-center`}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4'></div>
        <span className='text-white text-xl'>{text}</span>
      </div>
    </div>
  );
}

export default Loading;
