import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useAuth } from '../auth/AuthContext';
import { ChatBot } from '../components/ChatBot';

export const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuRef = useRef(null);

  const items = [
    { label: 'Events', icon: 'pi pi-calendar', command: () => navigate('/events') },
    { label: 'Providers', icon: 'pi pi-users', command: () => navigate('/suppliers') },
    ...(user?.role !== 'ORGANIZER' ? [{
      label: 'AI Planner',
      icon: 'pi pi-sparkles',
      command: () => navigate('/ai-planner')
    }] : [])
  ];

  const userMenuItems = [
    { label: 'My Profile', icon: 'pi pi-user', command: () => navigate('/profile') },
    { label: 'My Bookings', icon: 'pi pi-ticket', command: () => navigate('/bookings') },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
        navigate('/');
      }
    }
  ];



  
  const start = (
    <Link to="/" className="flex align-items-center text-decoration-none gap-3">
      <img src="/logo.jpg" alt="logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      <span 
  className="text-xl font-bold hidden lg:block" 
  style={{ 
    color: '#260f80', 
    fontSize: '1.25rem',
    fontFamily: 'Georgia, serif' ,
    textDecoration: 'none'
  }}
>EventMarketPlace</span>
    </Link>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      {user ? (
        <>
          <Menu model={userMenuItems} popup ref={menuRef} />
          <div className="flex align-items-center gap-2 cursor-pointer" onClick={(e) => menuRef.current.toggle(e)}>
            <Avatar 
              image={user.profilePictureUrl || null} 
              icon={!user.profilePictureUrl ? "pi pi-user" : null}
              size="large" 
              shape="circle" 
            />
            <span className="hidden md:block text-[#260f80]">{user.name}</span>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Button label="Sign In" className="p-button-text text-white" onClick={() => navigate('/login')} />
          <Button label="Register" onClick={() => navigate('/register')} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-column aurora-bg">
   
      <style>{`
        .custom-nav .p-menubar-root-list {
          position: absolute !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin: 0 !important;
          display: flex !important;
          border: none !important;
          background: transparent !important;
          
        }
           .custom-nav .p-menuitem-text, .custom-nav .p-menuitem-icon {
          color: #2d2859 !important;
          font-weight:500;
          fontFamily: 'Georgia, serif';
        }
       
     
        @media (max-width: 960px) {
          .custom-nav .p-menubar-root-list {
            position: static !important;
            transform: none !important;
            left: auto !important;
          }
        }
      `}</style>

      <Menubar 
        model={items} 
        start={start} 
        end={end} 
        className="custom-nav"
        style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(10px)',
          border: 'none',
          padding: '0.5rem 2rem',
          position: 'relative', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }} 
      />

      <main className="flex-1">
        {children}
      </main>

      <footer style={{ background: 'rgba(14, 13, 23, 0.9)', backdropFilter: 'blur(16px)' }} className="py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="m-0" style={{ color: 'rgba(255,255,255,0.6)' }}>
            &copy; 2026 EventMarketPlace. All rights reserved.
          </p>
        </div>
      </footer>
      <ChatBot />
    </div>
  );
};