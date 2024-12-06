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



function WeightChart(diet) {
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

    const getWeight = (w) => {
        if(w!=undefined){
            setWeight(w);
            return w;
        }else return false;
    }

    useEffect(() => {
        if (diet && diet.array) {
            const labels = diet.array.map(entry => getTodayDate(entry.date)); // 날짜 데이터
            const weights = diet.array.map(entry => getWeight(entry.achievement?.weight) || weight); // 체중 데이터
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
