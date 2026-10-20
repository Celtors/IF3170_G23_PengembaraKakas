import { DIMENSION_AXES, MAX_CAPACITY_FIELD } from "../../../data/configData";
import type { TruckSpec } from "../../../types/truck";
import { FormField } from "../../algorithm-config/components/FormField";
import type { ConfigIssue, UpdateTruckDimensionFn } from "../types";
import { findFirstIssue, findIssue } from "../utils/findIssue";
import { truckPath } from "../utils/issuePaths";
import "./TruckForm.css";

interface TruckFormProps {
    truck: TruckSpec;
    issues: ConfigIssue[];
    onUpdateDimension: UpdateTruckDimensionFn;
    onUpdateMaxCapacity: (value: number) => void;
}

export function TruckForm({ truck, issues, onUpdateDimension, onUpdateMaxCapacity }: TruckFormProps) {
    const dimensionIssue = findFirstIssue(
        issues,
        DIMENSION_AXES.map(({ axis }) => truckPath(axis)),
    );

    return (
        <section className="truck-form">
            <h3 className="truck-form__title">Truck</h3>

            <FormField group label="Dimensions (W x L x H)" issue={dimensionIssue}>
                <div className="form-field__row">
                    {DIMENSION_AXES.map(({ axis, label, short }) => {
                        const value = truck.dimensions[axis];
                        return (
                            <input
                                key={axis}
                                type="number"
                                min={1}
                                step={1}
                                placeholder={short}
                                aria-label={`Truck ${label.toLowerCase()}`}
                                value={Number.isNaN(value) ? "" : value}
                                onChange={(e) => onUpdateDimension(axis, e.target.valueAsNumber)}
                            />
                        );
                    })}
                </div>
            </FormField>

            <FormField
                label={`${MAX_CAPACITY_FIELD.label} (weight units)`}
                hint={MAX_CAPACITY_FIELD.hint}
                issue={findIssue(issues, truckPath("maxCapacity"))}
            >
                <input
                    type="number"
                    min={MAX_CAPACITY_FIELD.min}
                    step={MAX_CAPACITY_FIELD.step}
                    value={Number.isNaN(truck.maxCapacity) ? "" : truck.maxCapacity}
                    onChange={(e) => onUpdateMaxCapacity(e.target.valueAsNumber)}
                />
            </FormField>
        </section>
    );
}
