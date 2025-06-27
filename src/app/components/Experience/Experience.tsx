import React from "react";
import Image from "next/image";

// Main EducationCard component
const Experience: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-lg p-6 gap-4 w-full">
      {/* Card Header */}
      <h2 className="text-left text-xl font-bold">Experience</h2>

      {/* Entry */}
      <div className="flex items-center space-x-4 mb-4 last:mb-0">
        {/* Work Logo */}
        <div className="flex-shrink-0">
          <Image
            width={100}
            height={100}
            src="/images/Rebels.png"
            alt="The Software Rebels"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        </div>

        {/* Experience Details */}
        <div>
          <h3 className="text-lg font-bold">The Software Rebels</h3>
          <p className="text-[#7F8CAA] text-sm">
            Graduate Research Assistant (2023 - 2024)
          </p>
          <p className="text-[#7F8CAA] text-sm">Waterloo, ON</p>
        </div>
      </div>

      {/* Entry */}
      <div className="flex items-center space-x-4 mb-4 last:mb-0">
        <div className="flex-shrink-0">
          <Image
            height={100}
            width={100}
            src="/images/Waterloo.png"
            alt="The University of Waterloo"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        </div>

        {/* Experience Details */}
        <div>
          <h3 className="text-lg font-bold">University of Waterloo</h3>
          <p className="text-[#7F8CAA] text-sm">
            Instructional Apprentice/Teaching Assistant (2023 - 2024)
          </p>
          <p className="text-[#7F8CAA] text-sm">Waterloo, ON</p>
        </div>
      </div>

      {/* Entry */}
      <div className="flex items-center space-x-4 mb-4 last:mb-0">
        <div className="flex-shrink-0">
          <Image
            height={100}
            width={100}
            src="/images/DPI.png"
            alt="The Department of Public Information"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        </div>

        {/* Experience Details */}
        <div>
          <h3 className="text-lg font-bold">
            The Department of Public Information
          </h3>
          <p className="text-[#7F8CAA] text-sm">
            Junior Software Developer (2022 - 2023)
          </p>
          <p className="text-[#7F8CAA] text-sm">Georgetown, Guyana</p>
        </div>
      </div>

      {/* Entry */}
      <div className="flex items-center space-x-4 mb-4 last:mb-0">
        <div className="flex-shrink-0">
          <Image
            height={100}
            width={100}
            src="/images/CCA.png"
            alt="Caribbean Coding Academy"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        </div>

        {/* Experience Details */}
        <div>
          <h3 className="text-lg font-bold">Caribbean Coding Academy</h3>
          <p className="text-[#7F8CAA] text-sm">
            Frontend Engineer Intern (2020 - 2021)
          </p>
          <p className="text-[#7F8CAA] text-sm">St. George, Grenada</p>
        </div>
      </div>
    </div>
  );
};

export default Experience;
