import { createTheme } from "@material-ui/core/styles";
import { teal, red } from "@material-ui/core/colors";

const theme = createTheme({
  palette: {
    secondary: {
      main: teal["500"],
    },
    primary: {
      main: red["600"],
      // light: ''
    },
  },

  overrides: {
    MuiCardContent: {
      root: {
        // padding: 0,
      },
    },
    MuiCardHeader: {
      title: {
        textTransform: "uppercase",
        fontSize: "20px",
        fontWeight: "bold",
        // maxWidth: 200,
      },
    },

    MuiCard: {
      root: {
        // background: secondaryMain,
        // overflow: "visible"
      },
    },
    //Este es el fondo del texto descriptivo del input
    MuiFormLabel: {
      root: {
        background: "transparent",
      },
    },
    //Este es el texto descriptivo del input
    MuiInputLabel: {
      root: {
        color: "black",
      },
    },
    //Esto esta atrás del Outlined Input
    MuiInputBase: {
      root: {
        // width: 120,
      },
    },
    // Este es el fondo del input
    MuiTextField: {
      root: {
        margin: "10px 5px",
      },
    },
    // Este es el input posta
    MuiOutlinedInput: {
      root: {
        color: "black",
        background: "linear-gradient(-45deg, #C3D2FF 0%, transparent 100%)",
        boxShadow: " 2px 2px 1px 1px rgba(0,0,0,0.2)",
      },
    },
  },
});

export default theme;
