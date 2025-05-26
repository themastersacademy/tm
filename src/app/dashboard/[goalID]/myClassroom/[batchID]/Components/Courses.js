import { East, ShoppingBagRounded } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import CourseCard from "@/src/Components/CourseCard/CourseCard";

export default function Courses() {
  const courseList = [
    {
      title: "General Aptitude",
      thumbnail: defaultThumbnail.src,
      lessons: "16 Lessons",
      hours: "48 hours",
      actionButton: (
        <Button
          variant="text"
          endIcon={<East sx={{ width: "16px", height: "16px" }} />}
          sx={{
            textTransform: "none",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
        >
          View
        </Button>
      ),
      Language: ["English"],
    },

    {
      title: "General Aptitude",
      thumbnail: defaultThumbnail.src,
      lessons: "16 Lessons",
      hours: "48 hours",
      actionButton: (
        <Button
          variant="text"
          endIcon={<East sx={{ width: "16px", height: "16px" }} />}
          sx={{
            textTransform: "none",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
        >
          View
        </Button>
      ),
      Language: ["English"],
    },
  ];
  return (
    <Stack>
      <Stack
        flexDirection="row"
        flexWrap="wrap"
        sx={{ columnGap: { xs: "4px", md: "20px" }, rowGap: "10px" }}
      >
        {courseList.map((item, index) => (
          <CourseCard
            key={index}
            {...item}
            actionMobile={
              <Button
                variant="contained"
                endIcon={<ShoppingBagRounded />}
                sx={{
                  textTransform: "none",
                  color: "var(--white)",
                  backgroundColor: "var(--primary-color)",
                  borderRadius: "0px 0px 10px 10px",
                }}
                // onClick={() => {
                //   router.push(`/dashboard/${goalID}/courses/${item.id}`);
                // }}
              >
                Purchase
              </Button>
            }
          />
        ))}
      </Stack>
    </Stack>
  );
}
