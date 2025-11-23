import feature1 from "../assets/images/feature3.jpg"

const MoreEvent = () => {
    const recommended = [
        { id: 10, title: "SPRING CONCERT 2025", image: feature1 },
        { id: 11, title: "V CONCERT", image: feature1 },
        { id: 12, title: "TAYLOR SWIFT THE ERAS TOUR", image: feature1 },
        { id: 13, title: "SPRING CONCERT 2025", image: feature1 },
        { id: 14, title: "V CONCERT", image: feature1 },
        { id: 15, title: "SPRING CONCERT 2025", image: feature1 },
        { id: 16, title: "V CONCERT", image: feature1 },
        { id: 17, title: "TAYLOR SWIFT THE ERAS TOUR", image: feature1 },
        { id: 18, title: "SPRING CONCERT 2025", image: feature1 },
        { id: 19, title: "V CONCERT", image: feature1 },
    ];
    return (
        <>
            {/* CÓ THỂ BẠN THÍCH */}
            <div className="max-w-7xl mx-auto px-6 py-3">

                {/* Line + title căn giữa */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-full max-w-7xl ">
                        <hr className="border-white border-[3px] mb-4 " />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        CÓ THỂ BẠN THÍCH
                    </h2>
                </div>

                {/* Grid 5 hình */}
                <div className="grid grid-cols-5 gap-4">
                    {recommended.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                        >
                            <div className="w-full h-32 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút Xem thêm */}
                <div className="text-center mt-10 ">
                    <button className="bg-primary text-white text-l border-[3px] border-primary hover:bg-white hover:text-primary font-bold py-4 px-12 rounded-full transition">
                        Xem thêm
                    </button>
                </div>

            </div>
        </>
    );
}
export default MoreEvent;