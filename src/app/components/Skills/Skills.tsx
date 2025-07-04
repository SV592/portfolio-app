import React from "react";

// Skills
const skills = [
  { name: "React", color: "bg-blue-100 text-blue-800" },
  { name: "Next.js", color: "bg-green-100 text-green-800" },
  { name: "TypeScript", color: "bg-purple-100 text-purple-800" },
  { name: "Tailwind CSS", color: "bg-yellow-100 text-yellow-800" },
  { name: "Node.js", color: "bg-red-100 text-red-800" },
  { name: "Python", color: "bg-indigo-100 text-indigo-800" },
  { name: "SQL", color: "bg-pink-100 text-pink-800" },
  { name: "Cypher", color: "bg-teal-100 text-teal-800" },
  { name: "React Native", color: "bg-orange-100 text-orange-800" },
  { name: "ExpressJS", color: "bg-cyan-100 text-cyan-800" },
  { name: "PyTorch", color: "bg-lime-100 text-lime-800" },
  { name: "jQuery", color: "bg-fuchsia-100 text-fuchsia-800" },
  { name: "HTML", color: "bg-emerald-100 text-emerald-800" },
  { name: "CSS", color: "bg-amber-100 text-amber-800" },
  { name: "Docker", color: "bg-violet-100 text-violet-800" },
  { name: "Pandas", color: "bg-rose-100 text-rose-800" },
  { name: "MongoDB", color: "bg-sky-100 text-sky-800" },
  { name: "PostgreSQL", color: "bg-orange-200 text-orange-900" },
  { name: "Django", color: "bg-teal-200 text-teal-900" },
  { name: "Firebase", color: "bg-lime-200 text-lime-900" },
  { name: "Neo4j", color: "bg-stone-100 text-stone-800" },
  { name: "APIs", color: "bg-amber-200 text-amber-900" },
  { name: "CI/CD", color: "bg-blue-200 text-blue-900" },
  { name: "JavaScript", color: "bg-green-200 text-green-900" },
  { name: "Latex", color: "bg-purple-200 text-purple-900" },
  { name: "FastAPI", color: "bg-yellow-200 text-yellow-900" },
  { name: "Git", color: "bg-red-200 text-red-900" },
  { name: "MySQL", color: "bg-indigo-200 text-indigo-900" },
  { name: "Bash", color: "bg-pink-200 text-pink-900" },
];

const Skills: React.FC = () => {
  return (
    <div>
      {/* Skills Card */}
      <div className="flex flex-col gap-4 bg-white rounded-3xl p-6 pb-7 colors">
        <h2 className="text-xl font-bold flex justify-between items-center">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className={`${skill.color} text-sm font-medium px-3 py-1 rounded-full`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
