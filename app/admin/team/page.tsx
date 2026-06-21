'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search, Users } from 'lucide-react';

export default function AdminTeam() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    const { data } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', role: '', description: '', image_url: '', email: '', phone: '', sort_order: 0, is_active: true });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.role) { toast.error('Compila nome e ruolo'); return; }
    const payload = {
      name: form.name,
      role: form.role,
      description: form.description || null,
      image_url: form.image_url || null,
      email: form.email || null,
      phone: form.phone || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: !!form.is_active,
    };
    if (editing) {
      const { error } = await supabase.from('team_members').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Membro aggiornato');
    } else {
      const { error } = await supabase.from('team_members').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Membro creato');
    }
    await load();
    setDialogOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo membro?')) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Membro eliminato');
    load();
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)] flex items-center gap-2">
          <Users className="h-6 w-6" /> Gestione Team
        </h1>
        <Button onClick={openCreate} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2">
          <Plus className="h-4 w-4" /> Nuovo Membro
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input className="pl-10" placeholder="Cerca membro..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ordine</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">N/A</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell><Badge variant="outline">{item.role}</Badge></TableCell>
                <TableCell className="text-sm text-slate-500">{item.email || '-'}</TableCell>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell>
                  <Badge className={item.is_active ? 'bg-emerald-500' : 'bg-slate-400'}>
                    {item.is_active ? 'Attivo' : 'Inattivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Modifica Membro' : 'Nuovo Membro'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nome *</Label><Input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Ruolo *</Label><Input value={form.role || ''} onChange={e => setForm({...form, role: e.target.value})} /></div>
            <div className="space-y-2"><Label>Descrizione</Label><Textarea rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="space-y-2"><Label>URL Foto</Label><Input value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="space-y-2"><Label>Telefono</Label><Input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Ordine</Label><Input type="number" value={form.sort_order || 0} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} /></div>
            <div className="flex items-center gap-2"><Label>Attivo</Label><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annulla</Button>
            <Button onClick={save} className="bg-[hsl(199,89%,48%)] text-white">Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
