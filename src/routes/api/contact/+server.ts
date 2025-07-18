import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateRequired, validateEmail } from '$lib/utils/validation';
import { checkHoneypot } from '$lib/utils/antirobot';
import { Resend } from 'resend';
import { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW } from '$env/static/private';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const rateLimitMax = parseInt(RATE_LIMIT_MAX || '5');
const rateLimitWindow = parseInt(RATE_LIMIT_WINDOW || '3600000'); // Default 1 hour

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const userLimit = rateLimitMap.get(ip);
	
	if (!userLimit || now > userLimit.resetTime) {
		rateLimitMap.set(ip, { count: 1, resetTime: now + rateLimitWindow });
		return true;
	}
	
	if (userLimit.count >= rateLimitMax) {
		return false;
	}
	
	userLimit.count++;
	return true;
}

export const POST: RequestHandler = async ({ request, getClientAddress, cookies }) => {
	try {
		const ip = getClientAddress();
		
		// Check rate limit
		if (!checkRateLimit(ip)) {
			return json({ error: 'contact.error.tooManyRequests' }, { status: 429 });
		}
		
		const data = await request.json();
		const { name, email, subject, message, honeypot, mathAnswer } = data;
		
		// Check honeypot
		if (!checkHoneypot(honeypot)) {
			// Bot detected, but return success to not reveal the protection
			return json({ success: true });
		}
		
		// Get expected answer from cookie
		const expectedAnswer = cookies.get('math_challenge');
		if (!expectedAnswer) {
			return json({ error: 'contact.error.verificationExpired' }, { status: 400 });
		}
		
		// Verify math answer
		if (parseInt(mathAnswer) !== parseInt(expectedAnswer)) {
			// Clear the cookie to force a new challenge
			cookies.delete('math_challenge', { path: '/' });
			return json({ error: 'contact.error.invalidAnswer' }, { status: 400 });
		}
		
		// Clear the cookie after successful verification
		cookies.delete('math_challenge', { path: '/' });
		
		// Server-side validation
		const errors: string[] = [];
		
		if (!validateRequired(name)) {
			errors.push('contact.error.nameRequired');
		}
		
		if (!validateRequired(email)) {
			errors.push('contact.error.emailRequired');
		} else if (!validateEmail(email)) {
			errors.push('contact.error.emailInvalid');
		}
		
		if (!validateRequired(message)) {
			errors.push('contact.error.messageRequired');
		}
		
		if (errors.length > 0) {
			return json({ error: 'validation', errors }, { status: 400 });
		}
		
		// Send email using Resend
		const resend = new Resend(RESEND_API_KEY);
		
		const emailHtml = `
			<h2>New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
			<p><strong>Message:</strong></p>
			<p>${message.replace(/\n/g, '<br>')}</p>
			<hr>
			<p><small>Sent from: ${ip}</small></p>
		`;
		
		const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}\n` : ''}
Message:
${message}

---
Sent from: ${ip}
		`;
		
		const { error } = await resend.emails.send({
			from: EMAIL_FROM,
			to: EMAIL_TO,
			replyTo: email,
			subject: subject || `Contact form submission from ${name}`,
			html: emailHtml,
			text: emailText
		});
		
		if (error) {
			console.error('Resend error:', error);
			return json({ error: 'Failed to send email' }, { status: 500 });
		}
		
		return json({ success: true });
		
	} catch (error) {
		console.error('Contact form error:', error);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};