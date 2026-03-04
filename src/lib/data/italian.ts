import verbs from './italian-verbs.json';

export type Verb = {
	infinitive: string;
	translation: string;
	auxiliary: 'avere' | 'essere';
	pastParticiple: string;
};

export type TenseDefinition = {
	id: 'passato_prossimo';
	name: string;
	shortName: string;
	description: string[];
	notes: string[];
	examples: Array<{ italian: string; english: string }>;
};

export const TENSES: TenseDefinition[] = [
	{
		id: 'passato_prossimo',
		name: 'Present Perfect (Passato Prossimo)',
		shortName: 'Present Perfect',
		description: [
			'Use it for completed actions in the past that still feel relevant now.',
			'Form it with the present of avere or essere plus the past participle.'
		],
		notes: [
			'Many movement or state verbs take essere. Agreement is simplified in this quiz.'
		],
		examples: [
			{ italian: 'Io ho mangiato una pizza.', english: 'I ate a pizza.' },
			{ italian: 'Lei ha studiato italiano.', english: 'She studied Italian.' },
			{ italian: 'Noi siamo arrivati tardi.', english: 'We arrived late.' }
		]
	}
];

export const italianVerbs = verbs as Verb[];
