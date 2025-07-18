/**
 * Interface for screen reader announcements
 */
export interface IScreenReaderHelper {
	/**
	 * Announce message to screen readers
	 */
	announce(message: string, priority?: 'polite' | 'assertive'): void;

	/**
	 * Clear all announcements
	 */
	clearAnnouncements(): void;

	/**
	 * Create live region element
	 */
	createLiveRegion(priority: 'polite' | 'assertive'): HTMLElement;
}
