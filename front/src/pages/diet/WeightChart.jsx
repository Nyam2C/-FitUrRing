import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import './WeightChart.css'
import { getWeightHistory } from './api';

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
        tooltip: {
            callbacks: {
                label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.raw;
                    return `${label}: ${value} kg`;
                },
            },
        },
    },
};

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

    const [chartOptions, setChartOptions] = useState(options);

    useEffect(() => {
        const fetchWeightHistory = async () => {
            try {
                const data = await getWeightHistory();
                
                if (!data || data.length === 0) {
                    console.log('데이터가 없습니다');
                    return;
                }

                const weights = data.map(item => item.weight);
                
                // null 값 처리 후 최대/최소값 계산
                const validWeights = weights.filter(w => w !== null);
                const minWeight = Math.min(...validWeights);
                const maxWeight = Math.max(...validWeights);
                
                // 범위의 10% 계산
                const range = maxWeight - minWeight;
                const padding = range * 0.1;

                // y축 범위 설정
                setChartOptions(prev => ({
                    ...prev,
                    scales: {
                        ...prev.scales,
                        y: {
                            ...prev.scales.y,
                            min: Math.floor(minWeight - padding),
                            max: Math.ceil(maxWeight + padding),
                        }
                    }
                }));

                // 기존의 차트 데이터 설정 로직
                const labels = data.map(item => {
                    const date = new Date(item.date);
                    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                });

                // null 값을 이후 날짜의 가장 가까운 weight 값으로 채우기
                for (let i = 0; i < weights.length; i++) {
                    if (weights[i] === null) {
                        let nextValue = null;
                        for (let j = i + 1; j < weights.length; j++) {
                            if (weights[j] !== null) {
                                nextValue = weights[j];
                                break;
                            }
                        }
                        weights[i] = nextValue;
                    }
                }

                // 차트 데이터 설정
                setChartData(prevState => ({
                    labels: labels,
                    datasets: [
                        {
                            label: "Weight",
                            data: weights,
                            backgroundColor: "#FFCA29",
                            borderColor: "#FFCA29",
                            tension: 0.4, // 선을 부드럽게 만듦
                            pointRadius: 4, // 포인트 크기
                        },
                    ],
                }));
            } catch (error) {
                console.error('체중 데이터 가져오기 실패:', error);
            }
        };

        fetchWeightHistory();
    }, []);

    const getTodayDate = (date) => {
        const today = new Date(date);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className='WeightChart-container'>
            <div className="graph">
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
}

export default WeightChart;
