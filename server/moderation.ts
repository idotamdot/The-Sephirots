import OpenAI from "openai";
import { IStorage } from "./storage";
import {
  ModerationFlag,
  InsertModerationFlag,
  ModerationDecision,
  InsertModerationDecision,
  ModerationAppeal,
  InsertModerationAppeal,
  contentTypeEnum,
  moderationStatusEnum,
} from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ContentModerationResult {
  flagged: boolean;
  categories: {
    harassment: boolean;
    hate: boolean;
    selfHarm: boolean;
    sexual: boolean;
    violence: boolean;
  };
  categoryScores: {
    harassment: number;
    hate: number;
    selfHarm: number;
    sexual: number;
    violence: number;
  };
  flagScore: number; // 0-100
  reasoning: string;
}

export class ModerationService {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  /**
   * Uses AI to analyze content for potential moderation issues
   */
  async analyzeContent(content: string): Promise<ContentModerationResult> {
    try {
      // First use OpenAI's built-in moderation endpoint for quick screening
      const moderationResponse = await openai.moderations.create({
        input: content,
      });
      
      const result = moderationResponse.results[0];
      
      // Convert results to our internal format
      const categoryScores = {
        harassment: Math.round(result.category_scores.harassment * 100),
        hate: Math.round(result.category_scores.hate * 100),
        selfHarm: Math.round(result.category_scores["self-harm"] * 100),
        sexual: Math.round(result.category_scores.sexual * 100),
        violence: Math.round(result.category_scores.violence * 100),
      };
      
      // Calculate overall score (simple average for now)
      const flagScore = Math.round(
        Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 
        Object.values(categoryScores).length
      );
      
      // If content is flagged, get an explanation from GPT model
      let reasoning = "";
      if (result.flagged) {
        const aiResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a content moderator assistant. Analyze the following content and explain why it might violate community guidelines. Be specific but concise."
            },
            {
              role: "user",
              content: content
            }
          ],
          max_tokens: 250
        });
        
        reasoning = aiResponse.choices[0].message.content || "Content may violate community guidelines.";
      }

      return {
        flagged: result.flagged,
        categories: {
          harassment: result.categories.harassment,
          hate: result.categories.hate,
          selfHarm: result.categories["self-harm"],
          sexual: result.categories.sexual,
          violence: result.categories.violence,
        },
        categoryScores,
        flagScore,
        reasoning
      };
    } catch (error) {
      console.error("Error analyzing content:", error);
      // Return a safe default that doesn't flag content when the API fails
      return {
        flagged: false,
        categories: {
          harassment: false,
          hate: false,
          selfHarm: false,
          sexual: false,
          violence: false,
        },
        categoryScores: {
          harassment: 0,
          hate: 0,
          selfHarm: 0,
          sexual: 0,
          violence: 0,
        },
        flagScore: 0,
        reasoning: "Error analyzing content."
      };
    }
  }

  /**
   * Auto-moderate content, creating a flag if necessary
   */
  async autoModerateContent(
    contentId: number,
    contentType: string,
    content: string,
    userId: number
  ): Promise<{ 
    flagged: boolean, 
    flag?: ModerationFlag,
    status: string 
  }> {
    try {
      // Analyze the content
      const analysisResult = await this.analyzeContent(content);

      // If the content is flagged by the AI
      if (analysisResult.flagged) {
        // Create a flag
        const insertFlag: InsertModerationFlag = {
          contentId,
          contentType: contentType as any, // Cast to the enum type
          reportedBy: userId, // AI is reporting this
          reason: "Auto-flagged by AI moderation system",
          status: "auto_flagged",
        };

        const flag = await this.storage.createModerationFlag({
          ...insertFlag,
          aiScore: analysisResult.flagScore,
          aiReasoning: analysisResult.reasoning,
        });

        // If the content is severely problematic (high score), auto-reject it
        if (analysisResult.flagScore > 80) {
          const decision: InsertModerationDecision = {
            flagId: flag.id,
            moderatorId: userId, // System user
            decision: "rejected",
            reasoning: `Auto-rejected by AI. Reason: ${analysisResult.reasoning}`,
            aiAssisted: true,
          };

          await this.storage.createModerationDecision(decision);
          return { flagged: true, flag, status: "rejected" };
        }

        // Otherwise just flag it for human review
        return { flagged: true, flag, status: "auto_flagged" };
      }

      return { flagged: false, status: "auto_approved" };
    } catch (error) {
      console.error("Error in auto-moderation:", error);
      return { flagged: false, status: "error" };
    }
  }

  /**
   * Get all flags for human review
   */
  async getPendingFlags(): Promise<ModerationFlag[]> {
    return this.storage.getModerationFlagsByStatus("pending");
  }

  /**
   * Make a moderation decision on a flagged item
   */
  async makeDecision(
    flagId: number,
    moderatorId: number,
    decision: string,
    reasoning: string,
    aiAssisted: boolean
  ): Promise<ModerationDecision> {
    const insertDecision: InsertModerationDecision = {
      flagId,
      moderatorId,
      decision: decision as any, // Cast to enum type
      reasoning,
      aiAssisted,
    };

    const result = await this.storage.createModerationDecision(insertDecision);

    // Update the flag status
    await this.storage.updateModerationFlag(flagId, {
      status: decision as any, // Cast to enum type
    });

    return result;
  }

  /**
   * Submit an appeal for a moderation decision
   */
  async submitAppeal(
    decisionId: number,
    userId: number,
    reason: string
  ): Promise<ModerationAppeal> {
    const insertAppeal: InsertModerationAppeal = {
      decisionId,
      userId,
      reason,
    };

    return this.storage.createModerationAppeal(insertAppeal);
  }

  /**
   * Review an appeal
   */
  async reviewAppeal(
    appealId: number,
    reviewerId: number,
    outcome: string,
    flagId: number
  ): Promise<ModerationAppeal> {
    // Update the appeal
    const updatedAppeal = await this.storage.updateModerationAppeal(appealId, {
      status: outcome as any, // Cast to enum type
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewOutcome: outcome as any, // Cast to enum type
    });

    // Update the original flag
    await this.storage.updateModerationFlag(flagId, {
      status: outcome as any, // Cast to enum type
    });

    return updatedAppeal;
  }

  /**
   * Get AI-assisted analysis to help human moderators make decisions
   */
  async getAIAssistance(flagId: number): Promise<{
    recommendation: string;
    reasoning: string;
    confidence: number;
  }> {
    try {
      // Get the flag
      const flag = await this.storage.getModerationFlag(flagId);
      if (!flag) {
        throw new Error("Flag not found");
      }

      // Get the content based on the content type and ID
      let content = "";
      switch (flag.contentType) {
        case "discussion":
          const discussion = await this.storage.getDiscussion(flag.contentId);
          content = discussion ? `Title: ${discussion.title}\nContent: ${discussion.content}` : "";
          break;
        case "comment":
          const comment = await this.storage.getComment(flag.contentId);
          content = comment ? comment.content : "";
          break;
        case "proposal":
          const proposal = await this.storage.getProposal(flag.contentId);
          content = proposal ? `Title: ${proposal.title}\nDescription: ${proposal.description}` : "";
          break;
        default:
          content = "Content not found";
      }

      // AI analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant helping human moderators review flagged content. 
            The content has been flagged for the following reason: "${flag.reason}".
            AI score: ${flag.aiScore}/100. 
            AI reasoning: "${flag.aiReasoning}".
            
            Analyze the content below and provide:
            1. A recommendation (approve or reject)
            2. Clear reasoning for your recommendation
            3. A confidence score (0-100)
            
            Format your response as JSON with keys: "recommendation", "reasoning", and "confidence".`
          },
          {
            role: "user",
            content: content
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content);

      return {
        recommendation: result.recommendation.toLowerCase(),
        reasoning: result.reasoning,
        confidence: result.confidence,
      };
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      return {
        recommendation: "review",
        reasoning: "Error getting AI assistance. Please review manually.",
        confidence: 0,
      };
    }
  }
}