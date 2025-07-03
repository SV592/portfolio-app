import React from "react";
import Image from "next/image"; // Still needed for next/image component
import Link from "next/link"; // Still needed for next/link component

const Projects: React.FC = () => {
  return (
    // Main container matching your existing card styles
    <div className="bg-white rounded-3xl min-h-[300px] colors shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Responsive grid for project cards */}
        <div className="rounded-xl border p-4 flex flex-col h-full">
          <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
            <Image
              src="/images/blogProject.png"
              alt="Screenshot of Blog Website"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Blog App</h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow">
            A blog application built with Next.js with static and dynamic page
            serving and styled using Tailwind CSS. It features a custom backend
            for seamless Spotify API integration, and leverages PostgreSQL for
            newsletter email storage.
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Next.js
            </span>
            <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              TypeScript
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Tailwind CSS
            </span>
            <span className="bg-yellow-50 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
              React
            </span>
            <span className="bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
              APIs
            </span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
              PostgreSQL
            </span>
          </div>

          <div className="flex justify-start items-center gap-4 mt-auto">
            <Link
              href="https://theprogrammersgazette.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm font-medium flex items-center"
            >
              Visit
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#2E2B2C"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00024 5.24951C8.69682 5.24941 8.42322 5.43213 8.30709 5.71245C8.19096
                 5.99277 8.25516 6.31545 8.46976 6.52995L12.4411 10.4997L5.47065 17.4701C5.17775
                17.763 5.17775 18.2379 5.47065 18.5308C5.76354 18.8237 6.23841 18.8237 6.53131
                18.5308L13.502 11.5601L17.468 15.5244C17.6826 15.7388 18.0052 15.8029 18.2854 15.6868C18.5656
                15.5706 18.7483 15.297 18.7482 14.9937L18.7454 6.0553C18.7595 5.84677 18.6868 5.63346
                 18.5274 5.47406L18.5215 5.46821C18.3862 5.33497 18.2005 5.25274 17.9956 5.25266L9.00024 5.24951Z"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Project Card 2: E-commerce Platform */}
        <div className="rounded-xl border p-4 flex flex-col h-full">
          <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
            <Image
              src="/images/blogProject.png"
              alt="Screenshot of E-commerce Platform"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Portfolio App</h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow">
            A responsive personal portfolio built with Next.js, leveraging
            server-side rendering and client-side data fetching for real-time
            updates. It integrates GitHub, LeetCode, and a custom blog API,
            UI/UX built using Tailwind CSS and Framer Motion.
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Next.js
            </span>
            <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              TypeScript
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Tailwind CSS
            </span>
            <span className="bg-yellow-50 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
              React
            </span>
            <span className="bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
              APIs
            </span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
              SMR
            </span>
          </div>

          <div className="flex justify-start gap-4 mt-auto">
            <Link
              href="https://ecommerce-demo.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm font-medium flex items-center"
            >
              Visit
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#2E2B2C"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00024 5.24951C8.69682 5.24941 8.42322 5.43213 8.30709 5.71245C8.19096
                 5.99277 8.25516 6.31545 8.46976 6.52995L12.4411 10.4997L5.47065 17.4701C5.17775
                17.763 5.17775 18.2379 5.47065 18.5308C5.76354 18.8237 6.23841 18.8237 6.53131
                18.5308L13.502 11.5601L17.468 15.5244C17.6826 15.7388 18.0052 15.8029 18.2854 15.6868C18.5656
                15.5706 18.7483 15.297 18.7482 14.9937L18.7454 6.0553C18.7595 5.84677 18.6868 5.63346
                 18.5274 5.47406L18.5215 5.46821C18.3862 5.33497 18.2005 5.25274 17.9956 5.25266L9.00024 5.24951Z"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border p-4 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2">Secure File Manager</h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow">
            A lightweight C++ application for secure file encryption,
            decryption, hashing, and digital signature management This project
            leverages OpenSSL for cryptographic operations and a command-line
            interface.
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              C++
            </span>
            <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              OpenSSL
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Cryptography
            </span>
            <span className="bg-yellow-50 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
              CLI
            </span>
            <span className="bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
              File Management
            </span>
          </div>

          <div className="flex justify-start gap-4 mt-auto">
            <Link
              href="https://github.com/SV592/secure_file_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm font-medium flex items-center"
            >
              GitHub
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#2E2B2C"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00024 5.24951C8.69682 5.24941 8.42322 5.43213 8.30709 5.71245C8.19096
                 5.99277 8.25516 6.31545 8.46976 6.52995L12.4411 10.4997L5.47065 17.4701C5.17775
                17.763 5.17775 18.2379 5.47065 18.5308C5.76354 18.8237 6.23841 18.8237 6.53131
                18.5308L13.502 11.5601L17.468 15.5244C17.6826 15.7388 18.0052 15.8029 18.2854 15.6868C18.5656
                15.5706 18.7483 15.297 18.7482 14.9937L18.7454 6.0553C18.7595 5.84677 18.6868 5.63346
                 18.5274 5.47406L18.5215 5.46821C18.3862 5.33497 18.2005 5.25274 17.9956 5.25266L9.00024 5.24951Z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
