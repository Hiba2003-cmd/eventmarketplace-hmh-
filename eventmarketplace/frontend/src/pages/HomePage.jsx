import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from '../auth/AuthContext';
import { eventService } from '../services/eventService';
import hero from '../images/hero.jpg';
import ParticlesBackground from '../ParticlesBackground';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingRecs(true);
    eventService.getRecommendations(user.id)
      .then(setRecommendations)
      .catch(() => {/* fail silently */})
      .finally(() => setLoadingRecs(false));
  }, [user?.id]);

  return (
    <div>
  <div className="relative overflow-hidden" style={{ height: '100vh' }}>
  

  <div className="absolute inset-0" style={{ 
    zIndex: 0, 
    background: 'linear-gradient(135deg, #0e0d17, #99097f, #271025)' 
  }} />

  {/* النجوم والفقاعات */}
  <ParticlesBackground />
  


  {/* الخطوة 3: المحتوى النصي (الطبقة 2) */}
  <div className="relative z-10 h-full flex flex-column align-items-center justify-center text-center text-white px-4">
    
   
    
 <h1 className="font-bold mb-8  anim-1" style={{ fontSize: '4rem', marginTop:'20vh',fontFamily: 'Georgia, serif',  color: '#2d2859',  // بنفسجي فاتح مشع مميز
    }}>
  Welcome to EventMarketPlace
</h1>


    <p className="mb-8 anim-2" style={{ fontSize: '2.5rem',color:'#260f80', fontFamily: 'Georgia, serif' }}>
  Attend or Host Amazing Events
</p>
    {/* الأزرار */}
    <div className="flex gap-3 justify-content-center">
      <Button 
        label="Browse Events" 
        size="large" 
        className="px-6" 
        onClick={() => navigate('/events')} 
      />
      <Button 
        label="Become a Provider" 
        size="large" 
        className="p-button-outlined px-6 text-white" 
        style={{ borderColor: 'white' }} 
        onClick={() => navigate('/register')} 
       
      />
    </div>
    

<>
  <style>{`
    @keyframes floatLetter {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .dance-letter {
      display: inline-block;
      font-family: Georgia, serif;
      font-size: 4rem;
      margin-top:8rem;
      color: #291384;
      animation: floatLetter 3s ease-in-out infinite;
    }
  `}</style>

  <div className="mb-8">
    {'today we make memories'.split('').map((char, i) => (
      <span
        key={i}
        className="dance-letter"
        style={{
          animationDelay: `${i * 0.1}s`,
          width: char === ' ' ? '0.4em' : 'auto',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </div>
</>



  </div>
</div>


      {user && (
        <div className="container mx-auto py-6 px-4 ">
          <h2 className="text-3xl font-bold mb-1">
            <i className="pi pi-sparkles text-yellow-500 mr-2"></i>
            Recommended for You
          </h2>
          <p className="text-gray-500 mb-4">Personalized picks based on your booking history</p>

          {loadingRecs && (
            <div className="flex justify-content-center py-4">
              <ProgressSpinner style={{ width: '40px', height: '40px' }} />
            </div>
          )}

          {!loadingRecs && recommendations.length === 0 && (
            <p className="text-gray-400">No recommendations yet — book some events to get personalised suggestions!</p>
          )}

          {!loadingRecs && recommendations.length > 0 && (
            <div className="grid">
              {recommendations.map((event) => (
                <div key={event.id} className="col-12 md:col-4">
                  <Card className="h-full">
                    <div className="flex flex-column h-full">
                      <div className="flex align-items-center gap-2 mb-2">
                        <Tag
                          value={event.eventType === 'HOST_PACKAGE' ? 'Host Package' : 'Public Event'}
                          severity={event.eventType === 'HOST_PACKAGE' ? 'warning' : 'success'}
                        />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                      <p className="text-gray-500 text-sm mb-1">
                        <i className="pi pi-map-marker mr-1"></i>{event.location}, {event.city}
                      </p>
                      <p className="text-gray-500 text-sm mb-3">
                        <i className="pi pi-dollar mr-1"></i>${Number(event.ticketPrice).toFixed(2)} &nbsp;·&nbsp;
                        <i className="pi pi-users mr-1"></i>{event.availableSeats} seats
                      </p>
                      <div className="mt-auto">
                        <Button
                          label="Book Now"
                          icon="pi pi-ticket"
                          className="w-full"
                          onClick={() => navigate(`/booking/${event.id}`)}
                          disabled={!event.bookingEnabled || event.availableSeats === 0}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
