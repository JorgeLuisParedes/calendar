import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
	name: 'auth',
	initialState: {
		status: 'checking', // 'authenticated', 'not-authenticated',
		user: {},
		errorMeSsage: undefined,
	},
	reducers: {
		onChecking: state => {
			state.status = 'checking';
			state.user = {};
			state.errorMeSsage = undefined;
		},
		onLogin: (state, { payload }) => {
			state.status = 'authenticated';
			state.user = payload;
			state.errorMeSsage = undefined;
		},
	},
});

// Action creators are generated for each case reducer function
export const { increment } = authSlice.actions;
