export const theme = {
  colors: {
    black: "#555",
    font: "#494e61",
    lightGray: "#f9f9f9",
    darkGray: "#9598a4",
    gray: "#d2d2d2",
    primary: "#224ca8",
    white: "#FFFFFF",
  },
};

import emotionStyled, { CreateStyled } from "@emotion/styled";

const styled = emotionStyled as CreateStyled<typeof theme>;

export { styled };
