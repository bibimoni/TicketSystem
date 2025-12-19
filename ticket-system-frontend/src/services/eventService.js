// src/services/eventService.js
import axiosClient from './axiosClient';

const eventService = {
    getAllEvents() {
        return axiosClient.get('/event/all/PUBLISHED');
    },
 
    async getEventById(id) {
        try {
            const allEvents = await axiosClient.get('/event/all/PUBLISHED');

            if (Array.isArray(allEvents)) {
                const foundEvent = allEvents.find(event => event.id === id);
                return foundEvent;
            }

            return null;
        } catch (error) {
            // console.error("Lỗi khi lọc sự kiện theo ID:", error);
            throw error;
        }
    },
    async getEvents() {
        try {
            const [publishedRes, completedRes] = await Promise.allSettled([
                axiosClient.get('/event/all/PUBLISHED'),
                axiosClient.get('/event/all/COMPLETED')
            ]);

            let allEvents = [];

            const extractData = (res) => {
                if (res.status === 'fulfilled') {
                    const val = res.value;
                    return Array.isArray(val) ? val : (Array.isArray(val?.data) ? val.data : []);
                }
                return [];
            };

            const publishedData = extractData(publishedRes);
            const completedData = extractData(completedRes);

            const publishedWithStatus = publishedData.map(e => ({ ...e, status: 'PUBLISHED' }));
            const completedWithStatus = completedData.map(e => ({ ...e, status: 'COMPLETED' }));

            return [...publishedWithStatus, ...completedWithStatus];

        } catch (error) {
            console.error("Error fetching merged events:", error);
            return [];
        }
    },
};

export default eventService;