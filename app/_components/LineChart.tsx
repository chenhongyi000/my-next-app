"use client";

import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useTranslations } from "next-intl";
import type { LineChartDataPoint } from "@/app/_lib/chartTypes";

interface LineChartProps {
  data: LineChartDataPoint[];
  width: number;
  height: number;
}

export default function LineChart({ data, width, height }: LineChartProps) {
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

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parsed = data.map((d) => ({
      date: new Date(d.date),
      value: d.value,
    }));

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsed, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yMax = d3.max(parsed, (d) => d.value) ?? 0;
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
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat((d) => d3.timeFormat("%b")(d as Date))
      )
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

    // Area fill gradient
    const gradientId = "line-area-gradient";
    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", opacity: 0.2 },
        { offset: "100%", opacity: 0.0 },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", accent)
      .attr("stop-opacity", (d) => d.opacity);

    // Area
    const area = d3
      .area<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(parsed)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area);

    // Line
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(parsed)
      .attr("fill", "none")
      .attr("stroke", accent)
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // Data points
    g.selectAll(".dot")
      .data(parsed)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", accent)
      .attr("stroke", "currentColor")
      .style("color", styles.getPropertyValue("--background").trim() || "#fff")
      .attr("stroke-width", 2)
      .on("mouseenter", function () {
        d3.select(this).transition().duration(200).attr("r", 7);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("r", 4);
      })
      .append("title")
      .text(
        (d) =>
          `${d3.timeFormat("%B %Y")(d.date)}: ${d3.format(",")(d.value)} ${t("visits")}`
      );
  }, [data, width, height, isDark, t]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      role="img"
      aria-label={t("lineChartAriaLabel")}
    />
  );
}
