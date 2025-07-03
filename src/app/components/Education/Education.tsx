import React from "react";
import Image from "next/image";

// Main EducationCard component
const Education: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-3xl p-6 gap-4 w-full colors">
      {/* Card Header */}
      <h2 className="text-left text-xl font-bold">Education</h2>

      {/* Education Entry */}
      <div className="flex items-center space-x-4 mb-4 last:mb-0">
        {/* University Logo */}
        <div className="flex-shrink-0">
          <Image
            height={100}
            width={100}
            src="/images/Waterloo.png"
            alt="The University of Waterloo"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        </div>
        {/* Education Details */}
        <div>
          <h3 className="text-lg font-bold">University of Waterloo</h3>
          <div className="font-medium text-gray-400 text-sm">
            <p className="text-sm">Master&apos;s in Computer Science</p>
            <p className="text-sm mt-0.5">(2023 - 2024) | GPA (3.88/4.00)</p>
            <p className="text-sm mt-1">
              Additional: Specializing in Software Engineering
            </p>
          </div>
        </div>
      </div>

      {/* Education Entry */}
      <div className="flex items-center space-x-4 mb-4 last:mb-0">
        {/* University Logo */}
        <div className="flex-shrink-0">
          <Image
            width={100}
            height={100}
            src="/images/SGU.png"
            alt="St. George's University"
            className="w-12 h-12 rounded-full object-cover shadow-sm"
          />
        </div>

        {/* Education Details */}
        <div>
          <h3 className="text-lg font-bold">St. George&apos;s University</h3>
          <div className="font-medium text-gray-400 text-sm">
            <p className="text-sm">Bachelor&apos;s of Information Technology</p>
            <p className="text-sm mt-1">(2018 - 2021) | GPA (3.60/4.00)</p>
            <p className="text-sm mt-1">Additional: Minor in Mathematics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
