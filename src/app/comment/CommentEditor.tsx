"use client";

import { TextArea } from "@/app/(ui)/form/TextArea";
import { SubmitButton } from "@/app/(ui)/button/SubmitButton";
import { Button } from "@/app/(ui)/button/Button";
import {
  createCommentAction,
  editCommentAction,
} from "@/app/comment/commentActions";
import classNames from "classnames";
import { CommentView } from "lemmy-js-client";

type BaseProps = {
  className?: string;
  onCancel?(): void;
};

export type NewCommentProps = BaseProps & {
  postId: number;
  parentId?: number;
  onSubmit?(newComment: CommentView): void;
};
export type EditCommentProps = BaseProps & {
  commentId: number;
  initialContent: string;
  onCancel(): void;
  onSubmit(newContent: string): void;
};

type Props = NewCommentProps | EditCommentProps;
export const CommentEditor = (props: Props) => {
  return (
    <div className={classNames("mb-2 max-w-[700px]", props.className)}>
      <form
        action={async (formData: FormData) => {
          const newComment = isNewComment(props);

          !newComment &&
            props.onSubmit(formData.get("content")?.toString() ?? "");

          const action = newComment
            ? createCommentAction.bind(null, props.postId, props.parentId)
            : editCommentAction.bind(null, props.commentId);
          const commentView = await action(formData);

          newComment && props.onSubmit && props.onSubmit(commentView);
        }}
      >
        <TextArea
          className={"mb-2 mt-4 h-32"}
          required={true}
          id={"content"}
          name={"content"}
          defaultValue={isNewComment(props) ? undefined : props.initialContent}
        ></TextArea>
        <div className="flex justify-end gap-2">
          {props.onCancel && (
            <Button size={"xs"} onClick={props.onCancel}>
              Cancel
            </Button>
          )}
          <SubmitButton size={"xs"} color={"primary"}>
            Submit
          </SubmitButton>
        </div>
      </form>
    </div>
  );
};

const isNewComment = (props: Props): props is NewCommentProps => {
  const editingCommentId = (props as EditCommentProps).commentId;
  return editingCommentId === undefined;
};
