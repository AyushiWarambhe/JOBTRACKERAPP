import React from 'react'
import myfrontpage from '../../../assets/media/myfrontpage.jpg'

const Body = () => {
    return (
        <div className='text-center p-2 bg-gray-300 border-t border-b'>

            {/* Image container */}
            <div className="relative w-full h-[600px] mx-auto overflow-hidden rounded-lg">

                {/* Image */}
                <img
                    src={myfrontpage}
                    alt="frontpage"
                    className="w-full h-[600px] object-cover"
                />

                {/* Dark overlay ONLY on image */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                {/* Write text on top */}
                <div className=" text-data h-full flex flex-col justify-center gap-5 absolute inset-0 text-white px-4">
                    <h1 className="text-4xl font-bold">Job Tracker App – Smart Way to Manage Your Career Journey</h1>
                    <h6 className='p-5 m-5'>Introducing Job Tracker App, your personal digital assistant for managing every step of your job search. Whether you’re applying for internships, entry-level roles, or experienced positions, Job Tracker App brings all your applications into one simple and organized place.</h6>

                </div>

            </div>
        </div>
    )
}

export default Body


