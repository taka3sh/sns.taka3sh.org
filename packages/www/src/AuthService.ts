import firebase from 'firebase/app'

const AUTHSERVICE_USER = 'AuthService:user'

export const getAuthServiceUser = (): boolean => localStorage.getItem(AUTHSERVICE_USER) === 'loggedIn'

export class AuthService {
  readonly auth: firebase.auth.Auth

  constructor (auth: firebase.auth.Auth) {
    this.auth = auth
  }

  async login (email: string, password: string): Promise<boolean> {
    const result = await this.auth.signInWithEmailAndPassword(email, password)
    if (result.user === null || result.user.email === null) throw new Error('Authentication error')
    localStorage.setItem(AUTHSERVICE_USER, 'loggedIn')
    return true
  }

  logout () {
    this.auth.signOut()
    localStorage.removeItem(AUTHSERVICE_USER)
  }
}
