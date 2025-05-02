import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [comment, setComment] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const [reply, setReply] = useState("");

  const handleReplying = (index) => {
    setCommentsData((prevComments) =>
      prevComments.map((comment, i) =>
        i === index ? { ...comment, replying: !comment.replying } : comment
      )
    );
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleReply = (e) => {
    setReply(e.target.value);
  };

  const handleSubmitReply = () => {
    setCommentsData();
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    console.log("user added comment");
    setCommentsData((prev) => [
      ...prev,
      {
        id: commentsData.length + 1,
        text: comment,
        replies: [],
        replying: false,
      },
    ]);
    setComment("");
  };
  useEffect(() => {
    console.log(commentsData);
  }, [commentsData]);

  const pseudoCommentsData = [
    {
      id: 1,
      text: "This is the parent comment.",
      replies: [
        {
          id: 2,
          text: "This is a child reply.",
          replies: [
            {
              id: 3,
              text: "This is reply to the child comment.",
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      text: "Another top level comment",
      replies: [
        {
          id: 5,
          text: "Child comment.",
          replies: [],
        },
      ],
    },
  ];
  return (
    <div className="mt-10 ml-5">
      <form onSubmit={handleSubmitComment}>
        <input
          type="text"
          placeholder="Type..."
          className="border border-gray-300 py-1.5 px-3 rounded-md text-lg bg-gray-200"
          onChange={handleComment}
          value={comment}
          required
        />
        <button className="mx-3 bg-sky-400 text-white p-2 rounded-md cursor-pointer active:scale-85 transition-all duration-150">
          COMMENT
        </button>
      </form>

      {commentsData.map((comment, index) => (
        <article key={index} className="ml-10 my-2">
          <div className="bg-zinc-300  max-w-xs px-5 py-2 rounded-md">
            <p>{comment.text}</p>
            <div className="text-sm space-x-3 mt-3">
              <button
                className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
                onClick={() => handleReplying(index)}
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
              <button className="text-gray-500 font-bold cursor-pointer hover:text-gray-600">
                EDIT
              </button>
              <button className="text-gray-500 font-bold cursor-pointer hover:text-gray-600">
                DELETE
              </button>
            </div>
          </div>
          {comment.replying ? (
            <div className="mt-2 ml-10">
              <input
                placeholder="Reply"
                className="bg-zinc-200 rounded-sm py-1 px-1.5 focus:outline-1"
                onChange={handleReply}
                value={reply}
              ></input>
              <div className="text-sm space-x-2 inline mx-2">
                <button
                  className="text-gray-500 font-bold cursor-pointer hover:text-gray-600"
                  onClick={handleSubmitReply}
                >
                  REPLY
                </button>
                <button className="text-gray-500 font-bold cursor-pointer hover:text-gray-600">
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </article>
      ))}
    </div>
  );
}

export default App;
