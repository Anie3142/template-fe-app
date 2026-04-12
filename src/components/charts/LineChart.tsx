'use client';

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface LineChartPoint {
  label: string;
  value: number;
}

export function LineChart({ data }: { data: LineChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
