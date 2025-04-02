import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { insertWordSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { queryClient } from '@/lib/queryClient';
import { Plus } from 'lucide-react';

// Extend the original schema for client-side validation
const formSchema = z.object({
  ottoman: z.string().min(1, "Osmanlıca kelime girişi zorunludur"),
  turkish: z.string().min(1, "Türkçe karşılık zorunludur"),
  meaning: z.string().optional(),
  exampleOttoman: z.string().optional(),
  exampleTurkish: z.string().optional(),
  categoryId: z.coerce.number().min(1, "Kategori seçimi zorunludur"),
  difficulty: z.enum(["basic", "intermediate", "advanced"]),
  etymology: z.string().optional(),
  audioUrl: z.string().optional()
});

const AddWordDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { data: categories } = useCategories();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ottoman: "",
      turkish: "",
      meaning: "",
      exampleOttoman: "",
      exampleTurkish: "",
      difficulty: "basic",
      etymology: "",
      audioUrl: ""
    }
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await apiRequest('POST', '/api/words', data);
      
      toast({
        title: "Kelime Eklendi",
        description: "Yeni kelime başarıyla eklendi.",
      });
      
      // Invalidate words query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['/api/words'] });
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kelime eklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#2c5282] hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Yeni Kelime
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Kelime Ekle</DialogTitle>
          <DialogDescription>
            Osmanlıca kelime haznenize yeni kelimeler ekleyin.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ottoman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Osmanlıca</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="كتاب" 
                        {...field} 
                        className="font-ottoman text-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="turkish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Türkçe</FormLabel>
                    <FormControl>
                      <Input placeholder="kitap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="meaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anlam</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Kelimenin anlamı..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exampleOttoman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Osmanlıca Örnek</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="كتابى اوقويورم" 
                        {...field}
                        className="font-ottoman text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="exampleTurkish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Türkçe Örnek</FormLabel>
                    <FormControl>
                      <Input placeholder="Kitabı okuyorum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zorluk</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Zorluk seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Temel</SelectItem>
                        <SelectItem value="intermediate">Orta</SelectItem>
                        <SelectItem value="advanced">İleri</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="etymology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etimoloji</FormLabel>
                  <FormControl>
                    <Input placeholder="Kelimenin kökeni..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Kelimeyi Ekle</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordDialog;
