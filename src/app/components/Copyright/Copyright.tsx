import React from "react";

const Copyright: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-45 rounded-3xl flex justify-center font-medium text-center text-sm mt-2">
      &copy; {currentYear} Shaquille Pearson. All rights reserved.
    </div>
  );
};

export default Copyright;
