import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import hero from '../images/hero.jpg';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: '65vh' }}>
        <img 
          src={hero}
          alt="Events"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black" style={{ opacity: 0.4 }} />
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="container mx-auto text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome to EventMarketPlace
            </h1>
            <p className="text-xl md:text-2xl">
              Attend or Host Amazing Events
            </p>
          </div>
        </div>
      </div>
      <div className="bg-primary text-white py-4 px-4 text-center">
        <div className="container mx-auto">
          <div className="flex gap-3 justify-content-center">
            <Button 
              label="Browse Events" 
              size="large" 
              onClick={() => navigate('/events')} 
            />
            <Button 
              label="Become a Provider" 
              size="large" 
              className="p-button-outlined p-button-secondary" 
              onClick={() => navigate('/register')} 
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto py-6 px-4">
        <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
        <p className="text-gray-600">Discover upcoming events in your area...</p>
      </div>
    </div>
  );
};