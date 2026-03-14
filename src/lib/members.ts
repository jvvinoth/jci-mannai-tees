// Initial members list - will be populated from WhatsApp group data
// For now using localStorage as the data store until Supabase is connected

export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type OrderStatus = 'pending' | 'printing' | 'ready' | 'distributed';

export const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-muted text-muted-foreground' },
  { value: 'printing', label: 'Printing', color: 'bg-amber-100 text-amber-800' },
  { value: 'ready', label: 'Ready', color: 'bg-blue-100 text-blue-800' },
  { value: 'distributed', label: 'Distributed', color: 'bg-green-100 text-green-800' },
];

export interface Member {
  id: string;
  name: string;
  phone_number: string;
  tshirt_size: TShirtSize | null;
  is_submitted: boolean;
  submitted_at: string | null;
  is_manual_entry: boolean;
  order_status: OrderStatus;
}

const STORAGE_KEY = 'jci_mannai_members';

// Real members list from JCI Mannai WhatsApp group - 70 already submitted
const now = new Date().toISOString();
const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Jc. Mohamed Salman', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '2', name: 'JFS. N. Arun Gandhi', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '3', name: 'Jc. Soniya Gandhi', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '4', name: 'Jc. Naveen', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '5', name: 'Jc. S. Dinesh Kumar', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '6', name: 'Jc. M. Manikandan', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '7', name: 'Jc. S. Balaji', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '8', name: 'Jc. M. Pavendan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '9', name: 'Jc. B. Saktheeswaran', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '10', name: 'Jc. N. Sakthivel', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '11', name: 'Jc. J. Kumaran', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '12', name: 'Jc. HGF P. Manikandan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '13', name: 'Jc. T. Sathiyaseelan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '14', name: 'Jc. D. Parthiban', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '15', name: 'Jc. Vinoth Kannan', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '16', name: 'Jc. Lakshmikanth', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '17', name: 'Jc. Nelson', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '18', name: 'Jc. Arunkumar', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '19', name: 'Jc. Hari', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '20', name: 'Jc. Aakash One Square', phone_number: '', tshirt_size: 'S', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '21', name: 'Jc. Rajkamal', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '22', name: 'Jc. Santhiravathan', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '23', name: 'Jc. Santhosh', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '24', name: 'Jc. Rajagopal', phone_number: '', tshirt_size: 'S', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '25', name: 'Jc. Maharajan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '26', name: 'Jc. Sabarirajan', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '27', name: 'Jc. T. Ramesh', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '28', name: 'Jc. R. Ranjith', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '29', name: 'Jc. DJ Dinesh', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '30', name: 'Jc. Palanichamy', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '31', name: 'Jc. R. Sathishraj', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '32', name: 'Jc. D. Karthi Keyan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '33', name: 'JFM Ramkumar', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '34', name: 'HGF. Senthilkumar', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '35', name: 'JCI Sen P.G. Kailash', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '36', name: 'JCI Sen G. Sabari Giri Nathan', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '37', name: 'Jc. Aishwarya Lakshmi', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '38', name: 'Jc. N. Sakthivel (2)', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '39', name: 'Jc. Karate I. Karthi', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '40', name: 'Jc. Sankar Ananth', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '41', name: 'Jc. Y. Hari Singh', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '42', name: 'Jc. K. Venkatesh', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '43', name: 'JFM T. Sudhakar', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '44', name: 'Jc. Nagarajan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '45', name: 'Jc. Niruban', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '46', name: 'Jc. Aero Ramkumar', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '47', name: 'Jc. RVR. Vinoth', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '48', name: 'Jc. Mugilan', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '49', name: 'Jc. P. Kishore', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '50', name: 'Jc. Prabakaran', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '51', name: 'Jc. R. Banumathi', phone_number: '', tshirt_size: 'M', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '52', name: 'Jc. D. Parthiban (2)', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '53', name: 'Jc. Yuthaya Karthick', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '54', name: 'Jc. Somesh', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '55', name: 'Jc. Arockiaraji', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '56', name: 'Jc. C. Ranjith', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '57', name: 'Jc. Stanly', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '58', name: 'Jc. Manojkumar', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '59', name: 'Jc. A. Aakash', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '60', name: 'Jc. S.P. Pugazhvendhan', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '61', name: 'Jc. S. Arul Raja', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '62', name: 'Jc. Gopinathan', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '63', name: 'Jc. Arun Ravi', phone_number: '', tshirt_size: 'XXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '64', name: 'Jc. HGF M. Naveen Kumar', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '65', name: 'Jc. K. Thiyagarajan', phone_number: '', tshirt_size: 'XXXL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '66', name: 'Jc. Dhinesh', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '67', name: 'Jc. S. Dinesh', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '68', name: 'Jc. K. Balaji', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '69', name: 'Jc. Santhosh P.', phone_number: '', tshirt_size: 'L', is_submitted: true, submitted_at: now, is_manual_entry: false },
  { id: '70', name: 'Jc. Achyta', phone_number: '', tshirt_size: 'XL', is_submitted: true, submitted_at: now, is_manual_entry: false },
];

const DATA_VERSION_KEY = 'jci_mannai_data_version';
const CURRENT_VERSION = '2'; // Bump this when INITIAL_MEMBERS changes

export function getMembers(): Member[] {
  const version = localStorage.getItem(DATA_VERSION_KEY);
  if (version !== CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
    return [...INITIAL_MEMBERS];
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
  return [...INITIAL_MEMBERS];
}

export function saveMembers(members: Member[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function updateMemberPhone(memberId: string, phone: string) {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === memberId);
  if (idx !== -1) {
    members[idx].phone_number = phone.trim();
    saveMembers(members);
  }
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
