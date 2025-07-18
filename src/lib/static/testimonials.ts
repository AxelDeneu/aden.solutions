import type { Testimonials } from '$lib/types';

const testimonials: Testimonials = {
	supLabel: 'testimonials.supLabel',
	label: 'testimonials.label',
	description: 'testimonials.description',
	items: [
		{
			name: 'Myriam Pezeyre',
			role: 'Responsable Administrative',
			company: 'Cabinet Grosset-Fournier & Demachy',
			testimonial: 'testimonial.myriam'
		},
		{
			name: 'Amélie Briand',
			role: 'Coordinatrice Administrative et Financière',
			company: 'RésOVilles',
			testimonial: 'testimonial.amelie'
		},
		{
			name: 'Amandine Thommeret',
			role: 'Responsable Marketing',
			company: 'Disposeo',
			testimonial: 'testimonial.amandine'
		},
		{
			name: 'Claire Yam',
			role: 'CEO',
			company: 'Yamark',
			testimonial: 'testimonial.claire'
		}
	]
};

export default testimonials;
