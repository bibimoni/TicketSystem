import { useRef } from "react";
import { ChevronRightIcon } from "lucide-react";
import PropTypes from "prop-types";

const ListEvent = ({
    title = "",
    events = [],
    imageWidth = "223px",
    imageHeight = "287px",
    gap = 5,
}) => {

    const scrollRef = useRef(null);

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: parseInt(imageWidth) + gap,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="bg-secondary py-8 translate-y-[-1rem] mt-10">
            <div className="px-[125px]">

                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-primary mr-3" />
                    <h2 className="font-montserrat font-extrabold text-white text-lg">
                        {title}
                    </h2>
                </div>

                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="scroll-container flex overflow-x-auto overflow-visible scrollbar-hide"
                        style={{ gap: `${gap}px` }}
                    >
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0"
                                style={{
                                    width: imageWidth,
                                    height: imageHeight,
                                }}
                            >
                                <div className="flex h-full relative overflow-hidden">
                                    {title === "SỰ KIỆN TRENDING" ? (
                                        <>
                                            
                                            {/* Số thứ tự lớn bên trái */}
                                            <div className="font-monoto text-primary text-[170px] text-center absolute left-0 top-[55%] -translate-y-1/2 z-10">
                                                {index + 1}
                                            </div>

                                            {/* Hình ảnh căn phải, chiếm 3/4 */}
                                            <img
                                                className="w-3/4 h-full object-cover rounded-lg ml-auto z-20"
                                                alt={event.alt}
                                                src={event.src}
                                            />
                                            
                                        </>
                                    ) : (
                                        /* Các sự kiện khác hiển thị full width */
                                        <img
                                            className="w-full h-full object-cover object-left rounded-lg ml-auto"
                                            alt={event.alt}
                                            src={event.src}
                                        />
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>

                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-colors shadow-xl/30 z-50"
                    >
                        <ChevronRightIcon className="w-[27px] h-8 text-black" />
                    </button>
                </div>
            </div>
        </section>
    );
};
ListEvent.propTypes = {
    title: PropTypes.string,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            alt: PropTypes.string.isRequired,
            title: PropTypes.string, // For overlay text
            subtitle: PropTypes.string, // For overlay text
        })
    ),
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    gap: PropTypes.number,
    className: PropTypes.string,
};

export default ListEvent;
