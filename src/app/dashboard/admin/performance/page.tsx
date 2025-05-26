"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle, Clock, Users, TrendingUp, TrendingDown, Repeat2, TimerReset, ThumbsUp, Eye } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import type { PerformanceKPI } from "@/types";

const completionData = [
  { month: 'Jan', rate: 65 }, { month: 'Feb', rate: 70 }, { month: 'Mar', rate: 72 },
  { month: 'Apr', rate: 78 }, { month: 'May', rate: 80 }, { month: 'Jun', rate: 85 },
];
const chartConfigCompletion = { rate: { label: "Completion Rate", color: "hsl(var(--primary))" } };

const scoreData = [
  { name: 'Module A', score: 88 }, { name: 'Module B', score: 75 }, { name: 'Module C', score: 92 },
  { name: 'Module D', score: 80 }, { name: 'Module E', score: 60 }, { name: 'Module F', score: 95 },
];
const chartConfigScore = { score: { label: "Average Score", color: "hsl(var(--accent))" } };

const timeToProficiencyData = [
    { category: 'Sales', time: 25 },
    { category: 'Engineering', time: 40 },
    { category: 'Marketing', time: 30 },
    { category: 'Support', time: 20 },
];
const chartConfigTimeToProficiency = { time: { label: "Days", color: "hsl(var(--secondary))" } };

const kpis: PerformanceKPI[] = [
    { metric: "Overall Completion Rate", value: "85%", trend: "up", icon: CheckCircle },
    { metric: "Average Quiz Score", value: "88%", trend: "up", icon: TrendingUp },
    { metric: "Avg. Time to Proficiency", value: "32 days", trend: "down", icon: Clock },
    { metric: "Active Learners", value: "150", trend: "neutral", icon: Users },
    { metric: "Repeat Attempts", value: "2.4", trend: "up", icon: Repeat2 },
    { metric: "Avg. Onboarding Duration", value: "5.3 days", trend: "down", icon: TimerReset },
    { metric: "Feedback Score", value: "4.5 / 5", trend: "up", icon: ThumbsUp },
    { metric: "Drop-off Rate", value: "12%", trend: "down", icon: Eye },
];

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BarChart3 className="h-7 w-7 text-primary" /> Performance Dashboard
          </CardTitle>
          <CardDescription>
            Key Performance Indicators (KPIs) for employee onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                <Card key={kpi.metric} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.metric}</CardTitle>
                    <kpi.icon className={`h-5 w-5 ${kpi.trend === 'up' ? 'text-green-500' : kpi.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                    <div className="text-3xl font-bold">{kpi.value}</div>
                    {kpi.trend !== 'neutral' && (
                        <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.trend === 'up' ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
                        vs last period
                        </p>
                    )}
                    </CardContent>
                </Card>
                ))}
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Monthly Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigCompletion} className="h-[300px] w-full">
                  <LineChart data={completionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="%" />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Legend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-rate)" }} activeDot={{r:7}}/>
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Average Quiz Scores by Module</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigScore} className="h-[300px] w-full">
                  <BarChart data={scoreData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                    <XAxis type="number" unit="%" tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="dot" />} />
                    <Legend content={<ChartLegendContent />} />
                    <Bar dataKey="score" fill="var(--color-score)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
           <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Time to Proficiency by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigTimeToProficiency} className="h-[300px] w-full">
                    <BarChart data={timeToProficiencyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8}/>
                        <YAxis unit=" days" tickLine={false} axisLine={false} tickMargin={8} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Legend content={<ChartLegendContent />} />
                        <Bar dataKey="time" fill="var(--color-time)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
