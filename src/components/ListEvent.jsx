import { useRef } from "react";
import { Link } from "react-router-dom";
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
                                            {/* Số thứ tự */}
                                            <div className="font-monoto text-primary text-[170px] text-center absolute left-0 top-[55%] -translate-y-1/2 z-10">
                                                {index + 1}
                                            </div>

                                            {/* Hình ảnh */}
                                            <Link
                                                to={`/about-event/${event.id}`}
                                                className="block w-3/4 h-full ml-auto z-20"
                                            >
                                                <img
                                                    className="w-full h-full object-cover rounded-lg"
                                                    alt={event.alt}
                                                    src={event.src}
                                                />
                                            </Link>
                                        </>
                                    ) : title === "SỰ KIỆN NỔI BẬT" ? (
                                        <Link
                                            to={`/about-event/${event.id}`}
                                            className="block w-full h-full"
                                        >
                                            <img
                                                className="w-full h-full object-cover object-center rounded-lg"
                                                alt={event.alt}
                                                src={event.picture}
                                            />
                                        </Link>
                                    ) : (
                                        /* Các sự kiện khác */
                                        <Link
                                            to={`/about-event/${event.id}`}
                                            className="block w-full h-full"
                                        >
                                            <img
                                                className="w-full h-full object-cover object-center rounded-lg"
                                                alt={event.alt}
                                                src={event.src}
                                            />
                                        </Link>
                                    )}
                                </div>


                            </div>
                        ))}
                    </div>

                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center hover:bg-white/50 transition-colors shadow-xl z-50"
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
            title: PropTypes.string,
            subtitle: PropTypes.string,
        })
    ),
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    gap: PropTypes.number,
    className: PropTypes.string,
};

export default ListEvent;
