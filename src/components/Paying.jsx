import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import transactionService from "../services/transactionService";

// Nhận props từ Pay.jsx
const Paying = ({ eventData, selectedTickets }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("stripe");

  // Tính tổng tiền
  const totalPrice = selectedTickets.reduce((sum, ticket) => {
    let priceNumber = ticket.amount || ticket.price; 
    if (typeof priceNumber === 'string') {
        priceNumber = Number(priceNumber.replace(/\D/g, ""));
    }
    return sum + priceNumber * ticket.quantity;
  }, 0);

  // Xử lý thanh toán
  const handlePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        eventId: eventData.id,
        items: selectedTickets.map(ticket => ({
            ticketTypeId: ticket.id,
            quantity: ticket.quantity
        })),
        paymentMethod: selectedMethod, 
        totalAmount: totalPrice,
        voucherCode: "" 
      };

      const response = await transactionService.checkout(payload);

      if (response && response.paymentUrl) {
          window.location.href = response.paymentUrl;
      } else {
          alert("Đặt vé thành công!");
          navigate("/my-ticket");
      }

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "stripe", label: "Thẻ quốc tế (Visa/Mastercard/JCB)" },
    { id: "vietqr", label: "VietQR (Chuyển khoản)" },
    { id: "banking-app", label: "Ứng dụng ngân hàng" },
  ];

  const formatPrice = (val) => val.toLocaleString("vi-VN") + " đ";

  return (
    <main className="flex py-9 max-w-7xl mx-auto px-4 relative">
      <div className="grid grid-cols-12 w-full relative">
        <section className="relative col-span-8 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] mr-4 bg-secondary rounded-[10px]">
          <div className="p-8">
            <h2 className="font-extrabold text-white text-xl text-center mb-8">
              THANH TOÁN
            </h2>

            <div className="space-y-4">
              {/* Thông tin nhận vé */}
              <div className="bg-white rounded-[5px]">
                <div className="p-6">
                  <h3 className="font-bold text-primary text-base mb-2">
                    Thông tin nhận vé
                  </h3>
                  <p className="font-bold text-secondary text-sm">
                    Vé điện tử sẽ được hiển thị trong mục "VÉ CỦA TÔI" và gửi qua Email.
                  </p>
                </div>
              </div>

              {/* Mã khuyến mãi */}
              <div className="bg-white rounded-[5px]">
                <div className="p-6">
                  <h3 className="font-bold text-primary text-base mb-4">
                    Mã khuyến mãi
                  </h3>
                  <button className="h-10 rounded-[20px] px-3 border-2 border-secondary bg-white hover:bg-gray-50 flex items-center gap-2">
                    <Plus className="w-5 h-[26px]" />
                    <span className="font-bold text-secondary text-sm">
                      Thêm voucher
                    </span>
                  </button>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-[5px]">
                <div className="p-6">
                  <h3 className="font-bold text-primary text-base mb-4">
                    Phương thức thanh toán
                  </h3>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        htmlFor={method.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          id={method.id}
                          value={method.id}
                          className="peer hidden"
                          checked={selectedMethod === method.id}
                          onChange={() => setSelectedMethod(method.id)}
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-secondary peer-checked:border-[6px] peer-checked:border-primary transition-all" />
                        <span className="font-bold text-secondary text-sm">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Thông tin vé bên phải */}
        <aside className="relative col-span-4 animate-fade-in opacity-0 [--animation-delay:400ms]">
          <div className="bg-white rounded-b-[5px] p-6">
            <h2 className="font-bold text-black text-xl mb-4">Thông tin vé</h2>
            <div className="space-y-4 mb-4">
              {selectedTickets.map((ticket, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-secondary text-base">{ticket.name}</p>
                    <p className="font-medium italic text-secondary text-sm">
                        {formatPrice(ticket.amount || ticket.price)}
                    </p>
                  </div>
                  <span className="font-bold text-primary text-lg">x{ticket.quantity}</span>
                </div>
              ))}
            </div>

            <div className="h-0.5 bg-secondary opacity-50 my-6" />

            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-black text-base">Tạm tính</span>
              <span className="font-extrabold text-primary text-xl">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full h-[50px] bg-primary hover:bg-red-600 rounded-[10px] transition-colors disabled:opacity-50"
              disabled={loading || !selectedMethod}
            >
              <span className="font-extrabold text-white text-xl">
                {loading ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Paying;