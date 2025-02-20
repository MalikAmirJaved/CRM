import React from "react";

const SalesLeadFunnel = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-3/4 md:w-1/2">
        <div
          className="w-full h-20 bg-teal-500 rounded-l-full rounded-r-full flex items-center justify-center text-white font-bold"
          style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 30% 100%)" }}
        >
          A
        </div>

        <div
          className="w-3/4 h-20 bg-blue-500 rounded-l-full rounded-r-full flex items-center justify-center text-white font-bold mx-auto"
          style={{ clipPath: "polygon(0 0, 100% 0, 75% 100%, 25% 100%)" }}
        >
          B
        </div>
        <div
          className="w-1/2 h-20 bg-indigo-500 rounded-l-full rounded-r-full flex items-center justify-center text-white font-bold mx-auto"
          style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)" }}
        >
          C
        </div>
      </div>
    </div>
  );
};

export default SalesLeadFunnel;
