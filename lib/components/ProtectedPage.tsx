import axios from "axios";
import Router from "next/router";

declare global {
  interface Window {
    authChecked: boolean;
  }
}

export const ProtectedPage = Component => {
  const oldGetInitialProps = Component.getInitialProps;

  (Component as any).getInitialProps = async ctx => {
    let props = {};
    if (!!oldGetInitialProps) {
      props = await oldGetInitialProps(ctx);
    }
    const { req, res } = ctx;
    if (req && !req.user) {
      res.writeHead(302, {
        Location: "/login",
      });
      res.end();
    }

    if (!req && !window.authChecked) {
      await axios.get("/api/agents/me").catch(() => {
        Router.replace("/login");
      });
      window.authChecked = true;
    }

    return props;
  };
  return Component;
};
