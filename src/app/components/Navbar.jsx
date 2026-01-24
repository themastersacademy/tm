"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Button,
  Typography,
  IconButton,
  Drawer,
  Container,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Logo from "@/public/images/masters-logo.svg";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Home");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Courses", href: "#courses" },
    { label: "Mentors", href: "#mentors" },
    { label: "Scores", href: "#success-stories" },
    { label: "About us", href: "#about-us" },
  ];

  const handleLinkClick = (label) => {
    setActiveLink(label);
    setMenuOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        pt: scrolled ? 1 : 2,
        pb: 1,
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: scrolled
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "50px",
            px: { xs: 2, md: 3 },
            py: scrolled ? 0.8 : 1.2,
            boxShadow: scrolled
              ? "0 10px 40px rgba(0,0,0,0.08)"
              : "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(255,255,255,0.5)",
            transition: "all 0.3s ease",
            maxWidth: "1400px",
            mx: "auto",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              minHeight: "auto !important",
            }}
          >
            {/* Logo */}
            <Link href="/" passHref style={{ textDecoration: "none" }}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ cursor: "pointer" }}
              >
                <Image
                  src={Logo}
                  alt="TMA Logo"
                  width={40}
                  height={40}
                  style={{ width: "auto", height: "30px" }}
                />
                <Typography
                  sx={{
                    color: "var(--primary)",
                    fontSize: { xs: "16px", md: "18px" },
                    fontWeight: 700,
                    fontFamily: "var(--font-helvetica)",
                    lineHeight: 1.2,
                  }}
                >
                  <Box component="span" sx={{ color: "var(--secondary)" }}>
                    The
                  </Box>{" "}
                  Masters Academy
                </Typography>
              </Stack>
            </Link>

            {/* Desktop Nav */}
            <Stack
              direction="row"
              gap={0.5}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                bgcolor: "rgba(0,0,0,0.03)",
                p: 0.5,
                borderRadius: "50px",
              }}
            >
              {links.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    onClick={() => handleLinkClick(item.label)}
                    sx={{
                      color:
                        activeLink === item.label
                          ? "#fff"
                          : "var(--foreground)",
                      bgcolor:
                        activeLink === item.label ? "#111827" : "transparent",
                      fontFamily: "var(--font-satoshi)",
                      fontWeight: 600,
                      fontSize: "13px",
                      textTransform: "none",
                      px: 2,
                      py: 0.6,
                      borderRadius: "50px",
                      minWidth: "auto",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor:
                          activeLink === item.label
                            ? "#111827"
                            : "rgba(0,0,0,0.05)",
                        color:
                          activeLink === item.label ? "#fff" : "var(--primary)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" gap={2} alignItems="center">
              <Button
                onClick={() => router.push("/signIn")}
                variant="contained"
                disableElevation
                sx={{
                  display: { xs: "none", md: "flex" },
                  px: 2.5,
                  py: 1,
                  borderRadius: "50px",
                  backgroundColor: "var(--secondary)",
                  color: "#000",
                  textTransform: "none",
                  fontFamily: "var(--font-satoshi)",
                  fontWeight: 700,
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "#e59700",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(254, 194, 77, 0.4)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Login Now
              </Button>

              <IconButton
                sx={{
                  display: { xs: "flex", md: "none" },
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                }}
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon sx={{ color: "var(--foreground)" }} />
              </IconButton>
            </Stack>
          </Toolbar>
        </Box>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "320px",
            p: 3,
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
            bgcolor: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Stack alignItems="flex-end" mb={4}>
          <IconButton
            onClick={() => setMenuOpen(false)}
            sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <List>
          {links.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <ListItem
                disablePadding
                sx={{ mb: 1.5 }}
                onClick={() => handleLinkClick(item.label)}
              >
                <Box
                  sx={{
                    width: "100%",
                    p: 2,
                    borderRadius: "16px",
                    bgcolor:
                      activeLink === item.label
                        ? "rgba(24, 113, 99, 0.08)"
                        : "transparent",
                    color:
                      activeLink === item.label
                        ? "var(--primary)"
                        : "var(--foreground)",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: activeLink === item.label ? 700 : 500,
                      fontFamily: "var(--font-satoshi)",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </ListItem>
            </Link>
          ))}
        </List>

        <Button
          onClick={() => router.push("/signIn")}
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            py: 1.8,
            borderRadius: "50px",
            backgroundColor: "var(--primary)",
            color: "#fff",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 700,
            boxShadow: "0 10px 30px rgba(24, 113, 99, 0.2)",
          }}
        >
          Login Now
        </Button>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
