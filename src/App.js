import "./App.css";
import { io } from "socket.io-client";

import { useEffect } from "react";

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :(",
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

let isMounted = false;
let msgerChat;

let socket;

let roomId = "";

let userSocket;

function App() {


  useEffect(() => {
    if (isMounted) return;


    msgerChat = get(".msger-chat");
    socket = io("http://localhost:3002/");


    userSocket = io("http://localhost:3002/user", {
      auth: { token: 'my-token' },
    });

    document.addEventListener("keydown", (e) => {
      if (e.target.matches("input")) return;
  
      if (e.key === "c") socket.connect();
      if (e.key === "d") socket.disconnect();
    });
    let count = 0;
    setInterval(() => {
      console.log('here');
      socket.volatile.emit("ping", ++count);
    }, 2000);

    socket.on("connect", () => {
      appendMessage(
        PERSON_NAME,
        PERSON_IMG,
        "right",
        `you connected with id : ${socket.id}`
      );
      // socket.emit("custom-event", 100, 900);
    });

    socket.on("receive-message", (message) => {
      appendMessage(BOT_NAME, BOT_IMG, "left", message);
    });

    userSocket.on("connect_error", (error) => {
      console.log(error, "userSocket message");
      appendMessage(BOT_NAME, BOT_IMG, "left", error);
    });

    console.log(socket, "socket");
    isMounted = true;
  }, []);

  // msgerFormJoin.addEventListener("submit", (event) => {
  //   event.preventDefault();

  //   const msgJoin = msgerJoin.value;
  //   console.log(msgJoin, "msgJoin");

  //   if (!msgJoin) return;

  //   appendMessage(PERSON_NAME, PERSON_IMG, "right", msgJoin);
  //   msgerInput.value = "";

  //   botResponse();
  // });

  // msgerForm.addEventListener("submit", (event) => {
  //   event.preventDefault();

  //   const msgText = msgerInput.value;
  //   console.log(msgText, "msgText");

  //   if (!msgText) return;

  //   appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  //   msgerInput.value = "";

  //   botResponse();
  // });

  const onSendClick = (event) => {
    event.preventDefault();

    const msgText = document.getElementsByClassName("msger-input")[0].value;
    console.log(msgText, "msgText");

    if (!msgText) return;

    // socket.emit("send-message", msgText);
    socket.emit("send-message", msgText, roomId);

    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    document.getElementsByClassName("msger-input")[0].value = "";

    // botResponse();
  };

  const onJoinClick = (event) => {
    event.preventDefault();

    const msgJoin = document.getElementsByClassName("msger-join")[0].value;

    console.log(msgJoin, "msgJoin");

    if (!msgJoin) return;

    roomId = msgJoin;

    // appendMessage(PERSON_NAME, PERSON_IMG, "right", msgJoin);
    document.getElementsByClassName("msger-input")[0].value = "";

    // next steps

    socket.emit("join-room", roomId, (msg) => {
      appendMessage(PERSON_NAME, PERSON_IMG, "right", msg);
    });

    // botResponse();
  };

  function appendMessage(name, img, side, text) {
    //   Simple solution for small apps
    const msgHTML = `
          <div class="msg ${side}-msg">
            <div class="msg-img" style="background-image: url(${img})"></div>
      
            <div class="msg-bubble">
              <div class="msg-info">
                <div class="msg-info-name">${name}</div>
                <div class="msg-info-time">${formatDate(new Date())}</div>
              </div>
      
              <div class="msg-text">${text}</div>
            </div>
          </div>
        `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
  }

  function botResponse() {
    const r = random(0, BOT_MSGS.length - 1);
    const msgText = BOT_MSGS[r];
    const delay = msgText.split(" ").length * 100;

    setTimeout(() => {
      appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    }, delay);
  }

  // Utils
  function get(selector, root = document) {
    return root.querySelector(selector);
  }

  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  return (
    <section class="msger">
      <header class="msger-header">
        <div class="msger-header-title">
          <i class="fas fa-comment-alt"></i> SimpleChat
        </div>
        <div class="msger-header-options">
          <span>
            <i class="fas fa-cog"></i>
          </span>
        </div>
      </header>

      <main class="msger-chat">
        <div class="msg left-msg">
          <div
            class="msg-img"
            style={{
              backgroundImage: `url(https://image.flaticon.com/icons/svg/327/327779.svg)`,
            }}
          ></div>

          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">BOT</div>
              <div class="msg-info-time">12:45</div>
            </div>

            <div class="msg-text">
              Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
            </div>
          </div>
        </div>

        <div class="msg right-msg">
          <div
            class="msg-img"
            style={{
              backgroundImage: `url(https://image.flaticon.com/icons/svg/145/145867.svg)`,
            }}
          ></div>

          <div class="msg-bubble">
            <div class="msg-info">
              <div class="msg-info-name">Sajad</div>
              <div class="msg-info-time">12:46</div>
            </div>

            <div class="msg-text">You can change your name in JS section!</div>
          </div>
        </div>
      </main>

      <form class="msger-inputarea">
        <input
          type="text"
          class="msger-input"
          placeholder="Enter your message..."
        />
        <button onClick={onSendClick} type="submit" class="msger-send-btn">
          Send
        </button>
      </form>

      <form class="msger-joinarea">
        <input type="text" class="msger-join" placeholder="Enter Room" />
        <button onClick={onJoinClick} type="submit" class="msger-send-btn">
          Join
        </button>
      </form>
    </section>
  );
}

export default App;
