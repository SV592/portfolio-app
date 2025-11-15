import React from "react";
import Image from "next/image";

// Education data array
const educationData = [
  {
    school: "University of Waterloo",
    logo: "/images/Waterloo.png",
    alt: "The University of Waterloo",
    degree: "Master's in Computer Science",
    details: [
      "(2023 - 2024)",
      "Additional: Specializing in Software Engineering",
    ],
  },
  {
    school: "St. George's University",
    logo: "/images/SGU.png",
    alt: "St. George's University",
    degree: "Bachelor's of Information Technology",
    details: [
      "(2018 - 2021)",
      "Additional: Minor in Mathematics",
    ],
  },
];

// Main EducationCard component
const Education: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-3xl p-6 gap-4 w-full colors">
      {/* Card Header */}
      <h2 className="text-left text-xl font-bold">Education</h2>

      {/* Loop over education data and render each entry */}
      {educationData.map((edu) => (
        <div
          key={edu.school}
          className="flex items-center space-x-4 mb-4 last:mb-0"
        >
          {/* University Logo */}
          <div className="flex-shrink-0">
            <Image
              width={100}
              height={100}
              src={edu.logo}
              alt={edu.alt}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
          </div>
          {/* Education Details */}
          <div>
            <h3 className="text-lg font-bold">{edu.school}</h3>
            <div className="font-medium text-gray-400 text-sm">
              <p className="text-sm">{edu.degree}</p>
              {edu.details.map((line, i) => (
                <p className="text-sm mt-1" key={i}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Education;
