import { writeFileSync } from 'fs';
import { resolve } from 'path';

const verbList = [
	{ infinitive: 'essere', translation: 'to be' },
	{ infinitive: 'avere', translation: 'to have' },
	{ infinitive: 'volere', translation: 'to want' },
	{ infinitive: 'fare', translation: 'to do' },
	{ infinitive: 'dire', translation: 'to say' },
	{ infinitive: 'capire', translation: 'to understand' },
	{ infinitive: 'sapere', translation: 'to know' },
	{ infinitive: 'spiegare', translation: 'to explain' },
	{ infinitive: 'uscire', translation: 'to exit' },
	{ infinitive: 'andare', translation: 'to go' },
	{ infinitive: 'venire', translation: 'to come' },
	{ infinitive: 'potere', translation: 'can, to be able to' },
	{ infinitive: 'dovere', translation: 'must' },
	{ infinitive: 'preferire', translation: 'to prefer' },
	{ infinitive: 'bere', translation: 'to drink' },
	{ infinitive: 'salire', translation: 'to go up' },
	{ infinitive: 'rimanere', translation: 'to stay' },
	{ infinitive: 'morire', translation: 'to die' },
	{ infinitive: 'finire', translation: 'to finish' },
	{ infinitive: 'vedere', translation: 'to see' },
	{ infinitive: 'leggere', translation: 'to read' },
	{ infinitive: 'nascere', translation: 'to be born' },
	{ infinitive: 'chiedere', translation: 'to ask' },
	{ infinitive: 'rispondere', translation: 'to reply' },
	{ infinitive: 'conoscere', translation: 'to know' },
	{ infinitive: 'mettere', translation: 'to put' },
	{ infinitive: 'aprire', translation: 'to open' },
	{ infinitive: 'perdere', translation: 'to lose' },
	{ infinitive: 'vivere', translation: 'to live' },
	{ infinitive: 'cuocere', translation: 'to cook' },
	{ infinitive: 'scendere', translation: 'to go down' },
	{ infinitive: 'scrivere', translation: 'to write' },
	{ infinitive: 'prendere', translation: 'to take' },
	{ infinitive: 'rompere', translation: 'to break' },
	{ infinitive: 'correre', translation: 'to run' },
	{ infinitive: 'vincere', translation: 'to win' },
	{ infinitive: 'tradurre', translation: 'to translate' },
	{ infinitive: 'chiudere', translation: 'to close' },
	{ infinitive: 'accendere', translation: 'to switch on' },
	{ infinitive: 'crescere', translation: 'to grow up' },
	{ infinitive: 'spingere', translation: 'to push' },
	{ infinitive: 'scusarsi', translation: 'to apologize' },
	{ infinitive: 'chiamarsi', translation: 'to be called' },
	{ infinitive: 'divertirsi', translation: 'to have fun' },
	{ infinitive: 'abituarsi', translation: 'to get used to' },
	{ infinitive: 'comportarsi', translation: 'to behave' },
	{ infinitive: 'piacere', translation: 'to like' },
	{ infinitive: 'dispiacere', translation: 'to be sorry' },
	{ infinitive: 'mancare', translation: 'to miss' },
	{ infinitive: 'interessare', translation: 'to interest' },
	{ infinitive: 'sembrare', translation: 'to seem' },
	{ infinitive: 'amare', translation: 'to love' },
	{ infinitive: 'mangiare', translation: 'to eat' },
	{ infinitive: 'ascoltare', translation: 'to listen' },
	{ infinitive: 'parlare', translation: 'to speak' },
	{ infinitive: 'ordinare', translation: 'to order' },
	{ infinitive: 'cercare', translation: 'to look for' },
	{ infinitive: 'pensare', translation: 'to think' },
	{ infinitive: 'incontrare', translation: 'to meet' },
	{ infinitive: 'portare', translation: 'to bring' },
	{ infinitive: 'toccare', translation: 'to touch' },
	{ infinitive: 'guardare', translation: 'to watch' },
	{ infinitive: 'tornare', translation: 'to return' },
	{ infinitive: 'trovare', translation: 'to find' },
	{ infinitive: 'dare', translation: 'to give' },
	{ infinitive: 'abitare', translation: 'to live in' },
	{ infinitive: 'sperare', translation: 'to hope' },
	{ infinitive: 'aspettare', translation: 'to wait' },
	{ infinitive: 'pranzare', translation: 'to have lunch' },
	{ infinitive: 'cenare', translation: 'to have dinner' },
	{ infinitive: 'telefonare', translation: 'to phone' },
	{ infinitive: 'comprare', translation: 'to buy' },
	{ infinitive: 'pagare', translation: 'to pay' },
	{ infinitive: 'entrare', translation: 'to enter' },
	{ infinitive: 'lavorare', translation: 'to work' },
	{ infinitive: 'studiare', translation: 'to study' },
	{ infinitive: 'mandare', translation: 'to send' },
	{ infinitive: 'lasciare', translation: 'to leave, to let' },
	{ infinitive: 'salutare', translation: 'to greet' },
	{ infinitive: 'usare', translation: 'to use' },
	{ infinitive: 'visitare', translation: 'to visit' },
	{ infinitive: 'camminare', translation: 'to walk' },
	{ infinitive: 'iniziare', translation: 'to start' },
	{ infinitive: 'imparare', translation: 'to learn' },
	{ infinitive: 'cambiare', translation: 'to change' },
	{ infinitive: 'guadagnare', translation: 'to earn' },
	{ infinitive: 'aiutare', translation: 'to help' },
	{ infinitive: 'ricordare', translation: 'to remember' },
	{ infinitive: 'tirare', translation: 'to pull' },
	{ infinitive: 'invitare', translation: 'to invite' },
	{ infinitive: 'diventare', translation: 'to become' },
	{ infinitive: 'giocare', translation: 'to play' },
	{ infinitive: 'credere', translation: 'to believe' },
	{ infinitive: 'vendere', translation: 'to sell' },
	{ infinitive: 'ripetere', translation: 'to repeat' },
	{ infinitive: 'godere', translation: 'to enjoy' },
	{ infinitive: 'dormire', translation: 'to sleep' },
	{ infinitive: 'servire', translation: 'to need' },
	{ infinitive: 'partire', translation: 'to leave' },
	{ infinitive: 'pulire', translation: 'to clean' }
];

const reflexiveVerbs = new Set(['scusarsi', 'chiamarsi', 'divertirsi', 'abituarsi', 'comportarsi']);
const iscVerbs = new Set(['capire', 'preferire', 'finire', 'pulire']);

const irregularPresent = {
	essere: { io: 'sono', tu: 'sei', lui_lei: 'è', noi: 'siamo', voi: 'siete', loro: 'sono' },
	avere: { io: 'ho', tu: 'hai', lui_lei: 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' },
	volere: { io: 'voglio', tu: 'vuoi', lui_lei: 'vuole', noi: 'vogliamo', voi: 'volete', loro: 'vogliono' },
	fare: { io: 'faccio', tu: 'fai', lui_lei: 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' },
	dire: { io: 'dico', tu: 'dici', lui_lei: 'dice', noi: 'diciamo', voi: 'dite', loro: 'dicono' },
	sapere: { io: 'so', tu: 'sai', lui_lei: 'sa', noi: 'sappiamo', voi: 'sapete', loro: 'sanno' },
	uscire: { io: 'esco', tu: 'esci', lui_lei: 'esce', noi: 'usciamo', voi: 'uscite', loro: 'escono' },
	andare: { io: 'vado', tu: 'vai', lui_lei: 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' },
	venire: { io: 'vengo', tu: 'vieni', lui_lei: 'viene', noi: 'veniamo', voi: 'venite', loro: 'vengono' },
	potere: { io: 'posso', tu: 'puoi', lui_lei: 'può', noi: 'possiamo', voi: 'potete', loro: 'possono' },
	dovere: { io: 'devo', tu: 'devi', lui_lei: 'deve', noi: 'dobbiamo', voi: 'dovete', loro: 'devono' },
	bere: { io: 'bevo', tu: 'bevi', lui_lei: 'beve', noi: 'beviamo', voi: 'bevete', loro: 'bevono' },
	salire: { io: 'salgo', tu: 'sali', lui_lei: 'sale', noi: 'saliamo', voi: 'salite', loro: 'salgono' },
	rimanere: { io: 'rimango', tu: 'rimani', lui_lei: 'rimane', noi: 'rimaniamo', voi: 'rimanete', loro: 'rimangono' },
	morire: { io: 'muoio', tu: 'muori', lui_lei: 'muore', noi: 'moriamo', voi: 'morite', loro: 'muoiono' },
	piacere: { io: 'piaccio', tu: 'piaci', lui_lei: 'piace', noi: 'piacciamo', voi: 'piacete', loro: 'piacciono' },
	dispiacere: {
		io: 'dispiaccio',
		tu: 'dispiaci',
		lui_lei: 'dispiace',
		noi: 'dispiacciamo',
		voi: 'dispiacete',
		loro: 'dispiacciono'
	},
	dare: { io: 'do', tu: 'dai', lui_lei: 'dà', noi: 'diamo', voi: 'date', loro: 'danno' },
	correre: { io: 'corro', tu: 'corri', lui_lei: 'corre', noi: 'corriamo', voi: 'correte', loro: 'corrono' },
	cuocere: { io: 'cuocio', tu: 'cuoci', lui_lei: 'cuoce', noi: 'cuociamo', voi: 'cuocete', loro: 'cuociono' },
	tradurre: { io: 'traduco', tu: 'traduci', lui_lei: 'traduce', noi: 'traduciamo', voi: 'traducete', loro: 'traducono' }
};

const irregularPast = {
	essere: 'stato',
	fare: 'fatto',
	dire: 'detto',
	venire: 'venuto',
	bere: 'bevuto',
	rimanere: 'rimasto',
	morire: 'morto',
	vedere: 'visto',
	leggere: 'letto',
	nascere: 'nato',
	chiedere: 'chiesto',
	rispondere: 'risposto',
	mettere: 'messo',
	aprire: 'aperto',
	perdere: 'perso',
	vivere: 'vissuto',
	cuocere: 'cotto',
	scendere: 'sceso',
	scrivere: 'scritto',
	prendere: 'preso',
	rompere: 'rotto',
	correre: 'corso',
	vincere: 'vinto',
	tradurre: 'tradotto',
	chiudere: 'chiuso',
	accendere: 'acceso',
	crescere: 'cresciuto',
	spingere: 'spinto',
	piacere: 'piaciuto',
	dispiacere: 'dispiaciuto'
};

const gerundOverrides = {
	essere: 'essendo',
	fare: 'facendo',
	dire: 'dicendo',
	tradurre: 'traducendo'
};

const futureOverrides = {
	essere: { io: 'sarò', tu: 'sarai', lui_lei: 'sarà', noi: 'saremo', voi: 'sarete', loro: 'saranno' },
	avere: { io: 'avrò', tu: 'avrai', lui_lei: 'avrà', noi: 'avremo', voi: 'avrete', loro: 'avranno' },
	fare: { io: 'farò', tu: 'farai', lui_lei: 'farà', noi: 'faremo', voi: 'farete', loro: 'faranno' },
	andare: { io: 'andrò', tu: 'andrai', lui_lei: 'andrà', noi: 'andremo', voi: 'andrete', loro: 'andranno' },
	venire: { io: 'verrò', tu: 'verrai', lui_lei: 'verrà', noi: 'verremo', voi: 'verrete', loro: 'verranno' },
	dare: { io: 'darò', tu: 'darai', lui_lei: 'darà', noi: 'daremo', voi: 'darete', loro: 'daranno' },
	vedere: { io: 'vedrò', tu: 'vedrai', lui_lei: 'vedrà', noi: 'vedremo', voi: 'vedrete', loro: 'vedranno' },
	potere: { io: 'potrò', tu: 'potrai', lui_lei: 'potrà', noi: 'potremo', voi: 'potrete', loro: 'potranno' },
	dovere: { io: 'dovrò', tu: 'dovrai', lui_lei: 'dovrà', noi: 'dovremo', voi: 'dovrete', loro: 'dovranno' },
	volere: { io: 'vorrò', tu: 'vorrai', lui_lei: 'vorrà', noi: 'vorremo', voi: 'vorrete', loro: 'vorranno' },
	sapere: { io: 'saprò', tu: 'saprai', lui_lei: 'saprà', noi: 'sapremo', voi: 'saprete', loro: 'sapranno' },
	bere: { io: 'berrò', tu: 'berrai', lui_lei: 'berrà', noi: 'berremo', voi: 'berrete', loro: 'berranno' },
	rimanere: { io: 'rimarrò', tu: 'rimarrai', lui_lei: 'rimarrà', noi: 'rimarremo', voi: 'rimarrete', loro: 'rimarranno' },
	tradurre: { io: 'tradurrò', tu: 'tradurrai', lui_lei: 'tradurrà', noi: 'tradurremo', voi: 'tradurrete', loro: 'tradurranno' }
};

const essereAux = new Set([
	'essere',
	'andare',
	'venire',
	'uscire',
	'salire',
	'rimanere',
	'morire',
	'nascere',
	'scendere',
	'tornare',
	'entrare',
	'partire',
	'diventare',
	'crescere',
	'piacere',
	'dispiacere',
	'sembrare'
]);

const presentEndings = {
	are: { io: 'o', tu: 'i', lui_lei: 'a', noi: 'iamo', voi: 'ate', loro: 'ano' },
	ere: { io: 'o', tu: 'i', lui_lei: 'e', noi: 'iamo', voi: 'ete', loro: 'ono' },
	ire: { io: 'o', tu: 'i', lui_lei: 'e', noi: 'iamo', voi: 'ite', loro: 'ono' }
};

const futureEndings = { io: 'ò', tu: 'ai', lui_lei: 'à', noi: 'emo', voi: 'ete', loro: 'anno' };

const toBase = (infinitive) =>
	infinitive.endsWith('si') ? `${infinitive.slice(0, -2)}e` : infinitive;

const applyPresentSpelling = (stem, ending, infinitive) => {
	let adjusted = stem;
	if ((infinitive.endsWith('care') || infinitive.endsWith('gare')) && ending.startsWith('i')) {
		adjusted = `${stem}h`;
	}
	if (
		(infinitive.endsWith('ciare') || infinitive.endsWith('giare') || infinitive.endsWith('iare')) &&
		ending.startsWith('i') &&
		stem.endsWith('i')
	) {
		adjusted = stem.slice(0, -1);
	}
	return adjusted;
};

const conjugatePresent = (infinitive) => {
	const base = toBase(infinitive);
	if (irregularPresent[base]) return irregularPresent[base];
	const ending = base.slice(-3);
	if (!presentEndings[ending]) {
		throw new Error(`Unsupported infinitive ending for ${infinitive}`);
	}
	const stem = base.slice(0, -3);
	const endings = presentEndings[ending];
	const useIsc = ending === 'ire' && iscVerbs.has(base);
	const build = (subject) => {
		const endingValue = endings[subject];
		const stemValue = useIsc && ['io', 'tu', 'lui_lei', 'loro'].includes(subject)
			? `${stem}isc`
			: stem;
		const adjustedStem = applyPresentSpelling(stemValue, endingValue, base);
		return `${adjustedStem}${endingValue}`;
	};
	return {
		io: build('io'),
		tu: build('tu'),
		lui_lei: build('lui_lei'),
		noi: build('noi'),
		voi: build('voi'),
		loro: build('loro')
	};
};

const toGerund = (infinitive) => {
	const base = toBase(infinitive);
	if (gerundOverrides[base]) return gerundOverrides[base];
	if (base.endsWith('are')) return `${base.slice(0, -3)}ando`;
	if (base.endsWith('ere') || base.endsWith('ire')) return `${base.slice(0, -3)}endo`;
	throw new Error(`Unsupported gerund for ${infinitive}`);
};

const futureStem = (base) => {
	if (base.endsWith('are')) {
		let stem = base.slice(0, -3);
		if (base.endsWith('care') || base.endsWith('gare')) {
			return `${stem}her`;
		}
		if (base.endsWith('ciare') || base.endsWith('giare')) {
			if (stem.endsWith('i')) stem = stem.slice(0, -1);
			return `${stem}er`;
		}
		return `${stem}er`;
	}
	if (base.endsWith('ere')) return `${base.slice(0, -3)}er`;
	if (base.endsWith('ire')) return `${base.slice(0, -3)}ir`;
	throw new Error(`Unsupported future for ${base}`);
};

const toFuture = (infinitive) => {
	const base = toBase(infinitive);
	if (futureOverrides[base]) return futureOverrides[base];
	const stem = futureStem(base);
	return {
		io: `${stem}${futureEndings.io}`,
		tu: `${stem}${futureEndings.tu}`,
		lui_lei: `${stem}${futureEndings.lui_lei}`,
		noi: `${stem}${futureEndings.noi}`,
		voi: `${stem}${futureEndings.voi}`,
		loro: `${stem}${futureEndings.loro}`
	};
};

const toPastParticiple = (infinitive) => {
	const base = toBase(infinitive);
	if (irregularPast[base]) return irregularPast[base];
	if (base.endsWith('are')) return `${base.slice(0, -3)}ato`;
	if (base.endsWith('ere')) return `${base.slice(0, -3)}uto`;
	if (base.endsWith('ire')) return `${base.slice(0, -3)}ito`;
	throw new Error(`Unsupported past participle for ${infinitive}`);
};

const toAuxiliary = (infinitive) => {
	if (reflexiveVerbs.has(infinitive)) return 'essere';
	const base = toBase(infinitive);
	return essereAux.has(base) ? 'essere' : 'avere';
};

const isIrregularPresent = (infinitive) => {
	const base = toBase(infinitive);
	return Boolean(irregularPresent[base] || iscVerbs.has(base));
};

const isIrregularGerund = (infinitive) => Boolean(gerundOverrides[toBase(infinitive)]);

const isIrregularFuture = (infinitive) => Boolean(futureOverrides[toBase(infinitive)]);

const isIrregularPast = (infinitive) => Boolean(irregularPast[toBase(infinitive)]);

const baseOutput = verbList.map((verb) => ({
	infinitive: verb.infinitive,
	translation: verb.translation,
	reflexive: reflexiveVerbs.has(verb.infinitive) || undefined,
	irregular: {
		presente: isIrregularPresent(verb.infinitive),
		gerundio: isIrregularGerund(verb.infinitive),
		passato_prossimo: isIrregularPast(verb.infinitive),
		futuro_semplice: isIrregularFuture(verb.infinitive)
	}
}));

const presentOutput = {};
const gerundOutput = {};
const futureOutput = {};
const passatoOutput = {};

for (const verb of verbList) {
	presentOutput[verb.infinitive] = conjugatePresent(verb.infinitive);
	gerundOutput[verb.infinitive] = toGerund(verb.infinitive);
	futureOutput[verb.infinitive] = toFuture(verb.infinitive);
	passatoOutput[verb.infinitive] = {
		auxiliary: toAuxiliary(verb.infinitive),
		pastParticiple: toPastParticiple(verb.infinitive)
	};
}

const root = resolve(process.cwd(), 'src', 'lib', 'data', 'verbs');
writeFileSync(resolve(root, 'base.json'), `${JSON.stringify(baseOutput, null, '\t')}\n`);
writeFileSync(resolve(root, 'present.json'), `${JSON.stringify(presentOutput, null, '\t')}\n`);
writeFileSync(resolve(root, 'gerundio.json'), `${JSON.stringify(gerundOutput, null, '\t')}\n`);
writeFileSync(resolve(root, 'futuro_semplice.json'), `${JSON.stringify(futureOutput, null, '\t')}\n`);
writeFileSync(resolve(root, 'passato_prossimo.json'), `${JSON.stringify(passatoOutput, null, '\t')}\n`);

console.log('Generated verb data:', verbList.length);
