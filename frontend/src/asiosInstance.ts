import axios from 'axios';

const Axios = axios.create({
	baseURL: 'http://localhost:3000', // Your backend url
});

export { Axios };