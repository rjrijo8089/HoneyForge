'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { SectionHeader, SelectField, SaveBar, TabCard, useSave } from './shared'

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore',
  'Asia/Kolkata', 'Australia/Sydney',
].map((z) => ({ value: z, label: z.replace('_', ' ') }))

const LANDING_PAGES = [
  { value: '/dashboard',        label: 'Dashboard'         },
  { value: '/live-attack-feed', label: 'Live Attack Feed'  },
  { value: '/threat-intel',     label: 'Threat Intel'      },
  { value: '/review-queue',     label: 'Review Queue'      },
  { value: '/detection-rules',  label: 'Detection Rules'   },
]

export function GeneralTab() {
  const { saving, saved, save } = useSave()

  const [form, setForm] = useState({
    orgName:      'ACME Corporation',
    platformName: 'HoneyForge SOC',
    adminEmail:   'admin@honeyforge.io',
    timezone:     'UTC',
    landingPage:  '/dashboard',
  })

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((p) => ({ ...p, [k]: v }))

  return (
    <TabCard>
      <SectionHeader title="Platform Identity" />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <Input
          label="Organisation Name"
          value={form.orgName}
          onChange={(e) => set('orgName', e.target.value)}
        />
        <Input
          label="Platform Name"
          value={form.platformName}
          onChange={(e) => set('platformName', e.target.value)}
        />
      </div>
      <div className="pt-2">
        <Input
          label="Admin Email"
          type="email"
          value={form.adminEmail}
          onChange={(e) => set('adminEmail', e.target.value)}
          hint="Receives system alerts, error reports, and security notifications"
        />
      </div>

      <div className="pt-4">
        <SectionHeader title="Defaults" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <SelectField
          label="Default Timezone"
          value={form.timezone}
          onChange={(v) => set('timezone', v)}
          options={TIMEZONES}
          hint="Applied to all timestamps displayed in the platform"
        />
        <SelectField
          label="Default Landing Page"
          value={form.landingPage}
          onChange={(v) => set('landingPage', v)}
          options={LANDING_PAGES}
          hint="Page users see after login"
        />
      </div>

      <SaveBar onSave={() => save()} saving={saving} saved={saved} />
    </TabCard>
  )
}
