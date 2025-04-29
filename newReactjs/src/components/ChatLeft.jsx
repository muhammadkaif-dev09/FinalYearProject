import React from 'react';
import edit from '../assets/edit.png' 

const ChatLeft = ({ userData, followers, onSelectUser, selectedUser }) => {
  return (
    <div className='w-full h-full px-3 sm:px-6 py-7 border-r border-gray-300 flex flex-col'>
      <div className="sm:px-0 px-2">
        <h2 className="text-4xl font-semibold mb-5 text-[#2B6EA0]">Chat</h2>
        <div className='flex justify-between'>
          <h1 className='font-bold text-xl text-[#1f4868]'>{userData?.username}</h1>
          <img src={edit} alt="" className='w-6 h-6 cursor-pointer mr-1' />
        </div>
        <div className="h-[0.5px] bg-gray-500 my-5"></div>
      </div>

      <div className='flex bg-transparent w-full justify-between pt-1 pb-3'>
        <h3 className='font-bold'>Messages</h3>
        <p className='text-slate-500 font-semibold cursor-pointer'>Requests</p>
      </div>

      <div className="overFlow overflow-y-auto flex-1">
        {followers.map((follower) => (
          <div key={follower._id} className={`min-w-full flex items-center gap-x-3 mb-1 cursor-pointer py-2 px-[4px] rounded flex-row text-left ${(selectedUser && selectedUser._id) == follower._id ? 'bg-[#e5f3ff] border-l-4 border-[#2B6EA0]' : 'hover:bg-[#e5f3ff] hover:border-l-4 hover:border-[#2B6EA0]'}`} onClick={() => onSelectUser(follower)}>
            <img src={follower.profilePhoto} alt={follower.username} className="w-[60px] h-[60px] object-cover aspect-square rounded-full border-2 border-[#2B6EA0] p-[2px] flex-shrink-0" />
            <div className="w-full overflow-hidden">
              <p className="font-medium truncate">{follower.username}</p>
              <p className="text-xs text-gray-500 truncate">You have sent an attachment. <span>1 hour</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatLeft;