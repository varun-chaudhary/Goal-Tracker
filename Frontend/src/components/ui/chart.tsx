import { BarChart as BarChartComponent, LineChart as LineChartComponent, PieChart as PieChartComponent } from "recharts";
import { cn } from "@/lib/utils";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"],
  valueFormatter = (value: number) => `${value}`,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <BarChartComponent
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        width={500}
        height={300}
      >
        <defs>
          {colors.map((color, i) => (
            <linearGradient key={i} id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`url(#color-${i})`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChartComponent>
    </div>
  );
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"],
  valueFormatter = (value: number) => `${value}`,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <LineChartComponent
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        width={500}
        height={300}
      >
        <XAxis dataKey={index} />
        <YAxis />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChartComponent>
    </div>
  );
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"],
  valueFormatter = (value: number) => `${value}`,
  className,
  ...props
}: ChartProps) {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      <PieChartComponent
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        width={500}
        height={300}
      >
        <Tooltip formatter={valueFormatter} />
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={categories[0]}
          nameKey={index}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
      </PieChartComponent>
    </div>
  );
}

// Import the necessary components from recharts
import {
  Bar,
  Cell,
  Legend,
  Line,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";