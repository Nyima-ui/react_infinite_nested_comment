function updateCommentTree(tree, matchFn, updateFn) {
  return tree.map((comment) => {
    if (matchFn(comment)) {
      return updateFn(comment);
    }
    if (comment.replies?.length) {
      const updatedReplies = updateCommentTree(
        comment.replies,
        matchFn,
        updateFn
      );
      if (updatedReplies !== comment.replies) {
        return { ...comment, replies: updatedReplies };
      }
    }

    return comment;
  });
}

export const toggleReplyingInTree = (tree, commentId) => 
  updateCommentTree(
    tree,
    (comment) => comment.id === commentId,
    (comment) => ({ ...comment, replying: !comment.replying })
  );

export const addReplyToTree = (tree, parentId, newReply) => 
  updateCommentTree(
    tree,
    (comment) => comment.id === parentId,
    (comment) => ({
      ...comment,
      replies: [...comment.replies, newReply],
      replying: false,
    })
  );

export const toggleEditingInTree = (tree, commentId) =>
  updateCommentTree(
    tree,
    (comment) => comment.id === commentId,
    (comment) => ({ ...comment, editing: !comment.editing })
  );

export const editCommentToTree = (tree, commentId, newText) =>
  updateCommentTree(
    tree,
    (comment) => comment.id === commentId,
    (comment) => ({
      ...comment,
      text: newText,
      editing: false,
    })
  );

