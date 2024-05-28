import {
  inputEnabled,
  setDiv,
  token,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showJobs } from "./jobs.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
  loginDiv = document.getElementById("logon-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");

  loginDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === logonButton) {
        enableInput(false);
  
        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // Include the email and password in the request body
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          });
  
          const data = await response.json();
          // If the response was successful (status 200-299), display a success message
          if (response.ok) {
            message.textContent = `Logon successful.  Welcome ${data.user.name}`;
            // Store the token
            setToken(data.token);
          // Clear the email and password fields
            email.value = "";
            password.value = "";
  
            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          // If an error occurred, log it and display a generic error message
          console.error(err);
          message.textContent = "A communications error occurred.";
        }
  
        enableInput(true);
      } else if (e.target === logonCancel) {
        // If the cancel button was clicked, clear the email and password fields and show the login/register screen
        email.value = "";
        password.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showLogin = () => {
  email.value = null;
  password.value = null;
  setDiv(loginDiv);
};