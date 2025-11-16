import React from "react";
import textlogo from '../assets/images/textlogo.png'

const Footer = () => {
    const socialMedia = [
        {
            src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-53.svg",
            alt: "Social 1",
            link: "facebook.com",
        },
        {
            src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-56.svg",
            alt: "Social 2",
            link: "threads.com",

        },
        {
            src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-57.svg",
            alt: "Social 3",
            link: "instagram.com",
        },
        {
            src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-58.svg",
            alt: "Social 4",
            link: "tiktok.com",
        },
    ];
    const footerSections = [
        {
            title: "GIỚI THIỆU",
            links: ["Giới thiệu về TickeZ."],
        },
        {
            title: "QUY ĐỊNH",
            links: [
                "Hợp đồng",
                "Điều khoản & Điều kiện",
                "Chính sách bảo vệ người dùng",
            ],
        },
        {
            title: "LIÊN HỆ",
            links: ["Hotline: 033.33.333", "Chatbot hỗ trợ"],
        },
        {
            title: "THÔNG TIN",
            links: ["Thông báo", "About us", "FAQs", "Góp ý"],
        },
    ];
    return (
        <footer className="bg-[#5d5c5c] py-12 mt-8">
            <div className="max-w-[1440px] mx-auto px-[122px]">
                <div className="flex justify-between mb-8">
                    <div>
                        <a href="/">
                            <img
                                className="w-[345px] mb-8"
                                alt="TickeZ Logo"
                                src={textlogo}
                            />
                        </a>
                        <div className="mb-4">
                            <h3 className="[font-family:'Montserrat',Helvetica] font-extrabold text-white text-xs mb-2">
                                FOLLOW US
                            </h3>
                            <div className="flex gap-4">
                                {socialMedia.map((social, index) => (
                                    <a
                                        key={index}
                                        href={`https://${social.link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            className="w-10 h-10 object-cover rounded"
                                            alt={social.alt}
                                            src={social.src}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="[font-family:'Montserrat',Helvetica] font-extrabold text-white text-xs mb-2">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="/"
                                            className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-[10px] hover:underline transition-all"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <p className="[font-family:'Montserrat',Helvetica] font-semibold text-white text-[10px]">
                        Bạn đang truy cập TickeZ. phiên bản Số 123456789
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;