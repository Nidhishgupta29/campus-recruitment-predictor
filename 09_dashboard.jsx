import axios from "axios";
import { useEffect } from "react";

useEffect(() => {
  axios.post(
    "https://campus-recruitment-predictor.onrender.com/predict-placement",
    {}
  )
  .then((response) => {
    console.log(response.data);
  });
}, []);