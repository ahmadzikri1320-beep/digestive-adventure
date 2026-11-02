/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, ShieldCheck, Trophy, Sparkles, Award, X } from 'lucide-react';

interface RulebookModalProps {
  onClose: () => void;
}

export const RulebookModal: React.FC<RulebookModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-bold">
                Buku Petunjuk & Aturan Permainan
              </h3>
              <p className="text-xs text-amber-100">
                DIGESTIVE ADVENTURE - Panduan Lengkap Siswa & Guru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <h4 className="font-heading font-bold text-amber-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>1. Tujuan Permainan & Poin Awal</span>
            </h4>
            <p className="leading-relaxed">
              Setiap pemain (1 hingga 6 petualang) memulai petualangan di <strong>Kotak 1 (START)</strong> dengan modal{' '}
              <strong>30 Poin</strong>. Tujuannya adalah mengumpulkan poin terbanyak sambil mempelajari 28 organ & proses pencernaan manusia, memecahkan kode rahasia, dan menuntaskan Final Mission!
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <span>🎲 2. Giliran & Dadu (Digital & Fisik)</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              <li>Pemain bermain secara bergantian sesuai urutan giliran.</li>
              <li>Pemain dapat melempar <strong>Dadu Digital</strong> di layar atau menggunakan <strong>Dadu Fisik</strong> di kelas dengan memilih menu &ldquo;Input Hasil Dadu&rdquo;.</li>
              <li>Pion akan melompat kotak demi kotak secara halus sesuai angka dadu yang diperoleh.</li>
              <li>Pemain harus menyelesaikan tantangan atau aktivitas pada kotak sebelum giliran berpindah ke pemain berikutnya.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
            <h4 className="font-heading font-bold text-rose-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-rose-600" />
              <span>3. Kartu Organ & Transaksi Jual (+5 Poin)</span>
            </h4>
            <p className="leading-relaxed mb-2">
              Saat pion berhenti di kotak organ (Mulut, Gigi, Lidah, Kerongkongan, Lambung, Usus Halus, Usus Besar, Anus), pemain memperoleh Kartu Organ tersebut ke inventaris.
            </p>
            <p className="leading-relaxed">
              Pemain berhak <strong>menjual kartu organ</strong> miliknya untuk ditukarkan dengan keuntungan{' '}
              <strong>+5 poin</strong> kapan saja melalui menu kartu atau di Kotak 6 (PILIH KARTU).
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
            <h4 className="font-heading font-bold text-purple-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <span>🔮 4. Kotak Mystery & Kotak Jebakan</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              <li><strong>Kotak Mystery (4, 12, 20):</strong> Pemain mengambil kartu misteri yang berisi kejutan langkah, pertanyaan pengetahuan (+10 poin), atau Kartu Penyelamat.</li>
              <li><strong>Kotak Jebakan (13, 18):</strong> Pemain mengambil kartu jebakan seperti Hari Sial (kembali ke START), Portal Usus, Bakteri, atau Sakit Perut.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <h4 className="font-heading font-bold text-emerald-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>5. Kartu Penyelamat (SELAMAT!)</span>
            </h4>
            <p className="leading-relaxed">
              Kartu Penyelamat melindungi petualang dari pengurangan poin (misalnya Hambatan -5, Bakteri -5, atau Bahaya Besar -20). Jika pemain memilikinya, sistem akan menawarkan dialog untuk mengaktifkan kartu sebelum hukuman diterapkan.
            </p>
          </div>

          {/* Section 6 */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <h4 className="font-heading font-bold text-sky-900 text-sm sm:text-base flex items-center gap-2 mb-2">
              <span>⭐ 6. QR Challenge, QR Mission & Secret Code</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              <li><strong>QR Challenge (7, 16) & QR Mission (22):</strong> Pemain dapat memindai kode QR fisik dengan kamera HP/laptop atau langsung menjawab tantangan digital IPA. 1 Bintang = <strong>+10 Poin</strong>.</li>
              <li><strong>Kotak 25 (Secret Code):</strong> Tebak nama organ dari kata bersandi (contoh: M _ L _ T). Jawaban benar menghasilkan <strong>+10 Poin</strong>.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
            <h4 className="font-heading font-bold text-amber-950 text-sm sm:text-base flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>7. Final Mission (Kotak 27) & Syarat FINISH (Kotak 28)</span>
            </h4>
            <p className="leading-relaxed mb-2">
              Kotak 28 adalah FINISH, namun pemain <strong>wajib menyelesaikan Final Mission di Kotak 27 terlebih dahulu</strong> (memperagakan gerakan khas organ pencernaan di depan guru/penilai). Jika belum menyelesaikan Final Mission, pemain belum boleh dinyatakan Finish.
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-amber-300 text-xs font-semibold text-amber-900">
              Bonus Urutan Masuk Finish:
              <br />• Pemain ke-1: <strong>+50 Poin</strong>
              <br />• Pemain ke-2: <strong>+30 Poin</strong>
              <br />• Pemain ke-3: <strong>+10 Poin</strong>
            </div>
            <p className="leading-relaxed mt-2 text-slate-600">
              🏆 <strong>Pemenang Akhir:</strong> Ditentukan berdasarkan pemain yang telah mencapai FINISH dengan <strong>TOTAL POIN TERTINGGI</strong> (bukan hanya siapa yang pertama kali tiba).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-amber-500/20"
          >
            Saya Mengerti Aturan Bermain!
          </button>
        </div>
      </div>
    </div>
  );
};
