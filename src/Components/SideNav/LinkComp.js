"use client";
import { ExpandMore } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import home from "@/public/icons/home_icon.svg";
import dashboard from "@/public/icons/dashboard_icon.svg";
import exam from "@/public/icons/exam_icon.svg";
import courses from "@/public/icons/courses_icon.svg";
import classroom from "@/public/icons/classroom_icon.svg";

export default function LinkComp({ isSideNavOpen, sideNavOpen }) {
  const params = useParams();
  const goalID = params.goalID;
  return (
    <Stack
      sx={{
        gap: "10px",
        maxHeight: "100%",
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <NavComp
        icon={home.src}
        title="Home"
        href={`/dashboard/${goalID}/home`}
        isSideNavOpen={isSideNavOpen}
        selectedGoalId={goalID}
      />
      <NavComp
        icon={dashboard.src}
        title="Dashboard"
        href={`/dashboard/${goalID}`}
        isSideNavOpen={isSideNavOpen}
        isRoot={true}
        selectedGoalId={goalID}
      />
      <NavComp
        icon={exam.src}
        title="Exam"
        href="#"
        list={[
          { title: "History", href: `/dashboard/${goalID}/history` },
          {
            title: "Available Exams",
            href: `/dashboard/${goalID}/exam`,
          },
        ]}
        isSideNavOpen={isSideNavOpen}
        sideNavOpen={sideNavOpen}
        selectedGoalId={goalID}
      />
      <NavComp
        icon={courses.src}
        title="Courses"
        href={`/dashboard/${goalID}/courses`}
        isSideNavOpen={isSideNavOpen}
        selectedGoalId={goalID}
      />
      <NavComp
        icon={classroom.src}
        title="My Classroom"
        href={`/dashboard/${goalID}/myClassroom`}
        isSideNavOpen={isSideNavOpen}
        selectedGoalId={goalID}
      />
    </Stack>
  );
}

const NavComp = ({
  icon,
  title,
  list,
  href,
  isSideNavOpen,
  sideNavOpen,
  isRoot,
  selectedGoalId,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const goalID = params.goalID;

  const isParentActive = isRoot
    ? pathname === `/dashboard/${goalID}`
    : pathname === href || pathname.startsWith(href + "/");
  const isChildActive = list?.some((item) => pathname.startsWith(item.href));

  // const toggleLibrary = () => {
  //   setIsNavOpen((prev) => {
  //     !prev && sideNavOpen && sideNavOpen();
  //     return !prev;
  //   });
  // };

  const toggleLibrary = () => {
    if (!isNavOpen && sideNavOpen) {
      sideNavOpen(); // ✅ only trigger parent state change here
    }
    setIsNavOpen((prev) => !prev); // ✅ separate, safe call
  };

  useEffect(() => {
    isSideNavOpen && setIsNavOpen(false);
    !isSideNavOpen && setIsNavOpen(true);
  }, [isSideNavOpen]);

  return (
    <Stack>
      <Tooltip title={title} disableHoverListener={!isSideNavOpen}>
        <Stack
          sx={{
            minHeight: "40px",
            padding: "10px 20px",
            cursor: "pointer",
            alignItems: !isSideNavOpen ? "" : "center",
            backgroundColor: isParentActive
              ? "var(--primary-color-acc-2)"
              : "transparent",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor:
                list && isNavOpen
                  ? "transparent"
                  : "var(--primary-color-acc-2)",
            },
          }}
        >
          <Link href={href || "#"} passHref>
            <Stack
              flexDirection="row"
              alignItems="center"
              onClick={list ? toggleLibrary : undefined}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={"10px"}
                height={"20px"}
              >
                <Image src={icon} alt={title} width={16} height={16} />
                {!isSideNavOpen && (
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--primary-color)",
                    }}
                  >
                    {title}
                  </Typography>
                )}
              </Stack>
              {list && !isSideNavOpen && (
                <ExpandMore
                  sx={{
                    color: "var(--primary-color)",
                    marginLeft: "auto",
                    transform: isNavOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              )}
            </Stack>
          </Link>

          {isNavOpen && list && (
            <Stack
              sx={{
                pl: "15px",
                mt: "10px",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {list.map((item, index) => (
                <Link href={item.href} key={index} passHref>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: pathname.startsWith(item.href)
                        ? "var(--primary-color)"
                        : "var(--text3)",
                      whiteSpace: "nowrap",
                      borderRadius: "20px",
                      height: "28px",
                      paddingTop: "4px",
                      paddingLeft: "15px",
                      backgroundColor: pathname.startsWith(item.href)
                        ? "var(--primary-color-acc-2)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "var(--primary-color-acc-2)",
                      },
                    }}
                  >
                    {item.title}
                  </Typography>
                </Link>
              ))}
            </Stack>
          )}
        </Stack>
      </Tooltip>
    </Stack>
  );
};
