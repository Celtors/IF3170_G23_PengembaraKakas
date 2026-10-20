import React from "react";
import type { SolutionState } from "../../../types/state";
import "./ObjectiveChart.css";

interface ObjectiveChartProps {
    states: SolutionState[];
    title?: string;
}

export const ObjectiveChart: React.FC<ObjectiveChartProps> = ({ states, title = "Objective function history" }) => {
    const points = states.map((state) => ({ x: state.iteration, y: state.objectiveValue }));
    const width = 720;
    const height = 230;
    const left = 54;
    const right = 18;
    const top = 20;
    const bottom = 38;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const minX = Math.min(0, ...points.map((point) => point.x));
    const maxX = Math.max(1, ...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y), 0);
    const maxY = Math.max(1, ...points.map((point) => point.y));
    const xPos = (x: number) => left + ((x - minX) / (maxX - minX)) * plotWidth;
    const yPos = (y: number) => top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;
    const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${xPos(point.x)},${yPos(point.y)}`).join(" ");
    const yTicks = Array.from({ length: 4 }, (_, index) => minY + ((maxY - minY) * index) / 3);

    return (
        <section className="experiment-chart" aria-label={title}>
            <div className="experiment-chart__heading">
                <h3>{title}</h3>
                <span>Objective value</span>
            </div>
            {points.length < 2 ? (
                <p className="experiment-chart__empty">At least two recorded states are needed to draw a history chart.</p>
            ) : (
                <svg className="experiment-chart__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}, from ${points[0].y} to ${points[points.length - 1].y}`}>
                    {yTicks.map((tick) => (
                        <g key={tick}>
                            <line x1={left} x2={width - right} y1={yPos(tick)} y2={yPos(tick)} className="experiment-chart__grid" />
                            <text x={left - 9} y={yPos(tick) + 4} textAnchor="end" className="experiment-chart__tick">{Math.round(tick).toLocaleString()}</text>
                        </g>
                    ))}
                    <line x1={left} x2={width - right} y1={top + plotHeight} y2={top + plotHeight} className="experiment-chart__axis" />
                    <path d={path} className="experiment-chart__line" />
                    {points.map((point, index) => <circle key={`${point.x}-${index}`} cx={xPos(point.x)} cy={yPos(point.y)} r="4" className="experiment-chart__point"><title>{`Iteration ${point.x}: ${point.y}`}</title></circle>)}
                    <text x={left} y={height - 8} className="experiment-chart__tick">{minX} iterations</text>
                    <text x={width - right} y={height - 8} textAnchor="end" className="experiment-chart__tick">{maxX} iterations</text>
                </svg>
            )}
        </section>
    );
};
