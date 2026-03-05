import complimentsData from './compliments.json';

export type Compliment = {
	id: number;
	it_feminine: string;
	it_masculine: string;
	literal_translation_en: string;
	natural_english_version: string;
};

export const compliments = complimentsData as Compliment[];
