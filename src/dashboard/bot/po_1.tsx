"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

export default function Po_1() {
    return (
        <Card className="w-auto">
            <CardHeader>
                <CardTitle className="text-lg">性能提升建议</CardTitle>
                <CardDescription>
                    我们建议适度减小您的 -xxx- 参数值
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        31
                        <span className="text-sm font-normal text-muted-foreground">
              ms/get
            </span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="aspect-auto h-[32px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            margin={{
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: "修改后",
                                    steps: 9,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={4}
                                barSize={32}
                            >
                                <LabelList
                                    position="insideLeft"
                                    dataKey="date"
                                    offset={8}
                                    fontSize={12}
                                    fill="white"
                                />
                            </Bar>
                            <YAxis dataKey="date" type="category" tickCount={1} hide />
                            <XAxis dataKey="steps" type="number" hide />
                        </BarChart>
                    </ChartContainer>
                </div>
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        45
                        <span className="text-sm font-normal text-muted-foreground">
              ms/get
            </span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--muted))",
                            },
                        }}
                        className="aspect-auto h-[32px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            margin={{
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: "修改前",
                                    steps: 15,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={4}
                                barSize={32}
                            >
                                <LabelList
                                    position="insideLeft"
                                    dataKey="date"
                                    offset={8}
                                    fontSize={12}
                                    fill="hsl(var(--muted-foreground))"
                                />
                            </Bar>
                            <YAxis dataKey="date" type="category" tickCount={1} hide />
                            <XAxis dataKey="steps" type="number" hide />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
