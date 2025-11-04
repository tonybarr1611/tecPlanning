import { StoredUser } from '../shared/types';

// Function to initialize demo users in localStorage
export const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem('tecplanning_users');
  
  if (!existingUsers) {
    const demoUsers: StoredUser[] = [
      {
        id: '1',
        name: 'Anthony Barrantes',
        email: 'anthony@tec.ac.cr',
        password: 'demo123',
        program: 'Ingeniería en Computación',
        carne: '2023152240'
      },
      {
        id: '2',
        name: 'María González',
        email: 'maria@tec.ac.cr',
        password: 'demo123',
        program: 'Ingeniería Industrial',
        carne: '2022134567'
      },
      {
        id: '3',
        name: 'Carlos Rodríguez',
        email: 'carlos@tec.ac.cr',
        password: 'demo123',
        program: 'Administración de Empresas',
        carne: '2021145678'
      }
    ];

    localStorage.setItem('tecplanning_users', JSON.stringify(demoUsers));
    console.log('Demo users initialized:', demoUsers.map(u => ({ email: u.email, password: u.password, carne: u.carne })));
  } else {
    // Check if existing users need to be updated with carné field
    const users = JSON.parse(existingUsers);
    let needsUpdate = false;
    
    const updatedUsers = users.map((user: Partial<StoredUser>) => {
      if (!user.carne) {
        needsUpdate = true;
        // Assign default carné based on existing users
        if (user.email === 'anthony@tec.ac.cr') return { ...user, carne: '2023152240' };
        if (user.email === 'maria@tec.ac.cr') return { ...user, carne: '2022134567' };
        if (user.email === 'carlos@tec.ac.cr') return { ...user, carne: '2021145678' };
        return { ...user, carne: '2023000000' }; // Default for other users
      }
      return user;
    });

    if (needsUpdate) {
      localStorage.setItem('tecplanning_users', JSON.stringify(updatedUsers));
      console.log('Existing users updated with carné field');
    }
  }
};

// Call this function when the app starts
initializeDemoUsers();