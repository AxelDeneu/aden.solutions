export function checkHoneypot(honeypotValue: string): boolean {
	// Returns true if honeypot is empty (human), false if filled (bot)
	return honeypotValue.trim() === '';
}