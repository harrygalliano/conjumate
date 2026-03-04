export type ColorVocab = {
	italian: string;
	english: string;
};

export type NumberVocab = {
	value: number;
	italian: string;
};

export const colors: ColorVocab[] = [
	{ italian: 'rosso', english: 'red' },
	{ italian: 'blu', english: 'blue' },
	{ italian: 'giallo', english: 'yellow' },
	{ italian: 'verde', english: 'green' },
	{ italian: 'arancione', english: 'orange' },
	{ italian: 'viola', english: 'purple' },
	{ italian: 'rosa', english: 'pink' },
	{ italian: 'marrone', english: 'brown' },
	{ italian: 'nero', english: 'black' },
	{ italian: 'bianco', english: 'white' },
	{ italian: 'grigio', english: 'gray' },
	{ italian: 'azzurro', english: 'light blue' },
	{ italian: 'turchese', english: 'turquoise' },
	{ italian: 'beige', english: 'beige' },
	{ italian: 'oro', english: 'gold' },
	{ italian: 'argento', english: 'silver' },
	{ italian: 'indaco', english: 'indigo' },
	{ italian: 'magenta', english: 'magenta' },
	{ italian: 'cremisi', english: 'crimson' },
	{ italian: 'bordeaux', english: 'burgundy' },
	{ italian: 'ocra', english: 'ochre' },
	{ italian: 'oliva', english: 'olive' },
	{ italian: 'lavanda', english: 'lavender' },
	{ italian: 'lilla', english: 'lilac' },
	{ italian: 'corallo', english: 'coral' },
	{ italian: 'salmone', english: 'salmon' },
	{ italian: 'prugna', english: 'plum' },
	{ italian: 'fucsia', english: 'fuchsia' },
	{ italian: 'celeste', english: 'sky blue' },
	{ italian: 'avorio', english: 'ivory' }
];

const units = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
const teens = [
	'dieci',
	'undici',
	'dodici',
	'tredici',
	'quattordici',
	'quindici',
	'sedici',
	'diciassette',
	'diciotto',
	'diciannove'
];
const tens: Record<number, string> = {
	20: 'venti',
	30: 'trenta',
	40: 'quaranta',
	50: 'cinquanta',
	60: 'sessanta',
	70: 'settanta',
	80: 'ottanta',
	90: 'novanta'
};

const toItalianNumber = (value: number) => {
	if (value < 10) return units[value];
	if (value < 20) return teens[value - 10];
	if (value === 100) return 'cento';

	const ten = Math.floor(value / 10) * 10;
	const unit = value % 10;
	const base = tens[ten];

	if (unit === 0) return base;

	const unitWord = unit === 3 ? 'tré' : units[unit];
	const trimmedBase = unit === 1 || unit === 8 ? base.slice(0, -1) : base;
	return `${trimmedBase}${unitWord}`;
};

export const numbers: NumberVocab[] = Array.from({ length: 101 }, (_, index) => ({
	value: index,
	italian: toItalianNumber(index)
}));

// Location prepositions
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

export const locations: LocationVocab[] = [
	{ italian: 'sopra', english: 'above/on top of', example: 'Il libro è sopra il tavolo' },
	{ italian: 'sotto', english: 'under/below', example: 'Il gatto è sotto il letto' },
	{ italian: 'su', english: 'on/up', example: 'Sali su!' },
	{ italian: 'giù', english: 'down', example: 'Vai giù per le scale' },
	{ italian: 'davanti', english: 'in front of', example: 'Sono davanti alla porta' },
	{ italian: 'dietro', english: 'behind', example: 'Il giardino è dietro la casa' },
	{ italian: 'accanto', english: 'next to/beside', example: 'Siediti accanto a me' },
	{ italian: 'vicino', english: 'near/close', example: 'Abito vicino al parco' },
	{ italian: 'lontano', english: 'far', example: 'La stazione è lontano da qui' },
	{ italian: 'tra', english: 'between/among', example: 'Tra Roma e Milano' },
	{ italian: 'fra', english: 'between/among', example: 'Fra poco arriviamo' },
	{ italian: 'dentro', english: 'inside', example: 'Resta dentro casa' },
	{ italian: 'fuori', english: 'outside', example: 'Andiamo fuori!' },
	{ italian: 'in', english: 'in/at', example: 'Sono in ufficio' },
	{ italian: 'a', english: 'to/at', example: 'Vado a scuola' },
	{ italian: 'da', english: 'from/at', example: 'Vengo da Milano' },
	{ italian: 'di', english: 'of/from', example: 'Sono di Roma' },
	{ italian: 'per', english: 'through/for', example: 'Passo per il centro' },
	{ italian: 'verso', english: 'towards', example: 'Cammino verso casa' },
	{ italian: 'oltre', english: 'beyond/past', example: 'Oltre la collina' }
];

