import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Sidebar from '@/components/dashboard/Sidebar'
import AIChat from '@/components/dashboard/AIChat'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('email', user.email!)
    .single()

  return (
    <div className="flex h-screen overflow-hidden" >
      <Sidebar companyName={company?.name ?? 'Your Company'} userEmail={user.email!} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
        <AIChat />
      </main>
    </div>
  )
}