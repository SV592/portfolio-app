import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

// Experience data array
const experienceData = [
  {
    company: "MDLand",
    logo: "/images/mdland.jpg",
    alt: "MDLand",
    role: "Software Engineer (2025 - Present)",
    location: "Waterloo, ON",
  },
  {
    company: "The Software Rebels",
    logo: "/images/Rebels.png",
    alt: "The Software Rebels",
    role: "Graduate Research Assistant (2023 - 2024)",
    location: "Waterloo, ON",
  },
  {
    company: "University of Waterloo",
    logo: "/images/Waterloo.png",
    alt: "The University of Waterloo",
    role: "Instructional Apprentice/Teaching Assistant (2023 - 2024)",
    location: "Waterloo, ON",
  },
  {
    company: "The Department of Public Information",
    logo: "/images/DPI.png",
    alt: "The Department of Public Information",
    role: "Junior Software Developer (2022 - 2023)",
    location: "Georgetown, Guyana",
  },
];

// Main Experience component
const Experience: React.FC = () => {
  return (
    <div className="flex flex-col rounded-3xl p-6 gap-4 colors">
      {/* Card Header */}
      <h2 className="text-left text-xl font-bold flex items-center gap-2">
        <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
        Experience
      </h2>

      {/* Loop over experience data and render each entry */}
      {experienceData.map((exp) => (
        <div
          key={exp.company}
          className="flex items-center space-x-4 mb-4 last:mb-0"
        >
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <Image
              width={100}
              height={100}
              src={exp.logo}
              alt={exp.alt}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
          </div>
          {/* Experience Details */}
          <div>
            <h3 className="text-lg font-bold">{exp.company}</h3>
            <div className="font-medium text-gray-400 text-sm">
              <p className="text-sm">{exp.role}</p>
              <p className="text-sm">{exp.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Experience;
