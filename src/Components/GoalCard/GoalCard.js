import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import gate_cse from "@/public/icons/gate_cse.svg";
import placement from "@/public/icons/placements.svg";
import Banking from "@/public/icons/banking.svg";
import {
  SchoolOutlined,
  MenuBookOutlined,
  ArticleOutlined,
  CheckCircleRounded,
} from "@mui/icons-material";

export default function GoalCard({
  title,
  icon,
  tagline,
  description,
  coursesCount = 0,
  subjectsCount = 0,
  blogsCount = 0,
  isSelected,
  isEnrolled = false,
  onClick,
}) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "castle":
        return gate_cse;
      case "org":
        return placement;
      case "institute":
        return Banking;
      default:
        return gate_cse;
    }
  };

  return (
    <Stack
      onClick={onClick}
      sx={{
        width: "100%",
        borderRadius: "12px",
        background: isSelected
          ? "rgba(24, 113, 99, 0.03)"
          : "var(--white)",
        border: isSelected
          ? "2px solid var(--primary-color)"
          : "1px solid var(--border-color)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "var(--primary-color)",
        },
      }}
    >
      {/* Selection Badge */}
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "var(--primary-color)",
            borderBottomLeftRadius: "10px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <CheckCircleRounded sx={{ color: "white", fontSize: "14px" }} />
          <Typography
            sx={{
              color: "white",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            SELECTED
          </Typography>
        </Box>
      )}

      {/* Enrolled Badge */}
      {isEnrolled && !isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "#4CAF50",
            borderBottomLeftRadius: "10px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <CheckCircleRounded sx={{ color: "white", fontSize: "14px" }} />
          <Typography
            sx={{
              color: "white",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            ENROLLED
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      <Stack padding="20px" gap="16px" flex={1}>
        {/* Icon Section */}
        <Stack
          sx={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            backgroundColor: isSelected
              ? "var(--primary-color)"
              : "rgba(24, 113, 99, 0.08)",
            border: isSelected
              ? "none"
              : "1px solid rgba(24, 113, 99, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
        >
          <Image
            src={getIcon(icon)}
            alt={title}
            width={28}
            height={28}
            style={{
              filter: isSelected ? "brightness(0) invert(1)" : "none",
              transition: "all 0.15s ease",
            }}
          />
        </Stack>

        {/* Title & Description */}
        <Stack gap="8px" flex={1}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text1)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {tagline && (
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: isSelected ? "var(--primary-color)" : "var(--text4)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {tagline}
            </Typography>
          )}

          <Typography
            sx={{
              fontSize: "13px",
              color: "var(--text3)",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description ||
              "Comprehensive learning resources designed to help you achieve your goals with expert-curated courses and study materials."}
          </Typography>
        </Stack>

        {/* Stats Footer */}
        {(coursesCount > 0 || subjectsCount > 0 || blogsCount > 0) && (
          <Stack
            direction="row"
            gap="16px"
            sx={{
              pt: "12px",
              borderTop: "1px solid",
              borderColor: isSelected
                ? "rgba(24, 113, 99, 0.15)"
                : "var(--border-color)",
            }}
          >
            {coursesCount > 0 && (
              <StatBadge
                icon={<SchoolOutlined sx={{ fontSize: "16px" }} />}
                value={coursesCount}
                label="Courses"
                color="var(--primary-color)"
              />
            )}
            {subjectsCount > 0 && (
              <StatBadge
                icon={<MenuBookOutlined sx={{ fontSize: "16px" }} />}
                value={subjectsCount}
                label="Subjects"
                color="var(--sec-color)"
              />
            )}
            {blogsCount > 0 && (
              <StatBadge
                icon={<ArticleOutlined sx={{ fontSize: "16px" }} />}
                value={blogsCount}
                label="Blogs"
                color="#1976D2"
              />
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function StatBadge({ icon, value, label, color }) {
  return (
    <Stack alignItems="center" gap="2px">
      <Stack
        direction="row"
        alignItems="center"
        gap="4px"
        sx={{ color: color }}
      >
        {icon}
        <Typography sx={{ fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>
          {value}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: "10px",
          fontWeight: 600,
          color: "var(--text4)",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
