import {
	authSlice,
	clearErrorMessage,
	onChecking,
	onLogin,
	onLogout,
} from '../../../src/store/auth/authSlice';
import { authenticatedState, initialState } from '../fixtures/authStates';
import { testuserCredentials } from '../fixtures/testUser';

describe('Pruebas en el authSlice', () => {
	test('Debe de regresar el estado inicial', () => {
		expect(authSlice.getInitialState()).toEqual(initialState);
	});

	test('Debe de realizar un Login', () => {
		const state = authSlice.reducer(initialState, onLogin(testuserCredentials));
		expect(state).toEqual({
			status: 'authenticated',
			user: testuserCredentials,
			errorMessage: undefined,
		});
	});

	test('Debe de realizar el Logout', () => {
		const state = authSlice.reducer(authenticatedState, onLogout());
		expect(state).toEqual({
			status: 'not-authenticated',
			user: {},
			errorMessage: undefined,
		});
	});

	test('Debe de realizar el Logout y mostrar el mensaje de error', () => {
		const errorMessage = 'Credenciales no válidas';
		const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
		expect(state).toEqual({
			status: 'not-authenticated',
			user: {},
			errorMessage,
		});
	});

	test('Debe de limpiar el mensaje de error', () => {
		const errorMessage = 'Credenciales no válidas';
		const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));

		const newState = authSlice.reducer(state, clearErrorMessage());
		expect(newState.errorMessage).toBe(undefined);
	});

	test('Debe de cambiar el estado a checking', () => {
		const state = authSlice.reducer(authenticatedState, onChecking());
		expect(state.status).toBe('checking');
	});
});
