// src/services/ticketService.js
import axiosClient from "./axiosClient";

const ticketService = {
    incrementStock(ticketTypeIds) {
        return axiosClient.post('/ticket/increment', ticketTypeIds);
    }
};

export default ticketService;