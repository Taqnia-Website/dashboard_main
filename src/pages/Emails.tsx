import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Emails = () => {
  const [emails, setEmails] = useState([
    { id: "1", from: "client1@example.com", subject: "طلب عرض سعر", receivedAt: "2025-09-01", body: "مرحبا، أود معرفة تكلفة تطوير موقع لشركتنا مع المتطلبات التالية..." },
    { id: "2", from: "client2@example.com", subject: "استشارة تقنية", receivedAt: "2025-09-03", body: "نرغب في استشارة حول اختيار التقنية المناسبة لتطبيقنا..." },
  ]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof emails[number] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<'from' | 'subject' | 'receivedAt'>("receivedAt");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("desc");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    setEmails((prev) => prev.filter((e) => !selectedIds.has(e.id)));
    setSelectedIds(new Set());
  };

  const deleteAll = () => {
    if (emails.length === 0) return;
    setEmails([]);
    setSelectedIds(new Set());
  };

  const visibleEmails = emails
    .filter(e => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        e.from.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const va = (a as any)[sortKey] ?? '';
      const vb = (b as any)[sortKey] ?? '';
      return String(va).localeCompare(String(vb)) * dir;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>رسائل العملاء الواردة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center gap-2">
          <Input placeholder="بحث..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
          <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('notify:emails'))}>محاكاة إيميل جديد</Button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Button variant="destructive" disabled={selectedIds.size === 0} onClick={deleteSelected}>حذف المحدد</Button>
          <Button variant="outline" disabled={emails.length === 0} onClick={deleteAll}>حذف الكل</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('from')}>من</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('subject')}>الموضوع</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('receivedAt')}>تاريخ الوصول</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleEmails.map((e) => (
              <TableRow key={e.id} className="cursor-pointer" onClick={() => { setSelected(e); setOpen(true); }}>
                <TableCell onClick={(ev) => ev.stopPropagation()}>
                  <input type="checkbox" aria-label="select" checked={selectedIds.has(e.id)} onChange={() => toggleSelect(e.id)} />
                </TableCell>
                <TableCell>{e.from}</TableCell>
                <TableCell>{e.subject}</TableCell>
                <TableCell>{e.receivedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div><span className="font-semibold">من:</span> {selected?.from}</div>
            <div><span className="font-semibold">التاريخ:</span> {selected?.receivedAt}</div>
            <div className="pt-2 whitespace-pre-wrap">{selected?.body}</div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Emails;


