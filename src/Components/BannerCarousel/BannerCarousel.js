"use client";
import Slider from "react-slick";
import { Box } from "@mui/material";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerCarousel = ({ banners }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: "15px",
              overflow: "hidden",
              width: "100%",
              maxHeight: "600px",
              outline: "none", // Remove slick outline
            }}
          >
            <Image
              src={banner.image}
              alt={`banner-${index}`}
              width={1200}
              height={600}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerCarousel;
