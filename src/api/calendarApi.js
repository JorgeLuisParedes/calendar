import axios from 'axios';
import { getEnvironments } from '../helpers';

const { VITE_API_URL } = getEnvironments();

const calendarApi = axios.create({
	baseURL: VITE_API_URL,
});

// Todo: configurar interceptores

export default calendarApi;
