import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input as TextInput } from "@/components/ui/input";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  online: boolean;
  avatarUrl?: string | null;
}

const Users = () => {
  const [users, setUsers] = useState<UserRow[]>([
    { id: "1", name: "أحمد علي", email: "ahmed@example.com", role: "admin", online: true, avatarUrl: null },
    { id: "2", name: "سارة محمد", email: "sara@example.com", role: "editor", online: false, avatarUrl: null },
  ]);

  // Add form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [role, setRole] = useState("viewer");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<'name' | 'email' | 'role' | 'online'>("name");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>("asc");

  // Edit form state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("viewer");
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const startEdit = (u: UserRow) => {
    setEditingUserId(u.id);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditAvatarFile(null);
    setEditAvatarUrl(u.avatarUrl || null);
    setIsEditOpen(true);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditName("");
    setEditEmail("");
    setEditRole("viewer");
    setEditAvatarFile(null);
    setEditAvatarUrl(null);
    setIsEditOpen(false);
  };

  const saveEdit = () => {
    if (!editingUserId) return;
    setUsers((prev) => prev.map((u) => u.id === editingUserId ? { ...u, name: editName, email: editEmail, role: editRole, avatarUrl: editAvatarFile ? (editAvatarUrl || null) : u.avatarUrl } : u));
    console.log('Edited avatar file:', editAvatarFile?.name);
    cancelEdit();
  };

  const addUser = () => {
    const newUser: UserRow = {
      id: String(Date.now()),
      name,
      email,
      role,
      online: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    console.log('New user avatar file:', avatarFile?.name, 'password:', password);
    setName("");
    setEmail("");
    setPassword("");
    setAvatarFile(null);
    setRole("viewer");
    setIsAddOpen(false);
  };

  const visibleUsers = users
    .filter(u => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const va = (a as any)[sortKey];
      const vb = (b as any)[sortKey];
      if (typeof va === 'boolean' && typeof vb === 'boolean') return (va === vb ? 0 : va ? -1 : 1) * dir;
      return String(va ?? '').localeCompare(String(vb ?? '')) * dir;
    });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المستخدمون</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  إضافة مستخدم
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  <DialogDescription>املأ بيانات المستخدم الجديد</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">الإيميل</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="avatar">اختر صورة المستخدم</Label>
                    <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>الصلاحية</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">مدير</SelectItem>
                        <SelectItem value="editor">محرر</SelectItem>
                        <SelectItem value="viewer">عارض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>إلغاء</Button>
                  <Button onClick={addUser}>إضافة</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <TextInput placeholder="بحث..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('online')}>الحالة</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>الاسم</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('email')}>الإيميل</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort('role')}>الصلاحية</TableHead>
                <TableHead>تحكم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Badge variant={u.online ? 'default' : 'secondary'}>
                      {u.online ? 'متصل' : 'غير متصل'}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => startEdit(u)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={(o) => { if (!o) cancelEdit(); else setIsEditOpen(true); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>قم بتحديث بيانات المستخدم</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">الاسم</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">الإيميل</Label>
              <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>الصلاحية</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="editor">محرر</SelectItem>
                  <SelectItem value="viewer">عارض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-avatar">تغيير الصورة</Label>
              {editAvatarFile ? (
                <img src={URL.createObjectURL(editAvatarFile)} alt="preview" className="w-20 h-20 rounded object-cover border" />
              ) : editAvatarUrl ? (
                <img src={editAvatarUrl} alt="current avatar" className="w-20 h-20 rounded object-cover border" />
              ) : null}
              <Input id="edit-avatar" type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setEditAvatarFile(f);
                if (f) {
                  const url = URL.createObjectURL(f);
                  setEditAvatarUrl(url);
                } else {
                  setEditAvatarUrl(null);
                }
              }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit}>إلغاء</Button>
            <Button onClick={saveEdit}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default Users;


