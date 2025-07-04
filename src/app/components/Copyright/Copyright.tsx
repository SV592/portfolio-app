import React from "react";

/**
 * Copyright component displays the current year and copyright notice.
 */
const Copyright: React.FC = () => {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-45 rounded-3xl flex justify-center text-white font-medium text-center text-sm mt-2">
      {/* Display copyright symbol, year, and name */}
      &copy; {currentYear} Shaquille Pearson. All rights reserved.
    </div>
  );
};

export default Copyright;
