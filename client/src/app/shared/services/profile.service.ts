export interface AgeGroup {
	name: string;
	selected: boolean;
}

export const AgeGroups: [AgeGroup] = [
	{ name: 'Adults', selected: false },
	{ name: 'Kids', selected: false },
	{ name: 'Teenagers', selected: false}
];
