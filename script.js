const chatbox = document.querySelector('.chat-content'); // Đổi sang .chat-content
const input = document.getElementById('input');
const apiKey = 'AIzaSyDQaOr4imKMKtbXHXzqUOrRdTyszxPGlic';

let conversationHistory = [
    { role: "model", parts: [{ text: "Xin chào! Tôi là Xuân Vương AI, rất vui được trò chuyện với bạn. Bạn khỏe không?" }] }
];

// Hiển thị lời chào ban đầu trong .chat-content
chatbox.innerHTML += `<p><b>Xuân Vương AI:</b> Xin chào! Tôi là Xuân Vương AI, rất vui được trò chuyện với bạn. Bạn khỏe không?</p>`;

async function sendMessage() {
    const message = input.value;
    if (!message) return;

    chatbox.innerHTML += `<p><b>Bạn:</b> ${message}</p>`;
    conversationHistory.push({ role: "user", parts: [{ text: message }] });
    input.value = '';

    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: conversationHistory
                })
            }
        );

        if (!response.ok) throw new Error('API request failed: ' + response.status);

        const data = await response.json();
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error('No valid response from API');
        }

        const reply = data.candidates[0].content.parts[0].text;
        chatbox.innerHTML += `<p><b>Xuân Vương AI:</b> ${reply}</p>`;
        conversationHistory.push({ role: "model", parts: [{ text: reply }] });
    } catch (error) {
        chatbox.innerHTML += `<p><b>Lỗi:</b> ${error.message}</p>`;
    }
    chatbox.scrollTop = chatbox.scrollHeight;
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});