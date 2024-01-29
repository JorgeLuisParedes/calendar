export const initialState = {
	errorMessage: undefined,
	status: 'checking', // 'authenticated', 'not-authenticated',
	user: {},
};

export const authenticatedState = {
	errorMessage: undefined,
	status: 'authenticated', // 'authenticated', 'not-authenticated',
	user: {
		name: 'John Doe',
		uid: '123',
	},
};

export const notAuthenticatedState = {
	errorMessage: undefined,
	status: 'not-authenticated', // 'authenticated', 'not-authenticated',
	user: {},
};
