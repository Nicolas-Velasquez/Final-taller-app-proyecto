import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'netcash_users';
const SESSION_KEY = 'netcash_session';

export interface User {
  username: string;
  password: string;
}

// Guarda un nuevo usuario
export const registerUser = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const existing = await getUsers();
    const alreadyExists = existing.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (alreadyExists) {
      return { success: false, message: 'Ese usuario ya existe' };
    }
    const updated = [...existing, { username, password }];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updated));
    return { success: true, message: 'Usuario creado' };
  } catch {
    return { success: false, message: 'Error al registrar' };
  }
};

// Verifica login
export const loginUser = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const existing = await getUsers();
    const user = existing.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
    await AsyncStorage.setItem(SESSION_KEY, username);
    return { success: true, message: 'Bienvenido' };
  } catch {
    return { success: false, message: 'Error al iniciar sesión' };
  }
};

// Obtiene todos los usuarios guardados
export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Obtiene la sesión activa
export const getSession = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};

// Cierra sesión
export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
