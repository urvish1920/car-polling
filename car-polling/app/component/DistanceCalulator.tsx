import axios from "axios";
import React, { useEffect, useState } from "react";

interface DistanceCalculatorProps {
  origin: string;
  destination: string;
}

const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({
  origin,
  destination,
}) => {
  const [distance, setDistance] = useState<string>("");
  useEffect(() => {
    const findDistance = async (source: string, destination: string) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/googleMap?source=${source}&destination=${destination}`
        );

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log(data.data);
        setDistance(data.data);
      } catch (error) {
        console.error("Error fetching distance:", error);
      }
    };
    findDistance(origin, destination);
  }, [origin, destination]);

  return <span>{distance}</span>;
};

export default DistanceCalculator;
