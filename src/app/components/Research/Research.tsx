import React from "react";
import Link from "next/link";

// Research Papers
const allResearchPapers = [
  {
    id: "rp1",
    title: "Exploring Dependency Related Build Breakages In The NPM Ecosystem",
    description:
      "This project analyzes dependency-related build failures within the NPM ecosystem by examining JavaScript projects.",
    pdfUrl:
      "/assets/Exploring Dependency Related Build Breakages In the NPM Ecosystem.pdf",
  },
  {
    id: "rp2",
    title: "Code Review Practises On Ethereum Smart Contracts",
    description:
      "This project assesses the effectiveness of code review for Ethereum smart contracts across major projects like Uniswap and Aave.",
    pdfUrl: "/assets/Code Review Practises On Etherum Smart Contracts.pdf",
  },
  {
    id: "rp3",
    title: "Predicting Build Breakage With Machine Learning",
    description:
      "This project is a literature survey focused on applying machine learning techniques to predict build failures in Continuous Integration (CI) systems.",
    pdfUrl: "/assets/Predicting Build Breakage with Machine Learning.pdf",
  },
  {
    id: "rp4",
    title: "An Evaluation of Automated Code Review Approaches",
    description:
      "This project explores the effectiveness of automated code review tools in evaluating code changes and generating meaningful feedback.",
    pdfUrl: "/assets/Code Review Practises On Etherum Smart Contracts.pdf",
  },
];

const Research: React.FC = () => {
  return (
    <div className="rounded-3xl colors p-6 pb-16">
      <h2 className="text-xl font-bold mb-4">Research</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Responsive grid for paper cards */}
        {allResearchPapers.map((paper) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Research;
