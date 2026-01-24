"use client";
import {
  Box,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const Services = () => {
  const services = [
    {
      title: "Creative thinking & Problem Solving",
      icon: <LightbulbIcon sx={{ fontSize: 32, color: "#CA8A04" }} />, // Darker Yellow
      bg: "#FEF9C3",
      accent: "#EAB308",
    },
    {
      title: "Industry Expert Mentors",
      icon: <GroupsIcon sx={{ fontSize: 32, color: "#2563EB" }} />,
      bg: "#EFF6FF",
      accent: "#3B82F6",
    },
    {
      title: "20+ Specialized Categories",
      icon: <MenuBookIcon sx={{ fontSize: 32, color: "#EA580C" }} />,
      bg: "#FFF7ED",
      accent: "#F97316",
    },
    {
      title: "1-on-1 Private Monitoring",
      icon: <VisibilityIcon sx={{ fontSize: 32, color: "#9333EA" }} />,
      bg: "#FAF5FF",
      accent: "#A855F7",
    },
    {
      title: "Affordable Pricing with Scholarships",
      icon: <LocalOfferIcon sx={{ fontSize: 32, color: "#E11D48" }} />,
      bg: "#FFF1F2",
      accent: "#F43F5E",
    },
  ];

  return (
    <Container
      maxWidth="xl"
      id="about-us"
      sx={{
        mt: { xs: 8, md: 12 },
        mb: { xs: 8, md: 12 },
        scrollMarginTop: "100px",
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 8, textAlign: "center", maxWidth: "800px", mx: "auto" }}>
        <Typography
          sx={{
            fontFamily: "var(--font-satoshi)",
            fontWeight: 700,
            letterSpacing: 1.5,
            fontSize: "14px",
            color: "var(--secondary)",
            mb: 2,
            textTransform: "uppercase",
            display: "inline-block",
            px: 2,
            py: 0.5,
            bgcolor: "rgba(254, 194, 77, 0.1)",
            borderRadius: "50px",
          }}
        >
          Key Features
        </Typography>

        <Typography
          component="h2"
          sx={{
            fontFamily: "var(--font-helvetica)",
            fontWeight: 700,
            fontSize: { xs: "32px", md: "48px" },
            lineHeight: 1.2,
            color: "var(--foreground)",
            mb: 3,
          }}
        >
          Why Learners Choose Us
        </Typography>

        <Typography
          sx={{
            fontFamily: "var(--font-satoshi)",
            color: "var(--text-gray)",
            fontSize: { xs: "16px", md: "18px" },
            lineHeight: 1.6,
          }}
        >
          We focus on providing an ecosystem that bridges the gap between
          academic learning and industry requirements, ensuring you are
          future-ready.
        </Typography>
      </Box>

      {/* Grid Section */}
      <Grid container spacing={3}>
        {/* First Row: 3 Items */}
        {services.slice(0, 3).map((service, index) => (
          <Grid item xs={12} md={4} key={index}>
            <ServiceCard service={service} />
          </Grid>
        ))}

        {/* Second Row: 2 Items (Wider) */}
        {services.slice(3, 5).map((service, index) => (
          <Grid item xs={12} md={6} key={index + 3}>
            <ServiceCard service={service} wide />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const ServiceCard = ({ service, wide }) => {
  const router = useRouter();

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        p: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: { xs: "auto", md: wide ? "240px" : "320px" },
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.05)",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          borderColor: service.accent,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            height: 64,
            width: 64,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: service.bg,
            borderRadius: "16px",
          }}
        >
          {service.icon}
        </Box>

        <Typography
          sx={{
            fontFamily: "var(--font-helvetica)",
            fontWeight: 700,
            fontSize: { xs: "20px", md: "24px" },
            color: "#111827",
            mb: 1.5,
            maxWidth: wide ? "80%" : "100%",
          }}
        >
          {service.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: "var(--font-satoshi)",
            fontSize: "15px",
            color: "#6B7280",
            maxWidth: "90%",
            mb: 3,
          }}
        >
          Experience world-class learning with features designed to accelerate
          your growth.
        </Typography>
      </Box>

      <Box sx={{ alignSelf: "flex-start", position: "relative", zIndex: 1 }}>
        <IconButton
          sx={{
            border: "1px solid #E5E7EB",
            backgroundColor: "#fff",
            width: 48,
            height: 48,
            color: service.accent,
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: service.accent,
              color: "#fff",
              borderColor: service.accent,
              transform: "translateX(5px)",
            },
          }}
          onClick={() => router.push("/contactUs")}
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Services;
