import verbsBase from './verbs/base.json';
import presentTense from './verbs/present.json';
import { learnTenses } from './learn';

type VerbBase = {
	infinitive: string;
	translation: string;
	auxiliary: 'avere' | 'essere';
	pastParticiple: string;
};

export type Verb = VerbBase & {
	present?: VerbPresent;
	gerund?: string;
	future?: VerbFuture;
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
const gerundOverrides: Record<string, string> = {
	fare: 'facendo',
	dire: 'dicendo'
};

const futureOverrides: Record<string, VerbFuture> = {
	essere: {
		io: 'sarò',
		tu: 'sarai',
		lui_lei: 'sarà',
		noi: 'saremo',
		voi: 'sarete',
		loro: 'saranno'
	},
	avere: {
		io: 'avrò',
		tu: 'avrai',
		lui_lei: 'avrà',
		noi: 'avremo',
		voi: 'avrete',
		loro: 'avranno'
	},
	fare: {
		io: 'farò',
		tu: 'farai',
		lui_lei: 'farà',
		noi: 'faremo',
		voi: 'farete',
		loro: 'faranno'
	},
	andare: {
		io: 'andrò',
		tu: 'andrai',
		lui_lei: 'andrà',
		noi: 'andremo',
		voi: 'andrete',
		loro: 'andranno'
	},
	venire: {
		io: 'verrò',
		tu: 'verrai',
		lui_lei: 'verrà',
		noi: 'verremo',
		voi: 'verrete',
		loro: 'verranno'
	},
	dare: {
		io: 'darò',
		tu: 'darai',
		lui_lei: 'darà',
		noi: 'daremo',
		voi: 'darete',
		loro: 'daranno'
	},
	stare: {
		io: 'starò',
		tu: 'starai',
		lui_lei: 'starà',
		noi: 'staremo',
		voi: 'starete',
		loro: 'staranno'
	},
	vedere: {
		io: 'vedrò',
		tu: 'vedrai',
		lui_lei: 'vedrà',
		noi: 'vedremo',
		voi: 'vedrete',
		loro: 'vedranno'
	},
	potere: {
		io: 'potrò',
		tu: 'potrai',
		lui_lei: 'potrà',
		noi: 'potremo',
		voi: 'potrete',
		loro: 'potranno'
	},
	dovere: {
		io: 'dovrò',
		tu: 'dovrai',
		lui_lei: 'dovrà',
		noi: 'dovremo',
		voi: 'dovrete',
		loro: 'dovranno'
	},
	volere: {
		io: 'vorrò',
		tu: 'vorrai',
		lui_lei: 'vorrà',
		noi: 'vorremo',
		voi: 'vorrete',
		loro: 'vorranno'
	}
};

const futureEndings: VerbFuture = {
	io: 'ò',
	tu: 'ai',
	lui_lei: 'à',
	noi: 'emo',
	voi: 'ete',
	loro: 'anno'
};

const toGerund = (infinitive: string) => {
	if (gerundOverrides[infinitive]) return gerundOverrides[infinitive];
	if (infinitive.endsWith('are')) return `${infinitive.slice(0, -3)}ando`;
	if (infinitive.endsWith('ere') || infinitive.endsWith('ire')) {
		return `${infinitive.slice(0, -3)}endo`;
	}
	return infinitive;
};

const futureStem = (infinitive: string) => {
	if (infinitive.endsWith('are')) return `${infinitive.slice(0, -3)}er`;
	if (infinitive.endsWith('ere')) return `${infinitive.slice(0, -3)}er`;
	if (infinitive.endsWith('ire')) return `${infinitive.slice(0, -3)}ir`;
	return infinitive;
};

const toFuture = (infinitive: string): VerbFuture => {
	if (futureOverrides[infinitive]) return futureOverrides[infinitive];
	const stem = futureStem(infinitive);
	return {
		io: `${stem}${futureEndings.io}`,
		tu: `${stem}${futureEndings.tu}`,
		lui_lei: `${stem}${futureEndings.lui_lei}`,
		noi: `${stem}${futureEndings.noi}`,
		voi: `${stem}${futureEndings.voi}`,
		loro: `${stem}${futureEndings.loro}`
	};
};

export const italianVerbs: Verb[] = (verbsBase as VerbBase[]).map((verb) => ({
	...verb,
	present: presentConjugations[verb.infinitive],
	gerund: toGerund(verb.infinitive),
	future: toFuture(verb.infinitive)
}));
