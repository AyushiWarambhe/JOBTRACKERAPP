import React, { createContext, useContext, useEffect, useState } from "react";
import { requestUserProfile } from "../api/userAPI"; // adjust the path
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Login function
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5011/user/user-login", {
        email,
        password,
      });

      const userToken = response.data.token;
      localStorage.setItem("token", userToken); // Save token
      setToken(userToken);

      console.log("Login successful. Token:", userToken);

      // Fetch user profile immediately after login
      await fetchUserProfile(userToken);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (authToken = token) => {
    try {
      if (!authToken) throw new Error("No token found. Please login.");

      const profile = await requestUserProfile(authToken);
      setUser(profile.userData || profile);
      setLoading(false);
      console.log("User profile fetched:", profile);
    } catch (err) {
      console.error("Profile fetching error:", err.response?.data || err.message);

      // Check if error is due to token expiration or unauthorized
      if (err.response?.status === 401) {
        alert("Session expired. Please login again."); // Optional: show message
        logoutUser(); // remove token and user info
        // Optionally, redirect to login page if using react-router:
        // window.location.href = "/login";
      }

      setUser(null);
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("User logged out.");
  };

  // Fetch profile on initial load if token exists
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        token,
        loginUser,
        logoutUser,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => useContext(UserContext);


{/*
import React, { createContext, useContext, useEffect, useState } from "react";
import { requestUserProfile } from "../api/userAPI"; // adjust the path
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Login function
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5011/user/user-login", {
        email,
        password,
      });

      const userToken = response.data.token;
      localStorage.setItem("token", userToken); // Save token
      setToken(userToken);

      console.log("Login successful. Token:", userToken);

      // Fetch user profile immediately after login
      await fetchUserProfile(userToken);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Fetch user profile
  const fetchUserProfile = async (authToken = token) => {
    try {
      if (!authToken) throw new Error("No token found. Please login.");

      const profile = await requestUserProfile(authToken);
      setUser(profile.userData || profile);
      setLoading(false);
      console.log("User profile fetched:", profile);
    } catch (err) {
      console.error("Profile fetching error:", err.response?.data || err.message);
      setUser(null);
      setLoading(false);
      localStorage.removeItem("token"); // Remove invalid/expired token
    }
  };

  // Logout function
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("User logged out.");
  };

  // Fetch profile on initial load if token exists
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        token,
        loginUser,
        logoutUser,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => useContext(UserContext);

{/*
import { useState, useEffect, createContext, useContext } from "react"

import { requestUserProfile } from "../api/userAPI.js"

const UserContext = createContext()


let UserProvider = ({ children }) => {

    let [user, setUser] = useState({
        logedIn: false
    })

    //useEffect(() => {
    //    fetchUserProfile()
    //}, [])


   {/*   const fetchUserProfile = async () => {
        try {
            let token = localStorage.getItem('token')

            if (!token) throw ("token not found !")

            let result = await requestUserProfile(token)

            if (result.status != 200) throw ("unable to fetch user profile !")

            setUser(prev => {
                return { ...result.data.userData, logedIn: true }
            })

        } catch (err) {
            console.log("profile fetching error : ", err)
        }
    } 
    */}

{/*useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetchUserProfile(token);
  } else {
    console.log("No token found in localStorage");
  }
}, []);

    {/*const fetchUserProfile = async (token) => {
  try {
    let response = await requestUserProfile(token);
    setUser(response.data.user);
  } catch (error) {
    console.log("profile fetching error :", error);
  }
};  */}

{/*
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // must match where you stored token on login
    if (!token) throw "No token found! Please login.";
    const profile = await requestUserProfile(token);
    console.log("User profile:", profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
};




    return (
        <UserContext.Provider value={{ user, fetchUserProfile }}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => useContext(UserContext)

export { UserProvider, useUser }

*/}