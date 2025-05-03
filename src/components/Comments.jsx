import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toggleReplyingInTree, addReplyToTree } from "../utils/commentTree";

const Comment = ({ comment, setCommentsData, replyInputs, setReplyInputs }) => {
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (comment.replying && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [comment.replying]);

  const handleReplying = (commentId) => {
    setCommentsData((prev) => toggleReplyingInTree(prev, commentId));
  };

  const handleReplyChange = (commentId, text) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleCancelReply = (commentId) => {
    setCommentsData((prev) => toggleReplyingInTree(prev, commentId));

    setReplyInputs((prev) => {
      const newState = { ...prev };
      delete newState[commentId];
      return newState;
    });
  };

  const handleSubmitReply = (parentId, e) => {
    e.preventDefault();
    const replyText = replyInputs[parentId];
    if (!replyText || !replyText.trim()) return;

    const newReply = {
      id: uuidv4(),
      parentId: parentId,
      text: replyText,
      replies: [],
      replying: false,
    };

    setCommentsData((prev) => addReplyToTree(prev, parentId, newReply));

    setReplyInputs((prev) => {
      const newState = { ...prev };
      delete newState[parentId];
      return newState;
    });
  };
  return (
    <article key={comment.id} className="ml-10 my-2 border">
      <div className="bg-zinc-300  max-w-xs px-5 py-2 rounded-md">
        <p>{comment.text}</p>
        <div className="text-sm space-x-3 mt-3">
          <button
            className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
            onClick={() => handleReplying(comment.id)}
          >
            <i
              className="bi bi-triangle-fill text-xs mx-1 text-black transform inline-block"
              style={{
                transform: comment.replying ? "rotate(180deg)" : "rotate(0deg)",
              }}
            ></i>
            REPLY
          </button>
          <button className="text-gray-500 font-bold cursor-pointer hover:text-gray-600">
            EDIT
          </button>
          <button className="text-gray-500 font-bold cursor-pointer hover:text-gray-600">
            DELETE
          </button>
        </div>
      </div>
      {comment.replying && (
        <form
          className="mt-2 ml-10"
          onSubmit={(e) => handleSubmitReply(comment.id, e)}
        >
          <input
            placeholder="Reply"
            className="bg-zinc-200 rounded-sm py-1 px-1.5 focus:outline-1"
            onChange={(e) => handleReplyChange(comment.id, e.target.value)}
            value={replyInputs[comment.id] ?? ""}
            ref={replyInputRef}
          ></input>
          <div className="text-sm space-x-2 inline mx-2">
            <button
              className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
              onClick={(e) => handleSubmitReply(comment.id, e)}
            >
              REPLY
            </button>
            <button
              className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
              onClick={() => handleCancelReply(comment.id)}
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          <Comments
            setCommentsData={setCommentsData}
            commentsData={comment.replies}
            replyInputs={replyInputs}
            setReplyInputs={setReplyInputs}
          />
        </div>
      )}
    </article>
  );
};

const Comments = ({
  setCommentsData,
  commentsData,
  replyInputs,
  setReplyInputs,
}) => {
  return (
    <>
      {commentsData.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            setCommentsData={setCommentsData}
            replyInputs={replyInputs}
            setReplyInputs={setReplyInputs}
          />
        );
      })}
    </>
  );
};

export default Comments;
