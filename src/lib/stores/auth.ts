import { writable } from 'svelte/store';

export interface AuthState {
	user: any | null;
	isLoggedIn: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	isLoggedIn: false,
	isLoading: false,
	error: null
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		setUser: (user: any) => {
			update((state) => ({
				...state,
				user,
				isLoggedIn: !!user
			}));
		},
		clearUser: () => set(initialState),
		setLoading: (isLoading: boolean) => {
			update((state) => ({
				...state,
				isLoading
			}));
		},
		setError: (error: string | null) => {
			update((state) => ({
				...state,
				error
			}));
		}
	};
}

export const authStore = createAuthStore();
