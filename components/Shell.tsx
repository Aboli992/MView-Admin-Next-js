'use client'

import { useState, useCallback, useRef } from 'react'
import type { PageName, Role } from '@/lib/types'
import { OPS_PAGES, CONST_PAGES, CRUMBS } from '@/lib/constants'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Flash from './Flash'

// Pages
import Dashboard from './pages/Dashboard'
import DailyPulse from './pages/DailyPulse'
import SubmitUpdate from './pages/SubmitUpdate'
import WeeklyReports from './pages/WeeklyReports'
import QuarterlyReview from './pages/QuarterlyReview'
import TeamPage from './pages/TeamPage'
import Files from './pages/Files'
import Pipelines from './pages/Pipelines'
import Constitution from './pages/Constitution'
import ProposeChange from './pages/ProposeChange'
import UploadChanges from './pages/UploadChanges'
import AuditLog from './pages/AuditLog'
import Notifications from './pages/Notifications'
import ReviewQueue from './pages/ReviewQueue'
import {
  Owners, Engagement, Claims, Campaigns, Audiences,
  ABTesting, EntityPages, LLMOGeneration, SEOPerformance,
  WebsitePages, GrowthOverview, Analytics, CRM, Settings,
} from './pages/StubPages'

export default function Shell() {
  const [currentPage, setCurrentPage] = useState<PageName>('ops-pulse')
  const [role, setRole] = useState<Role>('sa')
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['ops-nav']))
  const [flashMsg, setFlashMsg] = useState('')
  const [flashVisible, setFlashVisible] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = useCallback((name: PageName) => {
    setCurrentPage(name)
    // Auto-open parent group
    if (OPS_PAGES.includes(name)) {
      setOpenGroups(prev => new Set([...prev, 'ops-nav']))
    } else if (CONST_PAGES.includes(name)) {
      setOpenGroups(prev => new Set([...prev, 'const-sub']))
    }
  }, [])

  const toggleGroup = useCallback((name: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const flash = useCallback((msg: string) => {
    setFlashMsg(msg)
    setFlashVisible(true)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlashVisible(false), 2400)
  }, [])

  const crumb = CRUMBS[currentPage] ?? currentPage

  const pageProps = { role, go, flash }

  return (
    <div className={`shell role-${role}`}>
      <Sidebar
        currentPage={currentPage}
        role={role}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
        go={go}
      />
      <div className="main">
        <Topbar crumb={crumb} role={role} setRole={setRole} />
        <div className="content">
          {currentPage === 'dashboard'       && <Dashboard {...pageProps} />}
          {currentPage === 'ops-pulse'       && <DailyPulse {...pageProps} />}
          {currentPage === 'ops-submit'      && <SubmitUpdate {...pageProps} />}
          {currentPage === 'ops-weekly'      && <WeeklyReports {...pageProps} />}
          {currentPage === 'ops-quarterly'   && <QuarterlyReview {...pageProps} />}
          {currentPage === 'ops-team'        && <TeamPage {...pageProps} />}
          {currentPage === 'ops-files'       && <Files {...pageProps} />}
          {currentPage === 'ops-pipelines'   && <Pipelines {...pageProps} />}
          {currentPage === 'constitution'    && <Constitution {...pageProps} />}
          {currentPage === 'const-propose'   && <ProposeChange {...pageProps} />}
          {currentPage === 'const-review'    && <ReviewQueue {...pageProps} />}
          {currentPage === 'const-upload'    && <UploadChanges {...pageProps} />}
          {currentPage === 'const-audit'     && <AuditLog {...pageProps} />}
          {currentPage === 'const-notify'    && <Notifications flash={flash} />}
          {currentPage === 'owners'          && <Owners {...pageProps} />}
          {currentPage === 'engagement'      && <Engagement {...pageProps} />}
          {currentPage === 'claims'          && <Claims {...pageProps} />}
          {currentPage === 'campaigns'       && <Campaigns {...pageProps} />}
          {currentPage === 'audiences'       && <Audiences {...pageProps} />}
          {currentPage === 'abtesting'       && <ABTesting {...pageProps} />}
          {currentPage === 'entity-pages'    && <EntityPages {...pageProps} />}
          {currentPage === 'llmo'            && <LLMOGeneration {...pageProps} />}
          {currentPage === 'seo'             && <SEOPerformance {...pageProps} />}
          {currentPage === 'website'         && <WebsitePages {...pageProps} />}
          {currentPage === 'growth'          && <GrowthOverview {...pageProps} />}
          {currentPage === 'analytics'       && <Analytics {...pageProps} />}
          {currentPage === 'crm'             && <CRM {...pageProps} />}
          {currentPage === 'settings'        && <Settings {...pageProps} />}
        </div>
      </div>
      <Flash message={flashMsg} visible={flashVisible} />
    </div>
  )
}
