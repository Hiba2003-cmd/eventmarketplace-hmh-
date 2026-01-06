import { useState, useEffect, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { BookingCard } from '../components/BookingCard';
import { BookingDetailsDialog } from '../components/BookingDetailsDialog';
import { bookingService } from '../services/bookingService';
import {useAuth} from '../auth/AuthContext';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export const MyBookingsPage = () => {
  const {user} = useAuth();
  
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    loadBookings();
  }, [user.id]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const past = await bookingService.getPastBookings(user.id);
      setPastBookings(past)
      const upcoming = await bookingService.getUpcomingBookings(user.id);
      setUpcomingBookings(upcoming);
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to load bookings' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleCancelBooking = (booking) => {
    confirmDialog({
      message: `Are you sure you want to cancel your booking for "${booking.eventTitle}"?`,
      header: 'Cancel Booking',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          setShowDetailsDialog(false);
          
          toast.current?.show({ 
            severity: 'success', 
            summary: 'Success', 
            detail: 'Booking canceled successfully' 
          });
        } catch (error) {
          toast.current?.show({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to cancel booking' 
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <BookingDetailsDialog
        booking={selectedBooking}
        visible={showDetailsDialog}
        onHide={() => setShowDetailsDialog(false)}
        onCancel={handleCancelBooking}
      />

      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage your event bookings</p>
      </div>

      <Card>
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header={`Upcoming (${upcomingBookings.length})`} leftIcon="pi pi-calendar mr-2">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <i className="pi pi-calendar-times text-6xl text-gray-400 mb-3"></i>
                <h3 className="text-2xl text-gray-600 mb-2">No Upcoming Bookings</h3>
                <p className="text-gray-500">You don't have any upcoming event bookings.</p>
              </div>
            ) : (
              <div className="grid">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="col-12 md:col-6 lg:col-4">
                    <BookingCard 
                      booking={booking}
                      onViewDetails={handleViewDetails}
                      onCancel={handleCancelBooking}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel header={`Past (${pastBookings.length})`} leftIcon="pi pi-history mr-2">
            {pastBookings.length === 0 ? (
              <div className="text-center py-8">
                <i className="pi pi-inbox text-6xl text-gray-400 mb-3"></i>
                <h3 className="text-2xl text-gray-600 mb-2">No Past Bookings</h3>
                <p className="text-gray-500">You don't have any past event bookings.</p>
              </div>
            ) : (
              <div className="grid">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="col-12 md:col-6 lg:col-4">
                    <BookingCard 
                      booking={booking}
                      onViewDetails={handleViewDetails}
                      onCancel={handleCancelBooking}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};