import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';


export const BookingConfirmationPage = () => {
  const [booking, setBooking] = useState();
  const navigate = useNavigate();
  const {bookingId} = useParams();

 useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {

  const response = await bookingService.getBookingById(bookingId);
  setBooking(response)
  }

  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid">
        <div className="col-12 md:col-8 mx-auto">
          <Card>
            <div className="text-center mb-4">
              <div className="inline-flex align-items-center justify-content-center border-circle bg-green-100 mb-3" 
                   style={{ width: '120px', height: '120px' }}>
                <i className="pi pi-check text-6xl text-green-600"></i>
              </div>
              <h1 className="text-4xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
              <p className="text-xl text-gray-600">Your booking has been successfully confirmed</p>
            </div>

            <Divider />

            <div className="mb-4">
              <div className="p-4 bg-blue-50 border-round mb-4">
                <div className="flex align-items-center gap-3">
                  <i className="pi pi-envelope text-3xl text-blue-600"></i>
                  <div>
                    <div className="font-semibold text-blue-900">Confirmation Email Sent</div>
                    <div className="text-sm text-blue-700">
                      We've sent a confirmation email to <strong>{booking?.userEmail}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Booking Details</h3>
              
              <div className="grid">
                <div className="col-12 md:col-6">
                  <div className="mb-3">
                    <label className="text-gray-600 text-sm">Reference Number</label>
                    <div className="font-bold font-mono text-lg">{booking?.referenceNumber}</div>
                  </div>
                </div>
                
                <div className="col-12 md:col-6">
                  <div className="mb-3">
                    <label className="text-gray-600 text-sm">Total Amount</label>
                    <div className="font-bold text-primary text-xl">${booking?.totalPrice?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex flex-column md:flex-row gap-3">
              <Button 
                label="View My Bookings" 
                icon="pi pi-list"
                className="flex-1"
                onClick={() => navigate("/bookings")}
              />
              <Button 
                label="Browse More Events" 
                icon="pi pi-search"
                className="p-button-outlined flex-1"
                onClick={() => navigate("/events")}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};