// ============================================================
// KRITAGAS — Mock Service Layer
// ============================================================
import { cases } from '@/mock/cases';
import { people } from '@/mock/people';
import {
  vehicles, phones, locations, organizations, evidence, alerts,
  timelineEvents, forensicRecords, contradictions, watchlistItems,
  historicalCases, hotspotData, predictiveData, sentinelSubjects,
  transactions, crimeTrendData, auditLogs, networkNodes, networkEdges, firs,
} from '@/mock/data';
import { delay } from '@/lib/utils';
import type { Case, Person, Vehicle, Evidence, Alert, FIR, ForensicRecord, TimelineEvent, HistoricalCase, HotspotData, PredictiveData, SentinelSubject, Contradiction, WatchlistItem, Organization, Location, Phone, Transaction, NetworkNode, NetworkEdge, AuditLogEntry, CrimeTrendData, AIMessage } from '@/types';

// ---------- Case Service ----------
export const mockCaseService = {
  async getCases(): Promise<Case[]> { await delay(400); return cases; },
  async getCase(id: string): Promise<Case | undefined> { await delay(300); return cases.find(c => c.id === id); },
  async getCasesByStatus(status: string): Promise<Case[]> { await delay(300); return cases.filter(c => c.status === status); },
};

// ---------- Person Service ----------
export const mockPersonService = {
  async getPeople(): Promise<Person[]> { await delay(350); return people; },
  async getPerson(id: string): Promise<Person | undefined> { await delay(200); return people.find(p => p.id === id); },
  async getPeopleByCase(caseId: string): Promise<Person[]> { await delay(300); return people.filter(p => p.caseIds.includes(caseId)); },
};

// ---------- Vehicle Service ----------
export const mockVehicleService = {
  async getVehicles(): Promise<Vehicle[]> { await delay(300); return vehicles; },
  async getVehicle(id: string): Promise<Vehicle | undefined> { await delay(200); return vehicles.find(v => v.id === id); },
  async getVehiclesByCase(caseId: string): Promise<Vehicle[]> { await delay(250); return vehicles.filter(v => v.caseIds.includes(caseId)); },
};

// ---------- Phone Service ----------
export const mockPhoneService = {
  async getPhones(): Promise<Phone[]> { await delay(300); return phones; },
  async getPhone(id: string): Promise<Phone | undefined> { await delay(200); return phones.find(p => p.id === id); },
};

// ---------- Location Service ----------
export const mockLocationService = {
  async getLocations(): Promise<Location[]> { await delay(300); return locations; },
  async getLocation(id: string): Promise<Location | undefined> { await delay(200); return locations.find(l => l.id === id); },
  async getLocationsByCase(caseId: string): Promise<Location[]> { await delay(250); return locations.filter(l => l.caseIds.includes(caseId)); },
};

// ---------- Organization Service ----------
export const mockOrganizationService = {
  async getOrganizations(): Promise<Organization[]> { await delay(300); return organizations; },
  async getOrganization(id: string): Promise<Organization | undefined> { await delay(200); return organizations.find(o => o.id === id); },
};

// ---------- Evidence Service ----------
export const mockEvidenceService = {
  async getEvidence(): Promise<Evidence[]> { await delay(400); return evidence; },
  async getEvidenceById(id: string): Promise<Evidence | undefined> { await delay(200); return evidence.find(e => e.id === id); },
  async getEvidenceByCase(caseId: string): Promise<Evidence[]> { await delay(300); return evidence.filter(e => e.caseId === caseId); },
  async verifyIntegrity(id: string): Promise<{ verified: boolean; hash: string }> {
    await delay(2000);
    const ev = evidence.find(e => e.id === id);
    return { verified: true, hash: ev?.integrity.hash || '' };
  },
};

// ---------- FIR Service ----------
export const mockFirService = {
  async getFirs(): Promise<FIR[]> { await delay(400); return firs; },
  async getFir(id: string): Promise<FIR | undefined> { await delay(300); return firs.find(f => f.id === id); },
  async analyzeFir(id: string): Promise<{ ocrConfidence: number; entityConfidence: number }> {
    await delay(3000);
    return { ocrConfidence: 96, entityConfidence: 91 };
  },
};

// ---------- Alert Service ----------
export const mockAlertService = {
  async getAlerts(): Promise<Alert[]> { await delay(350); return alerts; },
  async getAlertsByCase(caseId: string): Promise<Alert[]> { await delay(300); return alerts.filter(a => a.caseId === caseId); },
  async resolveAlert(id: string): Promise<void> { await delay(500); },
  async getUnreadCount(): Promise<number> { await delay(100); return alerts.filter(a => !a.read).length; },
};

// ---------- Timeline Service ----------
export const mockTimelineService = {
  async getTimelineEvents(caseId: string): Promise<TimelineEvent[]> { await delay(400); return timelineEvents.filter(t => t.caseId === caseId); },
  async getAllTimeline(): Promise<TimelineEvent[]> { await delay(350); return timelineEvents; },
};

// ---------- Network Service ----------
export const mockNetworkService = {
  async getNetwork(caseId: string): Promise<{ nodes: NetworkNode[]; edges: NetworkEdge[] }> {
    await delay(600);
    if (caseId === 'CASE-102') return { nodes: networkNodes, edges: networkEdges };
    return { nodes: networkNodes.slice(0, 5), edges: networkEdges.slice(0, 4) };
  },
  async getEntityNetwork(entityId: string): Promise<{ nodes: NetworkNode[]; edges: NetworkEdge[] }> {
    await delay(500);
    const relevantEdges = networkEdges.filter(e => e.source === entityId || e.target === entityId);
    const nodeIds = new Set<string>();
    nodeIds.add(entityId);
    relevantEdges.forEach(e => { nodeIds.add(e.source); nodeIds.add(e.target); });
    const relevantNodes = networkNodes.filter(n => nodeIds.has(n.id));
    return { nodes: relevantNodes, edges: relevantEdges };
  },
  async getRelationshipExplanation(entity1: string, entity2: string) {
    await delay(800);
    const edge = networkEdges.find(e =>
      (e.source === entity1 && e.target === entity2) || (e.source === entity2 && e.target === entity1)
    );
    return {
      entity1, entity2,
      relationship: edge?.relationship || 'ASSOCIATED_WITH',
      confidence: edge?.confidence || 50,
      evidenceBasis: edge?.evidenceBasis || [],
      sharedLocations: ['LOC-087'],
      sharedOrganizations: ['ORG-014'],
      sharedVehicles: [],
      reason: 'Both entities appear in investigation records and share a referenced organization (Nexus Trading Corp). Financial transaction records indicate fund flow between associated accounts.',
    };
  },
};

// ---------- Forensic Service ----------
export const mockForensicService = {
  async getForensicRecords(): Promise<ForensicRecord[]> { await delay(400); return forensicRecords; },
  async getForensicRecord(id: string): Promise<ForensicRecord | undefined> { await delay(200); return forensicRecords.find(f => f.id === id); },
  async getForensicsByCase(caseId: string): Promise<ForensicRecord[]> { await delay(300); return forensicRecords.filter(f => f.caseId === caseId); },
};

// ---------- Historical Service ----------
export const mockHistoricalService = {
  async search(query: string): Promise<HistoricalCase[]> {
    await delay(800);
    if (query.includes('CASE-102') || query.includes('PERSON-014') || query.includes('Mehta')) {
      return historicalCases.filter(h => (h.similarity || 0) > 60);
    }
    return historicalCases.slice(0, 10);
  },
  async getHistoricalCase(id: string): Promise<HistoricalCase | undefined> { await delay(300); return historicalCases.find(h => h.id === id); },
  async getAllHistorical(): Promise<HistoricalCase[]> { await delay(500); return historicalCases; },
};

// ---------- Sentinel Service ----------
export const mockSentinelService = {
  async getSubjects(): Promise<SentinelSubject[]> { await delay(500); return sentinelSubjects; },
  async getSubject(personId: string): Promise<SentinelSubject | undefined> { await delay(300); return sentinelSubjects.find(s => s.personId === personId); },
};

// ---------- Contradiction Service ----------
export const mockContradictionService = {
  async getContradictions(caseId?: string): Promise<Contradiction[]> {
    await delay(400);
    if (caseId) return contradictions.filter(c => c.caseId === caseId);
    return contradictions;
  },
};

// ---------- Watchlist Service ----------
export const mockWatchlistService = {
  async getWatchlist(): Promise<WatchlistItem[]> { await delay(300); return watchlistItems; },
};

// ---------- Map Service ----------
export const mockMapService = {
  async getMapLocations(caseId?: string): Promise<Location[]> {
    await delay(400);
    if (caseId) return locations.filter(l => l.caseIds.includes(caseId));
    return locations;
  },
  async getHotspots(): Promise<HotspotData[]> { await delay(500); return hotspotData; },
};

// ---------- Analytics Service ----------
export const mockAnalyticsService = {
  async getCrimeTrends(): Promise<CrimeTrendData[]> { await delay(400); return crimeTrendData; },
  async getPredictiveData(): Promise<PredictiveData[]> { await delay(500); return predictiveData; },
  async getHotspots(): Promise<HotspotData[]> { await delay(500); return hotspotData; },
  async getAuditLogs(): Promise<AuditLogEntry[]> { await delay(300); return auditLogs; },
};

// ---------- Transaction Service ----------
export const mockTransactionService = {
  async getTransactions(caseId?: string): Promise<Transaction[]> {
    await delay(300);
    if (caseId) return transactions.filter(t => t.caseId === caseId);
    return transactions;
  },
};

// ---------- AI Service ----------
const aiResponses: Record<string, { answer: string; entities: { id: string; name: string; type: string }[]; cases: string[]; confidence: number }> = {
  'show all kidnapping cases in mumbai': {
    answer: 'I found 3 kidnapping cases in Mumbai metropolitan area within the current dataset. The most recent is CASE-028 (Missing Person Investigation) which is currently active with Medium priority. The cases involve different operational areas within Mumbai suburbs.',
    entities: [{ id: 'PERSON-034', name: 'Chirag Bhatt', type: 'Person' }],
    cases: ['CASE-028'],
    confidence: 85,
  },
  'which person has the highest number of connections': {
    answer: 'Based on network analysis, PERSON-014 (Aarav Mehta) has the highest number of connections with 15 direct relationships across the investigation network. He is connected to 6 organizations, 5 other persons of interest, 2 vehicles, and 2 locations. His degree centrality score is 0.48, making him the most highly connected entity in the current investigation scope.',
    entities: [{ id: 'PERSON-014', name: 'Aarav Mehta', type: 'Person' }, { id: 'PERSON-021', name: 'Vikram Sharma', type: 'Person' }],
    cases: ['CASE-102', 'CASE-087'],
    confidence: 92,
  },
  'find historical cases related to case-102': {
    answer: 'I identified 3 historical cases with significant similarity to CASE-102:\n\n1. **CASE-087** (Westside Financial Fraud Ring, 2023) — 89% similarity. Shares entities PERSON-014 and PERSON-021, overlapping locations, and similar fraud methodology.\n\n2. **HC-003** (Pune Real Estate Scam, 2024) — 74% similarity. Similar property fraud through undervaluation in Pune region, shares PERSON-016.\n\n3. **HC-005** (Kolkata Ponzi Scheme, 2023) — 55% similarity. Financial fraud pattern through banking channels.\n\nThe strongest match is CASE-087, which shares the same principal entities and operational pattern.',
    entities: [{ id: 'PERSON-014', name: 'Aarav Mehta', type: 'Person' }, { id: 'PERSON-021', name: 'Vikram Sharma', type: 'Person' }],
    cases: ['CASE-087', 'HC-003', 'HC-005'],
    confidence: 91,
  },
  'show all firs involving person-014': {
    answer: 'PERSON-014 (Aarav Mehta) is mentioned in 2 FIRs:\n\n1. **FIR-2026-0102** (CASE-102) — Filed on 15-Aug-2026 at Juhu PS. Money Laundering / Financial Fraud involving Nexus Trading Corp. Aarav Mehta is named as primary suspect/director.\n\n2. **FIR-2023-0087** (CASE-087) — Filed on 12-Mar-2023 at Bandra PS. Historical fraud case (now closed) where Mehta was identified as person of interest.',
    entities: [{ id: 'PERSON-014', name: 'Aarav Mehta', type: 'Person' }],
    cases: ['CASE-102', 'CASE-087'],
    confidence: 95,
  },
  'which areas show increasing robbery activity': {
    answer: 'Based on crime trend analysis, the following areas show increasing robbery activity:\n\n1. **Connaught Place, Delhi** — 52 total crimes, robbery up significantly. Peak hours: 18:00-22:00. Severity: Critical.\n\n2. **Andheri West, Mumbai** — 45 total crimes with 12 robberies. Trend: Increasing. Severity: High.\n\n3. **Karol Bagh, Delhi** — 42 total crimes with 12 robberies. Peak hours: evening. Severity: Critical.\n\nRecommendation: Enhanced surveillance and rapid response capability recommended for these areas during peak hours.',
    entities: [],
    cases: [],
    confidence: 88,
  },
  'why are person-014 and person-021 connected': {
    answer: 'PERSON-014 (Aarav Mehta) and PERSON-021 (Vikram Sharma) are connected through multiple investigative dimensions:\n\n**Organizational Link:** Both are listed as directors of Nexus Trading Corp (ORG-014) — confidence: 95%.\n\n**Financial Link:** Bank records show fund transfers between accounts associated with both individuals through Nexus Trading Corp and Westline Logistics Ltd — confidence: 82%.\n\n**Communication Link:** CDR analysis reveals sustained phone communication between PHONE-014 and PHONE-021 — confidence: 78%.\n\n**Historical Link:** Both appear in closed case CASE-087 (Westside Financial Fraud Ring, 2023) — confidence: 89%.\n\n**Location Co-occurrence:** Both observed at Nexus Trading Corp office (LOC-087) on multiple occasions — confidence: 92%.\n\nOverall relationship confidence: **82%**\n\n⚠️ Note: This analysis indicates potential investigative relevance. Investigator verification recommended.',
    entities: [{ id: 'PERSON-014', name: 'Aarav Mehta', type: 'Person' }, { id: 'PERSON-021', name: 'Vikram Sharma', type: 'Person' }, { id: 'ORG-014', name: 'Nexus Trading Corp', type: 'Organization' }],
    cases: ['CASE-102', 'CASE-087'],
    confidence: 82,
  },
  'show evidence supporting this relationship': {
    answer: 'Evidence supporting the relationship between PERSON-014 and PERSON-021:\n\n1. **EVIDENCE-045** — Company Registration Document: Shows both as directors of Nexus Trading Corp.\n\n2. **EVIDENCE-046** — Bank Transfer Records: ₹4.7 Crore in transfers between entities linked to both individuals.\n\n3. **EVIDENCE-047** — CCTV Footage: Both observed entering Nexus Trading Corp office on multiple dates.\n\n4. **EVIDENCE-049** — Financial Analysis Report: Forensic accountant identifies fund flow patterns connecting accounts of both.\n\n5. **EVIDENCE-052** — Cash Deposit Records: Pattern of structured deposits below reporting threshold in PERSON-021 accounts, with source tracing to PERSON-014-linked entities.\n\n6. **EVIDENCE-056** — Phone CDR Analysis: 342 communication records showing sustained contact.\n\n7. **EVIDENCE-088** — Historical Investigation Report (CASE-087): Both named in 2023 financial fraud case.\n\nTotal: 7 evidence items across financial, documentary, surveillance, and communication categories.',
    entities: [{ id: 'EVIDENCE-045', name: 'Registration Doc', type: 'Evidence' }, { id: 'EVIDENCE-046', name: 'Bank Transfers', type: 'Evidence' }, { id: 'EVIDENCE-049', name: 'Financial Report', type: 'Evidence' }],
    cases: ['CASE-102'],
    confidence: 88,
  },
};

export const mockAIService = {
  async ask(question: string): Promise<AIMessage> {
    await delay(1500);
    const lowerQ = question.toLowerCase();
    const matchedKey = Object.keys(aiResponses).find(k => lowerQ.includes(k) || k.includes(lowerQ.slice(0, 20)));

    if (matchedKey) {
      const resp = aiResponses[matchedKey];
      return {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: resp.answer,
        timestamp: new Date().toISOString(),
        sources: resp.cases.map(c => ({ id: c, type: 'Case', title: c })),
        entities: resp.entities,
        confidence: resp.confidence,
      };
    }

    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: `Based on the available investigation data, I've analyzed your query: "${question}"\n\nThe current dataset contains 128 active cases, 100 persons of interest, and 150+ evidence records across 7 major cities. For the most relevant results, try querying specific case IDs (e.g., CASE-102), person IDs (e.g., PERSON-014), or specific crime types.\n\nSuggested follow-up queries:\n- "Show all cases in Mumbai"\n- "Find connections for PERSON-014"\n- "What evidence exists for CASE-102?"`,
      timestamp: new Date().toISOString(),
      sources: [{ id: 'CASE-102', type: 'Case', title: 'XYZ Network Investigation' }],
      confidence: 65,
    };
  },

  getSuggestedQuestions(): string[] {
    return [
      'Show all kidnapping cases in Mumbai.',
      'Which person has the highest number of connections?',
      'Find historical cases related to CASE-102.',
      'Show all FIRs involving PERSON-014.',
      'Which areas show increasing robbery activity?',
      'Why are PERSON-014 and PERSON-021 connected?',
      'Show evidence supporting this relationship.',
    ];
  },
};

// ---------- Global Search ----------
export const mockSearchService = {
  async search(query: string): Promise<{ type: string; id: string; title: string; subtitle: string }[]> {
    await delay(200);
    const q = query.toLowerCase();
    const results: { type: string; id: string; title: string; subtitle: string }[] = [];

    cases.filter(c => c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.crime.toLowerCase().includes(q))
      .slice(0, 5).forEach(c => results.push({ type: 'Case', id: c.id, title: c.title, subtitle: `${c.id} · ${c.crime} · ${c.city}` }));

    people.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      .slice(0, 5).forEach(p => results.push({ type: 'Person', id: p.id, title: p.name, subtitle: `${p.id} · ${p.role} · ${p.city}` }));

    vehicles.filter(v => v.id.toLowerCase().includes(q) || v.registrationNumber.toLowerCase().includes(q))
      .slice(0, 3).forEach(v => results.push({ type: 'Vehicle', id: v.id, title: v.registrationNumber, subtitle: `${v.id} · ${v.make} ${v.model}` }));

    evidence.filter(e => e.id.toLowerCase().includes(q) || e.title.toLowerCase().includes(q))
      .slice(0, 3).forEach(e => results.push({ type: 'Evidence', id: e.id, title: e.title, subtitle: `${e.id} · ${e.type}` }));

    organizations.filter(o => o.id.toLowerCase().includes(q) || o.name.toLowerCase().includes(q))
      .slice(0, 3).forEach(o => results.push({ type: 'Organization', id: o.id, title: o.name, subtitle: `${o.id} · ${o.type}` }));

    locations.filter(l => l.id.toLowerCase().includes(q) || l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q))
      .slice(0, 3).forEach(l => results.push({ type: 'Location', id: l.id, title: l.name, subtitle: `${l.id} · ${l.city}` }));

    firs.filter(f => f.id.toLowerCase().includes(q))
      .slice(0, 2).forEach(f => results.push({ type: 'FIR', id: f.id, title: f.id, subtitle: `${f.policeStation} · ${f.crimeType}` }));

    return results;
  },
};
