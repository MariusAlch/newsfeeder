import * as React from "react";

interface Props {
  shouldRender: boolean | (() => boolean);
}

export class OptionalRender extends React.Component<Props> {
  render() {
    const { shouldRender, children } = this.props;

    const willRender = typeof shouldRender === "function" ? shouldRender() : shouldRender;

    return willRender ? typeof children === "function" ? <>{(children as (() => void))()}</> : <>{children}</> : null;
  }
}
