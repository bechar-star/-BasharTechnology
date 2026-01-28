
import { PortfolioItem, ContentCategory } from './types';

export const INITIAL_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'الذكاء الاصطناعي وتطبيقاته في السوق المحلي',
    description: 'يعد الذكاء الاصطناعي القوة المحركة للثورة الصناعية الرابعة. في هذا المقال، نستعرض كيف يمكن لتقنيات تعلم الآلة (Machine Learning) أن تساهم في أتمتة العمليات التجارية في موريتانيا، بدءاً من تحليل بيانات العملاء وصولاً إلى تحسين سلاسل التوريد. نركز على النماذج اللغوية الكبيرة وكيفية تطويعها لخدمة اللغة العربية واللهجات المحلية لتسهيل التواصل التقني.',
    category: ContentCategory.RESEARCH,
    date: '2024-02-10',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    pdfUrl: 'https://arxiv.org/pdf/2303.08774.pdf',
    tags: ['AI', 'Innovation', 'Machine Learning']
  },
  {
    id: '2',
    title: 'استراتيجيات التحول الرقمي للمؤسسات الناشئة',
    description: 'التحول الرقمي ليس مجرد استخدام الحاسوب، بل هو تغيير جذري في نموذج العمل. يتناول هذا المشروع خارطة طريق متكاملة للشركات الناشئة لتبني تقنيات السحاب (Cloud Computing) وأدوات الإدارة الرقمية. بشار تكنولوجي تقدم رؤية شاملة لدمج الأنظمة السحابية لتقليل التكاليف التشغيلية وزيادة كفاءة الموظفين بنسبة تصل إلى 40%.',
    category: ContentCategory.PROJECTS,
    date: '2024-01-22',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.ibm.com/topics/digital-transformation',
    tags: ['Digital Transformation', 'Cloud', 'Business']
  },
  {
    id: '3',
    title: 'أمن المعلومات في ظل التهديدات السيبرانية المتزايدة',
    description: 'مع زيادة الاعتماد على الحلول الرقمية، أصبحت حماية البيانات ضرورة قصوى. في هذا الفيديو التعليمي، نشرح أسس التشفير وحماية الشبكات ضد هجمات الفدية (Ransomware). نستعرض الأدوات الحديثة التي نستخدمها في بشار تكنولوجي لضمان سلامة بيانات عملائنا وتطبيق معايير ISO 27001 العالمية في أمن المعلومات.',
    category: ContentCategory.VIDEOS,
    date: '2024-03-05',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    youtubeId: 'bPVaOlJ6gz0',
    tags: ['Cybersecurity', 'Data Privacy', 'Hacking Protection']
  },
  {
    id: '4',
    title: 'مستقبل تكنولوجيا الويب: من Web 2.0 إلى Web 3.0',
    description: 'نحن نعيش مرحلة انتقالية كبرى في عالم الويب. يبحث هذا المقال في تقنيات اللامركزية (Decentralization) والبلوكشين (Blockchain) وكيف ستغير شكل الإنترنت كما نعرفه. نوضح دور العقود الذكية في خلق بيئة تجارية رقمية شفافة وموثوقة، وكيف تستعد بشار تكنولوجي لتكون رائدة في بناء تطبيقات الويب اللامركزية.',
    category: ContentCategory.RESEARCH,
    date: '2023-12-15',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    pdfUrl: 'https://ethereum.org/en/web3/',
    tags: ['Web3', 'Blockchain', 'Future Tech']
  },
  {
    id: '5',
    title: 'تطوير تطبيقات الموبايل باستخدام Flutter',
    description: 'مشروع تطبيقي يستعرض كفاءة إطار العمل Flutter في بناء تطبيقات عابرة للمنصات (iOS & Android) بكود واحد. نشرح كيف قمنا بتطوير واجهات مستخدم سريعة وسلسة تدعم اللغة العربية بشكل كامل، مع دمج خرائط جوجل وخدمات الدفع الإلكتروني المحلية لتوفير تجربة مستخدم متكاملة في السوق الموريتاني.',
    category: ContentCategory.PROJECTS,
    date: '2024-02-28',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
    url: 'https://flutter.dev',
    tags: ['Mobile Dev', 'Flutter', 'UX/UI']
  },
  {
    id: '6',
    title: 'إنترنت الأشياء (IoT) في الزراعة الذكية',
    description: 'فيديو متخصص يوضح كيف يمكن استخدام الحساسات الذكية لمراقبة رطوبة التربة ودرجة الحرارة في المناطق الصحراوية. نستعرض نماذج أولية قمنا بتطويرها لربط المزارع بشبكة الإنترنت، مما يتيح للمزارعين التحكم في الري عن بُعد عبر تطبيق الموبايل، وتوفير كميات كبيرة من المياه والطاقة.',
    category: ContentCategory.VIDEOS,
    date: '2024-03-12',
    thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800',
    youtubeId: 'h0N_v0_N6U4',
    tags: ['IoT', 'Smart Farming', 'Hardware']
  }
];
