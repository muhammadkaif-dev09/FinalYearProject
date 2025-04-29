import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import dots from '../assets/dots.png';
import bookmark from '../assets/bookmark.png';
import bookmarked from '../assets/bookmarkFill.png';
import commentimg from '../assets/comments.png';
import herat from '../assets/heart.png';
import heratfill from '../assets/heartFill.png';
import send from '../assets/send.png';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'socket.io-client';
import dot from "../assets/dots.png"
import deletePost from "../assets/delete (1).png";


function Uploaded() {
    const postRefs = useRef({})
    const { userID, postID } = useParams();
    const [like, setLike] = useState(false);
    const [save, setSave] = useState(false);
    const [commentState, setCommentState] = useState({});
    const [posts, setPosts] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [activePostId, setActivePostId] = useState(null);

    const navigate = useNavigate(); 
    
    const handleDeletePost = async (postid) => {

                setTimeout(async () => {
                    await axios.delete(`/api/post/deletepost/${postid}`, {
                        withCredentials: true
                    });
                    setPosts((prev) => prev.filter((p) => p._id !== postid));
                    setActivePostId(null); 
                }, 1500);

    };
    
    
    useEffect(() => {
        const fetchdata = async () => {
            try {
                if (!userID) {

                    const res = await axios.get('/api/post/getAllPost', {
                        withCredentials: true
                    });
                    const randompost = res.data.data.sort(() => Math.random() - 0.5);
                    setPosts(randompost);
                } else {
                    const res = await axios.get(`/api/post/getuserAllpost/${userID}`, {
                        withCredentials: true
                    })
                    if (postID) {
                        const index = res.data.data.findIndex((p) => p._id === postID);
                        if (index !== -1) {
                            const clicked = res.data.data[index];
                            const before = res.data.data.slice(0, index).reverse();
                            const after = res.data.data.slice(index + 1);
                            res.data.data = [...before, clicked, ...after];
                        }
                    }

                    setPosts(res.data.data)
                }
                const data = await axios.get('/api/user/getUserProfile', {
                    withCredentials: true
                });
                setUser(data.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchdata();
    }, []);

    const toggleLike = async (postid) => {
        const like = await axios.post(`/api/post/likepost/${postid}`, {}, {
            withCredentials: true
        });
        setPosts((prev) =>
            prev.map((p) => (p._id === postid ? like.data.data : p))
        );
    };

    const handlesendComment = async (postid) => {
        const addcom = await axios.post(`/api/post/addcomment/${postid}`, {
            comment: newComment
        }, {
            withCredentials: true
        });

        setNewComment('');
        setCommentState((prev) => ({
            ...prev,
            [postid]: true
        }));
        setTimeout(() => {
            setCommentState((prev) => ({
                ...prev,
                [postid]: false
            }));
        }, 1000);
    };

    const toggleComment = (postid) => {
        setCommentState((prev) => ({
            ...prev,
            [postid]: !prev[postid]
        }));
    };

    const gotoProfile = (userID) => {
        navigate(`/profilelayout/${userID}`);
    };

    const toggolefollow = async (userID) => {
        try {
            const res = await axios.post(`/api/user/togglefollow/${userID}`, {}, {
                withCredentials: true
            });
            if (user.following?.includes(userID)) {
                user.following = user.following.filter((id) => id !== userID);
            } else {
                user.following = [...(user.following || []), userID];
            }
            setPosts((prev) => [...prev]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!loading && postID && postRefs.current[postID]) {
            postRefs.current[postID].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [loading, postID, posts]);

    if (loading) return (<div className="text-center text-xl py-10">Loading...</div>);

    return posts.map((post) => {
        const hasLiked = post.likes.includes(user._id);
        const commentOpen = commentState[post._id] || false;

        return (
            <div className='w-full h-fit pt-5 px-0 sm:px-8' ref={(el) => (postRefs.current[post._id] = el)} key={post._id}>
                <div className="flex items-center justify-between px-5">
                    <div className="flex justify-start items-center gap-x-3 cursor-pointer">
                        <img src={post.owner.profilePhoto} alt="userPro" className='w-12 h-12 rounded-full object-cover border-2 border-[#2B6EA0] p-[2px]' onClick={() => gotoProfile(post.owner._id)} />
                        <div className="flex justify-center items-start flex-col" onClick={() => gotoProfile(post.owner._id)}>
                            <p className="text-[#2B6EA0] text-[16px] font-semibold">{post.owner.username}</p>
                            <p className="text-gray-500 text-sm">{user.fullname ?? "ConnectMe"}</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className={`px-7 py-[7px] ml-2 mr-1 border text-[16px] rounded-lg
                             ${user.following?.includes(post.owner._id)
                                ? "bg-white text-[#2B6EA0] border-[#2B6EA0]"
                                : "bg-[#2B6EA0] text-white border-[#2B6EA0]"
                            }`}>
                            <button onClick={() => toggolefollow(post.owner._id)}>
                                {user.following?.includes(post.owner._id) ? "Following" : "Follow"}
                            </button>
                        </div>

            {post.owner._id === user._id && (
                <div className="relative">
                  <img
                    src={dot}
                    alt=""
                    className='w-6 cursor-pointer'
                    onClick={() => setActivePostId(activePostId === post._id ? null : post._id)}
                  />
           
                 {activePostId === post._id && (
                   <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md z-10 w-32 p-2">
                     <div
                       className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <img src={deletePost} alt="Delete" className="w-4 h-4" />
                      <span className="text-red-600 text-sm font-medium">Delete</span>
                    </div>
                   </div>
                 )}
                </div>
           )}


                    </div>
                </div>

                <div className="w-full h-[350px] flex justify-center items-center mt-3 sm:h-[420px]">
                    <div className="h-full w-full mx-5 p-1">
                        <img src={post.photo} alt="post" className='w-full h-full rounded-xl object-cover' />
                    </div>
                </div>

                <div className="w-full flex justify-between items-center mt-3 px-5">
                    <div className="flex gap-x-4">
                        <div className="flex items-center justify-center gap-x-2">
                            <img src={hasLiked ? heratfill : herat} onClick={() => toggleLike(post._id)} alt="heart" className="cursor-pointer" />
                            <p className="text-sm text-gray-600">{post.likes.length}</p>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                            <img src={commentimg} alt="comments" className="cursor-pointer" onClick={() => toggleComment(post._id)} />
                            <p className="text-sm text-gray-600">{post.comments.length}</p>
                        </div>
                        <img src={send} alt="send" />
                    </div>
                    <img src={save ? bookmarked : bookmark} alt="bookmark" className="cursor-pointer" onClick={() => setSave(prev => !prev)} />
                </div>

                {commentOpen && (
                    <div className="w-full px-5 mt-3">
                        <div className="w-full px-3 py-3 flex flex-col gap-y-3 bg-gray-100 rounded-xl">
                            <div className="w-full overFlow flex flex-col gap-y-1 max-h-40 overflow-y-auto ">
                                {post.comments && post.comments.length > 0 ? (
                                    post.comments.map((c, index) => (
                                        <p key={index} className="text-[15px] text-gray-800 max-w-full h-fit flex justify-between flex-col">
                                            <span className="text-[#2B6EA0]">{c.commentby.username}</span> {c.comment}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-[#2B6EA0] text-sm">No comments yet.</p>
                                )}
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="w-full border-1 border-[#2B6EA0] px-2 py-1 rounded outline-none"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </div>
                                <button className="text-white text-[13px] bg-[#2B6EA0] px-5 py-2 rounded" onClick={() => handlesendComment(post._id)}>Send</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="px-6 mt-2">
                    <p className="text-gray-700">{post.description}</p>
                </div>

                <div className='px-5 pt-5'>
                    <div className="w-full h-px bg-[#2B6EA0]"></div>
                </div>
            </div>
        );
    });
}

export default Uploaded;
