import React from 'react'

export interface Props {
  busy: boolean
  enabled: boolean
  handleNotifyToggle: () => void
}

export const NotifySwitch = ({ busy, enabled, handleNotifyToggle }: Props) => (
  <div className="switch">
    <label>
      <input type="checkbox" checked={enabled} disabled={busy} onChange={handleNotifyToggle} />
      <span className="lever"></span>
      { enabled ? '通知オン' : '通知オフ' }
    </label>
  </div>
)
