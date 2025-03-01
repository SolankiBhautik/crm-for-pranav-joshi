"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function CustomerForm({ onSubmit, initialData = {} }) {
const [formData, setFormData] = useState({
    name: '',
    type: 'BUILDER',
    date: initialData.date
      ? new Date(initialData.date) 
      : new Date(),
    mobile: '',
    referenceId: '',
    panCard: '',
    partnerMobile: '',
    aadhar: '',
    city: '',
    district: '',
    state: '',
    gstNumber: '',
    address: '',
    ...initialData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUILDER">Builder</SelectItem>
              <SelectItem value="BUNGLOW">Bunglow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerMobile">Partner Mobile</Label>
          <Input
            id="partnerMobile"
            value={formData.partnerMobile}
            onChange={(e) => handleChange('partnerMobile', e.target.value)}
          />
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <Label htmlFor="panCard">PAN Card</Label>
          <Input
            id="panCard"
            value={formData.panCard}
            onChange={(e) => handleChange('panCard', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aadhar">Aadhar Number</Label>
          <Input
            id="aadhar"
            value={formData.aadhar}
            onChange={(e) => handleChange('aadhar', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number</Label>
          <Input
            id="gstNumber"
            value={formData.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => handleChange('district', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => handleChange('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Full Width Fields */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit">Save Customer</Button>
      </div>
    </form>
  );
}
