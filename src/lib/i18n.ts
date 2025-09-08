import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      projects: "Projects",
      reviews: "Customer Reviews",
      socialLinks: "Social Links",
      articles: "Articles",
      clients: "Clients",
      chat: "Chat",
      profile: "Profile",
      userManagement: "User Management",
      
      // Auth
      login: "Login",
      logout: "Logout",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      signUp: "Sign Up",
      signIn: "Sign In",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      
      // Projects
      addProject: "Add Project",
      projectName: "Project Name",
      description: "Description",
      technologies: "Technologies",
      projectImage: "Project Image",
      status: "Status",
      planning: "Planning",
      inProgress: "In Progress",
      completed: "Completed",
      onHold: "On Hold",
      
      // Reviews
      addReview: "Add Review",
      customerName: "Customer Name",
      rating: "Rating",
      comment: "Comment",
      country: "Country",
      
      // Articles
      addArticle: "Add Article",
      title: "Title",
      author: "Author",
      category: "Category",
      content: "Content",
      
      // Common
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      actions: "Actions",
      search: "Search",
      loading: "Loading...",
      
      // Theme
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      
      // Language
      language: "Language",
      english: "English",
      arabic: "Arabic"
    }
  },
  ar: {
    translation: {
      // Navigation
      dashboard: "لوحة التحكم",
      projects: "المشاريع",
      reviews: "آراء العملاء",
      socialLinks: "روابط التواصل",
      articles: "المقالات",
      clients: "العملاء",
      chat: "المحادثة",
      profile: "الملف الشخصي",
      userManagement: "إدارة المستخدمين",
      
      // Auth
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      signUp: "إنشاء حساب",
      signIn: "تسجيل الدخول",
      dontHaveAccount: "ليس لديك حساب؟",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      
      // Projects
      addProject: "إضافة مشروع",
      projectName: "اسم المشروع",
      description: "الوصف",
      technologies: "التقنيات",
      projectImage: "صورة المشروع",
      status: "الحالة",
      planning: "تخطيط",
      inProgress: "قيد التنفيذ",
      completed: "مكتمل",
      onHold: "متوقف مؤقتاً",
      
      // Reviews
      addReview: "إضافة تقييم",
      customerName: "اسم العميل",
      rating: "التقييم",
      comment: "التعليق",
      country: "الدولة",
      
      // Articles
      addArticle: "إضافة مقال",
      title: "العنوان",
      author: "الكاتب",
      category: "التصنيف",
      content: "المحتوى",
      
      // Common
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      actions: "الإجراءات",
      search: "بحث",
      loading: "جار التحميل...",
      
      // Theme
      darkMode: "الوضع الليلي",
      lightMode: "الوضع النهاري",
      
      // Language
      language: "اللغة",
      english: "الإنجليزية",
      arabic: "العربية"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // default to Arabic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;