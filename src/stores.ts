import type { CUser } from '$lib/types';
import { writable } from 'svelte/store';

export const user = writable<CUser | null>(null);
