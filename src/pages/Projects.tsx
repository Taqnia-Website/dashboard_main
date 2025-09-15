import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProjects as apiFetchProjects, createProject, updateProject, deleteProject, bulkDeleteProjects } from '@/services/projects';
import { useToast } from '@/components/ui/use-toast';


interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tools: string[];
  status: string;
  created_at: string;
}

const Projects = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof Project | 'name' | 'status' | 'created_at'>("created_at");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("desc");
  const [notesOpenFor, setNotesOpenFor] = useState<Project | null>(null);
  const [noteText, setNoteText] = useState("");
  const [notesByProjectId, setNotesByProjectId] = useState<Record<string, string[]>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    editingProject?.image_url || ""
  );
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiFetchProjects();
      const p = data.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description || null,
        image_url: d.image || null,
        tools: d.tools || [],
        status: d.status || 'planning',
        created_at: d.created_at,
      }));


      setProjects(p);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المشاريع',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const imageFile = formData.get('image_file') as File | null;
    //form-data
    const _formData = new FormData();
    _formData.append('title', formData.get('name') as string);
    _formData.append('description', formData.get('description') as string);
    _formData.append('status', formData.get('status') as 'planning' | 'in_progress' | 'completed' | 'on_hold');
    (formData.get('tools') as string).split(',').map(t => t.trim()).forEach(tool => _formData.append('tools', tool));
    if (imageFile) _formData.append('image', imageFile);


    try {
      if (editingProject) {
      
        await updateProject(editingProject.id, _formData as any);
        toast({ title: 'تم تحديث المشروع بنجاح' });
      } else {
        await createProject(_formData as any);
        toast({ title: 'تم إضافة المشروع بنجاح' });
      }

      fetchProjects();
      setIsDialogOpen(false);
      setEditingProject(null);
      setFile(null);
      setPreview("");
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    try {
      await deleteProject(id);
      toast({ title: 'تم حذف المشروع بنجاح' });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm('حذف المشاريع المحددة؟')) return;
    try {
      await bulkDeleteProjects(Array.from(selectedIds));
      toast({ title: 'تم حذف المشاريع المحددة' });
      setSelectedIds(new Set());
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAll = async () => {
    if (projects.length === 0) return;
    if (!confirm('هل تريد حذف كل المشاريع؟')) return;
    try {
      const ids = projects.map(p => p.id);
      await bulkDeleteProjects(ids);
      toast({ title: 'تم حذف كل المشاريع' });
      setSelectedIds(new Set());
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'on_hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'active': return 'قيد التنفيذ';
      case 'paused': return 'متوقف مؤقتاً';
      default: return status;
    }
  };

  const visibleProjects = projects
    .filter(p => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.tools || []).join(',').toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const va = (a as any)[sortKey];
      const vb = (b as any)[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb) * dir;
      if (va > vb) return 1 * dir;
      if (va < vb) return -1 * dir;
      return 0;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const openNotes = (project: Project) => {
    setNotesOpenFor(project);
    setNoteText("");
  };

  const saveNote = () => {
    if (!notesOpenFor || !noteText.trim()) { setNotesOpenFor(null); return; }
    setNotesByProjectId(prev => {
      const list = prev[notesOpenFor.id] ? [...prev[notesOpenFor.id]] : [];
      list.unshift(noteText.trim());
      return { ...prev, [notesOpenFor.id]: list };
    });
    toast({ title: 'تم حفظ الملاحظة' });
    setNotesOpenFor(null);
    setNoteText("");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">جار التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('projects')}</h1>
          <p className="text-muted-foreground">إدارة مشاريع الشركة</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="بحث..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
          <Button variant="destructive" disabled={selectedIds.size === 0} onClick={handleDeleteSelected}>حذف المحدد</Button>
          <Button variant="outline" disabled={projects.length === 0} onClick={handleDeleteAll}>حذف الكل</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingProject(null)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('addProject')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'تعديل المشروع' : t('addProject')}
                </DialogTitle>
                <DialogDescription>
                  املأ البيانات المطلوبة لإضافة أو تعديل المشروع
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('projectName')}</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingProject?.title || ''}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('status')}</Label>
                    <Select name="status" defaultValue={editingProject?.status || 'planning'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>

                        <SelectItem value="active">قيد التنفيذ</SelectItem>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="paused">متوقف مؤقتاً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t('description')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingProject?.description || ''}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tools">{t('technologies')}</Label>
                  <Input
                    id="tools"
                    name="tools"
                    placeholder="React, TypeScript, Node.js"
                    defaultValue={
                      Array.isArray(editingProject?.tools)
                        ? editingProject.tools.join(", ")
                        : editingProject?.tools || ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">{t('projectImage')}</Label>
                  <Input
                    onChange={handleFileChange}
                    type="file"
                    accept="image/*"
                     id="image_file"
                    name="image_file"
                  // value={editingProject?.image_url || ''}
                  />
                     
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded mb-2"
                    />
                  )}




                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit">
                    {t('save')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {project.image_url && (
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <input type="checkbox" aria-label="select" className="mt-1" checked={selectedIds.has(project.id)} onChange={() => toggleSelect(project.id)} />
                </div>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
              {project.description && (
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tools && project.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(project.tools) && project.tools.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {/* 
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openNotes(project)}
                  >
                    <StickyNote className="h-4 w-4" />
                  </Button>
                 
                 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">لا توجد مشاريع حالياً</div>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة أول مشروع
          </Button>
        </div>
      )}

      <Dialog open={!!notesOpenFor} onOpenChange={(o) => { if (!o) { setNotesOpenFor(null); setNoteText(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>ملاحظات المشروع</DialogTitle>
            <DialogDescription>اكتب ملاحظة لتتبع تقدم المشروع</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="note">الملاحظة</Label>
            <Textarea id="note" rows={5} value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            {notesOpenFor && (notesByProjectId[notesOpenFor.id]?.length ? (
              <div className="mt-2 border-t pt-2">
                <div className="text-sm font-medium mb-1">آخر الملاحظات</div>
                <ul className="space-y-1 text-sm list-disc pr-5">
                  {notesByProjectId[notesOpenFor.id].map((n, i) => (
                    <li key={i} className="text-muted-foreground">{n}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">لا توجد ملاحظات محفوظة لهذا المشروع</div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNotesOpenFor(null); setNoteText(""); }}>إلغاء</Button>
            <Button onClick={saveNote} disabled={!noteText.trim()}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;