import React, { useState, useCallback } from 'react';
import { N8N_WEBHOOK_URL } from './constants';
import type { Status } from './types';

// --- SVG Icon Components ---
const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuccessIcon = () => (
    <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const App: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [description, setDescription] = useState<string>('Buatkan iklan motion graphic untuk produk ini dengan gaya yang ceria dan modern.');
  const [videoCount, setVideoCount] = useState<number>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<{ title: string; message: string } | null>(null);

  const resetForm = useCallback(() => {
    setProductName('');
    setDescription('Buatkan iklan motion graphic untuk produk ini dengan gaya yang ceria dan modern.');
    setVideoCount(1);
    setStatus('idle');
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!productName || !description || !videoCount) {
      setError({ title: 'Input Tidak Lengkap', message: 'Harap isi semua bidang yang ditandai bintang (*).' });
      setStatus('error');
      return;
    }

    if (videoCount < 1 || videoCount > 20) {
        setError({ title: 'Input Tidak Valid', message: 'Jumlah video harus antara 1 dan 20.' });
        setStatus('error');
        return;
    }

    setStatus('loading');

    try {
      const formData = new FormData();
      formData.append('Produk', productName);
      formData.append('description', description);
      formData.append('videoCount', videoCount.toString());

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({ message: 'Gagal mem-parsing respons error dari server.' }));
        throw new Error(responseData.message || `Server merespons dengan status ${response.status}: ${response.statusText}`);
      }

      setStatus('success');
    } catch (err) {
      let message = 'Terjadi kesalahan yang tidak diketahui. Periksa koneksi internet Anda atau coba lagi nanti.';
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
            message = 'Gagal terhubung ke server. Pastikan Anda terhubung ke internet dan server webhook dapat diakses.';
        } else {
            message = err.message;
        }
      }
      setError({ title: 'Gagal Mengirim Permintaan', message });
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl w-full border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800">Panen Konten</h1>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Platform otomatis untuk memproduksi konten video secara massal. Masukkan link gambar produk, tulis deskripsi, dan biarkan sistem kami yang bekerja.
            </p>
          </div>        {status === 'success' ? (
          <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
            <SuccessIcon/>
            <h2 className="text-2xl font-semibold text-green-800 mt-4">Permintaan Berhasil Dikirim!</h2>
            <p className="text-green-700 mt-2">
              Permintaan Anda telah kami terima dan sedang diproses. Hasilnya akan dikirimkan jika sudah selesai.
            </p>
            <button
              onClick={resetForm}
              className="mt-6 bg-gradient-to-br from-sky-500 to-blue-600 hover:bg-gradient-to-bl text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-sky-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
            >
              Buat Permintaan Baru
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 space-y-6 md:space-y-0">
                {/* Product Name Section */}
                <div className="flex flex-col">
                    <label htmlFor="product-name" className="block text-sm font-medium text-slate-700">
                        Link Gambar Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="product-name"
                        name="product-name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-100 p-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-sky-500 transition"
                        placeholder="Contoh: https://example.com/image.jpg"
                        required
                    />
                                        <p className="mt-2 text-sm text-slate-500">Masukan Link Gambar Produk</p>
                </div>

                {/* Video Count Section */}
                <div className="flex flex-col">
                    <label htmlFor="video-count" className="block text-sm font-medium text-slate-700">
                        Jumlah Video <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="video-count"
                        name="video-count"
                        min="1"
                        max="20"
                        value={videoCount}
                        onChange={(e) => setVideoCount(parseInt(e.target.value, 10) || 1)}
                        className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-100 p-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-sky-500 transition"
                        required
                    />
                    <p className="mt-2 text-sm text-slate-500">Jumlah video yang ingin dibuat (1-20).</p>
                </div>
            </div>

            {/* Description Section */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Deskripsi Video <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-100 p-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-sky-500 transition"
                placeholder="Contoh: Buatkan video iklan sinematik yang menampilkan produk ini dari berbagai sudut..."
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-sky-500/50 text-base font-semibold text-white bg-gradient-to-br from-sky-500 to-blue-600 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
              >
                {status === 'loading' ? 'Mengirim...' : 'Kirim Permintaan Konten'}
              </button>
            </div>
            
            {status === 'error' && error && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative" role="alert">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <AlertIcon/>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-bold">{error.title}</p>
                            <p className="mt-1 text-sm">{error.message}</p>
                        </div>
                    </div>
                </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default App;
