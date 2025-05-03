import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Comments from "./components/Comments";

function App() {
  const [commentText, setCommentText] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});

  //function to add a top level comment
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: uuidv4(),
      parentId: null,
      text: commentText,
      replies: [],
      replying: false,
    };
    setCommentsData((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const handleComment = (e) => {
    setCommentText(e.target.value);
  };

  return (
    <div className="mt-10 ml-5 pb-30">
      <form onSubmit={handleSubmitComment}>
        <input
          type="text"
          placeholder="Type..."
          className="border border-gray-300 py-1.5 px-3 rounded-md text-lg bg-gray-200"
          onChange={handleComment}
          value={commentText}
          required
        />
        <button className="mx-3 bg-sky-400 text-white p-2 rounded-md cursor-pointer active:scale-85 transition-all duration-150">
          COMMENT
        </button>
      </form>

      <div>
        <Comments
          setCommentsData={setCommentsData}
          commentsData={commentsData}
          replyInputs={replyInputs}
          setReplyInputs={setReplyInputs}
        />
      </div>
    </div>
  );
}

export default App;
