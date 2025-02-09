import React, { useState, useEffect } from 'react';
import ToursList from '../tour/ToursList'; // Assuming the file is named ToursList.jsx

const Overview = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    // Fetch the tour data from your API
    const fetchTours = async () => {
      try {
        const response = await fetch('/api/v1/tours'); // Adjust URL as needed
        const data = await response.json();
        setTours(data.data.data);
        // Set the fetched tours in state
        // console.log(data.data.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours(); // Trigger the fetch on component mount
  }, []);

  return <ToursList tours={tours} />;
};

export default Overview;
