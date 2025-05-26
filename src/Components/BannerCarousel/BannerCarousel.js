"use client";
import { Carousel } from "antd";
import { Box } from "@mui/material";
import Image from "next/image";

const BannerCarousel = ({ banners }) => {
  return (
    <Carousel
      autoplay
      autoplaySpeed={3000}
      dots
      infinite
      speed={1000}
      slidesToShow={1}
      slidesToScroll={1}
    >
      {banners.map((banner, index) => (
        <Box
          key={index}
          sx={{
            borderRadius: "15px",
            overflow: "hidden",
            width: "100%",
            maxHeight: "600px",
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
    </Carousel>
  );
};

export default BannerCarousel;