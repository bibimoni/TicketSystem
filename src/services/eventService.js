import axiosClient from './axiosClient';

const eventService = {
    getAllEvents() {
        return axiosClient.get('/event/all_events');
    }
};

export default eventService;