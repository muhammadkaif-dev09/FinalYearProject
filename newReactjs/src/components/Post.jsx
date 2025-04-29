import React, { useState } from 'react';
import gallery from '../assets/gallery.png'
import axios from 'axios';
import { href, Link, Navigate, useNavigate } from 'react-router-dom';

function Post({ user, postText, setPostText }) {
    // const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [message, setMessage] = useState('');    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const createPost = async () => {
        if (!postText || !image) {
            setMessage('Both post text and image are required!');
            return;
        }

        const formData = new FormData();
        formData.append('description', postText);
        formData.append('photo', image);

        try {
            const res = await axios.post('/api/post/createpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            setMessage('Post created successfully!');
            // setBio('');
            setPostText('');
            setImage(null);
            setPreviewImage('');
        } catch (error) {
            console.error('Error creating post:', error);
            setMessage('Failed to create post. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-2xl px-6 py-3 hover:shadow-xl hover:shadow-[#2b6da018] transition duration-300">
            <h2 className="text-xl font-semibold text-[#2B6EA0] mb-4">What's on your mind?</h2>
            <div className="flex items-center gap-x-3">
                <Link to="/profilelayout"><img src={user.profilePhoto ?? "userPro.png"} alt="User Profile" className="w-10 h-10 rounded-full object-cover mx-1" /></Link>
                <textarea
                    type="text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="What's on your mind?"
                    className="overFlow w-full bg-white border border-gray-300 resize-none rounded-full px-4 py-2 h-11 outline-none"
                />
            </div>

            <div className="flex mt-3">
                {previewImage && <img src={previewImage} alt="Selected" className="w-24 h-24 rounded" />}
            </div>

            <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex space-x-4 text-gray-500">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <img src={gallery} alt="gallery" className="w-5 h-5" />
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                <button className="bg-[#2B6EA0] text-white text-[16px] px-8 py-2 rounded-lg" onClick={createPost}>Post</button>

            </div>
            {message && <p className="mt-3 text-center text-[15px] text-gray-600">{message}</p>}
        </div>
    );
}

export default Post;

