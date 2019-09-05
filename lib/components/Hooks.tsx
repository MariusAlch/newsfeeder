import * as React from "react";

interface Props {
  onUpdate?: () => void;
  onMount?: () => void;
  onUnmount?: () => void;
}

export class Hooks extends React.Component<Props> {
  componentDidUpdate() {
    const { onUpdate } = this.props;
    if (!!onUpdate) {
      this.props.onUpdate();
    }
  }

  componentDidMount() {
    const { onMount } = this.props;
    if (!!onMount) {
      this.props.onMount();
    }
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;
    if (!!onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    return null;
  }
}
