import firebase from 'firebase/app'
import logo192 from './logo192.png'

const scope = '/sw/'

const NOTIFYSERVICE_ENABLED = 'NotifyService:enabled'
const isTokenSent = () => localStorage.getItem(NOTIFYSERVICE_ENABLED) === 'true'
const setTokenSent = () => {
  localStorage.setItem(NOTIFYSERVICE_ENABLED, 'true')
}
const setTokenRemoved = () => {
  localStorage.setItem(NOTIFYSERVICE_ENABLED, 'false')
}

export const isNotifyServiceEnabled = async (): Promise<boolean> => {
  const swReg = await navigator.serviceWorker.getRegistration(scope)
  const tokenSent = isTokenSent()
  const notifyAllowed = typeof swReg !== 'undefined' && Notification.permission === 'granted'
  return tokenSent && notifyAllowed
}

const showGreeting = async () => {
  const swReg = await navigator.serviceWorker.getRegistration(scope)
  swReg?.showNotification('通知設定が完了しました', {
    body: '新しい投稿がある時、このアイコンの通知が配信されます。',
    icon: new URL(logo192).pathname
  })
}

export const registerNotifyServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  const firebaseSwReg = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
  firebaseSwReg?.unregister()
  return navigator.serviceWorker.register(new URL('./sw/index.ts', import.meta.url), {
    scope,
    type: 'module'
  })
}

export class NotifyService {
  readonly messaging: firebase.messaging.Messaging
  readonly endpoint: string

  constructor (messaging: firebase.messaging.Messaging, endpoint: string) {
    this.messaging = messaging
    this.endpoint = endpoint
  }

  async subscribe (): Promise<void> {
    const swReg = await registerNotifyServiceWorker()
    const currentToken = await this.messaging.getToken({
      serviceWorkerRegistration: swReg
    })
    const body = new FormData()
    body.append('token', currentToken)
    const response = await fetch(this.endpoint, {
      body,
      method: 'POST'
    })
    if (!response.ok) throw new Error(response.statusText)
    setTokenSent()
    showGreeting()
  }

  async unsubscribe (): Promise<boolean> {
    const swReg = await navigator.serviceWorker.getRegistration(scope)
    const isUnregistered = await swReg?.unregister() === true
    if (isUnregistered) {
      setTokenRemoved()
    }
    return isUnregistered
  }
}
