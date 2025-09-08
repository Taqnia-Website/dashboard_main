import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderOpen, 
  Star, 
  Link, 
  FileText, 
  Users, 
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('projects'),
      value: '12',
      description: '+20% من الشهر الماضي',
      icon: FolderOpen,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: t('reviews'),
      value: '48',
      description: '+15% من الشهر الماضي',
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: t('articles'),
      value: '23',
      description: '+5% من الشهر الماضي',
      icon: FileText,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: t('clients'),
      value: '67',
      description: '+12% من الشهر الماضي',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <p className="text-muted-foreground">
          مرحباً بك في لوحة تحكم شركة تقنيا للبرمجيات
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">
                أداء ممتاز هذا الشهر
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
            <CardDescription>
              آخر الأنشطة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm">تم إضافة مشروع جديد</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">تقييم جديد من عميل</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm">تم نشر مقال جديد</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;