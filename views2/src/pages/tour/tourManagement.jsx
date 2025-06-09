import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TourManagementPage() {
  const [tours, setTours] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editTourId, setEditTourId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFormState = {
    name: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'easy',
    price: '',
    summary: '',
    description: '',
    imageCover: '',
    secretTour: false,
    startLocation: {
      coordinates: [0, 0],
      address: '',
      description: '',
    },
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/api/v1/tours');
        setTours(response.data.data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tours');
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('startLocation.')) {
      const field = name.split('.')[1];
      setForm({
        ...form,
        startLocation: {
          ...form.startLocation,
          [field]: value,
        },
      });
    } else if (name === 'latitude' || name === 'longitude') {
      const newCoordinates = [...form.startLocation.coordinates];
      const index = name === 'longitude' ? 0 : 1;
      newCoordinates[index] = parseFloat(value) || 0;
      setForm({
        ...form,
        startLocation: {
          ...form.startLocation,
          coordinates: newCoordinates,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const tourData = {
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        maxGroupSize: parseInt(form.maxGroupSize),
      };

      if (isAdding) {
        const response = await axios.post('/api/v1/tours', tourData);
        setTours([...tours, response.data.data.data]);
      } else {
        await axios.patch(`/api/v1/tours/${editTourId}`, tourData);
        const updatedTours = tours.map((tour) =>
          tour.id === editTourId ? { ...tour, ...tourData } : tour
        );
        setTours(updatedTours);
        setEditTourId(null);
      }

      setForm(initialFormState);
      setIsAdding(false);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tour');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setIsAdding(false);
    setEditTourId(null);
  };

  const handleEditClick = (tour) => {
    setEditTourId(tour.id);
    setForm({
      name: tour.name,
      duration: tour.duration.toString(),
      maxGroupSize: tour.maxGroupSize.toString(),
      difficulty: tour.difficulty,
      price: tour.price.toString(),
      summary: tour.summary,
      description: tour.description,
      imageCover: tour.imageCover,
      secretTour: tour.secretTour,
      startLocation: {
        coordinates: [...tour.startLocation.coordinates],
        address: tour.startLocation.address,
        description: tour.startLocation.description,
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this tour?')) {
        await axios.delete(`/api/v1/tours/${id}`);
        setTours(tours.filter((tour) => tour.id !== id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete tour');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (isLoading && tours.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-2xl font-semibold text-emerald-700">
          Loading tours...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 font-inter text-lg">
      {/* Header Section with Natours-themed styling */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-800 to-green-600 bg-clip-text text-transparent">
                Tour Management
              </h1>
              <p className="text-emerald-700 mt-3 text-3xl font-medium">
                Manage your adventure tours and experiences
              </p>
            </div>
            {!isAdding && !editTourId && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-xl hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Tour
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add/Edit Tour Form with nature-inspired styling */}
        {(isAdding || editTourId) && (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white">
                {editTourId ? 'Edit Tour' : 'Create New Tour'}
              </h2>
              <p className="text-emerald-100 mt-2 text-2xl">
                {editTourId
                  ? 'Update the details of this adventure tour'
                  : 'Fill in the details below to add a new adventure tour'}
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  ['name', 'Tour Name *'],
                  ['duration', 'Duration (days) *'],
                  ['maxGroupSize', 'Max Group Size *'],
                  ['price', 'Price (USD) *'],
                  ['summary', 'Summary *'],
                  ['description', 'Description *'],
                  ['imageCover', 'Image Cover URL *'],
                ].map(([key, label]) => (
                  <div key={key} className="space-y-3">
                    <label className="block text-xl font-bold text-emerald-800">
                      {label}
                    </label>
                    <input
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${key}`}
                      className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all placeholder-emerald-300"
                    />
                  </div>
                ))}

                <div className="space-y-3">
                  <label className="block text-xl font-bold text-emerald-800">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl focus:border-emerald-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-xl font-bold text-emerald-800">
                    Secret Tour
                  </label>
                  <select
                    name="secretTour"
                    value={form.secretTour ? 'true' : 'false'}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        secretTour: e.target.value === 'true',
                      })
                    }
                    className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-emerald-100 pt-6">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                  Start Location
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-xl font-bold text-emerald-800">
                      Longitude
                    </label>
                    <input
                      name="longitude"
                      type="number"
                      placeholder="Longitude"
                      value={form.startLocation.coordinates[0]}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xl font-bold text-emerald-800">
                      Latitude
                    </label>
                    <input
                      name="latitude"
                      type="number"
                      placeholder="Latitude"
                      value={form.startLocation.coordinates[1]}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xl font-bold text-emerald-800">
                      Address
                    </label>
                    <input
                      name="startLocation.address"
                      value={form.startLocation.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xl font-bold text-emerald-800">
                      Description
                    </label>
                    <input
                      name="startLocation.description"
                      value={form.startLocation.description}
                      onChange={handleChange}
                      placeholder="Description"
                      className="w-full px-5 py-4 text-lg border-2 border-emerald-100 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none"
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {editTourId ? 'Update Tour' : 'Save Tour'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-10 py-4 bg-emerald-50 text-emerald-700 font-bold text-lg rounded-xl hover:bg-emerald-100 transition-all duration-200 border-2 border-emerald-100 disabled:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tours Grid with nature-themed cards */}
        {!isAdding && !editTourId && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-emerald-100 overflow-hidden group hover:scale-105"
                >
                  {tour.imageCover && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={`/img/tours/${tour.imageCover}`}
                        alt={tour.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                        {tour.difficulty}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-2 line-clamp-2">
                          {tour.name}
                        </h3>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-emerald-700">
                            <svg
                              className="w-4 h-4 mr-2 text-emerald-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-xl font-medium">
                              {tour.duration} days
                            </span>
                          </div>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-emerald-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-lg font-bold text-emerald-600">
                              ${formatPrice(tour.price)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-emerald-700 text-xl leading-relaxed line-clamp-3">
                        {tour.summary || tour.description}
                      </p>

                      <div className="flex gap-3 pt-4 border-t border-emerald-100">
                        <button
                          onClick={() => handleEditClick(tour)}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium text-xl"
                        >
                          Edit Tour
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-xl border border-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tours.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-12 max-w-md mx-auto">
                  <svg
                    className="w-16 h-16 text-emerald-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M5 11H5.01M12 11H12.01M19 11H19.01M6 11V16C6 17.6569 7.34315 19 9 19H15C16.6569 19 18 17.6569 18 16V11M14 11V7C14 5.34315 12.6569 4 11 4H13C14.6569 4 16 5.34315 16 7V11"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                    No tours available
                  </h3>
                  <p className="text-emerald-600 mb-6">
                    Get started by adding your first adventure tour
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Your First Tour
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
