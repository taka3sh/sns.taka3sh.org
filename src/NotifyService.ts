import firebase from 'firebase/app'

const NOTIFYSERVICE_ENABLED = 'NotifyService:enabled'

const getEnabled = () => localStorage.getItem(NOTIFYSERVICE_ENABLED) === 'true'
const setEnabled = () => {
  localStorage.setItem(NOTIFYSERVICE_ENABLED, 'true')
}
const unsetEnabled = () => {
  localStorage.removeItem(NOTIFYSERVICE_ENABLED)
}

const showGreeting = () => {
  navigator.serviceWorker
    .getRegistration('/firebase-cloud-messaging-push-scope')
    .then((swReg) =>
      swReg?.showNotification('通知設定が完了しました', {
        body: '新しい投稿がある時、このアイコンの通知が配信されます。',
        icon: '/logo192.png'
      })
    )
}

export default class {
  readonly messaging: firebase.messaging.Messaging

  readonly endpoint: string

  constructor (messaging: firebase.messaging.Messaging, endpoint: string) {
    this.messaging = messaging
    this.endpoint = endpoint
  }

  static isSupported (): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator
  }

  static getEnabled (): Promise<boolean> {
    return navigator.serviceWorker
      .getRegistration('/firebase-cloud-messaging-push-scope')
      .then((swReg) => {
        const tokenSent = getEnabled()
        const notifyAllowed = !!swReg && Notification.permission === 'granted'
        if (tokenSent && !notifyAllowed) {
          setEnabled()
        }
        return tokenSent && notifyAllowed
      })
  }

  subscribe (): Promise<void> {
    return this.messaging
      .requestPermission()
      .then(() => this.messaging.getToken())
      .then((currentToken) => {
        const body = new FormData()
        body.append('token', currentToken)
        return fetch(this.endpoint, {
          body,
          method: 'POST'
        })
      })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText)
        setEnabled()
        showGreeting()
      })
  }

  unsubscribe (): Promise<void> {
    return this.messaging
      .getToken()
      .then((currentToken) => this.messaging.deleteToken(currentToken))
      .then(() => {
        unsetEnabled()
      })
  }
}
