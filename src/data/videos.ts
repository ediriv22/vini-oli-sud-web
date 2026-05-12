export type VideoOrientation = "orizzontale" | "verticale" | "quadrato";

export type VideoCategory =
  | "vigneti"
  | "vino/calici"
  | "olio"
  | "territorio"
  | "backstage";

export type VideoSuggestedUse =
  | "hero"
  | "vigneti"
  | "vino/calici"
  | "olio"
  | "territorio"
  | "backstage"
  | "social";

export type LocalVideoRecord = {
  id: string;
  filename: string;
  localPath: string;
  size: {
    bytes: number;
    label: string;
  };
  duration: {
    seconds: number;
    label: string;
  };
  format: "mp4";
  orientation: VideoOrientation;
  category: VideoCategory;
  suggestedUse: VideoSuggestedUse[];
  notes: string[];
};

export const localVideoCatalog: LocalVideoRecord[] = [
  {
    id: "stock-10636146-uhd-3840-2160-30fps",
    filename: "10636146-uhd_3840_2160_30fps.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/10636146-uhd_3840_2160_30fps.mp4",
    size: { bytes: 24580359, label: "23.4 MiB" },
    duration: { seconds: 9.18, label: "9.18s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "olio",
    suggestedUse: ["olio", "territorio", "backstage"],
    notes: [
      "Clip locale fuori repository.",
      "Ripresa di raccolta olive vista dall'alto.",
    ],
  },
  {
    id: "stock-11904275-1080-1920-60fps",
    filename: "11904275_1080_1920_60fps.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/11904275_1080_1920_60fps.mp4",
    size: { bytes: 15288208, label: "14.6 MiB" },
    duration: { seconds: 12.01, label: "12.01s" },
    format: "mp4",
    orientation: "verticale",
    category: "olio",
    suggestedUse: ["olio", "social"],
    notes: [
      "Clip locale fuori repository.",
      "Primo piano olio e olive, adatto a formato social.",
    ],
  },
  {
    id: "stock-12060604-hd-1080-1920-60fps",
    filename: "12060604-hd_1080_1920_60fps.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/12060604-hd_1080_1920_60fps.mp4",
    size: { bytes: 32887507, label: "31.4 MiB" },
    duration: { seconds: 45.12, label: "45.12s" },
    format: "mp4",
    orientation: "verticale",
    category: "territorio",
    suggestedUse: ["territorio", "backstage"],
    notes: [
      "Clip locale fuori repository.",
      "Filename generico; il contenuto va rifinito in fase di selezione editoriale.",
    ],
  },
  {
    id: "stock-15171500-2160-3840-30fps",
    filename: "15171500_2160_3840_30fps.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/15171500_2160_3840_30fps.mp4",
    size: { bytes: 66696999, label: "63.6 MiB" },
    duration: { seconds: 15.6, label: "15.60s" },
    format: "mp4",
    orientation: "verticale",
    category: "backstage",
    suggestedUse: ["backstage", "olio", "social"],
    notes: [
      "Clip locale fuori repository.",
      "File pesante: non copiare nel repo senza una versione ottimizzata.",
    ],
  },
  {
    id: "vinisud1",
    filename: "Vinisud1.mp4",
    localPath: "/Users/edvigerivellini/Desktop/VINISUD/Vinisud1.mp4",
    size: { bytes: 5921747, label: "5.6 MiB" },
    duration: { seconds: 37.29, label: "37.29s" },
    format: "mp4",
    orientation: "verticale",
    category: "backstage",
    suggestedUse: ["social", "backstage"],
    notes: [
      "Clip locale fuori repository.",
      "Contenuto parlato/intervista; non adatto come hero.",
    ],
  },
  {
    id: "focus-bottiglie",
    filename: "001_cambio-fuoco-bottiglie.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/brevissimo/001_cambio-fuoco-bottiglie.mp4",
    size: { bytes: 2030800, label: "1.9 MiB" },
    duration: { seconds: 3.09, label: "3.09s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vino/calici",
    suggestedUse: ["vino/calici", "social"],
    notes: [
      "Clip locale fuori repository.",
      "Molto breve; utile come accento o loop rapido.",
    ],
  },
  {
    id: "damigiana-versata-calice-vino-rosso",
    filename: "002-004_damigiana-versata-calice-vino-rosso.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/002-004_damigiana-versata-calice-vino-rosso.mp4",
    size: { bytes: 5805199, label: "5.5 MiB" },
    duration: { seconds: 23.44, label: "23.44s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vino/calici",
    suggestedUse: ["vino/calici", "social"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-vigneti-montagne",
    filename: "005_drone-vigneti-montagne.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/005_drone-vigneti-montagne.mp4",
    size: { bytes: 12414595, label: "11.8 MiB" },
    duration: { seconds: 17.6, label: "17.60s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vigneti",
    suggestedUse: ["hero", "vigneti", "territorio"],
    notes: [
      "Clip locale fuori repository.",
      "Alternativa forte per hero territoriale.",
    ],
  },
  {
    id: "drone-auto-strada-casale",
    filename: "006_drone-auto-strada-casale.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/006_drone-auto-strada-casale.mp4",
    size: { bytes: 34332808, label: "32.7 MiB" },
    duration: { seconds: 17.07, label: "17.07s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "territorio",
    suggestedUse: ["territorio", "backstage"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "donna-assaggia-ispeziona-uva",
    filename: "007-008_donna-assaggia-ispeziona-uva.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/007-008_donna-assaggia-ispeziona-uva.mp4",
    size: { bytes: 26332272, label: "25.1 MiB" },
    duration: { seconds: 17.15, label: "17.15s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vigneti",
    suggestedUse: ["vino/calici", "vigneti", "backstage"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-prato-tetti-casale",
    filename: "009-010_drone-prato-tetti-casale.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/009-010_drone-prato-tetti-casale.mp4",
    size: { bytes: 44341526, label: "42.3 MiB" },
    duration: { seconds: 29.56, label: "29.56s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "territorio",
    suggestedUse: ["territorio", "hero"],
    notes: [
      "Clip locale fuori repository.",
      "Lunga; utile se si prevede un taglio piu corto per la demo.",
    ],
  },
  {
    id: "persona-cammina-terrazzamenti",
    filename: "011_persona-cammina-terrazzamenti.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/011_persona-cammina-terrazzamenti.mp4",
    size: { bytes: 42652673, label: "40.7 MiB" },
    duration: { seconds: 24.55, label: "24.55s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vigneti",
    suggestedUse: ["vigneti", "territorio", "hero"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-orbita-castello-vigneti",
    filename: "012_drone-orbita-castello-vigneti.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/012_drone-orbita-castello-vigneti.mp4",
    size: { bytes: 32165066, label: "30.7 MiB" },
    duration: { seconds: 20.02, label: "20.02s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "territorio",
    suggestedUse: ["hero", "vigneti", "territorio"],
    notes: [
      "Clip locale fuori repository.",
      "Alternativa hero 1: castello e vigneti leggibili.",
    ],
  },
  {
    id: "scarto-aereo-airberlin-finestrino",
    filename: "SCARTO_aereo-airberlin-finestrino.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/SCARTO_aereo-airberlin-finestrino.mp4",
    size: { bytes: 8062688, label: "7.7 MiB" },
    duration: { seconds: 27.37, label: "27.37s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "backstage",
    suggestedUse: ["backstage"],
    notes: [
      "Clip locale fuori repository.",
      "Marcato come scarto nella libreria originale.",
    ],
  },
  {
    id: "uomo-beve-vino-bosco",
    filename: "009_uomo-beve-vino_bosco.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/009_uomo-beve-vino_bosco.mp4",
    size: { bytes: 24020124, label: "22.9 MiB" },
    duration: { seconds: 11.92, label: "11.92s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vino/calici",
    suggestedUse: ["vino/calici", "territorio"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "mano-accarezza-botti-cantina",
    filename: "010_mano-accarezza-botti_cantina.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/010_mano-accarezza-botti_cantina.mp4",
    size: { bytes: 35054607, label: "33.4 MiB" },
    duration: { seconds: 12.88, label: "12.88s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "backstage",
    suggestedUse: ["vino/calici", "backstage"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "uomo-cammina-vigna-vendemmia",
    filename: "011_uomo-cammina-vigna_vendemmia.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/011_uomo-cammina-vigna_vendemmia.mp4",
    size: { bytes: 81625294, label: "77.8 MiB" },
    duration: { seconds: 14.65, label: "14.65s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vigneti",
    suggestedUse: ["vigneti", "territorio", "hero"],
    notes: [
      "Clip locale fuori repository.",
      "File pesante: non copiare nel repo senza una versione ottimizzata.",
    ],
  },
  {
    id: "tramonto-rocce-pianura",
    filename: "012_tramonto-rocce_pianura.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/012_tramonto-rocce_pianura.mp4",
    size: { bytes: 6197933, label: "5.9 MiB" },
    duration: { seconds: 10.01, label: "10.01s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "territorio",
    suggestedUse: ["territorio", "hero"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "botti-cantina-luce-taglio",
    filename: "013_botti-cantina_luce-taglio.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/013_botti-cantina_luce-taglio.mp4",
    size: { bytes: 2109915, label: "2.0 MiB" },
    duration: { seconds: 10.93, label: "10.93s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "backstage",
    suggestedUse: ["vino/calici", "backstage"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "versata-vino-rosso-macro-bianco",
    filename: "014_versata-vino-rosso_macro-bianco.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/014_versata-vino-rosso_macro-bianco.mp4",
    size: { bytes: 2065235, label: "2.0 MiB" },
    duration: { seconds: 11.92, label: "11.92s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vino/calici",
    suggestedUse: ["vino/calici", "social"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-vigneto-controluce-sole",
    filename: "015_drone-vigneto_controluce-sole.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/015_drone-vigneto_controluce-sole.mp4",
    size: { bytes: 9093828, label: "8.7 MiB" },
    duration: { seconds: 13.22, label: "13.22s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vigneti",
    suggestedUse: ["hero", "vigneti", "territorio"],
    notes: [
      "Clip locale fuori repository.",
      "Alternativa hero 2: controluce morbido e buona leggibilita del vigneto.",
    ],
  },
  {
    id: "drone-vigneto-vulcano-sfondo",
    filename: "016_drone-vigneto_vulcano-sfondo.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/016_drone-vigneto_vulcano-sfondo.mp4",
    size: { bytes: 35914932, label: "34.3 MiB" },
    duration: { seconds: 12.14, label: "12.14s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "vigneti",
    suggestedUse: ["hero", "vigneti", "territorio"],
    notes: [
      "Clip locale fuori repository.",
      "Hero candidate principale per homepage.",
    ],
  },
  {
    id: "drone-costa-castello-rudere",
    filename: "017_drone-costa_castello-rudere.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/017_drone-costa_castello-rudere.mp4",
    size: { bytes: 35214601, label: "33.6 MiB" },
    duration: { seconds: 9.13, label: "9.13s" },
    format: "mp4",
    orientation: "orizzontale",
    category: "territorio",
    suggestedUse: ["territorio", "hero"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "versata-spumante-primo-piano",
    filename: "001_versata-spumante_primo-piano.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/verticale/short/001_versata-spumante_primo-piano.mp4",
    size: { bytes: 26532906, label: "25.3 MiB" },
    duration: { seconds: 9.44, label: "9.44s" },
    format: "mp4",
    orientation: "verticale",
    category: "vino/calici",
    suggestedUse: ["vino/calici", "social"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-cantina-botti-legno",
    filename: "002_drone-cantina_botti-legno.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/verticale/short/002_drone-cantina_botti-legno.mp4",
    size: { bytes: 6245509, label: "6.0 MiB" },
    duration: { seconds: 13.43, label: "13.43s" },
    format: "mp4",
    orientation: "verticale",
    category: "backstage",
    suggestedUse: ["backstage", "social"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-vigneti-invernali",
    filename: "003_drone-vigneti_invernali.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/verticale/short/003_drone-vigneti_invernali.mp4",
    size: { bytes: 64876963, label: "61.9 MiB" },
    duration: { seconds: 11.49, label: "11.49s" },
    format: "mp4",
    orientation: "verticale",
    category: "vigneti",
    suggestedUse: ["vigneti", "territorio", "social"],
    notes: [
      "Clip locale fuori repository.",
      "File pesante: non copiare nel repo senza una versione ottimizzata.",
    ],
  },
  {
    id: "versata-vino-rosso-esterno",
    filename: "004_versata-vino-rosso_esterno.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/verticale/short/004_versata-vino-rosso_esterno.mp4",
    size: { bytes: 6948694, label: "6.6 MiB" },
    duration: { seconds: 9.28, label: "9.28s" },
    format: "mp4",
    orientation: "verticale",
    category: "vino/calici",
    suggestedUse: ["vino/calici", "social"],
    notes: ["Clip locale fuori repository."],
  },
  {
    id: "drone-costa-lago-vigneti",
    filename: "005_drone-costa_lago-vigneti.mp4",
    localPath:
      "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/verticale/short/005_drone-costa_lago-vigneti.mp4",
    size: { bytes: 106565994, label: "101.6 MiB" },
    duration: { seconds: 12, label: "12.00s" },
    format: "mp4",
    orientation: "verticale",
    category: "territorio",
    suggestedUse: ["territorio", "vigneti", "social"],
    notes: [
      "Clip locale fuori repository.",
      "File pesante: non copiare nel repo senza una versione ottimizzata.",
    ],
  },
];

export const heroVideoRanking = [
  "drone-vigneto-vulcano-sfondo",
  "drone-orbita-castello-vigneti",
  "drone-vigneto-controluce-sole",
] as const;

export const localVideoCatalogNotes = {
  storagePolicy:
    "I file video restano in percorsi locali esterni al repository e non sono versionati.",
  missingSources: [
    "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_tools",
  ],
  suggestedPublicNames: [
    "public/videos/hero-vigneti.mp4",
    "public/videos/hero-vino.mp4",
    "public/videos/hero-poster.jpg",
  ],
} as const;
