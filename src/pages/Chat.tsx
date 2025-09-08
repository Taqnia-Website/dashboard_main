import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const Chat = () => {
  const teammates = [
    { id: "1", name: "أحمد علي", avatarUrl: undefined },
    { id: "2", name: "سارة محمد", avatarUrl: undefined },
    { id: "3", name: "محمد عمر", avatarUrl: undefined },
  ];
  type SelectedThread = { type: 'user' | 'group'; id: string } | null;
  const [selected, setSelected] = useState<SelectedThread>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);
  const [groups, setGroups] = useState<Array<{ id: string; name: string; memberIds: string[] }>>([]);

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());

  const activeUser = useMemo(() => selected?.type === 'user' ? teammates.find(t => t.id === selected.id) : undefined, [selected]);
  const activeGroup = useMemo(() => selected?.type === 'group' ? groups.find(g => g.id === selected.id) : undefined, [selected, groups]);

  const send = () => {
    if (!message) return;
    setMessages((m) => [...m, { from: "أنا", text: message }]);
    setMessage("");
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const createGroup = () => {
    if (!groupName || selectedMemberIds.size === 0) return;
    const id = String(Date.now());
    setGroups(prev => [{ id, name: groupName, memberIds: Array.from(selectedMemberIds) }, ...prev]);
    setGroupName("");
    setSelectedMemberIds(new Set());
    setIsCreateGroupOpen(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المحادثات</CardTitle>
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">إنشاء مجموعة</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إنشاء مجموعة جديدة</DialogTitle>
                  <DialogDescription>اختر اسم المجموعة والأعضاء</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Input placeholder="اسم المجموعة" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                  <div className="border rounded p-2 max-h-60 overflow-auto space-y-2">
                    {teammates.map(t => (
                      <label key={t.id} className="flex items-center gap-2">
                        <Checkbox checked={selectedMemberIds.has(t.id)} onCheckedChange={() => toggleMember(t.id)} />
                        <span>{t.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>إلغاء</Button>
                  <Button onClick={createGroup} disabled={!groupName || selectedMemberIds.size === 0}>إنشاء</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y border rounded">
            {groups.length > 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">المجموعات</div>
            )}
            {groups.map((g) => (
              <button
                key={g.id}
                className={`flex items-center gap-3 p-3 text-right transition ${selected?.type === 'group' && selected.id === g.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                onClick={() => setSelected({ type: 'group', id: g.id })}
              >
                <Avatar>
                  <AvatarFallback>مج</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{g.memberIds.length} أعضاء</div>
                </div>
              </button>
            ))}
            <div className="px-3 py-2 text-xs text-muted-foreground">الأشخاص</div>
            {teammates.map((t) => {
              const initials = t.name.split(" ").map(p => p[0]).slice(0,2).join("");
              const isActive = selected?.type === 'user' && selected.id === t.id;
              return (
                <button
                  key={t.id}
                  className={`flex items-center gap-3 p-3 text-right transition ${isActive ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onClick={() => setSelected({ type: 'user', id: t.id })}
                >
                  <Avatar>
                    <AvatarImage src={t.avatarUrl} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">آخر رسالة ...</div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selected ? (
              selected.type === 'group' ? `المحادثة في مجموعة ${activeGroup?.name}` : `المحادثة مع ${activeUser?.name}`
            ) : (
              'لا توجد محادثة مفتوحة'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('notify:chat'))}>محاكاة رسالة جديدة</Button>
          </div>
          <div className="h-64 overflow-auto border rounded p-3 space-y-2 mb-3">
            {!selected ? (
              <div className="text-sm text-muted-foreground">اختر محادثة من القائمة الجانبية</div>
            ) : messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">ابدأ المحادثة الآن</div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold">{m.from}:</span> {m.text}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب رسالة" disabled={!selected} />
            <Button onClick={send} disabled={!selected}>إرسال</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;


