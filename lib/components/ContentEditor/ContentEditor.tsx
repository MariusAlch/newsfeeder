import axios, { AxiosError, AxiosResponse } from "axios";
import Delta from "quill-delta";
import quillEmoji from "quill-emoji";
import MagicUrl from "quill-magic-url";
import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import { getClientConfig } from "../../util/client-config";
import { sendToast } from "../../util/send-toast";
import { styled } from "../../util/styled";
import { postContentCSS } from "../widget/Post.components";

import "react-quill/dist/quill.snow.css";
import "./emojis.css";

const { EmojiBlot, ShortNameEmoji, ToolbarEmoji } = quillEmoji;

Quill.register("modules/magicUrl", MagicUrl);
Quill.register(
  {
    "formats/emoji": EmojiBlot,
    "modules/emoji-shortname": ShortNameEmoji,
    "modules/emoji-toolbar": ToolbarEmoji,
  },
  true,
);

const StyledQuill = styled(ReactQuill)`
  height: 395px;
  margin-bottom: 50px;

  .ql-container {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .ql-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .ql-editor {
    ${postContentCSS}
  }
`;

interface Props {
  onChange(content: string): void;
  value: string;
}

export const ContentEditor: React.FunctionComponent<Props> = props => {
  const ref = useRef<ReactQuill>();

  useEffect(() => {
    const editor = ref.current.getEditor();
    editor.getModule("toolbar").addHandler("image", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const formData = new FormData();

        if (!input.files[0].type.startsWith("image")) {
          return alert("Only image file types allowed");
        }

        formData.append("image", input.files[0]);
        const resp = (await axios
          .post("/api/posts/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .catch((err: AxiosError) => {
            if (err.response.data && err.response.data.message) {
              sendToast(toaster => toaster.error({ message: err.response.data.message }));
            }
            return null;
          })) as AxiosResponse;

        if (resp === null) {
          return;
        }

        const selection = editor.getSelection();

        const delta = new Delta()
          .retain(selection.index + 1)
          .delete(selection.length)
          .insert({ image: getClientConfig().API_URL + resp.data }, { width: "100%" });

        editor.updateContents(delta as any);
      };
      input.click();
    });
  });

  return (
    <StyledQuill
      ref={ref}
      value={props.value}
      onChange={html => {
        const editor = ref.current && ref.current.getEditor();
        if (!editor) {
          return;
        }

        const needsFixing =
          editor.getContents().filter(op => op.insert && op.insert.video && !op.attributes).length > 0;

        if (needsFixing) {
          const contents = editor.getContents();
          contents.forEach(op => {
            if (op.insert && op.insert.video && !op.attributes) {
              op.attributes = {
                width: "100%",
                height: "250px",
                allowfullscreen: "true",
                class: "ql-video",
                frameborder: "0",
              };
            }
          });

          setTimeout(() => {
            editor.setContents(contents);
          });
        }
        props.onChange(html);
      }}
      modules={{
        magicUrl: true,
        "emoji-toolbar": true,
        "emoji-shortname": true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "strike"], // toggled buttons
          ["emoji", "link", "image", "video"],
          ["clean"],
        ],
      }}
    />
  );
};
