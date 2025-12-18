import axiosClient from './axiosClient';

const transactionService = {
    checkout(data) {
        return axiosClient.post('/transaction/checkout', data);
    },

    getMyTransactions() {
        return axiosClient.get('/transaction/my-transactions');
    },

    getTransactionById(id) {
        return axiosClient.get(`/transaction/${id}`);
    },
    getAllVouchers() {
        return axiosClient.get('/voucher');
    },
    cancelPending(payload) {
        return axiosClient.delete('/transaction/cancel-pending', {
            data: payload
        });
    }

};

export default transactionService;