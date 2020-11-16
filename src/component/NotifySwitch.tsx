import React from 'react'

export interface Props {
  busy: boolean
  enabled: boolean
  handleNotifyToggle: (event: React.MouseEvent<HTMLInputElement>) => void
}

export const NotifySwitch = ({ busy, enabled, handleNotifyToggle }: Props) => (
  <div className="switch">
    <label>
      <input type="checkbox" checked={enabled} disabled={busy} onClick={handleNotifyToggle} />
      <span className="lever"></span>
      { enabled ? '通知オン' : '通知オフ' }
    </label>
  </div>
)
