export type ArticleGuideSlug = 'definite-articles' | 'indefinite-articles';

export type ArticleGuide = {
	slug: ArticleGuideSlug;
	name: string;
	shortName: string;
	summary: string;
	focus: string;
	description: string[];
	forms: Array<{
		article: string;
		label: string;
		use: string;
		examples: string[];
	}>;
	examples: Array<{
		italian: string;
		english: string;
	}>;
	tips: string[];
};

export const definiteArticleGuide: ArticleGuide = {
	slug: 'definite-articles',
	name: 'Definite Articles',
	shortName: 'The',
	summary:
		'Use definite articles when you mean "the". The form changes with gender, number, and the first sound of the noun.',
	focus: "Choose between il, lo, l', la, i, gli, and le.",
	description: [
		'Italian definite articles agree with the noun, so you need the right gender and number first.',
		"Masculine singular nouns split into il, lo, and l'. Feminine singular nouns usually take la or l'.",
		"Plural forms depend on the singular article: il becomes i, while lo and l' become gli."
	],
	forms: [
		{
			article: 'il',
			label: 'Masculine singular',
			use: 'Before most consonants.',
			examples: ['il libro', 'il ragazzo']
		},
		{
			article: 'lo',
			label: 'Masculine singular',
			use: 'Before z, s + consonant, gn, ps, x, or y.',
			examples: ['lo studente', 'lo zaino']
		},
		{
			article: "l'",
			label: 'Singular before vowels',
			use: 'Used for masculine and feminine singular nouns that start with a vowel.',
			examples: ["l'amico", "l'isola"]
		},
		{
			article: 'la',
			label: 'Feminine singular',
			use: 'Before most consonants.',
			examples: ['la casa', 'la penna']
		},
		{
			article: 'i',
			label: 'Masculine plural',
			use: 'Plural of nouns that use il.',
			examples: ['i libri', 'i ragazzi']
		},
		{
			article: 'gli',
			label: 'Masculine plural',
			use: "Plural of nouns that use lo or l'.",
			examples: ['gli studenti', 'gli amici']
		},
		{
			article: 'le',
			label: 'Feminine plural',
			use: 'Plural of feminine nouns.',
			examples: ['le case', 'le isole']
		}
	],
	examples: [
		{ italian: 'Il caffè è caldo.', english: 'The coffee is hot.' },
		{ italian: 'Lo studente arriva presto.', english: 'The student arrives early.' },
		{ italian: "L'amica vive a Roma.", english: 'The friend lives in Rome.' },
		{ italian: 'La macchina è nuova.', english: 'The car is new.' },
		{ italian: 'Gli amici parlano italiano.', english: 'The friends speak Italian.' },
		{ italian: 'Le ragazze studiano insieme.', english: 'The girls study together.' }
	],
	tips: [
		'Start by learning the noun with its article: il libro, la casa, lo studente.',
		"Masculine vowel nouns use l' in the singular but gli in the plural: l'amico -> gli amici.",
		'The special masculine pattern is the one to watch: lo -> gli.',
		'If you are unsure, check the noun ending and then the first sound.'
	]
};

export const indefiniteArticleGuide: ArticleGuide = {
	slug: 'indefinite-articles',
	name: 'Indefinite Articles',
	shortName: 'A / An',
	summary:
		'Use indefinite articles when you mean "a" or "an". The form changes with gender and the first sound of the noun.',
	focus: "Choose between un, uno, una, and un'.",
	description: [
		'Italian indefinite articles only have singular forms, so they are simpler than definite articles.',
		'Masculine nouns take un or uno depending on the starting sound.',
		"Feminine nouns take una before most consonants and un' before vowels."
	],
	forms: [
		{
			article: 'un',
			label: 'Masculine singular',
			use: 'Before most consonants and before vowels.',
			examples: ['un libro', 'un amico']
		},
		{
			article: 'uno',
			label: 'Masculine singular',
			use: 'Before z, s + consonant, gn, ps, x, or y.',
			examples: ['uno studente', 'uno zio']
		},
		{
			article: 'una',
			label: 'Feminine singular',
			use: 'Before most consonants.',
			examples: ['una casa', 'una penna']
		},
		{
			article: "un'",
			label: 'Feminine singular before vowels',
			use: 'Used only with feminine singular nouns that start with a vowel.',
			examples: ["un'amica", "un'isola"]
		},
		{
			article: 'dei / degli / delle',
			label: 'Plural idea',
			use: 'Italian usually uses partitive forms for "some" in the plural.',
			examples: ['dei libri', 'degli amici', 'delle case']
		}
	],
	examples: [
		{ italian: 'Ho un fratello.', english: 'I have a brother.' },
		{ italian: "C'è uno studente fuori.", english: 'There is a student outside.' },
		{ italian: 'Lei compra una macchina.', english: 'She buys a car.' },
		{ italian: "Vedo un'amica al bar.", english: 'I see a friend at the cafe.' },
		{ italian: 'Abbiamo degli ospiti stasera.', english: 'We have some guests tonight.' }
	],
	tips: [
		"Masculine un does not take an apostrophe before vowels: un amico, not un'amico.",
		"Only the feminine vowel form uses the apostrophe: un'amica.",
		'If a masculine noun would take lo in the definite form, it usually takes uno in the indefinite form.',
		'Plural nouns normally switch from a/an to some: dei, degli, delle.'
	]
};

export const articleGuides = [definiteArticleGuide, indefiniteArticleGuide] as const;
