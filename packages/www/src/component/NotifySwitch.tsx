import React from 'react'

export interface NotifySwitchProps {
  readonly busy: boolean
  readonly enabled: boolean
  readonly handleNotifyToggle: () => void
}

export const NotifySwitch: React.VFC<NotifySwitchProps> = ({
  busy,
  enabled,
  handleNotifyToggle
}: NotifySwitchProps) => (
  <div className="switch">
    <label htmlFor="enabled">
      <input
        id="enabled"
        name="enabled"
        type="checkbox"
        checked={enabled}
        disabled={busy}
        onChange={handleNotifyToggle}
      />
      <span className="lever" />
      {enabled ? '通知オン' : '通知オフ'}
    </label>
  </div>
)
