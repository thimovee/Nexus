"use client"
import { FC, ReactElement } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AreaChartComponentProps {
    data: any,
    xKey: string,
    yKeys: string[],
    title: string,
    description?: string,
    grid?: boolean
    showLines?: boolean
}



const AreaChartComponent: FC<AreaChartComponentProps> = ({ data, xKey, yKeys, title, description, grid, showLines }) => {

    const hexColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d8c1d8', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d8c1d8'];

    // @ts-ignore
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-cta rounded-xl min-w-24 p-4 text-sm">
                    <p className="text-background font-bold">{label}</p>
                    <span className="text-background/75">${payload[0].value}</span>

                </div>
            );
        }
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="pl-4 mt-2 flex flex-col gap-1">
                <p className="text-sm text-primary/50 leading-none">{description}</p>
                <h2 className="text-2xl font-bold leading-none">{title}</h2>
            </div>
            <ResponsiveContainer  >
                <AreaChart width={730} height={250} data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis className="text-[10px]" dataKey={xKey} axisLine={showLines} tickLine={showLines} />
                    <YAxis className="text-[10px]" axisLine={showLines} tickLine={showLines} />
                    {grid && <CartesianGrid stroke="#ededed" strokeDasharray="10 5" />}
                    <Tooltip content={<CustomTooltip
                        active={true} label={data[0][xKey]} payload={[{ value: data[0][yKeys[0]] }]}
                    />} />
                    {yKeys.map((key, index) => (
                        <Area key={index} type="monotone" dataKey={key} stroke={hexColors[index]} fillOpacity={1} fill="url(#colorUv)" />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div >

    );
}

export default AreaChartComponent;