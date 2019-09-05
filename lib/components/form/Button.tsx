import { styled } from "../../util/styled";

export const Button = styled.button<{ disabled?: boolean; secondary?: boolean; warning?: boolean }>`
  background: linear-gradient(57deg, #364bd8 0%, #1f4d96 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  padding: 6px 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  user-select: none;
  min-width: 100px;
  display: inline-block;
  outline: none;


  border: none;
  line-height: 1.5;

  ${p =>
    p.disabled &&
    `
    filter: grayscale(1);
    cursor: initial;  
  `}
  ${p =>
    !p.disabled &&
    `
    :hover {
      filter: brightness(1.1);
      cursor: pointer;
    }
  `}


  ${p =>
    p.secondary &&
    `
    background: transparent;
    box-shadow: none;
    color: ${p.theme.colors.primary};
  `}

`;
