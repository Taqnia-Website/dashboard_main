import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const save = () => {
    // TODO: wire to backend (e.g., supabase auth update + storage upload)
    console.log({ name, avatarFileName: avatarFile?.name });
  };

  const changePassword = () => {
    if (!newPassword || newPassword !== confirmNewPassword) return;
    // TODO: integrate with backend to verify current password and update
    console.log({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className="grid gap-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الحساب</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatar">اختر صورة البروفايل</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Button onClick={save}>حفظ</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تغيير كلمة المرور</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</Label>
            <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </div>
          <div>
            <Button onClick={changePassword} disabled={!newPassword || newPassword !== confirmNewPassword}>تغيير</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;


