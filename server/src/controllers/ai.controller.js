import { getOpenAIResponse } from "../config/openai.js";
import { aiActionMap, SUGGESTION_RULES } from "../utils/woocommerceAITools.js";
import { getStoreAudit } from "../services/woocommerceServices.js";
import Store from '../models/store.model.js';
import Chat from '../models/chat.model.js';


export const processAIChat = async (req, res) => {
  const { message, storeId } = req.body;
  
  try {
    const store = await Store.findOne({
        _id: storeId,
        owner: req.user.userId,
    });
        
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const namespace = store.namespace;
    
    // AI se response lo
    const aiMsg = await getOpenAIResponse(message);

    // Default states
    let finalReply = "";
    let structuredReply = null;
    let actionData = null;
    let isToolExecuted = false;
    let executedToolName = null;

    if (aiMsg.tool_calls && aiMsg.tool_calls.length > 0) {
      const toolCall = aiMsg.tool_calls[0];
      const fnName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      const action = aiActionMap[fnName];

      if (action) {
        actionData = await action.execute(namespace, args);
        const reply = action.getReply(actionData, args, store);
        if (typeof reply === "string") {
          finalReply = reply;
        } else {
          finalReply = reply.message;
          structuredReply = reply;
        }

        executedToolName = fnName;
        isToolExecuted = true;
      } else {
        finalReply = "Sorry bhai, ye function abhi main seekh raha hoon.";
      }
    } else {
      finalReply = aiMsg.content || "Done bhai! Batao aur kya karna hai?";
    }

    await Chat.findOneAndUpdate(
      { storeId }, 
      { 
        $push: { 
          messages: { 
            $each: [
              { role: 'user', content: message },
              { role: 'assistant', content: finalReply, meta : structuredReply }
            ]
          } 
        } 
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      reply: finalReply,
      structured: structuredReply,
      data: actionData,
      toolExecuted: isToolExecuted,
      toolName: executedToolName
    });

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ success: false, error: "Bhai, engine thoda garam ho gaya!" });
  }
};


export const getAISuggestedTasks = async (req, res) => {
  const { storeId } = req.params; 

  try {
    const store = await Store.findOne({
      _id: storeId,
      owner: req.user.userId,
    });
        
    if (!store) {
      return res.status(404).json({
      success: false,
      message: "Store not found",
      });
    }

    const namespace = store.namespace;
    const auditResult = await getStoreAudit(namespace);
    let activeSuggestions = [];

    if (auditResult.success && auditResult.audit && auditResult.audit.summary) {
      const summary = auditResult.audit.summary;

      activeSuggestions = SUGGESTION_RULES
        .filter(rule => rule.condition(summary)) 
        .map(rule => rule.data);  
    } else {
      activeSuggestions = [
        { title: "🤖 Check Store Status", prompt: "Mere store ka poora haal-chaal batao." },
        { title: "📦 Manage Products", prompt: "Mere products list karo." }
      ];
    }
    return res.json({
      success: true,
      data: activeSuggestions
    });

  } catch (error) {
    console.error("Suggested Tasks Error:", error.message);
    return res.status(500).json({ success: false, error: "Suggestions fetch nahi ho paye bhai!" });
  }
};



export const getChatHistory = async (req, res) => {
  const { storeId } = req.params;

  try {
    const chatRecord = await Chat.findOne({ storeId });

    if (!chatRecord) {
      return res.json({ 
        success: true, 
        data: [],
        message: "Fresh chat hai bhai!"
      });
    }

    return res.json({
      success: true,
      data: chatRecord.messages
    });

  } catch (error) {
    console.error("Chat History Fetch Error:", error.message);
    return res.status(500).json({ success: false, error: "History load nahi ho payi bhai." });
  }
};