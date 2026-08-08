import axios from "axios";
import { useEffect } from "react";

useEffect(() => {
  axios.post(
    "http://127.0.0.1:5000/predict-placement",
    {}
  )
  .then((response) => {
    console.log(response.data);
  });
}, []);