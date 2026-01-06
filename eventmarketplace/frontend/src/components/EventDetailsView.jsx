import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';

import { bookingService } from '../services/bookingService';
import {useAuth} from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import events from '../images/events.jpg'


export const EventDetailsView = ({ event, onBack }) => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const eventDate = event.eventDateTime;
  const imageUrl = event.imageUrls && event.imageUrls.length > 0 ? event.imageUrls[0] : events;

  const handleBooking = async () => {
   const response = await bookingService.createBooking(user.id, {eventId: event.id, numberOfSeats: 1, payment: null})
   navigate(`/booking-confirmation/${response.booking.id}`)
  };

  const statusSeverity = {
    'ACTIVE': 'success',
    'DRAFT': 'info',
    'CANCELED': 'danger',
    'COMPLETED': 'secondary'
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Button 
        label="Back to Events" 
        icon="pi pi-arrow-left" 
        className="p-button-text mb-3"
        onClick={onBack}
      />

      <div className="grid">
        <div className="col-12 lg:col-8">
          <Card>
            <img 
              src={imageUrl} 
              alt={event.title} 
              className="w-full border-round mb-4"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
            
            <div className="flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <h1 className="text-4xl font-bold m-0">{event.title}</h1>
              <div className="flex gap-2">
                <Tag 
                  value={event.eventType === 'HOST_PACKAGE' ? 'Host Package' : 'Public Event'}
                  severity={event.eventType === 'HOST_PACKAGE' ? 'warning' : 'success'}
                  className="text-lg"
                />
                <Tag 
                  value={event.status}
                  severity={statusSeverity[event.status]}
                />
              </div>
            </div>

            <div className="mb-3">
              {event.bookingEnabled && <Chip label="Booking Open" icon="pi pi-check-circle" className="bg-green-100 text-green-900" />}
              {!event.bookingEnabled && <Chip label="Booking Temporarily Closed" icon="pi pi-times-circle" className="bg-danger-100 text-danger-900" />}
            </div>

            <Divider />

            <h3 className="text-2xl font-semibold mb-3">About This Event</h3>
            <p className="text-gray-700 line-height-3 mb-4">{event.description}</p>

            <Divider />

            <h3 className="text-2xl font-semibold mb-3">Event Details</h3>
            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-3 mb-3">
                  <i className="pi pi-calendar text-primary text-2xl"></i>
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-semibold">
                      {eventDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-3 mb-3">
                  <i className="pi pi-clock text-primary text-2xl"></i>
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-semibold">
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-3 mb-3">
                  <i className="pi pi-map-marker text-primary text-2xl"></i>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold">{event.location}, {event.city}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-12 md:col-6">
                <div className="flex align-items-center gap-3 mb-3">
                  <i className="pi pi-users text-primary text-2xl"></i>
                  <div>
                    <div className="text-sm text-gray-600">Availability</div>
                    <div className="font-semibold">{event.availableSeats} / {event.capacity} spots available</div>
                  </div>
                </div>
              </div>

              {event.totalBookings > 0 && (
                <div className="col-12 md:col-6">
                  <div className="flex align-items-center gap-3 mb-3">
                    <i className="pi pi-ticket text-primary text-2xl"></i>
                    <div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                      <div className="font-semibold">{event.totalBookings} bookings</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {event.supplierNotes && (
              <>
                <Divider />
                <h3 className="text-2xl font-semibold mb-3">Additional Information</h3>
                <p className="text-gray-700 line-height-3">{event.supplierNotes}</p>
              </>
            )}
          </Card>
        </div>

        <div className="col-12 lg:col-4">
          <Card className="sticky" style={{ top: '20px' }}>
            <div className="text-center mb-4">
              <div className="text-gray-600 mb-2">
                {event.eventType === 'HOST_PACKAGE' ? 'Package Price' : 'Ticket Price'}
              </div>
              <div className="text-5xl font-bold text-primary">${event.ticketPrice.toFixed(2)}</div>
              {event.eventType === 'HOST_PACKAGE' && (
                <div className="text-sm text-gray-600 mt-2">Base package price</div>
              )}
            </div>

            <Divider />

            <div className="flex flex-column gap-3">
              <Button 
                label={event.eventType === 'HOST_PACKAGE' ? 'Book Package' : 'Book Ticket'}
                icon="pi pi-ticket"
                size="large"
                className="w-full"
                onClick={handleBooking}
                disabled={event.availableSeats === 0 || !event.bookingEnabled || event.status === "CANCELED"}
              />
              
              {event.availableSeats === 0 && (
                <div className="text-center text-red-500">
                  <i className="pi pi-exclamation-triangle mr-2"></i>
                  Sold Out
                </div>
              )}

              {!event.bookingEnabled && event.availableSeats > 0 && (
                <div className="text-center text-orange-500">
                  <i className="pi pi-info-circle mr-2"></i>
                  Bookings Currently Closed
                </div>
              )}
              
              <Button 
                label="Contact Organizer"
                icon="pi pi-envelope"
                className="p-button-outlined w-full"
              />
            </div>

            <Divider />

            <div className="text-sm text-gray-600 text-center">
              <i className="pi pi-info-circle mr-2"></i>
              Free cancellation up to 24 hours before the event
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};