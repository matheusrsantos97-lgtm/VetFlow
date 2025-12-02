import { User } from "../types";

const USERS_KEY = 'animale_users';
const CURRENT_USER_KEY = 'animale_current_user';

export const authService = {
  getUsers: (): User[] => {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  register: (name: string, email: string, password: string): User => {
    const users = authService.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error("Este email já está cadastrado.");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      crmv: '',
      phone: '',
      birthDate: ''
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login after register
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: (email: string, password: string): User => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Email ou senha inválidos.");
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  updateProfile: (updatedUser: User): User => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index === -1) throw new Error("Usuário não encontrado.");

    // Atualiza na lista geral
    users[index] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Atualiza sessão atual
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
};