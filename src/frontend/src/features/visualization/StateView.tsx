import { useMemo, useState } from "react";
import type { RunResponse } from "../../api/run";
import { Truck3D } from "./Truck3D";
import { layoutBoxes, packageColor } from "./layout";
import "./StateView.css";

const PLACEMENT_LABEL = { inside: "Dalam", outside: "Luar", stuck: "Stuck" } as const;

export function StateView({ result }: { result: RunResponse | null }) {
    const [which, setWhich] = useState<"init" | "final">("final");
    const [hovered, setHovered] = useState<string | null>(null);

    const state = result?.states.find((s) => s.state === which) ?? null;
    const truck = result?.problem.truck;
    const packages = result?.problem.packages;

    const boxes = useMemo(
        () => (truck && packages && state ? layoutBoxes(truck, packages, state) : []),
        [truck, packages, state],
    );

    if (!result || !truck || !packages || !state) {
        return <div className="state-view empty">Tekan Run untuk melihat state awal dan akhir.</div>;
    }

    const byId = new Map(packages.map((p) => [p.id, p]));
    const inside = state.placements.filter((p) => p.placement === "inside").map((p) => byId.get(p.package_id)!);
    const stuckCount = state.placements.filter((p) => p.placement === "stuck").length;
    const totalValue = inside.reduce((s, p) => s + p.value, 0);
    const totalWeight = inside.reduce((s, p) => s + p.weight, 0);
    const overweight = totalWeight > truck.max_capacity;

    return (
        <div className="state-view">
            <div className="state-toolbar">
                <div className="state-tabs" role="tablist">
                    {(["init", "final"] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            role="tab"
                            aria-selected={which === s}
                            className={which === s ? "active" : ""}
                            onClick={() => setWhich(s)}
                        >
                            {s === "init" ? "State awal" : "State akhir"}
                        </button>
                    ))}
                </div>
                <dl className="state-stats">
                    <div><dt>Objective</dt><dd>{state.objective_value}</dd></div>
                    <div><dt>Value di truk</dt><dd>{totalValue}</dd></div>
                    <div className={overweight ? "bad" : ""}>
                        <dt>Berat</dt><dd>{totalWeight} / {truck.max_capacity}</dd>
                    </div>
                    <div><dt>Paket di truk</dt><dd>{inside.length} / {packages.length}</dd></div>
                    {stuckCount > 0 && <div className="bad"><dt>Stuck</dt><dd>{stuckCount}</dd></div>}
                    <div><dt>Truk (w×l×h)</dt><dd>{truck.width}×{truck.length}×{truck.height}</dd></div>
                </dl>
            </div>

            <div className="state-body">
                <div className="state-canvas">
                    <Truck3D truck={truck} boxes={boxes} highlightId={hovered} onHover={setHovered} />
                    <p className="state-hint">
                        Seret untuk memutar, scroll untuk zoom. Transparan = di luar truk, merah = stuck (menembus dinding), tepi oranye = pecah-belah.
                    </p>
                </div>

                <div className="state-table">
                    <table>
                        <thead>
                            <tr><th>Paket</th><th>Lokasi</th><th>Posisi</th><th>Orientasi</th><th>Value</th><th>Berat</th></tr>
                        </thead>
                        <tbody>
                            {state.placements.map((pl) => {
                                const p = byId.get(pl.package_id)!;
                                const idx = packages.indexOf(p);
                                return (
                                    <tr
                                        key={pl.package_id}
                                        className={hovered === pl.package_id ? "hovered" : ""}
                                        onMouseEnter={() => setHovered(pl.package_id)}
                                        onMouseLeave={() => setHovered(null)}
                                    >
                                        <td>
                                            <span className="swatch" style={{ background: packageColor(idx) }} />
                                            {p.id}{p.is_fragile && <span title="Pecah-belah"> ⚠</span>}
                                        </td>
                                        <td className={pl.placement === "stuck" ? "bad" : ""}>{PLACEMENT_LABEL[pl.placement]}</td>
                                        <td>{pl.placement === "outside" ? "-" : `(${pl.position.join(", ")})`}</td>
                                        <td title="Sisi paket w, l, h sejajar dengan sumbu truk ini">
                                            w:{pl.orientation.w} l:{pl.orientation.l} h:{pl.orientation.h}
                                        </td>
                                        <td>{p.value}</td>
                                        <td>{p.weight}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
