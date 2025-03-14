"use client"

import { useState, useEffect } from 'react';
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
import { STATUS } from '@/utils/constants';
import { Combobox } from '@/components/combobox';
import { addReference, getReferences } from '@/lib/db'

export default function CustomerForm({ onSubmit, customer = {} }) {

  const [allReference, setAllReference] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'BUILDER',
    date: new Date(),
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
    status: 'meet',
    note: '',
    ...customer
  });

  useEffect(() => {
    const getData = async () => {
      const reference = await getReferences();
      setAllReference(reference)
    }
    getData()
  }, []);

  const  handleReferenceCreate = async (value) => {
    let name = value.trim();
    
    const newRef = await addReference({
      name: name,
    })

    setAllReference(prev => [...prev, newRef]);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-start'>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* types */}
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

          {/* partner mobile */}
          <div className="space-y-2">
            <Label htmlFor="partnerMobile">Partner Mobile</Label>
            <Input
              id="partnerMobile"
              value={formData.partnerMobile}
              onChange={(e) => handleChange('partnerMobile', e.target.value)}
            />
          </div>

          {/* PAN Card */}
          <div className="space-y-2">
            <Label htmlFor="panCard">PAN Card</Label>
            <Input
              id="panCard"
              value={formData.panCard}
              onChange={(e) => handleChange('panCard', e.target.value)}
            />
          </div>

          {/* Reference ID */}
          <div className="space-y-2">
            <Label htmlFor="aadhar">Aadhar Number</Label>
            <Input
              id="aadhar"
              value={formData.aadhar}
              onChange={(e) => handleChange('aadhar', e.target.value)}
            />
          </div>

          {/* GST Number */}
          <div className="space-y-2">
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => handleChange('gstNumber', e.target.value)}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>

          {/* District */}
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
            />
          </div>

          {/* State */}
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

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor='reference'>Reference</Label>
            <Combobox
              options={allReference.map(c => ({ label: c.name, value: c.id }))}
              onSelect={(value) => handleChange('reference', value)}
              onCreateOption={handleReferenceCreate}
              placeholder="Search or add Reference..."
              className="w-full"
              id="reference"
            />
          </div>
        </div>
        <div>
          {/* status */}
          <div className="space-y-2 col-span-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map(ele => {
                  return <SelectItem key={ele.key} value={ele.key}>{ele.value}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>

          {/* notes field */}
          <div className="space-y-2 col-span-2 row-span-3">
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => handleChange('note', e.target.value)}
              className="min-h-[300px]" />
          </div>
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
