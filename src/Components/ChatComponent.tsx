import React, { useState, useEffect, useCallback, useRef } from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { BsEmojiSmile } from 'react-icons/bs';
import { MessageContainer } from "../Engine/GlobalDefinitions";
import ChatClient from "../Engine/ChatClient";
import './ChatComponent.css'


const chatClient = new ChatClient();


function ChatComponent() {
    const [messages, setMessages] = useState<MessageContainer[]>([]);
    const [mostRecentId, setMostRecentId] = useState<number>(0);
    const [user] = useState<string>(() => window.sessionStorage.getItem('userName') || "");
    const [message, setMessage] = useState("");
    const [filterUser, setFilterUser] = useState<string>("");
    const [searchMessage, setSearchMessage] = useState<string>("");
    const bottomRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(false);

    const [showUserFilterDropdown, setShowUserFilterDropdown] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<{ [key: string]: boolean }>({});

    const [showEmoji, setShowEmoji] = useState(false);
    const addEmoji = (e: { unified: string; }) => {
        const sym = e.unified.split('-');
        const codesArray: any[] = [];
        sym.forEach(el => codesArray.push('0x' + el));
        let emoji = String.fromCodePoint(...codesArray);
        setMessage(message + emoji);
        };

        

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    let localUser = user;
    let localMessage = message;
    const updateDisplay = useCallback(() => {
        if (chatClient.messages.length !== messages.length) {
            setMessages([...chatClient.messages]);
        }
    }, [messages]);

    useEffect(() => {
        chatClient.setCallback(updateDisplay);
    }, [updateDisplay]);

    useEffect(() => {
        const uniqueUsers = Array.from(new Set(messages.map(message => message.user)));
        const userObject = uniqueUsers.reduce((obj, user) => ({ ...obj, [user]: false }), {});
        setSelectedUsers(userObject);
    }, [messages]);

    const handleUserCheckboxChange = (username: string) => {
        setSelectedUsers(prev => ({ ...prev, [username]: !prev[username] }));
    };

    // Rendering the user filter dropdown
    const renderUserFilterDropdown = () => (
        <div className="user-filter-dropdown">
            {Object.keys(selectedUsers).map(user => (
                <div key={user}>
                    <input
                        type="checkbox"
                        id={`checkbox-${user}`}
                        checked={selectedUsers[user]}
                        onChange={() => handleUserCheckboxChange(user)}
                    />
                    <label htmlFor={`checkbox-${user}`}>{user}</label>
                </div>
            ))}
        </div>
    );


    function makeFormatedMessages() {
        let userFilterActive = filterUser.trim() !== ""; // Check if user filter input is active
        let checkboxFilterActive = Object.values(selectedUsers).some(val => val); // Check if any checkbox is selected

        let filteredMessages = messages.filter(message => {
            // Check if message matches search filter
            let messageMatch = message.message.toLowerCase().includes(searchMessage.toLowerCase());

            // Check if user matches the input box filter
            let inputBoxUserMatch = userFilterActive ? message.user.toLowerCase() === filterUser.toLowerCase().trim() : true;

            // Check if user matches the checkbox filter
            let checkboxUserMatch = checkboxFilterActive ? selectedUsers[message.user] : true;

            return messageMatch && inputBoxUserMatch && checkboxUserMatch;
        });

        return filteredMessages.reverse().map((message, index) => (
            <textarea id='chatMessageText' key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} ref={index === filteredMessages.length - 1 ? bottomRef : null} />
        ));
    }
     

    return (
        <div>
            <h1>Chat</h1>
            <button id='getMessageBtn' onClick={() => chatClient.getNextMessages()}>Get Older Messages</button>
            <div className="view-container">
                {!isMinimized && (
                    <div> 
                        <div className="filterComponent">
                            <input
                                className="search-filter"
                                type="text"
                                id="filterMessage"
                                placeholder="Search Message"
                                value={searchMessage}
                                onChange={(event) => setSearchMessage(event.target.value)}
                            />
                            <input
                                className="search-filter"
                                type="text"
                                id="filterUser"
                                placeholder="Filter Message by user"
                                value={filterUser}
                                onChange={(event) => setFilterUser(event.target.value)}
                            />
                            <button onClick={() => setShowUserFilterDropdown(!showUserFilterDropdown)}>Filter</button>
                            {showUserFilterDropdown && renderUserFilterDropdown()}
                        </div>
                        <div className="scrollable-text-view"> 
                            {makeFormatedMessages()}
                        </div>
                    </div>
                )}

                <div className="input-container">
                    <div className="chat-controls">
                        <button onClick={toggleMinimize}>
                            {isMinimized ? 'Maximize' : 'Minimize'}
                        </button>
                    </div>
                    <textarea
                        className="chat-input"
                        value={message}
                        id="message"
                        placeholder="Type a message..."
                        cols={68}
                        rows={2}
                        onChange={(event) => setMessage(event.currentTarget.value)} 
                        onKeyUp={(event) => {
                            localMessage = event.currentTarget.value;
                            setMessage(event.currentTarget.value);
                            if (event.key === "Enter") {
                                chatClient.sendMessage(localUser, localMessage);
                                event.currentTarget.value = "";
                                setMessage("");
                            }
                        }}
                    >    
                    </textarea>

                    <span                         
                        onClick={() => {
                            setShowEmoji(!showEmoji)
                        }}
                        className="emoji-icon"
                    >
                    <BsEmojiSmile/>
                    </span>  
                    {showEmoji && 
                        <div className="picker">
                            <Picker
                                data={data}
                                maxFrequentRows={1}
                                emojiSize={20}
                                emojiButtonSize={28}
                                onEmojiSelect={addEmoji} 
                                previewPosition="none"
                                searchPosition="none"
                            />
                        </div>
                        }
                        <button id='sendBtn' onClick={() => {
                            chatClient.sendMessage(localUser, localMessage);
                            setMessage("");
                            setFilterUser("");
                        }}>Send</button>

                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
                        


