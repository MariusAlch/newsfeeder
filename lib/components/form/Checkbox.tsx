import { styled } from "../../util/styled";
import { OptionalRender } from "../OptionalRender";

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
`;

const Outer = styled.div<{ checked: boolean }>`
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid ${p => (p.checked ? p.theme.colors.primary : p.theme.colors.gray)};
`;

const Inner = styled.div`
  background-color: inherit;
  margin-top: 3px;
  margin-left: 3px;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${p => p.theme.colors.primary};
`;

const Label = styled.div`
  margin-left: 4px;
`;

export const Checkbox: React.FunctionComponent<{
  onClick?: () => void;
  checked?: boolean;
}> = props => {
  return (
    <Root onClick={props.onClick}>
      <Outer checked={props.checked}>
        <OptionalRender shouldRender={props.checked}>
          <Inner />
        </OptionalRender>
      </Outer>
      <OptionalRender shouldRender={!!props.children}>
        <Label>{props.children}</Label>
      </OptionalRender>
    </Root>
  );
};
