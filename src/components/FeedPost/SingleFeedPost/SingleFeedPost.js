import "./SingleFeedPost.css";
import PostReaction from "../../Shared/PostReaction/PostReaction";
import ProfilPicture from "../../Shared/ProfilPicture/ProfilPicture";
import FeedPostComments from "../FeedPostComments/FeedPostComments";
import DisplayMore from "../../Shared/DisplayMore/DisplayMore";
import axios from "axios";
import { prepareHeaders } from "../../Utils/utils";
import { useEffect, useState } from "react";

const SingleFeedPost = ({ singlePost, parity }) => {
  const [needRefresh, setNeedRefresh] = useState(true);
  const [comments, setComments] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (document.querySelector(".even, .odd")) {
      document.querySelectorAll(".even, .odd").forEach((singlePost) => {
        singlePost.style.transform = "translateX(0)";
      });
    }
  }, [singlePost]);

  const handleSubmit = (messageContent) => (submitEvent) => {
    submitEvent.preventDefault();
    if (messageContent) {
      const messageToSend = JSON.stringify({
        messageContent: messageContent,
        postId: singlePost.id,
      });
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/feedpost/comment/new`, messageToSend, prepareHeaders(document.cookie))
        .then((response) => {
          if (response.data == true) {
            setNeedRefresh(true);
            document.getElementById("sendResponse").value = "";
          } else {
            console.log("false");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (needRefresh === true) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/feedpost/comment/all?postId=${singlePost.id}&offset=${offset}`)
        .then((commentsResponse) => {
          setComments(comments.concat(commentsResponse.data.comments));
          setNeedRefresh(false);
        })
        .catch((error) => console.log(error));
    }
  }, [needRefresh]);

  return (
    <div className={`singleFeedPost ${parity}`}>
      <div className="postContent">
        <ProfilPicture imageUrl={singlePost.User.imageUrl} />
        <p className="username">{singlePost.User.username}</p>
        <p className="textContent">{singlePost.textContent}</p>
      </div>
      <PostReaction handleSubmit={handleSubmit} />
      {comments.length > 0 ? (
        <>
          <FeedPostComments comments={comments} setNeedRefresh={setNeedRefresh} />
          <DisplayMore offset={offset} setOffset={setOffset} setNeedRefresh={setNeedRefresh} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SingleFeedPost;