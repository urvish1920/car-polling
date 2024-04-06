"use client";
import React from "react";

type propsType = {
  error: Error & { Digest?: string };
  reset: () => void;
};

const error = ({ error, reset }: propsType) => {
  return (
    <div className="m-2">
      <h1>{error.message}</h1>
      <button className="bg-blue-300 rounded p-2" onClick={() => reset()}>Refersh</button>
    </div>
  );
};
