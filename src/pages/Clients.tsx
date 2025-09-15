import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from "react";
import { fetchClients as apiFetchClients, deleteClient as apiDeleteOneClient, createClient as apiCreateClient, clintDto } from "@/services/clients";

const Clients = () => {
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const projectStatusOptions = [

    { value: "active", label: "جاري" },
    { value: "completed", label: "مكتمل" },
    { value: "pending", label: "متوقف مؤقتاً" },
  ];

  const customer_status = [
    { value: "new", label: "جديد" },
    { value: "in_progress", label: "جاري" },
    { value: "done", label: "مكتمل" },
  ]
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("planning");
  const [newClientStatus, setNewClientStatus] = useState("نشط");
  const [newRequirements, setNewRequirements] = useState("");
  const { toast } = useToast();
  // Details & progress tracking state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const teammates = [
    { id: "u1", name: "أحمد علي" },
    { id: "u2", name: "سارة محمد" },
    { id: "u3", name: "محمد عمر" },
  ];
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>(teammates[0]?.id || "");
  const [newProgress, setNewProgress] = useState("");
  const [progressByClientId, setProgressByClientId] = useState<Record<string, { text: string; authorId: string; ts: string }[]>>({});
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async () => {
    try {
      const data = await apiFetchClients();
      setRows(data);
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message || 'حدث خطأ أثناء جلب بيانات العملاء', variant: 'destructive' });
    }
  };
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)));
    if (selectedIds.size === 1) {

      apiDeleteOneClient(Array.from(selectedIds)[0]);
    }
    setSelectedIds(new Set());
  };

  const deleteAll = () => {
    if (rows.length === 0) return;
    setRows([]);
    setSelectedIds(new Set());
  };

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<'name' | 'project_requirements' | 'customer_status' | 'project_status'>("name");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc");

  const visibleRows = rows
    .filter(r => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        r.client.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        r.projectStatus.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
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

  const addClient = async (e) => {



    // if (!newClient || !newProject) return;


    const newClientData: clintDto = {
      name: newClient,
      project_status: newProjectStatus,
      customer_status: newClientStatus,
      project_requirements: newRequirements || "",
      id: "0"
    };
    try {
      console.log(newClientData);
      await apiCreateClient(newClientData);

      toast({ description: 'تم إضافة العميل بنجاح' });
      setRows(prev => [
        { id: String(Date.now()), name: newClient, project_status: newProjectStatus, customer_status: newClientStatus, project_requirements: newRequirements || "" },
        ...prev,
      ]);

    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message || 'حدث خطأ أثناء إضافة العميل', variant: 'destructive' });
    }



    setNewClient("");
    setNewProjectStatus("planning");
    setNewClientStatus("نشط");
    setNewRequirements("");
    setIsAddOpen(false);
  };

  const openDetails = (id: string) => {
    setActiveClientId(id);
    setIsDetailsOpen(true);
  };

  const addProgress = () => {
    if (!activeClientId || !newProgress.trim() || !selectedAuthorId) return;
    setProgressByClientId(prev => {
      const list = prev[activeClientId] ? [...prev[activeClientId]] : [];
      list.unshift({ text: newProgress.trim(), authorId: selectedAuthorId, ts: new Date().toISOString() });
      return { ...prev, [activeClientId]: list };
    });
    setNewProgress("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>حالة العملاء والمشاريع</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>إضافة عميل</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إضافة عميل جديد</DialogTitle>
                  <DialogDescription>سجّل بيانات العميل والمشروع المرتبط</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">اسم العميل</Label>
                    <Input id="name" value={newClient} onChange={(e) => setNewClient(e.target.value)} />
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="project">اسم المشروع</Label>
                    <Input id="project" value={newProject} onChange={(e) => setNewProject(e.target.value)} />
                  </div> */}
                  <div className="grid gap-2">
                    <Label htmlFor="project_requirements">متطلبات العميل</Label>
                    <Textarea id="project_requirements" rows={3} value={newRequirements} onChange={(e) => setNewRequirements(e.target.value)} placeholder="ما الذي يحتاجه العميل بالتحديد؟" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>حالة المشروع</Label>
                      <Select value={newProjectStatus} onValueChange={setNewProjectStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectStatusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>حالة العميل</Label>
                      <Input value={newClientStatus} onChange={(e) => setNewClientStatus(e.target.value)} placeholder="نشط/متابع/..." />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>إلغاء</Button>
                  <Button onClick={addClient}>حفظ</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Input placeholder="بحث..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
            <Button variant="destructive" disabled={selectedIds.size === 0} onClick={deleteSelected}>حذف المحدد</Button>
            <Button variant="outline" disabled={rows.length === 0} onClick={deleteAll}>حذف الكل</Button>
          </div>
          <Table>
            <TableCaption>ملخص حالة العملاء ومشاريعهم</TableCaption>
            <TableHeader>
              <TableRow>
                {/* <TableHead></TableHead> */}
                <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>العميل</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('project_requirements')}>المشروع</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('project_status')}>حالة المشروع</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('customer_status')}>حالة العميل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => openDetails(r.id)}>
                  <TableCell>
                    <input type="checkbox" aria-label="select" checked={selectedIds.has(r.id)} onChange={(e) => { e.stopPropagation(); toggleSelect(r.id); }} />
                  </TableCell>
                  <TableCell>{r.name}</TableCell>
                  {/* <TableCell>{r.project}</TableCell> */}
                  <TableCell>
                    <Select value={r.project_status}
                      onValueChange={(val) => setRows(prev => prev.map(row => row.id === r.id ? { ...row, projectStatus: val } : row))}
                    >
                      <SelectTrigger onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{customer_status.map((e) => {
                    if (e.value == r.customer_status) {
                      return e.label;
                    }
                  })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل العميل والمشروع</DialogTitle>
            <DialogDescription>عرض المتطلبات وتسجيل التقدم</DialogDescription>
          </DialogHeader>
          {activeClientId && (
            <div className="grid gap-4">
              {(() => {
                const c = rows.find(x => x.id === activeClientId);
                if (!c) return null;
                return (
                  <>
                    <div className="grid gap-1">
                      <div className="text-sm text-muted-foreground">العميل</div>
                      <div className="font-medium">{c.name}</div>
                    </div>
                    <div className="grid gap-1">
                      <div className="text-sm text-muted-foreground">حالة المشروع</div>
                      <div className="font-medium">
                        
                         <Select value={c.project_status}
                      onValueChange={(val) => setRows(prev => prev.map(row => row.id === c.id ? { ...row, projectStatus: val } : row))}
                    >
                      <SelectTrigger onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              
                        
                        
                        
                        </div>
                    </div>
                    <div className="grid gap-1">
                      <div className="text-sm text-muted-foreground">المتطلبات</div>
                      <div className="text-sm whitespace-pre-wrap">{c.project_requirements || '—'}</div>
                    </div>
                    <div className="grid gap-2 border rounded p-3">
                      <div className="font-medium mb-1">إضافة تقدم</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-2">
                          <Textarea rows={3} placeholder="ما الذي تم إنجازه؟" value={newProgress} onChange={(e) => setNewProgress(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                          <Label>المستخدم</Label>
                          <Select value={selectedAuthorId} onValueChange={setSelectedAuthorId}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {teammates.map(u => (
                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button onClick={addProgress} disabled={!newProgress.trim()}>حفظ التقدم</Button>
                        </div>
                      </div>
                    </div>
                    {/* <div className="grid gap-2">
                      <div className="font-medium">سجل التقدم</div>
                      {progressByClientId[activeClientId]?.length ? (
                        <ul className="space-y-2">
                          {progressByClientId[activeClientId].map((p, i) => (
                            <li key={i} className="text-sm border rounded p-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>{new Date(p.ts).toLocaleString()}</span>
                                <span>{teammates.find(t => t.id === p.authorId)?.name || '—'}</span>
                              </div>
                              <div className="whitespace-pre-wrap">{p.text}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-xs text-muted-foreground">لا يوجد تقدم مسجّل بعد</div>
                      )}
                    </div> */}
                  </>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;


