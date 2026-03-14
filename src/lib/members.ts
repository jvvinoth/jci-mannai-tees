// Initial members list - will be populated from WhatsApp group data
// For now using localStorage as the data store until Supabase is connected

export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface Member {
  id: string;
  name: string;
  phone_number: string;
  tshirt_size: TShirtSize | null;
  is_submitted: boolean;
  submitted_at: string | null;
  is_manual_entry: boolean;
}

const STORAGE_KEY = 'jci_mannai_members';

// Sample members to pre-populate (user will upload real list later)
const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Ahmed Al-Thani', phone_number: '+97455001234', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '2', name: 'Mohammed Hassan', phone_number: '+97455002345', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '3', name: 'Khalid Ibrahim', phone_number: '+97455003456', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '4', name: 'Faisal Rahman', phone_number: '+97455004567', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '5', name: 'Omar Youssef', phone_number: '+97455005678', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '6', name: 'Saeed Mansoor', phone_number: '+97455006789', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '7', name: 'Rashid Abdullah', phone_number: '+97455007890', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
  { id: '8', name: 'Hamad Khalifa', phone_number: '+97455008901', tshirt_size: null, is_submitted: false, submitted_at: null, is_manual_entry: false },
];

export function getMembers(): Member[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  return INITIAL_MEMBERS;
}

export function saveMembers(members: Member[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function findMember(query: string): Member[] {
  const members = getMembers();
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return members.filter(
    m => m.name.toLowerCase().includes(q) || m.phone_number.includes(q)
  );
}

export function submitSize(memberId: string, size: TShirtSize): { success: boolean; message: string } {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === memberId);
  if (idx === -1) return { success: false, message: 'Member not found.' };
  if (members[idx].is_submitted) return { success: false, message: 'You have already submitted your T-shirt size.' };
  members[idx].tshirt_size = size;
  members[idx].is_submitted = true;
  members[idx].submitted_at = new Date().toISOString();
  saveMembers(members);
  return { success: true, message: 'Your T-shirt size has been successfully recorded. Thank you!' };
}

export function addManualMember(name: string, phone: string): Member {
  const members = getMembers();
  const existing = members.find(m => m.phone_number === phone);
  if (existing) return existing;
  const newMember: Member = {
    id: crypto.randomUUID(),
    name,
    phone_number: phone,
    tshirt_size: null,
    is_submitted: false,
    submitted_at: null,
    is_manual_entry: true,
  };
  members.push(newMember);
  saveMembers(members);
  return newMember;
}

export function updateMemberSize(memberId: string, size: TShirtSize) {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === memberId);
  if (idx !== -1) {
    members[idx].tshirt_size = size;
    members[idx].is_submitted = true;
    if (!members[idx].submitted_at) members[idx].submitted_at = new Date().toISOString();
    saveMembers(members);
  }
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return 'XXXX' + phone.slice(-4);
}

export function getSizeDistribution(): Record<TShirtSize, number> {
  const members = getMembers();
  const dist: Record<TShirtSize, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 };
  members.filter(m => m.is_submitted && m.tshirt_size).forEach(m => {
    dist[m.tshirt_size!]++;
  });
  return dist;
}

export function exportCSV(): string {
  const members = getMembers().filter(m => m.is_submitted);
  const header = 'Name,Phone Number,T-Shirt Size,Submitted At\n';
  const rows = members.map(m => `"${m.name}","${m.phone_number}","${m.tshirt_size}","${m.submitted_at}"`).join('\n');
  return header + rows;
}
