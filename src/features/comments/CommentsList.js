import React from "react";
import { useSelector } from "react-redux";
import { Col } from "reactstrap";
import Comment from "./Comment";
import { selectCommentsByCampsiteId } from "./commentsSlice";
import CommentForm from "./CommentForm";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const CommentsList = ({ campsiteId }) => {
  const comments = useSelector(selectCommentsByCampsiteId(campsiteId));
  const isLoading = useSelector((state) => state.comments.isLoading);
  const errMsg = useSelector((state) => state.comments.errMsg);

  return (
    <Col md="5" className="m-1">
      {isLoading ? (
        <Loading />
      ) : errMsg ? (
        <Error errMsg={errMsg} />
      ) : comments && comments.length > 0 ? (
        <>
          <h4>Comments</h4>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
          <CommentForm campsiteId={campsiteId} />
        </>
      ) : (
        <p>There are no comments for this campsite yet.</p>
      )}
    </Col>
  );
};

export default CommentsList;
