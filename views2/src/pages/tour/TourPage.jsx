// TourPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TourDetail from './TourDetail'; // Import the TourDetail component

const TourPage = ({ user }) => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState(null);

  // API request to fetch tour data
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        console.log(id);
        const response = await axios.get(`/api/v1/tours/${id}`);
        // console.log(response.data);
        setTour(response.data.data.data);
      } catch (err) {
        console.log(err?.message);
        setError('Could not fetch tour data.');
      }
    };

    fetchTourData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!tour) return <div>Loading...</div>;

  return (
    <div>
      <TourDetail tour={tour} user={user} />
    </div>
  );
};

export default TourPage;
