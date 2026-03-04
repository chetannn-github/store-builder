import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['user', 'assistant', 'system'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const chatSchema = new mongoose.Schema({
  storeId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    unique: true, 
    index: true   
  },
  messages: [messageSchema]
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);