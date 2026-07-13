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
    title: "Graph Based Augmentation for Dependency Management in NPM",
    authors: "Shaquille Pearson",
    description:
      "This project explores graph-based approaches to dependency management in NPM, surfacing transitive conflicts, version duplication, and cyclic relationships across 94 real-world projects.",
    abstract:
      "The rapid growth of software ecosystems and the increasing reliance on third-party dependencies have underscored the need for robust dependency management practices. Effective dependency management is critical to ensuring software stability, security, and maintainability. However, managing complex dependency relationships, resolving version conflicts, and addressing transitive dependencies remain significant challenges, particularly in ecosystems like Node Package Manager (NPM). Existing tools often fail to provide adequate visibility into dependency structures or detect issues such as unused dependencies and cyclic relationships. This study explores the potential of graph-based approaches to enhance dependency management by enabling deeper insights into dependency networks and identifying limitations in existing methodologies.\n\nAcross a statistically representative dataset of 94 mature NPM projects drawn from an initial pool of 1.2 million, we model packages as nodes and their dependencies, peer dependencies, and optional dependencies as directed edges. This graph-based representation makes it possible to query and visualize intricate relationships within the ecosystem. The analysis reveals that version duplication and transitive dependencies are common, impacting roughly 30% of projects, while cyclic dependencies remain rare at under 2% occurrence. These findings highlight both the limitations of current tooling and the value of graph-based methods for improving visibility into NPM dependency networks.",
    pdfUrl:
      "/assets/Graph Based Augmentation for Dependency Management in NPM.pdf",
    tags: [
      { name: "NPM", color: "bg-blue-50 text-blue-700" },
      { name: "Graphs", color: "bg-green-50 text-green-700" },
      { name: "Dependencies", color: "bg-purple-50 text-purple-700" },
      { name: "Visualization", color: "bg-yellow-50 text-yellow-700" },
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

const Research: React.FC<{ className?: string }> = ({ className }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`rounded-3xl colors p-6 pb-9.5${className ? ` ${className}` : ""}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faFileLines} className="w-4 h-4" />
        Research Projects
      </h2>
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {research.map((paper) =>
            openId === paper.id ? null : (
              <motion.div
                key={paper.id}
                layoutId={`research-card-${paper.id}`}
                className="rounded-xl px-4 py-3 flex flex-col gap-1.5 border hover:border-gray-400/40 transition-colors"
                whileTap={{ y: -6, rotate: -1.8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <h3 className="text-lg font-medium">{paper.title}</h3>
                <p className="text-gray-400 font-medium text-sm flex-1">
                  {paper.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className={`${tag.color} text-xs font-medium px-2 py-0.5 rounded-full`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(paper.id)}
                  className="cursor-pointer hover:underline font-medium text-[11px] text-gray-400 text-left"
                >
                  View paper →
                </button>
              </motion.div>
            )
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
