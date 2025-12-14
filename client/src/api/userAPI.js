import axios from "axios";

let baseUrl =
    import.meta.env.VITE_BASE_API_URL.replace(/\/$/, "") + "/user";

// ----------------------- Register -----------------------
export const requestUserRegister = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/register`, data);
        return result;
    } catch (err) {
        throw err;
    }
};

// ------------------- Email OTP Verify -------------------
export const requestUserEmailOtpVerification = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/verify-otp`, data);
        return result;
    } catch (err) {
        throw err;
    }
};

// ------------------------- Login -------------------------
export const requestUserLogin = async (data) => {
    try {
        // FIXED BACK TO ORIGINAL ENDPOINT
        let result = await axios.post(`${baseUrl}/user-login`, data);
        return result;
    } catch (err) {
        throw err;
    }
};

// -------------------- Fetch User Profile -----------------
export const requestUserProfile = async (token) => {
    try {
        const result = await axios.get(`${baseUrl}/fetch-user-profile`, {
            headers: {
                Authorization: token, // REMOVED Bearer
            },
        });

        return result.data;
    } catch (err) {
        console.error("profile fetching error:", err);
        throw err;
    }
};

// ---------------- Upload Profile Picture -----------------
export const userProfilePicture = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/profile_picture`,
            formData,
            {
                headers: {
                    Authorization: token, // REMOVED Bearer
                },
            }
        );

        return result.data;
    } catch (err) {
        throw err;
    }
};

// ------------------ OTP for Password Reset ---------------
export const requestOTPForPasswordReset = async (email) => {
    try {
        const result = await axios.post(
            `${baseUrl}/password-reset-request`,
            { email }
        );
        return result;
    } catch (err) {
        throw err;
    }
};

// --------- Verify OTP for Password Reset -----------------
export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
    try {
        const result = await axios.post(
            `${baseUrl}/verify-reset-password-request`,
            data
        );
        return result;
    } catch (err) {
        throw err;
    }
};

// ------------------------ Upload Resume -------------------
export const uploadResume = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/resume`,
            formData,
            {
                headers: {
                    Authorization: token, // REMOVED Bearer
                },
            }
        );

        return result.data;
    } catch (err) {
        throw err;
    }
};

// ------------------------ Upload BIO ----------------------
export const uploadBIO = async (token, newBio) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-new-bio`,
            newBio,
            {
                headers: {
                    Authorization: token, // REMOVED Bearer
                },
            }
        );

        return result.data;
    } catch (err) {
        throw err;
    }
};

// ------------------------ Delete Resume -------------------
export const deleteResume = async (token) => {
    return axios.delete(`${baseUrl}/delete-resume`, {
        headers: {
            Authorization: token, // REMOVED Bearer
        },
    });
};


{/*import axios from "axios";

let baseUrl =
    import.meta.env.VITE_BASE_API_URL.replace(/\/$/, "") + "/user";

// ----------------------- Register -----------------------
export const requestUserRegister = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/register`, data);
        return result;
    } catch (err) {
        throw err;
    }
};

// ------------------- Email OTP Verify -------------------
export const requestUserEmailOtpVerification = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/verify-otp`, data);
        return result;
    } catch (err) {
        throw err;
    }
};

// ------------------------- Login -------------------------
export const requestUserLogin = async (data) => {
    try {
        // FIXED ENDPOINT — You had /user-login earlier
        let result = await axios.post(`${baseUrl}/login`, data);
        return result;
    } catch (err) {
        throw err;
    }
};

// -------------------- Fetch User Profile -----------------

export const requestUserProfile = async (token) => {
  try {
    console.log("TOKEN SENT TO API:", token); // Make sure this logs your token
    const result = await axios.get(`${baseUrl}/fetch-user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Must include 'Bearer '
      },
    });
    return result.data;
  } catch (err) {
    console.error("profile fetching error :", err);
    throw err;
  }
};
{/*
export const requestUserProfile = async (token) => {
    console.log("TOKEN SENT TO API:", token);

    try {
        let result = await axios({
            method: "GET",
            url: `${baseUrl}/fetch-user-profile`,
            headers: {
                // FIX: added Bearer
                Authorization: `Bearer ${token}`,
            },
        });

        return result;
    } catch (err) {
        throw err;
    }
};
*/}
{/*}
// ---------------- Upload Profile Picture -----------------
export const userProfilePicture = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/profile_picture`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // FIXED
                },
            }
        );

        return result.data;
    } catch (err) {
        throw err;
    }
};

// ------------------ OTP for Password Reset ---------------
export const requestOTPForPasswordReset = async (email) => {
    try {
        const result = await axios.post(
            `${baseUrl}/password-reset-request`,
            { email }
        );
        return result;
    } catch (err) {
        throw err;
    }
};

// --------- Verify OTP for Password Reset -----------------
export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
    try {
        const result = await axios.post(
            `${baseUrl}/verify-reset-password-request`,
            data
        );
        return result;
    } catch (err) {
        throw err;
    }
};

// ------------------------ Upload Resume -------------------
export const uploadResume = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/resume`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // FIXED
                },
            }
        );

        return result.data;
    } catch (err) {
        throw err;
    }
};

// ------------------------ Upload BIO ----------------------
export const uploadBIO = async (token, newBio) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-new-bio`,
            newBio,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // FIXED
                },
            }
        );

        return result.data;
    } catch (err) {
        throw err;
    }
};

// ------------------------ Delete Resume -------------------
export const deleteResume = async (token) => {
    return axios.delete(`${baseUrl}/delete-resume`, {
        headers: {
            Authorization: `Bearer ${token}`, // FIXED
        },
    });
};


{/*
import axios from "axios"

//let baseUrl = import.meta.env.VITE_BASE_API_URL + "/user"
let baseUrl = import.meta.env.VITE_BASE_API_URL.replace(/\/$/, "") + "/user"


export const requestUserRegister = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/register`, data)
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserEmailOtpVerification = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/verify-otp`, data)
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserLogin = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/user-login`, data)
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserProfile = async (token) => {
    try {
        let result = await axios({
            method: "GET",
            url: `${baseUrl}/fetch-user-profile`,
            headers: {
                authorization: token
            }
        })

        return result

    } catch (err) {
        throw (err)
    }
}

export const userProfilePicture = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/profile_picture`,
            formData,
            {
                headers: {
                    authorization: token
                    // DO NOT add Content-Type manually
                }
            }
        );

        return result.data;

    } catch (err) {
        throw err;
    }
};

export const requestOTPForPasswordReset = async (email) => {
    try {
        console.log("reset passord for ", email)
        const result = await axios.post(`${baseUrl}/password-reset-request`, { email });
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
    console.log(data)
    try {
        const result = await axios.post(`${baseUrl}/verify-reset-password-request`, data);
        return result
    } catch (err) {
        throw err
    }
}

export const uploadResume = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/resume`,
            formData,
            {
                headers: {
                    authorization: token,
                }
            }
        );

        return result.data;

    } catch (err) {
        throw err;
    }
};

export const uploadBIO = async (token, newBio) => {
    try {

        console.log("new bio : ", newBio)

        const result = await axios.post(
            `${baseUrl}/upload-new-bio`,
            newBio,
            {
                headers: {
                    authorization: token,
                }
            }
        );

        return result.data;

    } catch (err) {
        throw err;
    }
};

export const deleteResume = async (token) => {
    return axios.delete(`${baseUrl}/delete-resume`, {
        headers: {
            authorization: token,
        }
    });
};  */}