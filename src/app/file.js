
let deferredPrompt;
//   useEffect(() => {
//     window.addEventListener("beforeinstallprompt", (e) => {
//       e.preventDefault();
//       deferredPrompt = e;
//     });
//   }, []);

// onClick={() => {
    //         deferredPrompt.prompt();
    //         deferredPrompt.userChoice.then((choiceResult) => {
    //           if (choiceResult.outcome === "accepted") {
    //             console.log("User accepted the install prompt");
    //           } else {
    //             console.log("User dismissed the install prompt");
    //           }
    //         });
    //       }}

    
    // snackbar componet 
    // const { enqueueSnackbar } = useSnackbar();
    //   const handleClickVariant = (variant) => () => {
    //     enqueueSnackbar("This is a success message!", { variant });
    //   };
    // <Button
    //     variant="contained"
    //     sx={{ textTransform: "none", margin: "10px" }}
    //     onClick={handleClickVariant("success")}
    //   >
    //     variant snackbar
    //   </Button>