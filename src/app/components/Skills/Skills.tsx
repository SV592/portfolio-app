import React from "react";

const Skills: React.FC = () => {
  return (
    <div>
      {/* Skills Card*/}
      <div className="flex flex-col gap-4 bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800flex justify-between items-center">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            React
          </span>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Next.js
          </span>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            TypeScript
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
            Tailwind CSS
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            Node.js
          </span>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
            Python
          </span>
          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
            SQL
          </span>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Cypher
          </span>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            React Native
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
            ExpressJS
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            PyTorch
          </span>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
            jQuery
          </span>
          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
            HTML
          </span>
          <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full">
            CSS
          </span>
          <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
            Docker
          </span>
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
            Pandas
          </span>
          <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">
            MongoDB
          </span>
          <span className="bg-lime-100 text-lime-800 text-sm font-medium px-3 py-1 rounded-full">
            PostgreSQL
          </span>
          <span className="bg-fuchsia-100 text-fuchsia-800 text-sm font-medium px-3 py-1 rounded-full">
            Django
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
            Firebase
          </span>
          <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
            Neo4j
          </span>
          <span className="bg-violet-100 text-violet-800 text-sm font-medium px-3 py-1 rounded-full">
            APIs
          </span>
          <span className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full">
            CI/CD
          </span>
        </div>
      </div>
    </div>
  );
};

export default Skills;
