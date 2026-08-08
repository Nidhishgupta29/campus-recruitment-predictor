import axios from "axios";

const API = "http://127.0.0.1:5000";

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