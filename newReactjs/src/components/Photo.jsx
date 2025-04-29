import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { gsap } from "gsap";
import image from "../assets/beech.jpg"
import emptyUser from "../assets/emptyuser2.jpeg"


const Photo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state)
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(emptyUser);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            ".svg-shape",
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 2, stagger: 0.3, ease: "back.out(1.7)" }
        );

        gsap.fromTo(
            ".text-anim",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.5, delay: 1, ease: "power4.out" }
        );
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setImageUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setIsLoading(true);
    
        const formData = new FormData();
    
        if (selectedFile) {
            // If user selected a file, upload that file
            formData.append("profilePhoto", selectedFile);
        } else {
            // If user did NOT select a file, fetch the emptyUser image
            try {
                const response = await fetch(emptyUser);
                const blob = await response.blob();
                const defaultFile = new File([blob], "defaultProfile.jpg", { type: blob.type });
                formData.append("profilePhoto", defaultFile);
            } catch (error) {
                console.error("Error loading default image:", error);
                setIsLoading(false);
                return;
            }
        }
    
        try {
            const res = await axios.patch(`/api/user/profilePhotochange`, formData, {
                withCredentials: true,
            });
    
            const updatedImageUrl = res.data.profilePhoto;
            localStorage.setItem("profilePicture", updatedImageUrl);
    
            setTimeout(() => {
                navigate("/loader");
                setTimeout(() => {
                    if (location.state.from === "editprofile") {
                        navigate("/profilelayout/");
                    } else if (location.state.from === "signup") {
                        navigate("/login");
                    } else {
                        navigate("/");
                    }
                }, 4000);
            }, 1000);
        } catch (error) {
            console.error("Error saving profile photo:", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleImageClick = () => {
        document.getElementById("fileInput").click();
    };

    return (
        <div className="min-h-screen w-full flex flex-col xl:flex-row bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
            <div className="hidden xl:flex w-2/3 relative items-center justify-center overflow-hidden">
                <svg className="svg-shape" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="none" width="400" height="400">
                    <circle cx="50" cy="50" r="40" fill="#F9A8D4" opacity="0.4" />
                </svg>
                <svg className="svg-shape" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="none" width="400" height="400">
                    <rect x="100" y="50" width="100" height="100" fill="#818CF8" opacity="0.5" />
                </svg>

                <div className="z-10 text-center px-10 animate-fade-in-up text-anim">
                    <img
                        src={image}
                        alt="Foreigners on a Beach with Goggles"
                        className="w-64 mx-auto mb-6 rounded-lg shadow-lg"
                    />
                    <h1 className="text-[#2D3748] text-4xl font-bold leading-snug">
                        Craft Your <span className="text-yellow-400">Memorable</span> Identity
                    </h1>
                    <p className="text-[#4A5568] mt-4 text-sm md:text-base">
                        A unique photo helps you stand out. Upload a great one now!
                    </p>
                </div>
            </div>

            <div className="w-full xl:w-1/3 flex justify-center items-center px-6 py-10 bg-[#f9f9fb] h-screen">
                <div className="w-full max-w-[320px] md:max-w-[345px] backdrop-blur-lg bg-white/90 rounded-lg shadow-2xl p-6 md:p-8 space-y-8">
                    <h2 className="text-2xl font-bold text-blue-500 text-center md:text-2xl">
                        Upload Your Photo
                    </h2>

                    <div
                        className="relative w-48 h-48 mx-auto rounded-full border-4 border-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                        onClick={handleImageClick}
                    >
                        <img
                            src={imageUrl}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                            onClick={handleImageClick}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all">
                            <UploadCloud className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                    </div>

                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 md:py-3  rounded-xl text-md shadow-md transition duration-300 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save & Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Photo;
