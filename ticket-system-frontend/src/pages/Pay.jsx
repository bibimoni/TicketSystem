// src/pages/Pay.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AlertTriangle, X } from "lucide-react";

import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Paying from "../components/Paying";
import TicketDetail from "../components/TicketDetail";
import Loader from "../components/TicketLoader";

import eventService from "../services/eventService";
import ticketService from "../services/ticketService";
import defaultImage from "../assets/images/default_img.png";

const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

function Pay() {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Data State
    const [eventData, setEventData] = useState(location.state?.eventData || null);
    const [selectedTickets, setSelectedTickets] = useState(location.state?.selectedTickets || []);
    
    // Logic State
    const [isReserving, setIsReserving] = useState(true);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(null);

    const [showExitModal, setShowExitModal] = useState(false);
    const hasReservedRef = useRef(false); 
    const isPayingRef = useRef(false);    
    const effectRan = useRef(false);      
    
    const SESSION_KEY = `booking_session_${eventId}`;

    // Helper
    const getTicketIdsList = (tickets) => {
        const list = [];
        tickets.forEach(t => {
            const qty = parseInt(t.quantity, 10) || 0;
            const id = t.id || t.ticketTypeId;
            if (qty > 0 && id) {
                for (let i = 0; i < qty; i++) list.push(id);
            }
        });
        return list;
    };

    const extractBannerUrl = (infoString) => {
        if (!infoString) return null;
        return infoString.trim();
    };

    const handleConfirmExit = async () => {
        setShowExitModal(false); // Đóng modal

        const ticketIdsToRelease = getTicketIdsList(selectedTickets);
        const loadingToast = toast.loading("Đang hủy vé...");

        try {
            await ticketService.incrementStock(ticketIdsToRelease);
        } catch (err) {
            console.error("Lỗi trả vé:", err);
        } finally {
            toast.dismiss(loadingToast);
            sessionStorage.removeItem(SESSION_KEY);
            hasReservedRef.current = false; 
            navigate("/"); // Chuyển về trang chủ
        }
    };

    const handleStay = () => {
        setShowExitModal(false);
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasReservedRef.current && !isPayingRef.current) {
                e.preventDefault();
                e.returnValue = ""; 
            }
        };

        const handlePopState = (e) => {
            if (hasReservedRef.current && !isPayingRef.current) {
                window.history.pushState(null, null, window.location.pathname);

                setShowExitModal(true);
            }
        };

        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [selectedTickets, navigate]); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để thực hiện thanh toán!");
            navigate("/");
            return;
        }
        if (selectedTickets.length === 0) {
            navigate(`/booking/${eventId}`);
            return;
        }
        if (!eventData && eventId) {
            const fetchEvent = async () => {
                try {
                    const response = await eventService.getEventById(eventId);
                    const data = response.data || response;
                    setEventData({
                        id: data.id,
                        title: data.name,
                        date: data.eventTime,
                        location: data.destination,
                        description: data.information,
                        banner: extractBannerUrl(data.event_banner_url) || defaultImage,
                        ...data
                    });
                } catch (error) {
                    console.error("Lỗi tải sự kiện:", error);
                }
            };
            fetchEvent();
        }
    }, [eventData, eventId, selectedTickets, navigate]);

    useEffect(() => {
        if (effectRan.current === true) return;
        effectRan.current = true;

        const handleReservation = async () => {
            if (selectedTickets.length === 0) return;
            const savedSession = sessionStorage.getItem(SESSION_KEY);
            const now = Date.now();
            let shouldCallApi = true;

            if (savedSession) {
                const { expiry } = JSON.parse(savedSession);
                if (expiry > now) {
                    const secondsLeft = Math.floor((expiry - now) / 1000);
                    setSessionTimeLeft(secondsLeft); 
                    hasReservedRef.current = true;   
                    setIsReserving(false);
                    shouldCallApi = false;
                } else {
                    sessionStorage.removeItem(SESSION_KEY);
                }
            }

            if (shouldCallApi) {
                const ticketIdsToReserve = getTicketIdsList(selectedTickets);
                try {
                    await ticketService.decrementStock(ticketIdsToReserve);
                    const expiryTime = now + 20 * 60 * 1000;
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                        expiry: expiryTime,
                        reservedIds: ticketIdsToReserve
                    }));
                    setSessionTimeLeft(20 * 60);
                    hasReservedRef.current = true;
                } catch (error) {
                    toast.error("Vé đã hết hoặc lỗi hệ thống.");
                    navigate(`/booking/${eventId}`);
                } finally {
                    setIsReserving(false);
                }
            }
        };

        handleReservation();

        return () => {
            if (isPayingRef.current) return;
            if (hasReservedRef.current) {
                const ticketIdsToRelease = getTicketIdsList(selectedTickets);
                const token = localStorage.getItem('token');
                fetch(`${API_BASE_URL}/ticket/increment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(ticketIdsToRelease),
                    keepalive: true 
                }).catch(err => console.error("Lỗi cleanup fetch:", err));
                sessionStorage.removeItem(SESSION_KEY);
            }
        };
    }, []); 

    const handleTimeout = async () => {
        try {
            if (hasReservedRef.current) {
                const ticketIdsToRelease = getTicketIdsList(selectedTickets);
                await ticketService.incrementStock(ticketIdsToRelease);
                hasReservedRef.current = false;
                sessionStorage.removeItem(SESSION_KEY);
            }
            toast.warn("Đã hết thời gian giữ vé.");
        } catch (error) {
            console.error("Lỗi trả vé timeout:", error);
        } finally {
            navigate(`/about-event/${eventId}`);
        }
    };

    const onStartPayment = () => { isPayingRef.current = true; };

    const token = localStorage.getItem("token");
    if (!token) return null;
    if (!eventData || selectedTickets.length === 0) return null;
    if (isReserving) return <Loader text="Đang kiểm tra và giữ vé..." height="100vh"/>;

    return (
        <div className="min-h-screen bg-gray-100 relative">
            <HeaderBar />

            <TicketDetail
                pageType="confirmation"
                eventData={eventData}
                onTimeout={handleTimeout}
                initialTime={sessionTimeLeft} 
            />

            <Paying
                eventData={eventData}
                selectedTickets={selectedTickets}
                onStartPayment={onStartPayment}
            />

            <Footer />

            {showExitModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                        
                        <div className="flex items-center gap-2 mb-4 text-primary justify-center">
                            <div className="bg-white rounded-full">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-extrabold text-primary uppercase">Xác nhận thoát ?</h3>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Giao dịch của bạn chưa hoàn tất. <br/>
                            Nếu bạn thoát bây giờ, <strong>vé đang giữ sẽ bị hủy</strong> và trả về kho.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleStay}
                                className="px-5 py-2.5 rounded-lg text-gray-700 font-semibold hover:bg-gray-300 border border-gray-300 transition-colors uppercase"
                            >
                                Ở lại trang
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-myred transition-all uppercase"
                            >
                                Đồng ý thoát
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pay;