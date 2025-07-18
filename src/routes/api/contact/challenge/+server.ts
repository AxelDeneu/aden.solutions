import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Generate random numbers for the math challenge
	const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
	const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
	const answer = num1 + num2;
	
	// Store the expected answer in a signed cookie
	// The cookie is httpOnly (not accessible via JS), secure in production, and expires in 15 minutes
	cookies.set('math_challenge', answer.toString(), {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 15 // 15 minutes
	});
	
	// Return only the numbers to display (not the answer)
	return json({ num1, num2 });
};