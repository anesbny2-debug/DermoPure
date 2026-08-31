/**
 * DermoPure — Product Catalog
 * منتجات ديرمو بيور
 *
 * Schema:
 * {
 *   id: string,
 *   name: string,
 *   category: 'face' | 'hair' | 'sun' | 'supplements' | 'serums',
 *   brand: string,
 *   price: number,        // current price (DZD)
 *   oldPrice: number|null,// original price if discounted, else null
 *   inStock: boolean,
 *   image: string,        // product image URL
 *   description: string,
 *   usage: string,        // طريقة الاستخدام
 *   ingredients: string,  // ملخص المكونات
 *   isBestSeller: boolean
 * }
 *
 * NOTE: Images below are neutral color-coded placeholders (placehold.co) so
 * the store works out of the box with zero external dependencies. Replace
 * each `image` value with your real product photography before launch —
 * ideally square, 800×800 or larger, hosted in /assets/products/.
 */

export const CATEGORIES = [
  { id: "face", name: "العناية بالوجه", icon: "✦" },
  { id: "hair", name: "العناية بالشعر", icon: "❋" },
  { id: "sun", name: "الوقاية من الشمس", icon: "☀" },
  { id: "supplements", name: "المكملات الغذائية", icon: "◆" },
  { id: "serums", name: "مصل وبشرة", icon: "✧" },
];

const ph = (label, bg, fg) =>
  `https://placehold.co/700x700/${bg}/${fg}?font=roboto&text=${encodeURIComponent(label)}`;

export const PRODUCTS = [
  {
    id: "dp-001",
    name: "غسول منظف للبشرة الدهنية",
    category: "face",
    brand: "La Roche-Posay",
    price: 2450,
    oldPrice: 2900,
    inStock: true,
    image: ph("Effaclar Gel", "e7f3f0", "0d9488"),
    description:
      "غسول منظف لطيف يزيل الشوائب والزهم الزائد دون تجفيف البشرة، مناسب للاستخدام اليومي للبشرة الدهنية والمختلطة المعرضة لحب الشباب.",
    usage:
      "يوضع على الوجه المبلل صباحًا ومساءً، يُدلّك برفق ثم يُشطف بماء فاتر. تجنب ملامسة العينين.",
    ingredients: "ماء، زنك بيدولين، حمض الساليسيليك، جليسرين، سلفات معتدلة.",
    isBestSeller: true,
  },
  {
    id: "dp-002",
    name: "كريم مرطب يومي بحمض الهيالورونيك",
    category: "face",
    brand: "CeraVe",
    price: 3200,
    oldPrice: null,
    inStock: true,
    image: ph("Moisturizing Cream", "e7f3f0", "0d9488"),
    description:
      "مرطب غني بالسيراميدات الأساسية وحمض الهيالورونيك، يعيد بناء حاجز البشرة ويحافظ على الترطيب لمدة 24 ساعة.",
    usage: "يوضع طبقة رقيقة على الوجه والرقبة صباحًا ومساءً بعد التنظيف.",
    ingredients: "سيراميد NP/AP/EOP، حمض الهيالورونيك، جليسرين، نياسيناميد.",
    isBestSeller: false,
  },
  {
    id: "dp-003",
    name: "غسول قشرة الرأس المضاد للحكة",
    category: "hair",
    brand: "Vichy",
    price: 2100,
    oldPrice: 2500,
    inStock: true,
    image: ph("Anti-Dandruff Shampoo", "eef5f2", "0d9488"),
    description:
      "شامبو علاجي يهدئ فروة الرأس المتهيجة ويقلل القشرة من أول استعمال، بتركيبة خالية من السلفات القاسية.",
    usage: "يُدلّك على فروة الرأس المبللة، يُترك 3 دقائق ثم يُشطف جيدًا. يُستعمل مرتين أسبوعيًا.",
    ingredients: "بيريثيون الزنك، مياه حرارية فيشي، بانثينول.",
    isBestSeller: true,
  },
  {
    id: "dp-004",
    name: "زيت الأرغان لتغذية الشعر الجاف",
    category: "hair",
    brand: "Klorane",
    price: 2800,
    oldPrice: null,
    inStock: false,
    image: ph("Argan Hair Oil", "eef5f2", "0d9488"),
    description:
      "زيت مغذٍ عميق للشعر الجاف والمتضرر، يعيد اللمعان والنعومة دون ترك أثر دهني.",
    usage: "يوضع بضع قطرات على أطراف الشعر النظيف أو الجاف، يمكن استخدامه كقناع قبل الغسيل.",
    ingredients: "زيت أرغان عضوي 100%، فيتامين E.",
    isBestSeller: false,
  },
  {
    id: "dp-005",
    name: "واقي شمس SPF 50+ للبشرة الحساسة",
    category: "sun",
    brand: "Bioderma",
    price: 3600,
    oldPrice: 4200,
    inStock: true,
    image: ph("Photoderm SPF50+", "fef3ea", "b45309"),
    description:
      "حماية عالية من الأشعة UVA/UVB بملمس غير دهني وغير لامع، مناسب تحت المكياج ولجميع أنواع البشرة.",
    usage: "يوضع بسخاء على الوجه والرقبة قبل 15 دقيقة من التعرض للشمس، يُعاد كل ساعتين.",
    ingredients: "فلاتر شمسية معدنية وعضوية، مضادات أكسدة، ماء حراري.",
    isBestSeller: true,
  },
  {
    id: "dp-006",
    name: "واقي شمس للجسم مقاوم للماء SPF 30",
    category: "sun",
    brand: "Avène",
    price: 2950,
    oldPrice: null,
    inStock: true,
    image: ph("Body Sunscreen SPF30", "fef3ea", "b45309"),
    description:
      "حماية شمسية مقاومة للماء والعرق مصممة للجسم، تركيبة خفيفة تمتص بسرعة.",
    usage: "يوضع بكمية كافية على كامل الجسم قبل التعرض للشمس، يُعاد بعد السباحة أو التعرق.",
    ingredients: "فلاتر UVA/UVB، مياه أفين الحرارية، جليسرين.",
    isBestSeller: false,
  },
  {
    id: "dp-007",
    name: "كبسولات الكولاجين البحري",
    category: "supplements",
    brand: "Nutrisanté",
    price: 4500,
    oldPrice: 5200,
    inStock: true,
    image: ph("Marine Collagen", "f1f0fb", "4338ca"),
    description:
      "مكمل غذائي يدعم مرونة البشرة ويقلل التجاعيد من الداخل، بتركيبة مدعمة بفيتامين C والزنك.",
    usage: "كبسولتان يوميًا مع وجبة الفطور، لمدة 3 أشهر متواصلة لأفضل النتائج.",
    ingredients: "كولاجين بحري مُحلمَه، فيتامين C، زنك، بيوتين.",
    isBestSeller: true,
  },
  {
    id: "dp-008",
    name: "فيتامين D3 + K2 نقط",
    category: "supplements",
    brand: "Solgar",
    price: 3100,
    oldPrice: null,
    inStock: true,
    image: ph("Vitamin D3 + K2", "f1f0fb", "4338ca"),
    description:
      "مكمل يومي يدعم صحة العظام والمناعة، بصيغة نقط سهلة الامتصاص لكل أفراد العائلة.",
    usage: "3 نقط يوميًا توضع مباشرة في الفم أو تُضاف إلى مشروب بارد.",
    ingredients: "فيتامين D3 (كوليكالسيفيرول)، فيتامين K2 (MK-7)، زيت جوز الهند MCT.",
    isBestSeller: false,
  },
  {
    id: "dp-009",
    name: "مصل فيتامين C المضيء",
    category: "serums",
    brand: "SVR",
    price: 3900,
    oldPrice: 4600,
    inStock: true,
    image: ph("Vitamin C Serum", "fff1f2", "be123c"),
    description:
      "مصل مركّز مضاد للأكسدة يوحّد لون البشرة ويمنحها إشراقة فورية، مثالي كخطوة صباحية.",
    usage: "3-4 نقط على بشرة نظيفة صباحًا قبل الكريم المرطب وواقي الشمس.",
    ingredients: "فيتامين C 15%، حمض الفيروليك، فيتامين E.",
    isBestSeller: true,
  },
  {
    id: "dp-010",
    name: "مصل النياسيناميد 10% + زنك",
    category: "serums",
    brand: "The Ordinary",
    price: 2600,
    oldPrice: null,
    inStock: true,
    image: ph("Niacinamide 10%", "fff1f2", "be123c"),
    description:
      "يقلل مظهر المسام الواسعة وعلامات الشوائب، وينظم إفراز الدهون لبشرة أكثر توازنًا.",
    usage: "يوضع صباحًا ومساءً قبل الكريم المرطب، يمكن مزجه مع منتجات أخرى.",
    ingredients: "نياسيناميد 10%، زنك بيسي غلوكونات.",
    isBestSeller: false,
  },
  {
    id: "dp-011",
    name: "مصل الرتينول الليلي المتجدد",
    category: "serums",
    brand: "L'Oréal Paris",
    price: 3400,
    oldPrice: 3950,
    inStock: true,
    image: ph("Retinol Night Serum", "fff1f2", "be123c"),
    description:
      "مصل ليلي مضاد لعلامات التقدم في السن، يحفز تجدد الخلايا ويقلل الخطوط الدقيقة تدريجيًا.",
    usage: "يوضع مساءً على بشرة نظيفة وجافة، يُنصح بالبدء باستخدام 2-3 مرات أسبوعيًا مع واقي شمس نهارًا.",
    ingredients: "رتينول نقي، حمض الهيالورونيك، فيتامين E.",
    isBestSeller: false,
  },
  {
    id: "dp-012",
    name: "قناع الطين الأخضر المنقي",
    category: "face",
    brand: "Klorane",
    price: 1950,
    oldPrice: null,
    inStock: true,
    image: ph("Green Clay Mask", "e7f3f0", "0d9488"),
    description:
      "قناع طبيعي يمتص الزيوت الزائدة ويضيق المسام، يترك البشرة نظيفة ومنتعشة.",
    usage: "يوضع طبقة متوسطة على وجه نظيف، يُترك 10 دقائق ثم يُشطف بماء فاتر. مرة إلى مرتين أسبوعيًا.",
    ingredients: "طين أخضر طبيعي، مستخلص الصبار، مياه معدنية.",
    isBestSeller: false,
  },
  {
    id: "dp-013",
    name: "شامبو تقوية الشعر بالكيراتين",
    category: "hair",
    brand: "Ducray",
    price: 2700,
    oldPrice: 3100,
    inStock: true,
    image: ph("Keratin Shampoo", "eef5f2", "0d9488"),
    description:
      "شامبو مقوٍّ يقلل تساقط الشعر ويعزز كثافته، مناسب للاستخدام المنتظم.",
    usage: "يُدلّك على الشعر المبلل، يُترك دقيقتين ثم يُشطف. يُستعمل 2-3 مرات أسبوعيًا لمدة 3 أشهر.",
    ingredients: "كيراتين محلل، بيوتين، مستخلص الكينا.",
    isBestSeller: true,
  },
  {
    id: "dp-014",
    name: "أوميغا 3 كبسولات زيت السمك",
    category: "supplements",
    brand: "Nutrisanté",
    price: 2900,
    oldPrice: null,
    inStock: true,
    image: ph("Omega 3", "f1f0fb", "4338ca"),
    description:
      "مكمل غذائي يدعم صحة القلب والدماغ ويحسن مرونة ونعومة البشرة من الداخل.",
    usage: "كبسولة واحدة يوميًا مع الطعام.",
    ingredients: "زيت سمك مُنقّى (EPA/DHA)، فيتامين E كمضاد أكسدة.",
    isBestSeller: false,
  },
];
