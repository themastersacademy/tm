import { BarChart, Bar, XAxis, ResponsiveContainer, YAxis } from "recharts";

const data = [
  { day: "S", progress: 5, fill: "var(--primary-color-acc-2)" },
  { day: "M", progress: 25, fill: "var(--primary-color-acc-2)" },
  { day: "T", progress: 10, fill: "var(--primary-color-acc-2)" },
  { day: "W", progress: 15, fill: "var(--primary-color-acc-2)" },
  { day: "T", progress: 20, fill: "var(--sec-color)" },
  { day: "F", progress: 2, fill: "var(--primary-color-acc-2)" },
  { day: "S", progress: 3, fill: "var(--primary-color-acc-2)" },
];

export default function DailyProgress() {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
      style={{ padding: "10px 0px 0px 0px" }}
    >
      <BarChart data={data}>
        <XAxis dataKey="day" axisLine={false} tickLine={false} />
        {/* <YAxis axisLine={false} tickLine={false} /> */}
        <Bar
          dataKey="progress"
          barSize={15}
          radius={[15, 15, 0, 0]}
          fill={(entry) => entry.fill}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
