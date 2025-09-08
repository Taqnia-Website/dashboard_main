import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="mb-4 text-4xl font-bold">مرحباً بكم في شركة تقنيا</h1>
        <p className="text-xl text-muted-foreground">شركة رائدة في مجال تطوير البرمجيات</p>
        <div className="space-x-4">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">الدخول إلى لوحة التحكم</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
