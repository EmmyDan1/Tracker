import { createServerSupabaseClient } from '@/lib/supabase-server'
import SettingsForm from '@/components/settings/settingsForm'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('email', user!.email!)
    .single()

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

      <SettingsForm company={company} />
    </div>
  )
}