# خطة ربط الواجهة الأمامية (Frontend) مع الواجهة الخلفية (Backend)

توضح هذه الوثيقة الاستراتيجية المعمارية المتبعة لربط تطبيق الواجهة الأمامية المبني بـ React مع الواجهة الخلفية (API) التي سيتم بناؤها باستخدام Django. الهدف هو ضمان أن تكون عملية الانتقال من البيانات الوهمية (mock data) إلى البيانات الحقيقية سلسة، ومنظمة، وقابلة للتطوير.

---

## الاستراتيجية الأساسية: نمط المستودع (The "Repository Pattern")

أهم قرار معماري تم اتخاذه هو وضع كل منطق جلب البيانات والتعامل معها داخل ملف واحد مركزي: `DataContext.tsx`. باقي مكونات التطبيق (مثل `PortfolioListPage.tsx` أو `PortfolioEditorPage.tsx`) لا تعرف مصدر البيانات. هي فقط تقوم باستدعاء دوال مثل `useData().portfolios` أو `useData().updatePortfolio(someData)`.

يعمل `DataContext` هذا **"كمستودع" (repository)** أو **"طبقة تجريد" (abstraction layer)**. حاليًا، مصدر بياناته هو ملف البيانات الوهمية. لربطه بالواجهة الخلفية، كل ما نحتاجه هو **استبدال منطق التنفيذ داخل هذا الملف فقط**، من قراءة البيانات الوهمية إلى إجراء استدعاءات حقيقية للـ API.

**الميزة الكبرى:** هذا الفصل التام بين واجهة المستخدم ومنطق البيانات يعني أننا لن نحتاج إلى تعديل أي مكون آخر في التطبيق عند الانتقال إلى الواجهة الخلفية الحقيقية، مما يوفر وقت التطوير ويقلل من الأخطاء بشكل كبير.

---

## آلية الانتقال من البيانات الوهمية إلى الـ API الحقيقي

تتضمن العملية تغييرين رئيسيين داخل ملف `DataContext.tsx`:

1.  **جلب البيانات الأولية (Fetching Initial Data):** بدلاً من تهيئة الحالة (state) من `localStorage` أو `initialPortfolios`، سنستخدم `useEffect` hook لجلب البيانات من نقاط النهاية (endpoints) الخاصة بالـ API عند تحميل التطبيق لأول مرة.

2.  **تحديث البيانات (Updating Data):** بدلاً من مجرد تحديث حالة React المحلية (مثل `setPortfolios(...)`)، ستقوم دوال معالجة البيانات (`updatePortfolio`, `createProject`, إلخ) أولاً بإرسال طلب إلى الواجهة الخلفية (باستخدام `PATCH`, `POST`, `DELETE`) ثم تقوم بتحديث الحالة المحلية بناءً على الاستجابة الناجحة من الخادم.

---

## مثال توضيحي: `DataContext.tsx`

لنلقِ نظرة على مثال "قبل وبعد" لحالة `portfolios` لتوضيح الفكرة تمامًا.

### قبل (التنفيذ الحالي بالبيانات الوهمية):

```typescript
// in DataContext.tsx

// ...
const PORTFOLIOS_STORAGE_KEY = 'grooya_portfolios';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. تتم تهيئة الحالة مباشرة من localStorage أو البيانات الوهمية
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    try {
      const stored = window.localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialPortfolios;
    } catch (error) {
      return initialPortfolios;
    }
  });

  // 2. يقوم useEffect فقط بحفظ الحالة المحلية مرة أخرى في localStorage
  useEffect(() => {
    window.localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios));
  }, [portfolios]);

  // 3. تقوم دالة updatePortfolio بتغيير حالة React المحلية فقط
  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    const portfolioWithTimestamp = { ...updatedPortfolio, updatedAt: Date.now() };
    setPortfolios(prev => 
      prev.map(p => p.id === portfolioWithTimestamp.id ? portfolioWithTimestamp : p)
    );
  };
  // ...
};
```

### بعد (التنفيذ المستقبلي مع الواجهة البرمجية الحقيقية):

هذا ما سيبدو عليه الكود بمجرد ربطه بواجهة Django الخلفية المخطط لها.

```typescript
// in DataContext.tsx

// ... (لا حاجة لـ STORAGE_KEY للملفات الشخصية بعد الآن)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. تتم تهيئة الحالة كمصفوفة فارغة.
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true); // إضافة حالة تحميل لتحسين تجربة المستخدم

  // 2. يقوم useEffect الآن بجلب البيانات من الـ API عند تحميل المكون لأول مرة
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // نفترض أن توكن JWT يتم التعامل معه بواسطة دالة مساعدة أو interceptor
        const response = await fetch('/api/portfolios/'); 
        if (!response.ok) throw new Error('فشل في جلب الملفات الشخصية');
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error("خطأ في جلب الملفات الشخصية:", error);
        // هنا يمكنك تعيين حالة خطأ لعرض رسالة في واجهة المستخدم
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []); // مصفوفة الاعتماديات الفارغة تعني أن هذا التأثير يعمل مرة واحدة فقط

  // 3. تقوم دالة updatePortfolio الآن بإرسال طلب PATCH إلى الواجهة البرمجية الخلفية
  const updatePortfolio = async (updatedPortfolio: Portfolio) => {
    try {
      const response = await fetch(`/api/portfolios/${updatedPortfolio.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}` // سيتم إرسال توكن المصادقة هنا
        },
        body: JSON.stringify(updatedPortfolio),
      });

      if (!response.ok) throw new Error('فشل في تحديث الملف الشخصي');
      
      const savedPortfolio = await response.json();

      // بعد الحفظ الناجح، قم بتحديث الحالة المحلية لتعكس التغيير
      setPortfolios(prev => 
        prev.map(p => p.id === savedPortfolio.id ? savedPortfolio : p)
      );

    } catch (error) {
      console.error("خطأ في تحديث الملف الشخصي:", error);
      // اختياري: عرض إشعار للمستخدم عند حدوث خطأ
    }
  };
  // ...
};
```

---

## الخلاصة

كما ترى، التغيير محصور بالكامل داخل `DataContext.tsx`. بقية التطبيق لا يحتاج إلى أي تعديل على الإطلاق. هذه هي قوة العمارية التي اخترناها. عندما يحين وقت بناء الواجهة الخلفية، هذه هي الطريقة التي سنقوم بها بربط جزئي التطبيق معًا بسلاسة وكفاءة.