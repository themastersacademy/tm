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
        minHeight: "280px",
        borderRadius: "20px",
        background: isSelected
          ? "linear-gradient(135deg, #EBF4FF 0%, #FFFFFF 100%)"
          : "var(--white)",
        border: `3px solid ${
          isSelected ? "var(--primary-color)" : "var(--border-color)"
        }`,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "var(--primary-color)",
          transform: "translateY(-6px) scale(1.02)",
          boxShadow: isSelected
            ? "0 20px 40px rgba(33, 150, 243, 0.2)"
            : "0 20px 40px rgba(0,0,0,0.08)",
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
            background:
              "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
            borderBottomLeftRadius: "16px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
          }}
        >
          <CheckCircleRounded sx={{ color: "white", fontSize: "18px" }} />
          <Typography
            sx={{
              color: "white",
              fontSize: "12px",
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
            background: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
            borderBottomLeftRadius: "16px",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
          }}
        >
          <CheckCircleRounded sx={{ color: "white", fontSize: "18px" }} />
          <Typography
            sx={{
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            ENROLLED
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      <Stack padding="28px" gap="20px" flex={1}>
        {/* Icon Section */}
        <Stack
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            background: isSelected
              ? "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)"
              : "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isSelected
              ? "0 8px 20px rgba(33, 150, 243, 0.25)"
              : "0 4px 12px rgba(0,0,0,0.06)",
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src={getIcon(icon)}
            alt={title}
            width={44}
            height={44}
            style={{
              filter: isSelected ? "brightness(0) invert(1)" : "none",
              transition: "all 0.3s",
            }}
          />
        </Stack>

        {/* Title & Description */}
        <Stack gap="10px" flex={1}>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--text1)",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </Typography>

          {tagline && (
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: isSelected ? "var(--primary-color)" : "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {tagline}
            </Typography>
          )}

          <Typography
            sx={{
              fontSize: "14px",
              color: "var(--text2)",
              lineHeight: 1.6,
              mt: 0.5,
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
            gap="20px"
            sx={{
              pt: 2,
              borderTop: "2px solid",
              borderColor: isSelected
                ? "rgba(33, 150, 243, 0.15)"
                : "var(--border-color)",
            }}
          >
            {coursesCount > 0 && (
              <StatBadge
                icon={<SchoolOutlined sx={{ fontSize: "18px" }} />}
                value={coursesCount}
                label="Courses"
                color="var(--primary-color)"
              />
            )}
            {subjectsCount > 0 && (
              <StatBadge
                icon={<MenuBookOutlined sx={{ fontSize: "18px" }} />}
                value={subjectsCount}
                label="Subjects"
                color="var(--sec-color)"
              />
            )}
            {blogsCount > 0 && (
              <StatBadge
                icon={<ArticleOutlined sx={{ fontSize: "18px" }} />}
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
    <Stack alignItems="center" gap="4px">
      <Stack
        direction="row"
        alignItems="center"
        gap="6px"
        sx={{ color: color }}
      >
        {icon}
        <Typography sx={{ fontSize: "20px", fontWeight: 800, lineHeight: 1 }}>
          {value}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
