import { Auth, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const AUTHSERVICE_USER = 'AuthService:user'

export const getAuthServiceUser = (): boolean => localStorage.getItem(AUTHSERVICE_USER) === 'loggedIn'

export class AuthService {
  readonly auth: Auth

  constructor (auth: Auth) {
    this.auth = auth
  }

  async login (email: string, password: string): Promise<boolean> {
    const result = await signInWithEmailAndPassword(this.auth, email, password)
    if (result.user === null || result.user.email === null) throw new Error('Authentication error')
    localStorage.setItem(AUTHSERVICE_USER, 'loggedIn')
    return true
  }

  logout () {
    signOut(this.auth)
    localStorage.removeItem(AUTHSERVICE_USER)
  }
}
