import nounsData from './article_nouns.json';
import type { ArticleGuideSlug } from './learn/articles';

export type ArticleModeId = 'definite-singular' | 'definite-plural' | 'indefinite';
export type ArticleNumber = 'singular' | 'plural';
export type ArticlePattern = 'standard' | 'special' | 'vowel';
export type ArticleForms = {
	definiteSingular: string;
	definitePlural: string;
	indefinite: string;
};

export type ArticleNoun = {
	singular: string;
	plural: string;
	english: string;
	gender: 'm' | 'f';
	articles: ArticleForms;
};

export type ArticlePracticeMode = {
	id: ArticleModeId;
	name: string;
	shortName: string;
	guideSlug: ArticleGuideSlug;
	number: ArticleNumber;
	articles: string[];
	quizDescription: string;
	quickRule: string;
	placeholder: string;
};

export const articlePracticeModes: ArticlePracticeMode[] = [
	{
		id: 'definite-singular',
		name: 'Definite Singular',
		shortName: 'Def. Sing.',
		guideSlug: 'definite-articles',
		number: 'singular',
		articles: ['il', 'lo', "l'", 'la'],
		quizDescription: 'Type the full singular form with the correct definite article.',
		quickRule: "Choose between il, lo, l', and la using gender and the first sound.",
		placeholder: 'il libro'
	},
	{
		id: 'definite-plural',
		name: 'Definite Plural',
		shortName: 'Def. Plur.',
		guideSlug: 'definite-articles',
		number: 'plural',
		articles: ['i', 'gli', 'le'],
		quizDescription: 'Type the full plural form with the correct definite article.',
		quickRule:
			'Plural definite articles are i, gli, and le. Special and vowel masculine nouns use gli.',
		placeholder: 'i libri'
	},
	{
		id: 'indefinite',
		name: 'Indefinite',
		shortName: 'Indefinite',
		guideSlug: 'indefinite-articles',
		number: 'singular',
		articles: ['un', 'uno', 'una', "un'"],
		quizDescription: 'Type the full singular form with the correct indefinite article.',
		quickRule: "Masculine nouns use un or uno. Feminine nouns use una or un'.",
		placeholder: 'un libro'
	}
];

export const articleNouns = nounsData as ArticleNoun[];

export const getArticlePattern = (noun: ArticleNoun): ArticlePattern => {
	if (noun.articles.definiteSingular === "l'" || noun.articles.indefinite === "un'") {
		return 'vowel';
	}
	if (noun.articles.definiteSingular === 'lo' || noun.articles.indefinite === 'uno') {
		return 'special';
	}
	return 'standard';
};

export const getArticlePatternLabel = (pattern: ArticlePattern) =>
	pattern === 'vowel' ? 'Vowel start' : pattern === 'special' ? 'Special start' : 'Standard';

export const getArticleMode = (modeId: ArticleModeId) =>
	articlePracticeModes.find((mode) => mode.id === modeId) ?? articlePracticeModes[0];

export const getPromptNumber = (modeId: ArticleModeId): ArticleNumber =>
	getArticleMode(modeId).number;

export const getArticleForNoun = (modeId: ArticleModeId, noun: ArticleNoun) => {
	const mode = getArticleMode(modeId);
	if (mode.id === 'definite-singular') return noun.articles.definiteSingular;
	if (mode.id === 'definite-plural') return noun.articles.definitePlural;
	return noun.articles.indefinite;
};

export const buildArticlePhrase = (modeId: ArticleModeId, noun: ArticleNoun) => {
	const mode = getArticleMode(modeId);
	const article = getArticleForNoun(modeId, noun);
	const nounForm = mode.number === 'plural' ? noun.plural : noun.singular;
	return article.endsWith("'") ? `${article}${nounForm}` : `${article} ${nounForm}`;
};
