import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useAuth } from '../auth/AuthContext';

export const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuRef = useRef(null);

  const items = [
    {
      label: 'Events',
      icon: 'pi pi-calendar',
      command: () => navigate('/events')
    },
    {
      label: 'Providers',
      icon: 'pi pi-users',
      command: () => navigate('/suppliers')
    }
  ];

  const userMenuItems = [
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => navigate('/profile')
    },
    {
      label: 'My Bookings',
      icon: 'pi pi-ticket',
      command: () => navigate('/bookings')
    },
    {
      separator: true
    },
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
    <Link to="/" className="flex align-items-center text-decoration-none">
      <span className="text-2xl font-bold text-primary mr-2">EventMarketPlace</span>
    </Link>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      {user ? (
        <>
          <Menu model={userMenuItems} popup ref={menuRef} />
          <div className="flex align-items-center gap-2 cursor-pointer" onClick={(e) => menuRef.current.toggle(e)}>
           {!user || !user.profilePictureUrl&&
           
            <Avatar 
              icon="pi pi-user" 
              size="large" 
              shape="circle"
            />}
            {user.profilePictureUrl &&
              <Avatar
                image={user.profilePictureUrl}
                size="large"
                shape="circle"
              />
            }
            <span className="hidden md:block">{user.name}</span>
          </div>
        </>
      ) : (
        <>
          <Button 
            label="Sign In" 
            className="p-button-text"
            onClick={() => navigate('/login')}
          />
          <Button 
            label="Register" 
            onClick={() => navigate('/register')}
          />
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-column">
      <Menubar model={items} start={start} end={end} className="border-noround" />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-900 text-primary py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 EventMarketPlace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};