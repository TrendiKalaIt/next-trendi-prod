import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const AddressForm = ({
  token,
  setShowForm,
  setSavedAddresses,
  setSelectedAddress,
  guestMode = false,
  address = null,
  onAddressChange = () => {},
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/create-account?redirect=/checkout');
    }
  }, [token, router]);

  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    apartment: '',
    townCity: '',
    state: '',
    zipcode: '',
    phoneNumber: '',
    emailAddress: '',
  });

  useEffect(() => {
    if (address) setFormData(address);
  }, [address]);

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim())
      errors.fullName = 'Full Name is required';
    if (!formData.streetAddress.trim())
      errors.streetAddress = 'House No. / Building Name is required';
    if (!formData.apartment.trim())
      errors.apartment = 'Road Name / Area / Colony is required';
    if (!formData.townCity.trim())
      errors.townCity = 'City / District is required';
    if (!formData.state.trim())
      errors.state = 'State is required';
    if (!formData.zipcode.trim())
      errors.zipcode = 'ZIP / PIN Code is required';
    else if (!/^\d{6}$/.test(formData.zipcode))
      errors.zipcode = 'Enter a valid 6-digit PIN Code';
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
      errors.phoneNumber = 'Enter a valid 10-digit Indian phone number';
    if (!/\S+@\S+\.\S+/.test(formData.emailAddress))
      errors.emailAddress = 'Enter a valid email address';
    return errors;
  };

  const fetchAddressByPincode = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        return {
          state: postOffice.State,
          district: postOffice.District,
        };
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  const handleInputChange = async (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (guestMode) onAddressChange(newFormData);

    if (field === 'zipcode' && value.length === 6) {
      const result = await fetchAddressByPincode(value);
      if (result) {
        setFormData((prev) => ({
          ...prev,
          state: result.state,
          townCity: result.district,
          zipcode: value,
        }));
        toast.success('PIN code verified: State & City auto-filled');
      } else {
        toast.error('Invalid PIN code');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }
    if (guestMode) {
      toast.success('Guest address validated');
      return;
    }
    try {
      const axios = await import('axios');
      const response = await axios.default.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/save`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Address saved!');
      setSavedAddresses(response.data.addresses);
      setSelectedAddress(response.data.addresses[response.data.addresses.length - 1]);
      setShowForm(false);
      setFormData({
        fullName: '',
        streetAddress: '',
        apartment: '',
        townCity: '',
        state: '',
        zipcode: '',
        phoneNumber: '',
        emailAddress: '',
      });
      try {
        await axios.default.get(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {}
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save address.';
      toast.error(errorMessage);
    }
  };

  return (
    <form className="space-y-4 mt-4 " onSubmit={handleSubmit}>
      {[
        ['fullName', 'Full Name*'],
        ['apartment', 'House No., Building Name,Road Name, Area, Colony*'],
        ['streetAddress', 'Nearby Landmark (Shop/Mall/etc.)*'],
        ['zipcode', 'ZIP / PIN Code*'],
        ['townCity', 'City*'],
        ['state', 'State*'],
        ['phoneNumber', 'Phone Number*'],
        ['emailAddress', 'Email Address*'],
      ].map(([id, label]) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 font-body">{label}</label>
          <input
            type={id === 'emailAddress' ? 'email' : 'text'}
            id={id}
            value={formData[id]}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className={`w-full px-3 py-2 border ${formErrors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-green-50`}
          />
          {formErrors[id] && <p className="text-sm text-red-500 mt-1">{formErrors[id]}</p>}
        </div>
      ))}
      {!guestMode && (
        <button className="bg-green-600 font-home text-white px-4 py-2 rounded" type="submit">
          Save Address
        </button>
      )}
    </form>
  );
};

export default AddressForm;
