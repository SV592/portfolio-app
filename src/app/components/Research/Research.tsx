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
    <div className="rounded-3xl colors p-6">
      <h2 className="text-xl font-bold mb-4">Research</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Responsive grid for paper cards */}
        {allResearchPapers.map((paper) => (
          <div
            key={paper.id}
            className="rounded-xl p-4 flex flex-col h-full border"
          >
            <h3 className="text-lg font-medium mb-2">{paper.title}</h3>
            <p className="text-gray-400 font-medium text-sm mb-3 flex-grow">
              {paper.description}
            </p>

            {/* Links at the bottom, styled like Project section links */}
            <div className="flex justify-start gap-4 mt-auto">
              {/* View Button (linking to PDF/Abstract/DOI) */}
              {paper.pdfUrl && ( // Assuming pdfUrl is the primary "view" link
                <Link
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-sm font-medium flex items-center"
                >
                  View
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
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Research;
