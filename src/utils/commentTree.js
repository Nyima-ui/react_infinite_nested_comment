
export function toggleReplyingInTree(tree, commentId) {
    return tree.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replying: !comment.replying,
        };
      }
  
      if (comment.replies && comment.replies.length > 0) {
        const updatedReplies = toggleReplyingInTree(comment.replies, commentId);
        if (updatedReplies !== comment.replies) {
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
      }
  
      return comment;
    });
  }


 export function addReplyToTree(tree, parentId, newReply) {
    return tree.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
          replying: false,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        const updatedReplies = addReplyToTree(
          comment.replies,
          parentId,
          newReply
        );
        if (updatedReplies !== comment.replies) {
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
      }
      return comment;
    });
  }

  export function toggleEditingInTree(tree, commentId) {
    return tree.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          editing: !comment.editing,
        };
      }
  
      if (comment.replies && comment.replies.length > 0) {
        const updatedReplies = toggleEditingInTree(comment.replies, commentId);
        if (updatedReplies !== comment.replies) {
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
      }
  
      return comment;
    });
  }



  export const editCommentToTree = (comments, commentId, newText) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          text: newText,
          editing: false, 
        };
      }
  
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: editCommentToTree(comment.replies, commentId, newText),
        };
      }
  
      return comment;
    });
  };
  