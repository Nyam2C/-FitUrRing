import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import './WeightChart.css'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "날짜 (YYYY/MM/DD)",
            },
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 9, // 가로 축 폰트 크기 조정
                },
            },
        },
        y: {
            title: {
                display: true,
                text: "체중 (kg)",
            },
            ticks: {
                font: {
                    size: 9, // 가로 축 폰트 크기 조정
                },
            },
        }
    },
    plugins: {
        legend: {
            display: false,
        },
    },
    tooltip: {
        callbacks: {
            label: (context) => {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ${value} kg`;
            },
        },
    },
};

let diet = [
    { weight: 54 },
    { weight: 54 },
    { weight: 54 },
    { weight: 53 },
    { weight: 53 },
    { weight: 53 },
    { weight: 52 },
    { weight: 52 },
    { weight: 51 },
];



function WeightChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Weight",
                data: [],
                backgroundColor: "#FFCA29",
                borderColor: "#FFCA29",
            },
        ],
    });
    const [weight, setWeight] = useState(0);

    const getTodayDate = (date) => {
        const today = new Date(date);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const toda = new Date();
        for (let i = 0; i < 9; i++) {
            diet[i].date = new Date();
            diet[i].date.setDate(toda.getDate() - i);
        }

        if (diet && Array.isArray(diet)) {
            let labels = Array(14).fill("");
            let weights = Array(14).fill(null);
            /*
            const itemMap = new Map(diet.map((item, index) => [item.date.toISOString().split("T")[0], index]));
            const tmp = new Date(diet[diet.length - 1].date);
            for (let i = 13; i >= 0; i--) {
                tmp.setDate(tmp.getDate() + 1);
                const targetIndex = itemMap.get(tmp.toISOString().split("T")[0]) ?? -1;
                if (targetIndex != -1) {
                    labels[i] = getTodayDate(diet[targetIndex].date);
                    weights[i] = diet[targetIndex].achievement.weight;
                } else if (i < 13) {
                    labels[i] = labels[i + 1];
                    weights[i] = weights[i + 1];
                }
            }
            */
            const itemMap = new Map(diet.map((item, index) => [item.date.toISOString().split("T")[0], index]));
            for (let i = 0; i < 14; i++) {
                const tmp = new Date();
                tmp.setDate(toda.getDate() - i);
                  const targetIndex = itemMap.get(tmp.toISOString().split("T")[0]) ?? -1;
                if (targetIndex != -1) {
                    labels[i] = getTodayDate(diet[targetIndex].date);
                    weights[i] = diet[targetIndex].weight;
                } else if (i > 0) {
                    labels[i] = labels[i - 1];
                    weights[i] = weights[i - 1];
                }
            }
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: "Weight",
                        data: weights,
                        backgroundColor: "#FFCA29",
                        borderColor: "#FFCA29",
                    },
                ],
            });
        }
    }, [diet]);

    return (
        <div className='WeightChart-container'>
            <div className="graph">
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
}

export default WeightChart;
