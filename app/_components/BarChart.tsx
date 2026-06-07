"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import type { BarChartDataPoint } from "@/app/_lib/chartTypes";

interface BarChartProps {
  data: BarChartDataPoint[];
  width: number;
  height: number;
}

export default function BarChart({ data, width, height }: BarChartProps) {
  const t = useTranslations("Charts");
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#2563eb";
    const foreground =
      styles.getPropertyValue("--foreground").trim() || "#171717";
    const gridColor = d3.color(foreground)?.copy({ opacity: 0.12 }).toString() ?? "#e5e5e5";

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.category))
      .range([0, innerWidth])
      .padding(0.25);

    const yMax = d3.max(data, (d) => d.value) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", gridColor));

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) =>
        g
          .selectAll("text")
          .attr("fill", foreground)
          .attr("font-size", "12px")
          .attr("dy", "0.5em")
      )
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", foreground).attr("opacity", 0.3)
      )
      .call((g) => g.select(".domain").attr("stroke", foreground).attr("opacity", 0.3));

    // Y axis
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format("~s")))
      .call((g) =>
        g
          .selectAll("text")
          .attr("fill", foreground)
          .attr("font-size", "12px")
      )
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", foreground).attr("opacity", 0.3)
      )
      .call((g) => g.select(".domain").attr("stroke", foreground).attr("opacity", 0.3));

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.category)!)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", accent)
      .attr("rx", 4)
      .attr("opacity", 0.85)
      .on("mouseenter", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("opacity", 0.85);
      });

    // Value labels on top of bars
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.category)! + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.value) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", foreground)
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .text((d) => d3.format("~s")(d.value));
  }, [data, width, height, isDark]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      role="img"
      aria-label={t("barChartAriaLabel")}
    />
  );
}
