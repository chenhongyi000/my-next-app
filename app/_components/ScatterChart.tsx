"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import type { ScatterChartDataPoint } from "@/app/_lib/chartTypes";

interface ScatterChartProps {
  data: ScatterChartDataPoint[];
  width: number;
  height: number;
}

export default function ScatterChart({ data, width, height }: ScatterChartProps) {
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

    const xExtent = d3.extent(data, (d) => d.x) as [number, number];
    const yExtent = d3.extent(data, (d) => d.y) as [number, number];

    const xPad = (xExtent[1] - xExtent[0]) * 0.05;
    const yPad = (yExtent[1] - yExtent[0]) * 0.1;

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] - xPad, xExtent[1] + xPad])
      .nice()
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] - yPad, yExtent[1] + yPad])
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

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", gridColor));

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
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
      .call(d3.axisLeft(yScale).ticks(5))
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

    // Axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("fill", foreground)
      .attr("font-size", "13px")
      .attr("font-weight", "500")
      .text("Time on Page (seconds)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .attr("fill", foreground)
      .attr("font-size", "13px")
      .attr("font-weight", "500")
      .text("Conversion Rate (%)");

    // Scatter points
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 5)
      .attr("fill", accent)
      .attr("opacity", 0.7)
      .on("mouseenter", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .attr("opacity", 0.7);
      })
      .append("title")
      .text((d) => `Time: ${d.x}s | Rate: ${d.y}%${d.label ? ` (${d.label})` : ""}`);
  }, [data, width, height, isDark]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      role="img"
      aria-label="Scatter plot showing time on page vs conversion rate"
    />
  );
}
