export const CLUSTERS = Object.freeze([
  {
    id: 'pti-aerospace',
    name: 'PTI Aerospace & Aviation',
    geography: ['Greensboro', 'High Point', 'Piedmont Triad'],
    status: 'expanding',
    description: 'Dense aerospace and aviation ecosystem around Piedmont Triad International Airport, including established manufacturers, maintenance, logistics, and announced next-generation aircraft production.',
    sourceIds: ['pti-aerospace', 'jetzero-nc']
  },
  {
    id: 'advanced-manufacturing',
    name: 'Advanced Manufacturing & Automation',
    geography: ['Greensboro', 'High Point', 'Randolph County', 'Liberty'],
    status: 'expanding',
    description: 'Battery manufacturing, automated production, industrial maintenance, robotics, controls, machining, quality, and supplier operations.',
    sourceIds: ['toyota-nc', 'gtcc-fame', 'randolph-industrial']
  },
  {
    id: 'triad-healthcare',
    name: 'Triad Healthcare',
    geography: ['Greensboro', 'Winston-Salem', 'High Point'],
    status: 'established',
    description: 'Large hospital, ambulatory, laboratory, imaging, administrative, and technical-healthcare employment base.',
    sourceIds: ['bls-ws-2025', 'nc-oes-d4']
  },
  {
    id: 'life-sciences',
    name: 'Life Sciences & Regulated Manufacturing',
    geography: ['Winston-Salem', 'Triad', 'Triangle'],
    status: 'expanding',
    description: 'Biomedical research, laboratory, biotech, medical technology, quality, and regulated manufacturing roles.',
    sourceIds: ['nc-proj-2024-34']
  },
  {
    id: 'logistics-corridor',
    name: 'I-40 / I-85 Logistics Corridor',
    geography: ['Greensboro', 'High Point', 'Triad'],
    status: 'established',
    description: 'Distribution, trucking, warehousing, procurement, transportation operations, and supply-chain analytics supported by the region’s highway and airport network.',
    sourceIds: ['bls-gso-2025', 'nc-proj-2024-34']
  },
  {
    id: 'triangle-tech',
    name: 'Triangle Technology & Biotech',
    geography: ['Raleigh', 'Durham', 'Chapel Hill'],
    status: 'established',
    description: 'Large nearby technology, research, biotech, pharma, engineering, and public-sector employment market that materially expands the opportunity set for students willing to relocate or commute farther.',
    sourceIds: ['nc-proj-2024-34']
  },
  {
    id: 'charlotte-corporate',
    name: 'Charlotte Finance, Energy & Corporate Tech',
    geography: ['Charlotte'],
    status: 'established',
    description: 'Large nearby market for banking, finance, analytics, energy, corporate technology, software, cybersecurity, and operations.',
    sourceIds: ['nc-proj-2024-34', 'charlotte-programs']
  },
  {
    id: 'public-service',
    name: 'Public Service & Infrastructure',
    geography: ['Central North Carolina'],
    status: 'established',
    description: 'Local government, public safety, utilities, education, transportation, and infrastructure roles with defined service missions and varied credential requirements.',
    sourceIds: ['nc-proj-2024-34']
  }
]);

export const CLUSTER_BY_ID = Object.freeze(Object.fromEntries(CLUSTERS.map(item => [item.id, item])));
