import axios, { AxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import throttle from "lodash/throttle";
import Link from "next/link";
import Router from "next/router";
import { Button } from "../lib/components/form/Button";
import { SimpleLink } from "../lib/components/SimpleLink";
import { getClientConfig } from "../lib/util/client-config";
import { sendToast } from "../lib/util/send-toast";
import { styled } from "../lib/util/styled";

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  right: 0;
  height: 100%;
  background-color: ${p => p.theme.colors.lightGray};
  z-index: -1;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${p => p.theme.colors.font};
`;

const FormContainer = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 8px;
  padding: 32px 46px;
  margin-top: 40px;
  margin-bottom: 80px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  border: 2px solid #ddd;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
  outline: none;
  padding: 12px;
  height: 50px;
  display: block;
  :focus {
    border: 2px solid ${p => p.theme.colors.primary};
  }
  transition: all 0.2s ease;
`;

const Label = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  height: 35px;
  margin-right: 24px;
  cursor: pointer;
  margin-top: 100px;
`;

interface Values {
  email: string;
  password: string;
}

const Login = () => {
  const showError = throttle(message => {
    sendToast(toaster => toaster.error({ message }));
  }, 1000);

  return (
    <>
      <Background />
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values: Values) => {
          axios
            .post(
              `${getClientConfig().API_URL}/api/agents/login`,
              {
                email: values.email,
                password: values.password,
              },
              {
                withCredentials: true,
              },
            )
            .then(() => {
              Router.push("/announcements");
            })
            .catch((resp: AxiosError) => {
              if (!!resp.response.data.message) {
                showError(resp.response.data.message);
              }
            });
        }}
        render={({}) => (
          <Root>
            <Logo src="/static/logo-blue.svg" alt="" />

            <FormContainer>
              <Title>Login</Title>
              <Form>
                <Label>Email</Label>
                <Field name="email" render={({ field }) => <Input {...field} />} />
                <Label>Password</Label>
                <Field name="password" render={({ field }) => <Input type="password" {...field} />} />
                <p style={{ fontSize: 12 }}>
                  Dont have an account?{" "}
                  <Link href="/register">
                    <SimpleLink>Register</SimpleLink>
                  </Link>
                </p>
                <Button style={{ marginTop: 8 }} type="submit">
                  {" "}
                  Login
                </Button>
              </Form>
            </FormContainer>
          </Root>
        )}
      />
    </>
  );
};

(Login as any).getInitialProps = ctx => {
  const { req, res } = ctx;
  if (req && !!req.user) {
    res.writeHead(302, {
      Location: "/announcements",
    });
    res.end();
  }
  if (!req) {
    axios
      .get("/api/agents/me")
      .then(() => {
        Router.replace("/announcements");
      })
      .catch(() => null);
  }
};

export default Login;
