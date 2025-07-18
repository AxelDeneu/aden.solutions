import type { IScreenReaderHelper } from '../interfaces/IScreenReaderHelper';

/**
 * Screen reader announcement manager
 */
export class AnnouncementManager implements IScreenReaderHelper {
	private liveRegions: Map<string, HTMLElement> = new Map();
	private announcementQueue: Array<{ message: string; priority: 'polite' | 'assertive' }> = [];
	private isProcessing = false;

	constructor() {
		// Create default live regions
		this.createLiveRegion('polite');
		this.createLiveRegion('assertive');
	}

	announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
		this.announcementQueue.push({ message, priority });
		this.processQueue();
	}

	clearAnnouncements(): void {
		this.announcementQueue = [];
		this.liveRegions.forEach((region) => {
			region.textContent = '';
		});
	}

	createLiveRegion(priority: 'polite' | 'assertive'): HTMLElement {
		if (this.liveRegions.has(priority)) {
			return this.liveRegions.get(priority)!;
		}

		const region = document.createElement('div');
		region.setAttribute('role', 'status');
		region.setAttribute('aria-live', priority);
		region.setAttribute('aria-atomic', 'true');

		// Hide visually but keep available for screen readers
		region.style.position = 'absolute';
		region.style.left = '-10000px';
		region.style.width = '1px';
		region.style.height = '1px';
		region.style.overflow = 'hidden';

		// Add class for easier identification
		region.className = `sr-only-announce sr-only-announce--${priority}`;

		document.body.appendChild(region);
		this.liveRegions.set(priority, region);

		return region;
	}

	private async processQueue(): Promise<void> {
		if (this.isProcessing || this.announcementQueue.length === 0) {
			return;
		}

		this.isProcessing = true;

		while (this.announcementQueue.length > 0) {
			const { message, priority } = this.announcementQueue.shift()!;
			const region = this.liveRegions.get(priority);

			if (region) {
				// Clear previous content
				region.textContent = '';

				// Wait a tick for screen reader to notice change
				await new Promise((resolve) => setTimeout(resolve, 100));

				// Set new content
				region.textContent = message;

				// Wait for announcement to be read
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}

		this.isProcessing = false;
	}

	/**
	 * Destroy all live regions
	 */
	destroy(): void {
		this.clearAnnouncements();
		this.liveRegions.forEach((region) => {
			region.remove();
		});
		this.liveRegions.clear();
	}

	/**
	 * Common announcement patterns
	 */
	static announcePageChange(pageName: string): void {
		const manager = new AnnouncementManager();
		manager.announce(`Navigated to ${pageName}`, 'polite');
	}

	static announceError(error: string): void {
		const manager = new AnnouncementManager();
		manager.announce(`Error: ${error}`, 'assertive');
	}

	static announceSuccess(message: string): void {
		const manager = new AnnouncementManager();
		manager.announce(`Success: ${message}`, 'polite');
	}

	static announceLoading(itemName: string): void {
		const manager = new AnnouncementManager();
		manager.announce(`Loading ${itemName}`, 'polite');
	}

	static announceLoaded(itemName: string): void {
		const manager = new AnnouncementManager();
		manager.announce(`${itemName} loaded`, 'polite');
	}
}
