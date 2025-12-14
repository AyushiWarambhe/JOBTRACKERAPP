import React from 'react'

import Header from '../sections/includes/Header'
import Footer from '../sections/includes/Footer'
import Body from '../sections/includes/Body'

const Home = () => {
    return (
        <>
            <Header />
            <Body/>
            <Footer />
        </>
    )
}

export default Home 
//import React from 'react'
//import { useNavigate } from "react-router-dom";

//import Header from '../sections/includes/Header'
//import Footer from '../sections/includes/Footer'

//import myfrontpage from '../../assets/media/myfrontpage.jpg'

//const Body = () => {

//  let navigate = useNavigate();

//  return (
//    <>
//      <Header />

//      {/* IMAGE AS FULL BACKGROUND */}
//      <div className="relative w-full h-screen overflow-hidden">

//        {/* Background Image */}
//        <img
//          src={myfrontpage}
//          alt="frontpage"
//          className="absolute inset-0 w-full h-full object-cover"
//        />

//        {/* Dark Overlay */}
//        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

//        {/* -------- BUTTONS + TEXT ON TOP OF IMAGE -------- */}
//        <div className="absolute inset-0 flex flex-col justify-start items-center pt-28 text-white">

//          {/* Buttons on top of image */}
//          <div className="flex gap-4 mb-10">

//            <button
//              onClick={() => navigate("/user-login-register")}
//              className="px-6 py-3 rounded-xl font-semibold text-white
//                       bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600
//                       shadow-lg hover:shadow-purple-600/40
//                       hover:scale-[1.02] active:scale-95 transition-all duration-300"
//            >
//              User Login
//            </button>

//            <button
//              onClick={() => navigate("/company-login-register")}
//              className="px-6 py-3 rounded-xl font-semibold text-white
//                       bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600
//                       shadow-lg hover:shadow-emerald-500/40
//                       hover:scale-[1.02] active:scale-95 transition-all duration-300"
//            >
//              Company Login
//            </button>

//          </div>

//          {/* Title + Description on the image */}
//          <h1 className="text-4xl font-bold max-w-3xl text-center px-4">
//            Job Tracker App – Smart Way to Manage Your Career Journey
//          </h1>

//          <p className="text-lg max-w-3xl text-center mt-6 px-6 opacity-90">
//            Introducing Job Tracker App, your personal digital assistant for managing 
//            every step of your job search. Whether you’re applying for internships, 
//            entry-level roles, or experienced positions, Job Tracker App brings all your 
//            applications into one simple and organized place.
//          </p>
//
//        </div>
//      </div>
//
//      <Footer />
//    </>
//  )
//}

//export default Body

