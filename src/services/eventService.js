// src/services/eventService.js
import axiosClient from './axiosClient';

const eventService = {
    getAllEvents() {
        return axiosClient.get('/event/all_events');
    },

    async getEventById(id) {
        try {
            const allEvents = await axiosClient.get('/event/all_events');

            if (Array.isArray(allEvents)) {
                const foundEvent = allEvents.find(event => event.id === id);
                return foundEvent;
            }
            
            return null; 
        } catch (error) {
            // console.error("Lỗi khi lọc sự kiện theo ID:", error);
            throw error;
        }
    }
};

export default eventService;