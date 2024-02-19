const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();


const BOT_TOKEN = '6758489560:AAEtDBrbnKwkgF2E49cr6IsJVLA2RSc5Sjs';
const CHAT_ID = '-1001503592816';

router.post('/send-telegram-message', async (req, res) => {
    try {

        const { title, year } = req.body;
        console.log(req.body.year)
        const message = `link ${title} ${year}`;
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;

        await axios.post(url);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-latest-telegram-message', async (req, res) => {
    try {
        const latestMessageText = await getLatestTelegramMessage(BOT_TOKEN, CHAT_ID);

        if (latestMessageText !== null) {
            res.status(200).json({ latestMessageText });
        } else {
            res.status(500).json({ error: 'Failed to retrieve the latest Telegram message text.' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getLatestTelegramMessage(botToken, chatId) {
    try {
        const paramsTelegram = { chat_id: chatId };
        const urlTelegram = `https://api.telegram.org/bot${botToken}/getUpdates`;
        const responseTelegram = await axios.get(urlTelegram, { params: paramsTelegram });

        if (responseTelegram.status === 200) {
            try {
                const textData = responseTelegram.data.result.slice(-1)[0].message.text;
                return textData;
            } catch (error) {
                console.error('Error parsing Telegram response or no messages found.');
                return null;
            }
        } else {
            console.error(`Error: ${responseTelegram.status} - ${responseTelegram.statusText}`);
            return null;
        }
    } catch (error) {
        console.error('Error making Telegram API request:', error.message);
        return null;
    }
}


module.exports = router;
