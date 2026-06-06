export type ChartTab = "bar" | "pie" | "line" | "scatter";

export interface BarChartDataPoint {
  category: string;
  value: number;
}

export interface PieChartDataPoint {
  label: string;
  value: number;
}

export interface LineChartDataPoint {
  date: string;
  value: number;
}

export interface ScatterChartDataPoint {
  x: number;
  y: number;
  label?: string;
}
