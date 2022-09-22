import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
  fonts: {
    body: `"Mitr", sans-serif`,
  },
};

const theme = extendTheme({
  config,
});

export default theme;
