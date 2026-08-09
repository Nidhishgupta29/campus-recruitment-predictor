import axios from "axios";

const API = "https:///campus-recruitment-predictor.onrender.com";

export async function login(email, password) {

    const res = await axios.post(

        `${API}/login`,

        {

            email,
            password

        }

    );

    return res.data;

}