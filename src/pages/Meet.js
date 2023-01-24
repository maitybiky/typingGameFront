import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Container } from "@mui/system";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AssasianCreedTheme } from "./Style";
import { TextField } from "@mui/material";
const containerStyle = {
  width: "40vw",
  height: "50vh",
};

const center = {
  lat: 22.572,
  lng: 88.3639,
};
let socket;
var meloc;
const Meet = () => {
  const userData = useLocation().state;
  // console.log("userData", userData);
  const [myLocation, setMyLocation] = useState(center);
  const [remoteData, setRemoteData] = useState();
  const [chat, setChat] = useState("");
  useEffect(() => {
    socket = io("localhost:4000");
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        // console.log("hello");
        socket.emit("join", { userData, pos });
        upDateLc();
        socket.on("joined-user", (joinedUserData) => {
          setRemoteData(joinedUserData);
        });
        setMyLocation(pos);
      }
    );
    socket.on("join-alert", (data) => {
      toast(data.userData.name + " join");
      setRemoteData(data);
    });

    socket.on("rescieve_message", (data) => {
      toast(data.userData.name + ":" + data.chat);
      // setRemoteData(data);
    });
    socket.on("location_up", (remData) => {
      setRemoteData(remData);
    });
    return () => {
      socket.emit('disconnect')
        socket.disconnect();
    };
  }, []);

  console.log("remoteData", remoteData);
  const upDateLc = () => {
    // console.log("myLocation", myLocation);
    setInterval(() => {
      let loc = { pos: meloc, userData };
      // console.log(loc);
      socket.emit("location", loc);
    }, 10000);
  };
  // useEffect(() => {

  // }, [remoteData]);
  useEffect(() => {
    meloc = myLocation;
  }, [myLocation]);

  // console.log("myLocation", myLocation);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDoTIrlJxHd9rTLoytrigY9piIQk1OcTJk",
  });

  return (
    <div style={{ marginTop: 10 }}>
      <Container>
        <div  style={{display:'flex',justifyContent:'center' ,alignItems:'center' ,width:'90vw'}}>
          <div className="map_div">
        {isLoaded ? (
          <GoogleMap
            options={{
              styles: AssasianCreedTheme,
            }}
            mapContainerStyle={containerStyle}
            center={{
              lat: Number(myLocation.lat),
              lng: Number(myLocation.lng),
            }}
            zoom={9}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {myLocation && <Marker position={myLocation} />}
            {remoteData && <Marker position={remoteData.pos} />}
          </GoogleMap>
        ) : (
          <></>
        )}
        </div>
        </div>
        {/* <BsFillChatFill/> */}
        <TextField
          onChange={(e) => setChat(e.target.value)}
          sx={{ margin: 5 }}
          id="standard-basic"
          label="Type a massage"
          variant="standard"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              // Cancel the default action, if needed
              e.preventDefault();
              // Trigger the button element with a click
              socket.emit("chat", { chat, userData });
              setChat("");
            }
          }}
        />
      </Container>
    </div>
  );
};

export default Meet;
