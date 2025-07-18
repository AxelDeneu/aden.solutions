import type { ResumeValue } from '$lib/types/ResumeValue';

type TranslatableValue = string | ResumeValue | Record<string, unknown> | TranslatableValue[];

export type { TranslatableValue };
