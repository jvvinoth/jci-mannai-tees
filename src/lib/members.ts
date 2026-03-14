import { supabase } from "@/integrations/supabase/client";

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

// Fetch all members from Supabase
export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name');
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    phone_number: row.phone_number || '',
    tshirt_size: row.tshirt_size as TShirtSize | null,
    is_submitted: row.is_submitted,
    submitted_at: row.submitted_at,
    is_manual_entry: row.is_manual_entry,
    order_status: (row.order_status as OrderStatus) || 'pending',
  }));
}

// Search members by name or phone
export async function findMember(query: string): Promise<Member[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .or(`name.ilike.%${q}%,phone_number.ilike.%${q}%`)
    .order('name');
  if (error) {
    console.error('Error searching members:', error);
    return [];
  }
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    phone_number: row.phone_number || '',
    tshirt_size: row.tshirt_size as TShirtSize | null,
    is_submitted: row.is_submitted,
    submitted_at: row.submitted_at,
    is_manual_entry: row.is_manual_entry,
    order_status: (row.order_status as OrderStatus) || 'pending',
  }));
}

// Submit a T-shirt size
export async function submitSize(memberId: string, size: TShirtSize): Promise<{ success: boolean; message: string }> {
  // Check if already submitted
  const { data: member } = await supabase.from('members').select('is_submitted').eq('id', memberId).single();
  if (!member) return { success: false, message: 'Member not found.' };
  if (member.is_submitted) return { success: false, message: 'You have already submitted your T-shirt size.' };

  const { error } = await supabase
    .from('members')
    .update({ tshirt_size: size, is_submitted: true, submitted_at: new Date().toISOString() })
    .eq('id', memberId);
  if (error) return { success: false, message: 'Error saving. Please try again.' };
  return { success: true, message: 'Your T-shirt size has been successfully recorded. Thank you!' };
}

// Add a new manual member
export async function addManualMember(name: string, phone: string): Promise<Member | null> {
  // Check if phone already exists
  const { data: existing } = await supabase.from('members').select('*').eq('phone_number', phone).maybeSingle();
  if (existing) {
    return {
      id: existing.id, name: existing.name, phone_number: existing.phone_number || '',
      tshirt_size: existing.tshirt_size as TShirtSize | null, is_submitted: existing.is_submitted,
      submitted_at: existing.submitted_at, is_manual_entry: existing.is_manual_entry,
      order_status: (existing.order_status as OrderStatus) || 'pending',
    };
  }

  const { data, error } = await supabase
    .from('members')
    .insert({ name, phone_number: phone, is_manual_entry: true })
    .select()
    .single();
  if (error || !data) return null;
  return {
    id: data.id, name: data.name, phone_number: data.phone_number || '',
    tshirt_size: data.tshirt_size as TShirtSize | null, is_submitted: data.is_submitted,
    submitted_at: data.submitted_at, is_manual_entry: data.is_manual_entry,
    order_status: (data.order_status as OrderStatus) || 'pending',
  };
}

// Update member size (admin)
export async function updateMemberSize(memberId: string, size: TShirtSize) {
  await supabase
    .from('members')
    .update({ tshirt_size: size, is_submitted: true, submitted_at: new Date().toISOString() })
    .eq('id', memberId);
}

// Update member details
export async function updateMember(memberId: string, updates: { name?: string; phone_number?: string; tshirt_size?: TShirtSize }) {
  await supabase.from('members').update(updates).eq('id', memberId);
}

// Update individual member status
export async function updateMemberStatus(memberId: string, status: OrderStatus) {
  await supabase.from('members').update({ order_status: status }).eq('id', memberId);
}

// Bulk update status for all submitted members
export async function bulkUpdateStatus(status: OrderStatus) {
  await supabase.from('members').update({ order_status: status }).eq('is_submitted', true);
}

// Update member phone
export async function updateMemberPhone(memberId: string, phone: string) {
  await supabase.from('members').update({ phone_number: phone.trim() }).eq('id', memberId);
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return 'XXXX' + phone.slice(-4);
}

// Get size distribution
export async function getSizeDistribution(): Promise<Record<TShirtSize, number>> {
  const members = await getMembers();
  const dist: Record<TShirtSize, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 };
  members.filter(m => m.is_submitted && m.tshirt_size).forEach(m => {
    dist[m.tshirt_size!]++;
  });
  return dist;
}

// Export CSV
export async function exportCSV(): Promise<string> {
  const members = (await getMembers()).filter(m => m.is_submitted);
  const header = 'Name,Phone Number,T-Shirt Size,Order Status,Submitted At\n';
  const rows = members.map(m => `"${m.name}","${m.phone_number}","${m.tshirt_size}","${m.order_status}","${m.submitted_at}"`).join('\n');
  return header + rows;
}
