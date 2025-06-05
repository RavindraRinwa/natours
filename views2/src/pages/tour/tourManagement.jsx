import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TourManagementPage() {
  const [tours, setTours] = useState([]);
  const [editTourId, setEditTourId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'easy',
    price: '',
    summary: '',
    description: '',
    imageCover: '',
    images: [],
    startDates: [],
    secretTour: false,
    startLocation: {
      type: 'Point',
      coordinates: ['', ''],
      address: '',
      description: '',
    },
    guides: [],
    locations: [],
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/v1/tours/');
        setTours(response.data?.data?.data || []);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to load tours. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTours();
  }, []);

  const handleEditClick = (tour) => {
    setEditTourId(tour.id);
    setForm({
      name: tour.name || '',
      duration: tour.duration || '',
      price: tour.price || '',
      description: tour.description || '',
      image: tour.image || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle longitude and latitude for startLocation.coordinates
    if (name === 'longitude' || name === 'latitude') {
      setForm((prev) => ({
        ...prev,
        startLocation: {
          ...prev.startLocation,
          coordinates: [
            name === 'longitude' ? value : prev.startLocation.coordinates[0],
            name === 'latitude' ? value : prev.startLocation.coordinates[1],
          ],
        },
      }));
    }
    // Handle nested startLocation fields
    else if (name.startsWith('startLocation.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        startLocation: {
          ...prev.startLocation,
          [field]: value,
        },
      }));
    }
    // Handle all other fields
    else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (editTourId) {
        // Update existing tour
        const response = await axios.patch(`/api/v1/tours/${editTourId}`, form);
        setTours((prev) =>
          prev.map((t) => (t.id === editTourId ? response.data.data : t))
        );
        setEditTourId(null);
      } else {
        // Add new tour
        const response = await axios.post('/api/v1/tours/', form);
        setTours((prev) => [...prev, response.data.data]);
        setIsAdding(false);
      }

      setForm({
        name: '',
        duration: '',
        price: '',
        description: '',
        image: '',
      });
    } catch (error) {
      console.error('Save error:', error);
      setError(error.response?.data?.message || 'Failed to save tour');
    }
  };

  const handleCancel = () => {
    setEditTourId(null);
    setIsAdding(false);
    setForm({ name: '', duration: '', price: '', description: '', image: '' });
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/tours/${id}`);
      setTours(tours.filter((tour) => tour.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete tour');
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0';
    return `${Number(price).toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error && tours.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Tours
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-inter text-lg">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Tour Management
              </h1>
              <p className="text-slate-600 mt-3 text-3xl font-medium">
                Manage your tour packages and experiences
              </p>
            </div>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
        {/* Add New Tour Form */}
        {isAdding && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-3xl font-bold text-white">Create New Tour</h2>
              <p className="text-blue-100 mt-2 text-2xl">
                Fill in the details below to add a new tour package
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
                    <label className="block text-xl font-bold text-slate-700">
                      {label}
                    </label>
                    <input
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${key}`}
                      className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-slate-400"
                    />
                  </div>
                ))}

                <div className="space-y-3">
                  <label className="block text-xl font-bold text-slate-700">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="difficult">Difficult</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-xl font-bold text-slate-700">
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
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Start Location
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <input
                    name="longitude"
                    type="number"
                    placeholder="Longitude"
                    value={form.startLocation.coordinates[0]}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl"
                  />
                  <input
                    name="latitude"
                    type="number"
                    placeholder="Latitude"
                    value={form.startLocation.coordinates[1]}
                    onChange={handleChange}
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl"
                  />
                  <input
                    name="startLocation.address"
                    value={form.startLocation.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl"
                  />
                  <input
                    name="startLocation.description"
                    value={form.startLocation.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Tour
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center px-10 py-4 bg-slate-100 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-200 transition-all duration-200 border-2 border-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Tours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div
              key={tour?.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group hover:scale-105"
            >
              {tour?.imageCover && (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`/img/tours/${tour.imageCover}`}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <div className="p-6">
                {editTourId === tour?.id ? (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xl font-semibold text-slate-700 mb-2">
                          Tour Name
                        </label>
                        <input
                          name="name"
                          value={form?.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xl font-semibold text-slate-700 mb-2">
                            Duration
                          </label>
                          <input
                            name="duration"
                            value={form?.duration}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xl font-semibold text-slate-700 mb-2">
                            Price ($)
                          </label>
                          <input
                            name="price"
                            type="number"
                            value={form?.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xl font-semibold text-slate-700 mb-2">
                          Image URL
                        </label>
                        <input
                          name="image"
                          value={form?.image}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xl font-semibold text-slate-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={form?.description}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium border border-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                        {tour?.name}
                      </h3>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-slate-600">
                          <svg
                            className="w-4 h-4 mr-2 text-blue-500"
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
                            {tour?.duration}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-green-500"
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
                          <span className="text-lg font-bold text-green-600">
                            ${formatPrice(tour.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xl leading-relaxed line-clamp-3">
                      {tour?.description}
                    </p>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleEditClick(tour)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-xl"
                      >
                        Edit Tour
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium text-sm border border-red-200 text-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {tours.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No tours available
              </h3>
              <p className="text-slate-500 mb-6">
                Get started by adding your first tour package
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
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
      </div>
    </div>
  );
}
