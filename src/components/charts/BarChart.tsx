'use client';

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface BarChartPoint {
  label: string;
  value: number;
}

export function BarChart({ data }: { data: BarChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
