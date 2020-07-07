export class TreatmentDurationOption {
	public value: number;
	public display?: string;

	constructor(value: number, display: string = null) {
		this.value = value;
		this.display = display != null ? display : value.toString();
	}
}

export const TREATMENT_DURATION_OPTION: TreatmentDurationOption[] = [
	new TreatmentDurationOption(1, 'ONE TIME'),
	new TreatmentDurationOption(1.5),
	new TreatmentDurationOption(2),
	new TreatmentDurationOption(2.5),
	new TreatmentDurationOption(3),
	new TreatmentDurationOption(3.5),
	new TreatmentDurationOption(4),
	new TreatmentDurationOption(4.5),
	new TreatmentDurationOption(5),
	new TreatmentDurationOption(5.5),
	new TreatmentDurationOption(6),
	new TreatmentDurationOption(6.5),
	new TreatmentDurationOption(7),
	new TreatmentDurationOption(7.5),
	new TreatmentDurationOption(8),
	new TreatmentDurationOption(9),
	new TreatmentDurationOption(10),
	new TreatmentDurationOption(11),
	new TreatmentDurationOption(12),
	new TreatmentDurationOption(13),
	new TreatmentDurationOption(14),
	new TreatmentDurationOption(15),
];