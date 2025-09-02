document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const button = document.getElementById("button");
    const chatMessages = document.getElementById("chat-messages");
    const h1Title = document.getElementById("nameofperson");

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    function formatMessage(text) {
        // If content has HTML tags or code characters
        if (/<[a-z][\s\S]*>/i.test(text) || /[{};()=<>]/.test(text)) {
            return `<pre><code>${escapeHTML(text)}</code></pre>`;
        }
        // Otherwise just show normal escaped text
        return `<p>${escapeHTML(text)}</p>`;
    }
    


    async function sendPrompt() {
        if (h1Title) {
            h1Title.remove();
        }
    
        const loadingBotMessage = document.createElement("div");
        const userMsg = document.createElement("div");
    
        chatMessages.scrollTop = chatMessages.scrollHeight;
    
        const prompt = input.value.trim();
        input.value = "";
        input.style.height = "24px";
        if (!prompt) return;
    
        userMsg.className = "user-chat-container";
        userMsg.innerHTML = `
            <div class="user-messages" id="user-messages">
                ${formatMessage(prompt)}
            </div>
        `;
    
        loadingBotMessage.className = "message assistant-message";
        loadingBotMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="loading">
                    <span>Generating response...</span>
                </div>
            </div>
        `;
    
        chatMessages.append(userMsg);
        chatMessages.append(loadingBotMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    
        try {
            const response = await fetch("http://localhost:3000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });
    
            const data = await response.json();
            const botText = typeof data === "string" ? data : data.response || "Error: No response";
    
            let formatted = escapeHTML(botText)
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                .replace(/`{1,2}([\s\S]*?)`{1,2}/g, "<i>$1</i>");
    
            
            if (/<[a-z][\s\S]*>/i.test(botText)) {
                formatted = `<pre><code>${escapeHTML(botText)}</code></pre>`;
            }
    
            loadingBotMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    ${formatted}
                </div>
            `;
        } catch (error) {
            loadingBotMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Error: ${escapeHTML(error.message)}</p>
                </div>
            `;
        }
    
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    

    // Button click listener
    button.addEventListener("click", async (e) => {
        e.preventDefault();
        await sendPrompt();
    });

    // Enter key listener on textarea
    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await sendPrompt();
        }
    });

    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 200) + 'px';
        input.style.overflowY = input.scrollHeight > 200 ? 'auto' : 'hidden';
    });
});
