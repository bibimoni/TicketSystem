import adver from "../assets/images/adver.jpg";

const AdvertisingBanner = () => {
    return (
        <div className="flex-grow py-8">
            <div className="w-full relative">
                <div className="max-w-7xl mx-auto px-4">
                    <img src={adver} alt="Advertising Banner" className="w-full h-[350px] object-cover object-top" />
                </div>
            </div>
        </div>
    );
};

export default AdvertisingBanner;
