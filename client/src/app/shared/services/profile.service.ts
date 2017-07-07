export interface AgeGroup {
	name: string;
	checked: boolean;
}

export const AgeGroups: [AgeGroup] = [
	{ name: 'Adults', checked: false },
	{ name: 'Kids', checked: false },
	{ name: 'Teenagers', checked: false}
];
