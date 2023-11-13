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
    const bottomRef = useRef(null);


    let localUser = user;
    let localMessage = message;
    const updateDisplay = useCallback(() => {
        let updateNeeded = false;
        const newLastId = chatClient.messages[0].id;
        if (newLastId !== mostRecentId) {
            updateNeeded = true;
        }
        if (chatClient.previousMessagesFetched) {
            updateNeeded = true;
            chatClient.previousMessagesFetched = false;
        }
        if (!updateNeeded) {
            return;
        }

        let newMessages = [...chatClient.messages];

        setMessages(newMessages);
        setMostRecentId(newLastId);
    }, [mostRecentId, messages]);

    useEffect(() => {
        chatClient.setCallback(updateDisplay);
    }, [updateDisplay]);


    function makeFormatedMessages() {
        let slicedMessages = messages.slice(-20);
        let formatedMessages = slicedMessages.reverse().map((message, index, array) => {
            if (index === array.length - 1) { // if this is the last message
                return <textarea key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} ref={bottomRef} />
            } else {
                return <textarea key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} />
            }
        });
        return formatedMessages;
    }

    return (
        <div>
            <h1>Chat</h1>
            <button onClick={() => chatClient.getNextMessages()}>Get Older Messages</button>
            <div className="view-container">
                <div className="scrollable-text-view">
                    {makeFormatedMessages()}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        id="message"
                        placeholder={message}
                        onKeyUp={(event) => {
                            localMessage = event.currentTarget.value;
                            setMessage(event.currentTarget.value);
                            if (event.key === "Enter") {
                                chatClient.sendMessage(localUser, localMessage);
                                // Clear the message
                                event.currentTarget.value = "";
                                setMessage("");
                            }
                        }}
                    />
                    <button onClick={() => chatClient.sendMessage(localUser, localMessage)}>Send</button>
                </div>
            </div>
        </div>
    );
    
}

export default ChatComponent;
