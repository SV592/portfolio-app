import React from "react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Blog App",
    image: "/images/blogProject.png",
    alt: "Screenshot of Blog Website",
    description:
      "A blog application built with Next.js with static and dynamic page serving and styled using Tailwind CSS. It features a custom backend for seamless Spotify API integration, and leverages PostgreSQL for newsletter email storage.",
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "Tailwind CSS", color: "bg-purple-50 text-purple-700" },
      { name: "React", color: "bg-yellow-50 text-yellow-700" },
      { name: "APIs", color: "bg-red-50 text-red-700" },
      { name: "PostgreSQL", color: "bg-indigo-50 text-indigo-700" },
    ],
    link: {
      href: "https://theprogrammersgazette.vercel.app/",
      label: "Visit",
    },
  },
  {
    title: "Portfolio App",
    image: "/images/portfolio.png",
    alt: "Screenshot of Portfolio App",
    description:
      "A responsive personal portfolio built with Next.js, leveraging server-side rendering and client-side data fetching for real-time updates. It integrates GitHub, LeetCode, and a custom blog API, UI/UX built using Tailwind CSS and Framer Motion.",
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "Tailwind CSS", color: "bg-purple-50 text-purple-700" },
      { name: "React", color: "bg-yellow-50 text-yellow-700" },
      { name: "APIs", color: "bg-red-50 text-red-700" },
      { name: "SMR", color: "bg-indigo-50 text-indigo-700" },
    ],
    link: {
      href: "#",
      label: "Visit",
    },
  },
  {
    title: "Secure File Manager",
    image: "",
    alt: "",
    description:
      "A lightweight C++ application for secure file encryption, decryption, hashing, and digital signature management This project leverages OpenSSL for cryptographic operations and a command-line interface.",
    tags: [
      { name: "C++", color: "bg-blue-50 text-blue-700" },
      { name: "OpenSSL", color: "bg-green-50 text-green-700" },
      { name: "Cryptography", color: "bg-purple-50 text-purple-700" },
      { name: "CLI", color: "bg-yellow-50 text-yellow-700" },
      { name: "File Management", color: "bg-red-50 text-red-700" },
    ],
    link: {
      href: "https://github.com/SV592/secure_file_manager",
      label: "GitHub",
    },
  },
];

const Projects: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl colors shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="rounded-xl border p-4 flex flex-col h-full"
          >
            {project.image && (
              <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                <Link
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Link>
              </div>
            )}
            <Link
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm font-medium flex items-center"
            >
              <h3 className="text-lg font-medium mb-2">{project.title}</h3>
            </Link>
            <p className="text-gray-400 font-medium text-sm mb-3 flex-grow">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag.name}
                  className={`${tag.color} text-xs font-medium px-2 py-0.5 rounded-full`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
