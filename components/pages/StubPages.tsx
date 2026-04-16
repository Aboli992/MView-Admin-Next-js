'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export function Owners(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Mineral Owners</div><div className="ps">Owner lifecycle management · claims · statements</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Total owners</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Claims in progress</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Statements uploaded</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Claims completed</div></div>
      </div>
    </div>
  )
}

export function Engagement(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Engagement Intelligence</div><div className="ps">Visitor scoring · behavioral tiers · hot leads</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Scorching (intent high)</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Hot</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Warm</div></div>
        <div className="sv"><div className="sv-v" style={{color:'var(--muted-fg)'}}>—</div><div className="sv-l">Cold</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Behavioral scoring</div><div className="cs">Source: docs/01-foundations/05-behavior-system.md</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Engagement intelligence connects here when the User Brain behavioral scoring pipeline is live.<br/>Tiers: Scorching → Hot → Warm → Cold based on session depth, query type, and return visits.</div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Pre-conversion intent signals</div><div className="cs">Source: docs/03-intelligence-systems/12-user-intelligence.md</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>High-intent visitors flagged for follow-up will appear here. Requires behavioral scoring pipeline.</div>
      </div>
    </div>
  )
}

export function Claims(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Claim Pipeline</div><div className="ps">Active claims · ownership verification</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Claims started</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">In verification</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Completed</div></div>
        <div className="sv"><div className="sv-v err">—</div><div className="sv-l">Stalled &gt;7 days</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Active claims</div><div className="cs">Ownership verification in progress</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Claim records will populate here from MViewPortalAPI. Connects in Phase 4 when the intelligence engine is integrated.</div>
      </div>
    </div>
  )
}

export function Campaigns(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Campaigns</div><div className="ps">Active campaigns · Google · Meta · Email</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Ad Spend (7d)</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">ROAS</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Active Campaigns</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Awaiting Review</div></div>
      </div>
    </div>
  )
}

export function Audiences(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Custom Audiences</div><div className="ps">Google · Meta · persona-mapped audiences</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Google audiences</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Meta audiences</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale &gt;30 days</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Persona-mapped</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Audience segments</div><div className="cs">Source: docs/01-foundations/01-persona-ecosystem.md</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Custom audiences mapped to the five canonical mineral owner personas (Legacy, Passive Income, Active Deal-Seeking, Sophisticated Portfolio, Distrustful). Syncs to Google and Meta ad platforms.<br/><br/>Requires behavioral scoring and ad platform integration.</div>
      </div>
    </div>
  )
}

export function ABTesting(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">A/B Testing</div><div className="ps">Active tests · Constitution-grounded variants only · ADR-005</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Active tests</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Winning variants</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Inconclusive</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Tests completed</div></div>
      </div>
      <div className="notif">
        <div className="notif-dot"/>
        <div className="notif-tx">Governance rule: All A/B test variants must be Constitution-grounded. AI may not redefine product meaning, persona definitions, or trust language in test variants. See ADR-005.</div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Active experiments</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>A/B test results will appear here. Tests must be approved against Constitution before running — variants may not contradict the platform&apos;s core value proposition or persona definitions.</div>
      </div>
    </div>
  )
}

export function EntityPages(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Entity Pages</div><div className="ps">Operators · Counties · Wells · LLMO generation</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Live Pages</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale LLMO</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Operators</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Counties</div></div>
      </div>
    </div>
  )
}

export function LLMOGeneration(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">LLMO Generation</div><div className="ps">AI-assisted entity content · deterministic grounding required per ADR-005</div></div></div>
      <div className="notif">
        <div className="notif-dot"/>
        <div className="notif-tx">ADR-005 rule: All LLMO-generated content must be grounded in deterministic data. AI interprets — it does not generate primary mineral data. Stale pages are flagged for regeneration, not free-form rewrite.</div>
      </div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Live LLMO pages</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale (&gt;90 days)</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Queued for regen</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Generated this week</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Generation queue</div><div className="cs">Stale pages flagged for regeneration</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Entity pages flagged as stale appear here for LLMO regeneration. Each regeneration requires deterministic data input — AI does not free-write entity content. Connects when entity page pipeline is live.</div>
      </div>
    </div>
  )
}

export function SEOPerformance(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">SEO Performance</div><div className="ps">Rankings · traffic · keyword coverage · docs/05-growth-systems/03-seo-architecture.md</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Indexed pages</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Ranking gaps</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Target keywords</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Entity pages live</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Keyword coverage</div><div className="cs">Source: docs/05-growth-systems/03-seo-architecture.md</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Keyword rankings and coverage gaps appear here. Connects when SEO data pipeline and search console integration are configured.</div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Entity page SEO</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Operator, County, and Well entity page rankings tracked here. Pages are the SEO core — each entity page must be indexed and have deterministic data before LLMO content is generated.</div>
      </div>
    </div>
  )
}

export function WebsitePages(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Website Pages</div><div className="ps">Landing pages · blogs · FAQs · forms</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Live pages</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Needs update</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Blog posts</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">FAQs live</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Landing pages</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Landing page management connects here. Content must align with Q → Content Surface → Product routing model. See docs/05-growth-systems/01-content-engine.md.</div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">FAQ management</div><div className="cs">Source: docs/05-growth-systems/01-content-engine.md</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>FAQ entries appear here. Each FAQ must route to one of the five content surfaces: FAQ, Educational, Prompt Starters, Direct Intelligence, or Trust-first.</div>
      </div>
    </div>
  )
}

export function GrowthOverview(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Growth Overview</div><div className="ps">Platform Brain outputs · acquisition · discovery</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Entity Pages</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">ROAS</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Owners</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale LLMO</div></div>
      </div>
    </div>
  )
}

export function Analytics(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Analytics</div><div className="ps">Traffic · conversions · engagement intelligence · attribution</div></div></div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Sessions (7d)</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Intelligence queries</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Claim starts</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Conversion rate</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Traffic and attribution</div><div className="cs">Source: docs/01-foundations/05-behavior-system.md · ADR-003</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Session tracking, UTM capture, Click ID capture, and engagement scoring connect here. Requires consent-aware tracking script and attribution pipeline setup.</div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Conversion funnel</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Discovery → Intelligence Query → Statement Upload → Claim Start → Claim Complete. Funnel data populates when MViewPortalAPI is connected.</div>
      </div>
    </div>
  )
}

export function CRM(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">CRM / GHL</div><div className="ps">GoHighLevel · lifecycle contacts · automation</div></div></div>
      <div className="notif" style={{borderColor:'hsl(35 60% 55%/.3)',background:'hsl(35 60% 55%/.07)'}}>
        <div className="notif-dot" style={{background:'var(--warn)'}}/>
        <div className="notif-tx" style={{color:'var(--wfg)'}}>
          <strong>Gate active:</strong> GHL CRM architecture not yet confirmed against <code>docs/05-growth-systems/05-crm-integration.md</code>. Nikhil and Shaun must confirm GHL fit before this section is built. If GHL does not align, the Constitution CRM architecture must be revised first.
        </div>
      </div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Contacts</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Open leads</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Converted</div></div>
        <div className="sv"><div className="sv-v err">—</div><div className="sv-l">Stalled</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">CRM integration status</div><div className="cs">Source: docs/05-growth-systems/05-crm-integration.md</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>CRM lifecycle contacts will appear here once the GHL integration is confirmed against the Constitution CRM architecture and Phase 3E build is approved.</div>
      </div>
    </div>
  )
}

export function Settings(_props: Props) {
  return (
    <div>
      <div className="ph"><div><div className="pt">Settings</div><div className="ps">Company · integrations · tracking · users · roles</div></div></div>
      <div className="two">
        <div>
          <div className="card">
            <div className="ch"><div className="ct">Company info</div></div>
            <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:10,fontSize:12}}>
              <div className="ar"><span style={{color:'var(--muted-fg)'}}>Company name</span><span>MineralView</span></div>
              <div className="ar"><span style={{color:'var(--muted-fg)'}}>Admin domain</span><span>admin.mview.ai</span></div>
              <div className="ar"><span style={{color:'var(--muted-fg)'}}>Portal domain</span><span>portal.mview.ai</span></div>
              <div className="ar"><span style={{color:'var(--muted-fg)'}}>Constitution server</span><span>161.35.52.28</span></div>
            </div>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Integrations</div></div>
            <div style={{padding:'10px 14px'}}>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Constitution MCP</span><span className="badge bg">Connected</span></div>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Google Ads</span><span className="badge bgr">Not connected</span></div>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Meta Ads</span><span className="badge bgr">Not connected</span></div>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>GHL CRM</span><span className="badge ba">Pending review</span></div>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>MongoDB Atlas</span><span className="badge ba">Migration pending</span></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card sa-only">
            <div className="ch"><div className="ct">Users &amp; roles</div><div className="cs">Source: docs/07-platform-operations/01-team-roles.md</div></div>
            <table>
              <thead><tr><th>Name</th><th>Role</th><th>Access</th></tr></thead>
              <tbody>
                <tr><td>Shaun Cochran</td><td>Founder</td><td><span className="badge bpu">Super Admin</span></td></tr>
                <tr><td>Nikhil Salunke</td><td>Constitution Architect</td><td><span className="badge bpu">Super Admin</span></td></tr>
                <tr><td>Sachin</td><td>Admin</td><td><span className="badge bb">Admin</span></td></tr>
                <tr><td colSpan={3} style={{textAlign:'center',color:'var(--muted-fg)',padding:12,fontSize:11}}>Additional team members added as User role once admin is launched.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Tracking</div><div className="cs">Source: ADR-003 · docs/01-foundations/05-behavior-system.md</div></div>
            <div style={{padding:'10px 14px'}}>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Session tracking</span><span className="badge bgr">Not deployed</span></div>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>UTM capture</span><span className="badge bgr">Not deployed</span></div>
              <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Consent mode</span><span className="badge bgr">Not configured</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
