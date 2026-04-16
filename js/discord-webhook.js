/**
 * Discord Webhook Integration for Legion Suiper Application Forms
 * This file handles sending application form data to Discord via webhooks
 */

// Configuration for different application types
const webhookConfig = {
    police: {
        url: "https://discord.com/api/webhooks/1493255937350438982/uRKP4uPodX1VXmtLakIJamGtLRBM4IQfOYI1vY1jxhxAYqE3nZ-QGjjfYtUqOldgC53e", // Replace with actual Discord webhook URL
        color: 3447003, // Blue color for police
        title: "Police Application Submitted",
        thumbnail: "https://media.discordapp.net/attachments/1399092256471781516/1416827978754822164/legion_pd.png?ex=68ce3221&is=68cce0a1&hm=11afa558b4b41aaa122e9e14171cd8cced04bf622078a73930e505b94559e42a&=&format=webp&quality=lossless"
    },
    medical: {
        url: "https://discord.com/api/webhooks/1493255932052897905/yz_SX7DUfloj_RVqdZR9hmSJZlZiSkASNWOIb5UBUEnsa0ifS7GOSOyz4w5DBnJ6oM-L", // Replace with actual Discord webhook URL
        color: 15158332, // Red color for medical
        title: "Medical Application Submitted",
        thumbnail: "https://media.discordapp.net/attachments/1399092256471781516/1416830517504118957/legionsmd.png?ex=68ce347e&is=68cce2fe&hm=e0b91a10feb76e58a17454e834ca12a2d1ddbfd385de0ae91199f443607cf30e&=&format=webp&quality=lossless&width=350&height=350"
    },
    whitelist: {
        url: "https://discord.com/api/webhooks/1491545406142677163/L0juZAvmGUSvO-xgKRzDBywp2YkICHV5Vbjp1zsM8kj9ZQ0i98Ag1_FNVtgpHl3vjfFS", // Replace with actual Discord webhook URL
        color: 7506394, // Green color for whitelist
        title: "Whitelist Application Submitted",
        thumbnail: "https://cdn.discordapp.com/attachments/1399092256471781516/1417539221643591720/legion_atk.png?ex=68ce2587&is=68ccd407&hm=b6dbc7bbc711fae522483aab16508ad793d98cb3941ac9fd6d65ea206e4e2444&" // Replace with actual thumbnail URL
    }
};

/**
 * Send application data to Discord webhook
 * @param {string} type - Application type (police, medical)
 * @param {Object} formData - Form data to send
 * @returns {Promise} - Promise resolving to the fetch response
 */
async function sendToDiscord(type, formData) {
    // Get config for this application type
    const config = webhookConfig[type];
    if (!config) {
        throw new Error(`Invalid application type: ${type}`);
    }

    // Create fields array from form data
    const fields = [];
    for (const [key, value] of Object.entries(formData)) {
        // Format the key for better readability
        const formattedKey = key
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        fields.push({
            name: formattedKey,
            value: value,
            inline: false
        });
    }

    // Create the webhook payload
    const payload = {
        embeds: [{
            title: config.title,
            color: config.color,
            thumbnail: {
                url: config.thumbnail
            },
            fields: fields,
            timestamp: new Date().toISOString(),
            footer: {
                text: "Legion Roleplay Application System"
            }
        }]
    };

    try {
        // Send the webhook request
        const response = await fetch(config.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord webhook error: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Error sending to Discord:", error);
        throw error;
    }
}

/**
 * Process form submission and send to Discord
 * @param {HTMLFormElement} form - The form element
 * @param {string} type - Application type (police, medical)
 * @returns {Promise} - Promise resolving when submission is complete
 */
async function processFormSubmission(form, type) {
    // Create an object from form data
    const formData = {};
    const formElements = form.elements;
    
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.name && element.name !== "" && element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }

    // Add submission timestamp
    formData['submission-time'] = new Date().toLocaleString();
    
    try {
        // Send to Discord
        await sendToDiscord(type, formData);
        return true;
    } catch (error) {
        console.error("Form submission error:", error);
        return false;
    }
}

// Export functions for use in main.js
window.DiscordWebhook = {
    processFormSubmission
};