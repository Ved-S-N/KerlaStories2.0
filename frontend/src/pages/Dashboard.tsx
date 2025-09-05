import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, DollarSign, Wheat, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy data
const incomeData = [
  { month: "Jan", income: 12000 },
  { month: "Feb", income: 15000 },
  { month: "Mar", income: 18000 },
  { month: "Apr", income: 22000 },
  { month: "May", income: 25000 },
  { month: "Jun", income: 28000 },
];

const cropYieldData = [
  { crop: "Rice", yield: 45 },
  { crop: "Wheat", yield: 32 },
  { crop: "Corn", yield: 28 },
  { crop: "Soybean", yield: 20 },
  { crop: "Cotton", yield: 15 },
];

const productivityData = [
  { month: "Jan", yield: 40, revenue: 12000, cost: 8000 },
  { month: "Feb", yield: 45, revenue: 15000, cost: 9000 },
  { month: "Mar", yield: 50, revenue: 18000, cost: 10000 },
  { month: "Apr", yield: 55, revenue: 22000, cost: 11000 },
  { month: "May", yield: 60, revenue: 25000, cost: 12000 },
  { month: "Jun", yield: 65, revenue: 28000, cost: 13000 },
];

const pieData = [
  { name: "Rice", value: 45, color: "#8884d8" },
  { name: "Wheat", value: 32, color: "#82ca9d" },
  { name: "Corn", value: 28, color: "#ffc658" },
  { name: "Soybean", value: 20, color: "#ff7c7c" },
  { name: "Cotton", value: 15, color: "#8dd1e1" },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  yield: {
    label: "Yield",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-3))",
  },
  cost: {
    label: "Cost",
    color: "hsl(var(--chart-4))",
  },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Farm Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor your farm's performance with real-time insights and
            analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Income over time */}
          <Card className="bg-gradient-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Income Over Time
              </CardTitle>
              <CardDescription>Monthly income trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-income)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Loan repayment progress */}
          <Card className="bg-gradient-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Loan Repayment Progress
              </CardTitle>
              <CardDescription>Current repayment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Loan</p>
                  <p className="font-semibold">₹500,000</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Paid</p>
                  <p className="font-semibold">₹375,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crop yield stats - Bar Chart */}
          <Card className="bg-gradient-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheat className="h-5 w-5 mr-2 text-primary" />
                Crop Yield Stats
              </CardTitle>
              <CardDescription>
                Yield by crop type (tons/hectare)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={cropYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="yield" fill="var(--color-yield)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Farm productivity trends */}
          <Card className="bg-gradient-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Farm Productivity Trends
              </CardTitle>
              <CardDescription>
                Multi-metric productivity analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="var(--color-yield)"
                    strokeWidth={2}
                    name="Yield (tons)"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    name="Revenue (₹)"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="var(--color-cost)"
                    strokeWidth={2}
                    name="Cost (₹)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Pie Chart for Crop Distribution */}
        <div className="mt-8">
          <Card className="bg-gradient-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wheat className="h-5 w-5 mr-2 text-primary" />
                Crop Distribution
              </CardTitle>
              <CardDescription>
                Percentage distribution of crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
