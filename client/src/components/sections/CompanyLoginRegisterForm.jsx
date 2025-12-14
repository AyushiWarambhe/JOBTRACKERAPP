import React, { useState } from 'react'

import "./styles/CompanyLoginRegisterForm.scss"

// React icons 
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";



const CompanyLoginRegisterForm = () => {

  let [openFormLogin, setOpenFormLogin] = useState(true)

  let [showPassword, setShowPassword] = useState(false)

  // register company 
  let [step, setStep] = useState(1);
  let [founders, setFounders] = useState([""]);

  const addFounder = () => setFounders([...founders, ""]);

  const updateFounder = (i, value) => {
    const list = [...founders];
    list[i] = value;
    setFounders(list);
  };

  const deleteFounder = (i) => {
    setFounders(founders.filter((_, idx) => idx !== i));
  };



  return (
    <>
      <div className="login-register-form">
        <div className="content">
          <div className="login-register-section shadow-lg rounded overflow-hidden">

            {/* Register company  */}
            {/* <div className="register">
                            <button onClick={() => setOpenFormLogin(true)} className='bg-black p-2 text-white'>Login</button>
                        </div> */}

            <div className="register">
              <form className="h-full flex flex-col justify-center p-5 gap-5">
                <h1 className="text-2xl font-bold text-center">
                  Create Company <span className="text-primary">Account</span>
                </h1>



                {/* ===== STEP INDICATOR ===== */}
                <div className="flex justify-center gap-5">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${step === 1 ? "bg-primary text-white" : "bg-gray-300"
                      }`}
                  >
                    Step 1
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${step === 2 ? "bg-primary text-white" : "bg-gray-300"
                      }`}
                  >
                    Step 2
                  </div>
                </div>

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <>
                    {/* Company Details */}
                    <h2 className="text-lg font-semibold opacity-80"><b>Company Details</b></h2>

                    <div className="flex gap-3">
                      <div className="grow">
                        <span className="opacity-70">Company Name</span>
                        <input
                          type="text"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Company Name"
                          required
                        />
                      </div>

                      <div className="grow">
                        <span className="opacity-70">Est. Year</span>
                        <input
                          type="text"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Est. Year"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="grow">
                        <span className="opacity-70">Industry Type</span>
                        <select
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        >
                          <option>Industry Type</option>
                          <option>IT</option>
                          <option>Software</option>
                          <option>Finance</option>
                          <option>Marketing</option>
                        </select>
                      </div>

                      <div className="grow">
                        <span className="opacity-70">Website</span>
                        <input
                          type="text"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Company Website"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <span className="opacity-70">HR Email</span>
                      <input
                        type="email"
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        placeholder="HR Email"
                        required
                      />
                    </div>

                    {/* Address */}
                    <h2 className="text-lg font-semibold opacity-80 mt-2"><b>Company Address</b></h2>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        className="bg-white mt-2 border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        placeholder="Street"
                        required
                      />

                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="City"
                          required
                        />

                        <input
                          type="text"
                          className="bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="State"
                          required
                        />
                      </div>

                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Country"
                          required
                        />

                        <input
                          type="text"
                          className="bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Pincode"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded transition-all mt-4"
                    >
                      Next →
                    </button>
                  </>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                  <>
                    <h2 className="text-lg font-semibold opacity-80">Contact Person Details</h2>

                    <div className="flex gap-3">
                      <div className="grow">
                        <span className="opacity-70">Name</span>
                        <input
                          type="text"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Name"
                          required
                        />
                      </div>

                      <div className="grow">
                        <span className="opacity-70">Position</span>
                        <input
                          type="text"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Position"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="grow">
                        <span className="opacity-70">Email</span>
                        <input
                          type="email"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Email"
                          required
                        />
                      </div>

                      <div className="grow">
                        <span className="opacity-70">Phone</span>
                        <input
                          type="text"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Phone"
                          required
                        />
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold opacity-80">Account Details</h2>
                    <div className="flex gap-3">
                      <div className="grow">
                        <span className="opacity-70">Company Email</span>
                        <input
                          type="email"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Company Email"
                          required
                        />
                      </div>

                      <div className="grow">
                        <span className="opacity-70">Password</span>
                        <input
                          type="password"
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                          placeholder="Password"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <span className="opacity-70">Company Phone</span>
                      <input
                        type="text"
                        className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        placeholder="Company Phone"
                        required
                      />
                    </div>

                    {/* Founders */}
                    {/* Founders */}
                    <h2 className="font-medium mt-3 opacity-80">Founders</h2>

                    {founders.map((f, i) => (
                      <div key={i} className="relative w-full">
                        <input
                          value={f}
                          onChange={(e) => updateFounder(i, e.target.value)}
                          placeholder={`Founder ${i + 1}`}
                          required
                          className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg
                 focus:ring-primary focus:border-primary w-full p-2.5 pr-10"
                        />

                        {/* DELETE ICON inside input */}
                        {founders.length > 1 && (
                          <span
                            onClick={() => deleteFounder(i)}
                            className="absolute right-4 top-[55%] -translate-y-1/2 cursor-pointer text-red-500"
                          >
                          <FaTrash />
                          </span>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="text-primary text-sm mt-2"
                      onClick={addFounder}
                    >
                      + Add Founder
                    </button>

                    {/* Buttons */}
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition-all"
                      >
                        ← Previous
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded transition-all"
                      >
                        Register Company
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
            
            {/* login company  */}
            <div className="login">
              <form className="h-full flex flex-col justify-center p-5 gap-7">
                <h1 className="text-2xl font-bold">Login</h1>

                {/* email  */}
                <div>
                  <div>
                    <span className='opacity-70'>Email</span>
                  </div>

                  <input type="email" id="email" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Please Enter Email" required />
                </div>
                {/* password  */}
                <div>
                  <div className='flex justify-between opacity-70'>
                    <span>Password</span>
                    <span className='text-primary'>Forgot Password ?</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <input type={showPassword ? "text" : "password"} id="password" className="mt-2 bg-white border border-gray-300 text-dark text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Please Enter Password" required />
                    <button type='button' onClick={() => setShowPassword(!showPassword)}>
                      {
                        showPassword ?
                          <FaEyeSlash size={25} /> :
                          <FaEye size={25} />
                      }
                    </button>
                  </div>
                </div>

                {/* submit  */}
                <div className='flex gap-3 flex-col justify-center'>
                  <button className='bg-green-600 hover:bg-green-700 text-light font-bold px-6 py-2 rounded transition-all'>Login</button>
                  <hr />
                  <button type='button' onClick={() => { setOpenFormLogin(false) }} className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded transition-all'>New Here? Please Register</button>
                </div>
              </form>

            </div>

            {/* slider bar  */}
            <div className={`slider ${openFormLogin ? "login" : "register"}`}>
              <div className='text-data h-full flex flex-col justify-end gap-2 text-light p-6'>
                <span className='font-bold text-2xl'>Welcome</span>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.?</p>
                <span className='bg-primary p-2 font-bold w-fit rounded'>Get 20% Off</span>
              </div>
            </div>


          </div>
        </div>
      </div>

    </>
  )
}


export default CompanyLoginRegisterForm