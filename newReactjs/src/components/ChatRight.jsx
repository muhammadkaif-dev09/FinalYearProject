import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logos from '../assets/logos.png';
import dot from '../assets/dots.png';
import back from '../assets/back.png';
import { FaTrashAlt } from 'react-icons/fa'
import { href, Link } from 'react-router-dom';

const ChatRight = ({ userData, selectedUser, socket, setSelectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showDelete, setShowDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!userData._id || !selectedUser._id) return;
  
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/message/getmessage/${selectedUser._id}`, {
          withCredentials: true,
        });
        setMessages(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchMessages();
  }, [userData, selectedUser]);

  useEffect(() => {
    if (!userData._id || !selectedUser._id) return;
  
    setLoading(true);
  
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 700);
  
    return () => clearTimeout(timeoutId);
  }, [selectedUser, userData]);
  

  useEffect(() => {
    if (socket && userData._id) {
      socket.emit('addUser', userData._id);
      socket.on('getMessage', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
  }, [socket, userData]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const res = await axios.post(
        `/api/message/sendmessage/${selectedUser._id}`,
        {
          text: newMessage,
          sender: userData._id,
          receiver: selectedUser._id,
        },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, res.data.data]);
      socket.emit('sendMessage', {
        senderId: userData._id,
        receiverId: selectedUser._id,
        text: newMessage,
      });
      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`/api/message/deletemessage/${id}`, {
        withCredentials: true,
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      setShowDelete(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteAll = () => {
    setMessages((prev) => prev.filter((msg) => msg.sender !== userData._id && msg.receiver !== userData._id));
    setShowMenu(false);
  };

  const handleDeleteOnlyMine = () => {
    setMessages((prev) => prev.filter((msg) => msg.sender !== userData._id));
    setShowMenu(false);
  };

  return (
    <div className="relative flex flex-col h-full sm:mx-3">
      <div className="absolute inset-0 flex justify-center items-center">
        <img src={logos} alt="Logo" className="w-36 h-36 opacity-40 transition-all duration-300 ease-in-out" />
      </div>

      <div className="pr-6 py-1 sm:py-3 border-b border-[#4a8bbe] z-10 flex justify-between items-center">
        <div className="flex items-center ">
          <img src={back} alt="back" className={`w-10 h-10 ${selectedUser ? "sm:hidden block" : "hidden"}`} onClick={() => setSelectedUser(null)} />

          <Link to={`/profilelayout/${selectedUser._id}`} className="cursor-pointer">

              <div className="flex items-center gap-2 sm:pl-4">
                <img
                   src={selectedUser.profilePhoto}
                   alt=""
                   className="w-12 h-12 border-2 border-[#4f7c9f] p-[2px] rounded-full object-cover"
                 />
                <div>
                    <h2 className="font-bold text-[18px] text-[#245b85]">{selectedUser.username}</h2>
                    <p className="text-xs text-gray-500">Last seen 5 ago</p>
                </div>
              </div>
          </Link>

        </div>
        <div>
          <img src={dot} alt="menu" className='w-6 cursor-pointer' onClick={() => setShowMenu((prev) => !prev)} />
        </div>
      </div>

      {showMenu && (
        <div className="absolute right-6 top-16 bg-white shadow-lg rounded-lg py-2 w-48 z-50">
          <button
            onClick={handleDeleteAll}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Delete All
          </button>
          <button
            onClick={handleDeleteOnlyMine}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Delete Only My Messages
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 overFlow">
        {loading ? (
          <div className="flex flex-col items-center justify-end h-full space-y-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#2B6EA0] animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-[#2B6EA0] animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-[#2B6EA0] animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <p className="text-gray-500 font-semibold text-[16px]">Loading messages...</p>
        </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center h-full">
            <p className="text-lg font-semibold text-[#2B6EA0]">No messages yet</p>
            <p className="text-sm text-gray-500">Start the conversation!</p>
          </div>
        ) : (messages.map((msg) => {
            const isOwn = msg.sender === userData._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} relative items-center`}
                onMouseEnter={() => setShowDelete(msg._id)}
                onMouseLeave={() => setShowDelete(null)}
              >
                <div
                  className={`max-w-[60%] sm:max-w-[40%] h-auto px-4 py-1 text-[16px] rounded-xl mr-1 ${
                    isOwn? 'bg-gradient-to-tr from-[#497597] via-[#428cc4] to-[#85b5da] text-white': 'bg-gray-200 text-black'
                  } break-words overflow-hidden flex flex-col`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  <span className="w-full break-words">{msg.text}</span>
          
                  <div className="flex justify-end mt-1">
                    <p className="text-[10px]">7:30 am</p>
                  </div>
                </div>
          
                {isOwn && showDelete === msg._id && (
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="w-8 h-8 bg-white text-red-500 rounded-full p-1 hover:bg-red-100 transition-all flex justify-center items-center"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                )}
              </div>
            );
          })
          
        )}
      </div>

      <div className="p-4 flex items-center gap-2 z-10">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="bg-[#2B6EA0] text-white px-4 py-2 rounded-lg hover:bg-[#245881] transition-all"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>

  );
};

export default ChatRight;
