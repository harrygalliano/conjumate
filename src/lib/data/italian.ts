import verbsBase from './verbs/base.json';
import presentTense from './verbs/present.json';
import gerundTense from './verbs/gerundio.json';
import futureTense from './verbs/futuro_semplice.json';
import passatoTense from './verbs/passato_prossimo.json';
import { learnTenses } from './learn';

type VerbBase = {
	infinitive: string;
	translation: string;
	reflexive?: boolean;
	irregular: VerbIrregular;
};

type VerbPassato = {
	auxiliary: 'avere' | 'essere';
	pastParticiple: string;
};

export type Verb = VerbBase &
	VerbPassato & {
	present?: VerbPresent;
	gerund?: string;
	future?: VerbFuture;
};

export type VerbIrregular = {
	presente: boolean;
	gerundio: boolean;
	passato_prossimo: boolean;
	futuro_semplice: boolean;
};

export type VerbPresent = {
	io: string;
	tu: string;
	lui_lei: string;
	noi: string;
	voi: string;
	loro: string;
};

export type VerbFuture = VerbPresent;

export type TenseDefinition = {
	id: 'presente' | 'gerundio' | 'passato_prossimo' | 'futuro_semplice';
	name: string;
	shortName: string;
	description: string[];
	notes: string[];
	examples: Array<{ italian: string; english: string }>;
};

export const TENSES: TenseDefinition[] = learnTenses;

// Merge base verbs with tense-specific conjugations
const presentConjugations = presentTense as Record<string, VerbPresent>;
const gerundConjugations = gerundTense as Record<string, string>;
const futureConjugations = futureTense as Record<string, VerbFuture>;
const passatoConjugations = passatoTense as Record<string, VerbPassato>;

export const italianVerbs: Verb[] = (verbsBase as VerbBase[]).map((verb) => ({
	...verb,
	present: presentConjugations[verb.infinitive],
	gerund: gerundConjugations[verb.infinitive],
	future: futureConjugations[verb.infinitive],
	...passatoConjugations[verb.infinitive]
}));
