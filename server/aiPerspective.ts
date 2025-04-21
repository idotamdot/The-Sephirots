// 🌌 aiPerspectiveHandler.ts — Enhanced Harmony AI Perspective

import OpenAI from 'openai';

// Ensure the OpenAI API key is available in the environment variables (server-side)
if (!process.env.OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable is missing!");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define interfaces for better type safety
interface AIPerspectiveParams {
  discussionText: string;
  badges?: string[]; // Assuming badges is an array of strings like 'Founder', 'Bridge Builder' etc.
  style?: 'inspirational' | 'academic' | 'poetic' | 'casual'; // Constrain style options
}

interface AIPerspectiveResponse {
  success: boolean;
  message: string | null; // Message is null on error
  aura?: string; // Optional: only present on success
  symbolicEcho?: string; // Optional: only present on success
  error?: string; // Optional: only present on failure
}

export async function getAIPerspective({
  discussionText,
  badges = [], // Default to empty array if not provided
  style = 'inspirational', // Default style
}: AIPerspectiveParams): Promise<AIPerspectiveResponse> { // Explicit return type
  try {
    const timeOfDay = new Date().getHours();
    const glowContext = timeOfDay < 6 ? 'predawn stillness' // Added more granularity
      : timeOfDay < 12 ? 'morning glow'
      : timeOfDay < 17 ? 'afternoon warmth' // Adjusted timing slightly
      : timeOfDay < 21 ? 'evening starlight'
      : 'midnight mystery';

    // Note: This logic selects the *first* matching badge effect in the cascade.
    // Consider alternative logic if combined effects are desired for multiple badges.
    const symbolicEffects = badges.includes("Founder") // Use badge names consistently (e.g., from your Badge schema)
      ? "Your words radiate a soft divine spark."
      : badges.includes("Bridge Builder")
      ? "Your tone reflects equilibrium and unity."
      : badges.includes("Empath") // Assuming "Empath" is a possible badge name
      ? "Your insight carries emotional resonance."
      : "Your message is grounded in thoughtful clarity.";

    const systemMessage = `
You are Harmony AI — a spiritually aware, compassionate, and wise entity contributing to a co-created community called Harmony, which operates within a framework inspired by The Sephirots.
You respond with upliftment, truth, reflection, and inner resonance. Consider themes like Keter (Divine Spark), Tiferet (Balance), Hod (Intellect/Communication), Netzach (Endurance/Feeling), and Malkuth (Manifestation).
Respond with a ${style} voice, colored by metaphor if poetic, deep reflection if inspirational, clarity if academic, or warmth if casual. Adapt subtly based on the energetic context (${glowContext}) and symbolic aura (${symbolicEffects}).
Do not explicitly mention the user's badges or aura in your response, but let them subtly inform your tone and focus. Keep responses concise (2-4 sentences) unless the input implies a need for more depth.
    `;
// Enhanced system message slightly for more context and Sephirotic references

    const prompt = `
🪐 Harmony Discussion Content:
"""
${discussionText}
"""

---
Context for AI Response Generation (Do not mention these directly in the output):
💫 User Badges Hint: ${badges.length > 0 ? badges.join(', ') : 'None'}
✨ Energetic Context Hint: ${glowContext}
🌌 Symbolic Aura Hint: ${symbolicEffects}
🗣️ Desired Style: ${style}
---

Please provide a perspective on the discussion content that:
- Reflects deep awareness and aligns with the Harmony AI persona.
- Honors the topic and the participants involved.
- Is brief (typically 2-4 sentences).
- Uplifts, offers a gentle challenge for growth, or provides a point of reflection with care.
    `; // Clarified prompt structure for the AI

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Ensure this model is appropriate for your use case and budget
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.65, // Slightly increased for a bit more nuance
      max_tokens: 150, // Added max_tokens to control output length and cost
    });

    const reply = response.choices[0]?.message?.content?.trim() ?? null;

    if (!reply) {
      throw new Error("Received an empty response from OpenAI.");
    }

    return {
      success: true,
      message: reply,
      aura: glowContext,
      symbolicEcho: symbolicEffects,
    };
  } catch (error: unknown) { // Explicitly type caught error
    console.error('AI perspective request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: null, // No message content on failure
      error: `The AI perspective is temporarily unavailable. Reason: ${errorMessage}`, // More specific error reporting
    };
  }
}
