import OpenAI from "openai";
import { woocommerceAITools } from "../utils/woocommerceAITools.js";
export const openAIClient = new OpenAI();


export async function getOpenAIResponse(message) {
    const response = await openAIClient.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
            { role: "system", content: "You are a witty Hinglish Store Manager. Help the user manage their store." },
            { role: "user", content: message }
        ],
        tools : woocommerceAITools,
        tool_choice : "auto",
      
    });
    return response.choices[0].message;
}