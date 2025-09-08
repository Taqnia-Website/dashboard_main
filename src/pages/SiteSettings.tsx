import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const SiteSettings = () => {
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultLang, setDefaultLang] = useState("ar");
  const [defaultTheme, setDefaultTheme] = useState("system");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");

  const save = () => {
    console.log({ siteName, description, defaultLang, defaultTheme, logoFileName: logoFile?.name, faviconFileName: faviconFile?.name, contactEmail, contactPhone, metaKeywords, metaAuthor });
  };

  return (
    <div className="grid gap-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>معلومات الموقع</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>اسم الموقع</Label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>الوصف</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>اللغة الافتراضية</Label>
              <Select value={defaultLang} onValueChange={setDefaultLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>الوضع الافتراضي</Label>
              <Select value={defaultTheme} onValueChange={setDefaultTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الهوية البصرية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="logo">الشعار (Logo)</Label>
            <Input id="logo" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="favicon">الأيقونة (Favicon)</Label>
            <Input id="favicon" type="file" accept="image/*" onChange={(e) => setFaviconFile(e.target.files?.[0] || null)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التواصل</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>البريد الإلكتروني</Label>
            <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>رقم الهاتف</Label>
            <Input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Keywords</Label>
            <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder="software, agency, web" />
          </div>
          <div className="grid gap-2">
            <Label>Author</Label>
            <Input value={metaAuthor} onChange={(e) => setMetaAuthor(e.target.value)} />
          </div>
          <div>
            <Button onClick={save}>حفظ الإعدادات</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;





