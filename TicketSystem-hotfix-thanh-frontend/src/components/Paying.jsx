import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Tag, TicketPercent, Loader2 } from "lucide-react";
import transactionService from "../services/transactionService";

const Paying = ({ eventData, selectedTickets }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("stripe");

  // VOUCHER STATE
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]); // List voucher hợp lệ
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Voucher đang chọn
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");

  // 1. Tách hàm fetchVouchers ra ngoài để dùng chung
  const fetchVouchers = async () => {
    if (!eventData?.id) return;
    
    setLoadingVouchers(true);
    try {
      const allVouchers = await transactionService.getAllVouchers();
      const now = new Date();

      // Lọc voucher hợp lệ
      const validList = allVouchers.filter((v) => {
        const startDate = new Date(v.start_date);
        const endDate = new Date(v.end_date);

        const isMatchEvent = v.event_id === eventData.id;
        const isValidDate = now >= startDate && now <= endDate;

        return isMatchEvent && isValidDate;
      });

      setAvailableVouchers(validList);
    } catch (error) {
      console.error("Lỗi tải voucher:", error);
    } finally {
      setLoadingVouchers(false);
    }
  };

  // 2. Gọi fetchVouchers khi component mount hoặc eventData thay đổi
  useEffect(() => {
    fetchVouchers();
  }, [eventData]);

  // Tính tiền gốc
  const subTotal = selectedTickets.reduce((sum, ticket) => {
    let priceNumber = ticket.price;
    if (typeof priceNumber === "string") {
      priceNumber = Number(priceNumber.replace(/\D/g, ""));
    }
    return sum + priceNumber * ticket.quantity;
  }, 0);

  // Tính giảm giá
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.reduce_type === "FIXED") {
      discountAmount = appliedVoucher.reduce_price;
    } else if (appliedVoucher.reduce_type === "PERCENTAGE") {
      discountAmount = (subTotal * appliedVoucher.reduce_price) / 100;
    }
  }

  const finalTotal = Math.max(0, subTotal - discountAmount);

  // Format tiền
  const formatPrice = (val) => val.toLocaleString("vi-VN") + " đ";

  // Modal voucher
  const handleOpenVoucherModal = () => {
    setShowVoucherModal(true);
    // Nếu danh sách trống thì thử tải lại (phòng trường hợp lỗi mạng lúc đầu)
    if (availableVouchers.length === 0) {
      fetchVouchers();
    }
  };

  // Chọn voucher từ danh sách
  const handleSelectVoucher = (voucher) => {
    setAppliedVoucher(voucher);
    setShowVoucherModal(false);
    setVoucherError(""); // Reset lỗi nếu có
  };

  // Hủy voucher
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
  };

  // Thanh toán
  const handlePayment = async () => {
    setLoading(true);
    try {
      const ticketTypeIds = selectedTickets.flatMap((ticket) => {
        // Fallback ID cho an toàn
        const validId = ticket.ticketTypeId || ticket.id || ticket._id;

        if (!validId) {
          throw new Error(`Vé "${ticket.name}" bị lỗi dữ liệu: Không tìm thấy ID.`);
        }
        return Array(ticket.quantity).fill(validId);
      });

      let vouchersPayload = [];
      if (appliedVoucher) {
        const vId = appliedVoucher._id || appliedVoucher.id || appliedVoucher.voucher_id;
        if (vId) {
          vouchersPayload = [{ voucher_id: vId }];
        }
      }

      const payload = {
        ticketTypeIds: ticketTypeIds,
      };

      if (vouchersPayload.length > 0) {
        payload.vouchers = vouchersPayload;
      }

      console.log("Payload gửi đi:", JSON.stringify(payload, null, 2));

      const response = await transactionService.checkout(payload);

      // Handle cấu trúc response linh hoạt hơn
      const redirectUrl = response.url || response?.data?.url || response?.result?.url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.error("Response API:", response);
        alert("Thành công nhưng không tìm thấy link thanh toán (URL).");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      const msg = error.response?.data?.message || error.message || "Lỗi khi tạo giao dịch.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVoucherCode = () => {
    setVoucherError("");

    if (!voucherCode.trim()) {
      setVoucherError("Vui lòng nhập mã voucher!");
      return;
    }

    // Vì đã fetch ở useEffect nên availableVouchers đã có dữ liệu để check
    const match = availableVouchers.find((v) => 
      v.code.trim().toUpperCase() === voucherCode.trim().toUpperCase()
    );

    if (!match) {
      setVoucherError("Mã voucher không hợp lệ hoặc không áp dụng cho sự kiện này.");
      setAppliedVoucher(null);
      return;
    }

    setAppliedVoucher(match);
    setShowVoucherModal(false);
    setVoucherCode("");
    setVoucherError("");
  };

  const paymentMethods = [
    { id: "stripe", label: "Thẻ quốc tế" },
    { id: "vietqr", label: "VietQR" },
    { id: "momo", label: "Ví điện tử MOMO" },
  ];

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
              <div className="bg-white rounded-[5px] p-6">
                <h3 className="font-bold text-primary text-lg mb-2">
                  Thông tin nhận vé
                </h3>
                <p className="font-bold text-secondary text-sm">
                  Vé điện tử sẽ được hiển thị trong mục "VÉ CỦA TÔI" và gửi qua
                  Email.
                </p>
              </div>

              {/* MÃ KHUYẾN MÃI */}
              <div className="bg-white rounded-[5px] p-6">
                <h3 className="font-bold text-primary text-lg mb-4">
                  Mã khuyến mãi
                </h3>

                {!appliedVoucher ? (
                  <div className="space-y-3">
                    {/* Nút mở danh sách voucher */}
                    <button
                      onClick={handleOpenVoucherModal}
                      className="h-10 rounded-[20px] px-4 border-2 border-secondary bg-white hover:bg-gray-50 flex items-center gap-2 transition-colors w-full md:w-auto"
                    >
                      <Plus className="w-5 h-5 text-secondary" />
                      <span className="font-bold text-secondary text-sm">
                        Thêm voucher
                      </span>
                    </button>
                  </div>
                ) : (
                  // Thẻ Voucher đã chọn
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <TicketPercent className="text-green-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-green-700 text-lg">
                          {appliedVoucher.code}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          {appliedVoucher.reduce_type === "FIXED"
                            ? `Giảm trực tiếp ${formatPrice(
                                appliedVoucher.reduce_price
                              )}`
                            : `Giảm ${appliedVoucher.reduce_price}% giá trị đơn hàng`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-[5px] p-6">
                <h3 className="font-bold text-primary text-lg mb-4">
                  Phương thức thanh toán
                </h3>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      htmlFor={method.id}
                      className="flex items-center gap-3 cursor-pointer select-none p-2 hover:bg-gray-50 rounded-lg transition-colors"
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
                      <div className="w-5 h-5 rounded-full border-2 border-secondary peer-checked:border-[6px] peer-checked:border-primary transition-all flex-shrink-0" />
                      <span className="font-bold text-secondary text-sm">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CỘT PHẢI - BILL */}
        <aside className="relative col-span-4 animate-fade-in opacity-0 [--animation-delay:400ms] ">
          <div className="bg-white rounded-lg  p-6 sticky top-24">
            <h2 className="font-bold text-black text-xl mb-4">
              Thông tin thanh toán
            </h2>
            <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
              {selectedTickets.map((ticket, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1 mr-2">
                    <p className="font-bold text-secondary">{ticket.name}</p>
                    <p className="font-medium italic text-gray-500">
                      {formatPrice(ticket.price)}
                    </p>
                  </div>
                  <span className="font-bold text-primary text-base whitespace-nowrap">
                    x {ticket.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600 font-medium">Tổng tiền vé</span>
                <span className="font-bold text-black">
                  {formatPrice(subTotal)}
                </span>
              </div>

              {appliedVoucher && (
                <div className="flex items-center justify-between text-green-600 text-base animate-in fade-in slide-in-from-top-2">
                  <span className="font-medium flex items-center gap-1">
                    <Tag size={14} /> Voucher ({appliedVoucher.code})
                  </span>
                  <span className="font-bold">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-300">
                <span className="font-bold text-black text-lg">Thanh toán</span>
                <span className="font-extrabold text-primary text-2xl">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !selectedMethod}
              className="w-full h-[50px] bg-primary hover:bg-red-600 rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center text-white font-extrabold text-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> ĐANG XỬ
                  LÝ...
                </>
              ) : (
                "THANH TOÁN"
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* MODAL DANH SÁCH VOUCHER */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setShowVoucherModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex justify-between items-center text-white rounded-t-2xl">
              <h3 className="font-bold text-xl flex items-center gap-3">
                <Tag /> Thêm voucher
              </h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                className="hover:bg-white/20 p-2 rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nhập mã voucher */}
            <div className="px-6 py-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nhập mã voucher của bạn..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="border border-gray-300 px-4 py-2.5 rounded-lg w-3/4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleApplyVoucherCode}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg w-1/4 font-semibold hover:bg-red-600 transition"
                >
                  Áp dụng
                </button>
              </div>

              {voucherError && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {voucherError}
                </p>
              )}
              <div className="border-t-2 border-dashed border-gray-300 mt-5"></div>
            </div>

            {/* Danh sách voucher */}
            <div className="px-6 font-semibold text-gray-700">
              Danh sách voucher khả dụng:
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-gray-50 rounded-b-2xl">
              {/* Loading */}
              {loadingVouchers ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                  <span>Đang tải voucher...</span>
                </div>
              ) : availableVouchers.length > 0 ? (
                <div className="space-y-3">
                  {availableVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-150 cursor-pointer flex justify-between items-center group"
                      onClick={() => handleSelectVoucher(voucher)}
                    >
                      {/* Decoration left border */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary rounded-l-xl"></div>

                      <div className="ml-4">
                        <p className="font-extrabold text-lg text-gray-800">
                          {voucher.code}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {voucher.reduce_type === "FIXED"
                            ? `Giảm ${formatPrice(voucher.reduce_price)}`
                            : `Giảm ${voucher.reduce_price}%`}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          HSD:{" "}
                          {new Date(voucher.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>

                      <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold group-hover:bg-green-600 group-hover:text-white transition">
                        Dùng ngay
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Không có voucher nào phù hợp cho sự kiện này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Paying;