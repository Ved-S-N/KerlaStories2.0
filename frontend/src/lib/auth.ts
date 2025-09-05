import { User, SignInData, SignUpData } from '@/types/user';

// Mock auth functions - replace with actual API calls
export const auth = {
  async signIn(data: SignInData): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (data.email === 'admin@keralaagritech.com' && data.password === 'password') {
      return {
        id: '1',
        email: data.email,
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
      };
    }

    if (data.email === 'farmer@keralaagritech.com' && data.password === 'password') {
      return {
        id: '2',
        email: data.email,
        name: 'Farmer User',
        role: 'farmer',
        createdAt: new Date(),
      };
    }

    throw new Error('Invalid credentials');
  },

  async signUp(data: SignUpData): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists
    if (data.email === 'admin@keralaagritech.com' || data.email === 'farmer@keralaagritech.com') {
      throw new Error('User already exists');
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(),
    };
  },

  async signOut(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },
};
