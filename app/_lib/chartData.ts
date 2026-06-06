import type {
  BarChartDataPoint,
  PieChartDataPoint,
  LineChartDataPoint,
  ScatterChartDataPoint,
} from "@/app/_lib/chartTypes";

export const barChartData: BarChartDataPoint[] = [
  { category: "Jan", value: 12500 },
  { category: "Feb", value: 18200 },
  { category: "Mar", value: 9700 },
  { category: "Apr", value: 22100 },
  { category: "May", value: 15600 },
  { category: "Jun", value: 19800 },
];

export const pieChartData: PieChartDataPoint[] = [
  { label: "Product A", value: 35 },
  { label: "Product B", value: 25 },
  { label: "Product C", value: 20 },
  { label: "Product D", value: 12 },
  { label: "Product E", value: 8 },
];

export const lineChartData: LineChartDataPoint[] = [
  { date: "2026-01-01", value: 4500 },
  { date: "2026-02-01", value: 5200 },
  { date: "2026-03-01", value: 6100 },
  { date: "2026-04-01", value: 7800 },
  { date: "2026-05-01", value: 8300 },
  { date: "2026-06-01", value: 7200 },
  { date: "2026-07-01", value: 9100 },
  { date: "2026-08-01", value: 10400 },
  { date: "2026-09-01", value: 11700 },
  { date: "2026-10-01", value: 12600 },
  { date: "2026-11-01", value: 13800 },
  { date: "2026-12-01", value: 14800 },
];

export const scatterChartData: ScatterChartDataPoint[] = [
  { x: 12, y: 0.8 },
  { x: 25, y: 1.2 },
  { x: 34, y: 1.5 },
  { x: 45, y: 1.8 },
  { x: 52, y: 1.9 },
  { x: 61, y: 2.1 },
  { x: 73, y: 2.4 },
  { x: 80, y: 2.3 },
  { x: 88, y: 2.7 },
  { x: 95, y: 2.8 },
  { x: 102, y: 2.9 },
  { x: 115, y: 3.1 },
  { x: 124, y: 3.2 },
  { x: 137, y: 3.5 },
  { x: 145, y: 3.4 },
  { x: 158, y: 3.8 },
  { x: 167, y: 3.7 },
  { x: 175, y: 4.0 },
  { x: 188, y: 4.2 },
  { x: 196, y: 4.1 },
  { x: 210, y: 4.5 },
  { x: 225, y: 4.8 },
  { x: 238, y: 5.0 },
  { x: 250, y: 5.2 },
  { x: 267, y: 5.5 },
  { x: 280, y: 5.8 },
  { x: 295, y: 6.2 },
];
