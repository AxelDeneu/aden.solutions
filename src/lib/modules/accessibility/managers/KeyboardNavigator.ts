/**
 * Keyboard navigation helper
 */
export class KeyboardNavigator {
	private listeners: Map<string, (event: KeyboardEvent) => void> = new Map();

	/**
	 * Add keyboard shortcut
	 */
	addShortcut(
		key: string,
		modifiers: Array<'ctrl' | 'alt' | 'shift' | 'meta'> = [],
		handler: (event: KeyboardEvent) => void
	): void {
		const shortcutKey = this.generateShortcutKey(key, modifiers);
		this.listeners.set(shortcutKey, handler);
	}

	/**
	 * Remove keyboard shortcut
	 */
	removeShortcut(key: string, modifiers: Array<'ctrl' | 'alt' | 'shift' | 'meta'> = []): void {
		const shortcutKey = this.generateShortcutKey(key, modifiers);
		this.listeners.delete(shortcutKey);
	}

	/**
	 * Start listening for keyboard events
	 */
	startListening(): void {
		document.addEventListener('keydown', this.handleKeyDown);
	}

	/**
	 * Stop listening for keyboard events
	 */
	stopListening(): void {
		document.removeEventListener('keydown', this.handleKeyDown);
		this.listeners.clear();
	}

	/**
	 * Check if key combination is registered
	 */
	hasShortcut(key: string, modifiers: Array<'ctrl' | 'alt' | 'shift' | 'meta'> = []): boolean {
		const shortcutKey = this.generateShortcutKey(key, modifiers);
		return this.listeners.has(shortcutKey);
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		const modifiers: Array<'ctrl' | 'alt' | 'shift' | 'meta'> = [];

		if (event.ctrlKey) modifiers.push('ctrl');
		if (event.altKey) modifiers.push('alt');
		if (event.shiftKey) modifiers.push('shift');
		if (event.metaKey) modifiers.push('meta');

		const shortcutKey = this.generateShortcutKey(event.key.toLowerCase(), modifiers);
		const handler = this.listeners.get(shortcutKey);

		if (handler) {
			event.preventDefault();
			handler(event);
		}
	};

	private generateShortcutKey(
		key: string,
		modifiers: Array<'ctrl' | 'alt' | 'shift' | 'meta'>
	): string {
		const sortedModifiers = [...modifiers].sort();
		return [...sortedModifiers, key].join('+');
	}

	/**
	 * Common navigation patterns
	 */
	static createArrowKeyNavigation(
		container: HTMLElement,
		itemSelector: string,
		options: {
			horizontal?: boolean;
			vertical?: boolean;
			wrap?: boolean;
			onSelect?: (element: HTMLElement) => void;
		} = {}
	): () => void {
		const { horizontal = true, vertical = true, wrap = true, onSelect } = options;

		const handleArrowKeys = (event: KeyboardEvent) => {
			const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
			const currentIndex = items.findIndex((item) => item === document.activeElement);

			if (currentIndex === -1) return;

			let nextIndex = currentIndex;

			switch (event.key) {
				case 'ArrowRight':
					if (horizontal) {
						nextIndex = currentIndex + 1;
						if (nextIndex >= items.length) {
							nextIndex = wrap ? 0 : items.length - 1;
						}
						event.preventDefault();
					}
					break;
				case 'ArrowLeft':
					if (horizontal) {
						nextIndex = currentIndex - 1;
						if (nextIndex < 0) {
							nextIndex = wrap ? items.length - 1 : 0;
						}
						event.preventDefault();
					}
					break;
				case 'ArrowDown':
					if (vertical) {
						nextIndex = currentIndex + 1;
						if (nextIndex >= items.length) {
							nextIndex = wrap ? 0 : items.length - 1;
						}
						event.preventDefault();
					}
					break;
				case 'ArrowUp':
					if (vertical) {
						nextIndex = currentIndex - 1;
						if (nextIndex < 0) {
							nextIndex = wrap ? items.length - 1 : 0;
						}
						event.preventDefault();
					}
					break;
				case 'Enter':
				case ' ':
					if (onSelect) {
						event.preventDefault();
						onSelect(items[currentIndex]);
					}
					break;
			}

			if (nextIndex !== currentIndex && items[nextIndex]) {
				items[nextIndex].focus();
			}
		};

		container.addEventListener('keydown', handleArrowKeys);

		// Return cleanup function
		return () => {
			container.removeEventListener('keydown', handleArrowKeys);
		};
	}
}
