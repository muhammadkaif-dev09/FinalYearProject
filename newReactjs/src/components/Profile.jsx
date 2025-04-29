import React, { useEffect, useState ,useRef } from 'react'
import Chatbox from './Chatbox'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import profile from "../assets/profile.png"
import bookmark from "../assets/bookmark.png"

const Profile = ({ userID }) => {
  const navigate = useNavigate()
  const [profiledata, setProfileData] = useState({})
  const [post, setPost] = useState([])
  const [comments, setComments] = useState([])
  const [showFullBio, setShowFullBio] = useState(false)
  const [showUserList, setShowUserList] = useState(null) 
  const [userList, setUserList] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const pressTimerRef = useRef(null)

  const handleMouseDown = () => {
     pressTimerRef.current = setTimeout(() => {
     setShowPreview(true)
     }, 600)
  }

  const handleMouseUp = () => {
     clearTimeout(pressTimerRef.current)
  }

  const handleClosePreview = () => {
     setShowPreview(false)
  }

  useEffect(() => {
    const fetchdata = async () => {
      let res
      if (userID) {
        res = await axios.get(`/api/user/getuser/${userID}`)
        console.log(res.data.data)
      } else {
        res = await axios.get('/api/user/getUserProfile')
        console.log(res.data.data)
      }
      const posts = await axios.get(`/api/post/getuserAllpost/${res.data.data._id}`)
      console.log(posts)
      setPost(posts.data.data)
      setProfileData(res.data.data)
      const commentid = await Promise.all(
        posts.data.data.map(async (post) => {
          const comment = await axios.get(`/api/post/getallcomment/${post._id}`)
          return comment.data
        })
      )
      const flattenedComments = commentid.flat().map(comment => comment.data).flat()
      setComments(flattenedComments)
      console.log(flattenedComments)
    }
    fetchdata()
  }, [])

  const handleShowUserList = async(type)=>{
    setShowUserList(type)
    const userids= profiledata[type] || []

    const users = await Promise.all(userids.map(async(id)=>{
      const res= await axios.get(`/api/user/getuser/${id}`)
      return res.data.data
    }))
    setUserList(users)
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-tr from-[#e0e7ff] via-[#fcf3f3] to-[#dbeafe]">
      <div className="w-full h-full overflow-y-auto">
        <div className="bg-gradient-to-tr from-blue-200 via-pink-200 to-purple-100 flex flex-col lg:flex-row items-center justify-center gap-6 px-4 lg:px-12 py-8 w-full">
          <div className="flex flex-col lg:flex-row items-center lg:bg-white lg:shadow-xl rounded-2xl p-6 lg:gap-10 gap-3 max-w-2xl w-full">
          <div className="w-32 sm:w-36 lg:w-48 h-32 sm:h-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp} 
                >
              <img src={profiledata.profilePhoto} className="object-cover w-full h-full" alt="Profile" />
          </div>

          {showPreview && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-lg w-screen h-screen"
              onClick={handleClosePreview}
            >
              <img src={profiledata.profilePhoto} alt="Preview" className="md:h-64 md:w-64 w-52 h-52 rounded-full shadow-xl object-cover" />
            </div>
          )}

            <div className="flex flex-col gap-4 lg:gap-3 w-full">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                <h2 className="font-bold text-lg lg:text-xl">{profiledata.username}</h2>
                {!userID && <button
                  className="editProfile text-white hover:bg-blue-800 px-9 py-2 rounded-md bg-blue-600 transition duration-300"
                  onClick={() => navigate('/editprofilelayout')}
                >
                  Edit profile
                </button>}

              </div>
              <div className="flex justify-center gap-16 lg:justify-start text-center">
                <div>
                  <p className="text-sm text-gray-900">Posts</p>
                  <p className="font-semibold text-lg">{post?.length}</p>
                </div>
                <div  onClick={() => handleShowUserList('followers')} className="cursor-pointer">
                  <p className="text-sm text-gray-900">Followers</p>
                  <p className="font-semibold text-lg">{profiledata.followers?.length}</p>
                </div>
                <div onClick={() => handleShowUserList('following')} className="cursor-pointer">
                  <p className="text-sm text-gray-900">Following</p>
                  <p className="font-semibold text-lg">{profiledata.following?.length}</p>
                </div>
              </div>


              <div>
                  <h1 className='font-semibold'>
                     {profiledata.fullname}
                  </h1>

              <div className="text-sm text-gray-900">
                {showFullBio ? (
                  <p>{profiledata.bio}</p>
                ) : (
                  <p className="line-clamp-3 whitespace-pre-wrap">{profiledata.bio}</p>
                )}
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-gray-600 text-sm mt-1"
                >
                  {showFullBio ? 'Show less' : 'Read more'}
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-10 justify-center py-4'>
          <div className='flex gap-2 items-center text-sm font-semibold cursor-pointer'>
            <img src={profile} alt="Posts" className='w-5 h-5' />
            <span>POSTS</span>
          </div>
          <div className='flex gap-2 items-center text-sm font-semibold cursor-pointer'>
            <img src={bookmark} alt="Saved" className='w-5 h-5' />
            <span>SAVED</span>
          </div>
        </div>

        <div id="posts" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-4 sm:px-6 pb-12">
          {Array.isArray(post) && post.length > 0 ? (
            post.map((p, index) => (
              <div key={index} className="relative group overflow-hidden rounded-md shadow-md">
                <img
                  src={p.photo}
                  alt="Post"
                  onClick={() => navigate(`/getallpost/${profiledata._id}/${p._id}`,)}
                  className="w-full h-72 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No posts available</div>
          )}
        </div>

        {showUserList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 sm:w-96 max-h-[80vh] overflow-y-auto rounded-lg p-5">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-xl font-semibold capitalize">{showUserList}</h2>
                <button onClick={() => setShowUserList(null)} className="text-red-500">Close</button>
              </div>
              {userList.map((user) => (
                <div key={user._id} className="flex items-center justify-between gap-3 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <img src={user.profilePhoto} alt="user" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.fullname}</p>
                    </div>
                  </div>
                  {!userID && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md">
                      {profiledata.following?.includes(user._id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile