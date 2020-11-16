import firebase from 'firebase/app'

const AUTHSERVICE_USER = 'AuthService:user'

export class AuthService {
  auth: firebase.auth.Auth

  constructor(auth: firebase.auth.Auth) {
    this.auth = auth
  }

  getUser(): string | null {
    return localStorage.getItem(AUTHSERVICE_USER)
  }

  login(email: string, password: string): Promise<string> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        if (result.user == null || result.user.email == null) throw new Error('Authentication error')
        localStorage.setItem(AUTHSERVICE_USER, result.user.email)
        return result.user.email
      })
  }

  logout(): Promise<void> {
    return this.auth.signOut()
      .then(() => {
        localStorage.removeItem(AUTHSERVICE_USER)
      })
  }
}
