"use client"
import { FC } from "react";
import { Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Payload } from "recharts/types/component/DefaultLegendContent";

interface DonutChartProps {
    data: any,
    title: string,
    description?: string,
    dataKey: string,
    nameKey: string
    label?: boolean
    legend?: boolean
    panel?: React.ReactNode
}

const DonutChart: FC<DonutChartProps> = ({ legend, data, title, description, dataKey, nameKey, label, panel }) => {

    const customLegend = ({ payload }: { payload: Payload[] }) => {
        return (
            <ul className="absolute -translate-y-48 right-2 flex flex-col gap-1 max-w-fit">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8884d8]"></span>
                        <span className="text-xs">{entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="relative mb-2 w-full h-full flex flex-col">
            <div className="pl-4 mt-2 flex flex-col gap-1 mb-4">
                <p className="text-sm text-primary/50 leading-none">{description}</p>
                <h2 className="text-2xl font-bold leading-none">{title}</h2>
            </div>
            <ResponsiveContainer>
                <PieChart className="relative w-full h-full grid grid-cols-3 gap-10" width={70} height={20} >
                    <Pie
                        type="monotone"
                        className="flex fill-[#8884d8] " data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" innerRadius={120} outerRadius={200} label={label} />
                    {legend && <Legend className="absolute top-0 right-0 " content={customLegend} />}
                </PieChart>
            </ResponsiveContainer>
            {panel && <div className="bg-white shadow-sm rounded-l-md flex p-2 justify-between absolute w-2/3 right-0 bottom-2">
                {panel}
            </div>}
        </div >
    );
}

export default DonutChart;