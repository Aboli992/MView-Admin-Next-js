'use client'

import type { PageName, Role } from '@/lib/types'

interface Props {
  currentPage: PageName
  role: Role
  openGroups: Set<string>
  toggleGroup: (name: string) => void
  go: (page: PageName) => void
}

const ChevIcon = ({ open }: { open: boolean }) => (
  <svg className={`chev${open ? ' open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function Sidebar({ currentPage, role, openGroups, toggleGroup, go }: Props) {
  const isOps = ['ops-pulse','ops-submit','ops-weekly','ops-quarterly','ops-team','ops-files','ops-pipelines'].includes(currentPage)
  const isConst = ['constitution','const-propose','const-review','const-upload','const-audit','const-notify'].includes(currentPage)

  const roleLabels: Record<Role, string> = { user: 'User', admin: 'Admin', sa: 'Super Admin' }
  const roleNames: Record<Role, string> = { user: 'User', admin: 'Admin User', sa: 'Shaun Cochran' }
  const roleRoles: Record<Role, string> = { user: 'Viewer', admin: 'Growth Admin', sa: 'Super Admin' }

  return (
    <aside className="sb">
      <div className="sb-logo">
        <svg className="gem" width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="hsl(150 25% 40% / 0.12)"/>
          <polygon points="16,6 22,12 24,19 16,26 8,19 10,12" stroke="hsl(150 25% 40%)" strokeWidth="0.75" strokeLinejoin="round" fill="none"/>
          <polygon points="16,6 22,12 16,11 10,12" fill="hsl(150 25% 40% / 0.25)"/>
          <polygon points="10,12 16,11 16,23 8,19" fill="hsl(150 25% 40% / 0.55)"/>
          <polygon points="22,12 24,19 16,23 16,11" fill="hsl(150 25% 40% / 0.80)"/>
          <polygon points="8,19 16,23 24,19 16,26" fill="hsl(150 25% 40% / 0.40)"/>
        </svg>
        <div>
          <div className="mv-name">MineralView</div>
          <div className="mv-tag">{roleLabels[role]}</div>
        </div>
      </div>

      <nav className="sb-nav">
        {/* Dashboard */}
        <div className={`ni${currentPage === 'dashboard' ? ' on' : ''}`} onClick={() => go('dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>
          Dashboard
          <span className="ni-badge nb-g">Live</span>
        </div>

        <div className="div"/>
        <div className="ns">Owner Lifecycle</div>

        <div className={`ni${currentPage === 'owners' ? ' on' : ''}`} onClick={() => go('owners')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
          Mineral Owners
          <span className="ni-badge nb-b">↑</span>
        </div>

        <div className="ni" onClick={() => toggleGroup('personas')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Personas
          <ChevIcon open={openGroups.has('personas')} />
        </div>
        {openGroups.has('personas') && (
          <div className="sub">
            {['Legacy / Inherited','Passive Income','Active Deal-Seeking','Sophisticated Portfolio','Distrustful / Burned'].map(p => (
              <div key={p} className="nc" onClick={() => go('owners')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/></svg>
                {p}
              </div>
            ))}
          </div>
        )}

        <div className={`ni${currentPage === 'engagement' ? ' on' : ''}`} onClick={() => go('engagement')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Engagement Intel
        </div>
        <div className={`ni${currentPage === 'claims' ? ' on' : ''}`} onClick={() => go('claims')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Claim Pipeline
        </div>

        <div className="div"/>
        <div className="ns">Campaigns</div>

        <div className={`ni${currentPage === 'campaigns' ? ' on' : ''}`} onClick={() => go('campaigns')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          Campaigns
        </div>
        <div className={`ni${currentPage === 'audiences' ? ' on' : ''}`} onClick={() => go('audiences')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Custom Audiences
        </div>
        <div className={`ni${currentPage === 'abtesting' ? ' on' : ''}`} onClick={() => go('abtesting')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          A/B Testing
        </div>

        <div className="div"/>
        <div className="ns">Entity Pages</div>

        <div className={`ni${currentPage === 'entity-pages' ? ' on' : ''}`} onClick={() => go('entity-pages')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          All Entity Pages
          <span className="ni-badge nb-b">↑</span>
        </div>
        <div className="ni" onClick={() => toggleGroup('entities')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          By Entity Type
          <ChevIcon open={openGroups.has('entities')} />
        </div>
        {openGroups.has('entities') && (
          <div className="sub">
            <div className="nc" onClick={() => go('entity-pages')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>Operators</div>
            <div className="nc" onClick={() => go('entity-pages')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>Counties</div>
            <div className="nc" onClick={() => go('entity-pages')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/></svg>Wells</div>
          </div>
        )}
        <div className={`ni${currentPage === 'llmo' ? ' on' : ''}`} onClick={() => go('llmo')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          LLMO Generation
        </div>
        <div className={`ni${currentPage === 'seo' ? ' on' : ''}`} onClick={() => go('seo')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          SEO Performance
        </div>

        <div className="div"/>
        <div className="ns">Website</div>

        <div className={`ni${currentPage === 'website' ? ' on' : ''}`} onClick={() => go('website')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          Pages
        </div>
        <div className="ni" onClick={() => toggleGroup('content-lib')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Content Library
          <ChevIcon open={openGroups.has('content-lib')} />
        </div>
        {openGroups.has('content-lib') && (
          <div className="sub">
            <div className="nc" onClick={() => go('website')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg>FAQs</div>
            <div className="nc" onClick={() => go('website')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Media</div>
            <div className="nc" onClick={() => go('website')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Blog</div>
            <div className="nc" onClick={() => go('website')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>Forms</div>
          </div>
        )}

        <div className="div"/>
        <div className="ns">Growth</div>

        <div className={`ni${currentPage === 'growth' ? ' on' : ''}`} onClick={() => go('growth')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          Growth Overview
        </div>
        <div className={`ni${currentPage === 'analytics' ? ' on' : ''}`} onClick={() => go('analytics')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Analytics
        </div>
        <div className={`ni${currentPage === 'crm' ? ' on' : ''}`} onClick={() => go('crm')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          CRM / GHL
        </div>

        <div className="div"/>
        <div className="ns">Operations</div>

        <div className={`ni${isOps ? ' on' : ''}`} onClick={() => toggleGroup('ops-nav')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Operations
          <ChevIcon open={openGroups.has('ops-nav')} />
        </div>
        {openGroups.has('ops-nav') && (
          <div className="sub">
            <div className={`nc${currentPage === 'ops-pulse' ? ' on' : ''}`} onClick={() => go('ops-pulse')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Daily Pulse
              <span className="nc-ct nb-a" style={{background:'hsl(35 60% 55%/.14)',color:'hsl(35 50% 34%)',borderRadius:'9px',padding:'1px 5px'}}>Live</span>
            </div>
            <div className={`nc${currentPage === 'ops-submit' ? ' on' : ''}`} onClick={() => go('ops-submit')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Submit Update
            </div>
            <div className={`nc${currentPage === 'ops-weekly' ? ' on' : ''}`} onClick={() => go('ops-weekly')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Weekly Reports
            </div>
            <div className={`nc${currentPage === 'ops-quarterly' ? ' on' : ''}`} onClick={() => go('ops-quarterly')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Quarterly Review
            </div>
            <div className={`nc${currentPage === 'ops-team' ? ' on' : ''}`} onClick={() => go('ops-team')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Team
            </div>
            <div className={`nc${currentPage === 'ops-files' ? ' on' : ''}`} onClick={() => go('ops-files')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Files
            </div>
            <div className={`nc${currentPage === 'ops-pipelines' ? ' on' : ''}`} onClick={() => go('ops-pipelines')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Pipelines
            </div>
          </div>
        )}

        <div className="div"/>
        <div className="ns">Constitution</div>

        <div className={`ni${currentPage === 'constitution' ? ' on' : ''}`} onClick={() => go('constitution')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Read Constitution
        </div>
        <div className={`ni${isConst && currentPage !== 'constitution' ? ' on' : ''}`} onClick={() => toggleGroup('const-sub')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Manage
          <ChevIcon open={openGroups.has('const-sub')} />
        </div>
        {openGroups.has('const-sub') && (
          <div className="sub">
            <div className={`nc admin-only${currentPage === 'const-propose' ? ' on' : ''}`} onClick={() => go('const-propose')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Propose Change
            </div>
            <div className={`nc sa-only${currentPage === 'const-review' ? ' on' : ''}`} onClick={() => go('const-review')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Review Queue
              <span className="ni-badge nb-a" style={{marginLeft:'4px'}}>0</span>
            </div>
            <div className={`nc sa-only${currentPage === 'const-upload' ? ' on' : ''}`} onClick={() => go('const-upload')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              Upload Changes
              <span className="ni-badge nb-p" style={{marginLeft:'4px'}}>SA</span>
            </div>
            <div className={`nc${currentPage === 'const-audit' ? ' on' : ''}`} onClick={() => go('const-audit')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Audit Log
            </div>
            <div className={`nc sa-only${currentPage === 'const-notify' ? ' on' : ''}`} onClick={() => go('const-notify')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notifications
              <span className="ni-badge nb-p" style={{marginLeft:'4px'}}>SA</span>
            </div>
          </div>
        )}

        <div className="div"/>
        <div className="ns">Platform</div>

        <div className="ni" onClick={() => toggleGroup('settings')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
          <ChevIcon open={openGroups.has('settings')} />
        </div>
        {openGroups.has('settings') && (
          <div className="sub">
            <div className={`nc${currentPage === 'settings' ? ' on' : ''}`} onClick={() => go('settings')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>Company Info</div>
            <div className="nc" onClick={() => go('settings')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>Ads &amp; Integrations</div>
            <div className="nc" onClick={() => go('settings')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Tracking</div>
            <div className="nc sa-only" onClick={() => go('settings')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Users &amp; Roles<span className="ni-badge nb-p" style={{marginLeft:'4px'}}>SA</span></div>
            <div className="nc" onClick={() => go('settings')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/></svg>Domain</div>
          </div>
        )}
      </nav>

      <div className="sb-user">
        <div className={`u-ava${role === 'sa' ? ' sa' : ''}`}>
          {role === 'sa' ? 'SC' : 'AU'}
        </div>
        <div>
          <div className="u-name">{roleNames[role]}</div>
          <div className="u-role">{roleRoles[role]}</div>
        </div>
      </div>
    </aside>
  )
}
