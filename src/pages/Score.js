import React from "react";
import { useLocation } from "react-router-dom";

const Score = () => {
  const location = useLocation().state;
  return (
    <div>
      <h1>{location.score}</h1>
      <h1>{location.acc}</h1>
      <h1>{location.speed}</h1>
    </div>
  );
};

export default Score;
