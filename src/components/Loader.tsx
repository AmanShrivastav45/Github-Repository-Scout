import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader h-full w-full flex items-center justify-center bg-[#1e1e1e] rounded-[5px] border border-[#3a3a3a]">
      <div className="shape square opacity-25"></div>
    </div>
  );
};

export default Loader;
