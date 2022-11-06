import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = {
  body: `'Noto Sans Thai', sans-serif`,
}

const theme = extendTheme({
  config,
  fonts,
});

export default theme;
