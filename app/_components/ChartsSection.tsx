"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import BarChart from "@/app/_components/BarChart";
import PieChart from "@/app/_components/PieChart";
import LineChart from "@/app/_components/LineChart";
import ScatterChart from "@/app/_components/ScatterChart";
import {
  barChartData,
  pieChartData,
  lineChartData,
  scatterChartData,
} from "@/app/_lib/chartData";
import type { ChartTab } from "@/app/_lib/chartTypes";

export default function ChartsSection() {
  const t = useTranslations("Charts");

  const TABS: { key: ChartTab; label: string }[] = [
    { key: "bar", label: t("barChart") },
    { key: "pie", label: t("pieChart") },
    { key: "line", label: t("lineChart") },
    { key: "scatter", label: t("scatterPlot") },
  ];

  const [activeTab, setActiveTab] = useState<ChartTab>("bar");
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const chartWidth = containerWidth;
  const chartHeight = 400;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {t("dataInsights")}
      </h2>

      {/* Tab buttons */}
      <div className="mb-6 flex gap-2 flex-wrap" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? "rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors"
                : "rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div
        ref={containerRef}
        className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {containerWidth > 0 && (
          <>
            {activeTab === "bar" && (
              <BarChart data={barChartData} width={chartWidth} height={chartHeight} />
            )}
            {activeTab === "pie" && (
              <PieChart data={pieChartData} width={chartWidth} height={chartHeight} />
            )}
            {activeTab === "line" && (
              <LineChart data={lineChartData} width={chartWidth} height={chartHeight} />
            )}
            {activeTab === "scatter" && (
              <ScatterChart
                data={scatterChartData}
                width={chartWidth}
                height={chartHeight}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
