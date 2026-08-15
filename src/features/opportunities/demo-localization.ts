import type { Locale } from "@/i18n/config";
import type { Opportunity } from "@/features/opportunities/types";

type LocalizedDemoFields = Pick<
  Opportunity,
  "country" | "description" | "location" | "organization" | "requirements" | "tags" | "title"
>;

type DemoLocalizationMap = Record<string, LocalizedDemoFields>;

const faAF: DemoLocalizationMap = {
  "opp-youth-digital-skills-fellowship": {
    title: "فلوشیپ مهارت‌های دیجیتال جوانان",
    organization: "لابراتوار آینده کابل",
    location: "کابل",
    country: "افغانستان",
    description:
      "یک فلوشیپ خیالی ده‌هفته‌ای برای آشنایی جوانان افغان با مبانی وب، همکاری آنلاین و برنامه‌ریزی شغلی.",
    requirements: ["سن ۱۸ تا ۲۸ سال", "آشنایی ابتدایی با کمپیوتر", "آمادگی برای ورکشاپ‌های حضوری هفتگی"],
    tags: ["مهارت‌های دیجیتال", "آمادگی شغلی", "جوانان"],
  },
  "opp-remote-junior-data-assistant": {
    title: "دستیار ابتدایی داده به‌صورت ریموت",
    organization: "گروه پژوهشی افق",
    location: "آنلاین",
    country: "ریموت",
    description:
      "یک نقش ریموت خیالی برای کمک در پاک‌سازی جدول‌ها، برچسب‌گذاری سروی‌ها و خلاصه‌سازی ساده پژوهش.",
    requirements: ["دقت بالا به جزئیات", "آشنایی با جدول‌های کاری", "اتصال قابل اعتماد به اینترنت"],
    tags: ["داده", "ریموت", "سطح ابتدایی"],
  },
  "opp-women-in-stem-scholarship": {
    title: "بورسیه زنان در STEM",
    organization: "صندوق آموزشی راه روشن",
    location: "هرات",
    country: "افغانستان",
    description:
      "یک بورسیه خیالی برای دختران و زنان جوانی که در رشته‌های ساینس، تکنالوژی، انجنیری یا ریاضی درس می‌خوانند.",
    requirements: ["نمرات مکتب", "بیانیه شخصی", "ثبوت قبولی یا درخواست پوهنتون"],
    tags: ["بورسیه", "STEM", "زنان"],
  },
  "opp-community-health-volunteer": {
    title: "داوطلب صحت جامعه",
    organization: "ابتکار مراقبت محله",
    location: "مزار شریف",
    country: "افغانستان",
    description:
      "یک فرصت داوطلبانه خیالی برای پشتیبانی از نشست‌های آگاهی‌دهی صحی برای جوانان و خانواده‌ها.",
    requirements: ["علاقه به صحت عامه", "مهارت ارتباطی دری یا پشتو", "دسترسی دو بعدازظهر در هفته"],
    tags: ["صحت", "داوطلبی", "جامعه"],
  },
  "opp-frontend-web-development-internship": {
    title: "کارآموزی توسعه وب فرانت‌اند",
    organization: "استودیوی CodeBridge",
    location: "آنلاین",
    country: "ریموت",
    description:
      "یک کارآموزی خیالی برای مبتدیانی که به React، دسترسی‌پذیری و پروژه‌های پورتفولیو علاقه دارند.",
    requirements: ["دانش ابتدایی HTML و CSS", "یک نمونه کوچک کدنویسی", "آمادگی برای دیدارهای راهنمایی"],
    tags: ["فرانت‌اند", "React", "کارآموزی"],
  },
  "opp-english-career-readiness-course": {
    title: "کورس انگلیسی برای آمادگی شغلی",
    organization: "صنف‌های آموزشی جهانی",
    location: "آنلاین",
    country: "ریموت",
    description:
      "یک کورس آنلاین خیالی درباره نوشتن CV، واژگان مصاحبه و ارتباطات محیط کار.",
    requirements: ["سطح ابتدایی انگلیسی", "دسترسی به موبایل یا کمپیوتر", "تعهد به تمرین هفتگی"],
    tags: ["انگلیسی", "شغل", "کورس آنلاین"],
  },
  "opp-agriculture-innovation-trainee": {
    title: "کارآموز نوآوری زراعت",
    organization: "مرکز مهارت‌های دره سبز",
    location: "بامیان",
    country: "افغانستان",
    description:
      "یک برنامه عملی خیالی درباره اصول گلخانه، پلان‌گذاری آبیاری و مهارت‌های کسب‌وکار فارم کوچک.",
    requirements: ["علاقه به زراعت", "توانایی حضور در نشست‌های عملی", "تجربه قبلی لازم نیست"],
    tags: ["زراعت", "آموزش", "جوانان روستایی"],
  },
  "opp-junior-communications-officer": {
    title: "مسؤول ابتدایی ارتباطات",
    organization: "مرکز رسانه‌ای صداهای نو",
    location: "کندهار",
    country: "افغانستان",
    description:
      "یک نقش ابتدایی خیالی در ارتباطات برای کمک به خبرنامه‌ها، پست‌های اجتماعی و به‌روزرسانی رویدادها.",
    requirements: ["مهارت قوی نوشتن", "تجربه با ابزارهای شبکه‌های اجتماعی", "دری و پشتو ترجیح داده می‌شود"],
    tags: ["ارتباطات", "رسانه", "کار"],
  },
  "opp-regional-peacebuilding-workshop": {
    title: "ورکشاپ منطقه‌ای صلح‌سازی",
    organization: "شبکه گفتگوی جوانان",
    location: "دوشنبه",
    country: "تاجیکستان",
    description:
      "یک ورکشاپ منطقه‌ای خیالی برای رهبران جوان جامعه که به گفتگو و حل منازعه علاقه دارند.",
    requirements: ["سن ۲۰ تا ۳۰ سال", "تجربه پروژه اجتماعی", "سند سفر معتبر"],
    tags: ["رهبری", "صلح‌سازی", "منطقه‌ای"],
  },
  "opp-undergraduate-access-grant": {
    title: "گرنت دسترسی به دوره لیسانس",
    organization: "پژوهشگران گام به پیش",
    location: "اسلام‌آباد",
    country: "پاکستان",
    description:
      "یک گرنت خیالی برای حمایت از محصلان افغان که به برنامه‌های لیسانس در منطقه درخواست می‌دهند.",
    requirements: ["اسناد تحصیلی", "بیانیه نیاز مالی", "دو معرفی‌نامه"],
    tags: ["بورسیه", "لیسانس", "منطقه‌ای"],
  },
  "opp-small-business-operations-assistant": {
    title: "دستیار عملیات کسب‌وکار کوچک",
    organization: "خدمات MarketLink",
    location: "جلال‌آباد",
    country: "افغانستان",
    description:
      "یک نقش عملیاتی خیالی برای کمک به یک تیم کسب‌وکار کوچک در ریکارد موجودی و هماهنگی مشتریان.",
    requirements: ["دانش ابتدایی حسابداری", "روحیه خدمات مشتری", "آشنایی با نرم‌افزارهای اداری"],
    tags: ["کسب‌وکار", "عملیات", "سطح ابتدایی"],
  },
  "opp-climate-storytelling-micro-grant": {
    title: "گرنت کوچک روایتگری اقلیم",
    organization: "صندوق جوانان Open Lens",
    location: "آنلاین",
    country: "ریموت",
    description:
      "یک گرنت کوچک خیالی برای تیم‌های جوانان که داستان‌های دیجیتال کوتاه درباره تاب‌آوری اقلیمی تولید می‌کنند.",
    requirements: ["تیم دو تا چهار جوان", "پیشنهاد کوتاه پروژه", "نمونه کار عکس، صدا یا ویدیو"],
    tags: ["اقلیم", "روایتگری", "گرنت"],
  },
};

const ps: DemoLocalizationMap = {
  "opp-youth-digital-skills-fellowship": {
    title: "د ځوانانو د ډیجیټل مهارتونو فلوشپ",
    organization: "د کابل راتلونکې لابراتوار",
    location: "کابل",
    country: "افغانستان",
    description: "لس اوونیز خیالي فلوشپ چې افغان ځوانان د وېب له بنسټونو، آنلاین همکارۍ او مسلکي پلان جوړونې سره آشنا کوي.",
    requirements: ["عمر له ۱۸ تر ۲۸ کلونو", "د کمپیوټر بنسټیزه پوهه", "د اوونیزو حضوري ورکشاپونو لپاره وخت"],
    tags: ["ډیجیټل مهارتونه", "مسلکي چمتووالی", "ځوانان"],
  },
  "opp-remote-junior-data-assistant": {
    title: "ریموټ لومړنی د ډاټا مرستیال",
    organization: "د افق څېړنیزه ټولنه",
    location: "آنلاین",
    country: "ریموټ",
    description: "خیالي ریموټ رول د جدولونو پاکولو، د سروې ټګ کولو او ساده څېړنیزو لنډیزونو لپاره.",
    requirements: ["جزئیاتو ته پوره پام", "له جدولونو سره بلدتیا", "باوري انټرنېټ"],
    tags: ["ډاټا", "ریموټ", "لومړنی کچه"],
  },
  "opp-women-in-stem-scholarship": {
    title: "په STEM کې د ښځو بورس",
    organization: "د روښانه لارې د زده کړو صندوق",
    location: "هرات",
    country: "افغانستان",
    description: "خیالي بورس د هغو ځوانو ښځو لپاره چې ساینس، ټکنالوژي، انجنیري یا ریاضي زده کوي.",
    requirements: ["د ښوونځي نمرې", "شخصي لیکنه", "د داخلې یا غوښتنلیک ثبوت"],
    tags: ["بورس", "STEM", "ښځې"],
  },
  "opp-community-health-volunteer": {
    title: "د ټولنې روغتیا رضاکار",
    organization: "د ګاونډ پاملرنې نوښت",
    location: "مزار شریف",
    country: "افغانستان",
    description: "خیالي رضاکار فرصت چې د ځوانانو او کورنیو لپاره د روغتیا پوهاوي ناستې ملاتړ کوي.",
    requirements: ["د عامې روغتیا علاقه", "د دري یا پښتو اړیکې مهارت", "په اوونۍ کې دوه ماسپښین وخت"],
    tags: ["روغتیا", "رضاکاري", "ټولنه"],
  },
  "opp-frontend-web-development-internship": {
    title: "د فرانت‌اند وېب پراختیا انټرنشپ",
    organization: "CodeBridge سټوډیو",
    location: "آنلاین",
    country: "ریموټ",
    description: "خیالي انټرنشپ د هغو نوو زده کوونکو لپاره چې React، لاسرسي او پورتفولیو پروژو سره علاقه لري.",
    requirements: ["د HTML او CSS بنسټیزه پوهه", "یو کوچنی کوډ نمونه", "د لارښود کتنو لپاره وخت"],
    tags: ["فرانت‌اند", "React", "انټرنشپ"],
  },
  "opp-english-career-readiness-course": {
    title: "د مسلکي چمتووالي لپاره د انګلیسي کورس",
    organization: "نړیوالې زده‌کړیزې خونې",
    location: "آنلاین",
    country: "ریموټ",
    description: "خیالي آنلاین کورس د CV لیکلو، مرکې لغتونو او د کارځای اړیکو په اړه.",
    requirements: ["د انګلیسي لومړنی کچه", "موبایل یا کمپیوټر ته لاسرسی", "اوونیز تمرین ته ژمنتیا"],
    tags: ["انګلیسي", "مسلک", "آنلاین کورس"],
  },
  "opp-agriculture-innovation-trainee": {
    title: "د کرنې نوښت زده‌کوونکی",
    organization: "د شنې درې د مهارتونو مرکز",
    location: "بامیان",
    country: "افغانستان",
    description: "خیالي عملي پروګرام د ګرین‌هاوس بنسټونو، اوبو لګولو پلان او کوچني فارم کاروبار مهارتونو لپاره.",
    requirements: ["له کرنې سره علاقه", "عملي ناستو ته د ګډون توان", "مخکینۍ تجربه اړینه نه ده"],
    tags: ["کرنه", "روزنه", "کلیوالي ځوانان"],
  },
  "opp-junior-communications-officer": {
    title: "لومړنی د اړیکو افسر",
    organization: "د نوو غږونو رسنیز مرکز",
    location: "کندهار",
    country: "افغانستان",
    description: "خیالي لومړنی د اړیکو رول د خبرپاڼو، ټولنیزو پوسټونو او پېښو تازه معلوماتو لپاره.",
    requirements: ["قوي لیکنیز مهارت", "د ټولنیزو رسنیو له وسایلو سره تجربه", "دري او پښتو غوره ګڼل کېږي"],
    tags: ["اړیکې", "رسنۍ", "کار"],
  },
  "opp-regional-peacebuilding-workshop": {
    title: "سیمه‌ییز د سولې جوړونې ورکشاپ",
    organization: "د ځوانانو د خبرو اترو شبکه",
    location: "دوشنبه",
    country: "تاجکستان",
    description: "خیالي سیمه‌ییز ورکشاپ د ځوانو ټولنیزو مشرانو لپاره چې خبرو اترو او د شخړو حل ته علاقه لري.",
    requirements: ["عمر له ۲۰ تر ۳۰ کلونو", "د ټولنیزې پروژې تجربه", "باور وړ سفري سند"],
    tags: ["رهبري", "سولې جوړونه", "سیمه‌ییز"],
  },
  "opp-undergraduate-access-grant": {
    title: "د لیسانس لاسرسي مرسته",
    organization: "د مخکې ګام زده‌کوونکي",
    location: "اسلام‌آباد",
    country: "پاکستان",
    description: "خیالي مرسته د افغان محصلانو لپاره چې په سیمه کې د لیسانس پروګرامونو ته غوښتنه کوي.",
    requirements: ["تحصیلي اسناد", "د مالي اړتیا لیکنه", "دوه سپارښتنې"],
    tags: ["بورس", "لیسانس", "سیمه‌ییز"],
  },
  "opp-small-business-operations-assistant": {
    title: "د کوچني کاروبار د عملیاتو مرستیال",
    organization: "MarketLink خدمتونه",
    location: "جلال‌آباد",
    country: "افغانستان",
    description: "خیالي عملیاتي رول چې د کوچني کاروبار له ټیم سره د موجودۍ ریکارډونو او مشتریانو همغږۍ کې مرسته کوي.",
    requirements: ["د حسابدارۍ بنسټیزه پوهه", "د مشتری خدمت ذهنیت", "له اداري سافټویر سره بلدتیا"],
    tags: ["کاروبار", "عملیات", "لومړنی کچه"],
  },
  "opp-climate-storytelling-micro-grant": {
    title: "د اقلیم کیسه‌ویلو کوچنۍ مرسته",
    organization: "Open Lens د ځوانانو صندوق",
    location: "آنلاین",
    country: "ریموټ",
    description: "خیالي کوچنۍ مرسته د ځوانانو ټیمونو لپاره چې د اقلیمي مقاومت په اړه لنډې ډیجیټل کیسې جوړوي.",
    requirements: ["د دوو تر څلورو ځوانانو ټیم", "لنډه پروژه پیشنهادي لیکنه", "د عکس، غږ یا ویډیو نمونه"],
    tags: ["اقلیم", "کیسه‌ویل", "مرسته"],
  },
};

const de: DemoLocalizationMap = {
  "opp-youth-digital-skills-fellowship": {
    title: "Fellowship für digitale Jugendkompetenzen",
    organization: "Kabul Future Lab",
    location: "Kabul",
    country: "Afghanistan",
    description: "Ein fiktives zehnwöchiges Fellowship, das afghanische Jugendliche in Webgrundlagen, Online-Zusammenarbeit und Karriereplanung einführt.",
    requirements: ["Alter 18 bis 28 Jahre", "Grundlegende Computerkenntnisse", "Verfügbarkeit für wöchentliche Präsenzworkshops"],
    tags: ["digitale Kompetenzen", "Berufsvorbereitung", "Jugend"],
  },
  "opp-remote-junior-data-assistant": {
    title: "Remote Junior-Datenassistenz",
    organization: "Horizon Research Collective",
    location: "Online",
    country: "Remote",
    description: "Eine fiktive Remote-Rolle zur Unterstützung bei Tabellenbereinigung, Umfrage-Tags und einfachen Forschungszusammenfassungen.",
    requirements: ["Hohe Aufmerksamkeit für Details", "Sicherer Umgang mit Tabellen", "Zuverlässige Internetverbindung"],
    tags: ["Daten", "Remote", "Einstieg"],
  },
  "opp-women-in-stem-scholarship": {
    title: "Stipendium für Frauen in STEM",
    organization: "Bright Path Bildungsfonds",
    location: "Herat",
    country: "Afghanistan",
    description: "Ein fiktives Stipendium für junge Frauen, die Naturwissenschaften, Technologie, Ingenieurwesen oder Mathematik studieren.",
    requirements: ["Schulzeugnis", "Persönliches Motivationsschreiben", "Nachweis über Zulassung oder Bewerbung"],
    tags: ["Stipendium", "STEM", "Frauen"],
  },
  "opp-community-health-volunteer": {
    title: "Freiwillige Mitarbeit in Gemeindegesundheit",
    organization: "Neighborhood Care Initiative",
    location: "Mazar-i-Sharif",
    country: "Afghanistan",
    description: "Eine fiktive Freiwilligenchance zur Unterstützung von Gesundheitsaufklärung für Jugendliche und Familien.",
    requirements: ["Interesse an öffentlicher Gesundheit", "Kommunikationsfähigkeit in Dari oder Pashto", "Zwei Nachmittage pro Woche verfügbar"],
    tags: ["Gesundheit", "Freiwillig", "Gemeinschaft"],
  },
  "opp-frontend-web-development-internship": {
    title: "Praktikum in Frontend-Webentwicklung",
    organization: "CodeBridge Studio",
    location: "Online",
    country: "Remote",
    description: "Ein fiktives Praktikum für Einsteigerinnen und Einsteiger mit Interesse an React, Barrierefreiheit und Portfolio-Projekten.",
    requirements: ["Grundkenntnisse in HTML und CSS", "Eine kleine Codeprobe", "Verfügbarkeit für Mentoring-Termine"],
    tags: ["Frontend", "React", "Praktikum"],
  },
  "opp-english-career-readiness-course": {
    title: "Englischkurs für Berufsvorbereitung",
    organization: "Global Learning Rooms",
    location: "Online",
    country: "Remote",
    description: "Ein fiktiver Onlinekurs zu CV-Schreiben, Interviewwortschatz und Kommunikation am Arbeitsplatz.",
    requirements: ["Anfängerlevel in Englisch", "Zugang zu Mobilgerät oder Computer", "Verpflichtung zu wöchentlicher Übung"],
    tags: ["Englisch", "Karriere", "Onlinekurs"],
  },
  "opp-agriculture-innovation-trainee": {
    title: "Trainee für landwirtschaftliche Innovation",
    organization: "Green Valley Skills Center",
    location: "Bamyan",
    country: "Afghanistan",
    description: "Ein fiktisches Praxisprogramm zu Gewächshausgrundlagen, Bewässerungsplanung und Geschäftskenntnissen für kleine Farmen.",
    requirements: ["Interesse an Landwirtschaft", "Teilnahme an Praxiseinheiten möglich", "Keine Vorerfahrung erforderlich"],
    tags: ["Landwirtschaft", "Training", "ländliche Jugend"],
  },
  "opp-junior-communications-officer": {
    title: "Junior Communications Officer",
    organization: "New Voices Media Hub",
    location: "Kandahar",
    country: "Afghanistan",
    description: "Eine fiktive Einstiegsrolle in der Kommunikation zur Unterstützung von Newslettern, Social Posts und Event-Updates.",
    requirements: ["Starke Schreibfähigkeiten", "Erfahrung mit Social-Media-Werkzeugen", "Dari und Pashto bevorzugt"],
    tags: ["Kommunikation", "Medien", "Job"],
  },
  "opp-regional-peacebuilding-workshop": {
    title: "Regionaler Workshop für Friedensarbeit",
    organization: "Youth Dialogue Network",
    location: "Duschanbe",
    country: "Tadschikistan",
    description: "Ein fiktiver regionaler Workshop für junge Gemeindeleitende mit Interesse an Dialog und Konfliktlösung.",
    requirements: ["Alter 20 bis 30 Jahre", "Erfahrung mit Gemeinschaftsprojekten", "Gültiges Reisedokument"],
    tags: ["Führung", "Friedensarbeit", "regional"],
  },
  "opp-undergraduate-access-grant": {
    title: "Zuschuss für Bachelor-Zugang",
    organization: "Step Forward Scholars",
    location: "Islamabad",
    country: "Pakistan",
    description: "Ein fiktiver Zuschuss für afghanische Studierende, die sich für Bachelorprogramme in der Region bewerben.",
    requirements: ["Akademische Unterlagen", "Erklärung zum finanziellen Bedarf", "Zwei Referenzen"],
    tags: ["Stipendium", "Bachelor", "regional"],
  },
  "opp-small-business-operations-assistant": {
    title: "Assistenz für Kleinunternehmensabläufe",
    organization: "MarketLink Services",
    location: "Jalalabad",
    country: "Afghanistan",
    description: "Eine fiktive operative Rolle zur Unterstützung eines Kleinunternehmens bei Bestandslisten und Kundenkoordination.",
    requirements: ["Grundkenntnisse in Buchhaltung", "Serviceorientierung", "Sicherer Umgang mit Bürosoftware"],
    tags: ["Geschäft", "Abläufe", "Einstieg"],
  },
  "opp-climate-storytelling-micro-grant": {
    title: "Mikrozuschuss für Klima-Storytelling",
    organization: "Open Lens Youth Fund",
    location: "Online",
    country: "Remote",
    description: "Ein fiktiver Mikrozuschuss für Jugendteams, die kurze digitale Geschichten über Klimaresilienz produzieren.",
    requirements: ["Team aus zwei bis vier jungen Menschen", "Kurzer Projektvorschlag", "Beispielarbeit in Foto, Audio oder Video"],
    tags: ["Klima", "Storytelling", "Zuschuss"],
  },
};

const localizedDemoContent: Record<Exclude<Locale, "en">, DemoLocalizationMap> = {
  de,
  "fa-AF": faAF,
  ps,
};

export function localizeDemoOpportunity(
  opportunity: Opportunity,
  locale: Locale,
  storedTranslation?: LocalizedDemoFields | null,
): Opportunity {
  if (locale === "en") {
    return opportunity;
  }

  const localizedFields = localizedDemoContent[locale][opportunity.id];

  return {
    ...opportunity,
    ...(localizedFields ?? {}),
    ...(storedTranslation ?? {}),
  };
}

export function localizeOpportunityForEdit(
  opportunity: Opportunity,
  locale: Locale,
  storedTranslation?: LocalizedDemoFields | null,
) {
  return localizeDemoOpportunity(opportunity, locale, storedTranslation);
}

export function localizeDemoOpportunities(
  opportunities: Opportunity[],
  locale: Locale,
  storedTranslations: Record<string, LocalizedDemoFields> = {},
) {
  return opportunities.map((opportunity) =>
    localizeDemoOpportunity(
      opportunity,
      locale,
      storedTranslations[opportunity.id],
    ),
  );
}
