import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchReviews as apiFetchReviews, createReview, updateReview, deleteReview } from '@/services/reviews';
import { useToast } from '@/components/ui/use-toast';

interface Review {
  id: string;
  name: string;
  rate: number;
  comment: string | null;
  country: string | null;
}

const countries = [
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'عمان', flag: '🇴🇲' },
  { code: 'US', name: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: 'GB', name: 'بريطانيا', flag: '🇬🇧' },
  { code: 'DE', name: 'ألمانيا', flag: '🇩🇪' },
  { code: 'FR', name: 'فرنسا', flag: '🇫🇷' },
];

const Reviews = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await apiFetchReviews();
      setReviews(data || []);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل التقييمات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedCountry = countries.find(c => c.code === formData.get('country_code'));
    
    const reviewData = {
      customer_name: formData.get('customer_name') as string,
      rating: parseInt(formData.get('rating') as string),
      comment: formData.get('comment') as string,
      country_code: formData.get('country_code') as string,
      country_name: selectedCountry?.name || null,
    };

    try {
      if (editingReview) {
        await updateReview(editingReview.id, reviewData as any);
        toast({ title: 'تم تحديث التقييم بنجاح' });
      } else {
        await createReview(reviewData as any);
        toast({ title: 'تم إضافة التقييم بنجاح' });
      }
      
      fetchReviews();
      setIsDialogOpen(false);
      setEditingReview(null);
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    
    try {
      await deleteReview(id);
      toast({ title: 'تم حذف التقييم بنجاح' });
      fetchReviews();
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCountryFlag = (countryCode: string | null) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.flag || '🌍';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">جار التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('reviews')}</h1>
          <p className="text-muted-foreground">إدارة آراء وتقييمات العملاء</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingReview(null)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addReview')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? 'تعديل التقييم' : t('addReview')}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لإضافة أو تعديل تقييم العميل
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">{t('customerName')}</Label>
                  <Input
                    id="customer_name"
                    name="customer_name"
                    defaultValue={editingReview?.name || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">{t('rating')}</Label>
                  <Select name="rating" defaultValue={editingReview?.rate?.toString() || '5'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ (5 نجوم)</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ (4 نجوم)</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ (3 نجوم)</SelectItem>
                      <SelectItem value="2">⭐⭐ (نجمتان)</SelectItem>
                      <SelectItem value="1">⭐ (نجمة واحدة)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country_code">{t('country')}</Label>
                <Select name="country_code" defaultValue={editingReview?.country || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">{t('comment')}</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  defaultValue={editingReview?.comment || ''}
                  rows={4}
                  placeholder="تعليق العميل..."
                />
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCountryFlag(review.country)}</span>
                  <div>
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <CardDescription>{review.country}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  {renderStars(review.rate)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {review.comment && (
                  <p className="text-sm text-muted-foreground">
                    "{review.comment}"
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingReview(review);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">لا توجد تقييمات حالياً</div>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة أول تقييم
          </Button>
        </div>
      )}
    </div>
  );
};

export default Reviews;