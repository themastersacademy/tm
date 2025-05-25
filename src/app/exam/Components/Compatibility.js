import { useEffect, useState } from "react";
import { Verified, ErrorOutline } from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/material";
import { Typography } from "antd";

export default function Compatibility() {
  const [browserCompatible, setBrowserCompatible] = useState(false);
  const [deviceCompatible, setDeviceCompatible] = useState(false);
  const [internetCompatible, setInternetCompatible] = useState(false);

  useEffect(() => {
    // ===== Browser Compatibility =====
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let isSupportedBrowser = false;

    if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) {
      browserName = "Chrome";
      isSupportedBrowser = true;
    } else if (ua.includes("Firefox")) {
      browserName = "Firefox";
      isSupportedBrowser = true;
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browserName = "Safari";
      isSupportedBrowser = true;
    } else if (ua.includes("Edg")) {
      browserName = "Edge";
      isSupportedBrowser = true;
    }

    setBrowserCompatible(isSupportedBrowser);

    // ===== Device Compatibility =====
    const isMobile =
      /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(ua);
    const isDesktop = !isMobile && !isTablet;

    const isSupportedDevice = isMobile || isTablet || isDesktop;
    setDeviceCompatible(isSupportedDevice);

    // ===== Internet Compatibility =====
    const conn = navigator.connection;
    const effectiveType = conn?.effectiveType || "unknown";
    const downlink = conn?.downlink || 1.5;
    const online = navigator.onLine;

    const isFastConnection = effectiveType === "4g" && downlink >= 1.5;
    const isInternetOk = online && isFastConnection;

    setInternetCompatible(isInternetOk);
  }, []);

  const renderStatus = (status, label) => (
    <Stack flexDirection="row" gap="10px" alignItems="center">
      {status ? (
        <Verified sx={{ color: "var(--primary-color)" }} />
      ) : (
        <ErrorOutline sx={{ color: "red" }} />
      )}
      <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
        {label}
      </Typography>
    </Stack>
  );

  return (
    <Stack>
      <Stack
        flexDirection={{ xs: "column", md: "row" }}
        gap="15px"
        alignItems="center"
      >
        {/* Browser Compatibility with CircularProgress */}
        <Stack flexDirection="row" gap="10px" alignItems="center">
          <CircularProgress
            size={14}
            variant="determinate"
            value={browserCompatible ? 100 : 0}
            sx={{
              color: browserCompatible ? "var(--primary-color)" : "red",
            }}
          />
          <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
            Browser Compatibility
          </Typography>
        </Stack>

        {/* Device Compatibility */}
        {renderStatus(deviceCompatible, "Device Compatibility")}

        {/* Internet Compatibility */}
        {renderStatus(internetCompatible, "Internet Compatibility")}
      </Stack>
    </Stack>
  );
}
