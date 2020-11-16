import React from 'react';

export interface Props {
  readonly busy: boolean
  readonly enabled: boolean
  readonly handleNotifyToggle: () => void
}

export const NotifySwitch = ({ busy, enabled, handleNotifyToggle }: Props) => (
  <div className="switch">
    <label htmlFor="enabled">
      <input id="enabled" name="enabled" type="checkbox" checked={enabled} disabled={busy} onChange={handleNotifyToggle} />
      <span className="lever" />
      { enabled ? '通知オン' : '通知オフ' }
    </label>
  </div>
);
