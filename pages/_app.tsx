import "highlight.js/styles/default.css";
import "izitoast/dist/css/iziToast.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-simple-flex-grid/lib/main.css";
import "tippy.js/themes/light.css";

import { css, Global } from "@emotion/core";
import * as Sentry from "@sentry/browser";
import { ThemeProvider } from "emotion-theming";
import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { LoadDashboard } from "../lib/components/LoadDashboard";
import { AgentContainer } from "../lib/containers/agent.container";
import { getClientConfig } from "../lib/util/client-config";
import { theme } from "../lib/util/styled";

if (typeof window !== "undefined") {
  window["__styled-components-init__"] = 2;
}

if (getClientConfig().IS_PROD) {
  Sentry.init({ dsn: "https://2c4b56212189488a9c187d25d739a19c@sentry.io/1516501" });
}

export default class extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta name="viewport" content="initial-scale=0.5, width=1000" />
          <title>NewsFeeder — Get users updated and engaged with our hassle-free newsfeed</title>
        </Head>
        <Container>
          <AgentContainer.Provider>
            <ThemeProvider theme={theme}>
              <>
                <Global
                  styles={css`
                    @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap");

                    html,
                    body,
                    #__next {
                      height: 100%;
                    }

                    body {
                      margin: 0px;
                      font-family: "Open Sans", sans-serif;
                      color: ${theme.colors.font};
                      font-size: 14px;
                    }
                    * {
                      box-sizing: border-box;
                    }
                  `}
                />
                <LoadDashboard>{() => <Component {...pageProps} />}</LoadDashboard>
              </>
            </ThemeProvider>
          </AgentContainer.Provider>
        </Container>
      </>
    );
  }
}
