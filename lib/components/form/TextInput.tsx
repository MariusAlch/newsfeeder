import { ErrorMessage, FieldProps } from "formik";
import * as React from "react";
import { styled } from "../../util/styled";
import { OptionalRender } from "../OptionalRender";

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  outline: none;
  font-size: 16px;
  color: ${p => p.theme.colors.font};
  :focus {
    border: 1px solid ${p => p.theme.colors.primary};
  }
  transition: border 0.2s ease;
`;

const Label = styled.div`
  color: ${p => p.theme.colors.primary};
  display: block;
  cursor: default;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  padding-right: 8px;
`;

const Error = styled(ErrorMessage)`
  color: ${p => p.theme.colors.primary};
  font-size: 14px;
  text-align: right;
` as any;

const Root = styled.div`
  margin-bottom: 8px;
`;

const TopPart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

type Props = Partial<FieldProps> & {
  label: string;
  fullWidth?: boolean;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: boolean;
};

export class TextInput extends React.Component<Props> {
  render() {
    const { label, field, type = "text", disabled, placeholder, autoComplete = true } = this.props;
    return (
      <Root>
        <OptionalRender shouldRender={!!label}>
          <TopPart>
            <Label>{label}</Label>
            <div>
              <OptionalRender shouldRender={!!field.name}>
                <Error name={field.name} component="div" />
              </OptionalRender>
            </div>
          </TopPart>
        </OptionalRender>

        <Input
          autoComplete={autoComplete ? "on" : "off"}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          {...field}
        />
      </Root>
    );
  }
}
