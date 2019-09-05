import { styled } from "../util/styled";
import { Button } from "./form/Button";

export const PageTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 25px;
  margin-top: 25px;
  font-weight: 600;
  color: ${p => p.theme.colors.font};
`;

export const Separator = styled.div`
  height: 1px;
  background-color: ${p => p.theme.colors.gray};
`;

export const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const TopLeftContent = styled.div`
  display: flex;
  align-items: center;
`;

export const BackButton = styled(Button)`
  font-size: 20px;
  font-weight: 600;
  padding-left: 0;
`;

export const VerticalSeparator = styled.div`
  margin-right: 12px;
  border-right: 1px solid ${p => p.theme.colors.gray};
  height: 20px;
`;
