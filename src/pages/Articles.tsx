import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { fetchArticles as apiFetchArticles, createArticle, updateArticle, deleteArticle, bulkDeleteArticles } from "@/services/articles";

interface Article {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  author: string | null;
  created_at: string;
}

const Articles = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof Article | 'title' | 'category' | 'created_at'>("created_at");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("desc");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await apiFetchArticles();
      setArticles(data || []);
    } catch (error: any) {
      toast({ title: 'خطأ', description: 'فشل في تحميل المقالات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image_file') as File | null;

    const articleData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      image_url: null as string | null, // TODO: upload imageFile then set URL
      author: formData.get('author') as string,
    };

    try {
      if (imageFile) console.log('Selected image file:', imageFile.name);
      if (editingArticle) {
        await updateArticle(editingArticle.id, articleData as any);
        toast({ title: 'تم تحديث المقال بنجاح' });
      } else {
        await createArticle(articleData as any);
        toast({ title: 'تم إضافة المقال بنجاح' });
      }
      form.reset();
      setIsDialogOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    try {
      await deleteArticle(id);
      toast({ title: 'تم حذف المقال بنجاح' });
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
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
    if (!confirm('حذف المقالات المحددة؟')) return;
    try {
      await bulkDeleteArticles(Array.from(selectedIds));
      toast({ title: 'تم حذف المقالات المحددة' });
      setSelectedIds(new Set());
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAll = async () => {
    if (articles.length === 0) return;
    if (!confirm('هل تريد حذف كل المقالات؟')) return;
    try {
      const ids = articles.map(a => a.id);
      await bulkDeleteArticles(ids);
      toast({ title: 'تم حذف كل المقالات' });
      setSelectedIds(new Set());
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  };

  const visibleArticles = articles
    .filter(a => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        (a.title || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q)
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

  if (loading) {
    return <div className="flex items-center justify-center h-96">جار التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">المقالات</h1>
          <p className="text-muted-foreground">إدارة مقالات المدونة</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="بحث..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
          <Button variant="destructive" disabled={selectedIds.size === 0} onClick={handleDeleteSelected}>حذف المحدد</Button>
          <Button variant="outline" disabled={articles.length === 0} onClick={handleDeleteAll}>حذف الكل</Button>
          <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) setEditingArticle(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {editingArticle ? 'تعديل مقال' : 'إضافة مقال'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'تعديل مقال' : 'إضافة مقال'}</DialogTitle>
              <DialogDescription>املأ البيانات المطلوبة {editingArticle ? 'لتعديل' : 'لإضافة'} المقال</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">العنوان</Label>
                  <Input id="title" name="title" required defaultValue={editingArticle?.title || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Input id="category" name="category" defaultValue={editingArticle?.category || ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={editingArticle?.description || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">اسم الكاتب</Label>
                <Input id="author" name="author" defaultValue={editingArticle?.author || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_file">صورة المقال</Label>
                <Input id="image_file" name="image_file" type="file" accept="image/*" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button type="submit">{editingArticle ? 'تحديث' : 'حفظ'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            {article.image_url && (
              <div className="aspect-video relative overflow-hidden">
                <img src={article.image_url} alt={article.title} className="object-cover w-full h-full" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <input type="checkbox" aria-label="select" className="mt-1" checked={selectedIds.has(article.id)} onChange={() => toggleSelect(article.id)} />
              </div>
              {article.category && (
                <CardDescription className="text-xs">التصنيف: {article.category}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {article.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditingArticle(article); setIsDialogOpen(true); }}>
                    تعديل
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">لا توجد مقالات حالياً</div>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة أول مقال
          </Button>
        </div>
      )}
    </div>
  );
};

export default Articles;


