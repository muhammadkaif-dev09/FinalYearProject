import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCamera, FaSave } from 'react-icons/fa';
import emptyuser2 from '../assets/emptyuser2.jpeg'

const EditProfile = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const navigate = useNavigate();

  const handlesubmit=async()=>{
    if(!name && !username && !bio){
      alert("Please Update At Least One Field")
      return
    }

    try {
      const res=await axios.patch('/api/user/accountdetailchange',{
        fullname:name,
        username,
        bio
      },
    {
      withCredentials:true
    })
    navigate('/profilelayout/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e0e7ff] via-[#fcf3f3] to-[#dbeafe] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-y-auto py-20">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-3xl shadow-2xl p-6 relative transition-all duration-300">

      
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={emptyuser2}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => { navigate('/photo', { state: { from: 'editprofile' } }) }}
              className="absolute bottom-2 right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-md"
              title="Change Photo"
            >
              <FaCamera className="text-xl" />
            </button>
          </div>
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold text-blue-600">Edit Profile</h2>
          <p className="text-sm text-gray-500">Keep your info up to date</p>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 placeholder-slate-400 placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 placeholder-slate-400 placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={3}
              placeholder="Write a short bio..."
              className="w-full resize-none px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 placeholder-slate-400 placeholder:font-normal"
            />
            <p className="text-xs text-right text-gray-400">{bio.length}/150</p>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Gender</label>
            <select className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 placeholder-slate-400 placeholder:font-normal">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Custom">Custom</option>
              <option value="Not">Prefer not to say</option>
            </select>
          </div>

          <button
            onClick={handlesubmit}
            className="w-full flex items-center justify-center gap-2 mt-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
            title="Save your changes"
          >
            <FaSave />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
