import PropTypes from "prop-types";

function AdvertisingBanner({ banner, height, className, alt }) {
    return (
        <div className={`flex-grow py-8 ${className}`}>
            <div className="w-full relative">
                <div className="max-w-7xl mx-auto px-4">
                    <img
                        src={banner}
                        alt={alt}
                        className={`w-full object-cover object-top`}
                        style={{ height }}
                    />
                </div>
            </div>
        </div>
    );
}

AdvertisingBanner.propTypes = {
    banner: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    alt: PropTypes.string,
};

AdvertisingBanner.defaultProps = {
    height: "350px",
    className: "",
    alt: "Advertising Banner",
};

export default AdvertisingBanner;

