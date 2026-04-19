"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Logo from "@/public/images/masters-logo.svg";
import Whatsapp from "@/public/image/whatsapp.png";
import Telegram from "@/public/image/telegram.svg";
import Link from "next/link";
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Courses", href: "#courses" },
    { label: "Success Stories", href: "#success-stories" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "About us", href: "#about-us" },
  ];

  const socialLinks = [
    { icon: <InstagramIcon />, href: "#" },
    { icon: <FacebookIcon />, href: "#" },
    { icon: <LinkedInIcon />, href: "#" },
    { icon: <TwitterIcon />, href: "#" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#051e1a", // Deep dark teal/black
        color: "#fff",
        pt: { xs: 8, md: 10 },
        pb: 4,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Decorative Blob */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(24,113,99,0.15) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Newsletter Section */}
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            p: { xs: 4, md: 6 },
            mb: 8,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: "var(--font-helvetica)",
                  fontWeight: 700,
                  fontSize: { xs: "24px", md: "32px" },
                  mb: 1,
                  background: "linear-gradient(90deg, #fff, #999)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Join our community of learners
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "var(--font-satoshi)",
                }}
              >
                Get the latest updates, study tips, and exclusive offers sent
                directly to your inbox.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  id="footer-newsletter-email"
                  fullWidth
                  placeholder="Enter your email address"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderRadius: "50px",
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--secondary)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    bgcolor: "var(--secondary)",
                    color: "#000",
                    fontWeight: 600,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: "#e59700",
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={8}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Stack gap={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Logo wrapper for better visibility on dark bg */}
                <Box
                  sx={{
                    bgcolor: "white",
                    p: 0.5,
                    borderRadius: 1,
                    display: "flex",
                  }}
                >
                  <Image
                    src={Logo}
                    alt="Logo"
                    width={40}
                    height={20}
                    style={{ width: "auto", height: "24px" }}
                  />
                </Box>
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  The Masters Academy
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.8,
                  fontFamily: "var(--font-satoshi)",
                  fontSize: "15px",
                }}
              >
                Empowering students with expert coaching for competitive exams
                and placements. Your gateway to a successful career starts here.
              </Typography>

              <Stack direction="row" gap={1}>
                {socialLinks.map((social, idx) => (
                  <IconButton
                    key={idx}
                    sx={{
                      color: "#fff",
                      bgcolor: "rgba(255,255,255,0.05)",
                      "&:hover": { bgcolor: "var(--secondary)", color: "#000" },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "18px",
                mb: 3,
                fontFamily: "var(--font-helvetica)",
              }}
            >
              Quick Links
            </Typography>
            <Stack gap={1.5}>
              {links.map((link, idx) => (
                <Link key={idx} href={link.href} passHref>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-satoshi)",
                      fontSize: "15px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      width: "fit-content",
                      "&:hover": {
                        color: "var(--secondary)",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "18px",
                mb: 3,
                fontFamily: "var(--font-helvetica)",
              }}
            >
              Contact Us
            </Typography>
            <Stack gap={2.5}>
              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    p: 1,
                    borderRadius: "50%",
                  }}
                >
                  <PhoneIcon sx={{ color: "var(--secondary)", fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
                  >
                    Call Us
                  </Typography>
                  <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                    99522 25825
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    p: 1,
                    borderRadius: "50%",
                  }}
                >
                  <EmailIcon sx={{ color: "var(--secondary)", fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
                  >
                    Email Us
                  </Typography>
                  <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                    mastersacademyvsb@gmail.com
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" gap={2} alignItems="flex-start">
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    p: 1,
                    borderRadius: "50%",
                    mt: 0.5,
                  }}
                >
                  <LocationOnIcon
                    sx={{ color: "var(--secondary)", fontSize: 20 }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
                  >
                    Visit Us
                  </Typography>
                  <Typography
                    sx={{ color: "#fff", lineHeight: 1.6, fontSize: "15px" }}
                  >
                    No. 82, Vasantham Nagar, E.B. Colony,
                    <br />
                    Saravanampatti Post, Coimbatore - 641 035
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 6 }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
            © {new Date().getFullYear()} The Masters Academy. All rights
            reserved.
          </Typography>

          <Stack direction="row" gap={4} alignItems="center">
            <Link href="https://incrix.com" target="_blank" passHref>
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                sx={{
                  cursor: "pointer",
                  opacity: 0.7,
                  "&:hover": { opacity: 1, color: "var(--secondary)" },
                  transition: "all 0.2s",
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>Designed by</Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: 700 }}>
                  Incrix
                </Typography>
              </Stack>
            </Link>
            <Typography
              onClick={() => setOpenPrivacy(true)}
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                cursor: "pointer",
                "&:hover": { color: "#fff" },
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              onClick={() => setOpenTerms(true)}
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                cursor: "pointer",
                "&:hover": { color: "#fff" },
              }}
            >
              Terms of Service
            </Typography>
          </Stack>
        </Stack>
      </Container>

      {/* Privacy Policy Dialog */}
      <Dialog
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        scroll="paper"
        maxWidth="md"
      >
        <DialogTitle
          sx={{ fontFamily: "var(--font-helvetica)", fontWeight: 700 }}
        >
          Privacy Policy
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            component="div"
            sx={{ fontFamily: "var(--font-satoshi)", color: "#333" }}
            tabIndex={-1}
          >
            <Typography paragraph>
              <strong>1. Information Collection</strong>
              <br />
              We collect information you provide directly to us when you create
              an account, subscribe to our newsletter, or fill out a form. This
              includes your name, email address, and phone number.
            </Typography>
            <Typography paragraph>
              <strong>2. Use of Information</strong>
              <br />
              We use the collected information to provide, maintain, and improve
              our services, including sending you study materials, updates, and
              responding to your comments/questions.
            </Typography>
            <Typography paragraph>
              <strong>3. Data Protection</strong>
              <br />
              We implement security measures to maintain the safety of your
              personal information. We do not sell, trade, or otherwise transfer
              your personally identifiable information to outside parties.
            </Typography>
            <Typography paragraph>
              <strong>4. Cookies</strong>
              <br />
              We may use cookies to understand and save your preferences for
              future visits.
            </Typography>
            <Typography paragraph>
              <strong>5. Contact Us</strong>
              <br />
              If there are any questions regarding this privacy policy, you may
              contact us using the information in the footer.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenPrivacy(false)}
            sx={{ color: "var(--primary)" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        scroll="paper"
        maxWidth="md"
      >
        <DialogTitle
          sx={{ fontFamily: "var(--font-helvetica)", fontWeight: 700 }}
        >
          Terms of Service
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            component="div"
            sx={{ fontFamily: "var(--font-satoshi)", color: "#333" }}
            tabIndex={-1}
          >
            <Typography paragraph>
              <strong>1. Acceptance of Terms</strong>
              <br />
              By accessing The Masters Academy website and services, you agree
              to be bound by these Terms of Service. If you do not agree to
              agree to these terms, please do not use our services.
            </Typography>
            <Typography paragraph>
              <strong>2. Use License</strong>
              <br />
              Permission is granted to temporarily download one copy of the
              materials (information or software) on The Masters Academys
              website for personal, non-commercial transitory viewing only.
            </Typography>
            <Typography paragraph>
              <strong>3. Disclaimer</strong>
              <br />
              The materials on The Masters Academys website are provided on an
              'as is' basis. We make no warranties, expressed or implied, and
              hereby disclaim and negate all other warranties.
            </Typography>
            <Typography paragraph>
              <strong>4. Limitations</strong>
              <br />
              In no event shall The Masters Academy or its suppliers be liable
              for any damages (including, without limitation, damages for loss
              of data or profit) arising out of the use or inability to use the
              materials on our website.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenTerms(false)}
            sx={{ color: "var(--primary)" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Footer;
