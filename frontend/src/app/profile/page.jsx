"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/authSlice";
import { toast } from "react-hot-toast";

// Utility: Fetch city/state by PIN code
const fetchCityStateByPincode = async (pincode) => {
    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = response.data[0];

        if (data.Status === "Success") {
            const postOffice = data.PostOffice[0];
            return {
                city: postOffice.District,
                state: postOffice.State,
            };
        } else {
            toast.error("Invalid PIN Code.");
            return { city: "", state: "" };
        }
    } catch (err) {
        console.error("PIN code fetch failed:", err);
        toast.error("Failed to fetch city/state");
        return { city: "", state: "" };
    }
};

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [editedUser, setEditedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

    // ✅ Fetch user profile on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
                setEditedUser(res.data);
                setSelectedImage(res.data.profileImage || null);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (editedUser) {
            setSelectedImage(editedUser.profileImage || null);
            setSelectedFile(null);
        }
    }, [editedUser]);

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleAddressChange = async (index, field, value) => {
        const updatedAddresses = [...(editedUser.addresses || [])];

        if (field === "phoneNumber") {
            let cleaned = value.replace(/\D/g, "");
            value = cleaned;
        }

        updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };

        if (field === "zipcode" && /^\d{6}$/.test(value)) {
            const { city, state } = await fetchCityStateByPincode(value);
            if (city && state) {
                updatedAddresses[index].townCity = city;
                updatedAddresses[index].state = state;
            }
        }

        setEditedUser({ ...editedUser, addresses: updatedAddresses });
    };

    const addNewAddress = () => {
        setEditedUser(prev => ({
            ...prev,
            addresses: [
                ...(prev.addresses || []),
                {
                    fullName: "",
                    streetAddress: "",
                    apartment: "",
                    townCity: "",
                    state: "",
                    zipcode: "",
                    phoneNumber: "",
                    emailAddress: "",
                },
            ],
        }));
    };


    const removeAddress = (index) => {
        const updated = [...(editedUser.addresses || [])];
        updated.splice(index, 1);
        setEditedUser({ ...editedUser, addresses: updated });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedImage(previewUrl);
            setSelectedFile(file);
        }
    };

    const handleSave = async () => {

        try {
            setIsSaving(true);


            // Validation (unchanged)
            const requiredFields = [
                "fullName",
                "streetAddress",
                "townCity",
                "state",
                "zipcode",
                "phoneNumber",
                "emailAddress",
            ];
            const fieldLabels = {
                fullName: "Full Name",
                streetAddress: "Street Address",
                townCity: "City/Town",
                state: "State",
                zipcode: "PIN Code",
                phoneNumber: "Phone Number",
                emailAddress: "Email Address",
            };

            for (let i = 0; i < (editedUser.addresses || []).length; i++) {
                const address = editedUser.addresses[i];
                for (let field of requiredFields) {
                    const value = address[field];
                    const isEmpty = value === undefined || value === null || (typeof value === "string" && value.trim() === "");
                    if (isEmpty) {
                        toast.error(`Address ${i + 1}: ${fieldLabels[field]} is required`);
                        setIsSaving(false);
                        return;
                    }

                    if (field === "zipcode" && !/^\d{6}$/.test(value)) {
                        toast.error(`Address ${i + 1}: PIN Code must be 6 digits`);
                        setIsSaving(false);
                        return;
                    }

                    if (field === "phoneNumber" && !/^(\+91)?[6-9]\d{9}$/.test(value)) {
                        toast.error(`Address ${i + 1}: Enter a valid 10-digit Indian phone number`);
                        setIsSaving(false);
                        return;
                    }

                    if (field === "emailAddress" && !/^\S+@\S+\.\S+$/.test(value)) {
                        toast.error(`Address ${i + 1}: Enter a valid email address`);
                        setIsSaving(false);
                        return;
                    }
                }
            }

            // Prepare form data
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", editedUser.name || "");
            formData.append("mobile", editedUser.mobile || "");
            formData.append("addresses", JSON.stringify(editedUser.addresses || []));
            if (selectedFile) formData.append("profileImage", selectedFile);

            // API call (Content-Type removed)
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(res.data.user);
            setEditedUser(res.data.user);
            setEditMode(false);
            setSelectedFile(null);
            setSelectedImage(res.data.user.profileImage || null);
            dispatch(updateUser(res.data.user));
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Save failed:", err.response ? err.response.data : err.message);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };


    if (!user || !editedUser) return <div className="p-5">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 md:mt-14">
            <h1 className="text-2xl  font-bold text-[#35894E] mb-6 text-center font-heading">
                Your Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Personal Info */}
                <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-semibold text-[#35894E]  mb-4 font-home">Personal Information</h2>

                    <div className="mb-4 flex space-x-10 ">
                        <div className="mb-4 flex space-x-10 items-center ">
                            {/* Avatar Circle */}
                            <div className="relative">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt="Profile"
                                        className="w-28 h-28 rounded-full object-cover shadow-md border border-gray-300"
                                    />
                                ) : (
                                    <div className="font-body w-28 h-28 rounded-full bg-[#35894E] text-white flex items-center justify-center text-2xl font-semibold shadow-md">
                                        {user.name
                                            ?.split(' ')
                                            .map((word) => word[0])
                                            .join('')
                                            .toUpperCase()}
                                    </div>
                                )}
                                {editMode && (
                                    <label
                                        htmlFor="profileImageInput"
                                        className=" font-body absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 cursor-pointer hover:bg-gray-800"
                                        title="Change Profile Image"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                                        </svg>
                                        <input
                                            id="profileImageInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-start text-center align-middle ">
                            <label className="block font-body text-sm font-bold text-gray-700 mb-1">Name</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editedUser.name}
                                    onChange={handleChange}
                                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded text-sm"
                                />
                            ) : (
                                <p className=" font-body text-gray-700 text-sm">{user.name}</p>
                            )}
                            <div className="my-4">
                                <p className="font-medium font-body text-sm text-gray-800 mb-1">Verification Status:</p>
                                <p className={`flex items-center text-sm font-body font-medium ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                                    {user.isVerified ? 'Verified' : 'Not Verified'}
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {user.isVerified ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l4-4m0 0l-4-4m4 4H6" />
                                        )}
                                    </svg>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block   font-body text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className=" font-body text-gray-600 text-sm">{user.email}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-body font-medium text-gray-700 mb-1">Mobile</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="mobile"
                                value={editedUser.mobile}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border font-body border-gray-300 rounded text-sm"
                            />
                        ) : (
                            <p className="font-body text-gray-700 text-sm">{user.mobile}</p>
                        )}
                    </div>

                    {/* Join Date */}
                    <div>
                        <p className="text-sm font-body text-gray-800 font-medium">Member Since:</p>
                        <p className="font-body text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Right: Addresses */}
                <div className="bg-[#F8FAF7] border border-[#93A87E] p-5 rounded-lg shadow-sm">
                    <p className="font-semibold font-home text-[#35894E] mb-3 text-sm">Saved Addresses</p>

                    {editMode ? (
                        <>
                            {editedUser.addresses?.length > 0 ? (
                                editedUser.addresses.map((addr, idx) => (
                                    <div key={idx} className="mb-4 ">
                                        {[
                                            'fullName',
                                            'streetAddress',
                                            'apartment',
                                            'zipcode',
                                            'townCity',
                                            'state',
                                            'phoneNumber',
                                            'emailAddress',
                                        ].map((field) => (
                                            <input
                                                key={field}
                                                type={field.includes('email') ? 'email' : 'text'}
                                                placeholder={field.replace(/([A-Z])/g, ' $1')}
                                                value={addr[field]}
                                                onChange={(e) => handleAddressChange(idx, field, e.target.value)}
                                                className="w-full  mb-1 px-3 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        ))}
                                        <button onClick={() => removeAddress(idx)} className="font-body text-red-600 text-xs hover:underline">
                                            Remove
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm font-body">No addresses yet.</p>
                            )}

                            {/* <button
                                onClick={addNewAddress}
                                className="mt-2 bg-[#35894E] font-home text-white text-sm px-4 py-2 rounded hover:bg-[#2f7c46] transition"
                            >
                                Add Address
                            </button> */}
                        </>
                    ) : user.addresses?.length > 0 ? (
                        user.addresses.map((addr, idx) => (
                            <div key={idx} className="mb-3  border-b border-gray-200 pb-2">
                                <p className=" font-body font-medium text-sm">{addr.fullName}</p>
                                <p className="font-body text-sm text-gray-700">
                                    {addr.streetAddress}, {addr.apartment}
                                </p>
                                <p className="font-body text-sm text-gray-700">
                                    {addr.townCity}, {addr.state} - {addr.zipcode}
                                </p>
                                <p className=" font-body text-sm text-gray-700">Phone: {addr.phoneNumber}</p>
                            </div>
                        ))
                    ) : (
                        <p className="font-body text-sm text-gray-500">No addresses added.</p>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end gap-3">
                {editMode ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-5 py-2 font-home rounded text-sm text-white transition ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#35894E] hover:bg-[#2f7c46]'
                                }`}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={() => {
                                setEditMode(false);
                                setEditedUser(user);
                            }}
                            className="font-home bg-gray-300 text-gray-800 px-5 py-2 rounded text-sm hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-[#35894E] font-home    text-white px-5 py-2 rounded text-sm hover:bg-[#2f7c46] transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}
