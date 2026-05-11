import { createServerSupabaseClient } from '@/lib/supabase-server'
import SettingsForm from '@/components/settings/settingsForm'
import ZoneManager from '@/components/settings/ZoneManager'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: company }, { data: zones }] = await Promise.all([
    supabase
      .from('companies')
      .select('*')
      .eq('email', user!.email!)
      .single(),
    supabase
      .from('delivery_zones')
      .select('*')
      .order('created_at', { ascending: true }),
  ])

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-black">Settings</h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Manage your company preferences
          </p>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <SettingsForm company={company} />
        <ZoneManager
          companyId={company?.id ?? ''}
          initialZones={zones ?? []}
        />
      </div>
    </div>
  )
}