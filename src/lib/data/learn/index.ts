import presente from './presente.json';
import gerundio from './gerundio.json';
import passatoProssimo from './passato_prossimo.json';
import futuroSemplice from './futuro_semplice.json';

export type LearnTense = {
	id: 'presente' | 'gerundio' | 'passato_prossimo' | 'futuro_semplice';
	name: string;
	shortName: string;
	description: string[];
	notes: string[];
	examples: Array<{ italian: string; english: string }>;
	focus: string;
	formula: string;
	tips: string[];
};

export const learnTenses = [
	presente,
	gerundio,
	passatoProssimo,
	futuroSemplice
] as LearnTense[];
