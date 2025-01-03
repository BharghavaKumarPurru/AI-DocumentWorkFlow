export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      username: string;
    };
  }
  
  export interface AuthError {
    message: string;
  }