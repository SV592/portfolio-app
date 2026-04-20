"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TagBreakdown as TagBreakdownType } from "@/app/types/insights";
import { Tile } from "../shared/Tile";

interface TagBreakdownProps {
  tags: TagBreakdownType[];
}

const BAR_COLORS = [
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#c084fc",
  "#e879f9",
  "#f472b6",
  "#fb7185",
  "#fbbf24",
  "#4ade80",
  "#2dd4bf",
];

interface TooltipPayloadItem {
  payload: { name: string; solved: number };
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const { name, solved } = payload[0].payload;
  return (
    <div className="colors rounded-lg px-3 py-2 text-xs shadow-lg border border-gray-200/20">
      <div className="font-semibold">{name}</div>
      <div className="text-gray-400">{solved} solved</div>
    </div>
  );
};

const TagBreakdown: React.FC<TagBreakdownProps> = ({ tags }) => {
  if (tags.length === 0) {
    return (
      <Tile title="Top topics">
        <p className="text-sm text-gray-400">No tag data available.</p>
      </Tile>
    );
  }

  return (
    <Tile
      title="Top topics"
      subtitle="Problems solved per category"
      className="sm:col-span-2"
    >
      <div className="w-full" style={{ height: Math.max(200, tags.length * 28) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={tags}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="solved" radius={[0, 4, 4, 0]}>
              {tags.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Tile>
  );
};

export default TagBreakdown;
