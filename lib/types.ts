export type Role = 'user' | 'admin' | 'sa';

export type PageName =
  | 'dashboard'
  | 'ops-pulse' | 'ops-submit' | 'ops-weekly' | 'ops-quarterly'
  | 'ops-team' | 'ops-files' | 'ops-pipelines'
  | 'constitution' | 'const-propose' | 'const-review'
  | 'const-upload' | 'const-audit' | 'const-notify'
  | 'owners' | 'engagement' | 'claims' | 'campaigns'
  | 'audiences' | 'abtesting' | 'entity-pages' | 'llmo'
  | 'seo' | 'website' | 'growth' | 'analytics' | 'crm' | 'settings';

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  time: string;
  team: 'core' | 'growth';
  status: 'aligned' | 'flag' | 'no-update' | 'leave' | 'onboarding';
  stripe: 'green' | 'amber' | 'red' | 'gray';
  avaClass: string;
  flag: string | null;
  update: string;
  next: string;
  tags: string[];
  constRef: string;
  draftResponse: string;
}

export interface NotifHistoryItem {
  doc: string;
  fullDoc: string;
  recipients: string;
  date: string;
  msg: string;
}

export interface ConstitutionOwnership {
  section: string;
  path?: string;
}

export interface MineralviewTeamMember {
  id?: string;
  name: string;
  role?: string | null;
  email: string;
  github_handle?: string | null;
  teams_handle?: string | null;
  tags?: string[];
  teams_channels?: string[];
  resume_status?: 'missing' | 'uploaded' | 'pending';
  resume?: string | null;
  constitution_ownership?: ConstitutionOwnership[];
  status?: 'active' | 'inactive' | 'leave' | 'onboarding';
  created_at?: string;
  updated_at?: string;
}
