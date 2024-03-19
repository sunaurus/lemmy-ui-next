import { CommentView } from "lemmy-js-client";

export type CommentNode = {
  commentView: CommentView;
  children: CommentNode[];
  parent: CommentNode | null;
};

export const buildCommentTrees = (
  comments: CommentView[],
  rootNode?: CommentNode,
): CommentNode[] => {
  const commentNodeMap = new Map<string, CommentNode>();
  const topLevelNodes = [];

  for (const commentView of comments) {
    const path = commentView.comment.path.split(".");
    const commentId = path[path.length - 1];
    const parentId = path[path.length - 2];
    let parentNode = null;
    if (rootNode) {
      if (String(rootNode.commentView.comment.id) == parentId) {
        parentNode = rootNode;
      }
    } else if (parentId !== "0") {
      parentNode = commentNodeMap.get(parentId) ?? null;
    }

    const commentNode =
      rootNode && parentId === "0"
        ? rootNode
        : {
            commentView,
            children: [],
            parent: parentNode,
          };

    if (parentNode) {
      parentNode.children.push(commentNode);
    }

    if (!parentNode) {
      topLevelNodes.push(commentNode);
    }

    commentNodeMap.set(commentId, commentNode);
  }

  return topLevelNodes;
};
