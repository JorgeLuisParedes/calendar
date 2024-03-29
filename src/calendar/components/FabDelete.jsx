import { useCalendarStore, useUiStore } from '../../hooks';

export const FabDelete = () => {
	// const { isDateModalOpen } = useUiStore();
	const { startDeleteEvent, hasEventSelected } = useCalendarStore();

	const handleDelete = () => {
		startDeleteEvent();
	};
	return (
		<button
			aria-label='btn-delete'
			className='btn btn-danger fab-danger'
			onClick={handleDelete}
			style={{ display: hasEventSelected /* && !isDateModalOpen */ ? '' : 'none' }}
		>
			<i className='fa fa-trash-alt'></i>
		</button>
	);
};
