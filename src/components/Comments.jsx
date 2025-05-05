import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  toggleReplyingInTree,
  addReplyToTree,
  toggleEditingInTree,
  editCommentToTree,
} from "../utils/commentTree";

const Comment = ({ comment, setCommentsData }) => {
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  const [inputValues, setInputValues] = useState({
    reply: {},
    edit: {},
  });

  const handleInputChange = (type, id, value) => {
    setInputValues((prev) => ({
      ...prev,
      [type]: { ...prev[type], [id]: value },
    }));
  };

  const clearInputState = (type, id) => {
    setInputValues((prev) => {
      const newState = { ...prev };
      delete newState[type][id];
      return newState;
    });
  };

  const useAutoFocus = (ref, condition) => {
    useEffect(() => {
      if (condition && ref.current) ref.current.focus();
    }, [condition, ref]);
  };
  useAutoFocus(replyInputRef, comment.replying);
  useAutoFocus(editInputRef, comment.editing);

  const handleReplyingAndEditing = (type, commentId) => {
    if (type === "reply")
      setCommentsData((prev) => toggleReplyingInTree(prev, commentId));
    else setCommentsData((prev) => toggleEditingInTree(prev, commentId));
  };

  const handleCancel = (type, commentId) => {
    if (type === "reply") {
      setCommentsData((prev) => toggleReplyingInTree(prev, commentId));
      clearInputState("reply", commentId);
    } else {
      setCommentsData((prev) => toggleEditingInTree(prev, commentId));
      clearInputState("edit", commentId);
    }
  };

  const handleSubmit = (type, id, e, commentText) => {
    e.preventDefault();
    let text = inputValues[type]?.[id]?.trim() || commentText;
    if (!text) return;

    if (type === "reply") {
      const newReply = {
        id: uuidv4(),
        parentId: id,
        text,
        replies: [],
        replying: false,
        editing: false,
      };

      setCommentsData((prev) => addReplyToTree(prev, id, newReply));
    } else {
      setCommentsData((prev) => editCommentToTree(prev, id, text));
    }
    clearInputState(type, id);
  };

  return (
    <article key={comment.id} className="ml-10 my-2 border">
      <div className="bg-zinc-300  max-w-xs px-5 py-2 rounded-md">
        {comment.editing ? (
          <form>
            <input
              value={
                inputValues.edit[comment.id] !== undefined
                  ? inputValues.edit[comment.id]
                  : comment.text
              }
              onChange={(e) =>
                handleInputChange("edit", comment.id, e.target.value)
              }
              ref={editInputRef}
              className="focus:outline-1 pl-1 rounded-sm py-0.5"
              required
            />
            <div className="text-sm space-x-3 mt-3">
              <button
                className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
                type="submit"
                onClick={(e) =>
                  handleSubmit("edit", comment.id, e, comment.text)
                }
              >
                SAVE
              </button>
              <button
                className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
                onClick={() => handleCancel("edit", comment.id)}
              >
                CANCEL
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>{comment.text}</p>
            <div className="text-sm space-x-3 mt-3">
              <button
                className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
                onClick={() => handleReplyingAndEditing("reply", comment.id)}
              >
                <i
                  className="bi bi-triangle-fill text-xs mx-1 text-black transform inline-block"
                  style={{
                    transform: comment.replying
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                ></i>
                REPLY
              </button>
              <button
                className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
                onClick={() => handleReplyingAndEditing("edit", comment.id)}
              >
                EDIT
              </button>
              <button className="text-gray-500 font-bold cursor-pointer hover:text-gray-600">
                DELETE
              </button>
            </div>
          </>
        )}
      </div>

      {comment.replying && (
        <form
          className="mt-2 ml-10"
          onSubmit={(e) => handleSubmit("reply", comment.id, e)}
        >
          <input
            placeholder="Reply"
            className="bg-zinc-200 rounded-sm py-1 px-1.5 focus:outline-1"
            onChange={(e) =>
              handleInputChange("reply", comment.id, e.target.value)
            }
            value={inputValues.reply[comment.id] ?? ""}
            ref={replyInputRef}
          ></input>
          <div className="text-sm space-x-2 inline mx-2">
            <button
              className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
              onClick={(e) => handleSubmit("reply", comment.id, e)}
            >
              REPLY
            </button>
            <button
              className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
              onClick={() => handleCancel("reply", comment.id)}
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
          />
        </div>
      )}
    </article>
  );
};

const Comments = ({ setCommentsData, commentsData }) => {
  return (
    <>
      {commentsData.map((comment) => {
        return (
          <Comment
            key={comment.id}
            comment={comment}
            setCommentsData={setCommentsData}
          />
        );
      })}
    </>
  );
};

export default Comments;
