"use client";
import { ArrowBack, East } from "@mui/icons-material";
import {
  Button,
  Stack,
  SwipeableDrawer,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Global } from "@emotion/react";

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: "var(--border-color)",
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: "var(--border-color)",
  }),
}));

const drawerBleeding = 56;

export default function MobileSectionDraw(props) {
  const {
    window,
    children,
    handleOnPreviousQuestion,
    handleOnNextQuestion,
    questionState,
  } = props;

  const [open, setOpen] = useState(false);
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  return (
    <Stack
      sx={{
        minHeight: "60px",
        width: "100%",
        marginTop: "auto",
      }}
    >
      <Stack
        flexDirection="row"
        sx={{
          display: { xs: "none", md: "flex" },
        }}
      >
        <CssBaseline />
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
              pointerEvents: "all",
            },
          }}
        />
      </Stack>
      <Stack>
        <SwipeableDrawer
          container={container}
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          anchor="bottom"
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          sx={{ display: { xs: "flex", md: "none" } }}
          keepMounted
          ModalProps={{
            BackdropProps: {
              style: { backgroundColor: "transparent" },
            },
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: -drawerBleeding,
              visibility: "visible",
              bgcolor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              visibility: "visible",
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              padding="0 20px"
              pb="10px"
              sx={{ marginTop: "20px", gap: "25px" }}
            >
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                sx={{
                  width: "80px",
                  height: "30px",
                  textTransform: "none",
                  pointerEvents: "auto",
                  color: "var(--primary-color)",
                }}
                onClick={handleOnPreviousQuestion}
                disabled={
                  questionState.selectedQuestionIndex === 0 &&
                  questionState.selectedSectionIndex === 0
                }
              >
                Previous
              </Button>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "18px",
                  color: "var(--sec-color)",
                }}
              >
                Sections
              </Typography>
              <Button
                variant="text"
                endIcon={<East />}
                onClick={handleOnNextQuestion}
                sx={{
                  width: "80px",
                  height: "30px",
                  textTransform: "none",
                  pointerEvents: "auto",
                  color: "var(--primary-color)",
                }}
                disabled={
                  questionState?.sectionViseQuestionCount?.length ===
                    questionState?.selectedSectionIndex + 1 &&
                  questionState?.sectionViseQuestionCount[
                    questionState?.selectedSectionIndex
                  ] ===
                    questionState?.selectedQuestionIndex + 1
                }
              >
                Next
              </Button>
            </Stack>
            <Stack
              padding="20px 30px"
              gap="10px"
              width="100%"
              overflow="auto"
              sx={{
                marginBottom: "10px",
              }}
            >
              {children}
            </Stack>
          </Stack>
        </SwipeableDrawer>
      </Stack>
    </Stack>
  );
}
