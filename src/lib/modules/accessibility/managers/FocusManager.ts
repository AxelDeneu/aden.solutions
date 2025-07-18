import type { IFocusManager } from '../interfaces/IFocusManager';

/**
 * Focus management implementation
 */
export class FocusManager implements IFocusManager {
	private trapElement: HTMLElement | null = null;
	private previousFocus: HTMLElement | null = null;

	private focusableSelectors = [
		'a[href]',
		'button:not([disabled])',
		'input:not([disabled])',
		'select:not([disabled])',
		'textarea:not([disabled])',
		'[tabindex]:not([tabindex="-1"])',
		'details',
		'summary',
		'iframe',
		'object',
		'embed',
		'[contenteditable]'
	].join(',');

	trapFocus(element: HTMLElement): void {
		this.trapElement = element;
		this.previousFocus = document.activeElement as HTMLElement;

		// Add event listeners
		element.addEventListener('keydown', this.handleKeyDown);

		// Focus first focusable element
		this.focusFirst(element);
	}

	releaseFocus(): void {
		if (this.trapElement) {
			this.trapElement.removeEventListener('keydown', this.handleKeyDown);
			this.trapElement = null;

			// Restore previous focus
			if (this.previousFocus && this.previousFocus.focus) {
				this.previousFocus.focus();
			}
			this.previousFocus = null;
		}
	}

	getFocusedElement(): HTMLElement | null {
		return document.activeElement as HTMLElement;
	}

	getFocusableElements(container: HTMLElement): HTMLElement[] {
		const elements = container.querySelectorAll<HTMLElement>(this.focusableSelectors);
		return Array.from(elements).filter((el) => {
			// Check if element is visible and not hidden
			const style = window.getComputedStyle(el);
			return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
		});
	}

	focusFirst(container: HTMLElement): void {
		const focusable = this.getFocusableElements(container);
		if (focusable.length > 0) {
			focusable[0].focus();
		}
	}

	focusLast(container: HTMLElement): void {
		const focusable = this.getFocusableElements(container);
		if (focusable.length > 0) {
			focusable[focusable.length - 1].focus();
		}
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== 'Tab' || !this.trapElement) return;

		const focusable = this.getFocusableElements(this.trapElement);
		if (focusable.length === 0) return;

		const firstFocusable = focusable[0];
		const lastFocusable = focusable[focusable.length - 1];
		const active = document.activeElement;

		if (event.shiftKey) {
			// Shift + Tab
			if (active === firstFocusable) {
				event.preventDefault();
				lastFocusable.focus();
			}
		} else {
			// Tab
			if (active === lastFocusable) {
				event.preventDefault();
				firstFocusable.focus();
			}
		}
	};
}
