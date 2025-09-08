import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SocialLinks = () => {
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const save = () => {
    console.log({ twitter, facebook, instagram, email, phone });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>روابط التواصل</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>تويتر</Label>
          <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..." />
        </div>
        <div className="grid gap-2">
          <Label>فيسبوك</Label>
          <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
        </div>
        <div className="grid gap-2">
          <Label>إنستغرام</Label>
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." />
        </div>
        <div className="grid gap-2">
          <Label>البريد الإلكتروني للموقع</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@yourdomain.com" />
        </div>
        <div className="grid gap-2">
          <Label>رقم الهاتف</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xxxxxxxx" />
        </div>
        <div>
          <Button onClick={save}>حفظ</Button>
        </div>
        {(twitter || facebook || instagram || email || phone) && (
          <div className="pt-2 text-sm text-muted-foreground">
            <div className="font-medium mb-1">القيم الحالية:</div>
            {twitter && <div>Twitter: {twitter}</div>}
            {facebook && <div>Facebook: {facebook}</div>}
            {instagram && <div>Instagram: {instagram}</div>}
            {email && <div>Email: {email}</div>}
            {phone && <div>Phone: {phone}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialLinks;


