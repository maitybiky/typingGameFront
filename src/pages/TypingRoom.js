import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import { Button, TextField } from "@mui/material";
import randomSentence from "random-sentence";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
var intv = null;
var cint = null;
let socket;
export default function TypingRoom() {
  const navigate = useNavigate();
  const location = useLocation().state;
  console.log("location", location);
  //   const [sent, setSent] = React.useState(Array.from('hellohello'));
  let randsen = randomSentence();
  let wordnum = randsen.split(" ");
  console.log("first", wordnum);
  const [sent, setSent] = useState(Array.from(randsen));
  const [accur, setaccur] = useState(0);
  const [key, setKey] = useState();
  const [totalkey, setTotalKey] = useState([]);
  const [remoteSent, setRemoteSent] = useState([]);
  const [start, setStart] = useState(false);
  const [second, setScond] = useState(0);
  const [oppReady, setOppReady] = useState(false);
  const [meReady, setMeReady] = useState(false);
  const [remoteUserData, setRemoteData] = useState();
  const [remoteResult, setRemoteResult] = useState();
  const [myResult, setMyResult] = useState();
  let rname;
  console.log("Array.from(te");
  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.emit("join_room", { location, sent });
    socket.on("join-alert", (data) => {
      setSent(data.sent);
      setRemoteData(data.location);
      rname=data.location.name
      toast(data.location.name + " joined!!!");
    });
    socket.on("remoteType", (data) => {
      setRemoteSent(data);
    });
    socket.on("opponent_ready", () => {
      setOppReady(true);
    });
    socket.on("joined-user", (data) => {
      setRemoteData(data);
    });
    socket.on("remoteResult", (data) => {
      setRemoteResult(data);
    });
    socket.on("dis", () => {
      toast.error(rname + " has left !!!");
    });
    return () => {
      // socket.emit("disconnect");
      socket.disconnect();
    };
  }, []);

  const handleType = (e) => {
    window.scrollTo(0, 0);
    let i = e.target.value;
    let arr = [...totalkey];
    arr.push(i);
    setTotalKey(arr);
    socket.emit("typing", arr);
    // console.log(i);
    i = "";
    setKey("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      setaccur(accur + 1);
      let tt = [...totalkey];
      tt.pop();
      setTotalKey(tt);
    }
  };
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      clearInterval(cint);
      setCnt(false);
      setStart(false);
      let res = sent.filter((it, ind) => {
        return it !== totalkey[ind];
      });
      let resii = {
        score: `Score ${(100 - (res.length / sent.length) * 100).toFixed(1)}%`,
        acc: `Accuracy ${(100 - (accur / sent.length) * 100).toFixed(2)}%`,
        speed: `Speed ${((wordnum.length / second) * 60).toFixed(2)} word/min`,
      };
      socket.emit("result", resii);
      setMyResult(resii);
    }
  };
  const [cnt, setCnt] = React.useState(false);
  React.useEffect(() => {
    if (cnt) {
      clearInterval(intv);

      setTimeout(() => {
        cint = setInterval(() => {
          setScond((prev) => prev + 1);
        }, 1000);
        setStart(true);
      }, 1000);
    }
  }, [cnt]);

  const startCount = () => {
    setCnt(false);
    let c = 3;
    intv = setInterval(() => {
      toast(`${c}`, {
        duration: 1000,
        position: "top-center",
        style: { fontWeight: 900, color: "white", background: "black" },
      });
      c -= 1;
      if (c === 0) {
        setCnt(true);
      }
    }, 1000);
  };
  const readyF = () => {
    socket.emit("ready");
    setMeReady(true);
  };
  React.useEffect(() => {
    if (oppReady && meReady) {
      startCount();
    }
  }, [oppReady, meReady]);

  console.log("arr", remoteUserData);
  return (
    <div className="cont">
      <div className="child">
        <div className="output">
          <div
            style={{
              color: "white",
              overflowWrap: "anywhere",
              margin: 5,
              fontSize: "1rem",
              fontFamily: "Arial Black",
            }}
          >
            {sent.map((it, ind) => {
              return (
                <span
                  style={{
                    color: `${
                      totalkey[ind] === it
                        ? "green"
                        : totalkey[ind] === undefined
                        ? "white"
                        : "red"
                    }`,
                    margin: 1,
                  }}
                >
                  {it === " " ? (
                    totalkey[ind] === undefined ? (
                      <span style={{ color: "rgba(0, 0, 0, 0)" }}>_</span>
                    ) : (
                      "_"
                    )
                  ) : (
                    it
                  )}
                </span>
              );
            })}
          </div>
          {/* <Button color="secondary" onClick={startCount} variant="outlined">
            {cnt ? `${second}` : "Start in 3 second"}
          </Button> */}
          <div className="result">
            <h3>{myResult?.score}</h3>
            <h3>{myResult?.acc}</h3>
            <h3>{myResult?.speed}</h3>
          </div>
          <Button color="secondary" onClick={readyF} variant="outlined">
            {cnt ? `${second}` : "Ready"}
          </Button>
        </div>
        <div className="typing">
          <TextField
            onKeyDown={handleKeyDown}
            value={key}
            onChange={(e) => {
              if (!start) {
                setKey("");
                return;
              }
              if (totalkey.length < sent.length) {
                handleType(e);
              }
            }}
           
            fullWidth
            id="fullWidth"
            onKeyPress={handleEnter}
          />
        </div>
      </div>
      <div className="child">
        <Toaster />
        <div className="output">
          <div
            style={{
              color: "white",
              overflowWrap: "anywhere",
              margin: 5,
              fontSize: "1rem",
              fontFamily: "Arial Black",
            }}
          >
            {sent.map((it, ind) => {
              return (
                <span
                  style={{
                    color: `${
                      remoteSent[ind] === it
                        ? "green"
                        : remoteSent[ind] === undefined
                        ? "white"
                        : "red"
                    }`,
                    margin: 1,
                  }}
                >
                  {it === " " ? (
                    remoteSent[ind] === undefined ? (
                      <span style={{ color: "rgba(0, 0, 0, 0)" }}>_</span>
                    ) : (
                      "_"
                    )
                  ) : (
                    it
                  )}
                </span>
              );
            })}
          </div>
          <div className="result">
            <h3>{remoteResult?.score}</h3>
            <h3>{remoteResult?.acc}</h3>
            <h3>{remoteResult?.speed}</h3>
          </div>
          <Button
            color={oppReady ? "success" : "secondary"}
            variant="contained"
          >
            {oppReady ? "Opponent is ready" : "Not Ready"}
          </Button>
        </div>
        <div className="typing">
          <TextField value={remoteUserData?.name} fullWidth id="fullWidth" />
        </div>
      </div>{" "}
    </div>
  );
}
