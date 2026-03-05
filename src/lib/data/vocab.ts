import colorsData from './vocab/colors.json';
import numbersData from './vocab/numbers.json';
import locationsData from './vocab/locations.json';
import familyData from './vocab/family.json';
import possessivesData from './vocab/possessives.json';

// Types
export type ColorVocab = {
	italian: string;
	english: string;
};

export type NumberVocab = {
	value: number;
	italian: string;
};

export type LocationWord =
	| 'sopra'
	| 'sotto'
	| 'su'
	| 'giù'
	| 'davanti'
	| 'dietro'
	| 'accanto'
	| 'vicino'
	| 'lontano'
	| 'tra'
	| 'fra'
	| 'dentro'
	| 'fuori'
	| 'in'
	| 'a'
	| 'da'
	| 'di'
	| 'per'
	| 'verso'
	| 'oltre';

export type LocationVocab = {
	italian: LocationWord;
	english: string;
	example?: string;
};

export type FamilyMember = {
	english: string;
	italian: string;
	gender: 'm' | 'f';
	plural: string;
	pluralEnglish: string;
};

export type PossessiveForms = {
	ms: string;
	fs: string;
	mp: string;
	fp: string;
};

export type PossessiveData = {
	pronoun: 'io' | 'tu' | 'lui_lei' | 'noi' | 'voi' | 'loro';
	pronounLabel: string;
	english: string;
	forms: PossessiveForms;
	usesArticleSingular: boolean;
};

// Data exports
export const colors = colorsData as ColorVocab[];
export const numbers = numbersData as NumberVocab[];
export const locations = locationsData as LocationVocab[];
export const familyMembers = familyData as FamilyMember[];
export const possessives = possessivesData as PossessiveData[];

// Articles for possessives
const articles = {
	ms: 'il',
	fs: 'la',
	mp: 'i',
	fp: 'le'
};

export type FamilyQuizItem = {
	english: string;
	italian: string;
	pronoun: string;
	member: string;
	isPlural: boolean;
};

// Generate all family quiz items
export const generateFamilyQuizItems = (): FamilyQuizItem[] => {
	const items: FamilyQuizItem[] = [];

	for (const poss of possessives) {
		for (const member of familyMembers) {
			// Singular form
			const genderKey = member.gender === 'm' ? 'ms' : 'fs';
			const possForm = poss.forms[genderKey];
			const article = articles[genderKey];
			
			// Singular family members don't use article (except loro)
			const singularItalian = poss.usesArticleSingular
				? `${article} ${possForm} ${member.italian}`
				: `${possForm} ${member.italian}`;

			items.push({
				english: `${poss.english} ${member.english}`,
				italian: singularItalian,
				pronoun: poss.pronounLabel,
				member: member.italian,
				isPlural: false
			});

			// Plural form - always uses article
			const pluralGenderKey = member.gender === 'm' ? 'mp' : 'fp';
			const pluralPossForm = poss.forms[pluralGenderKey];
			const pluralArticle = articles[pluralGenderKey];
			const pluralItalian = `${pluralArticle} ${pluralPossForm} ${member.plural}`;

			items.push({
				english: `${poss.english} ${member.pluralEnglish}`,
				italian: pluralItalian,
				pronoun: poss.pronounLabel,
				member: member.plural,
				isPlural: true
			});
		}
	}

	return items;
};

export const familyQuizItems = generateFamilyQuizItems();

