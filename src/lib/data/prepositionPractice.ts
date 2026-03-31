export type PrepositionArticleSource = {
	preposition: string;
	meaning: string[];
	combines_with_articles: boolean | 'sometimes';
	notes?: string;
	forms?: Partial<Record<'il' | 'lo' | 'la' | "l'" | 'i' | 'gli' | 'le', string>>;
	full_forms_also_used?: Partial<Record<'il' | 'lo' | 'la' | "l'" | 'i' | 'gli' | 'le', string>>;
};

export type PrepositionArticleItem = {
	id: string;
	preposition: string;
	article: 'il' | 'lo' | 'la' | "l'" | 'i' | 'gli' | 'le';
	answer: string;
	acceptedAnswers: string[];
	meaning: string[];
	combinesWithArticles: boolean | 'sometimes';
	notes?: string;
	alternateForm?: string;
};

export const prepositionArticleSources: PrepositionArticleSource[] = [
	{
		preposition: 'di',
		meaning: ['of', 'from'],
		combines_with_articles: true,
		forms: {
			il: 'del',
			lo: 'dello',
			la: 'della',
			"l'": "dell'",
			i: 'dei',
			gli: 'degli',
			le: 'delle'
		}
	},
	{
		preposition: 'a',
		meaning: ['to', 'at'],
		combines_with_articles: true,
		forms: {
			il: 'al',
			lo: 'allo',
			la: 'alla',
			"l'": "all'",
			i: 'ai',
			gli: 'agli',
			le: 'alle'
		}
	},
	{
		preposition: 'da',
		meaning: ['from', 'by', "at someone's place"],
		combines_with_articles: true,
		forms: {
			il: 'dal',
			lo: 'dallo',
			la: 'dalla',
			"l'": "dall'",
			i: 'dai',
			gli: 'dagli',
			le: 'dalle'
		}
	},
	{
		preposition: 'in',
		meaning: ['in', 'to'],
		combines_with_articles: true,
		forms: {
			il: 'nel',
			lo: 'nello',
			la: 'nella',
			"l'": "nell'",
			i: 'nei',
			gli: 'negli',
			le: 'nelle'
		}
	},
	{
		preposition: 'su',
		meaning: ['on', 'about'],
		combines_with_articles: true,
		forms: {
			il: 'sul',
			lo: 'sullo',
			la: 'sulla',
			"l'": "sull'",
			i: 'sui',
			gli: 'sugli',
			le: 'sulle'
		}
	},
	{
		preposition: 'con',
		meaning: ['with'],
		combines_with_articles: 'sometimes',
		notes: 'Contracted forms exist but are less systematic in modern usage.',
		forms: {
			il: 'col',
			i: 'coi'
		},
		full_forms_also_used: {
			il: 'con il',
			lo: 'con lo',
			la: 'con la',
			"l'": "con l'",
			i: 'con i',
			gli: 'con gli',
			le: 'con le'
		}
	},
	{
		preposition: 'per',
		meaning: ['for', 'through'],
		combines_with_articles: false
	},
	{
		preposition: 'tra',
		meaning: ['between', 'among'],
		combines_with_articles: false
	},
	{
		preposition: 'fra',
		meaning: ['between', 'among'],
		combines_with_articles: false
	}
];

const articleOrder = ['il', 'lo', 'la', "l'", 'i', 'gli', 'le'] as const;

const normalizeCombo = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[\u2019']/g, '')
		.replace(/\s+/g, '');

export const prepositionArticleItems: PrepositionArticleItem[] = prepositionArticleSources.flatMap(
	(source) => {
		if (!source.forms) return [];

		return articleOrder.flatMap((article) => {
			const answer = source.forms?.[article];
			if (!answer) return [];

			const alternate = source.full_forms_also_used?.[article];
			const acceptedAnswers = alternate ? [answer, alternate] : [answer];

			return [
				{
					id: `${source.preposition}-${article}`,
					preposition: source.preposition,
					article,
					answer,
					acceptedAnswers,
					meaning: source.meaning,
					combinesWithArticles: source.combines_with_articles,
					notes: source.notes,
					alternateForm: alternate
				}
			];
		});
	}
);

export const isPrepositionArticleAnswerCorrect = (input: string, item: PrepositionArticleItem) => {
	const normalizedInput = normalizeCombo(input);
	return item.acceptedAnswers.some((answer) => normalizeCombo(answer) === normalizedInput);
};
