import {
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

const data = [
    { value: 10 },
    { value: 18 },
    { value: 15 },
    { value: 28 },
    { value: 22 },
    { value: 36 },
    { value: 30 },
    { value: 46 },
];

export default function MiniTrend({
    color = "#22d3ee",
}) {
    return (
        <div className="h-14 w-full mt-5">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id="grad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor={color}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={color}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={3}
                        fill="url(#grad)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}