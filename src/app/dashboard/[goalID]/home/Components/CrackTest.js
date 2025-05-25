import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import institute from "@/public/icons/institute1.svg";
import agrade from "@/public/icons/aGrade.svg";
import crackExamBanner from "@/public/images/crackExamBanner.svg";

export default function CrackTest() {
  return (
    <Stack
      flexDirection={{ xs: "column", md: "row" }}
      sx={{
        border: { md: "1px solid var(--border-color)" },
        borderRadius: "13px",
        backgroundColor: { md: "var(--white)" },
        width: "100%",
        padding: { xs: "0px", md: "30px 40px" },
        justifyContent: "space-between",
      }}
      width="100%"
          maxWidth="1200px"
    >
      <Stack sx={{ gap: "25px", width: { xs: "100%", md: "50%" } }}>
        <Stack
          sx={{
            borderBottom: { xs: "none", md: "1px solid var(--text4)" },
            gap: "20px",
            pb: "20px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: "700",
              color: "var(--text3)",
              width: { xs: "100%", md: "80%" },
            }}
          >
            Crack GATE and other exams with our learning platform
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "14px", md: "18px" },
              color: "var(--text3)",
              width: { xs: "100%", md: "400px" },
            }}
          >
            Get a subscription and access unlimited exams and stream courses
            from our experienced faculties.
          </Typography>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "var(--primary-color)",
              width: { xs: "100%", sm: "250px", md: "350px" },
              marginTop: "auto",
            }}
            disableElevation
          >
            Subscribe
          </Button>
        </Stack>
        <Stack flexDirection="row" gap="4px" flexWrap="wrap">
          {[
            {
              img: institute,
              title: "Practice Tests",
              description:
                "Enhance your preparation with daily access to unlimited practice tests, helping you build confidence and improve your accuracy.",
            },
            {
              img: agrade,
              title: "Mock Tests",
              description:
                "Follow well-designed courses aligned with academic and competitive exam syllabi, ensuring focused and effective preparation.",
            },
            {
              img: agrade,
              title: "Learning Path",
              description:
                "Take regular mock tests to evaluate your preparation and receive detailed analytics to track progress and improve performance.",
            },
          ].map((item, index) => (
            <Stack key={index} gap="10px" sx={{ maxWidth: "170px" }}>
              <Stack
                sx={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "var(--sec-color-acc-1)",
                  borderRadius: "15px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image src={item.img} alt="" width={34} height={28} />
              </Stack>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "var(--text3)",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  color: "var(--text3)",
                }}
              >
                {item.description}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack sx={{ width: { xs: "100%", md: "50%" }, alignItems: "center" }}>
        <Image
          src={crackExamBanner}
          alt="Exam Banner"
          width={500}
          height={500}
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "auto",
          }}
        />
      </Stack>
    </Stack>
  );
}
