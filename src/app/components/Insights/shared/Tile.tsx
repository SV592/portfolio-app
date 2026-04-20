"use client";

import React from "react";

interface TileProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tile: React.FC<TileProps> = ({
  title,
  subtitle,
  className = "",
  children,
}) => (
  <div
    className={`rounded-2xl p-5 border border-gray-200/10 bg-gray-50/5 ${className}`}
  >
    <div className="mb-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
    {children}
  </div>
);

export const SkeletonTile: React.FC<{ title: string; className?: string }> = ({
  title,
  className = "",
}) => (
  <Tile title={title} className={className}>
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200/30 rounded w-3/4" />
      <div className="h-24 bg-gray-200/20 rounded" />
      <div className="h-4 bg-gray-200/30 rounded w-1/2" />
    </div>
  </Tile>
);

export const ErrorTile: React.FC<{
  title: string;
  message: string;
  className?: string;
}> = ({ title, message, className = "" }) => (
  <Tile title={title} className={className}>
    <div className="text-sm text-red-400 flex items-start gap-2">
      <span aria-hidden="true">⚠</span>
      <span>{message}</span>
    </div>
  </Tile>
);

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, hint }) => (
  <div className="flex flex-col">
    <span className="text-xs uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-2xl font-bold mt-1">{value}</span>
    {hint && <span className="text-xs text-gray-500 mt-0.5">{hint}</span>}
  </div>
);
