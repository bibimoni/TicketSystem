// src/pages/QuestionForm.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import TicketDetail from "../components/TicketDetail";
import Form from "../components/Form";

function QuestionForm() {
    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <TicketDetail pageType="confirmation"/>
            <Form />
            <Footer />
        </div>
    );
}
export default QuestionForm;