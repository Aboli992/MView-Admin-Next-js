'use client'

import { useState } from 'react'
import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function Files({ flash }: Props) {
  const [activeTab, setActiveTab] = useState<'resumes'|'updates'|'docs'>('resumes')

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Files</div>
          <div className="ps">Resumes · daily updates · documents · replaces Google Drive for team files</div>
        </div>
        <div className="ph-r">
          <button className="btn btn-p btn-sm" onClick={() => flash('Upload coming soon')}>↑ Upload</button>
        </div>
      </div>
      <div className="tabs">
        <div className={`tab${activeTab === 'resumes' ? ' on' : ''}`} onClick={() => setActiveTab('resumes')}>Resumes</div>
        <div className={`tab${activeTab === 'updates' ? ' on' : ''}`} onClick={() => setActiveTab('updates')}>Daily Updates</div>
        <div className={`tab${activeTab === 'docs' ? ' on' : ''}`} onClick={() => setActiveTab('docs')}>Documents</div>
      </div>

      {activeTab === 'resumes' && (
        <div className="card">
          <div className="ch"><div className="ct">Team resumes</div><div className="cs">Upload and manage team resumes here</div></div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Resumes uploaded by team members will appear here. Missing resumes can be requested directly.</div>
        </div>
      )}
      {activeTab === 'updates' && (
        <div className="card">
          <div className="ch"><div className="ct">Daily update archive</div></div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Daily pulse submissions are automatically archived here.</div>
        </div>
      )}
      {activeTab === 'docs' && (
        <div className="card">
          <div className="ch">
            <div className="ct">Team documents</div>
            <button className="btn btn-sm" onClick={() => flash('Upload coming soon')}>↑ Upload</button>
          </div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Upload team documents here — alignment docs, build plans, roadmaps.</div>
        </div>
      )}
    </div>
  )
}
