import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';
import calendarApi from '../api/calendarApi';

export const useCalendarStore = () => {
	const dispatch = useDispatch();
	const { events, activeEvent } = useSelector(state => state.calendar);
	const { user } = useSelector(state => state.auth);

	const setActiveEvent = calendarEvent => {
		dispatch(onSetActiveEvent(calendarEvent));
	};

	const startSavingEvent = async calendarEvent => {
		// TODO: Update event
		if (calendarEvent._id) {
			// Actualizando
			dispatch(onUpdateEvent({ ...calendarEvent }));
		} else {
			// Creando
			const { data } = await calendarApi.post('/events', calendarEvent);
			dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
		}
	};

	const startDeleteEvent = () => {
		dispatch(onDeleteEvent());
	};

	return {
		//* propiedades
		events,
		activeEvent,
		hasEventSelected: !!activeEvent,

		//* metodos
		setActiveEvent,
		startSavingEvent,
		startDeleteEvent,
	};
};
