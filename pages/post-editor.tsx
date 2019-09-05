import Tippy from "@tippy.js/react";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { NextPageContext } from "next";
import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import {
  BackButton,
  Label,
  PageTitle,
  Separator,
  TopLeftContent,
  VerticalSeparator,
} from "../lib/components/common.components";
import { Button } from "../lib/components/form/Button";
import { TextInput } from "../lib/components/form/TextInput";
import { PageLayout } from "../lib/components/PageLayout";
import { ProtectedPage } from "../lib/components/ProtectedPage";
import { PostContainer, PostContent, PostTitle } from "../lib/components/widget/Post.components";
import { AgentContainer } from "../lib/containers/agent.container";
import { getClientConfig } from "../lib/util/client-config";
import { sendToast } from "../lib/util/send-toast";
import { styled } from "../lib/util/styled";
import { Post } from "../shared/data.model";

const Root = styled.div`
  .react-datepicker__input-container,
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const EditContainer = styled.div`
  display: flex;
  > *:first-child {
    width: 435px;
  }
  > *:last-child {
    width: 435px;
  }
  justify-content: space-around;
  min-height: 200px;
  padding-bottom: 20px;
`;

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  outline: none;
  font-size: 16px;
  color: #494e61;
  -webkit-transition: border 0.2s ease;
  transition: border 0.2s ease;
  :focus {
    border: 1px solid ${p => p.theme.colors.primary};
  }
`;

const TopRightContent = styled.div`
  display: flex;
  > *:first-child {
    margin-right: 8px;
  }
`;

let ContentEditor = null;

function useForceUpdate() {
  const [value, set] = useState(true); // boolean state
  return () => set(!value); // toggle the state to force render
}

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Values {
  content: string;
  title: string;
  scheduledDate: Date;
}

interface Props {
  post: Post | null;
}

const page = ProtectedPage((props: Props) => {
  const forceUpdate = useForceUpdate();
  const agentContainer = useContext(AgentContainer.Context);

  useEffect(() => {
    import("../lib/components/ContentEditor/ContentEditor").then(mod => {
      ContentEditor = mod.ContentEditor;
      forceUpdate();
    });
  }, []);

  const formik = useRef<Formik>(null);

  function getInitialValues(): Values {
    if (!props.post) {
      return { title: "", content: "", scheduledDate: moment().toDate() };
    }
    return {
      title: props.post.title,
      content: props.post.content,
      scheduledDate:
        moment(props.post.scheduledDate).valueOf() === 0
          ? moment().toDate()
          : moment(props.post.scheduledDate).toDate(),
    };
  }

  const datePickerRef = useRef<any>();

  function extractContent(s: string) {
    const span = document.createElement("span");
    span.innerHTML = s;

    const content = span.textContent || span.innerText;
    return content !== "undefined" ? content : "";
  }

  if (ContentEditor === null || !agentContainer.isLoggedIn) {
    return null;
  }

  return (
    <PageLayout>
      <Formik
        ref={formik}
        initialValues={getInitialValues()}
        validationSchema={yup.object().shape({
          title: yup
            .string()
            .min(1)
            .required(),
          content: yup.string().test("", "Content required", val => extractContent(val).length > 0),
          scheduledDate: yup.date(),
        })}
        onSubmit={(values: Values, form) => {
          form.setSubmitting(true);
          axios
            .post(`${getClientConfig().API_URL}/api/posts/create`, {
              postId: Router.query.postId,
              title: values.title,
              content: values.content,
              scheduledDate: values.scheduledDate,
            })
            .then(() => {
              Router.replace("/announcements");
            })
            .catch(e => {
              alert(e);
            })
            .finally(() => {
              sendToast(toaster => toaster.success({ message: "Post successfully submitted" }));
              form.setSubmitting(false);
            });
        }}
        render={form => (
          <Root>
            <TopContent>
              <TopLeftContent>
                <BackButton style={{ minWidth: 0 }} onClick={() => Router.back()} secondary>
                  Back
                </BackButton>
                <VerticalSeparator />
                <PageTitle>Post Editor</PageTitle>
              </TopLeftContent>
              <TopRightContent>
                <Tippy
                  enabled={agentContainer.dashboard.company.planType !== "growth"}
                  content="Scheduling - Get upgraded plan to unlock">
                  <div>
                    <StyledDatePicker
                      disabled={agentContainer.dashboard.company.planType !== "growth"}
                      ref={datePickerRef}
                      timeFormat="HH:mm"
                      dateFormat="MMMM d, yyyy HH:mm"
                      selected={form.values.scheduledDate}
                      showTimeSelect
                      onChange={date => {
                        form.setFieldValue("scheduledDate", date);
                      }}
                    />
                  </div>
                </Tippy>
                <Button disabled={form.isSubmitting || !form.isValid} onClick={() => form.submitForm()}>
                  {!!Router.query.postId ? "Update" : "Create"}
                </Button>
              </TopRightContent>
            </TopContent>
            <Separator style={{ marginBottom: 20 }} />
            <EditContainer>
              <Form>
                <Label>Title</Label>
                <Field component={TextInput} name="title" autoComplete={false} />
                <Label>Content</Label>
                <ContentEditor
                  {...{
                    onChange: html => form.setFieldValue("content", html),
                    value: form.values.content,
                  } as any}
                />
              </Form>
              <PreviewContainer>
                <Label>Preview</Label>
                <PostContainer style={{ margin: 0 }}>
                  <PostTitle>{form.values.title || "Title"}</PostTitle>
                  <PostContent html={form.values.content || "Content"} />
                </PostContainer>
              </PreviewContainer>
            </EditContainer>
          </Root>
        )}
      />
    </PageLayout>
  );
});

(page as any).getInitialProps = async (context: NextPageContext) => {
  const postId = context.query.postId;
  if (!postId) {
    return { post: null };
  }

  const resp = await axios.get(`${getClientConfig().API_URL}/api/posts/post`, {
    params: { postId: context.query.postId },
  });

  return { post: resp.data };
};

export default page;
