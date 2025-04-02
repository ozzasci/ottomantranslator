import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Bell, Lock, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const profileFormSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır").optional(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  dailyReminder: z.boolean(),
  weeklyReport: z.boolean(),
  newFeatures: z.boolean(),
});

const preferencesFormSchema = z.object({
  language: z.string(),
  theme: z.string(),
  wordCountPerDay: z.coerce.number().min(1, "En az 1 kelime olmalıdır"),
});

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { toast } = useToast();
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "osmanli_ogrenci",
      email: "ogrenci@example.com",
      name: "Osmanlı Öğrenci",
    },
  });
  
  // Security form
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      dailyReminder: true,
      weeklyReport: false,
      newFeatures: true,
    },
  });
  
  // Preferences form
  const preferencesForm = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      language: "tr",
      theme: "light",
      wordCountPerDay: 10,
    },
  });
  
  // Form submission handlers
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profil Güncellendi",
      description: "Profil bilgileriniz başarıyla güncellendi.",
    });
    console.log(data);
  };
  
  const onSecuritySubmit = (data: z.infer<typeof securityFormSchema>) => {
    toast({
      title: "Şifre Güncellendi",
      description: "Şifreniz başarıyla güncellendi.",
    });
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    console.log(data);
  };
  
  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast({
      title: "Bildirim Ayarları Güncellendi",
      description: "Bildirim tercihleriniz başarıyla güncellendi.",
    });
    console.log(data);
  };
  
  const onPreferencesSubmit = (data: z.infer<typeof preferencesFormSchema>) => {
    toast({
      title: "Tercihler Güncellendi",
      description: "Uygulama tercihleriniz başarıyla güncellendi.",
    });
    console.log(data);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="font-serif text-2xl font-bold text-[#2d3748] mb-6">Profil Ayarları</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 h-fit">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <Button
                variant={activeTab === 'account' ? 'default' : 'ghost'}
                className={activeTab === 'account' ? 'justify-start' : 'justify-start hover:bg-slate-100'}
                onClick={() => setActiveTab('account')}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Hesap
              </Button>
              <Button
                variant={activeTab === 'security' ? 'default' : 'ghost'}
                className={activeTab === 'security' ? 'justify-start' : 'justify-start hover:bg-slate-100'}
                onClick={() => setActiveTab('security')}
              >
                <Lock className="mr-2 h-4 w-4" />
                Güvenlik
              </Button>
              <Button
                variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                className={activeTab === 'notifications' ? 'justify-start' : 'justify-start hover:bg-slate-100'}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Bildirimler
              </Button>
              <Button
                variant={activeTab === 'preferences' ? 'default' : 'ghost'}
                className={activeTab === 'preferences' ? 'justify-start' : 'justify-start hover:bg-slate-100'}
                onClick={() => setActiveTab('preferences')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tercihler
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Hesap Bilgileri</CardTitle>
                <CardDescription>
                  Profilinizi görüntüleyin ve güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kullanıcı Adı</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Bu, uygulamada görünen kullanıcı adınız olacaktır.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Bildirimler bu e-posta adresine gönderilecektir.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İsim</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Değişiklikleri Kaydet</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik</CardTitle>
                <CardDescription>
                  Şifrenizi güncelleyin ve hesap güvenliğinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mevcut Şifre</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yeni Şifre</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            En az 6 karakter içeren güçlü bir şifre seçin.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şifreyi Onaylayın</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Şifreyi Güncelle</Button>
                  </form>
                </Form>
                
                <Separator className="my-8" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Hesap Yönetimi</h3>
                  <Button variant="destructive">Hesabımı Sil</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Ayarları</CardTitle>
                <CardDescription>
                  Hangi bildirimleri almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">E-posta Bildirimleri</FormLabel>
                            <FormDescription>
                              Öğrenme hatırlatıcıları için e-posta bildirimleri alın.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="dailyReminder"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Günlük Hatırlatıcı</FormLabel>
                            <FormDescription>
                              Günlük çalışma zamanınız geldiğinde bildirim alın.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="weeklyReport"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Haftalık Rapor</FormLabel>
                            <FormDescription>
                              Haftalık öğrenme ilerlemenizi özetleyen raporlar alın.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="newFeatures"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Yeni Özellikler</FormLabel>
                            <FormDescription>
                              Yeni özelliklerin ve güncellemelerin duyurularını alın.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Bildirimleri Kaydet</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Uygulama Tercihleri</CardTitle>
                <CardDescription>
                  Uygulama ayarlarınızı özelleştirin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <FormField
                      control={preferencesForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dil</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Dil seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tr">Türkçe</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Uygulamanın görüntüleneceği dil.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={preferencesForm.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tema</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tema seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Açık</SelectItem>
                              <SelectItem value="dark">Koyu</SelectItem>
                              <SelectItem value="system">Sistem</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Uygulamanın görünümünü değiştirin.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={preferencesForm.control}
                      name="wordCountPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Günlük Kelime Hedefi</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormDescription>
                            Günde öğrenmek istediğiniz kelime sayısı.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Tercihleri Kaydet</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
