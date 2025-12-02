import { User } from "../types";

const USER_KEY = 'vetflow_user_profile';

const DEFAULT_USER: User = {
  id: 'default_user',
  name: 'Veterinário(a)',
  email: '',
  password: '', // Não utilizado mais
  crmv: '',
  phone: '',
  birthDate: ''
};

export const authService = {
  // Retorna o usuário atual ou cria um padrão se não existir
  getUser: (): User => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
      // Se não existir, salva e retorna o padrão
      localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    } catch (error) {
      return DEFAULT_USER;
    }
  },

  updateProfile: (updatedUser: User): User => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  login: (email: string, password: string): User => {
    // Mock login implementation
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        // If the stored user has no email, take the one provided (lazy init)
        if (!user.email) {
          user.email = email;
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        return user;
      }
      // If no user found, create a default one with the email
      const newUser = { ...DEFAULT_USER, email };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return DEFAULT_USER;
    }
  },

  register: (name: string, email: string, password: string): User => {
    // Mock register implementation
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real app, this should be hashed
      crmv: '',
      phone: '',
      birthDate: ''
    };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return newUser;
  }
};