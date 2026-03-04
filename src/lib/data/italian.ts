import verbs from './italian-verbs.json';

export type Verb = {
	infinitive: string;
	translation: string;
	auxiliary: 'avere' | 'essere';
	pastParticiple: string;
	present?: VerbPresent;
};

export type VerbPresent = {
	io: string;
	tu: string;
	lui_lei: string;
	noi: string;
	voi: string;
	loro: string;
};

export type TenseDefinition = {
	id: 'presente' | 'passato_prossimo';
	name: string;
	shortName: string;
	description: string[];
	notes: string[];
	examples: Array<{ italian: string; english: string }>;
};

export const TENSES: TenseDefinition[] = [
	{
		id: 'presente',
		name: 'Present (Presente)',
		shortName: 'Present',
		description: [
			'Use it for actions happening now, routines, or general truths.',
			'Conjugate the verb directly. No auxiliary needed.'
		],
		notes: ['Regular -are, -ere, -ire endings are common, but many verbs are irregular.'],
		examples: [
			{ italian: 'Io mangio una pizza.', english: 'I am eating a pizza.' },
			{ italian: 'Noi studiamo italiano.', english: 'We study Italian.' },
			{ italian: 'Loro parlano piano.', english: 'They speak slowly.' }
		]
	},
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
