import axios from "axios";
import Router from "next/router";
import React, { useRef, useState } from "react";
import { CardElement, Elements, injectStripe, StripeProvider } from "react-stripe-elements";
import { AbsoluteLoader } from "../lib/components/AbsoluteLoader";
import { Label, PageTitle, Separator, TopContent } from "../lib/components/common.components";
import { Button } from "../lib/components/form/Button";
import { OptionalRender } from "../lib/components/OptionalRender";
import { PageLayout } from "../lib/components/PageLayout";
import { ProtectedPage } from "../lib/components/ProtectedPage";
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
  margin-top: 80px;
  margin-bottom: 80px;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  position: relative;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  > * {
    margin-left: 8px;
  }
  margin-top: 16px;
`;

const BillItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Explanation = styled.div`
  font-size: 12px;
  color: #a2a2a2;
  margin-bottom: 32px;
`;

const StyledCardElement = styled(CardElement)`
  display: block;
  padding: 10px 14px;
  font-size: 1em;
  font-family: "Source Code Pro", monospace;
  box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
  border: 0;
  outline: 0;
  border-radius: 4px;
  background: white;
`;

const Page = injectStripe(props => {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  async function buy() {
    try {
      setLoading(true);
      const { token } = await props.stripe.createToken();
      await axios.post("/api/agents/purchase-subscription", { token });
      sendToast(toaster => toaster.success({ message: "Subscription upgraded" }));
      Router.replace("/account");
    } catch (error) {
      sendToast(toaster => toaster.error({ message: "Something went wrong with subscription payment" }));
      Router.replace("/announcements");
    }
  }

  return (
    <PageLayout fullWidth>
      <Background />
      <Root>
        <FormContainer>
          <OptionalRender shouldRender={loading}>
            <AbsoluteLoader />
          </OptionalRender>
          <TopContent>
            <PageTitle>Payment</PageTitle>
          </TopContent>
          <Separator style={{ marginBottom: 20 }} />

          <BillItem>
            <div>
              <b>Growth</b> plan subscription
            </div>
            <div>$35/Month</div>
          </BillItem>
          <Explanation>Subscriptions can be changed/canceled at any time without any charges</Explanation>

          <Separator style={{ marginBottom: 20 }} />
          <Label>Card Details</Label>
          <StyledCardElement
            onChange={e => setValid(e.complete)}
            hidePostalCode
            style={{
              base: {
                fontSize: "18px",
                color: "#424770",
                letterSpacing: "0.025em",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            }}
          />

          <Buttons>
            <Button secondary onClick={() => Router.back()}>
              Cancel
            </Button>
            <Button disabled={!valid} onClick={buy}>
              Confirm
            </Button>
          </Buttons>
        </FormContainer>
      </Root>
    </PageLayout>
  );
});

export default ProtectedPage(() => (
  <StripeProvider apiKey={getClientConfig().STRIPE_PK}>
    <Elements>
      <Page />
    </Elements>
  </StripeProvider>
));
