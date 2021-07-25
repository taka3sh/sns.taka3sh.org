import firebase from 'firebase/app'

const AUTHSERVICE_USER = 'AuthService:user'

export class AuthService {
  readonly auth: firebase.auth.Auth

  constructor (auth: firebase.auth.Auth) {
    this.auth = auth
  }

  static getUser (): boolean {
    return localStorage.getItem(AUTHSERVICE_USER) === 'loggedIn'
  }

  login (email: string, password: string): Promise<boolean> {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user == null || result.user.email == null) { throw new Error('Authentication error') }
        localStorage.setItem(AUTHSERVICE_USER, 'loggedIn')
        return true
      })
  }

  logout (): Promise<void> {
    return this.auth.signOut().then(() => {
      localStorage.removeItem(AUTHSERVICE_USER)
    })
  }
}
