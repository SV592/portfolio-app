"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResearchModal, { ResearchPaper } from "../Insights/ResearchModal/ResearchModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

const research: ResearchPaper[] = [
  {
    id: "rp1",
    title: "Exploring Dependency Related Build Breakages In The NPM Ecosystem",
    authors: "Shaquille Pearson, Mahmoud Alfadel & Shane McIntosh",
    description:
      "This project analyzes dependency-related build failures within the NPM ecosystem by examining JavaScript projects.",
    abstract:
      "NPM stands as one of the world's most extensive software registries and is home to an immense array of projects spanning professional and amateur domains. Within this vast ecosystem, millions of projects are interlinked by dependencies, showcasing the dynamic nature of modern software development. The sheer magnitude of interconnected projects underscores the critical significance of effective dependency management. As developers leverage and contribute to this expansive repository, ensuring the reliability of software becomes a paramount challenge.\n\nOur research delves into dependency-related build failures within the NPM ecosystem by analyzing 24 JavaScript projects. Employing Git and act, we traced commits affecting package.json files and locally reproduced builds for detailed analysis. Our study identifies that approximately 11.7% of project failures stem from dependency-related issues. The quickest fixes took only 2 minutes while longer fix times extended up to 5 months, emphasizing the intricate nature of manual interventions. Dependency-related failures constitute 60% of total issues, with peer dependency conflicts emerging as the most prevalent challenge, underscoring the critical need for improved dependency management practices.",
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
    authors: "Aryan Haddady, Shaquille Pearson & Sky Qiao",
    description:
      "This project assesses the effectiveness of code review for Ethereum smart contracts across major projects like Uniswap and Aave.",
    abstract:
      "In the rapid process of developing a software project, especially when numerous teams and developers collaborate, having an effective version control system is extremely important. Blockchain technology, particularly the Ethereum platform, has gained considerable attention and adoption, allowing developers to deploy specialized programs known as Smart Contracts — which explicitly define the terms and conditions of transactions within the network.\n\nThis research investigates how pull requests are reviewed in major Ethereum smart contract projects such as Uniswap and Aave, assessing whether any new bugs or security issues were introduced by merged pull requests. We evaluate the accuracy of these reviews, examine whether new vulnerabilities were introduced through merged requests, and assess the overall importance and popularity of the projects in question. We also recommend potential strategies and best practices to enhance code review processes within the paradigm of Smart Contract development, where the consequences of undiscovered bugs are uniquely severe due to the immutable and financial nature of deployed contracts.",
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
    authors: "Shaquille Pearson",
    description:
      "This project is a literature survey focused on applying machine learning techniques to predict build failures in Continuous Integration (CI) systems.",
    abstract:
      "Software development is a complex, dynamic process that requires significant effort and resources. Build breakages are one of the main problems that software development teams must deal with — when newly integrated code or a modification to the codebase causes the software build process to fail, it can have a detrimental effect on overall software quality and cause considerable delays.\n\nMachine learning provides a promising approach to predicting build breakages by analyzing data, detecting patterns, and learning from historical build failures. ML algorithms can detect code conflicts, identify potential errors, and provide alerts to developers before build breakages occur. This literature survey provides a comprehensive overview of existing research on predicting build breakages with machine learning techniques, examining the different models used, their strengths and weaknesses, the data sources and evaluation metrics employed, and the challenges encountered. The survey also examines the influence of factors such as code complexity, change frequency, and testing coverage on model performance.",
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
    authors: "Shaquille Pearson",
    description:
      "This project explores the effectiveness of automated code review tools in evaluating code changes and generating meaningful feedback.",
    abstract:
      "Automated code review approaches have gained traction in software engineering, promising to streamline the review process by suggesting comments on code changes. However, verifying the semantic correctness of these automatically generated comments remains a significant challenge, often requiring manual intervention. Current evaluation methods frequently rely on exact text matches, which fail to account for the nuanced semantics of code review comments, leading to misclassification of valid suggestions.\n\nIn this study, we explore an evaluation framework that leverages pre-trained language models to assess semantic equivalence between generated and ground-truth comments. By addressing this gap, our work aims to enhance the reliability of automated code review tools, reduce the need for manual verification, and foster more practical adoption in real-world development workflows.",
    pdfUrl: "/assets/An Evaluation of Automated Code Review Approaches.pdf",
    tags: [
      { name: "AI/ML", color: "bg-blue-50 text-blue-700" },
      { name: "Code Review", color: "bg-green-50 text-green-700" },
      { name: "Tools", color: "bg-purple-50 text-purple-700" },
      { name: "Benchmark", color: "bg-yellow-50 text-yellow-700" },
    ],
  },
];

const Research: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="rounded-3xl colors p-6 pb-9.5">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faFileLines} className="w-4 h-4" />
        Research Projects
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {research.map((paper) =>
            openId !== paper.id ? (
              <motion.div
                key={paper.id}
                layoutId={`research-card-${paper.id}`}
                className="rounded-xl p-4 flex flex-col h-full border hover:border-gray-400/40 transition-colors"
                whileTap={{ y: -6, rotate: -1.8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <h3 className="text-lg font-medium mb-2">{paper.title}</h3>
                <p className="text-gray-400 font-medium text-sm mb-3 flex-grow">
                  {paper.description}
                </p>
                <div className="flex flex-wrap items-center gap-1">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className={`${tag.color} text-xs font-medium px-2 py-0.5 rounded-full`}
                    >
                      {tag.name}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOpenId(paper.id)}
                    className="ml-auto cursor-pointer hover:underline font-medium text-[11px] text-gray-400"
                  >
                    View paper →
                  </button>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
      {research.map((paper) => (
        <ResearchModal
          key={paper.id}
          open={openId === paper.id}
          onClose={() => setOpenId(null)}
          paper={paper}
          layoutId={`research-card-${paper.id}`}
        />
      ))}
    </div>
  );
};

export default Research;
