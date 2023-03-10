import React, { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { Box, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    room: "",
  });
  const valid=()=>{
    
  }
  return (
    <Container padding="normal" maxWidth="sm">
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      ></Box>
      <Card sx={{ minWidth: 275, margin: 10 }}>
        <CardContent>
          <TextField
            onChange={(e) => setData({ ...data, name: e.target.value })}
            sx={{ marginBottom: 5 }}
            id="standard-basic"
            label="Name"
            variant="standard"
          />
          <TextField
            onChange={(e) => setData({ ...data, room: e.target.value })}
            id="standard-basic"
            label="Id"
            variant="standard"
          />
          <br />
          <Button
            onClick={() => {
              if (data.name === "" && data.room === "") {
                return;
              }
              navigate("/meet", { state: data });
            }}
            sx={{ margin: 5 }}
            variant="contained"
            color="success"
     
          >
            Join Rooom
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
