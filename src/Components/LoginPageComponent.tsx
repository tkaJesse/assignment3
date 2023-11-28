import React, { useState, useEffect } from 'react';
import './LoginPageComponent.css';

/**
 * Login PageComponent is the component that will be used to display the login page
 * If the user is logged in, then this component will display the list of documents
 * that the user has access to.  Each document will have a button that will allow the
 * user to edit the document. when the user clicks on the button, the user will be
 * taken to the document page.
 * @returns 
 */

import SpreadSheetClient from '../Engine/SpreadSheetClient';
import { spread } from 'axios';

interface LoginPageProps {
  spreadSheetClient: SpreadSheetClient;
}

function LoginPageComponent({ spreadSheetClient }: LoginPageProps): JSX.Element {
  const [userName, setUserName] = useState(window.sessionStorage.getItem('userName') || "");
  const [documents, setDocuments] = useState<string[]>([]);

  // SpreadSheetClient is fetching the documents from the server so we should
  // check every 1/20 of a second to see if the documents have been fetched
  useEffect(() => {
    const interval = setInterval(() => {
      const sheets = spreadSheetClient.getSheets();
      if (sheets.length > 0) {
        setDocuments(sheets);
      }
    }, 50);
    return () => clearInterval(interval);
  });

  function getUserLogin() {
    return <div>
      <input
        id='loginUserName'
        type="text"
        placeholder="User name"
        defaultValue={userName}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            const inputUserName = (event.target as HTMLInputElement).value;
            if (checkUserName(inputUserName)) {
              window.sessionStorage.setItem('userName', inputUserName);
              setUserName(inputUserName);
              spreadSheetClient.userName = inputUserName;
            }
          }
        }} />
    </div>

  }
  


  function checkUserName(name: string): boolean {
    if (name === "") {
      alert("Please enter a user name");
      return false;
    }
    if (name.length > 15) {
      alert("User name must be 15 characters or less");
      return false;
    }
    return true;
  }
  


  function loadDocument(documentName: string) {
    // set the document name
    spreadSheetClient.documentName = documentName;
    // reload the page

    // the href needs to be updated.   Remove /documnents from the end of the URL
    const href = window.location.href;
    const index = href.lastIndexOf('/');
    let newURL = href.substring(0, index);
    newURL = newURL + "/" + documentName
    window.history.pushState({}, '', newURL);
    window.location.reload();

  }


  function logout() {
    // clear the user name
    window.sessionStorage.setItem('userName', "");
    // reload the page
    window.location.reload();
  }


  

  function getLoginPanel() {
    const handleLogin = () => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        const inputUserName = inputElement.value;
        if (checkUserName(inputUserName)) {
          window.sessionStorage.setItem('userName', inputUserName);
          setUserName(inputUserName);
          spreadSheetClient.userName = inputUserName;
        }
      }
    };
      
  
    if (userName) {
      return (
        <div>
          <p>Welcome, {userName}</p>
          <button id ="logoutbtn" onClick={() => logout()}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          <h5>Please enter username</h5>
          {getUserLogin()}
          <button onClick={handleLogin}>Login</button>
        </div>
      );
    }
  }
  


  function buildFileSelector() {
    const sheets: string[] = spreadSheetClient.getSheets();
    return (
      <div>

        <table>
          <thead>
            <tr className="selector-title">
              <th>Document Name</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet, index) => (
              <tr key={index} className="selector-item">
                <td>{sheet}</td>
                <td>
                  <button id={sheet} onClick={() => loadDocument(sheet)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }


  

  return (
    <div className="LoginPageComponent">
      <div className="loginPanel">
        {getLoginPanel()}
      </div>
      <div className="documentSelector">
        {userName && buildFileSelector()}
      </div>
    </div>
  );
}

export default LoginPageComponent;