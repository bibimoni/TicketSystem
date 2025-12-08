// src/services/transactionService.js
import axiosClient from './axiosClient';

const transactionService = {
    // Tạo phiên thanh toán
    checkout(data) {
        return axiosClient.post('/transaction/checkout', data);
    },

    getMyTransactions() {
        return axiosClient.get('/transaction/my-transactions');
    },

    getTransactionById(id) {
        return axiosClient.get(`/transaction/${id}`);
    },

};

export default transactionService;