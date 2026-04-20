"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { LanguageBreakdown } from "@/app/types/insights";
import { Tile } from "../shared/Tile";

interface LanguageDonutProps {
  languages: LanguageBreakdown[];
}

interface TooltipPayloadItem {
  payload: LanguageBreakdown;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const lang = payload[0].payload;
  return (
    <div className="colors rounded-lg px-3 py-2 text-xs shadow-lg border border-gray-200/20">
      <div className="font-semibold" style={{ color: lang.color }}>
        {lang.name}
      </div>
      <div className="text-gray-400">{lang.percentage.toFixed(1)}%</div>
    </div>
  );
};

const LanguageDonut: React.FC<LanguageDonutProps> = ({ languages }) => {
  if (languages.length === 0) {
    return (
      <Tile title="Language breakdown">
        <p className="text-sm text-gray-400">No language data available.</p>
      </Tile>
    );
  }

  return (
    <Tile title="Language breakdown" subtitle="Across your public repos">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              dataKey="bytes"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              stroke="none"
            >
              {languages.map((lang) => (
                <Cell key={lang.name} fill={lang.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Tile>
  );
};

export default LanguageDonut;
