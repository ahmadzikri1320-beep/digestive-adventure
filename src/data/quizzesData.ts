/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FinalMissionTask, QrQuestion, SecretCodeChallenge, MatchingChallenge, SequencePuzzleChallenge } from '../types/game';

export const SECRET_CODE_CHALLENGES: SecretCodeChallenge[] = [
  {
    displayCode: 'M _ L _ T',
    hint: 'Tempat makanan pertama kali masuk ke dalam tubuh manusia.',
    answer: 'MULUT',
    organFact: 'Di dalam mulut, makanan dikunyah oleh gigi dan dibasahi oleh air liur (ptialin).',
  },
  {
    displayCode: 'L _ M B _ N G',
    hint: 'Organ berbentuk kantung tebal yang memproduksi asam lambung (HCl) dan enzim pencernaan.',
    answer: 'LAMBUNG',
    organFact: 'Asam lambung berfungsi membunuh kuman dan mengaktifkan pepsin untuk mencerna protein.',
  },
  {
    displayCode: 'G _ G _',
    hint: 'Bagian keras di dalam mulut yang bertugas memotong, merobek, dan mengunyah makanan.',
    answer: 'GIGI',
    organFact: 'Ada gigi seri (memotong), gigi taring (merobek), dan gigi geraham (menggilas/mengunyah).',
  },
  {
    displayCode: 'L _ D _ H',
    hint: 'Organ berotot peka rasa yang membantu mengaduk makanan dan mendorongnya saat menelan.',
    answer: 'LIDAH',
    organFact: 'Lidah memiliki papila pengecap rasa manis, asin, asam, pahit, dan umami.',
  },
  {
    displayCode: 'K _ R _ N G K _ N G A N',
    hint: 'Saluran berbentuk tabung berotot yang menghubungkan rongga mulut dengan lambung.',
    answer: 'KERONGKONGAN',
    organFact: 'Makanan bergerak ke lambung berkat gerakan meremas bergelombang (gerak peristaltik).',
  },
  {
    displayCode: 'U S _ S   H _ L _ S',
    hint: 'Saluran pencernaan terpanjang tempat penyerapan sari-sari makanan ke dalam aliran darah.',
    answer: 'USUS HALUS',
    organFact: 'Permukaan usus halus memiliki jonjot-jonjot (vili) untuk memperluas area penyerapan nutrisi.',
  },
  {
    displayCode: 'U S _ S   B _ S _ R',
    hint: 'Organ yang menyerap sisa air dan garam mineral serta membentuk ampas menjadi feses.',
    answer: 'USUS BESAR',
    organFact: 'Bakteri baik Escherichia coli di usus besar membantu pembusukan sisa makanan & membentuk vitamin K.',
  },
  {
    displayCode: 'A N _ S',
    hint: 'Lubang pembuangan zat sisa pencernaan (feses) yang sudah tidak dibutuhkan oleh tubuh.',
    answer: 'ANUS',
    organFact: 'Otot sfingter anus menjaga pengeluaran feses tetap terkontrol dengan baik.',
  },
];

export const QR_CHALLENGES: QrQuestion[] = [
  {
    id: 1,
    question: 'Enzim ptialin (amilase ludah) yang dihasilkan oleh kelenjar ludah di mulut berfungsi untuk mengubah...',
    options: [
      'Karbohidrat (amilum) menjadi gula sederhana (maltosa)',
      'Protein menjadi asam amino',
      'Lemak menjadi asam lemak dan gliserol',
      'Mineral menjadi vitamin C',
    ],
    correctAnswer: 0,
    explanation: 'Enzim amilase (ptialin) di dalam air liur memulai pencernaan kimiawi karbohidrat sejak makanan berada di dalam mulut.',
  },
  {
    id: 2,
    question: 'Gerakan meremas dan mendorong gumpalan makanan (bolus) di sepanjang kerongkongan menuju lambung disebut gerak...',
    options: ['Gerak Refleks', 'Gerak Peristaltik', 'Gerak Brownian', 'Gerak Silia'],
    correctAnswer: 1,
    explanation: 'Gerak peristaltik adalah kontraksi bergelombang otot dinding kerongkongan yang mendorong makanan masuk ke lambung.',
  },
  {
    id: 3,
    question: 'Asam klorida (HCl) yang diproduksi oleh dinding lambung memiliki fungsi utama untuk...',
    options: [
      'Membunuh kuman/bakteri patogen pada makanan dan mengasamkan lambung',
      'Mengentalkan air liur',
      'Membentuk feses menjadi padat',
      'Menyerap vitamin K ke dalam darah',
    ],
    correctAnswer: 0,
    explanation: 'Asam lambung (HCl) sangat asam (pH 1.5 - 2.0) untuk membunuh bakteri berbahaya dan mengaktifkan enzim pepsin.',
  },
  {
    id: 4,
    question: 'Sebagian besar proses penyerapan sari-sari makanan ke dalam pembuluh darah terjadi pada bagian...',
    options: [
      'Kerongkongan (Esofagus)',
      'Lambung (Ventrikulus)',
      'Usus Halus (Duodenum, Jejunum, Ileum)',
      'Anus (Lubang Pelepasan)',
    ],
    correctAnswer: 2,
    explanation: 'Usus halus memiliki lipatan jonjot (vili) yang menyerap asam amino, glukosa, dan asam lemak ke dalam aliran darah.',
  },
  {
    id: 5,
    question: 'Peran utama usus besar (kolon) dalam proses sistem pencernaan manusia adalah...',
    options: [
      'Menyerap kembali kelebihan air dan membusukkan sisa ampas makanan',
      'Mengunyah makanan secara mekanik',
      'Memproduksi empedu untuk mencerna lemak',
      'Menghasilkan enzim amilase ludah',
    ],
    correctAnswer: 0,
    explanation: 'Usus besar menyerap sisa air dan garam mineral sehingga ampas feses menjadi padat dan tidak terlalu cair.',
  },
  {
    id: 6,
    question: 'Kebiasaan hidup sehat yang paling efektif mencegah gangguan sembelit (konstipasi) adalah...',
    options: [
      'Banyak mengonsumsi makanan berserat (sayur & buah) serta cukup minum air putih',
      'Sering menahan buang air besar saat di sekolah',
      'Makan makanan pedas dan asam secara berlebihan',
      'Makan terburu-buru tanpa dikunyah halus',
    ],
    correctAnswer: 0,
    explanation: 'Serat dari sayur dan buah mengikat air di dalam usus besar sehingga feses bertekstur lunak dan lancar dikeluarkan.',
  },
  {
    id: 7,
    question: 'Jenis gigi manusia yang memiliki bentuk runcing dan tajam untuk merobek makanan yang liat adalah...',
    options: ['Gigi Seri', 'Gigi Taring', 'Gigi Geraham Depan', 'Gigi Geraham Belakang'],
    correctAnswer: 1,
    explanation: 'Gigi taring berfungsi untuk merobek dan mengoyak makanan, sedangkan gigi seri memotong dan gigi geraham melumatkan.',
  },
  {
    id: 8,
    question: 'Enzim pepsin yang dihasilkan di dalam organ lambung bertugas untuk mencerna zat gizi...',
    options: [
      'Protein menjadi senyawa pepton',
      'Karbohidrat menjadi glukosa',
      'Lemak menjadi asam lemak',
      'Kalsium menjadi vitamin D',
    ],
    correctAnswer: 0,
    explanation: 'Enzim pepsin aktif dalam suasana asam lambung untuk memecah rantai molekul protein kompleks menjadi pepton.',
  },
  {
    id: 9,
    question: 'Enzim renin yang terdapat di lambung anak-anak dan bayi berfungsi khusus untuk...',
    options: [
      'Mengendapkan protein susu (kasein) dari air susu',
      'Mencerna serat sayuran mentah',
      'Membunuh kuman di usus besar',
      'Memproduksi cairan empedu',
    ],
    correctAnswer: 0,
    explanation: 'Renin mengendapkan kasein susu agar cairan susu dapat ditahan dan dicerna lebih lanjut oleh enzim pepsin.',
  },
  {
    id: 10,
    question: 'Cairan getah empedu yang disimpan di kantung empedu dihasilkan oleh organ...',
    options: ['Hati (Hepar)', 'Pankreas', 'Limpa', 'Ginjal'],
    correctAnswer: 0,
    explanation: 'Hati memproduksi getah empedu yang berfungsi mengemulsikan lemak di usus halus agar mudah dicerna oleh enzim lipase.',
  },
  {
    id: 11,
    question: 'Enzim lipase yang dihasilkan oleh kelenjar pankreas memiliki fungsi untuk memecah...',
    options: [
      'Lemak menjadi asam lemak dan gliserol',
      'Amilum menjadi maltosa',
      'Protein menjadi asam amino',
      'Gula tebu menjadi vitamin',
    ],
    correctAnswer: 0,
    explanation: 'Lipase memecah molekul lemak yang telah diemulsikan oleh empedu menjadi asam lemak dan gliserol.',
  },
  {
    id: 12,
    question: 'Gangguan pencernaan berupa nyeri perih pada ulu hati akibat radang dinding lambung disebut...',
    options: ['Maag (Gastritis)', 'Apendisitis', 'Diare', 'Sariawan'],
    correctAnswer: 0,
    explanation: 'Penyakit maag terjadi akibat iritasi atau radang pada mukosa lambung karena produksi asam lambung atau pola makan tidak teratur.',
  },
  {
    id: 13,
    question: 'Bakteri baik yang hidup bersimbiosis di usus besar dan membantu pembentukan vitamin K adalah...',
    options: ['Escherichia coli (E. coli)', 'Salmonella typhi', 'Lactobacillus bulgaricus', 'Amoeba'],
    correctAnswer: 0,
    explanation: 'Bakteri E. coli di usus besar membusukkan sisa pencernaan dan menghasilkan vitamin K yang penting untuk pembekuan darah.',
  },
  {
    id: 14,
    question: 'Bagian usus halus pertama yang langsung terhubung dengan muara lambung adalah usus...',
    options: [
      'Dua belas jari (Duodenum)',
      'Kosong (Jejunum)',
      'Penyerapan (Ileum)',
      'Buntu (Sekum)',
    ],
    correctAnswer: 0,
    explanation: 'Duodenum (usus dua belas jari) adalah saluran awal usus halus tempat bermuaranya getah empedu dan getah pankreas.',
  },
  {
    id: 15,
    question: 'Gumpalan makanan lunak bercampur air liur yang siap ditelan dari rongga mulut disebut...',
    options: ['Bolus', 'Kimus (Chyme)', 'Feses', 'Enzim'],
    correctAnswer: 0,
    explanation: 'Makanan yang telah dikunyah dan dibasahi air liur di mulut disebut bolus, sedangkan bubur makanan di lambung disebut kimus.',
  },
  {
    id: 16,
    question: 'Berapa rata-rata panjang saluran usus halus pada manusia dewasa?',
    options: ['Sekitar 6 sampai 7 meter', 'Sekitar 20 sentimeter', 'Sekitar 1 meter', 'Sekitar 15 meter'],
    correctAnswer: 0,
    explanation: 'Panjang usus halus manusia dewasa mencapai 6-7 meter dengan vili yang sangat luas untuk penyerapan nutrisi maksimal.',
  },
  {
    id: 17,
    question: 'Mengapa kita dianjurkan untuk mengunyah makanan sebanyak 20 hingga 30 kali sebelum menelan?',
    options: [
      'Agar makanan lebih halus sehingga meringankan kerja lambung dan memperluas kontak enzim',
      'Agar gigi cepat tanggal',
      'Supaya air liur di mulut cepat habis',
      'Agar makanan berubah rasa menjadi pahit',
    ],
    correctAnswer: 0,
    explanation: 'Mengunyah makanan hingga lembut membantu enzim pencernaan bekerja maksimal dan melindungi dinding saluran pencernaan.',
  },
  {
    id: 18,
    question: 'Gangguan pencernaan buang air besar yang terlalu sering dan cair akibat infeksi kuman disebut...',
    options: ['Diare', 'Konstipasi', 'Tifus', 'Wasir'],
    correctAnswer: 0,
    explanation: 'Diare terjadi ketika dinding usus besar terinfeksi sehingga penyerapan air terganggu dan feses dikeluarkan dalam bentuk cair.',
  },
  {
    id: 19,
    question: 'Penyakit radang umbai cacing pada saluran pencernaan bagian sekum dikenal dengan nama...',
    options: ['Apendisitis (Usus Buntu)', 'Gastritis', 'Kolik', 'Dispepsia'],
    correctAnswer: 0,
    explanation: 'Apendisitis adalah peradangan pada apendiks (umbai cacing) yang memerlukan penanganan medis atau operasi.',
  },
  {
    id: 20,
    question: 'Otot melingkar pada anus yang bertugas menahan dan mengontrol keluarnya feses disebut...',
    options: ['Otot Sfingter Anus', 'Otot Jantung', 'Otot Polos Lambung', 'Otot Lurik Lengan'],
    correctAnswer: 0,
    explanation: 'Otot sfingter ani internal dan eksternal menjaga agar proses defekasi (buang air besar) terkontrol dengan tertib.',
  },
  {
    id: 21,
    question: 'Kekurangan vitamin C pada tubuh sering kali memicu peradangan pada gusi dan bibir yang disebut...',
    options: ['Sariawan (Stomatitis)', 'Maag', 'Karies', 'Gondongan'],
    correctAnswer: 0,
    explanation: 'Sariawan di rongga mulut dapat dicegah dengan mengonsumsi buah kaya vitamin C seperti jeruk, kiwi, dan jambu biji.',
  },
  {
    id: 22,
    question: 'Enzim tripsin yang dihasilkan oleh pankreas dan aktif di usus halus berfungsi untuk...',
    options: [
      'Mengubah protein dan pepton menjadi asam amino',
      'Mengubah lemak menjadi karbohidrat',
      'Mengendapkan air susu',
      'Membunuh bakteri di lambung',
    ],
    correctAnswer: 0,
    explanation: 'Tripsin melanjutkan pemecahan pepton menjadi molekul asam amino yang siap diserap oleh pembuluh darah.',
  },
  {
    id: 23,
    question: 'Pemberian oralit (larutan garam dan gula) pada penderita diare bertujuan untuk...',
    options: [
      'Mencegah bahaya dehidrasi (kekurangan cairan dan elektrolit tubuh)',
      'Membunuh semua kuman di tubuh seketika',
      'Membuat perut menjadi kenyang tanpa makan',
      'Menghentikan detak jantung',
    ],
    correctAnswer: 0,
    explanation: 'Oralit menggantikan cairan tubuh, garam, dan mineral penting yang hilang secara cepat selama diare.',
  },
  {
    id: 24,
    question: 'Karies gigi (gigi berlubang) paling sering dipicu oleh sisa makanan manis yang diubah oleh bakteri menjadi...',
    options: [
      'Asam perusak email gigi',
      'Kalsium pembentuk tulang',
      'Enzim amilase ludah',
      'Minyak nabati',
    ],
    correctAnswer: 0,
    explanation: 'Bakteri mulut memfermentasi sisa gula menjadi asam yang melarutkan lapisan email keras pada mahkota gigi.',
  },
  {
    id: 25,
    question: 'Panduan gizi nasional "Isi Piringku" mengajarkan bahwa setengah piring makan kita sebaiknya berisi...',
    options: [
      'Sayur-sayuran dan buah-buahan berserat tinggi',
      'Makanan manis dan permen berlemak',
      'Nasi putih penuh tanpa sayur',
      'Gorengan minyak jenuh',
    ],
    correctAnswer: 0,
    explanation: 'Porsi seimbang adalah 50% sayur dan buah, 33% makanan pokok (karbohidrat), dan 17% lauk pauk (protein).',
  },
  {
    id: 26,
    question: 'Mengapa mencuci tangan menggunakan sabun sebelum makan sangat penting bagi kesehatan pencernaan?',
    options: [
      'Mencegah kuman, parasit, dan virus penyebab diare masuk ke saluran cerna',
      'Supaya tangan menjadi wangi saja',
      'Agar makanan terasa lebih manis',
      'Untuk menambah jumlah bakteri jahat di perut',
    ],
    correctAnswer: 0,
    explanation: 'Sabun melarutkan lapisan lemak pada kuman dan virus di tangan sehingga dibilas bersih sebelum menyentuh makanan.',
  },
];

export const FINAL_MISSION_TASKS: FinalMissionTask[] = [
  {
    organ: 'MULUT & GIGI',
    actionInstruction: 'Peragakan gerakan membuka mulut dan mengunyah makanan sebanyak 10 kali dengan ekspresi ceria!',
    learningTip: 'Mengunyah makanan hingga lembut memudahkan lambung mencerna nutrisi tanpa beban berlebih.',
    image: './assets/cards/organ_mulut.png',
  },
  {
    organ: 'KERONGKONGAN (ESOFAGUS)',
    actionInstruction: 'Peragakan gerakan menelan perlahan dan buat gelombang tangan ke bawah meniru gerak peristaltik!',
    learningTip: 'Gerak peristaltik memastikan makanan tetap meluncur turun menuju lambung bahkan saat kita berbaring.',
    image: './assets/cards/organ_kerongkongan.png',
  },
  {
    organ: 'LAMBUNG',
    actionInstruction: 'Letakkan kedua tangan di perut bagian kiri atas, lalu putar-putar perlahan memperagakan lambung yang sedang mengaduk kimus!',
    learningTip: 'Lambung bekerja seperti blender biologis yang mencampur makanan dengan asam lambung dan enzim pepsin.',
    image: './assets/cards/organ_lambung.png',
  },
  {
    organ: 'USUS HALUS',
    actionInstruction: 'Rapatkan kedua tangan dan buat gerakan melingkar meliuk-liuk seperti pita panjang sambil memperagakan penyerapan sari makanan!',
    learningTip: 'Panjang usus halus manusia dewasa mencapai sekitar 6 meter agar penyerapan nutrisi berlangsung maksimal.',
    image: './assets/cards/organ_usus_halus.png',
  },
  {
    organ: 'USUS BESAR & AIR',
    actionInstruction: 'Peragakan kedua tangan memeras spons imajiner perlahan untuk menyerap air hingga padat!',
    learningTip: 'Penyerapan air di usus besar mencegah tubuh dari bahaya kekurangan cairan (dehidrasi).',
    image: './assets/cards/organ_usus_besar.png',
  },
  {
    organ: 'PEMBUANGAN AKHIR (ANUS)',
    actionInstruction: 'Berdiri tegak dengan sopan, tarik napas lega, dan ucapkan dengan lantang: "Pencernaan sehat, tubuh kuat dan bugar!"',
    learningTip: 'Mengeluarkan feses secara teratur setiap hari adalah tanda sistem pencernaan berfungsi dengan normal.',
    image: './assets/cards/organ_anus.png',
  },
];

export interface OrganEncyclopediaItem {
  id: string;
  name: string;
  role: string;
  location: string;
  enzymes: string[];
  healthTips: string;
  image: string;
}

export const ORGAN_ENCYCLOPEDIA: OrganEncyclopediaItem[] = [
  {
    id: 'mulut',
    name: 'Mulut, Gigi & Lidah',
    role: 'Tempat masuknya makanan pertama kali. Melakukan pencernaan mekanik (gigi & lidah) dan pencernaan kimiawi (air liur).',
    location: 'Rongga kepala bagian bawah.',
    enzymes: ['Ptialin (Amilase Ludah) - Mengurai amilum menjadi maltosa.'],
    healthTips: 'Kunyah makanan minimal 20-30 kali dan gosok gigi minimal 2 kali sehari setelah makan dan sebelum tidur.',
    image: './assets/cards/organ_mulut.png',
  },
  {
    id: 'kerongkongan',
    name: 'Kerongkongan (Esofagus)',
    role: 'Pipa elastis sepanjang 20-25 cm yang menghubungkan faring/mulut ke lambung melalui gerak meremas peristaltik.',
    location: 'Leher sampai dada, di belakang trakea.',
    enzymes: ['Lendir (Musin) - Melicinkan dinding kerongkongan agar makanan lancar.'],
    healthTips: 'Hindari makan sambil berbicara atau tertawa agar tidak tersedak ke saluran napas.',
    image: './assets/cards/organ_kerongkongan.png',
  },
  {
    id: 'lambung',
    name: 'Lambung (Ventrikulus)',
    role: 'Kantung berotot tebal yang menampung makanan selama 2-4 jam, mengaduknya menjadi bubur (kimus), dan membunuh bakteri.',
    location: 'Rongga perut sebelah kiri atas, tepat di bawah diafragma.',
    enzymes: ['Asam Klorida (HCl) - Membunuh kuman & mengaktifkan pepsin.', 'Pepsin - Memecah protein menjadi pepton.', 'Renin - Mengendapkan kasein susu.'],
    healthTips: 'Makan secara teratur, hindari stres berlebih dan kurangi makanan yang terlalu pedas/asam saat perut kosong.',
    image: './assets/cards/organ_lambung.png',
  },
  {
    id: 'usus_halus',
    name: 'Usus Halus (Intestinum Tenue)',
    role: 'Tempat terjadinya pencernaan kimiawi terlama dan penyerapan 90% sari-sari makanan ke dalam pembuluh darah dan limfa.',
    location: 'Bagian tengah rongga perut, terdiri dari usus dua belas jari, usus kosong, dan usus penyerapan.',
    enzymes: ['Maltase, Sukrase, Laktase - Mencerna gula.', 'Tripsin & Erepsin - Mencerna protein.', 'Lipase - Mencerna lemak dengan bantuan empedu.'],
    healthTips: 'Konsumsi makanan beragam dengan gizi seimbang (protein, karbohidrat kompleks, vitamin, dan mineral).',
    image: './assets/cards/organ_usus_halus.png',
  },
  {
    id: 'usus_besar',
    name: 'Usus Besar (Kolon) & Rektum',
    role: 'Menyerap kembali sisa air, vitamin, dan elektrolit, serta membusukkan ampas sisa makanan menjadi feses dengan bantuan bakteri baik E. coli.',
    location: 'Membingkai rongga perut dari kanan bawah, melintang ke kiri, lalu turun ke rektum.',
    enzymes: ['Bakteri Simbiosis Escherichia coli penghasil vitamin K dan biotin.'],
    healthTips: 'Perbanyak asupan serat dari sayur, buah, biji-bijian serta cukupi kebutuhan cairan harian.',
    image: './assets/cards/organ_usus_besar.png',
  },
  {
    id: 'anus',
    name: 'Anus',
    role: 'Pintu gerbang terakhir pembuangan feses dari dalam tubuh (defekasi) yang diatur oleh dua cincin otot sfingter internal dan eksternal.',
    location: 'Ujung paling bawah dari saluran gastrointestinal.',
    enzymes: ['Tidak ada enzim pencernaan.'],
    healthTips: 'Jangan menahan buang air besar dan jaga kebersihan area anus setelah buang air dengan air bersih mengalir.',
    image: './assets/cards/organ_anus.png',
  },
];

export const QR_MATCHING_CHALLENGES: MatchingChallenge[] = [
  {
    id: 'match_organ_fungsi',
    title: 'Cocokkan Pasangan Organ & Fungsinya',
    instruction: 'Pilih salah satu organ di sebelah kiri, lalu klik fungsi utama yang tepat di sebelah kanan!',
    pairs: [
      {
        id: 'gigi',
        left: 'Gigi',
        right: 'Mengunyah & menghancurkan makanan mekanik',
        badge: 'Mulut',
      },
      {
        id: 'kerongkongan',
        left: 'Kerongkongan',
        right: 'Mendorong makanan lewat gerak peristaltik',
        badge: 'Saluran',
      },
      {
        id: 'lambung',
        left: 'Lambung',
        right: 'Mengaduk makanan dengan asam HCl & pepsin',
        badge: 'Pencerna',
      },
      {
        id: 'usus_halus',
        left: 'Usus Halus',
        right: 'Menyerap 90% sari-sari makanan ke dalam darah',
        badge: 'Nutrisi',
      },
      {
        id: 'usus_besar',
        left: 'Usus Besar',
        right: 'Menyerap sisa air & memadatkan feses',
        badge: 'Penyerapan',
      },
    ],
  },
  {
    id: 'match_enzim_tempat',
    title: 'Cocokkan Enzim Pencernaan & Tempat Kerjanya',
    instruction: 'Hubungkan setiap enzim/cairan pencernaan dengan organ tempat zat tersebut bekerja!',
    pairs: [
      {
        id: 'ptialin',
        left: 'Enzim Ptialin (Amilase)',
        right: 'Rongga Mulut (Mencerna amilum menjadi maltosa)',
        badge: 'Karbohidrat',
      },
      {
        id: 'hcl',
        left: 'Asam Lambung (HCl)',
        right: 'Lambung (Membunuh kuman & mengasamkan)',
        badge: 'Asam',
      },
      {
        id: 'pepsin',
        left: 'Enzim Pepsin',
        right: 'Lambung (Memecah protein menjadi pepton)',
        badge: 'Protein',
      },
      {
        id: 'lipase',
        left: 'Enzim Lipase',
        right: 'Usus Halus (Memecah lemak jadi asam lemak)',
        badge: 'Lemak',
      },
      {
        id: 'empedu',
        left: 'Cairan Empedu',
        right: 'Usus Dua Belas Jari (Mengemulsikan lemak)',
        badge: 'Hati',
      },
    ],
  },
  {
    id: 'match_penyakit_penyebab',
    title: 'Cocokkan Gangguan Pencernaan & Gejalanya',
    instruction: 'Pasangkan setiap nama gangguan pencernaan dengan gejala atau penyebab yang sesuai!',
    pairs: [
      {
        id: 'maag',
        left: 'Maag (Gastritis)',
        right: 'Perih ulu hati akibat radang mukosa lambung',
        badge: 'Lambung',
      },
      {
        id: 'konstipasi',
        left: 'Sembelit (Konstipasi)',
        right: 'Feses keras akibat kurang serat & minum air',
        badge: 'Usus Besar',
      },
      {
        id: 'diare',
        left: 'Diare',
        right: 'Feses cair akibat infeksi kuman pada dinding usus',
        badge: 'Infeksi',
      },
      {
        id: 'karies',
        left: 'Karies Gigi',
        right: 'Gigi berlubang akibat asam dari sisa gula makanan',
        badge: 'Mulut',
      },
      {
        id: 'apendisitis',
        left: 'Usus Buntu (Apendisitis)',
        right: 'Radang pada umbai cacing di perut kanan bawah',
        badge: 'Radang',
      },
    ],
  },
];

export const QR_SEQUENCE_PUZZLES: SequencePuzzleChallenge[] = [
  {
    id: 'seq_rute_makanan',
    title: 'Puzzle Susun Rute Alur Makanan',
    instruction: 'Urutkan saluran pencernaan yang dilalui sebutir apel mulai dari awal masuk hingga pembuangan akhir!',
    items: [
      { id: 'mulut', label: 'Mulut', desc: 'Makanan dikunyah gigi & air liur' },
      { id: 'kerongkongan', label: 'Kerongkongan', desc: 'Gerak peristaltik mendorong bolus' },
      { id: 'lambung', label: 'Lambung', desc: 'Dilarutkan asam HCl & pepsin' },
      { id: 'usus_halus', label: 'Usus Halus', desc: 'Penyerapan sari-sari makanan ke darah' },
      { id: 'usus_besar', label: 'Usus Besar', desc: 'Penyerapan kelebihan air & pembusukan' },
      { id: 'anus', label: 'Anus', desc: 'Pembuangan feses sisa makanan' },
    ],
    correctOrder: ['mulut', 'kerongkongan', 'lambung', 'usus_halus', 'usus_besar', 'anus'],
    explanation: 'Rute lengkap: Mulut -> Kerongkongan -> Lambung -> Usus Halus -> Usus Besar -> Anus.',
  },
  {
    id: 'seq_tahap_pencernaan',
    title: 'Puzzle Susun 5 Tahap Proses Pencernaan',
    instruction: 'Susun urutan 5 tahap fisiologis pencernaan manusia secara benar dari awal hingga akhir!',
    items: [
      { id: 'ingesti', label: '1. Ingesti', desc: 'Proses memasukkan makanan ke dalam rongga mulut' },
      { id: 'mekanik', label: '2. Digesti Mekanik', desc: 'Mengunyah & melumatkan makanan dengan gigi' },
      { id: 'kimiawi', label: '3. Digesti Kimiawi', desc: 'Penguraian molekul oleh enzim & asam lambung' },
      { id: 'absorpsi', label: '4. Absorpsi', desc: 'Penyerapan sari nutrisi oleh jonjot usus halus' },
      { id: 'defekasi', label: '5. Defekasi', desc: 'Pengeluaran sisa ampas makanan melalui anus' },
    ],
    correctOrder: ['ingesti', 'mekanik', 'kimiawi', 'absorpsi', 'defekasi'],
    explanation: 'Tahapan: Ingesti (masuk) -> Digesti Mekanik -> Digesti Kimiawi -> Absorpsi (serap) -> Defekasi (buang).',
  },
];

