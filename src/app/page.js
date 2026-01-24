import { Stack } from "@mui/material";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OurCourses from "./components/OurCourses";
import MasterAcademy from "./components/MasterAcademy";
import LearnOn from "./components/LearnOn";
import Watch from "./components/Watch";
import Founders from "./components/Founders";
import Trusted from "./components/Trusted";
import SuccessStories from "./components/SuccessStories";
import Services from "./components/Services";
import LookingFor from "./components/LookingFor";
import HowItWorks from "./components/HowItWorks";
import Login from "./components/Login";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <Stack>
      <Navbar />
      <Hero />
      <OurCourses />
      <MasterAcademy />
      <LearnOn />
      <Watch />
      <Services />
      <SuccessStories />
      <Founders />
      <Trusted />
      <LookingFor />
      <HowItWorks />
      <Login />
      <Footer />
    </Stack>
  );
}
