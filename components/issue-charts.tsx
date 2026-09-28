"use client"

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { issueStatusLabels } from "@/lib/validations"

const statusConfig = {
  OPEN: { label: issueStatusLabels.OPEN, color: "var(--chart-1)" },
  IN_PROGRESS: { label: issueStatusLabels.IN_PROGRESS, color: "var(--chart-2)" },
  CLOSED: { label: issueStatusLabels.CLOSED, color: "var(--chart-3)" },
} satisfies ChartConfig

const assignmentConfig = {
  count: { label: "Issues", color: "var(--chart-1)" },
} satisfies ChartConfig

type StatusCount = {
  status: "OPEN" | "IN_PROGRESS" | "CLOSED"
  count: number
}

type Slice = {
  key: string
  label: string
  count: number
  fill: string
}

export function IssueCharts({
  statusData,
  assignmentData,
}: {
  statusData: StatusCount[]
  assignmentData: Slice[]
}) {
  const pieData = statusData.map((item) => ({
    ...item,
    fill: `var(--color-${item.status})`,
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>By status</CardTitle>
          <CardDescription>Open, in progress, and closed</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={statusConfig} className="mx-auto aspect-square max-h-[280px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
              <Pie data={pieData} dataKey="count" nameKey="status" innerRadius={58} strokeWidth={4} />
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By assignee</CardTitle>
          <CardDescription>Who work is sitting with</CardDescription>
        </CardHeader>
        <CardContent>
          {assignmentData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No issues to chart yet.
            </p>
          ) : (
            <ChartContainer config={assignmentConfig} className="aspect-auto h-[280px] w-full">
              <BarChart accessibilityLayer data={assignmentData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="label" hideLabel />}
                />
                <Bar dataKey="count" radius={6}>
                  {assignmentData.map((item) => (
                    <Cell key={item.key} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
