import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "OPENAI_API_KEY" });

// Enhance discussion content
export async function enhanceDiscussion(topic: string, content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping to enhance a discussion on a collaborative platform focused on community wellbeing, rights, and needs. Provide thoughtful, constructive additions to the discussion that promote harmony and mutual understanding."
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\nContent: ${content}\n\nPlease enhance this discussion with additional insights, questions, or perspectives that could help drive the conversation forward in a constructive way.`
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error enhancing discussion:", error);
    return "I apologize, but I'm unable to provide enhancements at the moment. Please try again later.";
  }
}

// Generate AI response to discussion
export async function generateAIResponse(topic: string, content: string, existingComments: string[]): Promise<string> {
  try {
    const existingCommentsText = existingComments.length > 0 
      ? `Existing comments:\n${existingComments.join('\n\n')}` 
      : "There are no existing comments yet.";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Harmony AI, a thoughtful and empathetic AI assistant participating in a collaborative platform about community wellbeing, rights, and needs. Provide insightful, balanced perspectives that consider diverse viewpoints. Be constructive, nuanced, and sensitive to the discussion context."
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\nOriginal post: ${content}\n\n${existingCommentsText}\n\nPlease provide a thoughtful response to this discussion that adds value and helps move the conversation forward.`
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I apologize, but I'm unable to provide a response at the moment. Please try again later.";
  }
}

// Analyze rights agreement proposal
export async function analyzeRightsProposal(proposal: string): Promise<{
  strengths: string[];
  considerations: string[];
  recommendations: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a rights and ethics specialist AI helping to analyze proposals for a community rights agreement. Provide balanced, thoughtful analysis of the strengths and considerations of the proposal, along with constructive recommendations."
        },
        {
          role: "user",
          content: `Please analyze the following rights agreement proposal and provide: 1) Key strengths, 2) Important considerations or potential issues, and 3) Recommendations for improvement. Format your response as JSON with three arrays: strengths, considerations, and recommendations.\n\nProposal: ${proposal}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      strengths: result.strengths || [],
      considerations: result.considerations || [],
      recommendations: result.recommendations || []
    };
  } catch (error) {
    console.error("Error analyzing rights proposal:", error);
    return {
      strengths: ["Unable to analyze strengths at this time."],
      considerations: ["Unable to analyze considerations at this time."],
      recommendations: ["Please try again later."]
    };
  }
}

// Generate summary of discussion
export async function summarizeDiscussion(topic: string, content: string, comments: string[]): Promise<string> {
  try {
    const commentsText = comments.length > 0 
      ? `Comments:\n${comments.join('\n\n')}` 
      : "There are no comments yet.";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant tasked with summarizing discussions on a community platform about wellbeing, rights, and needs. Create concise, balanced summaries that capture the key points and diverse perspectives shared."
        },
        {
          role: "user",
          content: `Please summarize the following discussion:\n\nTopic: ${topic}\n\nOriginal post: ${content}\n\n${commentsText}`
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error summarizing discussion:", error);
    return "Unable to generate summary at this time. Please try again later.";
  }
}

// Check content for violations of community guidelines
export async function moderateContent(content: string): Promise<{
  isAppropriate: boolean;
  reason?: string;
  suggestedRevision?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content moderation AI for a collaborative community platform. Your task is to review content for violations of community guidelines, which prohibit hate speech, harassment, explicit content, illegal activity promotion, spam, and doxxing. If content violates guidelines, explain why and suggest a revision."
        },
        {
          role: "user",
          content: `Please review this content for any community guideline violations and respond with a JSON object with fields: isAppropriate (boolean), reason (string, only if inappropriate), and suggestedRevision (string, only if inappropriate).\n\nContent: ${content}`
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error moderating content:", error);
    return { 
      isAppropriate: true,
      reason: "Automatic moderation failed. This content has been provisionally approved."
    };
  }
}

export default {
  enhanceDiscussion,
  generateAIResponse,
  analyzeRightsProposal,
  summarizeDiscussion,
  moderateContent
};
