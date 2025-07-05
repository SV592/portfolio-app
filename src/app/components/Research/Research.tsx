import React from "react";
import Link from "next/link";

// Research Papers
const research = [
  {
    id: "rp1",
    title: "Exploring Dependency Related Build Breakages In The NPM Ecosystem",
    description:
      "This project analyzes dependency-related build failures within the NPM ecosystem by examining JavaScript projects.",
    pdfUrl:
      "/assets/Exploring Dependency Related Build Breakages In the NPM Ecosystem.pdf",
    tags: [
      { name: "NPM", color: "bg-blue-50 text-blue-700" },
      { name: "Pipelines", color: "bg-green-50 text-green-700" },
      { name: "Builds", color: "bg-purple-50 text-purple-700" },
      { name: "CI/CD", color: "bg-yellow-50 text-yellow-700" },
    ],
  },
  {
    id: "rp2",
    title: "Code Review Practises On Ethereum Smart Contracts",
    description:
      "This project assesses the effectiveness of code review for Ethereum smart contracts across major projects like Uniswap and Aave.",
    pdfUrl: "/assets/Code Review Practises On Etherum Smart Contracts.pdf",
    tags: [
      { name: "Smart Contracts", color: "bg-blue-50 text-blue-700" },
      { name: "Blockchain", color: "bg-green-50 text-green-700" },
      { name: "Crypto", color: "bg-purple-50 text-purple-700" },
      { name: "Code Review", color: "bg-yellow-50 text-yellow-700" },
    ],
  },
  {
    id: "rp3",
    title: "Predicting Build Breakage With Machine Learning",
    description:
      "This project is a literature survey focused on applying machine learning techniques to predict build failures in Continuous Integration (CI) systems.",
    pdfUrl: "/assets/Predicting Build Breakage with Machine Learning.pdf",
    tags: [
      { name: "Machine Learning", color: "bg-blue-50 text-blue-700" },
      { name: "Builds", color: "bg-green-50 text-green-700" },
      { name: "CI/CD", color: "bg-purple-50 text-purple-700" },
    ],
  },
  {
    id: "rp4",
    title: "An Evaluation of Automated Code Review Approaches",
    description:
      "This project explores the effectiveness of automated code review tools in evaluating code changes and generating meaningful feedback.",
    pdfUrl: "/assets/Code Review Practises On Etherum Smart Contracts.pdf",
    tags: [
      { name: "AI/ML", color: "bg-blue-50 text-blue-700" },
      { name: "Code Review", color: "bg-green-50 text-green-700" },
      { name: "Tools", color: "bg-purple-50 text-purple-700" },
      { name: "Benchmark", color: "bg-yellow-50 text-yellow-700" },
    ],
  },
];

const Research: React.FC = () => {
  return (
    <div className="rounded-3xl colors p-6 pb-9.5">
      <h2 className="text-xl font-bold mb-4">Research Projects</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Responsive grid for paper cards */}
        {research.map((paper) => (
          <div
            key={paper.id}
            className="rounded-xl p-4 flex flex-col h-full border"
          >
            <Link
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm font-medium flex items-center"
            >
              <h3 className="text-lg font-medium mb-2">{paper.title}</h3>
            </Link>
            <p className="text-gray-400 font-medium text-sm mb-3 flex-grow">
              {paper.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {paper.tags.map((tag) => (
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

export default Research;
