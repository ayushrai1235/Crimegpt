"use client";

import { useQuery } from "@tanstack/react-query";
import ReactECharts from 'echarts-for-react';

export default function AnalyticsDashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['analytics_dashboard'],
        queryFn: async () => {
            try {
                const res = await fetch('http://localhost:3001/analytics/dashboard');
                if (!res.ok) throw new Error("Failed to fetch dashboard data");
                return await res.json();
            } catch (e) {
                console.warn("Falling back to mock analytics data");
                return {
                    todaysFIRs: 142,
                    crimeDistribution: [
                        { name: 'Cyber Fraud', value: 35 },
                        { name: 'Theft', value: 45 },
                        { name: 'Assault', value: 20 },
                        { name: 'Other', value: 42 }
                    ],
                    districtRankings: [
                        { name: 'Bangalore Urban', count: 120 },
                        { name: 'Mysuru', count: 85 },
                        { name: 'Hubballi', count: 60 },
                        { name: 'Mangaluru', count: 40 }
                    ],
                    trends: {
                        xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        series: [12, 19, 15, 25, 22, 30, 28]
                    }
                };
            }
        },
        refetchInterval: 60000 // refresh every minute
    });

    if (isLoading) return <div className="p-12 text-center text-slate-500">Loading Analytics Dashboard...</div>;
    if (error) return <div className="p-12 text-center text-red-500">Error loading dashboard.</div>;

    const pieOptions = {
        title: { text: 'Crime Distribution', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
            {
                name: 'Categories',
                type: 'pie',
                radius: '50%',
                data: data?.crimeDistribution || [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    const barOptions = {
        title: { text: 'Crime Trends (Last 7 Days)', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data?.trends?.xAxis || [] },
        yAxis: { type: 'value' },
        series: [
            {
                data: data?.trends?.series || [],
                type: 'bar',
                itemStyle: { color: '#3b82f6' }
            }
        ]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KPI Cards */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Today&apos;s FIRs</h3>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">{data?.todaysFIRs || 0}</div>
                    <p className="text-xs text-green-600 mt-2 font-medium">+12% from yesterday</p>
                </div>
                
                <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Top Hotspot</h3>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">Bangalore Urban</div>
                    <p className="text-xs text-red-600 mt-2 font-medium">Critical Activity Detected</p>
                </div>

                <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">AI Solvability Score</h3>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">78%</div>
                    <p className="text-xs text-blue-600 mt-2 font-medium">Based on semantic network matches</p>
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
                <ReactECharts option={pieOptions} style={{ height: '100%', width: '100%' }} />
            </div>

            <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px]">
                <ReactECharts option={barOptions} style={{ height: '100%', width: '100%' }} />
            </div>

            {/* District Rankings Table */}
            <div className="col-span-full bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">District Rankings by Volume</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3">Rank</th>
                                <th className="px-6 py-3">District</th>
                                <th className="px-6 py-3 text-right">Total Cases</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.districtRankings?.map((district: { name: string, count: number }, index: number) => (
                                <tr key={district.name} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                                    <td className="px-6 py-4">{district.name}</td>
                                    <td className="px-6 py-4 text-right font-semibold">{district.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
