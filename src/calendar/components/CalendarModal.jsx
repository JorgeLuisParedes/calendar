import { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

Modal.setAppElement('#root');
export const CalendarModal = () => {
	const [isOpen, setIsOpen] = useState(true);
	const onCloseModal = () => {
		setIsOpen(false);
	};
	return (
		<Modal
			isOpen={isOpen}
			style={customStyles}
			className={'modal'}
			overlayClassName={'modal-fondo'}
			closeTimeoutMS={200}
			onRequestClose={onCloseModal}
		>
			<h1>Hola mundo</h1>
			<hr />
			<p>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis nesciunt
				veritatis, obcaecati quis, ducimus eveniet suscipit sunt maiores natus voluptates
				perferendis. Esse corporis possimus dicta suscipit eligendi illum consectetur
				explicabo!
			</p>
		</Modal>
	);
};
