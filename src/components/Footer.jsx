import React from "react";
import textlogo from '../assets/images/textlogo.png'

const Footer = () => {
    const socialMedia = [
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_de_Facebook.png",
            alt: "Social 1",
            link: "facebook.com",
        },
        {
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ZW0jLTs-p4e66QtRLpcWL0yu23OZmPA6ye8g5wqeWt9mveJkP7L1StdT8-MfM6WPuN8&usqp=CAU",
            alt: "Social 2",
            link: "threads.com",

        },
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1024px-Instagram_logo_2022.svg.png",
            alt: "Social 3",
            link: "instagram.com",
        },
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/1024px-Tiktok_icon.svg.png",
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
        <footer className="bg-secondary py-12 mt-8">
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
                            <h3 className="font-extrabold text-white text-xs mb-2">
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
                            <h3 className="font-extrabold text-white text-xs mb-2">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="/"
                                            className="font-semibold text-white text-[10px] hover:underline transition-all"
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
                    <p className="font-semibold text-white text-[10px]">
                        Bạn đang truy cập TickeZ. phiên bản Số 123456789
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;