import styled from 'styled-components';
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';

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

const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    margin: 10px;
    text-align: center;
    width: 98%;
    height: 53%;
    color: #333;
    background-color: #e0e0e0;
    .graph {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/weights`); // 백엔드 API 경로로 수정
                const data = await response.json();

                const labels = data.map(entry => entry.date); // 날짜 데이터
                const weights = data.map(entry => entry.weight); // 체중 데이터

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
            } catch (error) {
                console.error("Error fetching weight data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Header>
            <div className="graph">
                <Line options={options} data={chartData} />
            </div>
        </Header>
    );
}

export default WeightChart;
