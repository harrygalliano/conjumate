import verbsBase from './verbs/base.json';
import presentTense from './verbs/present.json';

type VerbBase = {
	infinitive: string;
	translation: string;
	auxiliary: 'avere' | 'essere';
	pastParticiple: string;
};

export type Verb = VerbBase & {
	present?: VerbPresent;
	gerund?: string;
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
	id: 'presente' | 'gerundio' | 'passato_prossimo';
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
		id: 'gerundio',
		name: 'Present Continuous (Gerundio)',
		shortName: 'Gerund',
		description: [
			'Use stare + gerundio for actions happening right now.',
			'Form the gerund with -ando for -are verbs and -endo for -ere/-ire verbs.'
		],
		notes: ['Common pattern: io sto parlando, tu stai studiando.'],
		examples: [
			{ italian: 'Io sto mangiando.', english: 'I am eating.' },
			{ italian: 'Lei sta studiando.', english: 'She is studying.' },
			{ italian: 'Stiamo parlando.', english: 'We are talking.' }
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

// Merge base verbs with tense-specific conjugations
const presentConjugations = presentTense as Record<string, VerbPresent>;
const gerundOverrides: Record<string, string> = {
	fare: 'facendo',
	dire: 'dicendo'
};

const toGerund = (infinitive: string) => {
	if (gerundOverrides[infinitive]) return gerundOverrides[infinitive];
	if (infinitive.endsWith('are')) return `${infinitive.slice(0, -3)}ando`;
	if (infinitive.endsWith('ere') || infinitive.endsWith('ire')) {
		return `${infinitive.slice(0, -3)}endo`;
	}
	return infinitive;
};

export const italianVerbs: Verb[] = (verbsBase as VerbBase[]).map((verb) => ({
	...verb,
	present: presentConjugations[verb.infinitive],
	gerund: toGerund(verb.infinitive)
}));
