import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';

export const BookingFormPage = ({ eventId, currentUser, onBack, onSuccess }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [userInfo, setUserInfo] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || ''
  });
  const toast = useRef(null);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const foundEvent = await eventService.getEventById(eventId);
      setEvent(foundEvent);
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to load event' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const bookingData = {
        eventId: event.id,
        userId: currentUser?.uid,
        ticketCount: ticketCount,
        totalPrice: event.ticketPrice * ticketCount,
        userName: userInfo.name,
        userEmail: userInfo.email,
        userPhone: userInfo.phone
      };

      const booking = await bookingService.createBooking(bookingData);
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Booking confirmed!' 
      });

      setTimeout(() => {
        if (onSuccess) onSuccess(booking);
      }, 1000);
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.message 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-6 px-4 text-center">
        <i className="pi pi-exclamation-circle text-6xl text-gray-400 mb-3"></i>
        <h2 className="text-3xl text-gray-600 mb-3">Event Not Found</h2>
        <Button label="Back" icon="pi pi-arrow-left" onClick={onBack} />
      </div>
    );
  }

  const eventDate = new Date(event.eventDateTime.seconds * 1000);
  const totalPrice = event.ticketPrice * ticketCount;
  const imageUrl = event.imageUrls && event.imageUrls.length > 0 ? event.imageUrls[0] : '';

  return (
    <div className="container mx-auto py-6 px-4">
      <Toast ref={toast} />
      
      <Button 
        label="Back to Event" 
        icon="pi pi-arrow-left" 
        className="p-button-text mb-3"
        onClick={onBack}
      />

      <div className="grid">
        <div className="col-12 lg:col-8">
          <Card>
            <h2 className="text-3xl font-bold mb-4">Complete Your Booking</h2>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-3">Event Details</h3>
              <div className="flex gap-3 p-3 border-1 border-200 border-round">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt={event.title}
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    className="border-round"
                  />
                )}
                <div className="flex-1">
                  <div className="flex align-items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold m-0">{event.title}</h4>
                    <Tag 
                      value={event.eventType === 'HOST_PACKAGE' ? 'Host' : 'Public'}
                      severity={event.eventType === 'HOST_PACKAGE' ? 'warning' : 'success'}
                    />
                  </div>
                  <div className="flex flex-column gap-1 text-sm text-gray-700">
                    <div><i className="pi pi-calendar mr-2"></i>{eventDate.toLocaleDateString()}</div>
                    <div><i className="pi pi-clock mr-2"></i>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div><i className="pi pi-map-marker mr-2"></i>{event.location}, {event.city}</div>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-3">
                {event.eventType === 'HOST_PACKAGE' ? 'Package Details' : 'Ticket Selection'}
              </h3>
              <div className="grid">
                <div className="col-12 md:col-6">
                  <label className="block text-900 font-medium mb-2">
                    {event.eventType === 'HOST_PACKAGE' ? 'Number of Packages' : 'Number of Tickets'}
                  </label>
                  <InputNumber 
                    value={ticketCount}
                    onValueChange={(e) => setTicketCount(e.value)}
                    min={1}
                    max={event.availableSeats}
                    showButtons
                    className="w-full"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label className="block text-900 font-medium mb-2">Price Per {event.eventType === 'HOST_PACKAGE' ? 'Package' : 'Ticket'}</label>
                  <div className="text-2xl font-bold text-primary">${event.ticketPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-3">Your Information</h3>
              <div className="grid">
                <div className="col-12 md:col-6">
                  <label className="block text-900 font-medium mb-2">Full Name</label>
                  <InputText 
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label className="block text-900 font-medium mb-2">Email</label>
                  <InputText 
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label className="block text-900 font-medium mb-2">Phone Number</label>
                  <InputText 
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex align-items-center justify-content-between mb-4">
              <h3 className="text-xl font-semibold m-0">Total Amount</h3>
              <div className="text-4xl font-bold text-primary">${totalPrice.toFixed(2)}</div>
            </div>

            <Button 
              label="Confirm Booking" 
              icon="pi pi-check"
              onClick={handleSubmit}
              className="w-full"
              size="large"
              loading={submitting}
            />
          </Card>
        </div>

        <div className="col-12 lg:col-4">
          <Card className="sticky" style={{ top: '20px' }}>
            <h3 className="text-xl font-semibold mb-3">Booking Summary</h3>
            
            <div className="flex flex-column gap-3">
              <div className="flex justify-content-between">
                <span className="text-gray-600">Event</span>
                <span className="font-semibold text-right">{event.title}</span>
              </div>
              
              <div className="flex justify-content-between">
                <span className="text-gray-600">{event.eventType === 'HOST_PACKAGE' ? 'Packages' : 'Tickets'}</span>
                <span className="font-semibold">{ticketCount}</span>
              </div>
              
              <div className="flex justify-content-between">
                <span className="text-gray-600">Price per {event.eventType === 'HOST_PACKAGE' ? 'package' : 'ticket'}</span>
                <span className="font-semibold">${event.ticketPrice.toFixed(2)}</span>
              </div>
              
              <Divider />
              
              <div className="flex justify-content-between">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Divider />

            <div className="text-sm text-gray-600">
              <i className="pi pi-info-circle mr-2"></i>
              Free cancellation up to 24 hours before the event
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};