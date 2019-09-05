import { ErrorMessage, FieldProps } from "formik";
import * as React from "react";
import { styled } from "../../util/styled";
import { OptionalRender } from "../OptionalRender";

const TextAreaInput = styled.textarea`
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
  width: 100%;
  outline: none;
  font-size: 16px;
  color: ${p => p.theme.colors.primary};
  :focus {
    border: 2px solid ${p => p.theme.colors.primary};
  }
  transition: border 0.2s ease;
`;

const Label = styled.div`
  color: ${p => p.theme.colors.primary};
  display: block;
  border: 0 solid #ddd;
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
  margin-bottom: 10px;
`;

const TopPart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

type Props = Partial<FieldProps> & {
  label: string;
};
export class TextArea extends React.Component<Props> {
  render() {
    const { label = "Provide a label", field } = this.props;
    return (
      <Root>
        <TopPart>
          <Label>{label}</Label>
          <div>
            <OptionalRender shouldRender={!!field.name}>
              <Error name={field.name} component="div" />
            </OptionalRender>
          </div>
        </TopPart>
        <TextAreaInput rows={4} {...field} />
      </Root>
    );
  }
}
