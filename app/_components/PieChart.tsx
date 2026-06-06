"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import type { PieChartDataPoint } from "@/app/_lib/chartTypes";

interface PieChartProps {
  data: PieChartDataPoint[];
  width: number;
  height: number;
}

export default function PieChart({ data, width, height }: PieChartProps) {
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
    const foreground =
      styles.getPropertyValue("--foreground").trim() || "#171717";
    const background =
      styles.getPropertyValue("--background").trim() || "#ffffff";

    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;
    const total = d3.sum(data, (d) => d.value);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(d3.schemeCategory10);

    const pie = d3.pie<PieChartDataPoint>().value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<PieChartDataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(3);

    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", background)
      .attr("stroke-width", 2)
      .attr("opacity", 0.9)
      .on("mouseenter", function () {
        d3.select(this).transition().duration(200).attr("opacity", 1);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("opacity", 0.9);
      });

    // Percentage labels on slices
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text((d) => {
        const pct = Math.round((d.data.value / total) * 100);
        return pct > 5 ? `${pct}%` : "";
      });

    // Center label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.3em")
      .attr("fill", foreground)
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .text("Total");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", foreground)
      .attr("font-size", "18px")
      .attr("font-weight", "700")
      .text(`${total}%`);

    // Legend
    const legendG = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2 - (data.length * 90) / 2},${height - 20})`
      );

    data.forEach((d, i) => {
      const g = legendG.append("g").attr("transform", `translate(${i * 90},0)`);
      g.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("rx", 2)
        .attr("fill", color(d.label));
      g.append("text")
        .attr("x", 14)
        .attr("y", 10)
        .attr("fill", foreground)
        .attr("font-size", "11px")
        .text(d.label);
    });
  }, [data, width, height, isDark]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      role="img"
      aria-label="Pie chart showing market share distribution"
    />
  );
}
