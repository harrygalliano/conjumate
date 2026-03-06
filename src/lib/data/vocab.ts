import colorsData from './vocab/colors.json';
import numbersData from './vocab/numbers.json';
import locationsData from './vocab/locations.json';
import familyData from './vocab/family.json';
import possessivesData from './vocab/possessives.json';
import peopleData from './vocab/people.json';
import calendarData from './vocab/calendar.json';

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

export type PeopleAdjective = {
	english: string;
	italian: PossessiveForms;
};

export type PeopleDescriptionItem = {
	english: string;
	italian: string;
	pronoun: string;
	adjective: string;
	number: 's' | 'p';
	gender: 'm' | 'f';
};

export type CalendarCategory = 'basics' | 'days' | 'months' | 'seasons';

export type CalendarVocab = {
	italian: string;
	english: string;
	category: CalendarCategory;
};

export type TimeVocabItem = {
	prompt: string;
	answer: string;
	hint?: string;
};

// Data exports
export const colors = colorsData as ColorVocab[];
export const numbers = numbersData as NumberVocab[];
export const locations = locationsData as LocationVocab[];
export const familyMembers = familyData as FamilyMember[];
export const possessives = possessivesData as PossessiveData[];
export const peopleAdjectives = peopleData as PeopleAdjective[];
export const calendar = calendarData as CalendarVocab[];

const numberMap = new Map<number, string>();
for (const item of numbersData as NumberVocab[]) {
	numberMap.set(item.value, item.italian);
}

const numberWord = (value: number) => numberMap.get(value) ?? String(value);
const pad2 = (value: number) => value.toString().padStart(2, '0');
const isOneHour = (hour: number) => hour === 1;

const formatHourPhrase = (hour: number) =>
	isOneHour(hour) ? "l'una" : `le ${numberWord(hour)}`;

const timePhraseDigital = (hour: number, minute: number) => {
	if (hour === 0 && minute === 0) return 'è mezzanotte';
	if (hour === 12 && minute === 0) return 'è mezzogiorno';
	const verb = isOneHour(hour) ? 'è' : 'sono';
	const hourPhrase = formatHourPhrase(hour);
	if (minute === 0) return `${verb} ${hourPhrase}`;
	return `${verb} ${hourPhrase} e ${numberWord(minute)}`;
};

const minuteWordAnalog = (minute: number) => {
	if (minute === 15) return 'un quarto';
	if (minute === 30) return 'mezza';
	return numberWord(minute);
};

const timePhraseAnalog = (hour: number, minute: number) => {
	const hourLabel = formatHourPhrase(hour);
	const verb = isOneHour(hour) ? 'è' : 'sono';
	if (minute === 0) return `${verb} ${hourLabel}`;
	if (minute <= 30) {
		return `${verb} ${hourLabel} e ${minuteWordAnalog(minute)}`;
	}
	const nextHour = hour === 12 ? 1 : hour + 1;
	const nextVerb = isOneHour(nextHour) ? 'è' : 'sono';
	const nextLabel = formatHourPhrase(nextHour);
	return `${nextVerb} ${nextLabel} meno ${minuteWordAnalog(60 - minute)}`;
};

const buildAnalogTimes = () => {
	const items: TimeVocabItem[] = [];
	for (let hour = 1; hour <= 12; hour += 1) {
		for (let minute = 0; minute < 60; minute += 5) {
			items.push({
				prompt: `${hour}:${pad2(minute)}`,
				answer: timePhraseAnalog(hour, minute),
				hint: 'analogue'
			});
		}
	}
	return items;
};

const buildDigitalTimes = () => {
	const items: TimeVocabItem[] = [];
	for (let hour = 0; hour < 24; hour += 1) {
		for (let minute = 0; minute < 60; minute += 1) {
			items.push({
				prompt: `${pad2(hour)}:${pad2(minute)}`,
				answer: timePhraseDigital(hour, minute),
				hint: 'digital'
			});
		}
	}
	return items;
};

export const timeAnalogItems = buildAnalogTimes();
export const timeDigitalItems = buildDigitalTimes();

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

type PeoplePronoun = {
	english: string;
	italian: string;
	essere: string;
	gender: 'm' | 'f';
	number: 's' | 'p';
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

const peoplePronouns: PeoplePronoun[] = [
	{ english: 'I am', italian: 'io', essere: 'sono', gender: 'm', number: 's' },
	{ english: 'I am', italian: 'io', essere: 'sono', gender: 'f', number: 's' },
	{ english: 'You are', italian: 'tu', essere: 'sei', gender: 'm', number: 's' },
	{ english: 'You are', italian: 'tu', essere: 'sei', gender: 'f', number: 's' },
	{ english: 'He is', italian: 'lui', essere: 'è', gender: 'm', number: 's' },
	{ english: 'She is', italian: 'lei', essere: 'è', gender: 'f', number: 's' },
	{ english: 'We are', italian: 'noi', essere: 'siamo', gender: 'm', number: 'p' },
	{ english: 'We are', italian: 'noi', essere: 'siamo', gender: 'f', number: 'p' },
	{ english: 'You (plural) are', italian: 'voi', essere: 'siete', gender: 'm', number: 'p' },
	{ english: 'You (plural) are', italian: 'voi', essere: 'siete', gender: 'f', number: 'p' },
	{ english: 'They are', italian: 'loro', essere: 'sono', gender: 'm', number: 'p' },
	{ english: 'They are', italian: 'loro', essere: 'sono', gender: 'f', number: 'p' }
];

const adjectiveForm = (adj: PeopleAdjective, gender: 'm' | 'f', number: 's' | 'p') => {
	if (gender === 'm' && number === 's') return adj.italian.ms;
	if (gender === 'f' && number === 's') return adj.italian.fs;
	if (gender === 'm' && number === 'p') return adj.italian.mp;
	return adj.italian.fp;
};

export const peopleDescriptions: PeopleDescriptionItem[] = peopleAdjectives.map(
	(adjective, index) => {
		const pronoun = peoplePronouns[index % peoplePronouns.length];
		const italianAdj = adjectiveForm(adjective, pronoun.gender, pronoun.number);

		return {
			english: `${pronoun.english} ${adjective.english}`,
			italian: `${pronoun.italian} ${pronoun.essere} ${italianAdj}`,
			pronoun: pronoun.italian,
			adjective: italianAdj,
			gender: pronoun.gender,
			number: pronoun.number
		};
	}
);
