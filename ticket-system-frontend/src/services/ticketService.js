import axiosClient from "./axiosClient";

const ticketService = {
    incrementStock(ticketTypeIds) {
        return axiosClient.post('/ticket/increment', ticketTypeIds);
    },
    decrementStock(ticketTypeIds) {
        return axiosClient.post('/ticket/decrement', ticketTypeIds);
    }
};

export default ticketService;