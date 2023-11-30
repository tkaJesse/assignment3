import React, { useState, useEffect, useCallback, useRef } from "react";

import { MessageContainer } from "../Engine/GlobalDefinitions";

import ChatClient from "../Engine/ChatClient";
import './ChatComponent.css'


const chatClient = new ChatClient();


function ChatComponent() {
    const [messages, setMessages] = useState<MessageContainer[]>([]);
    const [mostRecentId, setMostRecentId] = useState<number>(0);
    const [user] = useState<string>(() => window.sessionStorage.getItem('userName') || "");
    const [message, setMessage] = useState<string>("Hello World");
    const [filterUser, setFilterUser] = useState<string>("");
    const [searchMessage, setSearchMessage] = useState<string>("");
    const bottomRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(false);

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

    function makeFormatedMessages() {
        let filteredMessages1 = messages.filter((message) => {
            return message.message.toLowerCase().includes(searchMessage.toLowerCase());
        });


        let filteredMessages = filteredMessages1.filter((message) => {
            return message.user.toLowerCase().includes(filterUser.toLowerCase());
        });

        

        let formatedMessages = [...filteredMessages].reverse().map((message, index, array) => {
            if (index === array.length - 1) { // if this is the last message
                return <textarea id='chatMessageText' key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} ref={bottomRef} />
            } else {
                return <textarea id='chatMessageText' key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} />
            }
        });
        return formatedMessages;
    }    

    return (
        <div>
            <h1>Chat</h1>
            <button id='getMessageBtn' onClick={() => chatClient.getNextMessages()}>Get Messages</button>
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
                        <button onClick={() => chatClient.getNextMessages()}>Get Messages</button>
                    </div>
                    <input
                        type="text"
                        id="message"
                        placeholder={message}
                        onKeyUp={(event) => {
                            localMessage = event.currentTarget.value;
                            setMessage(event.currentTarget.value);
                            if (event.key === "Enter") {
                                chatClient.sendMessage(localUser, localMessage);
                                event.currentTarget.value = "";
                                setMessage("");
                            }
                        }}
                    />
                    
                    <button id='sendBtn' onClick={() => chatClient.sendMessage(localUser, localMessage)}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
                        


