import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { checkUserPermissions } from "../../firebase/firebase";
import addComment from "../../services/comments";

const CommentSection: React.FC = () => {
  const [comment, setComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [canComment, setCanComment] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const hasPermission = await checkUserPermissions(currentUser.uid);
        setCanComment(hasPermission);
      } else {
        setCanComment(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCommentSubmit = async () => {
    if (canComment && user) {
      await addComment(user.uid, comment);
      setComment("");
    } else {
      alert("У вас нет прав на добавление комментариев");
    }
  };

  return (
    <div>
      {user ? (
        <>
          {canComment ? (
            <>
              <h3>Привет, {user.displayName}!</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добавьте комментарий..."
              />
              <button onClick={handleCommentSubmit}>Отправить</button>
            </>
          ) : (
            <p>У вас нет прав на добавление комментариев.</p>
          )}
        </>
      ) : (
        <p>Пожалуйста, войдите, чтобы оставлять комментарии</p>
      )}
    </div>
  );
};

export default CommentSection;
