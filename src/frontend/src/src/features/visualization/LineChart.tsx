import { useState } from "react";
import "./LineChart.css";

export interface Series {
    name: string;
    values: number[];
    color: string;
}

const W = 480;
const H = 200;
const M = { l: 56, r: 12, t: 10, b: 30 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

const fmt = (v: number) =>
    Number.isInteger(v) || Math.abs(v) >= 100 ? Math.round(v).toLocaleString() : v.toPrecision(3);

export function LineChart({ title, series, xLabel = "Iterasi" }: { title: string; series: Series[]; xLabel?: string }) {
    const [hover, setHover] = useState<number | null>(null);

    const n = series.reduce((m, s) => Math.max(m, s.values.length), 0);
    if (n === 0) return null;

    let lo = Infinity;
    let hi = -Infinity;
    for (const s of series) for (const v of s.values) { if (v < lo) lo = v; if (v > hi) hi = v; }
    if (lo === hi) { lo -= 1; hi += 1; }

    const x = (i: number) => M.l + (n === 1 ? PW / 2 : (i / (n - 1)) * PW);
    const y = (v: number) => M.t + PH - ((v - lo) / (hi - lo)) * PH;
    const yTicks = [0, 1, 2, 3, 4].map((k) => lo + ((hi - lo) * k) / 4);
    const xTicks = [...new Set([0, 1, 2, 3, 4].map((k) => Math.round(((n - 1) * k) / 4)))];

    const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W;
        const i = Math.round(((px - M.l) / PW) * (n - 1));
        setHover(Math.min(n - 1, Math.max(0, i)));
    };

    return (
        <figure className="line-chart">
            <figcaption className="line-chart__title">{title}</figcaption>
            {series.length > 1 && (
                <ul className="line-chart__legend">
                    {series.map((s) => (
                        <li key={s.name}><span style={{ background: s.color }} />{s.name}</li>
                    ))}
                </ul>
            )}
            <div className="line-chart__plot">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    role="img"
                    aria-label={`${title}, ${n} titik data`}
                    onPointerMove={onMove}
                    onPointerLeave={() => setHover(null)}
                >
                    {yTicks.map((v) => (
                        <g key={v}>
                            <line className="line-chart__grid" x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
                            <text className="line-chart__tick" x={M.l - 6} y={y(v)} textAnchor="end" dominantBaseline="middle">
                                {fmt(v)}
                            </text>
                        </g>
                    ))}
                    {xTicks.map((i) => (
                        <text key={i} className="line-chart__tick" x={x(i)} y={H - M.b + 16} textAnchor="middle">{i}</text>
                    ))}
                    <text className="line-chart__tick" x={W - M.r} y={H - 2} textAnchor="end">{xLabel}</text>
                    {series.map((s) => (
                        <polyline
                            key={s.name}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={2}
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                            points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                        />
                    ))}
                    {hover !== null && (
                        <g>
                            <line className="line-chart__cross" x1={x(hover)} x2={x(hover)} y1={M.t} y2={M.t + PH} />
                            {series.map((s) => hover < s.values.length && (
                                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={4} fill={s.color} className="line-chart__dot" />
                            ))}
                        </g>
                    )}
                </svg>
                {hover !== null && (
                    <div
                        className="line-chart__tip"
                        style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > n / 2 ? "translateX(calc(-100% - 8px))" : "translateX(8px)" }}
                    >
                        <div className="line-chart__tip-head">{xLabel} {hover}</div>
                        {series.map((s) => hover < s.values.length && (
                            <div key={s.name}>
                                <span className="line-chart__swatch" style={{ background: s.color }} />
                                {s.name}: <b>{fmt(s.values[hover])}</b>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </figure>
    );
}
