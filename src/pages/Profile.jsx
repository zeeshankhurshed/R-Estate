import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, signout } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();

  console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleFileUpload = (file) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        setError(error.message);
        toast.error('Error uploading image (image must be less than 2MB)');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({
            ...prevData,
            avatar: downloadURL,
          }));
          toast.success('Image successfully uploaded!');
        });
      }
    );
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser.token}` // Ensure the token is passed
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Error updating profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${currentUser.token}` // Ensure the token is passed
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      dispatch(signout());
      toast.success('Account deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignOut = () => {
    dispatch(signout());
    toast.success('Signed out successfully!');
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        headers: {
          "Authorization": `Bearer ${currentUser.token}` // Ensure the token is passed
        }
      });
      console.log("response", res);
      const data = await res.json();

      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data.listings);  // Ensure data.listings matches your response structure
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingid) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${currentUser.token}` // Ensure the token is passed
        },
      });

      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingid));
      toast.success("Listing deleted successfully!");
    } catch (error) {
      toast.error("Error deleting listing");
      console.log(error.message);
    }
  }

  return (
    <div className='container max-w-lg mx-auto'>
      <h2 className='text-3xl font-semibold my-7 text-center'>Profile</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="avatar"
          className='border rounded-full w-30 h-30 object-cover cursor-pointer self-center'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image upload (image must be less than 2MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`uploading ${filePerc}%`}</span>
          ) : (
            error ? <span className='text-red-700'>{error}</span> : '' // Display the error message
          )}
        </p>
        <input
          type="text"
          placeholder='Username...'
          defaultValue={currentUser.username}
          onChange={handleChange}
          id="username"
          className='focus:outline-none border p-3 rounded-lg'
        />
        <input
          type="text"
          placeholder='Email...'
          defaultValue={currentUser.email}
          onChange={handleChange}
          id="email"
          className='focus:outline-none border p-3 rounded-lg'
        />
        <input
          type="password"
          placeholder='Password...'
          id="password"
          onChange={handleChange}
          className='focus:outline-none border p-3 rounded-lg'
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase text-center opacity-95'>
          {loading ? "Updating..." : "Update"}
        </button>
        <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingError ? "Error Showing listings" : ""}</p>
      {
        userListings && userListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h2 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h2>

            {userListings.map((listing) => (
              <div key={listing._id} className='border rounded-lg flex justify-between items-center gap-4 p-3'>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt="listing cover" className='object-contain h-16 w-16' />
                </Link>
                <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold hover:underline truncate flex'>
                  <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col items-center'>
                  <button className='text-red-700 uppercase' onClick={() => handleListingDelete(listing._id)}>
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-700 uppercase'>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default Profile;
