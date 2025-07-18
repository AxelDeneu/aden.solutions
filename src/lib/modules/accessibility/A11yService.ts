import { FocusManager } from './managers/FocusManager';
import { KeyboardNavigator } from './managers/KeyboardNavigator';
import { AnnouncementManager } from './managers/AnnouncementManager';
import type { IFocusManager } from './interfaces/IFocusManager';
import type { IScreenReaderHelper } from './interfaces/IScreenReaderHelper';

/**
 * Main accessibility service following Single Responsibility Principle
 */
export class A11yService {
	private focusManager: IFocusManager;
	private keyboardNavigator: KeyboardNavigator;
	private announcementManager: IScreenReaderHelper;

	constructor() {
		this.focusManager = new FocusManager();
		this.keyboardNavigator = new KeyboardNavigator();
		this.announcementManager = new AnnouncementManager();
	}

	/**
	 * Get focus manager
	 */
	getFocusManager(): IFocusManager {
		return this.focusManager;
	}

	/**
	 * Get keyboard navigator
	 */
	getKeyboardNavigator(): KeyboardNavigator {
		return this.keyboardNavigator;
	}

	/**
	 * Get announcement manager
	 */
	getAnnouncementManager(): IScreenReaderHelper {
		return this.announcementManager;
	}

	/**
	 * Initialize global keyboard shortcuts
	 */
	initializeGlobalShortcuts(): void {
		// Skip to main content
		this.keyboardNavigator.addShortcut('m', ['alt'], () => {
			const main = document.querySelector('main');
			if (main) {
				(main as HTMLElement).focus();
				this.announcementManager.announce('Skipped to main content', 'polite');
			}
		});

		// Skip to navigation
		this.keyboardNavigator.addShortcut('n', ['alt'], () => {
			const nav = document.querySelector('nav');
			if (nav) {
				(nav as HTMLElement).focus();
				this.announcementManager.announce('Skipped to navigation', 'polite');
			}
		});

		// Help dialog
		this.keyboardNavigator.addShortcut('/', ['shift'], () => {
			this.showKeyboardShortcutsHelp();
		});

		this.keyboardNavigator.startListening();
	}

	/**
	 * Show keyboard shortcuts help
	 */
	private showKeyboardShortcutsHelp(): void {
		const shortcuts = [
			'Alt + M: Skip to main content',
			'Alt + N: Skip to navigation',
			'Shift + /: Show this help',
			'Tab: Navigate through focusable elements',
			'Shift + Tab: Navigate backwards',
			'Enter/Space: Activate buttons and links',
			'Arrow keys: Navigate through lists and menus'
		];

		const message = `Keyboard shortcuts: ${shortcuts.join(', ')}`;
		this.announcementManager.announce(message, 'polite');
	}

	/**
	 * Check if user prefers reduced motion
	 */
	static prefersReducedMotion(): boolean {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	/**
	 * Add high contrast mode detection
	 */
	static prefersHighContrast(): boolean {
		return window.matchMedia('(prefers-contrast: high)').matches;
	}

	/**
	 * Utility to add ARIA attributes
	 */
	static setAriaAttributes(
		element: HTMLElement,
		attributes: Record<string, string | boolean | number>
	): void {
		Object.entries(attributes).forEach(([key, value]) => {
			if (key.startsWith('aria-') || key === 'role') {
				element.setAttribute(key, String(value));
			}
		});
	}

	/**
	 * Create skip link element
	 */
	static createSkipLink(targetId: string, text: string): HTMLAnchorElement {
		const link = document.createElement('a');
		link.href = `#${targetId}`;
		link.className = 'skip-link';
		link.textContent = text;

		link.addEventListener('click', (e) => {
			e.preventDefault();
			const target = document.getElementById(targetId);
			if (target) {
				target.focus();
				target.scrollIntoView({ behavior: 'smooth' });
			}
		});

		return link;
	}

	/**
	 * Destroy service and cleanup
	 */
	destroy(): void {
		this.keyboardNavigator.stopListening();
		if (this.announcementManager instanceof AnnouncementManager) {
			this.announcementManager.destroy();
		}
	}
}
