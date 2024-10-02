import type { CUser, IRun } from '$lib/types';
import { writable } from 'svelte/store';

export const user = writable<CUser | null>(null);
export const showMenu = writable<boolean>(false);
export const runsArray = writable<IRun[]>([]);
