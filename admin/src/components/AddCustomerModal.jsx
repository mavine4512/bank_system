import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

const AddCustomerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    other_names: '',
    national_id: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    email: '',
    residential_address: '',
    occupation: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear the error for this field when it's changed
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Check required fields
    ['first_name', 'national_id', 'date_of_birth', 'gender'].forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    // Validate age
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.date_of_birth = 'Customer must be at least 18 years old';
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      setFormData({
        first_name: '',
        other_names: '',
        national_id: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        residential_address: '',
        occupation: '',
        status: 'Active'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">Full Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="other_names">Other Names</Label>
              <Input
                id="other_names"
                name="other_names"
                value={formData.other_names}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" onValueChange={(value) => handleChange({ target: { name: 'gender', value } })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
              {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                required
              />
              {errors.contact_number && <p className="text-red-500 text-sm">{errors.contact_number}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="residential_address">Residential Address</Label>
              <Textarea
                id="residential_address"
                name="residential_address"
                value={formData.residential_address}
                onChange={handleChange}
                rows={2}
                required
              />
              {errors.residential_address && <p className="text-red-500 text-sm">{errors.residential_address}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              />
              {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="national_id">National ID</Label>
              <Input
                id="national_id"
                name="national_id"
                value={formData.national_id}
                onChange={handleChange}
                required
              />
              {errors.national_id && <p className="text-red-500 text-sm">{errors.national_id}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" onValueChange={(value) => handleChange({ target: { name: 'status', value } })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" size="lg" type="submit" className="w-full sm:w-auto">Save Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;