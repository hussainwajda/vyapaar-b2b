// src/components/ManufacturerMenu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManufacturerMenu = () => {
  const [profile, setProfile] = useState(null);
  const { user, isAuthenticated, getEmailFromUser } = useAuth();
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        alert('You are not logged in');
        navigate('/auth', { replace: true });
        setLoading(false); // Ensure loading is false if not authenticated
        return;
      }
      if (user) {
        setUserEmail(getEmailFromUser());
      }
      setLoading(false);
    };
    checkAuth();
  }, [isAuthenticated, navigate, user, getEmailFromUser]);

  useEffect(() => {
    if (userEmail) {
      console.log('User email:', userEmail);
      const fetchProfileData = async () => {
        try {
          const response = await axios.get(`${ServerUrl}/api/getProfile`, {
            params: {
              email: userEmail,
            },
          });
          console.log(response.data);
          setProfile(response.data.data); // Assuming your server sends profile data in response.data.data
        } catch (err) {
          console.log(err);
          setProfile(null); // Set profile to null on error
        }
      };
      fetchProfileData();
    }
  }, [userEmail, ServerUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-10 grid grid-cols-1 gap-6 items-center">
        <h1 className="text-3xl text-center font-bold text-[var(--color-heading)] mb-4">
          You are not logged in
        </h1>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Click the button below to log in and start building your profile.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 grid grid-cols-1 gap-6 items-center">
        <h1 className="text-3xl text-center font-bold text-[var(--color-heading)] mb-4">
          Build your profile to add your product and sell it on Vyapaar!
        </h1>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Click the button below to start building your profile.
          </p>
          <button
            onClick={() => navigate("/build-profile")}
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Build Your Profile
          </button>
        </div>
      </div>
    );
  }

  if (profile?.is_verified === false) {
    return (
      <div className="p-10 grid grid-cols-1 gap-6 items-center">
        <h1 className="text-3xl text-center font-bold text-[var(--color-heading)] mb-4">
          Your profile is not verified yet
        </h1>
        <div className="text-center">
          <p className="text-lg text-gray-700">
            Please wait for the admin to verify your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div>
        <h1 className="text-2xl font-bold mb-2">Company Name: {profile.name}</h1>
        <p className="text-gray-800">GST No: {profile.GST_no}</p>
        <p className="text-gray-800">Phone: {profile.phone}</p>
        {profile.address && (
          <p className="text-gray-800">
            Address: {profile.address.line1}{profile.address.line2 && `, ${profile.address.line2}`}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}
          </p>
        )}
        {profile.contact_person && (
          <>
            <h2 className="text-xl font-semibold mt-4 mb-1">Contact Person</h2>
            <p className="text-gray-800">Name: {profile.contact_person.name}</p>
            <p className="text-gray-800">Designation: {profile.contact_person.designation}</p>
            <p className="text-gray-800">Email: {profile.contact_person.email}</p>
            <p className="text-gray-800">Phone: {profile.contact_person.phone}</p>
          </>
        )}
        {profile.year_of_establishment && (
          <p className="text-gray-800 mt-2">Year of Establishment: {profile.year_of_establishment}</p>
        )}
        {profile.company_type && (
          <p className="text-gray-800">Company Type: {profile.company_type}</p>
        )}
        {profile.website && (
          <p className="text-gray-800">Website: {profile.website}</p>
        )}
        {profile.categories && profile.categories.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-4 mb-1">Categories</h2>
            <ul className="list-disc list-inside">
              {profile.categories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="text-center md:text-right">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-green-700 transition cursor-pointer"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ManufacturerMenu;