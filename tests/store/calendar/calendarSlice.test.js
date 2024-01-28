import {
	calendarSlice,
	onAddNewEvent,
	onDeleteEvent,
	onLoadEvents,
	onLogoutCalendar,
	onSetActiveEvent,
	onUpdateEvent,
} from '../../../src/store/calendar/calendarSlice';
import {
	calendarWithActiveEventsState,
	calendarWithEventsState,
	events,
	initialState,
} from '../fixtures/calendarState';

describe('Pruebas en calendarSlice', () => {
	test('Debe de regresar el estado por defecto', () => {
		const state = calendarSlice.getInitialState();
		expect(state).toEqual(initialState);
	});

	test('onSetActiveEvent debe de activar el evento', () => {
		const state = calendarSlice.reducer(
			calendarWithActiveEventsState,
			onSetActiveEvent(events[0]),
		);
		expect(state.activeEvent).toEqual(events[0]);
	});

	test('onAddNewEvent debe de agregar un evento', () => {
		const newEvent = {
			id: '3',
			start: new Date('2024-01-28 20:21:00'),
			end: new Date('2024-01-28 22:21:00'),
			title: 'Tercera nota',
			notes: 'Texto de la tercera nota',
		};
		const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
		expect(state.events).toEqual([...events, newEvent]);
	});

	test('onUpdateEvent debe de actualizar un evento', () => {
		const updateEvent = {
			id: '1',
			start: new Date('2024-01-28 20:21:00'),
			end: new Date('2024-01-28 22:21:00'),
			title: 'Actualizar la primera nota',
			notes: 'Actualizar el texto de la primera nota',
		};
		const state = calendarSlice.reducer(
			calendarWithActiveEventsState,
			onUpdateEvent(updateEvent),
		);
		expect(state.events).toContain(updateEvent);
	});

	test('onDeleteEvent debe de eliminar un evento activo', () => {
		const selectedEvent = calendarWithActiveEventsState.activeEvent;
		const state = calendarSlice.reducer(calendarWithActiveEventsState, onDeleteEvent());
		expect(state.activeEvent).toBe(null);
		expect(state).not.toContain(events[0]);
	});

	test('onLoadEvents debe establecer los eventos', () => {
		const state = calendarSlice.reducer(initialState, onLoadEvents(events));
		expect(state.isLoadignEvents).toBeFalsy();
		expect(state.events).toEqual(events);

		const newState = calendarSlice.reducer(state, onLoadEvents(events));
		expect(newState.events.length).toBe(events.length);
	});

	test('onLogoutCalendar debe de limpiar el estado', () => {
		const state = calendarSlice.reducer(
			calendarWithActiveEventsState,
			onLogoutCalendar(),
		);
		expect(state).toEqual(initialState);
	});
});
