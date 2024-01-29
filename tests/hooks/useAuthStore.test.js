import { configureStore } from '@reduxjs/toolkit';
import { authSlice, calendarSlice } from '../../src/store';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { Provider } from 'react-redux';
import {
	initialState as authInitState,
	notAuthenticatedState,
	authenticatedState,
} from '../store/fixtures/authStates';
import { testuserCredentials } from '../store/fixtures/testUser';
import {
	initialState as calendarInitState,
	calendarWithActiveEventsState,
} from '../store/fixtures/calendarState';
import calendarApi from '../../src/api/calendarApi';

describe('Pruebas en el useAuthStore', () => {
	beforeEach(() => localStorage.clear());

	const getMockStore = (authInitState, calendarInitState) => {
		return configureStore({
			reducer: {
				auth: authSlice.reducer,
				calendar: calendarSlice.reducer,
			},
			preloadedState: {
				auth: { ...authInitState },
				calendar: { ...calendarInitState },
			},
		});
	};

	test('Debe de regresar los valores por defecto', () => {
		const mockStore = getMockStore({ ...authInitState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		expect(result.current).toEqual({
			errorMessage: undefined,
			status: 'checking',
			user: {},
			checkAuthToken: expect.any(Function),
			startLogin: expect.any(Function),
			startLogout: expect.any(Function),
			startRegister: expect.any(Function),
		});
	});

	test('startLogin debe de realizar el login correctamente', async () => {
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		await act(async () => {
			await result.current.startLogin(testuserCredentials);
		});
		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: undefined,
			status: 'authenticated',
			user: {
				name: 'Test User',
				uid: '65b8254859469c5eb7ac88cd',
			},
		});

		expect(localStorage.getItem('token')).toEqual(expect.any(String));
		expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
	});

	test('startLogin debe de fallar la autenticación', async () => {
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		await act(async () => {
			await result.current.startLogin({
				email: 'algo@google.com',
				password: '1234567',
			});
		});
		const { errorMessage, status, user } = result.current;
		expect(localStorage.getItem('token')).toBe(null);
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: 'Credenciales incorrectas',
			status: 'not-authenticated',
			user: {},
		});

		await waitFor(() => expect(result.current.errorMessage).toBe(undefined));
	});

	test('startRegister debe de crear un usuario', async () => {
		const newUser = {
			email: 'algo@google.com',
			password: '1234567',
			name: 'Test User 2',
		};
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
			data: {
				ok: true,
				uid: '123456789',
				name: 'Test User',
				token: '123-TOKEN-ABC',
			},
		});

		await act(async () => {
			await result.current.startRegister(newUser);
		});

		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: undefined,
			status: 'authenticated',
			user: {
				name: 'Test User',
				uid: '123456789',
			},
		});

		spy.mockRestore();
	});

	test('startRegister debe fallar la creación', async () => {
		const mockStore = getMockStore({ ...notAuthenticatedState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		await act(async () => {
			await result.current.startRegister(testuserCredentials);
		});

		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: 'Un usuario existe con ese correo',
			status: 'not-authenticated',
			user: {},
		});
	});

	test('checkAuthToken debe de fallar si no hay token', async () => {
		const mockStore = getMockStore({ ...authInitState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		await act(async () => {
			await result.current.checkAuthToken();
		});

		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: undefined,
			status: 'not-authenticated',
			user: {},
		});
	});

	test('checkAuthToken debe autenticar el usuario si hay un token', async () => {
		const { data } = await calendarApi.post('/auth', testuserCredentials);
		localStorage.setItem('token', data.token);

		const mockStore = getMockStore({ ...authInitState });
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		await act(async () => {
			await result.current.checkAuthToken();
		});

		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: undefined,
			status: 'authenticated',
			user: {
				name: 'Test User',
				uid: '65b8254859469c5eb7ac88cd',
			},
		});
	});

	test('startLogout debe de realizar el logout correctamnete', () => {
		const mockStore = getMockStore(
			{ ...authenticatedState },
			{ ...calendarWithActiveEventsState },
		);
		const { result } = renderHook(() => useAuthStore(), {
			wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>,
		});

		act(() => {
			result.current.startLogout();
		});

		const { errorMessage, status, user } = result.current;
		expect({ errorMessage, status, user }).toEqual({
			errorMessage: undefined,
			status: 'not-authenticated',
			user: {},
		});
		expect(localStorage.getItem('token')).toBe(null);
		const { calendar } = mockStore.getState();
		expect(calendar).toEqual(calendarInitState);
	});
});
