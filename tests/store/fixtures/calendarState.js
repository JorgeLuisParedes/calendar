export const events = [
	{
		id: '1',
		start: new Date('2024-01-28 20:21:00'),
		end: new Date('2024-01-28 22:21:00'),
		title: 'Primera nota',
		notes: 'Texto de la primera nota',
	},
	{
		id: '2',
		start: new Date('2024-01-22 20:21:00'),
		end: new Date('2024-01-22 22:21:00'),
		title: 'Segunda nota',
		notes: 'Texto de la segunda nota',
	},
];

export const initialState = {
	isLoadignEvents: true,
	events: [],
	activeEvent: null,
};

export const calendarWithEventsState = {
	isLoadignEvents: false,
	events: [...events],
	activeEvent: null,
};

export const calendarWithActiveEventsState = {
	isLoadignEvents: false,
	events: [...events],
	activeEvent: { ...events[0] },
};
