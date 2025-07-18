/**
 * Interface for focus management
 */
export interface IFocusManager {
	/**
	 * Trap focus within an element
	 */
	trapFocus(element: HTMLElement): void;

	/**
	 * Release focus trap
	 */
	releaseFocus(): void;

	/**
	 * Get currently focused element
	 */
	getFocusedElement(): HTMLElement | null;

	/**
	 * Move focus to first focusable element
	 */
	focusFirst(container: HTMLElement): void;

	/**
	 * Move focus to last focusable element
	 */
	focusLast(container: HTMLElement): void;

	/**
	 * Get all focusable elements within container
	 */
	getFocusableElements(container: HTMLElement): HTMLElement[];
}
