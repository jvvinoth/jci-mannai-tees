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
const m = (id: string, name: string, size: TShirtSize): Member => ({
  id, name, phone_number: '', tshirt_size: size, is_submitted: true, submitted_at: now, is_manual_entry: false, order_status: 'pending'
});

const INITIAL_MEMBERS: Member[] = [
  m('1', 'Jc. Mohamed Salman', 'XXXL'),
  m('2', 'JFS. N. Arun Gandhi', 'M'),
  m('3', 'Jc. Soniya Gandhi', 'XXL'),
  m('4', 'Jc. Naveen', 'M'),
  m('5', 'Jc. S. Dinesh Kumar', 'XL'),
  m('6', 'Jc. M. Manikandan', 'L'),
  m('7', 'Jc. S. Balaji', 'XXL'),
  m('8', 'Jc. M. Pavendan', 'XL'),
  m('9', 'Jc. B. Saktheeswaran', 'L'),
  m('10', 'Jc. N. Sakthivel', 'L'),
  m('11', 'Jc. J. Kumaran', 'L'),
  m('12', 'Jc. HGF P. Manikandan', 'XL'),
  m('13', 'Jc. T. Sathiyaseelan', 'XL'),
  m('14', 'Jc. D. Parthiban', 'XL'),
  m('15', 'Jc. Vinoth Kannan', 'L'),
  m('16', 'Jc. Lakshmikanth', 'L'),
  m('17', 'Jc. Nelson', 'L'),
  m('18', 'Jc. Arunkumar', 'L'),
  m('19', 'Jc. Hari', 'L'),
  m('20', 'Jc. Aakash One Square', 'S'),
  m('21', 'Jc. Rajkamal', 'L'),
  m('22', 'Jc. Santhiravathan', 'M'),
  m('23', 'Jc. Santhosh', 'L'),
  m('24', 'Jc. Rajagopal', 'S'),
  m('25', 'Jc. Maharajan', 'XL'),
  m('26', 'Jc. Sabarirajan', 'XXXL'),
  m('27', 'Jc. T. Ramesh', 'XXXL'),
  m('28', 'Jc. R. Ranjith', 'XXL'),
  m('29', 'Jc. DJ Dinesh', 'XL'),
  m('30', 'Jc. Palanichamy', 'XL'),
  m('31', 'Jc. R. Sathishraj', 'XL'),
  m('32', 'Jc. D. Karthi Keyan', 'XL'),
  m('33', 'JFM Ramkumar', 'L'),
  m('34', 'HGF. Senthilkumar', 'XL'),
  m('35', 'JCI Sen P.G. Kailash', 'M'),
  m('36', 'JCI Sen G. Sabari Giri Nathan', 'XXXL'),
  m('37', 'Jc. Aishwarya Lakshmi', 'XXXL'),
  m('38', 'Jc. N. Sakthivel (2)', 'L'),
  m('39', 'Jc. Karate I. Karthi', 'XL'),
  m('40', 'Jc. Sankar Ananth', 'L'),
  m('41', 'Jc. Y. Hari Singh', 'L'),
  m('42', 'Jc. K. Venkatesh', 'XL'),
  m('43', 'JFM T. Sudhakar', 'XL'),
  m('44', 'Jc. Nagarajan', 'XL'),
  m('45', 'Jc. Niruban', 'M'),
  m('46', 'Jc. Aero Ramkumar', 'M'),
  m('47', 'Jc. RVR. Vinoth', 'XL'),
  m('48', 'Jc. Mugilan', 'L'),
  m('49', 'Jc. P. Kishore', 'XXL'),
  m('50', 'Jc. Prabakaran', 'M'),
  m('51', 'Jc. R. Banumathi', 'M'),
  m('52', 'Jc. D. Parthiban (2)', 'XL'),
  m('53', 'Jc. Yuthaya Karthick', 'L'),
  m('54', 'Jc. Somesh', 'XXXL'),
  m('55', 'Jc. Arockiaraji', 'L'),
  m('56', 'Jc. C. Ranjith', 'XXL'),
  m('57', 'Jc. Stanly', 'L'),
  m('58', 'Jc. Manojkumar', 'XL'),
  m('59', 'Jc. A. Aakash', 'XXL'),
  m('60', 'Jc. S.P. Pugazhvendhan', 'L'),
  m('61', 'Jc. S. Arul Raja', 'L'),
  m('62', 'Jc. Gopinathan', 'XL'),
  m('63', 'Jc. Arun Ravi', 'XXL'),
  m('64', 'Jc. HGF M. Naveen Kumar', 'L'),
  m('65', 'Jc. K. Thiyagarajan', 'XXXL'),
  m('66', 'Jc. Dhinesh', 'XL'),
  m('67', 'Jc. S. Dinesh', 'L'),
  m('68', 'Jc. K. Balaji', 'L'),
  m('69', 'Jc. Santhosh P.', 'L'),
  m('70', 'Jc. Achyta', 'XL'),
];

const DATA_VERSION_KEY = 'jci_mannai_data_version';
const CURRENT_VERSION = '3'; // Bump this when INITIAL_MEMBERS changes

export function getMembers(): Member[] {
  const version = localStorage.getItem(DATA_VERSION_KEY);
  if (version !== CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
    return [...INITIAL_MEMBERS];
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    // Migrate old data missing order_status
    const parsed: Member[] = JSON.parse(stored);
    return parsed.map(member => ({
      ...member,
      order_status: member.order_status || 'pending',
    }));
  }
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
    order_status: 'pending',
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

export function updateMemberStatus(memberId: string, status: OrderStatus) {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === memberId);
  if (idx !== -1) {
    members[idx].order_status = status;
    saveMembers(members);
  }
}

export function bulkUpdateStatus(status: OrderStatus) {
  const members = getMembers();
  members.forEach(m => {
    if (m.is_submitted) {
      m.order_status = status;
    }
  });
  saveMembers(members);
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
  const header = 'Name,Phone Number,T-Shirt Size,Order Status,Submitted At\n';
  const rows = members.map(m => `"${m.name}","${m.phone_number}","${m.tshirt_size}","${m.order_status}","${m.submitted_at}"`).join('\n');
  return header + rows;
}
