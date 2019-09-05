import Document, { Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="icon" href="/static/favicon.png" />
          <meta name="description" content="Get users updated and engaged with our hassle-free newsfeed" />
          <script src="https://js.stripe.com/v3/" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-97872528-5" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if (!location.host.includes("localhost")) {
                window.dataLayer = window.dataLayer || [];
                function gtag() {
                  dataLayer.push(arguments);
                }
                gtag("js", new Date());
                gtag("config", "UA-97872528-5");
              }
              `,
            }}
          />
          {/* {this.props.styleTags} */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
