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
        gap: "8px",
        maxHeight: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          borderRadius: "10px",
        },
      }}
    >
      <NavComp
        icon={home.src}
        title="Home"
        href={`/dashboard/${goalID}/home`}
        isSideNavOpen={isSideNavOpen}
        color="#187163"
        bgColor="rgba(24, 113, 99, 0.1)"
      />
      <NavComp
        icon={dashboard.src}
        title="Dashboard"
        href={`/dashboard/${goalID}`}
        isSideNavOpen={isSideNavOpen}
        isRoot={true}
        color="#187163"
        bgColor="rgba(24, 113, 99, 0.1)"
      />
      <NavComp
        icon={exam.src}
        title="Exam"
        href={`/dashboard/${goalID}/exam`}
        isSideNavOpen={isSideNavOpen}
        color="#187163"
        bgColor="rgba(24, 113, 99, 0.1)"
      />
      <NavComp
        icon={courses.src}
        title="Courses"
        href={`/dashboard/${goalID}/courses`}
        isSideNavOpen={isSideNavOpen}
        color="#187163"
        bgColor="rgba(24, 113, 99, 0.1)"
      />
      <NavComp
        icon={classroom.src}
        title="My Classroom"
        href={`/dashboard/${goalID}/myClassroom`}
        isSideNavOpen={isSideNavOpen}
        color="#187163"
        bgColor="rgba(24, 113, 99, 0.1)"
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
  color,
  bgColor,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();

  // Logic to determine if parent or child is active
  const isParentActive = isRoot
    ? pathname === href // Exact match for dashboard root if needed, or adjust logic
    : pathname === href || (href !== "#" && pathname.startsWith(href + "/"));

  // Special handling for dashboard root vs home
  // If href is /dashboard/[id], it might match everything.
  // Let's refine:
  // If isRoot (Dashboard), active if pathname is exactly that.
  // If Home, active if pathname is exactly that.

  const isActive = isRoot
    ? pathname === href
    : list
    ? list.some((item) => pathname.startsWith(item.href))
    : pathname === href || pathname.startsWith(href + "/");

  const isChildActive = list?.some((item) => pathname.startsWith(item.href));

  const toggleLibrary = () => {
    setIsNavOpen((prev) => !prev);
    if (!isNavOpen && sideNavOpen) {
      sideNavOpen();
    }
  };

  useEffect(() => {
    if (isSideNavOpen) {
      setIsNavOpen(false);
    } else {
      setIsNavOpen(true);
    }
  }, [isSideNavOpen]);

  return (
    <Stack>
      <Tooltip
        title={title}
        disableHoverListener={!isSideNavOpen}
        placement="right"
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "var(--text1)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              padding: "8px 12px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          },
        }}
      >
        <Stack
          sx={{
            minHeight: "48px",
            padding: isSideNavOpen ? "6px" : "8px 10px",
            cursor: "pointer",
            alignItems: isSideNavOpen ? "center" : "flex-start",
            background:
              isActive || isChildActive
                ? `linear-gradient(135deg, ${bgColor} 0%, ${color}15 100%)`
                : "transparent",
            borderRadius: "12px",
            border: `1.5px solid ${
              isActive || isChildActive ? color + "40" : "transparent"
            }`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              background:
                list && isNavOpen
                  ? "transparent"
                  : `linear-gradient(135deg, ${bgColor} 0%, ${color}15 100%)`,
              borderColor: color + "40",
            },
            "&::before":
              isActive || isChildActive
                ? {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "60%",
                    backgroundColor: color,
                    borderRadius: "0 4px 4px 0",
                  }
                : {},
          }}
        >
          <Link
            href={href || "#"}
            passHref
            style={{ width: "100%", textDecoration: "none" }}
          >
            <Stack
              flexDirection="row"
              alignItems="center"
              onClick={(e) => {
                if (list) {
                  e.preventDefault();
                  toggleLibrary();
                }
              }}
              gap={isSideNavOpen ? 0 : "12px"}
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" gap="12px">
                <Stack
                  sx={{
                    width: "40px",
                    height: "40px",
                    backgroundColor:
                      isActive || isChildActive ? color + "20" : bgColor,
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: `1.5px solid ${
                      isActive || isChildActive ? color + "60" : color + "30"
                    }`,
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={icon}
                    alt={title}
                    width={20}
                    height={20}
                    style={{
                      filter:
                        isActive || isChildActive
                          ? "brightness(0) saturate(100%) invert(34%) sepia(16%) saturate(1939%) hue-rotate(128deg) brightness(98%) contrast(92%)" // Approximate filter for #187163
                          : "none",
                    }}
                  />
                </Stack>
                {!isSideNavOpen && (
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: isActive || isChildActive ? 700 : 600,
                      color: isActive || isChildActive ? color : "var(--text1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {title}
                  </Typography>
                )}
              </Stack>
              {list && !isSideNavOpen && (
                <ExpandMore
                  sx={{
                    color: isActive || isChildActive ? color : "var(--text3)",
                    fontSize: "20px",
                    transform: isNavOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              )}
            </Stack>
          </Link>
          <Stack>
            {isNavOpen && list && (
              <Stack
                sx={{
                  pl: isSideNavOpen ? 0 : "52px",
                  mt: "8px",
                  gap: "4px",
                  animation: "slideDown 0.3s ease",
                  "@keyframes slideDown": {
                    from: {
                      opacity: 0,
                      transform: "translateY(-10px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                {list.map((item, index) => (
                  <Link
                    href={item.href}
                    key={index}
                    passHref
                    style={{ textDecoration: "none" }}
                  >
                    <Stack
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: pathname.startsWith(item.href)
                          ? color
                          : "var(--text2)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        backgroundColor: pathname.startsWith(item.href)
                          ? bgColor
                          : "transparent",
                        border: `1px solid ${
                          pathname.startsWith(item.href)
                            ? color + "30"
                            : "transparent"
                        }`,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: bgColor,
                          borderColor: color + "30",
                        },
                      }}
                    >
                      {item.title}
                    </Stack>
                  </Link>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Tooltip>
    </Stack>
  );
};
