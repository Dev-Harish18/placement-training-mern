import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/user/userActions";
import { useHistory } from "react-router";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";
import { v4 as uuidv4 } from "uuid";
import QuizForm from "../components/QuizForm";

const EditQuiz = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showLoader, setShowLoader] = useState(false);
  const [quiz, setQuiz] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    //Invalid id
    const fetchEvent = async () => {
      const { data } = await axios({
        method: "GET",
        url: `/events/${props.match.params.id}`,
      });

      if (data.status === "success") {
        setQuiz(data.data.event.name);
        setQuestions(data.data.event.questions);
      } else history.push("/error");
    };

    fetchEvent();
  }, [history, props.match.params.id]);

  const initial = {
    name: "",
    options: ["", "", "", ""],
    correctOption: 1,
    explanation: "No explanation provided",
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    if (questions.length === 0) {
      dispatch(setAlert("Add atleast one question to create quiz", "error"));
      return setShowLoader(false);
    }
    //If Atleast one question add the quiz
    const { data } = await axios({
      method: "PATCH",
      url: `/events/${props.match.params.id}`,
      data: {
        name: quiz.trim(),
        total: questions.length,
        questions,
      },
    });

    if (data.status === "success") {
      dispatch(setAlert(`Quiz "${quiz}" Edited successfully`, "success"));
      dispatch(setCurrentUser(data.data.user));
    } else {
      dispatch(setAlert(data.message.split(",")[0], "error"));
    }

    setShowLoader(false);
  };

  //handle add
  const handleAdd = () => {
    setQuestions([...questions, { ...initial, id: uuidv4() }]);
  };

  return (
    <QuizForm
      title="Edit Event"
      handleSubmit={handleSubmit}
      handleAdd={handleAdd}
      showLoader={showLoader}
      quiz={quiz}
      setQuiz={setQuiz}
      questions={questions}
      setQuestions={setQuestions}
    />
  );
};

export default EditQuiz;
