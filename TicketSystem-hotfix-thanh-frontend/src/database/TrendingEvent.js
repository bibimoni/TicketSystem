// src/database/trendingEvent.js
import feature1 from "../assets/images/feature3.jpg"; // Path relative từ database → src/assets
import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";

const trendingEvent = [
    { src: image1, alt: "Featured Event 1", number:1  },
    { src: feature1, alt: "Featured Event 2", number:2  },
    { src: image3, alt: "Featured Event 3", number:3  },
    { src: image2, alt: "Featured Event 4", number:4  },
    { src: image3, alt: "Featured Event 5", number:5  },
    { src: image1, alt: "Featured Event 1" },
    { src: feature1, alt: "Featured Event 2" },
    { src: image3, alt: "Featured Event 3" },
    { src: image2, alt: "Featured Event 4" },
    { src: image3, alt: "Featured Event 5" },
];

export default trendingEvent;