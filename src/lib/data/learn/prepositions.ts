export type PrepositionGuideSlug = 'prepositions';

export type PrepositionId = 'di' | 'a' | 'da' | 'in' | 'con' | 'su' | 'per' | 'tra_fra';

export type PrepositionGuideCard = {
	slug: PrepositionGuideSlug;
	name: string;
	shortName: string;
	summary: string;
};

export type PrepositionGuideTab = {
	id: PrepositionId;
	label: string;
	meaning: string;
	focus: string;
	description: string[];
	useCases: Array<{
		label: string;
		detail: string;
		examples: string[];
	}>;
	examples: Array<{
		italian: string;
		english: string;
	}>;
	tips: string[];
};

export type PrepositionGuide = PrepositionGuideCard & {
	focus: string;
	introduction: string[];
	articulatedNote: string;
	articulatedExamples: string[];
	tabs: PrepositionGuideTab[];
};

export const prepositionGuideCard: PrepositionGuideCard = {
	slug: 'prepositions',
	name: 'Basic Prepositions',
	shortName: 'Prep',
	summary:
		'Learn the core Italian prepositions and when to choose di, a, da, in, con, su, per, and tra/fra.'
};

export const prepositionGuide: PrepositionGuide = {
	...prepositionGuideCard,
	focus:
		'Start with the simple preposition, then notice when articles merge into forms like del, al, dal, nel, and sul.',
	introduction: [
		'Italian uses a small group of prepositions constantly, so learning their core meanings pays off quickly.',
		'The same preposition can cover place, movement, time, and abstract relationships, so it helps to anchor each one to a few reliable patterns first.',
		'This page focuses on the simple forms. In natural sentences you will also see articulated forms when a preposition combines with a definite article.'
	],
	articulatedNote:
		'The prepositions di, a, da, in, and su usually contract with definite articles. Con can contract in older or fixed forms, but modern Italian often keeps it separate. Per, tra, and fra stay separate.',
	articulatedExamples: [
		'di + il -> del',
		'a + il -> al',
		'da + il -> dal',
		'in + il -> nel',
		'su + il -> sul'
	],
	tabs: [
		{
			id: 'di',
			label: 'di',
			meaning: 'of, from',
			focus: 'Use di to link nouns and show belonging, origin, material, or type.',
			description: [
				'Di is one of the most flexible Italian prepositions. It often works like a connector between one noun and another.',
				'It can show whose something is, where someone or something comes from, or what something is made of.'
			],
			useCases: [
				{
					label: 'Belonging',
					detail: 'Shows possession or relationship.',
					examples: ['il libro di Marco', 'la sorella di Anna']
				},
				{
					label: 'Origin',
					detail: 'Shows where someone or something comes from.',
					examples: ['sono di Napoli', 'un vino di Toscana']
				},
				{
					label: 'Material or type',
					detail: 'Shows what something is made of or what category it belongs to.',
					examples: ['una tazza di vetro', 'una tazza di tè']
				}
			],
			examples: [
				{ italian: 'La macchina di Luca è nuova.', english: "Luca's car is new." },
				{ italian: 'Siamo di Milano.', english: 'We are from Milan.' },
				{ italian: 'Vorrei una tazza di tè.', english: 'I would like a cup of tea.' }
			],
			tips: [
				'Think of di as a linking word: noun + di + noun.',
				'After essere, di often gives origin: sono di Roma.',
				'When di meets a definite article, it normally contracts: di + il -> del.'
			]
		},
		{
			id: 'a',
			label: 'a',
			meaning: 'to, at',
			focus:
				'Use a for direction toward a point, being at a place, or giving something to someone.',
			description: [
				'A often points toward a destination or marks a specific point in space or time.',
				'It is especially common with cities and many fixed expressions such as a casa, a scuola, and a mezzogiorno.'
			],
			useCases: [
				{
					label: 'Destination',
					detail: 'Used with cities and short destination expressions.',
					examples: ['vado a Roma', 'torno a casa']
				},
				{
					label: 'Location or time',
					detail: 'Used for being at a place or at a specific time.',
					examples: ['sono a scuola', 'a mezzogiorno']
				},
				{
					label: 'Recipient',
					detail: 'Marks the person receiving an action.',
					examples: ['scrivo a Giulia', 'do il libro a Paolo']
				}
			],
			examples: [
				{ italian: 'Domani andiamo a Venezia.', english: 'Tomorrow we are going to Venice.' },
				{ italian: 'Studio a casa stasera.', english: 'I am studying at home tonight.' },
				{ italian: 'Telefono a mia madre dopo cena.', english: 'I call my mother after dinner.' }
			],
			tips: [
				'Use a with cities: a Roma, a Milano, a Venezia.',
				'For countries and larger areas, Italian usually prefers in instead.',
				'a + article gives articulated forms such as al, alla, ai, and alle.'
			]
		},
		{
			id: 'da',
			label: 'da',
			meaning: 'from, by',
			focus:
				"Use da for a starting point, for being at someone's place, or for the agent in passive expressions.",
			description: [
				'Da often answers from where? or from whom? It marks movement away from a person or place.',
				'It also means by when you say who performed an action in a passive sentence.'
			],
			useCases: [
				{
					label: 'Starting point',
					detail: 'Marks where movement begins.',
					examples: ['vengo da Firenze', 'partiamo da qui']
				},
				{
					label: "Someone's place",
					detail: 'Used for homes, offices, or businesses connected to a person.',
					examples: ['ceniamo da Chiara', 'sono dal dottore']
				},
				{
					label: 'Agent',
					detail: 'Shows who did the action in passive constructions.',
					examples: ['scritto da Elsa Morante', 'fatto da me']
				}
			],
			examples: [
				{ italian: 'Vengo da Firenze.', english: 'I come from Florence.' },
				{
					italian: 'Stasera ceniamo da Chiara.',
					english: "Tonight we are having dinner at Chiara's place."
				},
				{
					italian: 'Il romanzo è scritto da Elsa Morante.',
					english: 'The novel is written by Elsa Morante.'
				}
			],
			tips: [
				'Use da with people when you mean their home, office, or shop.',
				'Da often contrasts with per: da marks the start, per marks the route or purpose.',
				'da + article contracts: da + il -> dal.'
			]
		},
		{
			id: 'in',
			label: 'in',
			meaning: 'in, to',
			focus: 'Use in for larger areas, enclosed spaces, and many common transport expressions.',
			description: [
				'In places someone inside a space or moving into a larger destination such as a country or region.',
				'It is also common with means of transport: in treno, in macchina, in autobus.'
			],
			useCases: [
				{
					label: 'Countries and regions',
					detail: 'Used for movement to or position in larger geographic areas.',
					examples: ['in Italia', 'in Sicilia']
				},
				{
					label: 'Spaces and settings',
					detail: 'Used for enclosed places and many common environments.',
					examples: ['in ufficio', 'in cucina']
				},
				{
					label: 'Transport',
					detail: 'Used with many common ways of travelling.',
					examples: ['in treno', 'in macchina']
				}
			],
			examples: [
				{
					italian: 'Vivono in Italia da tre anni.',
					english: 'They have lived in Italy for three years.'
				},
				{ italian: 'Sono in ufficio fino alle cinque.', english: 'I am in the office until five.' },
				{ italian: 'Andiamo in treno domani.', english: 'We are going by train tomorrow.' }
			],
			tips: [
				'Use in with countries and regions, but a with cities.',
				'In often pairs naturally with rooms, buildings, and vehicles.',
				'in + article usually becomes nel, nello, nella, nei, negli, or nelle.'
			]
		},
		{
			id: 'con',
			label: 'con',
			meaning: 'with',
			focus: 'Use con for company, accompaniment, tools, and manner.',
			description: [
				'Con is usually the clearest preposition in the set because it maps directly to with in many contexts.',
				'It can describe who you are with, what you use, or the way something is done.'
			],
			useCases: [
				{
					label: 'Company',
					detail: 'Shows who is together with whom.',
					examples: ['con te', 'con i miei amici']
				},
				{
					label: 'Tool or means',
					detail: 'Shows what you use to do something.',
					examples: ['con una penna', 'con il telefono']
				},
				{
					label: 'Manner',
					detail: 'Shows the attitude or style of an action.',
					examples: ['con calma', 'con pazienza']
				}
			],
			examples: [
				{ italian: 'Vengo con te.', english: 'I am coming with you.' },
				{
					italian: 'Esco con i miei amici stasera.',
					english: 'I am going out with my friends tonight.'
				},
				{ italian: 'Scrive con molta calma.', english: 'She writes very calmly.' }
			],
			tips: [
				'Con usually keeps a stable meaning: with.',
				'Older combined forms such as col and coi exist, but plain con + article is very common today.',
				'Learn the short pronoun combinations early: con me, con te, con noi.'
			]
		},
		{
			id: 'su',
			label: 'su',
			meaning: 'on, about',
			focus: 'Use su for contact with a surface or for the topic of something.',
			description: [
				'Su can be literal, meaning on top of something, or abstract, meaning about a subject or source.',
				'It is common in phrases like sul tavolo as well as nouns such as un libro su Roma.'
			],
			useCases: [
				{
					label: 'Surface',
					detail: 'Shows physical position on top of something.',
					examples: ['su questo tavolo', 'sul letto']
				},
				{
					label: 'Topic',
					detail: 'Introduces the subject of a book, article, film, or discussion item.',
					examples: ['un libro su Napoli', 'un documentario su Fellini']
				},
				{
					label: 'Source or platform',
					detail: 'Shows where something appears or can be found.',
					examples: ['su internet', 'su questo sito']
				}
			],
			examples: [
				{ italian: 'Il telefono è sul tavolo.', english: 'The phone is on the table.' },
				{
					italian: 'Sto leggendo un libro su Napoli.',
					english: 'I am reading a book about Naples.'
				},
				{
					italian: 'Trovi tutte le informazioni su questo sito.',
					english: 'You can find all the information on this site.'
				}
			],
			tips: [
				'For conversation topics after many verbs, di is often more natural than su: parlare di qualcosa.',
				'Su is very common after nouns like libro, articolo, guida, and informazioni.',
				'Literal su often contracts with an article: su + il -> sul.'
			]
		},
		{
			id: 'per',
			label: 'per',
			meaning: 'for, through',
			focus: 'Use per for purpose, recipient, route, reason, and length of time.',
			description: [
				'Per often answers why?, for whom?, or by which route?.',
				'It can show intention, movement through a place, or duration: studio per due ore.'
			],
			useCases: [
				{
					label: 'Purpose or recipient',
					detail: 'Shows what something is for or who it is meant for.',
					examples: ['un regalo per te', "studio per l'esame"]
				},
				{
					label: 'Route',
					detail: 'Shows movement through or via a place.',
					examples: ['passiamo per il centro', 'cammino per il parco']
				},
				{
					label: 'Duration',
					detail: 'Shows how long something lasts.',
					examples: ['per due ore', 'per tutta la settimana']
				}
			],
			examples: [
				{ italian: 'Questo caffè è per te.', english: 'This coffee is for you.' },
				{
					italian: 'Passiamo per il centro prima di cena.',
					english: 'We go through the city centre before dinner.'
				},
				{
					italian: 'Studio per due ore ogni sera.',
					english: 'I study for two hours every evening.'
				}
			],
			tips: [
				'Per often introduces a goal, a benefit, or a route.',
				'With movement verbs, per can mean through or via.',
				'Do not confuse per with da: per shows purpose or path, while da marks origin.'
			]
		},
		{
			id: 'tra_fra',
			label: 'tra / fra',
			meaning: 'between, among',
			focus:
				'Use tra and fra for position among things or people, and for time until something happens.',
			description: [
				'Tra and fra mean the same thing. Speakers often choose the one that sounds smoother before the next word.',
				'They work for physical position, being among a group, and future time expressions like tra poco.'
			],
			useCases: [
				{
					label: 'Between',
					detail: 'Shows position between two places or things.',
					examples: ['tra Roma e Firenze', 'fra la banca e il bar']
				},
				{
					label: 'Among',
					detail: 'Shows being inside a group or set.',
					examples: ['fra amici', 'tra i libri']
				},
				{
					label: 'Time until',
					detail: 'Shows how long until something happens.',
					examples: ['tra poco', 'fra due giorni']
				}
			],
			examples: [
				{
					italian: 'Il bar è tra la banca e la farmacia.',
					english: 'The cafe is between the bank and the chemist.'
				},
				{ italian: 'Si sente a suo agio fra amici.', english: 'He feels at ease among friends.' },
				{ italian: 'Partiamo tra dieci minuti.', english: 'We leave in ten minutes.' }
			],
			tips: [
				'Tra and fra are interchangeable in meaning.',
				'Many speakers choose the form that sounds better: fra fratelli avoids repeating tra before fr-.',
				"Use them for future time: tra poco, fra un'ora, tra due settimane."
			]
		}
	]
};
