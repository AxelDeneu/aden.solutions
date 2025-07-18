<script lang="ts">
	import { __ } from '$lib/i18n';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { FormError } from '$lib/components/ui/form-error';
	import { validateRequired, validateEmail } from '$lib/utils/validation';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import Particles from '$lib/components/magic/Particles.svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let honeypot = $state(''); // This field should remain empty
	let mathAnswer = $state('');

	let mathChallenge = $state<{ num1: number; num2: number } | null>(null);
	let challengeError = $state(false);

	let isSubmitting = $state(false);
	let submitSuccess = $state(false);
	let submitError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string | null>>({});

	// Success dialog state
	let showSuccessDialog = $state(false);
	let successName = $state('');
	let countdown = $state(8);
	let countdownInterval: NodeJS.Timeout;

	async function fetchMathChallenge() {
		try {
			const response = await fetch('/api/contact/challenge');
			if (response.ok) {
				mathChallenge = await response.json();
				challengeError = false;
			} else {
				challengeError = true;
			}
		} catch {
			challengeError = true;
		}
	}

	onMount(() => {
		fetchMathChallenge();

		// Cleanup interval on unmount
		return () => {
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}
		};
	});

	function resetForm() {
		name = '';
		email = '';
		subject = '';
		message = '';
		mathAnswer = '';
		honeypot = '';
		fieldErrors = {};
		submitError = null;
		fetchMathChallenge(); // Get new challenge
	}

	function validateForm(): boolean {
		const errors: Record<string, string | null> = {};

		if (!validateRequired(name)) {
			errors.name = __('contact.validation.required');
		}

		if (!validateRequired(email)) {
			errors.email = __('contact.validation.required');
		} else if (!validateEmail(email)) {
			errors.email = __('contact.validation.email');
		}

		if (!validateRequired(message)) {
			errors.message = __('contact.validation.required');
		}

		if (!validateRequired(mathAnswer)) {
			errors.mathAnswer = __('contact.validation.required');
		}

		fieldErrors = errors;
		return Object.keys(errors).length === 0;
	}

	function closeSuccessDialog() {
		showSuccessDialog = false;
		if (countdownInterval) {
			clearInterval(countdownInterval);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		fieldErrors = {};
		isSubmitting = true;
		submitError = null;
		submitSuccess = false;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					email,
					subject,
					message,
					honeypot,
					mathAnswer
				})
			});

			const result = await response.json();

			if (!response.ok) {
				// Handle validation errors with multiple messages
				if (result.error === 'validation' && result.errors) {
					// Show first validation error
					const firstError = result.errors[0];
					throw new Error(__(firstError));
				}
				// Handle single error message (translation key)
				throw new Error(__(result.error) || __('contact.form.error'));
			}

			// Show success dialog
			successName = name;
			showSuccessDialog = true;
			countdown = 8;

			// Start countdown
			countdownInterval = setInterval(() => {
				countdown--;
				if (countdown === 0) {
					closeSuccessDialog();
				}
			}, 1000);

			// Reset form
			resetForm();

		} catch (error) {
			submitError = error instanceof Error ? error.message : __('contact.form.error');
			// Get new math challenge on error
			fetchMathChallenge();
			mathAnswer = '';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4 w-full max-w-sm mx-auto sm:space-y-5 sm:max-w-md lg:space-y-6">
	{#if submitError}
		<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
			{submitError}
		</div>
	{/if}

	<div class="space-y-2">
		<Label for="name" required>{__('contact.form.name')}</Label>
		<Input
			id="name"
			type="text"
			bind:value={name}
			disabled={isSubmitting}
			class={cn(fieldErrors.name && 'border-red-500')}
		/>
		<FormError error={fieldErrors.name} />
	</div>

	<div class="space-y-2">
		<Label for="email" required>{__('contact.form.email')}</Label>
		<Input
			id="email"
			type="email"
			bind:value={email}
			disabled={isSubmitting}
			class={cn(fieldErrors.email && 'border-red-500')}
		/>
		<FormError error={fieldErrors.email} />
	</div>

	<div class="space-y-2">
		<Label for="subject">{__('contact.form.subject')}</Label>
		<Input
			id="subject"
			type="text"
			bind:value={subject}
			disabled={isSubmitting}
		/>
	</div>

	<div class="space-y-2">
		<Label for="message" required>{__('contact.form.message')}</Label>
		<Textarea
			id="message"
			bind:value={message}
			disabled={isSubmitting}
			rows={5}
			class={cn(fieldErrors.message && 'border-red-500')}
		/>
		<FormError error={fieldErrors.message} />
	</div>

	<!-- Honeypot field - hidden from users -->
	<div class="honey-pot" aria-hidden="true">
		<label for="website">Website</label>
		<input
			id="website"
			name="website"
			type="text"
			bind:value={honeypot}
			tabindex="-1"
			autocomplete="off"
		/>
	</div>

	<!-- Math challenge -->
	{#if mathChallenge && !challengeError}
		<div class="space-y-2">
			<Label for="mathAnswer" required>
				{__('contact.form.mathChallenge').replace('{num1}', mathChallenge.num1.toString()).replace('{num2}', mathChallenge.num2.toString())}
			</Label>
			<Input
				id="mathAnswer"
				type="text"
				bind:value={mathAnswer}
				disabled={isSubmitting}
				class={cn('max-w-20 sm:max-w-24', fieldErrors.mathAnswer && 'border-red-500')}
			/>
			<FormError error={fieldErrors.mathAnswer} />
		</div>
	{:else if challengeError}
		<div class="text-sm text-red-500">
			{__('contact.form.challengeError')}
		</div>
	{/if}

	<Button
		type="submit"
		disabled={isSubmitting}
		class="w-full"
	>
		{isSubmitting ? __('contact.form.sending') : __('contact.form.submit')}
	</Button>
</form>

<!-- Success Dialog -->
<Dialog.Root open={showSuccessDialog} onOpenChange={(open) => !open && closeSuccessDialog()}>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>

		<Dialog.Content>
			<!-- Confetti particles background -->
			<div class="absolute inset-0 pointer-events-none opacity-30">
				<Particles
					className="absolute inset-0"
					quantity={50}
					size={1.5}
					staticity={30}
					color="#10b981"
				/>
			</div>

			<Dialog.Header class="relative z-10">
				<!-- Animated checkmark -->
				<div class="mx-auto w-16 h-16 mb-4">
					<svg
						class="w-full h-full text-green-500 checkmark-animation"
						viewBox="0 0 52 52"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="26"
							cy="26"
							r="25"
							fill="currentColor"
							fill-opacity="0.1"
							stroke="currentColor"
							stroke-width="2"
						/>
						<path
							d="M14 26l7 7 17-17"
							stroke="currentColor"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="checkmark-path"
						/>
					</svg>
				</div>

				<Dialog.Title class="text-center">
					{__('contact.form.successTitle').replace('{name}', successName)}
				</Dialog.Title>
			</Dialog.Header>

			<p class="text-center text-muted-foreground mb-6 relative z-10">
				{__('contact.form.successMessage')}
			</p>

			<Dialog.Footer class="relative z-10 flex items-center justify-between">
						<span class="text-sm text-muted-foreground">
							{__('contact.form.successAutoClose').replace('{seconds}', countdown.toString())}
						</span>
				<Button onclick={closeSuccessDialog}>
					{__('contact.form.successClose')}
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
    .honey-pot {
        position: absolute;
        left: -9999px;
        height: 0;
        width: 0;
        overflow: hidden;
    }

    @keyframes checkmark-stroke {
        0% {
            stroke-dasharray: 0 100;
        }
        100% {
            stroke-dasharray: 100 0;
        }
    }

    @keyframes scale-in {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .checkmark-animation {
        animation: scale-in 0.6s ease-out;
    }

    .checkmark-path {
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        animation: checkmark-stroke 0.6s ease-out 0.3s forwards;
    }
</style>